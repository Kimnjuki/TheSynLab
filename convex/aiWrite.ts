import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createScoreExplanation = mutation({
  args: {
    productId: v.id("novaProducts"),
    scoreType: v.string(),
    explanation: v.string(),
    strengths: v.array(v.string()),
    weaknesses: v.array(v.string()),
    redFlags: v.array(v.string()),
    trustScoreId: v.optional(v.id("novaTrustScores")),
    integrationScoreId: v.optional(v.id("novaIntegrationScores")),
    generatedAt: v.float64(),
    modelVersion: v.string(),
  },
  handler: async (ctx, args) => await ctx.db.insert("aiScoreExplanations", args),
});

export const upsertScoreExplanation = mutation({
  args: {
    id: v.id("aiScoreExplanations"),
    productId: v.id("novaProducts"),
    scoreType: v.string(),
    explanation: v.string(),
    strengths: v.array(v.string()),
    weaknesses: v.array(v.string()),
    redFlags: v.array(v.string()),
    trustScoreId: v.optional(v.id("novaTrustScores")),
    integrationScoreId: v.optional(v.id("novaIntegrationScores")),
    generatedAt: v.float64(),
    modelVersion: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...patch } = args;
    await ctx.db.patch(id, patch);
    return id;
  },
});

export const upsertStackSession = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    conversationHistory: v.array(v.any()),
    collectedContext: v.optional(v.any()),
    proposedStack: v.optional(v.any()),
    status: v.string(),
    updatedAt: v.float64(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("aiStackSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("aiStackSessions", { ...args, startedAt: Date.now() });
  },
});

export const createScenarioResult = mutation({
  args: {
    userId: v.optional(v.string()),
    originalStack: v.array(v.id("novaProducts")),
    replacedProductId: v.id("novaProducts"),
    replacementProductId: v.id("novaProducts"),
    impactAnalysis: v.any(),
    costDelta: v.optional(v.float64()),
    privacyRiskDelta: v.optional(v.float64()),
    lockInDelta: v.optional(v.float64()),
    integrationComplexityDelta: v.optional(v.float64()),
    generatedAt: v.float64(),
  },
  handler: async (ctx, args) => await ctx.db.insert("aiScenarioResults", args),
});

export const createReviewCopilotOutput = mutation({
  args: {
    reviewId: v.optional(v.id("productReviews")),
    productId: v.id("novaProducts"),
    userId: v.optional(v.string()),
    userContext: v.any(),
    reframedSummary: v.string(),
    tailoredPros: v.array(v.string()),
    tailoredCons: v.array(v.string()),
    mustCheckSettings: v.array(v.string()),
    useCaseRelevanceScore: v.float64(),
    generatedAt: v.float64(),
  },
  handler: async (ctx, args) => await ctx.db.insert("aiReviewCopilotOutputs", args),
});

// ============ SENTIMENT PIPELINE MUTATIONS ============

export const updateReviewSentimentStatus = mutation({
  args: {
    reviewId: v.id("productReviews"),
    status: v.union(v.literal("pending"), v.literal("complete"), v.literal("failed")),
    processedAt: v.optional(v.float64()),
    modelVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reviewId, {
      sentimentStatus: args.status,
      ...(args.processedAt && { sentimentProcessedAt: args.processedAt }),
      ...(args.modelVersion && { sentimentModelVersion: args.modelVersion }),
    });
    return args.reviewId;
  },
});

export const createReviewSentiment = mutation({
  args: {
    reviewId: v.id("productReviews"),
    productId: v.id("novaProducts"),
    overallSentimentLabel: v.union(v.literal("positive"), v.literal("neutral"), v.literal("negative")),
    overallSentimentScore: v.float64(),
    aspects: v.any(),
    summary: v.string(),
    keyThemes: v.array(v.string()),
    modelVersion: v.string(),
    processingDurationMs: v.optional(v.float64()),
    processedAt: v.float64(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiReviewSentiment", {
      ...args,
      sentimentStatus: "complete",
    });
  },
});

export const createProductSentimentAggregate = mutation({
  args: {
    productId: v.id("novaProducts"),
    overallSentimentScore: v.float64(),
    positivePercent: v.float64(),
    neutralPercent: v.float64(),
    negativePercent: v.float64(),
    aspectAverages: v.any(),
    topPraised: v.optional(v.string()),
    topComplained: v.optional(v.string()),
    reviewCount: v.float64(),
  },
  handler: async (ctx, args) => {
    // Mark old aggregates as not current
    const oldAggregates = await ctx.db
      .query("productSentimentAggregates")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    for (const agg of oldAggregates) {
      await ctx.db.patch(agg._id, { isCurrent: false });
    }

    return await ctx.db.insert("productSentimentAggregates", {
      ...args,
      lastComputedAt: Date.now(),
      isCurrent: true,
    });
  },
});

// ============ TRUST COPILOT MUTATIONS ============

export const createRiskAnalysis = mutation({
  args: {
    productId: v.id("novaProducts"),
    privacyRiskScore: v.float64(),
    tosAmbiguityScore: v.float64(),
    dataResidencyFlags: v.array(v.string()),
    securityPostureScore: v.float64(),
    riskSummary: v.string(),
    detailedFindings: v.any(),
    analyzedDocUrls: v.optional(v.array(v.string())),
    generatedAt: v.float64(),
    isCurrent: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiRiskAnalyses", args);
  },
});

export const markRiskAnalysesAsOld = mutation({
  args: {
    productId: v.id("novaProducts"),
    excludeId: v.optional(v.id("aiRiskAnalyses")),
  },
  handler: async (ctx, args) => {
    const analyses = await ctx.db
      .query("aiRiskAnalyses")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    for (const analysis of analyses) {
      if (args.excludeId && analysis._id === args.excludeId) {
        continue;
      }
      await ctx.db.patch(analysis._id, { isCurrent: false });
    }
  },
});

export const createComplianceMemo = mutation({
  args: {
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    productIds: v.array(v.id("novaProducts")),
    userRegion: v.string(),
    userIndustry: v.optional(v.string()),
    requestedFrameworks: v.array(v.string()),
    memoContent: v.string(),
    complianceMatrix: v.any(),
    overallPosture: v.union(v.literal("compliant"), v.literal("partial"), v.literal("non_compliant")),
    criticalGaps: v.array(v.any()),
    recommendations: v.array(v.string()),
    generatedAt: v.float64(),
    modelVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("complianceMemos", args);
  },
});
