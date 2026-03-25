import { query } from "./_generated/server";
import { v } from "convex/values";

export const getProductSchemaData = query({
  args: {
    productId: v.id("novaProducts"),
    authorUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    const trust = await ctx.db
      .query("novaTrustScores")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();

    const authorProfile =
      args.authorUserId != null
        ? await ctx.db
            .query("authorProfiles")
            .withIndex("by_user", (q) => q.eq("userId", args.authorUserId!))
            .first()
        : null;

    return {
      product: {
        _id: product._id,
        productName: product.productName,
        productSlug: product.productSlug,
        description: product.description,
        featuredImageUrl: product.featuredImageUrl,
        overallScore: product.overallScore,
      },
      trustScore: trust?.totalScore ?? null,
      authorDisplayName: authorProfile?.displayName ?? "TheSynLab Editorial",
    };
  },
});

