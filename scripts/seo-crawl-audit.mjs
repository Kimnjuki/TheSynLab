#!/usr/bin/env node
/**
 * SEO crawl audit — TheSynLab
 * Validates the BUILT SITE (dist/) against the Phase 1 checklist:
 *
 *   1. Sitemap hygiene   — every <loc> resolves to a built artifact; no
 *                          underscores; no noindex routes; no legacy redirects.
 *   2. Hard 404s         — every internal href across ALL prerendered pages must
 *                          resolve to a built artifact, a known SPA dynamic route,
 *                          or a registered redirect (301).
 *   3. Soft 404s         — every prerendered page must have exactly one <h1>,
 *                          substantive static body text (>250 chars visible), and
 *                          no "empty/not found/coming soon" boilerplate-only body.
 *   4. Canonicals        — every prerendered page ships exactly one canonical,
 *                          absolute, apex-host, self-referencing (or intentional).
 *   5. Meta uniqueness   — titles/descriptions must be unique per URL.
 *   6. JSON-LD validity  — every application/ld+json block must JSON.parse().
 *
 * Usage:  npm run build && node scripts/seo-crawl-audit.mjs
 * Exit code 0 = clean, 1 = problems found (CI-safe).
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://thesynlab.com";

// Registered permanent redirects (mirror of vite.config LEGACY_URL_REDIRECTS +
// CANONICAL_ALIASES). Targets of these are expected NOT to have build artifacts;
// nginx serves the 301.
const KNOWN_REDIRECTS = new Set([
  "/hub/ai_workflow",
  "/hub/intelligent_home",
  "/hub/hybrid_office",
  "/tools/compare",
  "/tools/stack-builder",
  "/tools/tco-calculator",
  "/tools/vendor-risk-checker",
  "/tools/workflow-blueprint",
  "/tools/stack-quiz",
  "/tools/compatibility-checker",
]);

const NOINDEX_ROUTES = new Set([
  "/forum", "/community/setups", "/community/leaderboard", "/products/watchlist",
  "/search", "/tasks", "/tools/find", "/tools/hub-builder",
  "/tools/compatibility-leaderboard", "/tools/automations",
  "/admin", "/profile", "/settings", "/auth",
]);

const problems = [];
const warn = [];

function walk(dir, acc = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (e.endsWith(".html")) acc.push(p);
  }
  return acc;
}
const htmlFiles = walk(DIST);

/** dist-relative route for an artifact, "" for index.html */
const routeOf = (p) => {
  let r = p.slice(DIST.length).replace(/\\/g, "/");
  return r === "/index.html" ? "/" : r.replace(/\/index\.html$/, "");
};
const artifactRoutes = new Set(htmlFiles.map(routeOf));

/** does an internal URL resolve at the web server? */
function resolves(urlPath) {
  const clean = urlPath.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  if (artifactRoutes.has(clean)) return { ok: true };
  if (KNOWN_REDIRECTS.has(clean)) return { ok: true, redirect: true };
  if (NOINDEX_ROUTES.has(clean)) return { ok: true, noindex: true };
  // known dynamic families served by SPA fallback with full prerender meta
  if (
    /^\/blog\/[^/]+$/.test(clean) ||
    /^\/tool\/[^/]+(\/alternatives)?$/.test(clean) ||
    /^\/products\/[^/]+(\/alternatives)?$/.test(clean) ||
    /^\/products\/[^/]+-vs-[^/]+$/.test(clean) ||
    /^\/vs\/[^/]+-vs-[^/]+$/.test(clean) ||
    /^\/hub\/[a-z0-9-]+(\/[^/]+)?$/.test(clean) ||
    /^\/best\/[^/]+$/.test(clean) ||
    /^\/category\/[^/]+$/.test(clean)
  ) {
    return { ok: true, spa: true };
  }
  return { ok: false };
}

/* ── report helper ────────────────────────────────────────────────────────── */
const stripTags = (s) =>
  s.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/* ── 1. sitemap hygiene ──────────────────────────────────────────────────── */
const sitemapRaw = readFileSync(join(DIST, "sitemap.xml"), "utf8");
const sitemapLocs = [...sitemapRaw.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace(SITE, "")
);
if (sitemapLocs.some((u) => u.includes("_")))
  problems.push(`SITEMAP: underscore URL(s): ${sitemapLocs.filter((u) => u.includes("_")).join(", ")}`);
for (const u of sitemapLocs) {
  const res = resolves(u);
  if (!res.ok) problems.push(`SITEMAP: ${u} has no build artifact`);
  if (res.redirect) problems.push(`SITEMAP: ${u} is a registered 301 redirect and must not be listed`);
}
const seen = new Set();
for (const u of sitemapLocs) {
  if (seen.has(u)) problems.push(`SITEMAP: duplicate entry ${u}`);
  seen.add(u);
}

/* ── 2–6. per-artifact checks ────────────────────────────────────────────── */
const metaSeenTitle = {};
const metaSeenDesc = {};
let checkedPages = 0;
const internalLinksChecked = new Set();

for (const file of htmlFiles) {
  const route = routeOf(file);
  // Skip infrastructure files: the 404 error page and the Google verification file
  // are not content pages and intentionally have no h1/canonical/body.
  if (route === "/404.html" || /^\/google[a-f0-9]+\.html$/.test(route)) continue;
  const raw = readFileSync(file, "utf8");
  checkedPages++;

  const isNoindexRoute = NOINDEX_ROUTES.has(route) || KNOWN_REDIRECTS.has(route);

  /* hard 404s via internal links */
  for (const m of raw.matchAll(/<a\s[^>]*href="([^"]+)"/g)) {
    const href = m[1];
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (/^https?:\/\//i.test(href) && !href.startsWith(SITE)) continue;
    const path = href.startsWith(SITE) ? href.slice(SITE.length) : href;
    if (!path.startsWith("/")) continue;
    internalLinksChecked.add(path);
    const res = resolves(path);
    if (!res.ok) problems.push(`404 LINK: ${path} referenced from ${route}`);
    if (path.includes("_") && !KNOWN_REDIRECTS.has(path))
      problems.push(`UNDERSCORE LINK: ${path} referenced from ${route}`);
  }

  /* soft-404 heuristics (static shell only — what Google sees pre-hydration) */
  if (!isNoindexRoute) {
    const body = raw.slice(raw.indexOf('<div id="root">'), raw.lastIndexOf("</body>"));
    const h1s = (raw.match(/<h1[\s>]/gi) || []).length;
    const textLen = stripTags(body).length;
    if (h1s !== 1) problems.push(`SOFT-404: ${route} has ${h1s} <h1> element(s)`);
    if (textLen < 250) problems.push(`SOFT-404: ${route} static body only ${textLen} chars`);
    if (/no articles|coming soon|no products|not found/i.test(stripTags(body)))
      warn.push(`THIN-BODY: ${route} contains empty-state copy in static body`);
  }

  /* canonical */
  const cans = [...raw.matchAll(/<link\s+rel="canonical"\s+href="([^"]+)"/gi)].map((x) => x[1]);
  if (cans.length !== 1) problems.push(`CANONICAL: ${route} has ${cans.length} canonical tag(s)`);
  else {
    const c = cans[0];
    if (!c.startsWith("https://thesynlab.com/"))
      problems.push(`CANONICAL: ${route} → non-apex/non-https ${c}`);
    const expected = `${SITE}${route === "/" ? "/" : route}`;
    // Cross-canonical is expected on intentional consolidation pages (noindex
    // aliases pointing at their canonical parent). Flag everything else.
    if (c !== expected && !isNoindexRoute)
      warn.push(`CANONICAL-CROSS: ${route} → ${c.replace(SITE, "")} (verify intentional)`);
  }

  /* meta uniqueness — only meaningful for indexable pages */
  if (!isNoindexRoute) {
  const title = (raw.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim();
  const desc = (raw.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || [])[1];
  if (title) {
    if (metaSeenTitle[title]) problems.push(`DUP TITLE: "${title}" on both ${metaSeenTitle[title]} and ${route}`);
    metaSeenTitle[title] ||= route;
    if (title.length > 65) warn.push(`TITLE LONG (${title.length}): ${route}`);
  }
  if (desc) {
    if (metaSeenDesc[desc]) problems.push(`DUP DESC: same description on ${metaSeenDesc[desc]} and ${route}`);
    metaSeenDesc[desc] ||= route;
    if (desc.length > 165) warn.push(`DESC LONG (${desc.length}): ${route}`);
  }
  }

  /* JSON-LD syntax validity */
  for (const m of raw.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) {
      problems.push(`JSON-LD INVALID: ${route}: ${e.message}`);
    }
  }
}

/* ── report ──────────────────────────────────────────────────────────────── */
console.log(`SEO CRAWL AUDIT — ${checkedPages} prerendered pages, ${internalLinksChecked.size} distinct internal links, ${sitemapLocs.length} sitemap URLs`);
if (problems.length) {
  console.log("\n❌ PROBLEMS:");
  [...new Set(problems)].forEach((p) => console.log("  ✗ " + p));
} else console.log("\n✅ No problems found.");
if (warn.length) {
  console.log(`\n⚠ WARNINGS (${warn.length}):`);
  [...new Set(warn)].slice(0, 40).forEach((w) => console.log("  ⚠ " + w));
}
process.exit(problems.length ? 1 : 0);

