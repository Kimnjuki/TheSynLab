/**
 * S1: Feature extraction for ML predictions
 * Extracts product features from novaProducts, reviews, scores, clicks.
 * Used by predictReliability action. ML_API_URL env: external model; else heuristic.
 */

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

export const extractProductFeatures = action({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const product = await ctx.runQuery(api.products.get, {
      id: args.productId,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const reviews = await ctx.runQuery(api.reviews.listByProduct, {
      productId: args.productId,
    });
    const approved = (reviews ?? []).filter((r: { isApproved?: boolean }) => r.isApproved !== false);
    const avgRating =
      approved.length > 0
        ? approved.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / approved.length
        : 0;

    const scores = await ctx.runQuery(api.products.getScores, {
      productId: args.productId,
    });

    const features = {
      avgRating,
      reviewCount: approved.length,
      integrationScore: scores?.integrationScore ?? 5,
      trustScore: scores?.trustScore ?? 5,
      conversionRate: 0.02,
      pricePoint: Math.min(10, (product.price ?? 0) / 100),
      categoryEncoded: ["ai_workflow", "intelligent_home", "hybrid_office"].indexOf(product.hub ?? "") + 1 || 0,
      ageInDays: product.releaseDate
        ? (Date.now() - product.releaseDate) / (24 * 60 * 60 * 1000)
        : 365,
      hub: product.hub || "",
      productType: product.productType || "",
      featureCount: Array.isArray(product.features) ? product.features.length : 0,
      specKeys: product.specifications ? Object.keys(product.specifications as object).length : 0,
    };

    return features;
  },
});
