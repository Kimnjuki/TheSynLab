import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const calculateDelta = mutation({
  args: {
    productId: v.id("novaProducts"),
    industryAverage: v.number(),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db
      .query("novaTrustScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();

    if (!current) {
      return {
        delta: null,
        badge: "no_score",
      };
    }

    const delta = current.totalScore - args.industryAverage;
    let badge = "average";
    if (delta >= 1) badge = "above_average";
    if (delta <= -1) badge = "below_average";

    return {
      productId: args.productId,
      trustScore: current.totalScore,
      industryAverage: args.industryAverage,
      delta: Number(delta.toFixed(2)),
      badge,
    };
  },
});
