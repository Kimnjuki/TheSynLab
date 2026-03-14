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
import type * as comments from "../comments.js";
import type * as forum from "../forum.js";
import type * as http from "../http.js";
import type * as newsletter from "../newsletter.js";
import type * as posts from "../posts.js";
import type * as products from "../products.js";
import type * as profiles from "../profiles.js";
import type * as reviews from "../reviews.js";
import type * as rss from "../rss.js";
import type * as seed from "../seed.js";
import type * as sitemap from "../sitemap.js";
import type * as tasks from "../tasks.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  adCompliance: typeof adCompliance;
  automations: typeof automations;
  comments: typeof comments;
  forum: typeof forum;
  http: typeof http;
  newsletter: typeof newsletter;
  posts: typeof posts;
  products: typeof products;
  profiles: typeof profiles;
  reviews: typeof reviews;
  rss: typeof rss;
  seed: typeof seed;
  sitemap: typeof sitemap;
  tasks: typeof tasks;
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
