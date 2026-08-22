// @ts-nocheck
import { action, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

const insertCommunityInsight = internalMutation({
  args: {
    insightType: v.string(),
    hubSlug: v.optional(v.string()),
    insightTitle: v.string(),
    insightBody: v.string(),
    evidenceCount: v.number(),
    confidenceScore: v.number(),
    displayOnHubSlugs: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiCommunityInsights", {
      ...args,
      relatedProductIds: undefined,
      isPublished: true,
      displayOnProductIds: undefined,
      generatedAt: Date.now(),
      expiresAt: undefined,
      modelVersion: "claude-sonnet-4-20250514",
    });
  },
});

export const mineForumPatterns = action({
  args: {
    hubSlug: v.optional(v.union(v.string(), v.null())),
    lookbackDays: v.number(),
    minMentionCount: v.number(),
  },
  handler: async (ctx, args) => {
    const ai = await callAnthropicJson<any[]>(
      `Mine forum patterns for hub ${args.hubSlug ?? "all"} in last ${args.lookbackDays} days. Return JSON array of insights.`,
      1000
    );
    const insights = Array.isArray(ai) ? ai : [];
    const kept = insights.filter((i: any) => (i?.mentionCount ?? 0) >= args.minMentionCount);
    let created = 0;
    for (const i of kept) {
      await ctx.runMutation(internal.ai.communityMiner.insertCommunityInsight, {
        insightType: i?.type ?? "pattern",
        hubSlug: args.hubSlug ?? undefined,
        insightTitle: i?.title ?? "Community insight",
        insightBody: i?.summary ?? "",
        evidenceCount: i?.mentionCount ?? 0,
        confidenceScore: typeof i?.patternStrength === "number" ? i.patternStrength : 0.5,
        displayOnHubSlugs: args.hubSlug ? [args.hubSlug] : undefined,
      });
      created++;
    }
    return { created };
  },
});