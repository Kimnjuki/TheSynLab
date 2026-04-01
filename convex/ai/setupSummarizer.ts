import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

export const summarizeSetup = action({
  args: { postId: v.id("novaPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    const ai = await callAnthropicJson<any>(
      `Summarize setup post into blueprint. Content: ${post.postContent}. Return JSON {goals,stackSummary,productIds,keyAutomations,pitfalls,estimatedCostMonthly,teamSizeRange}.`,
      1000
    );
    const payload = {
      sourcePostId: args.postId,
      goals: Array.isArray(ai?.goals) ? ai.goals : [],
      stackSummary: ai?.stackSummary ?? post.postExcerpt ?? "",
      productIds: Array.isArray(ai?.productIds) ? ai.productIds : [],
      keyAutomations: Array.isArray(ai?.keyAutomations) ? ai.keyAutomations : [],
      pitfalls: Array.isArray(ai?.pitfalls) ? ai.pitfalls : [],
      estimatedCostMonthly: typeof ai?.estimatedCostMonthly === "number" ? ai.estimatedCostMonthly : undefined,
      teamSizeRange: ai?.teamSizeRange,
      generatedAt: Date.now(),
      isPublished: (ai?.goals?.length ?? 0) >= 2 && (ai?.keyAutomations?.length ?? 0) >= 1,
    };
    const id = await ctx.db.insert("aiSetupBlueprints", payload);
    return { id, ...payload };
  },
});
