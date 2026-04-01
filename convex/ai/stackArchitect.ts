import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";
import { buildScoreContext } from "./_utils/scoreContextBuilder";

export const runStackArchitectTurn = action({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.union(v.string(), v.null())),
    userMessage: v.string(),
    conversationHistory: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const limiter = await checkAiRateLimit(ctx, `stack_architect:${args.userId ?? "anon"}`);
    if (!limiter.allowed) throw new Error(limiter.reason ?? "Rate limit exceeded");

    const products = await ctx.runQuery(api.products.list, { status: "active" });
    const top = (products ?? []).slice(0, 20);
    const productIds = top.map((p: any) => p._id);
    const scoreContext = await buildScoreContext(ctx, productIds as any[]);
    const prompt = `You are TheSynLab AI Stack Architect. User said: ${args.userMessage}. Context: ${scoreContext}. Return JSON with keys stack,rationale,totalEstimatedCost,trustRiskLevel,integrationComplexity or follow_up_question_or_updated_stack.`;
    const ai = await callAnthropicJson<any>(prompt, 1000);
    const result = ai ?? {
      follow_up_question_or_updated_stack:
        "What is your team size, monthly budget, and privacy sensitivity so I can propose a better stack?",
    };
    const history = [...args.conversationHistory, { role: "user", content: args.userMessage }, { role: "assistant", content: result }];
    await ctx.runMutation(api.aiWrite.upsertStackSession, {
      sessionId: args.sessionId,
      userId: args.userId ?? undefined,
      conversationHistory: history,
      collectedContext: null,
      proposedStack: (result as any).stack ?? null,
      status: (result as any).stack ? "completed" : "collecting_context",
      updatedAt: Date.now(),
    });
    return result;
  },
});
