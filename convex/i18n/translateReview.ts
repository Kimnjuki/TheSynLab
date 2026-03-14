import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

/**
 * S9: Review translation – stub; would call external translation API.
 */
export const translateReviewToLocales = action({
  args: {
    reviewId: v.id("productReviews"),
    targetLocales: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const review = await ctx.runQuery(api.reviews.getUserReview, {
      productId: "placeholder" as any,
      userId: undefined,
    });
    // Stub: external Claude/FastAPI translation service not wired
    const created: string[] = [];
    for (const locale of args.targetLocales) {
      await ctx.runMutation(api.reviews.update, {
        id: args.reviewId,
        reviewTitle: undefined,
        reviewContent: undefined,
      } as any);
      created.push(locale);
    }
    return { created };
  },
});
