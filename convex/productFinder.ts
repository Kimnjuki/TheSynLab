import { query } from "./_generated/server";
import { v } from "convex/values";

export const searchProducts = query({
  args: {
    q: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 12, 40);
    const terms = args.q
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (terms.length === 0) return [];

    const products = await ctx.db
      .query("novaProducts")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(500);

    const scored: { product: (typeof products)[0]; score: number }[] = [];

    for (const p of products) {
      const hay = `${p.productName} ${p.manufacturer} ${p.category} ${p.hub ?? ""} ${p.description ?? ""}`.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (hay.includes(t)) score += 2;
        if (p.productName.toLowerCase().includes(t)) score += 3;
      }
      if (score > 0) scored.push({ product: p, score });
    }

    scored.sort((a, b) => b.score - a.score);

    const out = [];
    for (const { product: p } of scored.slice(0, limit)) {
      const trust = await ctx.db
        .query("novaTrustScores")
        .withIndex("by_current", (q) =>
          q.eq("productId", p._id).eq("isCurrent", true)
        )
        .first();
      const integration = await ctx.db
        .query("novaIntegrationScores")
        .withIndex("by_current", (q) =>
          q.eq("productId", p._id).eq("isCurrent", true)
        )
        .first();
      out.push({
        _id: p._id,
        productSlug: p.productSlug,
        productName: p.productName,
        manufacturer: p.manufacturer,
        category: p.category,
        price: p.price,
        featuredImageUrl: p.featuredImageUrl,
        trustScore: trust?.totalScore,
        integrationScore: integration?.totalScore,
      });
    }
    return out;
  },
});
