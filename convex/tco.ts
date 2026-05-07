import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Get pricing params for a product
export const getProductPricing = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, { productId }) => {
    return await ctx.db
      .query("productPricingParams")
      .withIndex("by_product", (q) => q.eq("productId", productId))
      .order("desc")
      .first();
  },
});

// Get multiple products' pricing at once
export const getMultiProductPricing = query({
  args: { productIds: v.array(v.id("novaProducts")) },
  handler: async (ctx, { productIds }) => {
    const results = await Promise.all(
      productIds.map(async (productId) => {
        const pricing = await ctx.db
          .query("productPricingParams")
          .withIndex("by_product", (q) => q.eq("productId", productId))
          .order("desc")
          .first();
        return { productId, pricing };
      })
    );
    return results;
  },
});

// Get cheaper alternatives for TCO comparison
export const getTcoAlternatives = query({
  args: {
    productId: v.id("novaProducts"),
    maxTco: v.float64(),
  },
  handler: async (ctx, { productId, maxTco }) => {
    // Get the product's hub to find same-category alternatives
    const product = await ctx.db.get(productId);
    if (!product) return [];

    const allTcoScores = await ctx.db
      .query("productTcoScores")
      .filter((q) =>
        q.and(
          q.eq(q.field("isCurrent"), true),
          q.lt(q.field("totalTco"), maxTco)
        )
      )
      .collect();

    // Filter to same hub and exclude current product
    const alternatives = allTcoScores
      .filter((score) => score.productId !== productId)
      .slice(0, 3);

    // Fetch product details for each alternative
    const enriched = await Promise.all(
      alternatives.map(async (score) => {
        const alt = await ctx.db.get(score.productId);
        return alt ? { product: alt, tcoScore: score } : null;
      })
    );

    return enriched.filter(Boolean);
  },
});

// Save a TCO calculation session
export const saveTcoCalculation = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    productIds: v.array(v.id("novaProducts")),
    seatCount: v.float64(),
    contractLengthYears: v.float64(),
    selectedAddOnIds: v.optional(v.array(v.string())),
    includeHiddenCosts: v.boolean(),
    results: v.array(
      v.object({
        productId: v.id("novaProducts"),
        year1Cost: v.float64(),
        year2Cost: v.float64(),
        year3Cost: v.float64(),
        totalTco: v.float64(),
        hiddenCostBreakdown: v.optional(v.any()),
        licenseBreakdown: v.optional(v.any()),
      })
    ),
    recommendedAlternativeIds: v.optional(v.array(v.id("novaProducts"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tcoCalculations", {
      ...args,
      emailCaptured: false,
      calculatedAt: Date.now(),
    });
  },
});

// Update email capture on a TCO calculation
export const captureTcoEmail = mutation({
  args: {
    sessionId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { sessionId, email }) => {
    const calc = await ctx.db
      .query("tcoCalculations")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (calc) {
      await ctx.db.patch(calc._id, { emailCaptured: true });
    }

    // Upsert newsletter subscriber
    const existing = await ctx.db
      .query("novaNewsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existing) {
      await ctx.db.insert("novaNewsletterSubscribers", {
        email,
        subscribedAt: Date.now(),
        source: "tco_calculator",
        isVerified: false,
        isActive: true,
      });
    }

    return { success: true };
  },
});

// Main TCO calculation action
export const calculateTco = action({
  args: {
    productIds: v.array(v.id("novaProducts")),
    seatCount: v.float64(),
    contractLengthYears: v.float64(),
    selectedAddOnIds: v.optional(v.array(v.string())),
    includeHiddenCosts: v.boolean(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (
    ctx,
    {
      productIds,
      seatCount,
      contractLengthYears,
      selectedAddOnIds,
      includeHiddenCosts,
      sessionId,
      userId,
    }
  ) => {
    const pricingData = await ctx.runQuery(api.tco.getMultiProductPricing, {
      productIds,
    });

    const results = pricingData.map(({ productId, pricing }: { productId: string; pricing: (typeof pricingData)[number]["pricing"] }) => {
      if (!pricing) {
        return {
          productId,
          year1Cost: 0,
          year2Cost: 0,
          year3Cost: 0,
          totalTco: 0,
          hiddenCostBreakdown: null,
          licenseBreakdown: null,
        };
      }

      const annualIncrease =
        (pricing.hiddenCostParams?.annualPriceIncreasePercent ?? 0) / 100;
      const hourlyRate = pricing.hiddenCostParams?.hourlyRateAssumption ?? 75;

      // Base license cost per year
      const useAnnual =
        pricing.basePriceAnnual !== undefined && contractLengthYears >= 1;
      const baseAnnualPerSeat = useAnnual
        ? (pricing.basePriceAnnual ?? pricing.basePriceMonthly * 12)
        : pricing.basePriceMonthly * 12;

      const year1License = baseAnnualPerSeat * seatCount;
      const year2License = year1License * (1 + annualIncrease);
      const year3License = year2License * (1 + annualIncrease);

      // Add-on costs
      const activeAddOns = (pricing.addOns ?? []).filter((addon: { name: string; monthlyCostPerUser?: number; oneTimeCost?: number; isRequired: boolean }) => {
        if (addon.isRequired) return true;
        if (selectedAddOnIds) return selectedAddOnIds.includes(addon.name);
        return false;
      });

      const addOnAnnualCost = activeAddOns.reduce((sum: number, addon: { name: string; monthlyCostPerUser?: number; oneTimeCost?: number; isRequired: boolean }) => {
        const monthly = addon.monthlyCostPerUser
          ? addon.monthlyCostPerUser * seatCount * 12
          : 0;
        return sum + monthly;
      }, 0);

      const addOnOneTimeCost = activeAddOns.reduce(
        (sum: number, addon: { oneTimeCost: any; }) => sum + (addon.oneTimeCost ?? 0),
        0
      );

      // Hidden costs (one-time, year 1 only)
      let hiddenCost = 0;
      const hiddenBreakdown: Record<string, number> = {};

      if (includeHiddenCosts && pricing.hiddenCostParams) {
        const h = pricing.hiddenCostParams;
        const onboarding = (h.onboardingHours ?? 0) * hourlyRate;
        const training = (h.trainingHours ?? 0) * hourlyRate;
        const integration = (h.integrationHours ?? 0) * hourlyRate;
        hiddenCost = onboarding + training + integration;
        hiddenBreakdown.onboarding = onboarding;
        hiddenBreakdown.training = training;
        hiddenBreakdown.integration = integration;
      }

      const year1Cost =
        year1License + addOnAnnualCost + addOnOneTimeCost + hiddenCost;
      const year2Cost = year2License + addOnAnnualCost;
      const year3Cost = year3License + addOnAnnualCost;

      const totalYears = Math.min(Math.floor(contractLengthYears), 3);
      const totalTco =
        totalYears === 1
          ? year1Cost
          : totalYears === 2
            ? year1Cost + year2Cost
            : year1Cost + year2Cost + year3Cost;

      return {
        productId,
        year1Cost: Math.round(year1Cost),
        year2Cost: Math.round(year2Cost),
        year3Cost: Math.round(year3Cost),
        totalTco: Math.round(totalTco),
        hiddenCostBreakdown: includeHiddenCosts ? hiddenBreakdown : null,
        licenseBreakdown: {
          baseAnnual: Math.round(year1License),
          addOns: Math.round(addOnAnnualCost),
          oneTime: Math.round(addOnOneTimeCost),
        },
      };
    });

    // Find cheapest result to suggest alternatives
    const minTco = Math.min(...results.map((r: { totalTco: number; }) => r.totalTco).filter((t: number) => t > 0));
    const alternatives = productIds.length > 0
      ? await ctx.runQuery(api.tco.getTcoAlternatives, {
          productId: productIds[0],
          maxTco: minTco * 0.9, // 10% cheaper
        })
      : [];

    // Save calculation
    await ctx.runMutation(api.tco.saveTcoCalculation, {
      sessionId,
      userId,
      productIds,
      seatCount,
      contractLengthYears,
      selectedAddOnIds,
      includeHiddenCosts,
      results,
      recommendedAlternativeIds: (alternatives as Array<{ product: { _id: Id<"novaProducts"> } } | null>)
        .filter((a): a is { product: { _id: Id<"novaProducts"> } } => a !== null)
        .map((a) => a.product._id),
    });

    return { results, alternatives };
  },
});

// Upsert pricing params for a product (admin)
export const upsertProductPricing = mutation({
  args: {
    productId: v.id("novaProducts"),
    basePriceMonthly: v.float64(),
    basePriceAnnual: v.optional(v.float64()),
    billingModel: v.union(
      v.literal("per_user"),
      v.literal("per_account"),
      v.literal("tiered"),
      v.literal("usage_based"),
      v.literal("flat")
    ),
    minSeats: v.optional(v.float64()),
    maxSeats: v.optional(v.float64()),
    addOns: v.array(
      v.object({
        name: v.string(),
        monthlyCostPerUser: v.optional(v.float64()),
        oneTimeCost: v.optional(v.float64()),
        isRequired: v.boolean(),
      })
    ),
    hiddenCostParams: v.object({
      onboardingHours: v.optional(v.float64()),
      trainingHours: v.optional(v.float64()),
      integrationHours: v.optional(v.float64()),
      hourlyRateAssumption: v.optional(v.float64()),
      annualPriceIncreasePercent: v.optional(v.float64()),
    }),
    freeTierAvailable: v.boolean(),
    freeTierLimits: v.optional(v.any()),
    enterpriseCustomPricing: v.boolean(),
    hasFreeTrialDays: v.optional(v.float64()),
    currency: v.string(),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("productPricingParams", {
      ...args,
      lastVerifiedAt: Date.now(),
    });
  },
});
