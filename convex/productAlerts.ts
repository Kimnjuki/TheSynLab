import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insert = mutation({
  args: {
    userId: v.string(),
    productId: v.id("novaProducts"),
    alertType: v.optional(v.string()),
    threshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("productAlerts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .filter((q) => q.eq(q.field("alertType"), args.alertType ?? "changelog"))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("productAlerts", {
      userId: args.userId,
      productId: args.productId,
      alertType: args.alertType ?? "changelog",
      threshold: args.threshold,
      isActive: true,
      lastTriggeredAt: undefined,
    });
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    await ctx.db
      .query("productAlerts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect(),
});
