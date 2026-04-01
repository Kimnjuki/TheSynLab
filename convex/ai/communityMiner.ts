import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

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
    const ids = await Promise.all(
      kept.map((i: any) =>
        ctx.db.insert("aiCommunityInsights", {
          insightType: i?.type ?? "pattern",
          hubSlug: args.hubSlug ?? undefined,
          relatedProductIds: undefined,
          insightTitle: i?.title ?? "Community insight",
          insightBody: i?.summary ?? "",
          evidenceCount: i?.mentionCount ?? 0,
          confidenceScore: i?.patternStrength ?? 0.5,
          isPublished: true,
          displayOnProductIds: undefined,
          displayOnHubSlugs: args.hubSlug ? [args.hubSlug] : undefined,
          generatedAt: Date.now(),
          expiresAt: undefined,
          modelVersion: "claude-sonnet-4-20250514",
        })
      )
    );
    return { created: ids.length };
  },
});
