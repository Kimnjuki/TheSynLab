import { query } from "./_generated/server";
import { v } from "convex/values";

export const getScoreExplanationsByProduct = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiScoreExplanations")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});

export const getReviewCopilotByProduct = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiReviewCopilotOutputs")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});

export const getScenarioResultsBySwap = query({
  args: {
    replacedProductId: v.id("novaProducts"),
    replacementProductId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiScenarioResults")
      .withIndex("by_products", (q) =>
        q.eq("replacedProductId", args.replacedProductId).eq("replacementProductId", args.replacementProductId)
      )
      .collect();
  },
});
