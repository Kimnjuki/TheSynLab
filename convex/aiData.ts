import { query } from "./_generated/server";
import { v } from "convex/values";

export const getProductScoreRows = query({
  args: { productIds: v.array(v.id("novaProducts")) },
  handler: async (ctx, args) => {
    const out = [];
    for (const productId of args.productIds) {
      const product = await ctx.db.get(productId);
      if (!product) continue;
      const trust = await ctx.db
        .query("novaTrustScores")
        .withIndex("by_current", (q) =>
          q.eq("productId", productId).eq("isCurrent", true)
        )
        .first();
      const integration = await ctx.db
        .query("novaIntegrationScores")
        .withIndex("by_current", (q) =>
          q.eq("productId", productId).eq("isCurrent", true)
        )
        .first();
      out.push({
        productId,
        productName: product.productName,
        trustScore: trust?.totalScore ?? null,
        integrationScore: integration?.totalScore ?? null,
        price: product.price ?? null,
      });
    }
    return out;
  },
});
