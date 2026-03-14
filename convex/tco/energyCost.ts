import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * S8: Energy cost – estimate energy cost for a product over 3 years.
 */
export const computeEnergyCost = query({
  args: {
    productId: v.id("novaProducts"),
    electricityRatePerKwh: v.optional(v.number()),
    years: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const tco = await ctx.db
      .query("productTcoScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();

    if (!tco || tco.energyConsumptionKwh === undefined) return null;

    const rate = args.electricityRatePerKwh ?? 0.12;
    const yearsMultiplier = args.years ?? 3;
    const totalKwh = tco.energyConsumptionKwh * yearsMultiplier;
    const cost = totalKwh * rate;

    return {
      totalKwh,
      cost,
      years: yearsMultiplier,
      ratePerKwh: rate,
    };
  },
});
