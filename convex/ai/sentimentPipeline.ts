// AI Review Sentiment Analysis Pipeline
// AF-04: Transforms static product reviews into a personalized advisory engine

import { action, query, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

// Aspect taxonomy for sentiment analysis
const ASPECT_TAXONOMY = [
  "privacy",
  "security",
  "reliability",
  "usability",
  "support",
  "pricing",
  "integration_quality",
  "onboarding",
] as const;

type AspectName = (typeof ASPECT_TAXONOMY)[number];

interface AspectSentiment {
  label: "positive" | "neutral" | "negative";
  score: number;
  evidence?: string;
}

interface SentimentAnalysisResult {
  overallSentimentLabel: "positive" | "neutral" | "negative";
  overallSentimentScore: number;
  aspects: Record<AspectName, AspectSentiment>;
  summary: string;
  keyThemes: string[];
}

// Process a single review through the sentiment pipeline
export const processReviewSentiment = action({
  args: {
    reviewId: v.id("productReviews"),
    productId: v.id("novaProducts"),
    reviewContent: v.string(),
    reviewTitle: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const limiter = await checkAiRateLimit(ctx, `sentiment:${args.reviewId}`);
    if (!limiter.allowed) {
      await ctx.runMutation(api.aiWrite.updateReviewSentimentStatus, {
        reviewId: args.reviewId,
        status: "failed",
      });
      throw new Error(limiter.reason ?? "Rate limit exceeded");
    }

    const startTime = Date.now();

    // Get product context for better analysis
    const product = await ctx.runQuery(api.products.getById, { id: args.productId });
    const trustScore = await ctx.runQuery(api.novaTrustScores.getCurrent, { productId: args.productId });
    const integrationScore = await ctx.runQuery(api.novaIntegrationScores.getCurrent, { productId: args.productId });

    const prompt = `You are TheSynLab's AI Review Sentiment Analyzer. Analyze this product review and provide structured sentiment analysis.

Product: ${product?.productName ?? "Unknown"}
Category: ${product?.category ?? "Unknown"}
Trust Score: ${trustScore?.totalScore ?? "N/A"}
Integration Score: ${integrationScore?.totalScore ?? "N/A"}

Review Title: ${args.reviewTitle}
Review Rating: ${args.rating}/5
Review Content: ${args.reviewContent}

Analyze the review across these aspects: ${ASPECT_TAXONOMY.join(", ")}

Return JSON with this exact structure:
{
  "overallSentimentLabel": "positive" | "neutral" | "negative",
  "overallSentimentScore": 0.0-1.0,
  "aspects": {
    "privacy": { "label": "positive" | "neutral" | "negative", "score": 0.0-1.0, "evidence": "quote or summary" },
    "security": { "label": "positive" | "neutral" | "negative", "score": 0.0-1.0, "evidence": "quote or summary" },
    "reliability": { "label": "positive" | "neutral" | "negative", "score": 0.0-1.0, "evidence": "quote or summary" },
    "usability": { "label": "positive" | "neutral" | "negative", "score": 0.0-1.0, "evidence": "quote or summary" },
    "support": { "label": "positive" | "neutral" | "negative", "score": 0.0-1.0, "evidence": "quote or summary" },
    "pricing": { "label": "positive" | "neutral" | "negative", "score": 0.0-1.0, "evidence": "quote or summary" },
    "integration_quality": { "label": "positive" | "neutral" | "negative", "score": 0.0-1.0, "evidence": "quote or summary" },
    "onboarding": { "label": "positive" | "neutral" | "negative", "score": 0.0-1.0, "evidence": "quote or summary" }
  },
  "summary": "2-3 sentence summary of the review sentiment",
  "keyThemes": ["theme1", "theme2", "theme3"]
}`;

    const aiResult = await callAnthropicJson<SentimentAnalysisResult>(prompt, 1500);

    if (!aiResult) {
      await ctx.runMutation(api.aiWrite.updateReviewSentimentStatus, {
        reviewId: args.reviewId,
        status: "failed",
      });
      throw new Error("Failed to analyze review sentiment");
    }

    const processingDurationMs = Date.now() - startTime;

    // Store the sentiment analysis result
    const sentimentId = await ctx.runMutation(api.aiWrite.createReviewSentiment, {
      reviewId: args.reviewId,
      productId: args.productId,
      overallSentimentLabel: aiResult.overallSentimentLabel,
      overallSentimentScore: aiResult.overallSentimentScore,
      aspects: aiResult.aspects,
      summary: aiResult.summary,
      keyThemes: aiResult.keyThemes,
      modelVersion: "claude-sonnet-4-20250514",
      processingDurationMs,
      processedAt: Date.now(),
    });

    // Update the review with sentiment status
    await ctx.runMutation(api.aiWrite.updateReviewSentimentStatus, {
      reviewId: args.reviewId,
      status: "complete",
      processedAt: Date.now(),
      modelVersion: "claude-sonnet-4-20250514",
    });

    // Update product sentiment aggregates
    await ctx.runAction(api.ai.sentimentPipeline.updateProductSentimentAggregates, {
      productId: args.productId,
    });

    return { sentimentId, ...aiResult };
  },
});

// Batch process pending reviews
export const batchProcessPendingReviews = action({
  args: {
    maxReviews: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const maxReviews = args.maxReviews ?? 10;

    // Find reviews pending sentiment analysis using internal query
    const pendingReviews = await ctx.runQuery(api.ai.sentimentPipeline.getPendingReviews, {
      limit: maxReviews,
    });

    const results = [];
    for (const review of pendingReviews) {
      try {
        const result = await ctx.runAction(api.ai.sentimentPipeline.processReviewSentiment, {
          reviewId: review._id,
          productId: review.productId,
          reviewContent: review.reviewContent,
          reviewTitle: review.reviewTitle,
          rating: review.rating,
        });
        results.push({ reviewId: review._id, success: true, result });
      } catch (error) {
        results.push({ reviewId: review._id, success: false, error: String(error) });
      }
    }

    return results;
  },
});

// Get pending reviews (internal query for actions)
export const getPendingReviews = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const reviews = await ctx.db
      .query("productReviews")
      .filter((q) =>
        q.or(
          q.eq(q.field("sentimentStatus"), undefined),
          q.eq(q.field("sentimentStatus"), "pending"),
        )
      )
      .take(limit);
    return reviews;
  },
});

// Update product-level sentiment aggregates
export const updateProductSentimentAggregates = action({
  args: {
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    // Get all completed sentiment analyses for this product
    const sentiments = await ctx.runQuery(api.ai.sentimentPipeline.getProductSentiments, {
      productId: args.productId,
    });

    if (!sentiments || sentiments.length === 0) {
      return null;
    }

    // Calculate aggregates
    const totalScore = sentiments.reduce((sum: number, s: any) => sum + s.overallSentimentScore, 0);
    const avgScore = totalScore / sentiments.length;

    const positiveCount = sentiments.filter((s: any) => s.overallSentimentLabel === "positive").length;
    const neutralCount = sentiments.filter((s: any) => s.overallSentimentLabel === "neutral").length;
    const negativeCount = sentiments.filter((s: any) => s.overallSentimentLabel === "negative").length;

    // Calculate aspect averages
    const aspectAverages: Record<string, { sum: number; count: number }> = {};
    for (const sentiment of sentiments) {
      const aspects = sentiment.aspects || {};
      for (const [aspect, data] of Object.entries(aspects)) {
        if (!aspectAverages[aspect]) {
          aspectAverages[aspect] = { sum: 0, count: 0 };
        }
        aspectAverages[aspect].sum += (data as any).score || 0;
        aspectAverages[aspect].count += 1;
      }
    }

    const aspectAvgResults: Record<string, number> = {};
    for (const [aspect, data] of Object.entries(aspectAverages)) {
      aspectAvgResults[aspect] = data.sum / data.count;
    }

    // Find top praised and complained themes
    const themeCounts: Record<string, { praised: number; complained: number }> = {};
    for (const sentiment of sentiments) {
      for (const theme of sentiment.keyThemes || []) {
        if (!themeCounts[theme]) {
          themeCounts[theme] = { praised: 0, complained: 0 };
        }
        if (sentiment.overallSentimentLabel === "positive") {
          themeCounts[theme].praised += 1;
        } else if (sentiment.overallSentimentLabel === "negative") {
          themeCounts[theme].complained += 1;
        }
      }
    }

    const topPraised = Object.entries(themeCounts)
      .sort((a, b) => b[1].praised - a[1].praised)[0]?.[0];
    const topComplained = Object.entries(themeCounts)
      .sort((a, b) => b[1].complained - a[1].complained)[0]?.[0];

    // Create new aggregate
    const aggregateId = await ctx.runMutation(api.aiWrite.createProductSentimentAggregate, {
      productId: args.productId,
      overallSentimentScore: avgScore,
      positivePercent: (positiveCount / sentiments.length) * 100,
      neutralPercent: (neutralCount / sentiments.length) * 100,
      negativePercent: (negativeCount / sentiments.length) * 100,
      aspectAverages: aspectAvgResults,
      topPraised,
      topComplained,
      reviewCount: sentiments.length,
    });

    return { aggregateId, avgScore, reviewCount: sentiments.length };
  },
});

// Get product sentiments (internal query for actions)
export const getProductSentiments = query({
  args: {
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    const sentiments = await ctx.db
      .query("aiReviewSentiment")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("sentimentStatus"), "complete"))
      .collect();
    return sentiments;
  },
});

// Query: Get product sentiment
export const getProductSentiment = query({
  args: {
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    const aggregate = await ctx.db
      .query("productSentimentAggregates")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();

    if (!aggregate) {
      return null;
    }

    // Get recent sentiment trends
    const recentSentiments = await ctx.db
      .query("aiReviewSentiment")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .take(30);

    return {
      ...aggregate,
      recentSentiments: recentSentiments.slice(0, 10),
    };
  },
});

// Query: Get sentiment trend for a product
export const getSentimentTrend = query({
  args: {
    productId: v.id("novaProducts"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const days = args.days ?? 90;
    const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

    const sentiments = await ctx.db
      .query("aiReviewSentiment")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) =>
        q.and(
          q.eq(q.field("sentimentStatus"), "complete"),
          q.gte(q.field("processedAt"), cutoffDate),
        ),
      )
      .collect();

    // Group by week for trend analysis
    const weeklyTrends: Record<string, { scores: number[]; count: number }> = {};
    for (const sentiment of sentiments) {
      const weekKey = new Date(sentiment.processedAt || 0).toISOString().slice(0, 10);
      if (!weeklyTrends[weekKey]) {
        weeklyTrends[weekKey] = { scores: [], count: 0 };
      }
      weeklyTrends[weekKey].scores.push(sentiment.overallSentimentScore);
      weeklyTrends[weekKey].count += 1;
    }

    const trendData = Object.entries(weeklyTrends)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        avgScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        count: data.count,
      }));

    return trendData;
  },
});