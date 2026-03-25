import { query } from "./_generated/server";
import { v } from "convex/values";

export const getMatrixEntry = query({
  args: { ecosystemA: v.string(), ecosystemB: v.string() },
  handler: async (ctx, args) => {
    const direct = await ctx.db
      .query("apiCompatibilityMatrix")
      .withIndex("by_ecosystems", (q) =>
        q.eq("ecosystemA", args.ecosystemA).eq("ecosystemB", args.ecosystemB)
      )
      .first();
    if (direct) return { ...direct, direction: "A_to_B" as const };

    const reverse = await ctx.db
      .query("apiCompatibilityMatrix")
      .withIndex("by_ecosystems", (q) =>
        q.eq("ecosystemA", args.ecosystemB).eq("ecosystemB", args.ecosystemA)
      )
      .first();
    if (reverse) return { ...reverse, direction: "B_to_A" as const };

    return null;
  },
});

