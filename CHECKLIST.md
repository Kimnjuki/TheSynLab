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
