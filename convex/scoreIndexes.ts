import { query } from "./_generated/server";
import { v } from "convex/values";

const withScores = async (ctx: any, products: any[]) => {
  return await Promise.all(
    products.map(async (product) => {
      const trust = await ctx.db
        .query("novaTrustScores")
        .withIndex("by_current", (q: any) => q.eq("productId", product._id).eq("isCurrent", true))
        .first();
      const integration = await ctx.db
        .query("novaIntegrationScores")
        .withIndex("by_current", (q: any) => q.eq("productId", product._id).eq("isCurrent", true))
        .first();
      return { ...product, trustScore: trust?.totalScore ?? 0, integrationScore: integration?.totalScore ?? 0 };
    })
  );
};

export const getProductsWithTrustScores = query({
  args: {
    hub: v.optional(v.string()),
    category: v.optional(v.string()),
    minScore: v.optional(v.number()),
    maxScore: v.optional(v.number()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("novaProducts").collect();
    let rows = await withScores(
      ctx,
      all.filter((p) => (!args.hub || p.hub === args.hub) && (!args.category || p.category === args.category))
    );
    rows = rows.filter(
      (r) =>
        (args.minScore === undefined || r.trustScore >= args.minScore) &&
        (args.maxScore === undefined || r.trustScore <= args.maxScore)
    );
    rows.sort((a, b) => b.trustScore - a.trustScore);
    const page = args.page ?? 1;
    const pageSize = args.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return { items: rows.slice(start, start + pageSize), total: rows.length, page, pageSize };
  },
});

export const getProductsWithIntegrationScores = query({
  args: {
    hub: v.optional(v.string()),
    category: v.optional(v.string()),
    minScore: v.optional(v.number()),
    maxScore: v.optional(v.number()),
    page: v.optional(v.number()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("novaProducts").collect();
    let rows = await withScores(
      ctx,
      all.filter((p) => (!args.hub || p.hub === args.hub) && (!args.category || p.category === args.category))
    );
    rows = rows.filter(
      (r) =>
        (args.minScore === undefined || r.integrationScore >= args.minScore) &&
        (args.maxScore === undefined || r.integrationScore <= args.maxScore)
    );
    rows.sort((a, b) => b.integrationScore - a.integrationScore);
    const page = args.page ?? 1;
    const pageSize = args.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return { items: rows.slice(start, start + pageSize), total: rows.length, page, pageSize };
  },
});

export const getScoreDistributionStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await withScores(ctx, await ctx.db.query("novaProducts").collect());
    const buckets = [0, 2, 4, 6, 8, 10];
    const trust = buckets.map((min, idx) => ({
      range: `${min}-${buckets[idx + 1] ?? 10}`,
      count: all.filter((p) => p.trustScore >= min && p.trustScore < (buckets[idx + 1] ?? 11)).length,
    }));
    const integration = buckets.map((min, idx) => ({
      range: `${min}-${buckets[idx + 1] ?? 10}`,
      count: all.filter((p) => p.integrationScore >= min && p.integrationScore < (buckets[idx + 1] ?? 11)).length,
    }));
    return { trust, integration };
  },
});
