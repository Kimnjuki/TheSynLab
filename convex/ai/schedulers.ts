// @ts-nocheck
import { internalAction, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

const listActiveProductIds = internalQuery({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("novaProducts")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(200);
    return products.map((p) => p._id);
  },
});

export const runNightlyRiskAnalysis = internalAction({
  args: {},
  handler: async (ctx) => {
    const productIds = await ctx.runQuery(internal.ai.schedulers.listActiveProductIds, {});
    let processed = 0;
    for (const productId of productIds) {
      try {
        await ctx.runAction(internal.ai.riskAnalyzer.analyzeProductRisk, {
          productId,
          forceRefresh: false,
        });
        processed++;
      } catch {
        // continue batch
      }
    }
    return { processed };
  },
});