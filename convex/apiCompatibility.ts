import { query } from "./_generated/server";
import { v } from "convex/values";

export const listMatrix = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const lim = args.limit ?? 500;
    return await ctx.db.query("apiCompatibilityMatrix").take(lim);
  },
});

export const getPair = query({
  args: { ecosystemA: v.string(), ecosystemB: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("apiCompatibilityMatrix")
      .withIndex("by_ecosystems", (q) =>
        q.eq("ecosystemA", args.ecosystemA).eq("ecosystemB", args.ecosystemB)
      )
      .first();
  },
});
