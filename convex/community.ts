import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submitCommunityRating = mutation({
  args: {
    productId: v.id("novaProducts"),
    trustDimension: v.string(),
    integrationDimension: v.string(),
    trustRating: v.float64(),
    integrationRating: v.float64(),
    evidence: v.optional(v.string()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("communityScoreRatings", {
      ...args,
      isVerifiedUser: true,
      ratedAt: Date.now(),
    });
  },
});

export const getCommunityScoreForProduct = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const ratings = await ctx.db
      .query("communityScoreRatings")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    if (!ratings.length) return { sampleSize: 0, trustAvg: 0, integrationAvg: 0 };
    const trustAvg = ratings.reduce((sum, r) => sum + r.trustRating, 0) / ratings.length;
    const integrationAvg = ratings.reduce((sum, r) => sum + r.integrationRating, 0) / ratings.length;
    return { sampleSize: ratings.length, trustAvg, integrationAvg };
  },
});

export const getTopContributors = query({
  args: {},
  handler: async (ctx) => {
    const ratings = await ctx.db.query("communityScoreRatings").collect();
    const map = new Map<string, number>();
    ratings.forEach((r) => map.set(r.userId, (map.get(r.userId) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([userId, contributionCount]) => ({ userId, contributionCount }))
      .sort((a, b) => b.contributionCount - a.contributionCount)
      .slice(0, 20);
  },
});

export const getFellowProfile = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("synlabFellows")
      .withIndex("by_slug", (q) => q.eq("fellowSlug", args.slug))
      .first();
  },
});
