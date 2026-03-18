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
import type * as apiKeys from "../apiKeys.js";
import type * as automations from "../automations.js";
import type * as blockchain_publishReview from "../blockchain/publishReview.js";
import type * as comments from "../comments.js";
import type * as community_leaderboard from "../community/leaderboard.js";
import type * as cronHandlers from "../cronHandlers.js";
import type * as crons from "../crons.js";
import type * as forum from "../forum.js";
import type * as gdpr from "../gdpr.js";
import type * as http from "../http.js";
import type * as i18n_translateReview from "../i18n/translateReview.js";
import type * as integrationScores from "../integrationScores.js";
import type * as integrationSimulations from "../integrationSimulations.js";
import type * as mlPredictionJobs from "../mlPredictionJobs.js";
import type * as ml_featureExtractor from "../ml/featureExtractor.js";
import type * as ml_predictReliability from "../ml/predictReliability.js";
import type * as newsletter from "../newsletter.js";
import type * as posts from "../posts.js";
import type * as products from "../products.js";
import type * as profiles from "../profiles.js";
import type * as recommendations_matchScore from "../recommendations/matchScore.js";
import type * as redirectRules from "../redirectRules.js";
import type * as reviewTranslations from "../reviewTranslations.js";
import type * as reviews from "../reviews.js";
import type * as roiCalculations from "../roiCalculations.js";
import type * as rss from "../rss.js";
import type * as scoreWeightProposals from "../scoreWeightProposals.js";
import type * as scores from "../scores.js";
import type * as search from "../search.js";
import type * as security from "../security.js";
import type * as seed from "../seed.js";
import type * as seedCompetitiveProducts from "../seedCompetitiveProducts.js";
import type * as simulator_getCompatibility from "../simulator/getCompatibility.js";
import type * as sitemap from "../sitemap.js";
import type * as synTokenLedger from "../synTokenLedger.js";
import type * as tasks from "../tasks.js";
import type * as tco_energyCost from "../tco/energyCost.js";
import type * as tco_personalizedTco from "../tco/personalizedTco.js";
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
  apiKeys: typeof apiKeys;
  automations: typeof automations;
  "blockchain/publishReview": typeof blockchain_publishReview;
  comments: typeof comments;
  "community/leaderboard": typeof community_leaderboard;
  cronHandlers: typeof cronHandlers;
  crons: typeof crons;
  forum: typeof forum;
  gdpr: typeof gdpr;
  http: typeof http;
  "i18n/translateReview": typeof i18n_translateReview;
  integrationScores: typeof integrationScores;
  integrationSimulations: typeof integrationSimulations;
  mlPredictionJobs: typeof mlPredictionJobs;
  "ml/featureExtractor": typeof ml_featureExtractor;
  "ml/predictReliability": typeof ml_predictReliability;
  newsletter: typeof newsletter;
  posts: typeof posts;
  products: typeof products;
  profiles: typeof profiles;
  "recommendations/matchScore": typeof recommendations_matchScore;
  redirectRules: typeof redirectRules;
  reviewTranslations: typeof reviewTranslations;
  reviews: typeof reviews;
  roiCalculations: typeof roiCalculations;
  rss: typeof rss;
  scoreWeightProposals: typeof scoreWeightProposals;
  scores: typeof scores;
  search: typeof search;
  security: typeof security;
  seed: typeof seed;
  seedCompetitiveProducts: typeof seedCompetitiveProducts;
  "simulator/getCompatibility": typeof simulator_getCompatibility;
  sitemap: typeof sitemap;
  synTokenLedger: typeof synTokenLedger;
  tasks: typeof tasks;
  "tco/energyCost": typeof tco_energyCost;
  "tco/personalizedTco": typeof tco_personalizedTco;
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
