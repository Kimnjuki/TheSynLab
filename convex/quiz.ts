import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Get all active quiz questions sorted by sortOrder
export const getQuizConfig = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("quizQuestions")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();
  },
});

// Score user answers against result rules and return top recommendations
export const getQuizRecommendations = action({
  args: {
    answers: v.any(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch all active rules sorted by confidence
    const rules = await ctx.runQuery(api.quiz.getActiveRules);

    // Score each rule against answers
    let bestRule: any = null;
    let bestScore = -1;

    for (const rule of rules) {
      let matchCount = 0;
      const conditions = rule.conditions || {};

      for (const [key, value] of Object.entries(conditions)) {
        if (args.answers[key] === value) {
          matchCount++;
        }
      }

      const score = matchCount / Math.max(Object.keys(conditions).length, 1);
      if (score > bestScore) {
        bestScore = score;
        bestRule = rule;
      }
    }

    const recommendedProductIds = bestRule?.recommendedProductIds?.slice(0, 3) || [];

    // Fetch product details
    const products = await Promise.all(
      recommendedProductIds.map(async (id) => {
        const product = await ctx.runQuery(api.products.getById, {
          productId: id,
        });
        return product;
      })
    );

    // Save session
    await ctx.runMutation(api.quiz.saveQuizSession, {
      sessionId: args.sessionId,
      answers: args.answers,
      recommendedProductIds,
      matchedRuleId: bestRule?._id,
      segmentTag: bestRule?.segmentTag,
      emailCaptured: false,
    });

    return {
      products: products.filter(Boolean),
      matchedRuleId: bestRule?._id,
      segmentTag: bestRule?.segmentTag,
    };
  },
});

// Internal: get active rules
export const getActiveRules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("quizResultRules")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .collect();
  },
});

// Save a quiz session
export const saveQuizSession = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    answers: v.any(),
    recommendedProductIds: v.array(v.id("novaProducts")),
    matchedRuleId: v.optional(v.id("quizResultRules")),
    segmentTag: v.optional(v.string()),
    emailCaptured: v.boolean(),
    utmSource: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizSessions", {
      sessionId: args.sessionId,
      userId: args.userId,
      answers: args.answers,
      recommendedProductIds: args.recommendedProductIds,
      matchedRuleId: args.matchedRuleId,
      segmentTag: args.segmentTag,
      emailCaptured: args.emailCaptured,
      convertedToSignup: false,
      completedAt: Date.now(),
      utmSource: args.utmSource,
    });
  },
});

// Capture email from quiz result
export const captureQuizEmail = mutation({
  args: {
    sessionId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("quizSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .take(1);

    if (sessions.length > 0) {
      await ctx.db.patch(sessions[0]._id, { emailCaptured: true });
    }

    // Upsert newsletter subscriber
    const existing = await ctx.db
      .query("novaNewsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .take(1);

    if (existing.length === 0) {
      await ctx.db.insert("novaNewsletterSubscribers", {
        email: args.email,
        isActive: true,
        isVerified: false,
        source: "stack_quiz",
        subscribedAt: Date.now(),
      });
    }
  },
});
