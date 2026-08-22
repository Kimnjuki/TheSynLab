// @ts-nocheck
import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

const findExistingEdge = internalQuery({
  args: {
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiIntegrationGraph")
      .withIndex("by_products", (q) =>
        q.eq("productAId", args.productAId).eq("productBId", args.productBId)
      )
      .first();
  },
});

const upsertEdge = internalMutation({
  args: {
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    confirmed: v.boolean(),
    integrationMethod: v.string(),
    nativeSupport: v.boolean(),
    requiresMiddleware: v.boolean(),
    middlewareOptions: v.array(v.string()),
    confidenceScore: v.number(),
    sourceUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aiIntegrationGraph")
      .withIndex("by_products", (q) =>
        q.eq("productAId", args.productAId).eq("productBId", args.productBId)
      )
      .first();
    const payload = {
      ...args,
      lastVerifiedAt: Date.now(),
      autoVerified: true,
    };
    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return existing._id;
    }
    return await ctx.db.insert("aiIntegrationGraph", payload);
  },
});

export const verifyIntegration = action({
  args: { productAId: v.id("novaProducts"), productBId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const limit = await checkAiRateLimit(ctx, `integration_mapper:${args.productAId}:${args.productBId}`);
    if (!limit.allowed) throw new Error(limit.reason ?? "Rate limit exceeded");
    const ai = await callAnthropicJson<any>(
      `Verify integration between ${args.productAId} and ${args.productBId}. Return JSON {confirmed,integrationMethod,nativeSupport,requiresMiddleware,middlewareOptions,confidenceScore,sourceUrls}.`,
      1000
    );
    const payload = {
      productAId: args.productAId,
      productBId: args.productBId,
      confirmed: Boolean(ai?.confirmed),
      integrationMethod: ai?.integrationMethod ?? "unknown",
      nativeSupport: Boolean(ai?.nativeSupport),
      requiresMiddleware: Boolean(ai?.requiresMiddleware),
      middlewareOptions: Array.isArray(ai?.middlewareOptions) ? ai.middlewareOptions.map(String) : [],
      confidenceScore: typeof ai?.confidenceScore === "number" ? ai.confidenceScore : 0.5,
      sourceUrls: Array.isArray(ai?.sourceUrls) ? ai.sourceUrls.map(String) : [],
    };
    const existing = await ctx.runQuery(internal.ai.integrationMapper.findExistingEdge, {
      productAId: args.productAId,
      productBId: args.productBId,
    });
    const id = await ctx.runMutation(internal.ai.integrationMapper.upsertEdge, payload);
    return { id, ...payload, existedBefore: Boolean(existing) };
  },
});