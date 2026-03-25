import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List posts with optional filters
export const list = query({
  args: {
    hub: v.optional(v.string()),
    postType: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("novaPosts").collect();

    if (args.hub) {
      posts = posts.filter((p) => p.hub === args.hub);
    }
    if (args.postType) {
      posts = posts.filter((p) => p.postType === args.postType);
    }
    if (args.status) {
      posts = posts.filter((p) => p.postStatus === args.status);
    }

    return posts;
  },
});

// Get a single post by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("novaPosts")
      .withIndex("by_slug", (q) => q.eq("postSlug", args.slug))
      .first();
  },
});

// Get a single post by ID
export const get = query({
  args: { id: v.id("novaPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a post (no auth required for Git Bash deployment)
export const create = mutation({
  args: {
    postTitle: v.string(),
    postSlug: v.string(),
    postContent: v.string(),
    postExcerpt: v.optional(v.string()),
    postType: v.string(),
    hub: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    videoUrl: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...postData } = args;
    const wordCount = args.postContent.split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200);

    return await ctx.db.insert("novaPosts", {
      ...postData,
      authorId: userId || "system_admin",
      postStatus: "pending",
      viewCount: 0,
      uniqueViewCount: 0,
      wordCount,
      readingTimeMinutes,
    });
  },
});

// Update a post
export const update = mutation({
  args: {
    id: v.id("novaPosts"),
    postTitle: v.optional(v.string()),
    postContent: v.optional(v.string()),
    postExcerpt: v.optional(v.string()),
    postStatus: v.optional(v.string()),
    hub: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, userId, ...updates } = args;
    const post = await ctx.db.get(id);
    if (!post) throw new Error("Post not found");

    if (updates.postContent) {
      const wordCount = updates.postContent.split(/\s+/).length;
      (updates as any).wordCount = wordCount;
      (updates as any).readingTimeMinutes = Math.ceil(wordCount / 200);
    }

    await ctx.db.patch(id, {
      ...updates,
      lastModifiedBy: userId || "system_admin",
    });

    return id;
  },
});

// Delete a post
export const remove = mutation({
  args: { id: v.id("novaPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");
    await ctx.db.delete(args.id);
  },
});

// Increment view count
export const incrementView = mutation({
  args: { id: v.id("novaPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");

    await ctx.db.patch(args.id, {
      viewCount: post.viewCount + 1,
      lastViewedAt: Date.now(),
    });
  },
});

// Publish a post
export const publish = mutation({
  args: { id: v.id("novaPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("Post not found");

    await ctx.db.patch(args.id, {
      postStatus: "published",
      publishedAt: Date.now(),
    });
  },
});

export const bulkUpdateYearModifiers = mutation({
  args: {
    fromYear: v.string(),
    toYear: v.string(),
    minViews: v.optional(v.number()),
    postType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const minViews = args.minViews ?? 1000;
    const type = args.postType ?? "guide";
    const posts = await ctx.db.query("novaPosts").collect();
    const candidates = posts.filter(
      (p) =>
        p.postType === type &&
        (p.viewCount ?? 0) >= minViews &&
        (p.postTitle?.includes(args.fromYear) || p.seoTitle?.includes(args.fromYear))
    );
    for (const p of candidates) {
      await ctx.db.patch(p._id, {
        postTitle: p.postTitle?.replaceAll(args.fromYear, args.toYear) ?? p.postTitle,
        seoTitle: p.seoTitle?.replaceAll(args.fromYear, args.toYear) ?? p.seoTitle,
      });
    }
    return { updated: candidates.length };
  },
});
