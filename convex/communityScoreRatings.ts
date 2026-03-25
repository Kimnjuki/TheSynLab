import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAggregateProductScore = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("communityScoreRatings")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    if (!ratings.length) {
      return {
        sampleSize: 0,
        usersChoiceTrust: 0,
        usersChoiceIntegration: 0,
        labChoiceTrust: 0,
        labChoiceIntegration: 0,
      };
    }

    const usersChoiceTrust =
      ratings.reduce((sum, r) => sum + r.trustRating, 0) / ratings.length;
    const usersChoiceIntegration =
      ratings.reduce((sum, r) => sum + r.integrationRating, 0) / ratings.length;

    const trust = await ctx.db
      .query("novaTrustScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();
    const integration = await ctx.db
      .query("novaIntegrationScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();

    return {
      sampleSize: ratings.length,
      usersChoiceTrust: Number(usersChoiceTrust.toFixed(2)),
      usersChoiceIntegration: Number(usersChoiceIntegration.toFixed(2)),
      labChoiceTrust: trust?.totalScore ?? 0,
      labChoiceIntegration: integration?.totalScore ?? 0,
    };
  },
});
