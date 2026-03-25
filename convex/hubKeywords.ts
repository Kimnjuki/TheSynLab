import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUncoveredKeywords = query({
  args: {
    hubSlug: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pending = await ctx.db
      .query("hubKeywords")
      .withIndex("by_status", (q) => q.eq("contentStatus", "pending"))
      .collect();

    const filtered = args.hubSlug
      ? pending.filter((k) => k.hubSlug === args.hubSlug)
      : pending;

    return filtered
      .sort((a, b) => b.priority - a.priority)
      .slice(0, args.limit ?? 50);
  },
});
