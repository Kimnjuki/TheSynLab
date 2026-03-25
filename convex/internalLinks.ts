import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addInternalLink = mutation({
  args: {
    sourcePostId: v.id("novaPosts"),
    targetPostId: v.id("novaPosts"),
    anchorText: v.string(),
    linkType: v.string(),
    hubSlug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("internalLinks", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getLinksForPost = query({
  args: { postId: v.id("novaPosts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("internalLinks")
      .withIndex("by_source", (q) => q.eq("sourcePostId", args.postId))
      .collect();
  },
});

export const getOrphanedPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("novaPosts").collect();
    const orphaned = [];
    for (const post of posts) {
      const links = await ctx.db
        .query("internalLinks")
        .withIndex("by_source", (q) => q.eq("sourcePostId", post._id))
        .collect();
      if (links.length < 2) {
        orphaned.push({ post, linkCount: links.length });
      }
    }
    return orphaned;
  },
});
