import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ CATEGORIES ============
export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("forumCategories")
      .withIndex("by_order")
      .collect();
  },
});

export const getCategoryBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forumCategories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const createCategory = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("forumCategories", {
      ...args,
      threadCount: 0,
      postCount: 0,
      isLocked: false,
    });
  },
});

// ============ THREADS ============
export const listThreads = query({
  args: {
    categoryId: v.optional(v.id("forumCategories")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let threads;
    if (args.categoryId) {
      threads = await ctx.db
        .query("forumThreads")
        .withIndex("by_category", (idx) => idx.eq("categoryId", args.categoryId!))
        .order("desc")
        .take(args.limit || 50);
    } else {
      threads = await ctx.db
        .query("forumThreads")
        .order("desc")
        .take(args.limit || 50);
    }
    
    // Attach category info
    const threadsWithCategory = await Promise.all(
      threads.map(async (thread) => {
        const category = await ctx.db.get(thread.categoryId);
        return { ...thread, category };
      })
    );

    return threadsWithCategory;
  },
});

export const getThreadBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const thread = await ctx.db
      .query("forumThreads")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!thread) return null;

    const category = await ctx.db.get(thread.categoryId);
    const replies = await ctx.db
      .query("forumReplies")
      .withIndex("by_thread", (q) => q.eq("threadId", thread._id))
      .collect();

    return { ...thread, category, replies };
  },
});

export const createThread = mutation({
  args: {
    categoryId: v.id("forumCategories"),
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const threadId = await ctx.db.insert("forumThreads", {
      ...args,
      isPinned: false,
      isLocked: false,
      isSolved: false,
      viewCount: 0,
      replyCount: 0,
      likeCount: 0,
    });

    // Update category counts
    const category = await ctx.db.get(args.categoryId);
    if (category) {
      await ctx.db.patch(args.categoryId, {
        threadCount: category.threadCount + 1,
        lastActivityAt: Date.now(),
      });
    }

    return threadId;
  },
});

export const incrementThreadView = mutation({
  args: { threadId: v.id("forumThreads") },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (thread) {
      await ctx.db.patch(args.threadId, {
        viewCount: thread.viewCount + 1,
      });
    }
  },
});

export const toggleThreadLike = mutation({
  args: {
    threadId: v.id("forumThreads"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("forumThreadLikes")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    const thread = await ctx.db.get(args.threadId);
    if (!thread) return;

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.threadId, { likeCount: Math.max(0, thread.likeCount - 1) });
    } else {
      await ctx.db.insert("forumThreadLikes", {
        threadId: args.threadId,
        userId: args.userId,
      });
      await ctx.db.patch(args.threadId, { likeCount: thread.likeCount + 1 });
    }
  },
});

export const markThreadSolved = mutation({
  args: { threadId: v.id("forumThreads") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, { isSolved: true });
  },
});

// ============ REPLIES ============
export const createReply = mutation({
  args: {
    threadId: v.id("forumThreads"),
    content: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    authorAvatar: v.optional(v.string()),
    parentReplyId: v.optional(v.id("forumReplies")),
  },
  handler: async (ctx, args) => {
    const replyId = await ctx.db.insert("forumReplies", {
      ...args,
      isEdited: false,
      isSolution: false,
      likeCount: 0,
      likes: [],
    });

    // Update thread
    const thread = await ctx.db.get(args.threadId);
    if (thread) {
      await ctx.db.patch(args.threadId, {
        replyCount: thread.replyCount + 1,
        lastReplyAt: Date.now(),
        lastReplyBy: args.authorName,
      });

      // Update category
      const category = await ctx.db.get(thread.categoryId);
      if (category) {
        await ctx.db.patch(thread.categoryId, {
          postCount: category.postCount + 1,
          lastActivityAt: Date.now(),
        });
      }
    }

    return replyId;
  },
});

export const markReplyAsSolution = mutation({
  args: {
    replyId: v.id("forumReplies"),
    threadId: v.id("forumThreads"),
  },
  handler: async (ctx, args) => {
    // Unmark all other solutions
    const replies = await ctx.db
      .query("forumReplies")
      .withIndex("by_thread", (q) => q.eq("threadId", args.threadId))
      .collect();

    for (const reply of replies) {
      if (reply.isSolution) {
        await ctx.db.patch(reply._id, { isSolution: false });
      }
    }

    await ctx.db.patch(args.replyId, { isSolution: true });
    await ctx.db.patch(args.threadId, { isSolved: true });
  },
});

export const likeReply = mutation({
  args: {
    replyId: v.id("forumReplies"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const reply = await ctx.db.get(args.replyId);
    if (!reply) return;

    const likes = (reply.likes as string[]) || [];
    if (likes.includes(args.userId)) {
      await ctx.db.patch(args.replyId, {
        likes: likes.filter((id) => id !== args.userId),
        likeCount: Math.max(0, reply.likeCount - 1),
      });
    } else {
      await ctx.db.patch(args.replyId, {
        likes: [...likes, args.userId],
        likeCount: reply.likeCount + 1,
      });
    }
  },
});

// ============ SEARCH ============
export const searchThreads = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const allThreads = await ctx.db.query("forumThreads").collect();
    const q = args.query.toLowerCase();
    return allThreads
      .filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.content.toLowerCase().includes(q) ||
          (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
      )
      .slice(0, 20);
  },
});

// ============ STATS ============
export const getForumStats = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("forumCategories").collect();
    const threads = await ctx.db.query("forumThreads").collect();
    const replies = await ctx.db.query("forumReplies").collect();

    const uniqueAuthors = new Set([
      ...threads.map((t) => t.authorId),
      ...replies.map((r) => r.authorId),
    ]);

    return {
      totalCategories: categories.length,
      totalThreads: threads.length,
      totalReplies: replies.length,
      totalMembers: uniqueAuthors.size,
      solvedThreads: threads.filter((t) => t.isSolved).length,
    };
  },
});

// ============ SEED ============
export const seedForum = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("forumCategories").first();
    if (existing) return "Forum already seeded";

    const categories = [
      { name: "Smart Home Setup", slug: "smart-home-setup", description: "Discuss smart home devices, ecosystems, and configurations", icon: "Home", color: "215 85% 25%", sortOrder: 1 },
      { name: "Product Reviews", slug: "product-reviews", description: "Share and read community product reviews and experiences", icon: "Star", color: "35 95% 55%", sortOrder: 2 },
      { name: "Troubleshooting", slug: "troubleshooting", description: "Get help with device issues, integrations, and bugs", icon: "Wrench", color: "0 84% 60%", sortOrder: 3 },
      { name: "Automations & Workflows", slug: "automations-workflows", description: "Share automation recipes, IFTTT/Home Assistant configs", icon: "Zap", color: "145 65% 45%", sortOrder: 4 },
      { name: "Deals & Recommendations", slug: "deals-recommendations", description: "Best deals, product recommendations, and buying advice", icon: "Tag", color: "185 70% 45%", sortOrder: 5 },
      { name: "General Discussion", slug: "general-discussion", description: "Off-topic chat, introductions, and community news", icon: "MessageSquare", color: "215 15% 45%", sortOrder: 6 },
    ];

    const catIds: any[] = [];
    for (const cat of categories) {
      const id = await ctx.db.insert("forumCategories", { ...cat, threadCount: 0, postCount: 0, isLocked: false });
      catIds.push(id);
    }

    // Seed threads
    const threads = [
      { categoryId: catIds[0], title: "Best Matter-compatible devices for 2026?", slug: "best-matter-compatible-devices-2026", content: "I'm looking to build a fully Matter-compatible smart home. What devices have you found that work reliably? I've been eyeing the Eve lineup but curious about alternatives.\n\nSpecifically interested in:\n- Smart plugs\n- Light bulbs\n- Door sensors\n- Thermostats\n\nBudget is around $500 for the full setup.", authorId: "user_nova_1", authorName: "TechExplorer", tags: ["matter", "smart-home", "2026"] },
      { categoryId: catIds[0], title: "Home Assistant vs Apple HomeKit - which ecosystem in 2026?", slug: "home-assistant-vs-apple-homekit-2026", content: "I've been running HomeKit for 3 years but thinking about switching to Home Assistant. The flexibility seems amazing but I'm worried about reliability.\n\nAnyone who's made the switch - was it worth it? What's your experience been like?", authorId: "user_nova_2", authorName: "SmartHomePro", tags: ["home-assistant", "homekit", "ecosystem"] },
      { categoryId: catIds[1], title: "Aqara G4 Video Doorbell - 6 month review", slug: "aqara-g4-doorbell-6-month-review", content: "After 6 months with the Aqara G4, here's my detailed review:\n\n**Pros:**\n- Excellent video quality (1080p, wide angle)\n- Works with HomeKit, Google Home, and Alexa\n- Local storage via SD card\n- Reasonable price at $120\n\n**Cons:**\n- Night vision could be better\n- App can be slow sometimes\n- Requires Aqara hub\n\nOverall rating: 4/5. Would recommend for the price point.", authorId: "user_nova_3", authorName: "GadgetGuru", tags: ["review", "doorbell", "aqara"] },
      { categoryId: catIds[2], title: "Zigbee devices dropping off network randomly", slug: "zigbee-devices-dropping-off-network", content: "I'm having an issue where my Zigbee devices randomly drop off the network. Running a Sonoff Zigbee coordinator with about 30 devices.\n\nThings I've tried:\n- Moving the coordinator\n- Changing Zigbee channel\n- Adding more router devices\n\nStill happening 2-3 times a week. Any ideas?", authorId: "user_nova_4", authorName: "ZigbeeNewbie", tags: ["zigbee", "troubleshooting", "connectivity"] },
      { categoryId: catIds[3], title: "My favorite automation: Smart morning routine", slug: "smart-morning-routine-automation", content: "Here's my morning routine automation that I've been perfecting for months:\n\n1. **6:30 AM** - Bedroom lights slowly fade on (warm white, 10% → 70% over 15 min)\n2. **6:45 AM** - Coffee maker starts\n3. **6:50 AM** - Bathroom heater turns on\n4. **7:00 AM** - News briefing plays on kitchen speaker\n5. **7:15 AM** - Garage opens when I grab my keys\n\nAll running on Home Assistant with Node-RED. Happy to share the config!", authorId: "user_nova_5", authorName: "AutomationKing", tags: ["automation", "morning-routine", "home-assistant"] },
      { categoryId: catIds[4], title: "Amazon Prime Day 2026 - Smart Home Deals Thread", slug: "amazon-prime-day-2026-smart-home-deals", content: "Let's collect all the best smart home deals for Prime Day 2026!\n\nI'll keep updating this post with confirmed deals:\n\n🔥 **Echo Show 15** - $149 (was $249)\n🔥 **Ring Video Doorbell Pro 2** - $179 (was $259)\n🔥 **Philips Hue Starter Kit** - $99 (was $199)\n\nDrop your finds below!", authorId: "user_nova_1", authorName: "TechExplorer", tags: ["deals", "prime-day", "2026"] },
    ];

    for (const thread of threads) {
      const threadId = await ctx.db.insert("forumThreads", {
        ...thread,
        isPinned: false,
        isLocked: false,
        isSolved: false,
        viewCount: Math.floor(Math.random() * 500) + 50,
        replyCount: 0,
        likeCount: Math.floor(Math.random() * 30) + 5,
        lastReplyAt: Date.now() - Math.floor(Math.random() * 86400000 * 7),
      });

      // Update category thread count
      const cat = await ctx.db.get(thread.categoryId) as any;
      if (cat) {
        await ctx.db.patch(thread.categoryId, {
          threadCount: (cat.threadCount || 0) + 1,
          lastActivityAt: Date.now(),
        });
      }

      // Add some replies
      const replyData = [
        { content: "Great question! I've been using the Eve Energy plugs and they've been rock solid with Matter. Highly recommend.", authorId: "user_nova_6", authorName: "PlugMaster" },
        { content: "The Nanoleaf Essentials bulbs work great with Matter too. Just make sure your hub firmware is up to date.", authorId: "user_nova_7", authorName: "LightFanatic" },
      ];

      for (const reply of replyData) {
        await ctx.db.insert("forumReplies", {
          threadId,
          ...reply,
          isEdited: false,
          isSolution: false,
          likeCount: Math.floor(Math.random() * 10),
          likes: [],
        });

        const updatedThread = await ctx.db.get(threadId);
        if (updatedThread) {
          await ctx.db.patch(threadId, {
            replyCount: updatedThread.replyCount + 1,
            lastReplyAt: Date.now(),
            lastReplyBy: reply.authorName,
          });
        }
      }
    }

    return "Forum seeded successfully";
  },
});
