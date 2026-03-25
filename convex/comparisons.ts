import { query } from "./_generated/server";
import { v } from "convex/values";

export const getComparisonArticle = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const article = await ctx.db
      .query("comparisonArticles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!article) return null;

    const productA = await ctx.db.get(article.productAId);
    const productB = await ctx.db.get(article.productBId);
    const verdictProduct = await ctx.db.get(article.verdictProductId);

    return {
      ...article,
      productA,
      productB,
      verdictProduct,
    };
  },
});
