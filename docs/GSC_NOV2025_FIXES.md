# GSC Nov 2025 — fixes shipped on `feat/gsc-seo-nov2026`

**Sources:** Coverage + Performance exports dated 2026-11-25 (last 7 days for performance).

## Diagnosis (evidence)

| Signal | Observation |
|---|---|
| Indexed vs not | ~187 indexed / ~321 not indexed |
| Critical coverage | 76 noindex, 52 hard 404, 45 soft 404, 64 crawled-not-indexed, 37 wrong canonical |
| Performance | ~60k query impressions, **2 clicks**; desktop CTR ≈ 0% |
| Top miss | Pages ranking pos 5–10 (thermostat, password manager, keyboard, vacuum, air purifier) with 0 CTR |
| Query mismatch | Brand+year queries (e.g. “philips smart thermostat review 2026”) ranking roundup pages that do **not** review those brands |

## What we implemented

1. **CTR meta (shared SPA + prerender)** — `src/data/seoMetaOverrides.ts`  
   Benefit-led titles/descriptions naming brands actually covered (Ecobee/Nest, Roborock, Keychron, etc.). Wired into `BlogArticle`, tool review/alternatives, AI category pages, and `vite.config.ts` prerender.
2. **Synced `blogArticles` seoTitle/metaDescription** for the 20 GSC-priority slugs.
3. **Soft 404 reduction** — nginx `try_files … =404` for `/blog/`, `/hub/`, `/tool/` so missing slugs are real 404s, not SPA shells.
4. **404 → 301 equity** — legacy `/products/{category}` CMS paths redirect to live roundups; `/category/*`, `/hub/general`, `/hub/smart-home`, `/hub/collaboration`, `/hub/productivity` → canonical hubs.
5. **Internal links** — `CategoryGrid` points at hubs directly (no client-only `/category/*` hop).
6. **Crawl budget** — `robots.txt` + `NOINDEX_ROUTES`: disallow `/my-stack`, `/widgets`, `/widget/`, `/category/`; keep high-value Allow list.
7. **Homepage title/description** aligned across `index.html`, `Index.tsx`, `vite.config.ts`.
8. **Missing-entity pages** — article/tool 404 UIs emit `noindex`.

## Not invented

- No fabricated Philips/LG/HP/Sony thermostat or vacuum reviews.
- No fake social-proof counters or score changes.
- Cloudflare-managed robots Content-Signals remain in front of app `robots.txt` on production.

## After deploy (owner)

1. Coolify deploy this branch / merge to main.
2. In GSC: request indexing for top 10 impression URLs; validate Coverage (soft 404 / 404) drop over 2–4 weeks.
3. Re-export Performance in ~14 days — expect CTR lift on named-brand titles before position changes.
4. Optional follow-up: dedicated FAQ blocks on thermostat/password pages for “is it worth it 2026” queries (content already partially present).
