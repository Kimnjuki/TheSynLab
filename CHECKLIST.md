# TheSynLab - GSC Indexing Fix Implementation Checklist

## Source: GSC Coverage Report (2026-08-14) + Codebase Analysis

## Critical Issues from GSC Report

| Issue | Pages | Root Cause |
|-------|-------|------------|
| Soft 404 | 52 | nginx 404s for valid pages (/guides, /glossary); SPA shell for unmatched routes |
| Not found 404 | 51 | nginx dead routes block incorrectly 404s valid pages; stale URLs |
| Excluded by noindex | 10 | /search in sitemap but also noindex (conflict) |
| Server error 5xx | 9 | CSP/script blocking on some routes |
| Duplicate canonical | 44 | Both /tools/compare and /compare prerendered with self-canonicals |
| Crawled not indexed | 18 | Thin/duplicate content from SPA shell |
| Duplicate w/o canonical | 3 | Missing canonical tags on some pages |
| Page with redirect | 1 | Legacy redirect chain |

## Implementation Tasks

### Phase 1 - Fix nginx.conf (Root cause: Soft 404 + 404 errors)
- [ ] Remove `/guides` and `/glossary` from 404 dead routes block (they ARE prerendered valid pages)
- [ ] Add 301 redirects for canonical alias routes (/tools/* -> root-level routes)
- [ ] Fix CSP to not block critical scripts

### Phase 2 - Fix App.tsx (Root cause: Duplicate routes, conflicting /products)
- [ ] Remove duplicate `/products` route override (DigitalProducts overwrites ProductsHub)
- [ ] Remove duplicate root-level canonical routes that conflict with /tools/* paths
- [ ] Clean up route organization

### Phase 3 - Fix vite.config.ts (Root cause: Duplicate canonical tags)
- [ ] Add CANONICAL_ALIASES map for /tools/* -> root-level redirect targets
- [ ] Add canonicalOverride field to StaticPageMeta type
- [ ] Modify buildStaticPagesMeta: alias routes get canonical to target + noindex
- [ ] Modify buildSitemapXml: exclude alias routes from sitemap
- [ ] Modify generateStaticHtmlPages: use canonicalOverride for canonical tag
- [ ] Add more routes to NOINDEX_ROUTES (forum, auth, admin, etc.)

### Phase 4 - Fix public/sitemap.xml (Root cause: Stale/conflicting sitemap)
- [ ] Remove `/search` (noindex route)
- [ ] Remove duplicate entries
- [ ] Sync with generated sitemap routes

### Phase 5 - Fix public/robots.txt (Root cause: No Disallow for noindex pages)
- [ ] Add Disallow for noindex paths (/search, /admin, /auth, etc.)
- [ ] Simplify redundant Allow directives

### Phase 6 - Fix index.html (Root cause: Incomplete route meta injection)
- [ ] Extend route meta injection script for dynamic routes
- [ ] Add canonical for unmatched dynamic routes

### Phase 7 - Fix sitemap.ts (Convex dynamic sitemap)
- [ ] Add missing route types to sitemap (vs, tool, best, hub pages)
- [ ] Ensure noindex routes are excluded

### Phase 8 - Verify and test
- [ ] Run build to verify prerendering works
- [ ] Validate sitemap.xml is correct
- [ ] Cross-check routes between App.tsx, vite.config.ts, and sitemap

### Phase 9 - Growth audit: methodology page + GA4 funnel events (completed)
- [x] Permanent /methodology page (React route + prerendered static body + FAQPage/BreadcrumbList schema)
- [x] /methodology added to sitemap (generated + public) and linked site-wide in footer
- [x] src/lib/growthEvents.ts typed GA4/dataLayer event library (scorecard_viewed, comparison_started, tool_filter_used, affiliate_click, stack_builder_started/completed, email_signup, search_used, download_started)
- [x] useScrollDepth hook firing scroll_75_percent once per page
- [x] Instrumented SaasToolReviewPage, Compare, StackBuilder, Search, NewsletterCapture
- [x] Fixed convex/workflowBlueprint.ts compile errors (api.tco.getProductPricing clash) - project type-checks with 0 errors
- [x] Verified: tsc clean, production build success, dist/methodology/index.html prerendered, sitemap entry present

### Phase 10 - On-page E-E-A-T & trust signals (completed)
- [x] Scorecards (Trust/Integration breakdowns) link to /methodology on every review/comparison page
- [x] /tool/:slug testing-evidence strip: Tested 14+ days, plan tested, By TheSynLab Editorial, methodology link
- [x] 'Why trust this review?' expandable (no-JS <details>) with independence/method/freshness policy links
- [x] Hub pages: 'Start here' row (methodology, compare, TCO, stack builder, best-of) mapped only to real lists
- [x] Homepage hero: three task paths - Find the right tool / Compare tools / Build my stack
- [x] Verified: tsc 0 errors, production build success, prerendered routes intact
