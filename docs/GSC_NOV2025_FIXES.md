# GSC Nov 2025 — fixes on feat/gsc-seo-nov2026

Sources: Coverage + Performance exports dated 2026-11-25.

## Diagnosis

| Signal | Observation |
|---|---|
| Indexed vs not | ~187 indexed / ~321 not indexed |
| Critical coverage | 76 noindex, 52 hard 404, 45 soft 404, 64 crawled-not-indexed, 37 wrong canonical |
| Performance | ~60k query impressions, 2 clicks; desktop CTR ~0% |

## Indexing blockers → fixes

| GSC reason | Root cause | Fix |
|---|---|---|
| Soft 404 | Unknown URLs served homepage index.html (200) | nginx try_files =404 for /, /blog/, /hub/, /tool/; 404.html + X-Robots-Tag |
| Not found (52) | Dead CMS category URLs | 301 to live roundups/hubs |
| Excluded by noindex | Sitemap listed noindex URLs | Sitemap scrub; NOINDEX_ROUTES; X-Robots-Tag on my-stack/widgets/search/tools/compare/widget |
| Google chose different canonical | 17 dual /products + /tool overlaps | Prefer /tool; nginx 301; skip product prerender/sitemap; SPA Navigate |
| Duplicate without user canonical | Empty canonical fell back to self on 404 | MetaTags omits canonical when canonical="" + noindex |
| Crawled – not indexed | Soft 404 + thin loading shells + duplicates | Hard 404s + loading noindex + dual-catalog cleanup |
| Server error 5xx | /api/ai upstream failures | proxy_intercept_errors → JSON 503 + noindex |
| Blocked by robots (5) | Intentional (/api/, /admin, …) | Left blocked |

## CTR / opportunity work (prior commit)

Shared SPA+prerender meta in src/data/seoMetaOverrides.ts for top-impression blogs/tools; CategoryGrid → hubs; homepage title alignment.

## After deploy

1. Deploy this branch (nginx + sitemap require production deploy).
2. GSC: resubmit https://thesynlab.com/sitemap.xml; request indexing for top impression URLs.
3. Watch Coverage soft-404 / wrong-canonical counts for 2–4 weeks.