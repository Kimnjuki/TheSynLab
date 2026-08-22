// @ts-nocheck
import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

const findExistingNarrative = internalQuery({
  args: {
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiComparisonNarratives")
      .withIndex("by_products", (q) =>
        q.eq("productAId", args.productAId).eq("productBId", args.productBId)
      )
      .first();
  },
});

const upsertNarrative = internalMutation({
  args: {
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    narrative: v.string(),
    checklist: v.array(v.any()),
    recommendationSummary: v.string(),
    verdictProductId: v.optional(v.id("novaProducts")),
    userContext: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aiComparisonNarratives")
      .withIndex("by_products", (q) =>
        q.eq("productAId", args.productAId).eq("productBId", args.productBId)
      )
      .first();
    const payload = {
      productAId: args.productAId,
      productBId: args.productBId,
      narrative: args.narrative,
      checklist: args.checklist,
      recommendationSummary: args.recommendationSummary,
      verdictProductId: args.verdictProductId,
      userContext: args.userContext,
      basedOnComparisonArticleId: undefined,
      generatedAt: Date.now(),
      viewCount: 0,
    };
    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }
    return await ctx.db.insert("aiComparisonNarratives", payload);
  },
});

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
          ? (ai.verdictProductId as any)
          : undefined,
      userContext: args.userContext,
    };

    const existing = await ctx.runQuery(internal.ai.comparisonWriter.findExistingNarrative, {
      productAId: args.productAId,
      productBId: args.productBId,
    });
    const id = await ctx.runMutation(internal.ai.comparisonWriter.upsertNarrative, payload);
    return { id, ...payload, existedBefore: Boolean(existing) };
  },
});