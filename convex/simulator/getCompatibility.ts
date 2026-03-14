/**
 * S4: Integration Simulator
 * Returns compatibility data for product pair simulation.
 */

import { query } from "../_generated/server";
import { v } from "convex/values";

export const getCompatibilityForSimulation = query({
  args: {
    productAId: v.optional(v.id("novaProducts")),
    productBId: v.optional(v.id("novaProducts")),
    ecosystemA: v.optional(v.string()),
    ecosystemB: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.ecosystemA && args.ecosystemB) {
      const key = [args.ecosystemA, args.ecosystemB].sort();
      const row = await ctx.db
        .query("apiCompatibilityMatrix")
        .withIndex("by_ecosystems", (q) =>
          q.eq("ecosystemA", key[0]).eq("ecosystemB", key[1])
        )
        .first();
      return row
        ? {
            productA: null,
            productB: null,
            compatibilityScore: row.compatibilityScore,
            matrixRows: [{ ecosystemA: row.ecosystemA, ecosystemB: row.ecosystemB, score: row.compatibilityScore }],
          }
        : { productA: null, productB: null, compatibilityScore: 65, matrixRows: [] };
    }
    if (!args.productAId || !args.productBId) {
      return { productA: null, productB: null, compatibilityScore: 65, matrixRows: [] };
    }
    const productA = await ctx.db.get(args.productAId!);
    const productB = await ctx.db.get(args.productBId!);

    if (!productA || !productB) {
      return null;
    }

    // Look up apiCompatibilityMatrix for ecosystem pairs
    const ecosystemsA = [productA.hub, productA.category].filter(Boolean);
    const ecosystemsB = [productB.hub, productB.category].filter(Boolean);

    const matrixRows: { ecosystemA: string; ecosystemB: string; score: number }[] = [];

    for (const ea of ecosystemsA) {
      for (const eb of ecosystemsB) {
        const key = [ea, eb].sort();
        const row = await ctx.db
          .query("apiCompatibilityMatrix")
          .withIndex("by_ecosystems", (q) =>
            q.eq("ecosystemA", key[0]).eq("ecosystemB", key[1])
          )
          .first();

        if (row) {
          matrixRows.push({
            ecosystemA: row.ecosystemA,
            ecosystemB: row.ecosystemB,
            score: row.compatibilityScore,
          });
        }
      }
    }

    const avgScore =
      matrixRows.length > 0
        ? matrixRows.reduce((s, r) => s + r.score, 0) / matrixRows.length
        : 50;

    return {
      productA: { _id: productA._id, productName: productA.productName },
      productB: { _id: productB._id, productName: productB.productName },
      compatibilityScore: Math.round(avgScore),
      matrixRows,
    };
  },
});
