/**
 * S9: Review translations – store AI-translated content per locale.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    reviewId: v.id("productReviews"),
    locale: v.string(),
    translatedTitle: v.string(),
    translatedContent: v.string(),
    translatedPros: v.optional(v.array(v.string())),
    translatedCons: v.optional(v.array(v.string())),
    translationModel: v.string(),
    culturalAdjustments: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("reviewTranslations")
      .withIndex("by_review_locale", (q) =>
        q.eq("reviewId", args.reviewId).eq("locale", args.locale)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        translatedTitle: args.translatedTitle,
        translatedContent: args.translatedContent,
        translatedPros: args.translatedPros,
        translatedCons: args.translatedCons,
        translationModel: args.translationModel,
        translatedAt: Date.now(),
        culturalAdjustments: args.culturalAdjustments,
      });
      return existing._id;
    }

    return await ctx.db.insert("reviewTranslations", {
      reviewId: args.reviewId,
      locale: args.locale,
      translatedTitle: args.translatedTitle,
      translatedContent: args.translatedContent,
      translatedPros: args.translatedPros,
      translatedCons: args.translatedCons,
      translationModel: args.translationModel,
      translatedAt: Date.now(),
      culturalAdjustments: args.culturalAdjustments,
    });
  },
});
