# TheSynLab — Comprehensive SEO, Technical & Competitive-Gap Audit (2026-08-25)

> Source: Live-site crawl of **www.thesynlab.com** + full local codebase review (`vite.config.ts` prerender/sitemap pipeline, `App.tsx` routing, `index.html`, `nginx.conf`, `public/robots.txt`, `public/sitemap.xml`, Dockerfile).
> Benchmark set ("best in the world"): Wirecutter, Tom's Guide, TechRadar, Rtings, PCMag, G2, Capterra, CompareCamp, ZDNET.

---

## 1. The platform in one paragraph

TheSynLab is a **Vite + React 18 SPA** (TypeScript, shadcn/ui, Tailwind) with a **Convex** backend, served by **nginx** from a Docker image. It positions itself as an independent, data-driven tech/SaaS review site with proprietary **Trust Score (0-100)** and **Integration Score (0-100)**, 3-year **TCO**, **Vendor Risk Profile**, and **Ecosystem Fit**. Content is **pre-rendered per route at build time** (a custom Vite plugin writes static HTML + route-specific `<title>`, meta, canonical, JSON-LD, and a body shell for hundreds of routes), which mitigates the classic SPA indexing problem. The site monetizes via AdSense + affiliate.

---

## 2. Historical indexing blockers (from GSC coverage 2026-08-14)

| Issue (GSC) | Pages | Root cause | Status in repo |
|---|---|---|---|
| Soft 404 | 52 | nginx 404'd valid `/guides`, `/glossary`; SPA shell for unmatched routes | Fixed (nginx regex removed them from dead-route block; valid prerender) |
| Not-found 404 | 51 | nginx dead-route whack-a-mole | Fixed; keep list minimal |
| Excluded by noindex | 10 | `/search` in sitemap AND noindex | Fixed: excluded from generator + robots |
| Server error 5xx | 9 | CSP blocking scripts on some routes | CSP tightened in nginx |
| Duplicate canonical | 44 | `/tools/compare` and `/compare` both self-canonical | Fixed via `CANONICAL_ALIASES` (alias routes canonicalize + noindex) |
| Crawled-not-indexed | 18 | thin SPA shell content | Fixed via per-route prerender HTML |
| Duplicate w/o canonical | 3 | missing canonicals | Fixed in generator (`canonicalOverride`) |
| Page w/ redirect | 1 | legacy chain | Resolved via 301 alias block |

---
## 3. What is already best-in-class (validated)

- **Prerendered static HTML for every meaningful route** - the single most important SPA fix; crawlers see real `<h1>` + body without JS.
- **Rich, per-route JSON-LD**: `WebSite`, `WebPage`, `Article`, `ItemList`, `SoftwareApplication` (+ `aggregateRating`), `FAQPage`, `HowTo`, `BreadcrumbList`. FAQ/HowTo are strong AI-Overview/E-E-A-T signals.
- **Single canonical strategy** with `CANONICAL_ALIASES` (`/tools/*` -> root) and nginx 301s preserving equity.
- **Structured `noindex,follow`** for thin/no-JS routes (forum, admin, auth, search, etc.) and `canonicalOverride` on alias pages.
- **Site-level robots.txt** with a Sitemap directive and AI-crawler policy.
- **nginx**: gzip (with `vary`), long cache for hashed assets, `immutable`, short cache for sitemap/robots, HTTP->HTTPS + www->apex 301s, strict HSTS, `frame-ancestors` CSP for embeddable tools.
- Editorial trust markers (14-day lab testing, affiliate disclosure, How We Make Money) - good for E-E-A-T.

**Net:** this is already far ahead of a typical Vite SPA. Remaining work in §4.

---

## 4. Gaps, loopholes & fixes (prioritized; ✅ = implemented, ⬜ = recommended follow-up)

### P0 - Indexing correctness (blockers)
- ✅ **robots.txt** rewrote: `Disallow` all `NOINDEX_ROUTES` (/search, /forum, /auth, /profile, /settings, /tasks, /products/watchlist, /tools/find, /tools/hub-builder, /tools/automations, /tools/compatibility-leaderboard) + canonical-alias redirects; removed garbled UTF-8 (mojibake `â€"`); consolidated the 5 duplicated AI-crawler blocks incl. `ClaudeBot`/`anthropic-ai`; added Sitemap ref.
- ✅ **index.html** route-fallback matcher: fixed bug where unmatched dynamic pages (`/vs/...`, `/best/...`) got the **homepage** `<title>`/canonical; now guards on the app-shell default title and injects correct fallback for dynamic prefixes; also sets `og:url` + canonical for non-home paths.
- ✅ **Sitemap:** added honest `<lastmod>` (real publish/update dates from `blogArticles`), correct `changefreq`/`priority`, `/search` removed; plugin now **auto-syncs `dist/sitemap.xml` AND `public/sitemap.xml`** so a stale committed file can never deploy.
- ✅ Duplicate `/products` route (CHECKLIST Phase 2) verified already resolved in `App.tsx` (single `ProductsHub`).

### P3 - Fresh content & discovery
- ⬜ Enable an **RSS feed** (`public/feed.xml`) - every top review site ships one; drives subscribers + Search-app signals. → ✅ **DONE**: `buildFeedXml()` in vite.config auto-generates `feed.xml` (25 items, UTF-8, enclosures, atom self-link) into `public/` + `dist/` at build time.
- ⬜ Add `<link rel="alternate" type="application/rss+xml">` on `/blog`. → ✅ **DONE**: `<link rel="alternate">` (rss + llms.txt) added in `index.html` head AND on the `/blog` page via Helmet in `Blog.tsx`.
- ⬜ Promote the existing `llms.txt` from `<head>` + footer for AI-LLM visibility. → ✅ **DONE**: `<link rel="alternate" type="text/markdown" href="/llms.txt">` in `index.html`; "llms.txt" + "RSS Feed" links added to footer bottom bar.

### P3 - Content depth / E-E-A-T (benchmark vs Wirecutter/PCMag)
- ⬜ Show **author bios + social/credential links** on every article & review. → ✅ Mostly present (author bio card + avatar on BlogArticle); enriched `Article` schema author with `sameAs`, `url`, `description` in `vite.config.ts` + `JsonLd.tsx`.
- ⬜ Add **last-updated / reviewed-date** badges on product & vs pages. → ✅ **DONE**: "Updated {date}" badge added to article meta when `updatedAt` differs from `publishedAt`; `lastmod` already uses real dates in sitemap; `lastLabTest` shown on score cards. Review templates already embed `dateModified`.
- ⬜ Enrich `Article` schema with `<Author>` `sameAs`, `knowsAbout`; split mega JSON-LD into discrete blocks. → ✅ **DONE**: prerender `jsonLdScripts` emits each schema as its own `<script>`; `Article` schema now includes author `sameAs`/`description`, `keywords`, `articleSection`, `wordCount`. Comparison templates now emit separate `Article` + `FAQPage` blocks.

### P2 - Technical SEO & page experience
- ⬜ **LCP / CLS:** AdSense + GTM scripts render-blocking. → ✅ Partial: added `preconnect`+`dns-prefetch` for `pagead2.googlesyndication.com`, `www.googletagmanager.com`, `www.google-analytics.com`; gtag/AdSense already `async`. (Full below-the-fold AdSense lazy-load recommended as follow-up.)
- ⬜ **Images:** set explicit `width`/`height` to prevent CLS. → ✅ **DONE** for rendered markdown images in BlogArticle (`width=1200 height=675`, `decoding=async`, `loading=lazy`). Full webp/avif conversion of `public/*.jpg` is a follow-up.
- ⬜ **404 page:** add search + popular links. → ✅ **DONE**: rewrote `public/404.html` (styled, search hint + 8 popular links) and `NotFound.tsx` (live search box → `/tools?search=` + 8 popular links).

### P2 - Internal linking & topology
- ⬜ Add a persistent **Popular Comparisons / Top Tools** footer module. → ✅ **DONE**: added "Popular" column in `Footer.tsx` (Top Comparisons, 4x `/vs/`, Alternatives, Workflows) + rebuilt grid `lg:grid-cols-8`.
- ⬜ >=3 text links to related products on every product/vs page. → ✅ Present via `ToolReviewTemplate` (Alternatives + Related Comparisons) and `vs` template related blocks; `rel="sponsored"` added to outbound vendor links on `ToolAlternativesPage` + `BestToolsRoundup`.
- ⬜ Check for orphan routes: cross-check `App.tsx` <-> `staticRoutes` <-> sitemap. → ✅ **DONE**: new `scripts/check-routes.ps1` drift detector; found 7 orphaned pages and **fixed them** by adding to `staticRoutes` + real prerender bodies + meta (`/editorial`, `/how-we-make-money`, `/ad-compliance`, `/vendor-program`, `/scores/*`, `/ai/stack-architect`).

### P1 - CRO & monetization
- ⬜ **Category authority pages**: add tabular TCO/top-10 tables. → ✅ **DONE**: `AIToolsCategoryPage` now renders a ranked Top-10 comparison `<table>` and its `ItemList` schema is sorted by Trust Score.
- ⬜ Contrast **comparison-table schema** (`Table` + per-row `FAQPage`). → ✅ **DONE**: `ComparisonPageTemplate` now emits separate `Article` + `FAQPage` JSON-LD blocks generated from verdict data (HTML comparison tables already present).
- ⬜ Add `rel="sponsored"` to affiliate links. → ✅ **DONE**: outbound vendor/affiliate anchors now use `rel="nofollow sponsored noopener"` (was already present on `SaasToolReviewPage`; added to `ToolAlternativesPage` + `BestToolsRoundup`).

---## 5. Recommended monitoring KPIs
- GSC: pages indexed, average position, noindex/index coverage delta (aim: remove all "crawled-not-indexed" for prerendered routes).
- CWV: LCP < 2.5s, CLS < 0.1 (mobile) - track in PageSpeed / CrUX.
- Index coverage: # of sitemap URLs Google recognizes vs submitted.
- AI visibility: share for thesynlab.com in Perplexity / AI chat (rising with FAQ/HowTo/llms.txt).

---

## 6. Files modified in this pass
| File | Change |
|---|---|
| public/robots.txt | Full rewrite - noindex disallows, AI-robots, sitemap ref, encoding-clean |
| index.html | Route-fallback matcher: guarded, dynamic prefixes, canonical + og:url fix; RSS+llms alternates + ad-script preconnects |
| vite.config.ts | Sitemap `<lastmod>`; plugin syncs public sitemap + robots + **new feed.xml**; enriched Article schema; 7 orphan routes added to prerender + real bodies + meta |
| public/feed.xml | **NEW** - auto-generated RSS 2.0 feed (25 items) |
| src/pages/Blog.tsx | RSS + llms.txt `<link rel=alternate>` in head |
| src/components/Footer.tsx | "Popular" column + RSS/llms links in bottom bar |
| src/pages/BlogArticle.tsx | `width/height` on markdown images; **Updated** date badge |
| src/pages/NotFound.tsx | Search box + 8 popular links |
| public/404.html | Rebuilt (styled, popular links) |
| src/templates/ComparisonPageTemplate.tsx | FAQPage schema added (Article+FAQ blocks) |
| src/pages/saas/AIToolsCategoryPage.tsx | Ranked Top-10 table + sorted ItemList schema |
| src/pages/saas/* | `rel="nofollow sponsored"` on outbound vendor links |
| scripts/check-routes.ps1 | **NEW** route/sitemap drift detector |
| SEO-AUDIT.md | This document (checklist updated) |

---

## 7. Cross-check script (drift detector)
```powershell
# 1) Every sitemap URL resolves and has no noindex
# 2) Routes in App.tsx exist in sitemap OR in NOINDEX_ROUTES / CANONICAL_ALIASES
# 3) Rebuild: the plugin regenerates sitemap.xml + robots.txt into dist/
```

## 8. Decision record
- Chose honest <lastmod> (publish/update dates) over build-date - avoids fake-freshness flags; acceptable because blog content is genuinely updated.
- Kept /tools/compare serving (no 301) - it has frame-ancestors * embed use; noindex+canonical to /compare prevents duplicate-index penalties.
- Deploy target is the repo ROOT (Dockerfile -> COPY . .); TheSynLab-deploy/ is a stale git submodule, not the build source - cleanup: stop mirroring, remove the submodule.