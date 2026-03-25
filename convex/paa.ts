import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUncoveredQuestions = query({
  args: {
    keyword: v.optional(v.string()),
    hubSlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const uncovered = await ctx.db
      .query("paaQuestions")
      .withIndex("by_covered", (q) => q.eq("isCovered", false))
      .collect();

    const filtered = uncovered.filter((q) => {
      if (args.keyword && q.keyword !== args.keyword) return false;
      if (args.hubSlug && q.hubSlug !== args.hubSlug) return false;
      return true;
    });

    return filtered
      .sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0))
      .slice(0, args.limit ?? 8);
  },
});

