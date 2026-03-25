import { query } from "./_generated/server";
import { v } from "convex/values";

const compatRank: Record<string, number> = {
  full: 4,
  partial: 3,
  limited: 2,
  none: 1,
  unknown: 0,
};

export const listBestForEcosystem = query({
  args: { ecosystem: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const compat = await ctx.db
      .query("novaEcosystemCompatibility")
      .withIndex("by_ecosystem", (q) => q.eq("ecosystem", args.ecosystem))
      .collect();

    const enriched = await Promise.all(
      compat.map(async (c) => {
        const product = await ctx.db.get(c.productId);
        if (!product) return null;
        return {
          product,
          compatibility: c,
          rank: compatRank[c.compatibilityLevel] ?? 0,
          overall: product.overallScore ?? 0,
        };
      })
    );

    return enriched
      .filter(Boolean)
      .sort((a: any, b: any) => b.rank - a.rank || b.overall - a.overall)
      .slice(0, limit);
  },
});

