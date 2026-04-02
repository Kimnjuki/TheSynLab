/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adCompliance from "../adCompliance.js";
import type * as affiliatePrices from "../affiliatePrices.js";
import type * as aiAudit from "../aiAudit.js";
import type * as aiData from "../aiData.js";
import type * as aiRateLimit from "../aiRateLimit.js";
import type * as aiRead from "../aiRead.js";
import type * as aiWrite from "../aiWrite.js";
import type * as ai__utils_aiRateLimiter from "../ai/_utils/aiRateLimiter.js";
import type * as ai__utils_anthropic from "../ai/_utils/anthropic.js";
import type * as ai__utils_auditLogger from "../ai/_utils/auditLogger.js";
import type * as ai__utils_cacheManager from "../ai/_utils/cacheManager.js";
import type * as ai__utils_productEnricher from "../ai/_utils/productEnricher.js";
import type * as ai__utils_scoreContextBuilder from "../ai/_utils/scoreContextBuilder.js";
import type * as ai_anomalyDetector from "../ai/anomalyDetector.js";
import type * as ai_communityMiner from "../ai/communityMiner.js";
import type * as ai_comparisonWriter from "../ai/comparisonWriter.js";
import type * as ai_integrationMapper from "../ai/integrationMapper.js";
import type * as ai_labCoach from "../ai/labCoach.js";
import type * as ai_playbookGenerator from "../ai/playbookGenerator.js";
import type * as ai_reviewCopilot from "../ai/reviewCopilot.js";
import type * as ai_reviewDraftAssistant from "../ai/reviewDraftAssistant.js";
import type * as ai_riskAnalyzer from "../ai/riskAnalyzer.js";
import type * as ai_scenarioEngine from "../ai/scenarioEngine.js";
import type * as ai_schedulers from "../ai/schedulers.js";
import type * as ai_scoreExplainer from "../ai/scoreExplainer.js";
import type * as ai_setupSummarizer from "../ai/setupSummarizer.js";
import type * as ai_stackArchitect from "../ai/stackArchitect.js";
import type * as ai_workflowRecipes from "../ai/workflowRecipes.js";
import type * as apiCompatibility from "../apiCompatibility.js";
import type * as apiKeys from "../apiKeys.js";
import type * as authorityArticlesPayload from "../authorityArticlesPayload.js";
import type * as automations from "../automations.js";
import type * as bestFor from "../bestFor.js";
import type * as blockchain_publishReview from "../blockchain/publishReview.js";
import type * as comments from "../comments.js";
import type * as community from "../community.js";
import type * as communityScoreRatings from "../communityScoreRatings.js";
import type * as community_leaderboard from "../community/leaderboard.js";
import type * as comparisons from "../comparisons.js";
import type * as compatibilityLeaderboard from "../compatibilityLeaderboard.js";
import type * as cronHandlers from "../cronHandlers.js";
import type * as crons from "../crons.js";
import type * as forum from "../forum.js";
import type * as forumModeration from "../forumModeration.js";
import type * as gdpr from "../gdpr.js";
import type * as homepageInsights from "../homepageInsights.js";
import type * as http from "../http.js";
import type * as hubBuilder from "../hubBuilder.js";
import type * as hubKeywords from "../hubKeywords.js";
import type * as hubs from "../hubs.js";
import type * as i18n_translateReview from "../i18n/translateReview.js";
import type * as integrationRecipes from "../integrationRecipes.js";
import type * as integrationScores from "../integrationScores.js";
import type * as integrationSimulations from "../integrationSimulations.js";
import type * as internalLinks from "../internalLinks.js";
import type * as livingGuides from "../livingGuides.js";
import type * as mlPredictionJobs from "../mlPredictionJobs.js";
import type * as ml_featureExtractor from "../ml/featureExtractor.js";
import type * as ml_predictReliability from "../ml/predictReliability.js";
import type * as newsletter from "../newsletter.js";
import type * as novaTrustScores from "../novaTrustScores.js";
import type * as paa from "../paa.js";
import type * as pillarGuides from "../pillarGuides.js";
import type * as posts from "../posts.js";
import type * as productAlerts from "../productAlerts.js";
import type * as productBookmarks from "../productBookmarks.js";
import type * as productFinder from "../productFinder.js";
import type * as products from "../products.js";
import type * as profiles from "../profiles.js";
import type * as recommendations_matchScore from "../recommendations/matchScore.js";
import type * as redirectRules from "../redirectRules.js";
import type * as reviewTranslations from "../reviewTranslations.js";
import type * as reviews from "../reviews.js";
import type * as roiCalculations from "../roiCalculations.js";
import type * as rss from "../rss.js";
import type * as scoreIndexes from "../scoreIndexes.js";
import type * as scoreWeightProposals from "../scoreWeightProposals.js";
import type * as scores from "../scores.js";
import type * as search from "../search.js";
import type * as security from "../security.js";
import type * as seed from "../seed.js";
import type * as seedCompetitiveProducts from "../seedCompetitiveProducts.js";
import type * as seedSmartHomeArticles from "../seedSmartHomeArticles.js";
import type * as seoOpportunities from "../seoOpportunities.js";
import type * as seoSchema from "../seoSchema.js";
import type * as simulator_getCompatibility from "../simulator/getCompatibility.js";
import type * as sitemap from "../sitemap.js";
import type * as synTokenLedger from "../synTokenLedger.js";
import type * as tasks from "../tasks.js";
import type * as tco_energyCost from "../tco/energyCost.js";
import type * as tco_personalizedTco from "../tco/personalizedTco.js";
import type * as tools from "../tools.js";
import type * as userWorkflowConfigs from "../userWorkflowConfigs.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adCompliance: typeof adCompliance;
  affiliatePrices: typeof affiliatePrices;
  aiAudit: typeof aiAudit;
  aiData: typeof aiData;
  aiRateLimit: typeof aiRateLimit;
  aiRead: typeof aiRead;
  aiWrite: typeof aiWrite;
  "ai/_utils/aiRateLimiter": typeof ai__utils_aiRateLimiter;
  "ai/_utils/anthropic": typeof ai__utils_anthropic;
  "ai/_utils/auditLogger": typeof ai__utils_auditLogger;
  "ai/_utils/cacheManager": typeof ai__utils_cacheManager;
  "ai/_utils/productEnricher": typeof ai__utils_productEnricher;
  "ai/_utils/scoreContextBuilder": typeof ai__utils_scoreContextBuilder;
  "ai/anomalyDetector": typeof ai_anomalyDetector;
  "ai/communityMiner": typeof ai_communityMiner;
  "ai/comparisonWriter": typeof ai_comparisonWriter;
  "ai/integrationMapper": typeof ai_integrationMapper;
  "ai/labCoach": typeof ai_labCoach;
  "ai/playbookGenerator": typeof ai_playbookGenerator;
  "ai/reviewCopilot": typeof ai_reviewCopilot;
  "ai/reviewDraftAssistant": typeof ai_reviewDraftAssistant;
  "ai/riskAnalyzer": typeof ai_riskAnalyzer;
  "ai/scenarioEngine": typeof ai_scenarioEngine;
  "ai/schedulers": typeof ai_schedulers;
  "ai/scoreExplainer": typeof ai_scoreExplainer;
  "ai/setupSummarizer": typeof ai_setupSummarizer;
  "ai/stackArchitect": typeof ai_stackArchitect;
  "ai/workflowRecipes": typeof ai_workflowRecipes;
  apiCompatibility: typeof apiCompatibility;
  apiKeys: typeof apiKeys;
  authorityArticlesPayload: typeof authorityArticlesPayload;
  automations: typeof automations;
  bestFor: typeof bestFor;
  "blockchain/publishReview": typeof blockchain_publishReview;
  comments: typeof comments;
  community: typeof community;
  communityScoreRatings: typeof communityScoreRatings;
  "community/leaderboard": typeof community_leaderboard;
  comparisons: typeof comparisons;
  compatibilityLeaderboard: typeof compatibilityLeaderboard;
  cronHandlers: typeof cronHandlers;
  crons: typeof crons;
  forum: typeof forum;
  forumModeration: typeof forumModeration;
  gdpr: typeof gdpr;
  homepageInsights: typeof homepageInsights;
  http: typeof http;
  hubBuilder: typeof hubBuilder;
  hubKeywords: typeof hubKeywords;
  hubs: typeof hubs;
  "i18n/translateReview": typeof i18n_translateReview;
  integrationRecipes: typeof integrationRecipes;
  integrationScores: typeof integrationScores;
  integrationSimulations: typeof integrationSimulations;
  internalLinks: typeof internalLinks;
  livingGuides: typeof livingGuides;
  mlPredictionJobs: typeof mlPredictionJobs;
  "ml/featureExtractor": typeof ml_featureExtractor;
  "ml/predictReliability": typeof ml_predictReliability;
  newsletter: typeof newsletter;
  novaTrustScores: typeof novaTrustScores;
  paa: typeof paa;
  pillarGuides: typeof pillarGuides;
  posts: typeof posts;
  productAlerts: typeof productAlerts;
  productBookmarks: typeof productBookmarks;
  productFinder: typeof productFinder;
  products: typeof products;
  profiles: typeof profiles;
  "recommendations/matchScore": typeof recommendations_matchScore;
  redirectRules: typeof redirectRules;
  reviewTranslations: typeof reviewTranslations;
  reviews: typeof reviews;
  roiCalculations: typeof roiCalculations;
  rss: typeof rss;
  scoreIndexes: typeof scoreIndexes;
  scoreWeightProposals: typeof scoreWeightProposals;
  scores: typeof scores;
  search: typeof search;
  security: typeof security;
  seed: typeof seed;
  seedCompetitiveProducts: typeof seedCompetitiveProducts;
  seedSmartHomeArticles: typeof seedSmartHomeArticles;
  seoOpportunities: typeof seoOpportunities;
  seoSchema: typeof seoSchema;
  "simulator/getCompatibility": typeof simulator_getCompatibility;
  sitemap: typeof sitemap;
  synTokenLedger: typeof synTokenLedger;
  tasks: typeof tasks;
  "tco/energyCost": typeof tco_energyCost;
  "tco/personalizedTco": typeof tco_personalizedTco;
  tools: typeof tools;
  userWorkflowConfigs: typeof userWorkflowConfigs;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
