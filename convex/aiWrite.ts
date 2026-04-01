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
