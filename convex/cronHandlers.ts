/**
 * Internal handlers for cron jobs (Competitive Blueprint).
 * Uses internalAction for HTTP/fetch. Wired to ML, affiliate, translation services.
 */

import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { api } from "./_generated/api";
import { v } from "convex/values";

/** Internal: get published product IDs for ML cron. */
export const getPublishedProductIds = internalQuery({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("novaProducts")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(500);
    return products.map((p) => p._id);
  },
});

/** Internal: get approved reviews for translation queue. */
export const getApprovedReviewsForTranslation = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("productReviews").take(1000);
    const approved = all.filter((r) => r.isApproved === true);
    return approved.slice(0, args.limit ?? 20);
  },
});

/** Weekly: refresh ML predictions for all published products. */
export const refreshAllMlPredictions = internalAction({
  args: {},
  handler: async (ctx) => {
    const productIds = await ctx.runQuery(internal.cronHandlers.getPublishedProductIds, {});
    let ok = 0;
    let err = 0;
    for (const id of productIds) {
      try {
        await ctx.runAction(api["ml/predictReliability"].runMlPredictionForProduct, {
          productId: id,
        });
        ok++;
      } catch {
        err++;
      }
    }
    return { ok, err, total: productIds.length };
  },
});

/** Every 6 hours: refresh affiliate link prices (mock or API). */
export const refreshAffiliatePrices = internalAction({
  args: {},
  handler: async (ctx) => {
    const result = await ctx.runAction(api.affiliatePrices.refreshAllPrices, {});
    return result;
  },
});

/** Hourly: process translation queue for approved reviews. */
export const processTranslationQueue = internalAction({
  args: {},
  handler: async (ctx) => {
    const reviews = await ctx.runQuery(internal.cronHandlers.getApprovedReviewsForTranslation, {
      limit: 10,
    });
    const defaultLocales = ["fr", "de", "es", "pt"];
    let created = 0;
    for (const r of reviews) {
      try {
        const res = await ctx.runAction(api["i18n/translateReview"].translateReviewToLocales, {
          reviewId: r._id,
          targetLocales: defaultLocales,
        });
        created += res.created?.length ?? 0;
      } catch {
        // skip failed
      }
    }
    return { processed: reviews.length, translationsCreated: created };
  },
});
