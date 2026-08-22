// @ts-nocheck
import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

const getCurrentRiskAnalysis = internalQuery({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiRiskAnalyses")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();
  },
});

const archiveCurrentAnalyses = internalMutation({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const old = await ctx.db
      .query("aiRiskAnalyses")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    await Promise.all(old.map((row) => ctx.db.patch(row._id, { isCurrent: false })));
  },
});

const insertRiskAnalysis = internalMutation({
  args: {
    productId: v.id("novaProducts"),
    privacyRiskScore: v.number(),
    tosAmbiguityScore: v.number(),
    dataResidencyFlags: v.array(v.string()),
    securityPostureScore: v.number(),
    riskSummary: v.string(),
    detailedFindings: v.any(),
    analyzedDocUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiRiskAnalyses", {
      ...args,
      generatedAt: Date.now(),
      isCurrent: true,
    });
  },
});

export const analyzeProductRisk = action({
  args: {
    productId: v.id("novaProducts"),
    forceRefresh: v.boolean(),
  },
  handler: async (ctx, args) => {
    const limit = await checkAiRateLimit(ctx, `risk_analyzer:${args.productId}`);
    if (!limit.allowed) throw new Error(limit.reason ?? "Rate limit exceeded");

    if (!args.forceRefresh) {
      const current = await ctx.runQuery(internal.ai.riskAnalyzer.getCurrentRiskAnalysis, {
        productId: args.productId,
      });
      if (current) return current;
    }

    const product = await ctx.runQuery(api.products.getById, { id: args.productId });
    if (!product) throw new Error("Product not found");

    const ai = await callAnthropicJson<any>(
      `Analyze privacy risk for ${product.productName}. Return JSON {privacyRiskScore,tosAmbiguityScore,dataResidencyFlags,securityPostureScore,riskSummary,detailedFindings,analyzedUrls}.`,
      1000
    );

    await ctx.runMutation(internal.ai.riskAnalyzer.archiveCurrentAnalyses, {
      productId: args.productId,
    });

    const payload = {
      productId: args.productId,
      privacyRiskScore: typeof ai?.privacyRiskScore === "number" ? ai.privacyRiskScore : 50,
      tosAmbiguityScore: typeof ai?.tosAmbiguityScore === "number" ? ai.tosAmbiguityScore : 50,
      dataResidencyFlags: Array.isArray(ai?.dataResidencyFlags) ? ai.dataResidencyFlags.map(String) : [],
      securityPostureScore: typeof ai?.securityPostureScore === "number" ? ai.securityPostureScore : 50,
      riskSummary: ai?.riskSummary ?? "Insufficient data for a high-confidence risk summary.",
      detailedFindings: ai?.detailedFindings ?? {},
      analyzedDocUrls: Array.isArray(ai?.analyzedUrls) ? ai.analyzedUrls.map(String) : [],
    };
    const id = await ctx.runMutation(internal.ai.riskAnalyzer.insertRiskAnalysis, payload);
    return { id, ...payload };
  },
});