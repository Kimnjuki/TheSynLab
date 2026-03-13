/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as products from "../products.js";
import type * as profiles from "../profiles.js";
import type * as tasks from "../tasks.js";
import type * as reviews from "../reviews.js";
import type * as automations from "../automations.js";
import type * as comments from "../comments.js";
import type * as users from "../users.js";
import type * as adCompliance from "../adCompliance.js";
import type * as posts from "../posts.js";
import type * as forum from "../forum.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  products: typeof products;
  profiles: typeof profiles;
  tasks: typeof tasks;
  reviews: typeof reviews;
  automations: typeof automations;
  comments: typeof comments;
  users: typeof users;
  adCompliance: typeof adCompliance;
  posts: typeof posts;
  forum: typeof forum;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
