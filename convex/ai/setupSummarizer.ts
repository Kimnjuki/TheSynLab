// @ts-nocheck
import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

const getPost = internalQuery({
  args: { postId: v.id("novaPosts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.postId);
  },
});

const insertSetupBlueprint = internalMutation({
  args: {
    sourcePostId: v.id("novaPosts"),
    goals: v.array(v.string()),
    stackSummary: v.string(),
    productIds: v.array(v.id("novaProducts")),
    keyAutomations: v.array(v.string()),
    pitfalls: v.array(v.string()),
    estimatedCostMonthly: v.optional(v.number()),
    teamSizeRange: v.optional(v.string()),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiSetupBlueprints", {
      ...args,
      generatedAt: Date.now(),
    });
  },
});

export const summarizeSetup = action({
  args: { postId: v.id("novaPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.runQuery(internal.ai.setupSummarizer.getPost, { postId: args.postId });
    if (!post) throw new Error("Post not found");
    const ai = await callAnthropicJson<any>(
      `Summarize setup post into blueprint. Content: ${post.postContent}. Return JSON {goals,stackSummary,productIds,keyAutomations,pitfalls,estimatedCostMonthly,teamSizeRange}.`,
      1000
    );
    const payload = {
      sourcePostId: args.postId,
      goals: Array.isArray(ai?.goals) ? ai.goals.map(String) : [],
      stackSummary: ai?.stackSummary ?? post.postExcerpt ?? "",
      productIds: Array.isArray(ai?.productIds) ? (ai.productIds as any) : [],
      keyAutomations: Array.isArray(ai?.keyAutomations) ? ai.keyAutomations.map(String) : [],
      pitfalls: Array.isArray(ai?.pitfalls) ? ai.pitfalls.map(String) : [],
      estimatedCostMonthly: typeof ai?.estimatedCostMonthly === "number" ? ai.estimatedCostMonthly : undefined,
      teamSizeRange: typeof ai?.teamSizeRange === "string" ? ai.teamSizeRange : undefined,
      isPublished: (ai?.goals?.length ?? 0) >= 2 && (ai?.keyAutomations?.length ?? 0) >= 1,
    };
    const id = await ctx.runMutation(internal.ai.setupSummarizer.insertSetupBlueprint, payload);
    return { id, ...payload };
  },
});