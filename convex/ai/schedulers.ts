import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

export const runNightlyRiskAnalysis = internalAction({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("novaProducts").filter((q) => q.eq(q.field("status"), "active")).take(200);
    for (const p of products) {
      try {
        await ctx.runAction((internal as any)["ai/riskAnalyzer"].analyzeProductRisk, {
          productId: p._id,
          forceRefresh: false,
        });
      } catch {
        // continue batch
      }
    }
    return { processed: products.length };
  },
});
