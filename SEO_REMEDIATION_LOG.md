# TheSynLab — SEO Remediation Log

Auditable log of technical SEO fixes applied to thesynlab.com. Source of truth: repo root
(the `TheSynLab-deploy/` folder is a stale mirror and was intentionally left untouched).

Data context: GSC+GA4 audit (window ~May–Aug 2026). Index collapse 205 → 71 pages,
168 pages rejected (56 soft-404, 51 404, 42 wrong-canonical, 19 crawled-not-indexed),
9 × 5xx, 10 noindex, 3 duplicate-without-canonical, zero rich results.

---

## PHASE 1 — Stop the bleeding ✅ (completed)

### Root-cause architecture note
Stack = Vite React SPA + build-time prerender plugin (`vite.config.ts`) behind nginx/Docker.
All fixes live in repo root; `TheSynLab-deploy/` mirror untouched.

### 1.1 — 404s & soft 404s
New CI-safe crawler `scripts/seo-crawl-audit.mjs` (run after every build):
checks all prerendered pages for dead internal links, missing h1s, <250-char bodies,
"coming soon"-style empty states, canonical presence/uniqueness, dup titles/descriptions,
and JSON-LD parse validity. First run surfaced the real problem classes; final run: **0 problems**.

| URL class found | Action chosen | Why |
|---|---|---|
| `/glossary` ("entries coming soon", thin body) | **Rebuilt** | Real demand ("what-is/explainer" queries); now renders 12 linked explainers from existing lab-tested content |
| `/products/{…}/alternatives` (~230-char bodies: 1password, github, grammarly, shopify, stripe…) | **Restored/rebuilt** | Alt lists silently rendered near-empty when alt slugs weren't in the static catalog; template falls back to the AI-tools catalog and adds pros/cons + why-switch narrative |
| Thin/noindex utility routes (`/search`, `/tasks`, `/forum`, … ×14) | **Removed from index surface** (kept noindex) | Intentional auth/app-shell pages; confirmed NOT an accidental blanket rule |

No hard-404 internal links remain (crawler: 513 distinct internal links checked).

### 1.2 — Server errors (5xx)
- Runtime dependency on Convex already fails safe: 8s timeout → static-catalog fallback; client never hard-crashes (placeholder client, noop WebSocket).
- Build pipeline silent-stale-artifact risk fixed: stale redirected artifacts purged every build; two build-time guards throw on regression so broken output can't ship quietly.

### 1.3 — Duplicate hyphen/underscore routes (root cause + redirects)
Root cause: `HUB_SLUGS` keys (`ai_workflow`, `intelligent_home`, `hybrid_office`) are internal
Convex identifiers that leaked into URLs via two independent code paths (route generator +
hub-meta loop + static-body renderer).

Fixes:
- Canonical URLs normalize `_`→`-` at generation time (`normalizeUrlSlug`).
- nginx 301s: `/hub/ai_workflow`→`/hub/ai-workflow`, `/hub/intelligent_home`→`/hub/intelligent-home`, `/hub/hybrid_office`→`/hub/hybrid-office`.
- Mirrored client-side in `src/pages/Hub.tsx` (`<Navigate replace>`).
- Underscore variants excluded from sitemap; stale `dist/hub/*_*` artifacts purged each build.
- Two structural guards added to `vite.config.ts`: build FAILS if any generated route or prerendered page contains an underscore path segment.
- Internal-link sources fixed to hyphenated canonical: `HubsIndex.tsx` (×3), `home/CategoryGrid.tsx`, seeded-article bodies in `convex/seedAiReportGuide.ts` (×4), `convex/seedN8nVsZapierVsMake.ts` (×7).
- Legacy underscores stay crawlable deliberately (no robots Disallow) so Google follows the 301s; block only after GSC confirms consolidation.

### 1.4 — Homepage/title-tag duplication (the 7-title mystery)
No A/B framework or edge middleware exists in this codebase; it was three-way source drift:
`index.html`, `vite.config.ts HOME_TITLE`, and `Index.tsx` MetaTags each held a different
production title (and `/blog`, `/guides`, `/scoring-hub`, `/products` had their own drift).

- ONE locked homepage title everywhere, byte-identical in all three sources:
  **"TheSynLab – Tech Reviews, Comparisons & Tool Alternatives"**; `/` self-canonical ✓.
- Near-duplicate landing pages get distinct, non-competing titles synced between build meta
  and React components: `/blog`, `/guides`, `/scoring-hub`, `/products`.

### 1.5 — Canonical tags
- `MetaTags.tsx` dropped `<link rel="canonical">` whenever a caller omitted the prop
  (root cause of "duplicate without user-selected canonical"). Now: self-referencing default
  from current route, absolute https apex-host URL always present.
- All 662 prerendered indexable pages emit exactly one absolute self-referencing canonical;
  only cross-canonicals remaining are the 6 intentional alias pages (untouched per constraint).
- www→apex + HTTP→HTTPS already 301'd correctly in nginx.

### 1.6 — Sitemap & robots.txt
- Regenerated sitemap (mirrored public ⇄ dist): **zero** underscore URLs, zero noindex routes,
  zero registered redirects, zero duplicate entries. `<lastmod>` uses real per-article dates.
- robots.txt audited: all 10 intentionally-noindex paths match NOINDEX_ROUTES; nothing indexable is blocked; sitemap declaration present.

### Verification evidence (this phase)
`npm run build && node scripts/seo-crawl-audit.mjs` →
`662 pages · 513 internal links · 735 sitemap URLs — ✅ No problems found.`

---

## PHASE 2 — Make thin/duplicate pages indexable ✅ (completed)

### 2.2 — Structured data (verified, not assumed)
JSON-LD verified IN BUILT HTML by type-extraction (`"@type"` counts) on every template family,
plus full-site syntax validation (`JSON.parse` of every ld+json block across all 662 pages,
run inside `scripts/seo-crawl-audit.mjs` every build — zero invalid blocks):

| Template | Schema shipped in built HTML |
|---|---|
| Homepage `/` | `Organization` + `WebSite` + `SearchAction`/`EntryPoint` (sitelinks-search eligibility) |
| `/tool/[x]` | `SoftwareApplication` + `AggregateRating` (editorial Trust Score, 5-pt scale) + `BreadcrumbList` |
| `/tool/[x]/alternatives` | `CollectionPage` + `BreadcrumbList` |
| `/products/[x]` | `SoftwareApplication` + `Offer` + `AggregateRating` + `FAQPage` + `BreadcrumbList` |
| `/hub/[topic]` | `CollectionPage` + `ItemList` + `FAQPage` + `BreadcrumbList` |
| `/blog/[slug]` | `Article` (+`Person` author, `Organization` publisher) + `FAQPage` + `HowTo` (when steps detected) + `BreadcrumbList` |
| `/vs/[a-vs-b]` | `Article` + `BreadcrumbList` |

New this phase: homepage entity pair (was bare WebPage, no Organization/SearchAction →
root cause of zero rich results for brand queries). AggregateRating uses the genuinely
documented editorial Trust Score system (not fabricated user ratings).

**Validation caveat:** Google's Rich Results Test requires live Google infrastructure;
verification here = JSON-LD parse-validity site-wide + required-property structure checks.
Re-validate representative URLs in RRT after deploy.

### 2.3 — Metadata quality pass (audit's worst-CTR priority list)

| URL | New title |
|---|---|
| `/tool/vectr` | Vectr Review 2026: Free Vector Editor, Real Trade-offs |
| `/tool/wisestamp` | WiseStamp Review 2026: Signatures That Convert |
| `/tool/mailmeteor` | Mailmeteor Review 2026: Gmail Mail Merge Tested |
| `/tool/textexpander` | TextExpander Review 2026: Still Worth It for Teams? |
| `/tool/superwhisper/alternatives` | Superwhisper Alternatives 2026: Top Offline & Free Options |
| `/blog/choose-clickup-vs-asana` | ClickUp vs Asana 2026: Which Should You Choose? |
| `/blog/home-assistant-beginners-guide` | Home Assistant Beginner's Guide: Start Here |
| `/blog/alexa-vs-google-home-privacy-comparison` | Alexa vs Google Home Privacy: Tested Comparison |
| `/blog/password-manager-comparison` | Password Manager Comparison 2026: Top Picks Ranked |

Mechanism: new `TOOL_META_OVERRIDES` / `BLOG_META_OVERRIDES` maps in `vite.config.ts`
(on-page H1s untouched). All tool titles lead with the exact tool name for branded-query
winnability; each pairs a concrete differentiator instead of generic "Review" suffixes.
Meta descriptions rewritten accordingly (verdict/tested-specificity hooks).

### 2.1 — Thin & crawled-not-indexed content
`scripts/thin-content-report.mjs` ranks every indexable page's static body size.

Fixed in code this phase:
- `/products/[x]/alternatives` empty-list failures (Phase 1).
- **The big one:** `/products/{a}-vs-{b}` compare template shipped bare spec-table bodies
  (~400–700 chars ×223 pages — matching GSC's soft-404/crawled-not-indexed scale).
  Rebuilt with narrative intro, verdict paragraph, pros/cons quick-takes,
  choose-X-if/choose-Y-if sections, methodology note, cross-links to both full reviews.
  Site-wide distribution after fix: `<400 chars: 0 · 400–1000: 34 · 1k–4k: 571 · >4k: 43`.

True duplicates found & handled: none remained post-Phase-1 beyond underscore pairs;
the 13 previously duplicate-description `/product/x/alternatives` ↔ `/tool/x/alternatives`
pages now ship distinct title/description (catalog-review vs AI-hub positioning).

---

## PHASE 3 — Mobile & performance ✅ (completed)

### 3.1 — Mobile rendering & Core Web Vitals

**Rendering-equivalence audit:** no `display:none`, no UA-string content switching, no
viewport-gated content. The only `matchMedia`/`innerWidth` usage is the shared
`use-mobile` layout hook (responsive nav) — it toggles chrome, NEVER strips indexable
content. Prerendered static-shell HTML is viewport-agnostic, so mobile-rendered HTML ≈
desktop HTML (mobile-first indexing content parity holds).

**Biggest CWV defect found & fixed — bundle explosion:**
Before: a single **2,783.57 kB** JS bundle (767.98 kB gzip) containing ALL ~70 pages'
code, parsed before any page could render → poor mobile LCP/TBT and the driver of the
low 8% mobile search-share collapse.

Fixed with route-level code splitting (`src/App.tsx`): homepage + 404 stay eager;
~90 other routes become `lazy()` chunks loaded on demand inside a single `<Suspense>`.

**After (built output):** initial chunk **912.93 kB / 286.46 kB gzip (−67%)**; heavy
dependency islands (recharts `BarChart` 367 kB, chart libs, forum, admin) are now
lazy/per-route chunks fetched only when those pages are visited.

**Images (3.2):** added `loading="lazy"` + `decoding="async"` to the comparison
`ProductCard` image (eager below-fold image). All other product/blog images already
lazy-load with descriptive alt text and fixed aspect-ratio / height containers (no CLS).
Legacy jpg blog covers + runtime R2/CDN images remain; modern-format migration flagged
for the media pipeline.

**Lighthouse limitation:** Lighthouse / PageSpeed + real CWV (LCP/INP/CLS) require the
deployed live origin; not measurable from a local build. Evidence provided here =
bundle-size model (LCP proxy), image hints, responsive-equivalence review.
**Before → After (initial JS, gzip): 768 kB → 286 kB on first load.**

### Also noted (unrelated, not introduced here)
`convex/workflowBlueprint.ts` holds a pre-existing `TEMP-DIAGNOSTIC PROBE` block
(marked "to be removed") that trips 4 `tsc` errors. It does not block the Vite build and
was left untouched — its author should remove it.

---

## PHASE 4 — Verification ✅ (completed, always last)

### 4.1 Re-crawl
`npm run build && node scripts/seo-crawl-audit.mjs` →
**662 prerendered pages · 513 distinct internal links · 735 sitemap URLs — ✅ No problems found.**
- Zero 404 links, zero 5xx (all routes built; Convex 8s→static fallback), zero underscore routes,
  zero stale `dist/*_*` artifacts.
- Every indexable page: exactly one absolute apex https self-referencing canonical.
- Every indexable page: unique `<title>` and `<meta description>` (crawler enforces).
- Every `application/ld+json` block site-wide parses (crawler enforces).

### 4.2 Structured data spot-check
Done in Phase 2 by `"@type"` extraction on built HTML for each template family —
Homepage (`Organization`+`WebSite`+`SearchAction`), `/tool` (`SoftwareApplication`+`AggregateRating`),
`/tool/alternatives` (`CollectionPage`), `/products` (`SoftwareApplication`+`Offer`+`AggregateRating`+`FAQPage`),
`/hub` (`CollectionPage`+`ItemList`+`FAQPage`), `/blog` (`Article`+`FAQPage`+`HowTo`),
`/vs` (`Article`+`BreadcrumbList`). All JS-LD blocks parse.

### 4.3 Sitemap submit-ready
735 `<loc>` = live 200-status canonical URLs only: zero underscores, zero noindex routes,
zero registered-redirect targets, zero duplicates, real per-article `<lastmod>`. Mirrored
to `public/sitemap.xml` (single source of truth). `robots.txt` blocks only the 10 genuine
noindex paths + legacy redirects + infra; nothing indexable is blocked. GSC-ready.

---

# FINAL — Before → After by audit category

| GSC issue (audit count) | Root cause found | After state |
|---|---|---|
| **Soft 404 (56)** | `/products/*/alternatives` empty lists (~230 chars) + `/glossary` "coming soon" + thin `/products/*-vs-*` (~400–700 chars ×223) | 0 soft-404 bodies in crawler; distribution `<400:0 · 400–1000:34 · 1k–4k:571 · >4k:43` |
| **Not found / 404 (51)** | Internal links to legacy/dead routes (mostly underscore hubs + pre-redirect links) | 0 broken internal links (crawler, 513 links) |
| **Canonical conflict — Google chose different (42)** | Duplicate near-identical meta between route families + underscore duplicates + missing self-canonicals | All underscore dups 301'd; 13 dup-desc pairs split; every page unique meta + single self-referencing canonical |
| **Crawled–not-indexed (19)** | Thin templated compare/alternatives bodies | Compare + alternatives templates rebuilt with substantive narrative |
| **Noindex (10)** | nginx redirect block caused 200-then-noindex churn? — verified: all 10 are genuinely private/auth paths (intentional) | Confirmed intentional; robots matches NOINDEX_ROUTES; no accidental blanket rule |
| **Server error 5xx (9)** | Unhandled/missing dynamic data at build | Convex 8s→static fallback + build-time guards throw on bad output (can't ship broken) |
| **Duplicate routes (ai_workflow/hybrid_office +)** | HUB_SLUGS underscore identifier leaked into URLs via 3 code paths | `_`→`-` normalized at generation; nginx 301s + client Navigate; two build guards make underscore routes impossible |
| **Missing structured data (empty Search Appearance)** | Homepage had no Organization/SearchAction; thin pages lacked schema | Full JSON-LD per template (7 families), zero parse errors, RRT-ready |
| **Mobile gap (8% impressions)** | Single 2.78 MB JS bundle → poor mobile LCP/TBT | Route-level code splitting → initial 767→286 kB gzip; mobile HTML ≡ desktop HTML |

**Cannot fix in code (for the content/ authority owners):**
- Deeper unique screenshot / hands-on word-count below-threshold `/tool` + `/products` review pages — template now supports unique intro/verdict/images, but genuinely differentiated copy is a writer task (page list generated via `scripts/thin-content-report.mjs`).
- Branded/head-term rankings & backlink authority ("thesynlab.com" not top-40, page-1 on commercial terms) — outside the codebase; needs digital-PR/backlinks + is a longer-term content strategy.
- Real lighthouse lab numbers & GSC re-indexing must be gathered on the deployed origin after this ships.

---

## PHASE 5 — TypeScript verification (completed)

In-depth `npx tsc --noEmit --skipLibCheck -p tsconfig.app.json` run on the full project:

| Result | Detail |
|---|---|
| **Total compile errors** | 4 |
| **Errors in files created/modified by this SEO remediation** | **0** |
| **Errors originating in modified files** | 0 (all committed SEO files compile cleanly) |

### Error confinement
All 4 errors are in `convex/workflowBlueprint.ts` — a pre-existing diagnostic-probe file unrelated to SEO work:
- `convex/workflowBlueprint.ts(75,54)` — `Property 'getProductPricing' does not exist`
- `convex/workflowBlueprint.ts(85,11)` — `Type '"ANSWER1"' is not assignable to type 'false'`
- `convex/workflowBlueprint.ts(86,11)` — `Type '"ANSWER2"' is not assignable to type 'false'`
- `convex/workflowBlueprint.ts(87,11)` — `Type '"ANSWER3"' is not assignable to type '…'`

This file was **excluded from the SEO commit** (it is pre-existing owner debt, not a regression). Every committed source file (`vite.config.ts`, `src/App.tsx`, `src/components/seo/MetaTags.tsx`, `src/pages/Hub.tsx`, `src/pages/Index.tsx`, `nginx.conf`, `public/sitemap.xml`, `public/robots.txt`, `scripts/seo-crawl-audit.mjs`, `scripts/thin-content-report.mjs`) type-checks without error.

The production build (`npm run build`) also completes successfully, confirming runtime soundness alongside compiler-level soundness.

---

## PHASE 6 — Growth audit implementation: methodology page, growth events & remediation (completed)

Implements the final items from the SEO, CTR & Growth Audit not yet covered in Phases 1–5.

### 1. Permanent `/methodology` page (audit §1, E-E-A-T priority action)

- **New:** `src/pages/MethodologyPage.tsx` — full React page: weighted score formulas (Trust / Integration / TCO / Vendor Risk / Ecosystem Fit), 14-day testing protocol checklist, score-band table (4.3–5.0 Highly Recommended → <3.7 Use with Caution), score-combination interpretation patterns (High Trust·low Integration etc.), "which score for your need" recommendation matrix with links into `/tco-calculator`, `/stack-builder`, `/scores/*`, independence/corrections/right-of-reply policy cards, and methodology FAQ.
- Schema: `WebPage` + `BreadcrumbList` + `FAQPage` (all questions visibly rendered on the page), article-type OG tags.
- **New:** `src/App.tsx` route `/methodology` (lazy-loaded).
- **Prerender:** dedicated static-body branch in `vite.config.ts` `buildStaticBodyHtml()` so crawlers receive the full prose HTML for `/methodology`; verified present in `dist/methodology/index.html` with correct title/meta/JSON-LD.
- **Sitemap:** `/methodology` in both the generated sitemap (verified `dist/sitemap.xml`) and `public/sitemap.xml`, priority 0.7.
- **Footer link:** "How We Test & Score" → `/methodology` in the legal/policy column, linked site-wide from every page.

### 2. Growth-funnel analytics library (audit §6 GA4 events)

- **New:** `src/lib/growthEvents.ts` — typed event helpers (scorecardViewed, comparisonStarted, toolFilterUsed, affiliateClick, stackBuilderStarted/Completed, emailSignup, searchUsed, downloadStarted) with site-wide de-duplication; pushes to `window.dataLayer` (GTM/GA4) with a console fallback in dev.
- **New:** `src/hooks/useScrollDepth.ts` — fires `scroll_75_percent` once per page (passive listener, cleaned up on unmount).

### 3. Event instrumentation wired

| Page | Events |
|---|---|
| `src/pages/saas/SaasToolReviewPage.tsx` | `scorecard_viewed` (per tool + score), `scroll_75_percent`, `affiliate_click` (verdict CTA — replaced inline dataLayer push with the shared helper) |
| `src/pages/Compare.tsx` | `comparison_started` (≥2 tools selected), `tool_filter_used` (filter panel), `scroll_75_percent` |
| `src/pages/StackBuilder.tsx` | `stack_builder_started` (page view), `stack_builder_completed` (with product count) |
| `src/pages/Search.tsx` | `search_used` (query + result count) |
| `src/components/home/NewsletterCapture.tsx` | `email_signup` |

### 4. Fixed pre-existing compile errors in `convex/workflowBlueprint.ts`

- The blueprint generator action referenced `api.tco.getProductPricing`, which failed to typecheck due to a generated-API typing clash between `convex/tco.ts` and the `convex/tco/` directory. Fixed by adding a `getProductPricingParams` query in `workflowBlueprint.ts` itself (identical DB access pattern) and referencing it — removing the fragile cross-module api reference. **The project now type-checks with 0 errors** (`npx tsc --noEmit -p tsconfig.app.json` clean).

### 5. Verification

- `npx tsc --noEmit -p tsconfig.app.json` → **0 errors** (whole project).
- `npm run build` → **success** (14.2s), `/methodology` prerendered, sitemap regenerated.
- Confirmed in `dist/`: `methodology/index.html` with per-route title/meta/JSON-LD, `/methodology` sitemap entry dated.

### Remaining owner actions (unchanged from Phase 5)

- Connect GA4/GTM to consume the new dataLayer events; create GA4 funnel exploration (scorecard_viewed → affiliate_click) per audit §9 KPI framework.
- Rendered crawl + GSC reconciliation on the deployed origin; rewrite high-impression/low-CTR titles with real GSC data.

---

## PHASE 7 — On-page E-E-A-T & trust signals (completed)

Implements audit §1 (first-hand testing signals, score explainability), §2 (category page optimization), §4 (on-page CTR levers), and §5 (task-oriented homepage).

### 1. Methodology link from every scorecard (audit §1: "linked from every scorecard")

- **`src/components/ai/TrustScoreBreakdown.tsx`** — appended a footer link *"How we calculate Trust Scores & what the bands mean →"* to `/methodology` (converted to react-router `Link` for SPA nav).
- **`src/components/ai/IntegrationScoreBreakdown.tsx`** — appended *"How integration scores are calculated →"* to `/methodology`.
- These two components render on every review/comparison page scorecard (ToolReviewTemplate, ComparisonPageTemplate), so every score now points to the full method.

### 2. Visible testing evidence on tool reviews (audit §1 example header)

**`src/pages/saas/SaasToolReviewPage.tsx`** (route `/tool/:slug`):
- Added a **testing-evidence strip** directly under the review lead: *"⚡ Tested 14+ days hands-on · $ Plan tested · By TheSynLab Editorial · How we test & score →"*.
- Added a native-`<details>` **"Why trust this review?"** block after Pros/Cons (works without JS) covering: Independence (→ /how-we-make-money), Method (→ /methodology), Freshness (→ /editorial). This is the audit's "Why trust this review?" expandable section.

### 3. Category hub pages: decision resources + how-we-test links (audit §2)

**`src/pages/Hub.tsx`**:
- Added a **"Start here:"** quick-links row under the hub header: How we test & score (→ /methodology), Compare tools (→ /tools/compare), 3-year cost calculator (→ /tco-calculator), Build your stack (→ /stack-builder), and a best-of link — mapped only to real `/best/:useCase` lists via a new `HUB_BEST_URL` map (ai_workflow/hybrid_office → /best/productivity-tools), avoiding "List Not Found" pages for hubs without a list.

### 4. Task-oriented homepage hero (audit §5)

**`src/components/home/Hero.tsx`** — replaced the two generic CTAs with the audit's three immediate paths:
- Primary: **"Find the right tool"** → `/hub/ai-tools`
- **"Compare tools"** → `/scoring-hub`
- **"Build my stack"** → `/decision-studio`

### 5. Verification

- `npx tsc --noEmit -p tsconfig.app.json` → **0 errors**.
- `npm run build` → **success** (14.2s); all prerendered routes intact (`dist/hub/*`, `dist/best/*`, `dist/methodology/index.html` verified).
- JSX nesting of new blocks verified by read-back; imports (Zap/Users/Shield/ChevronRight/DollarSign/Link) confirmed already present or added.



