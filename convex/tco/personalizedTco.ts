import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * S8: Personalized TCO – TCO score per product with optional user-specific inputs.
 */
export const getPersonalizedTco = query({
  args: {
    productId: v.id("novaProducts"),
    teamSize: v.optional(v.number()),
    electricityRatePerKwh: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const tco = await ctx.db
      .query("productTcoScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();

    if (!tco) return null;

    let adjTotal = tco.totalTco;
    if (args.teamSize !== undefined && tco.includesLicensing) {
      adjTotal = tco.totalTco * Math.max(0.1, args.teamSize / 5);
    }
    if (args.electricityRatePerKwh !== undefined && tco.energyConsumptionKwh) {
      const energyCost = tco.energyConsumptionKwh * args.electricityRatePerKwh * 3;
      adjTotal = adjTotal - (tco.totalTco * 0.05) + energyCost;
    }

    return {
      ...tco,
      adjustedTotalTco: adjTotal,
    };
  },
});
