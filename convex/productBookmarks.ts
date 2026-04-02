import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insert = mutation({
  args: {
    userId: v.string(),
    productId: v.id("novaProducts"),
    listName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("productBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("productBookmarks", {
      userId: args.userId,
      productId: args.productId,
      listName: args.listName ?? "default",
      addedAt: Date.now(),
    });
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    await ctx.db
      .query("productBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect(),
});
