import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getCurrentByProduct = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiRiskProfiles")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();
  },
});

export const markPreviousNotCurrent = mutation({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const current = await ctx.db
      .query("aiRiskProfiles")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    await Promise.all(current.map((doc) => ctx.db.patch(doc._id, { isCurrent: false })));
  },
});

export const insertRiskProfile = mutation({
  args: {
    productId: v.id("novaProducts"),
    privacyRiskScore: v.float64(),
    vendorLockInRisk: v.float64(),
    failureImpactScore: v.float64(),
    dataPortabilityScore: v.float64(),
    regulatoryComplianceScore: v.float64(),
    aiExplanation: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiRiskProfiles", {
      ...args,
      isCurrent: true,
      computedAt: Date.now(),
      modelVersion: "heuristic-v1",
    });
  },
});

export const getRiskInputs = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const trust = await ctx.db
      .query("novaTrustScores")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();
    const integration = await ctx.db
      .query("novaIntegrationScores")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();
    const tco = await ctx.db
      .query("productTcoScores")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();
    return { trust, integration, tco };
  },
});

export const computeRiskProfile = action({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const inputs = await ctx.runQuery(api.aiRiskProfiles.getRiskInputs, { productId: args.productId });
    const trust = inputs?.trust;
    const integration = inputs?.integration;
    const tco = inputs?.tco;

    const trustScore = trust?.totalScore ?? 50;
    const integrationScore = integration?.totalScore ?? 50;
    const vendorLockIn = tco?.vendorLockInScore ?? Math.max(0, 100 - integrationScore);
    const portability = tco?.dataExportSupported ? 80 : 40;

    const profile = {
      privacyRiskScore: Math.max(0, 100 - trustScore),
      vendorLockInRisk: Math.max(0, Math.min(100, vendorLockIn)),
      failureImpactScore: Math.max(0, 70 - integrationScore / 2),
      dataPortabilityScore: portability,
      regulatoryComplianceScore: Math.round((trustScore + portability) / 2),
      aiExplanation:
        "Risk profile generated with a weighted heuristic from trust, integration, and portability signals.",
    };

    await ctx.runMutation(api.aiRiskProfiles.markPreviousNotCurrent, { productId: args.productId });
    await ctx.runMutation(api.aiRiskProfiles.insertRiskProfile, {
      productId: args.productId,
      ...profile,
    });
    return profile;
  },
});
