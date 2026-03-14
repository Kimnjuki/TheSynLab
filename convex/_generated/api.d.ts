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
import type * as automations from "../automations.js";
import type * as blockchain_publishReview from "../blockchain/publishReview.js";
import type * as comments from "../comments.js";
import type * as community_leaderboard from "../community/leaderboard.js";
import type * as forum from "../forum.js";
import type * as http from "../http.js";
import type * as i18n_translateReview from "../i18n/translateReview.js";
import type * as integrationScores from "../integrationScores.js";
import type * as mlPredictionJobs from "../mlPredictionJobs.js";
import type * as ml_featureExtractor from "../ml/featureExtractor.js";
import type * as newsletter from "../newsletter.js";
import type * as posts from "../posts.js";
import type * as products from "../products.js";
import type * as profiles from "../profiles.js";
import type * as recommendations_matchScore from "../recommendations/matchScore.js";
import type * as reviews from "../reviews.js";
import type * as rss from "../rss.js";
import type * as seed from "../seed.js";
import type * as simulator_getCompatibility from "../simulator/getCompatibility.js";
import type * as sitemap from "../sitemap.js";
import type * as tasks from "../tasks.js";
import type * as tco_energyCost from "../tco/energyCost.js";
import type * as tco_personalizedTco from "../tco/personalizedTco.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adCompliance: typeof adCompliance;
  automations: typeof automations;
  "blockchain/publishReview": typeof blockchain_publishReview;
  comments: typeof comments;
  "community/leaderboard": typeof community_leaderboard;
  forum: typeof forum;
  http: typeof http;
  "i18n/translateReview": typeof i18n_translateReview;
  integrationScores: typeof integrationScores;
  mlPredictionJobs: typeof mlPredictionJobs;
  "ml/featureExtractor": typeof ml_featureExtractor;
  newsletter: typeof newsletter;
  posts: typeof posts;
  products: typeof products;
  profiles: typeof profiles;
  "recommendations/matchScore": typeof recommendations_matchScore;
  reviews: typeof reviews;
  rss: typeof rss;
  seed: typeof seed;
  "simulator/getCompatibility": typeof simulator_getCompatibility;
  sitemap: typeof sitemap;
  tasks: typeof tasks;
  "tco/energyCost": typeof tco_energyCost;
  "tco/personalizedTco": typeof tco_personalizedTco;
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
