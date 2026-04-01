import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

export const generateComparisonNarrative = action({
  args: {
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    userContext: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const limit = await checkAiRateLimit(ctx, `comparison_writer:${args.productAId}:${args.productBId}`);
    if (!limit.allowed) throw new Error(limit.reason ?? "Rate limit exceeded");

    const ai = await callAnthropicJson<any>(
      `Compare products ${args.productAId} and ${args.productBId}. Return JSON {narrative,checklist,recommendationSummary,verdictProductId}.`,
      1000
    );

    const payload = {
      productAId: args.productAId,
      productBId: args.productBId,
      narrative: ai?.narrative ?? "AI comparison narrative is currently unavailable.",
      checklist: Array.isArray(ai?.checklist) ? ai.checklist.slice(0, 10) : [],
      recommendationSummary: ai?.recommendationSummary ?? "Review trust, integration, and cost fit before choosing.",
      verdictProductId:
        ai?.verdictProductId === args.productAId || ai?.verdictProductId === args.productBId
          ? ai.verdictProductId
          : undefined,
      userContext: args.userContext,
      basedOnComparisonArticleId: undefined,
      generatedAt: Date.now(),
      viewCount: 0,
    };

    const existing = await ctx.db
      .query("aiComparisonNarratives")
      .withIndex("by_products", (q) => q.eq("productAId", args.productAId).eq("productBId", args.productBId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return { id: existing._id, ...payload };
    }
    const id = await ctx.db.insert("aiComparisonNarratives", payload);
    return { id, ...payload };
  },
});
