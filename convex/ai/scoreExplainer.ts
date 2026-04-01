import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { callAnthropicJson, ANTHROPIC_MODEL } from "./_utils/anthropic";
import { getRecentByProductAndType } from "./_utils/cacheManager";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";
import { logAiFeatureCall } from "./_utils/auditLogger";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const generateScoreExplanation = action({
  args: { productId: v.id("novaProducts"), scoreType: v.union(v.literal("trust"), v.literal("integration"), v.literal("both")) },
  handler: async (ctx, args) => {
    const rate = await checkAiRateLimit(ctx, `score_explainer:${args.productId}`);
    if (!rate.allowed) throw new Error(rate.reason ?? "Rate limit exceeded");

    const cached = await getRecentByProductAndType(ctx, args.productId, args.scoreType);
    if (cached && Date.now() - cached.generatedAt < TTL_MS) return { source: "cache", data: cached };

    const product = await ctx.runQuery(api.products.getById, { id: args.productId });
    const trust = await ctx.runQuery(api.scores.getTrustScore, { productId: args.productId });
    const integration = await ctx.runQuery(api.scores.getIntegrationScore, { productId: args.productId });
    if (!product) throw new Error("Product not found");

    const prompt = `Explain scores for ${product.productName}. Trust=${JSON.stringify(trust)} Integration=${JSON.stringify(integration)}. Return JSON: {explanation:string,strengths:string[],weaknesses:string[],redFlags:string[]}`;
    const ai = await callAnthropicJson<any>(prompt, 1000);

    const explanation = ai?.explanation ?? `Score explanation for ${product.productName}: Trust ${trust?.totalScore ?? "N/A"}, Integration ${integration?.totalScore ?? "N/A"}.`;
    const strengths = Array.isArray(ai?.strengths) ? ai.strengths.slice(0, 5) : ["Good score coverage"];
    const weaknesses = Array.isArray(ai?.weaknesses) ? ai.weaknesses.slice(0, 5) : ["Some dimensions require editorial review"];
    const redFlags = Array.isArray(ai?.redFlags) ? ai.redFlags.slice(0, 5) : [];

    const rows = await ctx.runQuery(api.aiRead.getScoreExplanationsByProduct, { productId: args.productId });
    const existing = (rows ?? []).find((r: any) => r.scoreType === args.scoreType);
    const payload = {
      productId: args.productId,
      scoreType: args.scoreType,
      explanation,
      strengths,
      weaknesses,
      redFlags,
      trustScoreId: trust?._id,
      integrationScoreId: integration?._id,
      generatedAt: Date.now(),
      modelVersion: ANTHROPIC_MODEL,
    };
    if (existing?._id) await ctx.runMutation(api.aiWrite.upsertScoreExplanation, { id: existing._id, ...payload });
    else await ctx.runMutation(api.aiWrite.createScoreExplanation, payload);

    await logAiFeatureCall(ctx, {
      action: "generate_score_explanation",
      tableName: "aiScoreExplanations",
      recordId: String(args.productId),
      description: `Generated score explanation for ${product.productName}`,
    });

    return { source: "generated", data: payload };
  },
});
