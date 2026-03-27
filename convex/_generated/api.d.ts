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
