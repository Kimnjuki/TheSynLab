import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

export const generateContextualReview = action({
  args: {
    productId: v.id("novaProducts"),
    userId: v.optional(v.union(v.string(), v.null())),
    userContext: v.object({
      useCase: v.string(),
      teamSize: v.number(),
      region: v.string(),
      privacySensitivity: v.string(),
      budget: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const limiter = await checkAiRateLimit(ctx, `review_copilot:${args.userId ?? "anon"}`);
    if (!limiter.allowed) throw new Error(limiter.reason ?? "Rate limit exceeded");

    const product = await ctx.runQuery(api.products.getById, { id: args.productId });
    if (!product) throw new Error("Product not found");
    const prompt = `Contextual review for ${product.productName}. User context: ${JSON.stringify(args.userContext)}. Return JSON {reframedSummary,tailoredPros,tailoredCons,mustCheckSettings,useCaseRelevanceScore}`;
    const ai = await callAnthropicJson<any>(prompt, 1000);

    const data = {
      reviewId: undefined,
      productId: args.productId,
      userId: args.userId ?? undefined,
      userContext: args.userContext,
      reframedSummary: ai?.reframedSummary ?? `${product.productName} is a strong fit depending on your workflow constraints.`,
      tailoredPros: Array.isArray(ai?.tailoredPros) ? ai.tailoredPros.slice(0, 5) : ["Usability for stated use case"],
      tailoredCons: Array.isArray(ai?.tailoredCons) ? ai.tailoredCons.slice(0, 5) : ["Requires validation against your team process"],
      mustCheckSettings: Array.isArray(ai?.mustCheckSettings) ? ai.mustCheckSettings.slice(0, 3) : ["Review privacy and sharing settings"],
      useCaseRelevanceScore: typeof ai?.useCaseRelevanceScore === "number" ? ai.useCaseRelevanceScore : 70,
      generatedAt: Date.now(),
    };

    await ctx.runMutation(api.aiWrite.createReviewCopilotOutput, data);
    return data;
  },
});
