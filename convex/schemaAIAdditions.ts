// AI Features 2.0 Schema Additions for TheSynLab
// This file contains all new tables and enhancements for AI features

import { v } from "convex/values";

// ============ NEW TABLES FOR AI FEATURES 2.0 ============

// AF-04: AI Review Sentiment Analysis
export const aiReviewSentimentSchema = {
  reviewId: v.id("productReviews"),
  productId: v.id("novaProducts"),
  overallSentimentLabel: v.union(v.literal("positive"), v.literal("neutral"), v.literal("negative")),
  overallSentimentScore: v.float64(),
  aspects: v.any(), // JSONB: { privacy, reliability, usability, support, pricing, integration_quality, onboarding, security }
  summary: v.string(),
  keyThemes: v.array(v.string()),
  sentimentStatus: v.union(v.literal("pending"), v.literal("complete"), v.literal("failed")),
  modelVersion: v.string(),
  processingDurationMs: v.optional(v.float64()),
  rawModelOutput: v.optional(v.any()),
  processedAt: v.optional(v.float64()),
};

// AF-04: Product Sentiment Aggregates
export const productSentimentAggregatesSchema = {
  productId: v.id("novaProducts"),
  overallSentimentScore: v.float64(),
  positivePercent: v.float64(),
  neutralPercent: v.float64(),
  negativePercent: v.float64(),
  aspectAverages: v.any(), // JSONB per aspect
  sentimentTrend30d: v.optional(v.float64()), // delta vs prior 30 days
  sentimentTrend90d: v.optional(v.float64()),
  topPraised: v.optional(v.string()),
  topComplained: v.optional(v.string()),
  reviewCount: v.float64(),
  lastComputedAt: v.float64(),
  isCurrent: v.boolean(),
};

// AF-09: Compliance Memos
export const complianceMemosSchema = {
  userId: v.optional(v.string()),
  sessionId: v.optional(v.string()),
  productIds: v.array(v.id("novaProducts")),
  userRegion: v.string(),
  userIndustry: v.optional(v.string()),
  requestedFrameworks: v.array(v.string()),
  memoContent: v.string(), // markdown formatted
  complianceMatrix: v.any(), // JSONB: { productId: { GDPR: pass|fail|partial, SOC2: ..., HIPAA: ... } }
  overallPosture: v.union(v.literal("compliant"), v.literal("partial"), v.literal("non_compliant")),
  criticalGaps: v.array(v.any()),
  recommendations: v.array(v.string()),
  pdfUrl: v.optional(v.string()),
  generatedAt: v.float64(),
  modelVersion: v.optional(v.string()),
};

// AF-01: AI Stack Comparisons
export const aiStackComparisonsSchema = {
  userId: v.optional(v.string()),
  sessionId: v.string(),
  stackAProductIds: v.array(v.id("novaProducts")),
  stackBProductIds: v.array(v.id("novaProducts")),
  stackALabel: v.optional(v.string()),
  stackBLabel: v.optional(v.string()),
  comparisonDimensions: v.any(), // JSONB: per-dimension delta analysis
  aiNarrative: v.string(),
  recommendedStack: v.union(v.literal("A"), v.literal("B"), v.literal("hybrid")),
  hybridRecommendation: v.optional(v.any()),
  generatedAt: v.float64(),
  viewCount: v.float64(),
  isPublic: v.boolean(),
};

// AF-06: Protocol Adoption Data
export const aiProtocolAdoptionDataSchema = {
  protocol: v.string(), // e.g. 'matter', 'zigbee', 'thread', 'homekit', 'zwave'
  productId: v.id("novaProducts"),
  supportLevel: v.union(v.literal("native"), v.literal("hub_required"), v.literal("partial"), v.literal("none")),
  supportedSince: v.optional(v.float64()),
  certificationStatus: v.optional(v.string()),
  communityVerified: v.boolean(),
  lastVerifiedAt: v.float64(),
};

// AF-06: Ecosystem Health Snapshots
export const aiEcosystemHealthSnapshotsSchema = {
  hubSlug: v.string(),
  snapshotDate: v.float64(),
  avgTrustScore: v.float64(),
  avgIntegrationScore: v.float64(),
  avgSentimentScore: v.float64(),
  vendorRiskCount: v.float64(), // number of products with elevated risk
  risingProductIds: v.array(v.id("novaProducts")),
  decliningProductIds: v.array(v.id("novaProducts")),
  breakingChangeAlerts: v.array(v.any()),
  computedBy: v.string(), // model version or 'manual'
  isCurrent: v.boolean(),
};

// AF-04: Chat with Reviews Sessions
export const aiChatWithReviewsSessionsSchema = {
  userId: v.optional(v.string()),
  productId: v.id("novaProducts"),
  conversationHistory: v.array(v.any()), // [{role, content, citedReviewIds}]
  sessionContext: v.optional(v.any()), // team size, use case, etc.
  totalMessages: v.float64(),
  startedAt: v.float64(),
  lastActivityAt: v.float64(),
  convertedToSignup: v.boolean(),
  emailCaptured: v.boolean(),
};

// AF-10: Extension Matches
export const extensionMatchesSchema = {
  productId: v.id("novaProducts"),
  domains: v.array(v.string()), // e.g. ['notion.so', 'notion.com']
  g2Url: v.optional(v.string()),
  capterraUrl: v.optional(v.string()),
  matchConfidence: v.float64(),
  isVerified: v.boolean(),
  lastVerifiedAt: v.float64(),
};

// AF-05: AI Migration Roadmaps
export const aiMigrationRoadmapsSchema = {
  simulationId: v.optional(v.id("aiScenarioResults")),
  userId: v.optional(v.string()),
  fromProductId: v.id("novaProducts"),
  toProductId: v.id("novaProducts"),
  phases: v.array(v.any()), // [{phaseNumber, title, tasks, estimatedDays, riskLevel}]
  totalEstimatedDays: v.float64(),
  totalEstimatedHours: v.float64(),
  changeManagementNotes: v.optional(v.string()),
  rollbackPlan: v.optional(v.string()),
  trainingRecommendations: v.array(v.string()),
  generatedAt: v.float64(),
  modelVersion: v.optional(v.string()),
};

// ============ ENHANCEMENTS TO EXISTING TABLES ============

// NovaProducts enhancements
export const novaProductsEnhancements = {
  complianceCertifications: v.optional(v.array(v.string())), // ['SOC2', 'GDPR', 'HIPAA', 'ISO27001']
  vendorHeadquarters: v.optional(v.string()), // country code
  dataProcessingLocations: v.optional(v.array(v.string())),
  hasBAA: v.optional(v.boolean()), // Business Associate Agreement for HIPAA
  aiTrainingOptOut: v.optional(v.boolean()),
  lastMajorUpdateAt: v.optional(v.float64()),
  acquisitionRisk: v.optional(v.string()), // 'low' | 'medium' | 'high'
  vendorFundingStage: v.optional(v.string()),
  ecosystemSlug: v.optional(v.string()), // primary ecosystem for smart home products
  sentimentAggregateId: v.optional(v.id("productSentimentAggregates")),
};

// ProductReviews enhancements
export const productReviewsEnhancements = {
  sentimentStatus: v.optional(v.union(v.literal("pending"), v.literal("complete"), v.literal("failed"))),
  sentimentProcessedAt: v.optional(v.float64()),
  sentimentModelVersion: v.optional(v.string()),
  migrationMentioned: v.optional(v.boolean()),
  complianceMentioned: v.optional(v.boolean()),
  integrationsMentioned: v.optional(v.array(v.string())),
};

// AIStackSessions enhancements
export const aiStackSessionsEnhancements = {
  complianceProfile: v.optional(v.any()), // { region, industry, frameworks[] }
  optimizeFor: v.optional(v.string()), // 'privacy' | 'cost' | 'automation' | 'minimal_vendors' | 'scalability'
  budgetMonthly: v.optional(v.float64()),
  blueprintExported: v.optional(v.boolean()),
  complianceMemoId: v.optional(v.id("complianceMemos")),
  fitScoreContext: v.optional(v.any()),
  stackHealthScore: v.optional(v.float64()), // aggregate health of the generated stack
  publicShareToken: v.optional(v.string()),
};

// AIScenarioResults enhancements
export const aiScenarioResultsEnhancements = {
  migrationRoadmapId: v.optional(v.id("aiMigrationRoadmaps")),
  integrationGaps: v.optional(v.array(v.any())), // [{fromIntegration, isLost, alternativeAvailable}]
  dataPortabilityScore: v.optional(v.float64()),
  communityMigrationCount: v.optional(v.float64()), // how many users in community made this exact switch
  successRateEstimate: v.optional(v.float64()),
  estimatedDowntimeHours: v.optional(v.float64()),
};

// AIRiskAnalyses enhancements
export const aiRiskAnalysesEnhancements = {
  complianceFrameworks: v.optional(v.any()), // {GDPR: status, SOC2: status, HIPAA: status}
  darkPatterns: v.optional(v.array(v.any())), // [{type, quote, severity, mitigation}]
  categoryPercentile: v.optional(v.float64()), // where this product ranks in category for privacy
  aiTrainingClauses: v.optional(v.boolean()),
  dataRetentionDays: v.optional(v.float64()),
  thirdPartyDataSharing: v.optional(v.boolean()),
};

// NovaUsers enhancements
export const novaUsersEnhancements = {
  complianceRegion: v.optional(v.string()),
  complianceIndustry: v.optional(v.string()),
  requiredFrameworks: v.optional(v.array(v.string())),
  extensionInstalled: v.optional(v.boolean()),
  onboardingCompleted: v.optional(v.boolean()),
  preferredOptimization: v.optional(v.string()),
  stackHealthScore: v.optional(v.float64()),
};

// AIPlaybooks enhancements
export const aiPlaybooksEnhancements = {
  complianceTags: v.optional(v.array(v.string())),
  teamSizeMin: v.optional(v.float64()),
  teamSizeMax: v.optional(v.float64()),
  estimatedImplementationHours: v.optional(v.float64()),
  budgetTier: v.optional(v.string()), // 'free' | 'low' | 'medium' | 'high'
  communityRating: v.optional(v.float64()),
  ratingCount: v.optional(v.float64()),
  prerequisiteProductIds: v.optional(v.array(v.id("novaProducts"))),
  outcomeMetrics: v.optional(v.array(v.string())),
};

// AICoachAlerts enhancements
export const aiCoachAlertsEnhancements = {
  alertCategory: v.optional(v.string()), // 'trust_drop' | 'upgrade_available' | 'compliance_gap' | 'better_alternative' | 'migration_opportunity'
  scoreDelta: v.optional(v.float64()),
  alternativeProductId: v.optional(v.id("novaProducts")),
  urgencyScore: v.optional(v.float64()),
  expiresAt: v.optional(v.float64()),
  ctaType: v.optional(v.string()), // 'run_migration' | 'view_analysis' | 'generate_blueprint' | 'view_alternative'
};