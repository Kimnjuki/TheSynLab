/**
 * HTTP router for Convex – FEAT-002 sitemap and robots.
 * Exposed at https://<deployment>.convex.site
 */

import { httpRouter } from "convex/server";
import { getSitemap, getRobots } from "./sitemap";

const http = httpRouter();

http.route({
  path: "/sitemap.xml",
  method: "GET",
  handler: getSitemap,
});

http.route({
  path: "/robots.txt",
  method: "GET",
  handler: getRobots,
});

export default http;
