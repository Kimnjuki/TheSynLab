import { query } from "./_generated/server";
import { v } from "convex/values";

function computedOverallScore(product: any) {
  if (typeof product.overallScore === "number") return product.overallScore;
  const trust = product.nova_trust_scores?.[0]?.total_score ?? 0;
  const integ = product.nova_integration_scores?.[0]?.total_score ?? 0;
  if (trust || integ) return (trust + integ) / 2;
  return 0;
}

export const getTopProductsForHub = query({
  args: { hubSlug: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const products = await ctx.db
      .query("novaProducts")
      .withIndex("by_hub", (q) => q.eq("hub", args.hubSlug))
      .collect();

    const productsWithScores = await Promise.all(
      products.map(async (product) => {
        const trustScore = await ctx.db
          .query("novaTrustScores")
          .withIndex("by_current", (q) =>
            q.eq("productId", product._id).eq("isCurrent", true)
          )
          .first();
        const integrationScore = await ctx.db
          .query("novaIntegrationScores")
          .withIndex("by_current", (q) =>
            q.eq("productId", product._id).eq("isCurrent", true)
          )
          .first();
        const row = {
          ...product,
          nova_trust_scores: trustScore ? [{ total_score: trustScore.totalScore }] : [],
          nova_integration_scores: integrationScore ? [{ total_score: integrationScore.totalScore }] : [],
        };
        return { ...row, computedOverallScore: computedOverallScore(row) };
      })
    );

    return productsWithScores
      .sort((a, b) => (b.computedOverallScore ?? 0) - (a.computedOverallScore ?? 0))
      .slice(0, limit);
  },
});

