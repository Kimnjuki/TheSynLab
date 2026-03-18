import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTrustScore = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("novaTrustScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();
  },
});

export const getIntegrationScore = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("novaIntegrationScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();
  },
});

export const getTrustScoreHistory = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("novaTrustScores")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("asc")
      .collect();
  },
});

export const getIntegrationScoreHistory = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("novaIntegrationScores")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("asc")
      .collect();
  },
});

export const getTco = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("productTcoScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();
  },
});

export const getLocaleAdjustment = query({
  args: { productId: v.id("novaProducts"), locale: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("scoreLocaleAdjustments")
      .withIndex("by_product_locale", (q) =>
        q.eq("productId", args.productId).eq("locale", args.locale)
      )
      .first();
  },
});

export const getAggregated = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("productReviews")
      .withIndex("by_product_approved", (q) =>
        q.eq("productId", args.productId).eq("isApproved", true)
      )
      .collect();
    if (reviews.length === 0) return null;
    const avgRating =
      reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    const verifiedCount = reviews.filter((r) => r.verifiedPurchase).length;
    const allPros = reviews.flatMap((r) => r.pros ?? []);
    const allCons = reviews.flatMap((r) => r.cons ?? []);
    return {
      avgRating: Math.round(avgRating * 10) / 10,
      count: reviews.length,
      verifiedCount,
      topPros: allPros.slice(0, 5),
      topCons: allCons.slice(0, 5),
    };
  },
});
