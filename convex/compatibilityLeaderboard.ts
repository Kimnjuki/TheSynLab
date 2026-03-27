import { query } from "./_generated/server";
import { v } from "convex/values";

/** Breadth score: native ecosystems minus complexity penalty. */
export const topByCompatibilityBreadth = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 30, 100);
    const products = await ctx.db
      .query("novaProducts")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(250);

    const rows: {
      productId: string;
      slug: string;
      name: string;
      manufacturer: string;
      category: string;
      nativeCount: number;
      partialCount: number;
      avgSetup: number;
      verifiedSum: number;
      breadthScore: number;
    }[] = [];

    for (const p of products) {
      const eco = await ctx.db
        .query("novaEcosystemCompatibility")
        .withIndex("by_product", (q) => q.eq("productId", p._id))
        .collect();
      if (eco.length === 0) continue;

      let nativeCount = 0;
      let partialCount = 0;
      let setupSum = 0;
      let setupN = 0;
      let verifiedSum = 0;

      for (const e of eco) {
        if (e.compatibilityLevel === "full" && !e.requiresHub) nativeCount++;
        else if (e.compatibilityLevel === "partial") partialCount++;
        if (e.setupComplexity != null) {
          setupSum += e.setupComplexity;
          setupN++;
        }
        verifiedSum += e.verifiedCount ?? 0;
      }

      const avgSetup = setupN ? setupSum / setupN : 2.5;
      const breadthScore =
        nativeCount * 4 +
        partialCount * 1.5 +
        verifiedSum * 0.05 -
        avgSetup * 0.8;

      rows.push({
        productId: p._id,
        slug: p.productSlug,
        name: p.productName,
        manufacturer: p.manufacturer,
        category: p.category,
        nativeCount,
        partialCount,
        avgSetup: Math.round(avgSetup * 10) / 10,
        verifiedSum,
        breadthScore: Math.round(breadthScore * 10) / 10,
      });
    }

    return rows.sort((a, b) => b.breadthScore - a.breadthScore).slice(0, limit);
  },
});
