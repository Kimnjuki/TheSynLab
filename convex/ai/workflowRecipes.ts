import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

export const generateWorkflowRecipe = action({
  args: {
    userPrompt: v.string(),
    productIds: v.array(v.id("novaProducts")),
    userId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const limit = await checkAiRateLimit(ctx, `workflow_recipe:${args.userId ?? "anon"}`);
    if (!limit.allowed) throw new Error(limit.reason ?? "Rate limit exceeded");
    const ai = await callAnthropicJson<any>(
      `Generate workflow recipe for prompt "${args.userPrompt}" with products ${JSON.stringify(args.productIds)}. Return JSON {steps,automationPlatform,triggerConfig,estimatedSetupMinutes,complexity}.`,
      1000
    );
    const payload = {
      userId: args.userId ?? undefined,
      prompt: args.userPrompt,
      productIds: args.productIds,
      steps: Array.isArray(ai?.steps) ? ai.steps : [],
      automationPlatforms: [ai?.automationPlatform ?? "native"],
      triggerConfig: ai?.triggerConfig ?? {},
      estimatedSetupMinutes: typeof ai?.estimatedSetupMinutes === "number" ? ai.estimatedSetupMinutes : 30,
      complexity: ai?.complexity ?? "intermediate",
      generatedAt: Date.now(),
      savedCount: 0,
    };
    const id = await ctx.db.insert("aiWorkflowRecipes", payload);
    return { id, ...payload };
  },
});
