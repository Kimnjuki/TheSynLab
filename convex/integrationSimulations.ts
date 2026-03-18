/**
 * S4: Integration simulations – save and retrieve simulation results.
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    userId: v.optional(v.string()),
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    simulationConfig: v.any(),
    resultScore: v.number(),
    resultDetails: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("integrationSimulations", {
      userId: args.userId,
      productAId: args.productAId,
      productBId: args.productBId,
      simulationConfig: args.simulationConfig,
      resultScore: args.resultScore,
      resultDetails: args.resultDetails,
      status: "completed",
      runAt: Date.now(),
      completedAt: Date.now(),
    });
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("integrationSimulations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(20);
  },
});

export const listByProducts = query({
  args: {
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("integrationSimulations")
      .withIndex("by_products", (q) =>
        q.eq("productAId", args.productAId).eq("productBId", args.productBId)
      )
      .order("desc")
      .take(5);
  },
});
