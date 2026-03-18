/**
 * S10: ROI calculations – save user ROI estimates.
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    userId: v.optional(v.string()),
    productId: v.id("novaProducts"),
    teamSize: v.optional(v.number()),
    currentToolCost: v.optional(v.number()),
    estimatedTimeSavingHours: v.optional(v.number()),
    hourlyRate: v.optional(v.number()),
    calculatedRoi: v.number(),
    paybackPeriodMonths: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("roiCalculations", {
      userId: args.userId,
      productId: args.productId,
      teamSize: args.teamSize,
      currentToolCost: args.currentToolCost,
      estimatedTimeSavingHours: args.estimatedTimeSavingHours,
      hourlyRate: args.hourlyRate,
      calculatedRoi: args.calculatedRoi,
      paybackPeriodMonths: args.paybackPeriodMonths,
      calculatedAt: Date.now(),
    });
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roiCalculations")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(10);
  },
});

export const listByProduct = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("roiCalculations")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .take(10);
  },
});
