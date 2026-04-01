import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

const TTL_MS = 24 * 60 * 60 * 1000;

export const runWhatIfScenario = action({
  args: {
    currentStack: v.array(v.id("novaProducts")),
    removeProductId: v.id("novaProducts"),
    addProductId: v.id("novaProducts"),
    userId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const limiter = await checkAiRateLimit(ctx, `scenario_engine:${args.userId ?? "anon"}`);
    if (!limiter.allowed) throw new Error(limiter.reason ?? "Rate limit exceeded");

    const cachedRows = await ctx.runQuery(api.aiRead.getScenarioResultsBySwap, {
      replacedProductId: args.removeProductId,
      replacementProductId: args.addProductId,
    });
    const latest = (cachedRows ?? []).sort((a: any, b: any) => b.generatedAt - a.generatedAt)[0];
    if (latest && Date.now() - latest.generatedAt < TTL_MS) return { source: "cache", data: latest };

    const prompt = `What-if analysis for replacing ${args.removeProductId} with ${args.addProductId} in stack ${JSON.stringify(args.currentStack)}. Return JSON with costDelta,privacyRiskDelta,lockInDelta,integrationComplexityDelta,summary,recommendation,warnings.`;
    const ai = await callAnthropicJson<any>(prompt, 1000);
    const data = {
      userId: args.userId ?? undefined,
      originalStack: args.currentStack,
      replacedProductId: args.removeProductId,
      replacementProductId: args.addProductId,
      impactAnalysis: ai ?? {},
      costDelta: typeof ai?.costDelta === "number" ? ai.costDelta : 0,
      privacyRiskDelta: typeof ai?.privacyRiskDelta === "number" ? ai.privacyRiskDelta : 0,
      lockInDelta: typeof ai?.lockInDelta === "number" ? ai.lockInDelta : 0,
      integrationComplexityDelta: typeof ai?.integrationComplexityDelta === "number" ? ai.integrationComplexityDelta : 0,
      generatedAt: Date.now(),
    };
    await ctx.runMutation(api.aiWrite.createScenarioResult, data);
    return { source: "generated", data };
  },
});
