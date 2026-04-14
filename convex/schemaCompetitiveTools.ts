// =====================================
// TOOL/COMPETITOR ANALYSIS SCHEMA 2.0
// =====================================
// This file contains all new tables and enhancements for the competitive intelligence layer
// Implements the G2/Product Hunt competitive intelligence strategy

import { v } from "convex/values";

// -----------------------------------------------------------------------------
// COMPETITOR INTELLIGENCE TABLES
// -----------------------------------------------------------------------------

// Competitive benchmarking data
export const toolCompetitorsSchema = {
  productId: v.id("novaProducts"),
  competitorName: v.string(),
  competitorUrl: v.string(),
  competitorType: v.union(v.literal("direct"), v.literal("indirect"), v.literal("alternative"), v.literal("complement")),
  marketPosition: v.union(v.literal("leader"), v.literal("challenger"), v.literal("niche"), v.literal("emerging")),
  pricingModel: v.string(),
  targetAudience: v.array(v.string()),
  keyDifferentiators: v.array(v.string()),
  integrationScore: v.optional(v.number()),
  trustScore: v.optional(v.number()),
  marketShare: v.optional(v.number()),
  growthRate: v.optional(v.number()),
  lastUpdated: v.number(),
  source: v.union(v.literal("g2"), v.literal("producthunt"), v.literal("capterra"), v.literal("direct"), v.literal("ai_analysis")),
  sourceUrl: v.optional(v.string()),
  competitorFeatures: v.optional(v.any()),
  pricingTiers: v.optional(v.any()),
  userSentiment: v.optional(v.any()),
  seoMetrics: v.optional(v.any()),
};

// Structured tool feature data
export const toolFeaturesSchema = {
  productId: v.id("novaProducts"),
  featureCategory: v.string(),
  featureName: v.string(),
  featureDescription: v.string(),
  featureType: v.union(v.literal("core"), v.literal("advanced"), v.literal("integration"), v.literal("support"), v.literal("security")),
  isAvailable: v.boolean(),
  isPremium: v.boolean(),
  featureScore: v.optional(v.number()),
  competitorComparison: v.optional(v.any()),
  lastUpdated: v.number(),
  source: v.union(v.literal("vendor"), v.literal("user"), v.literal("ai_analysis"), v.literal("editorial")),
  sourceUrl: v.optional(v.string()),
};

// Pricing intelligence data
export const toolPricingSchema = {
  productId: v.id("novaProducts"),
  pricingTier: v.string(),
  priceAmount: v.number(),
  priceCurrency: v.string(),
  billingCycle: v.union(v.literal("monthly"), v.literal("annual"), v.literal("one_time"), v.literal("usage_based"), v.literal("enterprise")),
  featuresIncluded: v.array(v.string()),
  targetUsers: v.array(v.string()),
  competitorPricing: v.optional(v.any()),
  priceScore: v.optional(v.number()),
  valueScore: v.optional(v.number()),
  lastUpdated: v.number(),
  source: v.union(v.literal("vendor"), v.literal("user"), v.literal("ai_analysis"), v.literal("editorial")),
  sourceUrl: v.optional(v.string()),
};

// Tool vs tool comparison data
export const toolComparisonsSchema = {
  productAId: v.id("novaProducts"),
  productBId: v.id("novaProducts"),
  comparisonSlug: v.string(),
  featureComparisons: v.any(),
  pricingComparisons: v.any(),
  trustScoreDelta: v.optional(v.number()),
  integrationScoreDelta: v.optional(v.number()),
  overallVerdict: v.string(),
  recommendation: v.string(),
  aiAnalysis: v.optional(v.any()),
  userSentiment: v.optional(v.any()),
  seoMetrics: v.optional(v.any()),
  viewCount: v.optional(v.number()),
  lastUpdated: v.number(),
  source: v.union(v.literal("ai"), v.literal("user"), v.literal("editorial")),
  sourceUrl: v.optional(v.string()),
};

// Tool alternatives relationship
export const toolAlternativesSchema = {
  primaryProductId: v.id("novaProducts"),
  alternativeProductId: v.id("novaProducts"),
  alternativeType: v.union(v.literal("direct"), v.literal("indirect"), v.literal("budget"), v.literal("premium"), v.literal("complement")),
  similarityScore: v.number(),
  keyDifferences: v.array(v.string()),
  bestFor: v.array(v.string()),
  pricingComparison: v.optional(v.any()),
  featureComparison: v.optional(v.any()),
  userSentiment: v.optional(v.any()),
  seoMetrics: v.optional(v.any()),
  lastUpdated: v.number(),
  source: v.union(v.literal("ai"), v.literal("user"), v.literal("editorial")),
  sourceUrl: v.optional(v.string()),
};

// Tool use case mapping
export const toolUseCasesSchema = {
  productId: v.id("novaProducts"),
  useCaseName: v.string(),
  useCaseDescription: v.string(),
  targetUsers: v.array(v.string()),
  requiredFeatures: v.array(v.string()),
  pricingTier: v.string(),
  competitorAlternatives: v.optional(v.any()),
  seoMetrics: v.optional(v.any()),
  lastUpdated: v.number(),
  source: v.union(v.literal("vendor"), v.literal("user"), v.literal("ai_analysis")),
  sourceUrl: v.optional(v.string()),
};

// SEO performance tracking for tools
export const toolSeoMetricsSchema = {
  productId: v.id("novaProducts"),
  keyword: v.string(),
  keywordType: v.union(v.literal("brand"), v.literal("category"), v.literal("feature"), v.literal("comparison"), v.literal("alternatives")),
  monthlySearchVolume: v.number(),
  keywordDifficulty: v.number(),
  currentRank: v.number(),
  competitorRanks: v.optional(v.any()),
  serpFeatures: v.optional(v.array(v.string())),
  lastUpdated: v.number(),
  source: v.union(v.literal("semrush"), v.literal("ahrefs"), v.literal("google_search_console"), v.literal("ai_analysis")),
};

// -----------------------------------------------------------------------------
// CONTENT TEMPLATE DEFINITIONS
// -----------------------------------------------------------------------------

// Standardized content templates for SEO pages
export const contentTemplatesSchema = {
  templateType: v.union(v.literal("tool_review"), v.literal("alternatives"), v.literal("comparison"), v.literal("use_case_roundup")),
  templateName: v.string(),
  templateSlug: v.string(),
  sections: v.array(v.any()),
  seoGuidelines: v.any(),
  schemaMarkup: v.any(),
  isActive: v.boolean(),
  createdBy: v.string(),
  createdAt: v.number(),
  lastUpdated: v.number(),
  usageCount: v.number(),
};

// Generated content pages
export const generatedContentPagesSchema = {
  pageType: v.string(),
  pageSlug: v.string(),
  productId: v.optional(v.id("novaProducts")),
  comparisonId: v.optional(v.id("toolComparisons")),
  templateId: v.id("contentTemplates"),
  contentStatus: v.union(v.literal("draft"), v.literal("reviewed"), v.literal("published"), v.literal("archived")),
  seoTitle: v.string(),
  metaDescription: v.string(),
  contentHash: v.string(),
  publishedAt: v.optional(v.number()),
  viewCount: v.optional(v.number()),
  lastUpdated: v.number(),
  generatedBy: v.string(),
  aiModelVersion: v.optional(v.string()),
};

// -----------------------------------------------------------------------------
// COMPETITOR TRACKING & MONITORING
// -----------------------------------------------------------------------------

// Competitor activity tracking
export const competitorActivityLogSchema = {
  competitorName: v.string(),
  activityType: v.union(v.literal("pricing_change"), v.literal("feature_launch"), v.literal("funding"), v.literal("acquisition"), v.literal("rebrand"), v.literal("new_integration")),
  activityTitle: v.string(),
  activityDescription: v.string(),
  sourceUrl: v.string(),
  detectedAt: v.number(),
  impactScore: v.optional(v.number()),
  actionRequired: v.boolean(),
  status: v.union(v.literal("new"), v.literal("reviewed"), v.literal("responded"), v.literal("ignored")),
};

// Competitor SEO monitoring
export const competitorSeoTrackingSchema = {
  competitorDomain: v.string(),
  trackedKeyword: v.string(),
  currentRank: v.number(),
  previousRank: v.number(),
  rankChange: v.number(),
  lastChecked: v.number(),
  trend: v.union(v.literal("rising"), v.literal("falling"), v.literal("stable")),
  ourRank: v.optional(v.number()),
  gapDelta: v.optional(v.number()),
};

// -----------------------------------------------------------------------------
// ENHANCEMENTS TO EXISTING TABLES
// -----------------------------------------------------------------------------

// NovaProducts enhancements for competitive intelligence
export const novaProductsCompetitiveEnhancements = {
  competitivePosition: v.optional(v.string()), // leader, challenger, niche
  marketLeaderStatus: v.optional(v.boolean()),
  primaryCompetitorIds: v.optional(v.array(v.id("novaProducts"))),
  alternativeCount: v.optional(v.number()),
  comparisonCount: v.optional(v.number()),
  seoOpportunityScore: v.optional(v.number()),
  competitorBenchmarkLastUpdated: v.optional(v.number()),
  g2ListingUrl: v.optional(v.string()),
  productHuntListingUrl: v.optional(v.string()),
  capterraListingUrl: v.optional(v.string()),
};