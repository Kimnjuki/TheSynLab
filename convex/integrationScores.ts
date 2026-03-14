/**
 * S1: AI-Powered Predictive Scores
 * Updates ML prediction fields on novaIntegrationScores.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateMlPrediction = mutation({
  args: {
    productId: v.id("novaProducts"),
    mlPredictedScore: v.number(),
    mlConfidence: v.number(),
    predictionModel: v.string(),
    predictionFeatures: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db
      .query("novaIntegrationScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();

    if (!current) {
      throw new Error("No current integration score found for product");
    }

    await ctx.db.patch(current._id, {
      mlPredictedScore: args.mlPredictedScore,
      mlConfidence: args.mlConfidence,
      predictionModel: args.predictionModel,
      predictionFeatures: args.predictionFeatures,
      lastPredictedAt: Date.now(),
    });

    return current._id;
  },
});
