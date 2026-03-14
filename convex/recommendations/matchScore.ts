/**
 * S5: Personalized Dashboard – Match score computation
 * Computes how well a product matches user preferences. Stub for real model.
 */

import { action, query } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

export const getUserPreferenceProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userPreferenceProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getRecommendations = query({
  args: { userId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 5;
    const products = await ctx.db
      .query("novaProducts")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(20);
    return products.slice(0, limit).map((p) => ({
      productName: p.productName,
      matchScore: 70 + Math.floor(Math.random() * 25),
    }));
  },
});

export const computeMatchScore = action({
  args: {
    userId: v.string(),
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    const [profile, product] = await Promise.all([
      ctx.runQuery(api["community/leaderboard"].getContributorLeaderboard, {
        limit: 1,
      }).then(() => null),
      ctx.runQuery(api.products.get, { id: args.productId }),
    ]);

    const prefs = await ctx.runQuery(
      // Use internal if we have userPreferenceProfiles query
      api["tco/personalizedTco"].getPersonalizedTco as any,
      { productId: args.productId }
    ).catch(() => null);

    if (!product) return 0;

    // Stub: real logic uses userPreferenceProfiles + product attributes
    let score = 70;
    if (product.category) score += 5;
    if (product.price && product.price < 500) score += 5;
    return Math.min(100, score);
  },
});
