import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

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
      middlewareOptions: Array.isArray(ai?.middlewareOptions) ? ai.middlewareOptions : [],
      confidenceScore: typeof ai?.confidenceScore === "number" ? ai.confidenceScore : 0.5,
      sourceUrls: Array.isArray(ai?.sourceUrls) ? ai.sourceUrls : [],
      lastVerifiedAt: Date.now(),
      autoVerified: true,
    };
    const existing = await ctx.db
      .query("aiIntegrationGraph")
      .withIndex("by_products", (q) => q.eq("productAId", args.productAId).eq("productBId", args.productBId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return { id: existing._id, ...payload };
    }
    const id = await ctx.db.insert("aiIntegrationGraph", payload);
    return { id, ...payload };
  },
});
