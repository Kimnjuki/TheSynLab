import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

export const analyzeProductRisk = action({
  args: {
    productId: v.id("novaProducts"),
    forceRefresh: v.boolean(),
  },
  handler: async (ctx, args) => {
    const limit = await checkAiRateLimit(ctx, `risk_analyzer:${args.productId}`);
    if (!limit.allowed) throw new Error(limit.reason ?? "Rate limit exceeded");

    if (!args.forceRefresh) {
      const current = await ctx.db
        .query("aiRiskAnalyses")
        .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
        .first();
      if (current) return current;
    }

    const product = await ctx.runQuery(api.products.getById, { id: args.productId });
    if (!product) throw new Error("Product not found");

    const ai = await callAnthropicJson<any>(
      `Analyze privacy risk for ${product.productName}. Return JSON {privacyRiskScore,tosAmbiguityScore,dataResidencyFlags,securityPostureScore,riskSummary,detailedFindings,analyzedUrls}.`,
      1000
    );

    const oldCurrent = await ctx.db
      .query("aiRiskAnalyses")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    await Promise.all(oldCurrent.map((row) => ctx.db.patch(row._id, { isCurrent: false })));

    const payload = {
      productId: args.productId,
      privacyRiskScore: typeof ai?.privacyRiskScore === "number" ? ai.privacyRiskScore : 50,
      tosAmbiguityScore: typeof ai?.tosAmbiguityScore === "number" ? ai.tosAmbiguityScore : 50,
      dataResidencyFlags: Array.isArray(ai?.dataResidencyFlags) ? ai.dataResidencyFlags : [],
      securityPostureScore: typeof ai?.securityPostureScore === "number" ? ai.securityPostureScore : 50,
      riskSummary: ai?.riskSummary ?? "Insufficient data for a high-confidence risk summary.",
      detailedFindings: ai?.detailedFindings ?? {},
      analyzedDocUrls: Array.isArray(ai?.analyzedUrls) ? ai.analyzedUrls : [],
      generatedAt: Date.now(),
      isCurrent: true,
    };
    const id = await ctx.db.insert("aiRiskAnalyses", payload);
    return { id, ...payload };
  },
});
