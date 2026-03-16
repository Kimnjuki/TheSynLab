import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

/**
 * S9: Review translation – stub; would call external Claude/translation API.
 */
export const translateReviewToLocales = action({
  args: {
    reviewId: v.id("productReviews"),
    targetLocales: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const review = await ctx.runQuery(api.reviews.get, { id: args.reviewId });
    if (!review) return { created: [], error: "Review not found" };

    // Stub: external Claude/FastAPI translation service not wired.
    // In production: call translation API, then ctx.runMutation to insert reviewTranslations.
    const created: string[] = [];
    for (const locale of args.targetLocales) {
      created.push(locale);
    }
    return { created };
  },
});
