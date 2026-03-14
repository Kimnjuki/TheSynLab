/**
 * Internal handlers for cron jobs (Competitive Blueprint).
 * Stub implementations – wire to real ML/API services when available.
 */

import { internalMutation } from "./_generated/server";

/** Weekly: refresh ML predictions for products. */
export const refreshAllMlPredictions = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Stub: in production, iterate products and call ML service.
    // For now, no-op to satisfy cron.
    return { ok: true, message: "refreshAllMlPredictions stub" };
  },
});

/** Every 6 hours: refresh affiliate link prices. */
export const refreshAffiliatePrices = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Stub: in production, fetch prices from affiliate APIs.
    return { ok: true, message: "refreshAffiliatePrices stub" };
  },
});

/** Hourly: process translation queue for reviews. */
export const processTranslationQueue = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Stub: in production, pick pending reviews and call translateReviewToLocales.
    return { ok: true, message: "processTranslationQueue stub" };
  },
});
