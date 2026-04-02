# TheSynLab Audit Implementation Checklist

Source: [docs/thesynlab_audit.json](./docs/thesynlab_audit.json). Full audit JSON is in the repo; this checklist tracks implementation.

## Sprint 1 – Critical (Security + Crawlability)

- [x] **ARCH-004** – `.env` in `.gitignore`; secrets via Coolify env (no `.env` committed)
- [ ] **ARCH-003** – Lockfile: use one of `bun.lockb` or `package-lock.json`; remove the other when standardizing on Bun or npm
- [x] **SEO-001** – Per-page meta: `react-helmet-async` + `useSeoMeta` + `MetaTags` component
- [x] **SEO-004** – Open Graph and Twitter Card meta on key pages
- [x] **FEAT-002** – `sitemap.xml` and `robots.txt`: static in `public/` + Convex HTTP actions for dynamic sitemap
- [ ] **PERF-002** – Put Cloudflare (free) in front of thesynlab.com (manual DNS + proxy)
- [x] **PERF-005** – nginx: gzip/brotli and cache-control headers

## Sprint 2 – SEO Foundation

- [x] **SEO-002** – JSON-LD: Product, Review, Article, BreadcrumbList (see `src/components/seo/JsonLd.tsx`)
- [x] **SEO-005** – Canonical URL on key pages (Blog, Compare, Hub, Product, Article)
- [x] **FEAT-007** – RSS feed (Convex HTTP `/feed.xml`)
- [x] **Schema** – New tables and mods (see Convex schema)

## Sprint 3 – Traffic & Features

- [x] **FEAT-003** – Product comparison engine (`/tools/compare?products=slug-a,slug-b`)
- [x] **FEAT-004** – Hub landing pages (`/hub/:slug`)
- [x] **FEAT-006** – Newsletter signup + Convex `newsletter.subscribe`
- [ ] **FEAT-005** – Author profile pages

## Schema (Convex)

- [ ] **New tables**: novaNewsletterSubscribers, novaProductComparisons, novaSearchQueries, novaContentSections, novaRedirectRules
- [ ] **Table mods**: novaProducts (seoTitle, metaDescription, schemaMarkup, …), novaPosts (ogImageUrl, …), productReviews (isApproved, …), forumThreads (relatedProductIds, …), novaAffiliateLinks, novaUsers (E-E-A-T), novaAffiliateClicks (conversion fields)
- [ ] **Indexes**: by_published_date, by_hub_status, by_product_approved, etc.

## Features to Build (from audit)

| ID      | Title              | Status |
|---------|--------------------|--------|
| FEAT-001| SEO Meta Tag System| Done   |
| FEAT-002| Sitemap + robots   | Done   |
| FEAT-003| Product comparison  | Done   |
| FEAT-004| Hub landing pages   | Done   |
| FEAT-005| Author profiles     | Pending|
| FEAT-006| Newsletter signup   | Done   |
| FEAT-007| RSS feed            | Done   |
| FEAT-008| Internal search     | Pending|

## Improvements to Existing Features

- [ ] IMPROVE-001 – Affiliate click validation (blocked IPs, rate limits)
- [ ] IMPROVE-002 – Forum ↔ product linking
- [ ] IMPROVE-003 – Trust score methodology page
- [ ] IMPROVE-007 – Privacy Center + cookie consent

---

**How to use:** Uncheck items when you start; check when done. Run Cursor with the audit JSON and this checklist for implementation prompts.

---

## Product roadmap 2026

Source: [docs/product_roadmap_2026.json](./docs/product_roadmap_2026.json) — full competitive roadmap, meta, phases, and outstanding gaps.

### Phase 1 — shipped (this repo)

- [x] **Homepage live insights** — `homepageInsights` (live score feed, ecosystem health %, trending topics, deal pulse)
- [x] **Product protocol matrix + freshness** — `ProtocolCompatibilityMatrix`, `LabFreshnessBadge`
- [x] **Score history UX** — single-version explanatory copy in `ScoreTrendChart`
- [x] **Compare weighted scores + ecosystem overlap** — `WeightedScoreCustomizer`, `EcosystemOverlapPanel`
- [x] **COMPAT-001 MVP** — `/tools/hub-builder` + `hubBuilder.saveConfig` → `userSmartHomeConfigs`
- [x] **COMPAT-004** — `AICompatibilityAssistant` on compatibility tool (Claude optional)
- [x] **COMPAT-005** — `/tools/compatibility-leaderboard` + `compatibilityLeaderboard.topByCompatibilityBreadth`
- [x] **COMPAT-003 heuristic** — `integrationSimulations.runHeuristic`
- [x] **COMPAT-007 sample** — `apiCompatibility.listMatrix` + `ApiCompatibilitySnippet`
- [x] **NEW-001 MVP** — `/tools/find` + `productFinder.searchProducts`

### Still to build (see JSON)

- [ ] Graph drag-drop hub builder with pair-wise compatibility edges
- [ ] NEW-002 Brand portal, NEW-003 Public API + developer portal
- [ ] Forum summarizer, methodology voting UI, SYN dashboard, energy monitor, research hub, etc.
- [ ] Programmatic SEO pages and technical-debt crons from JSON

## AI competitive implementation (2026-03-31)

Source: [docs/ai_implementation_roadmap_2026.json](./docs/ai_implementation_roadmap_2026.json)

### Completed in this pass

- [x] Additive schema upgrade for AI sessions, risk profiles, what-if simulations, copilot sessions, compatibility graph, community insights, editorial drafts, playbooks, consultations, memberships, CMP, ad slots, quality audits, decision studio sessions
- [x] Existing-table additive upgrades for `novaProducts`, `novaPosts`, `novaUsers`, `toolUsageSessions`, `productTcoScores`
- [x] Convex backend for AI stack sessions (`convex/aiStackSessions.ts`)
- [x] Convex backend for AI risk profiles (`convex/aiRiskProfiles.ts`)
- [x] Convex backend for CMP consent (`convex/cmpConsent.ts`)
- [x] Convex backend for ad slot config and impression logs (`convex/adSlots.ts`)
- [x] Convex backend for ad readiness audit + low-score task creation (`convex/contentQualityAudits.ts`)

### Remaining (next passes)

- [ ] Wire cookie banner + consent-aware ad script loading in UI
- [ ] Build stack builder and refinement UX pages/components
- [ ] Build product risk gauge UI components
- [ ] Build integration planner and decision studio full UI flows
- [ ] Build Stripe membership webhooks and feature-gating hooks

### Production / Coolify troubleshooting

- [x] **HomepageInsights isolated** — Lazy-loaded + `ErrorBoundary` so Convex/widget failures do not white-screen the whole SPA (see `Index.tsx`).
- **Coolify “healthy” but blank in Cursor’s browser**: If the console shows `chrome-error://chromewebdata/` and “Unsafe attempt to load URL …”, the **first** load failed (TLS/DNS/network or embedded-browser limits). Fix proxy/SSL/DNS in Coolify; test in a normal Chrome window. The second message is a **follow-on** browser warning, not the root cause.
- **Convex**: Build must bake `VITE_CONVEX_URL` (Dockerfile `ARG`/`ENV` before `npm run build`). Runtime container env does not change the Vite bundle.

## PDP implementation checklist (Decision-Engine)

Source: user blueprint in chat (Product page architecture + Convex schema upgrade).

### Step 1 — Backend schema + query

- [x] Add `productPageMeta` table to `convex/schema.ts` with `productId -> novaProducts` relation
- [x] Add `productGallerySlides` table to `convex/schema.ts` with `productId -> novaProducts` relation
- [x] Add `workflowRecipes` table to `convex/schema.ts` (for workflow recipe cards)
- [x] Extend `novaProducts` fields (`productTypeExtended`, `heroGifUrl`, `changelogUrl`)
- [x] Extend `productReviews` fields (`workflowImproved`, `useCase`, `teamSize`)
- [x] Extend `forumThreads` with `promptType`
- [x] Add `getProductDetailsBySlug` aggregate query in `convex/products.ts`

### Step 2 — Hero + Quick stats + Core meta panel

- [x] Create `src/components/pdp/ProductHero.tsx`
- [x] Create `src/components/pdp/QuickStatsBar.tsx`
- [x] Create `src/components/pdp/CoreMetaPanel.tsx` (sticky desktop + accordion mobile)

### Step 3 — Narrative + recipes + alternatives

- [x] Create `src/components/pdp/WorkflowRecipeCard.tsx`
- [x] Create `src/components/pdp/AlternativesStrip.tsx`
- [x] Build new page `src/pages/products/ProductDetailPage.tsx` and map route `/products/:slug`

### Step 4 — Benchmarks + gallery + SEO + actions

- [x] Create `src/components/pdp/VisualStoryGallery.tsx` with Raw/Annotated toggle (Framer Motion)
- [x] Create `src/components/pdp/BenchmarkDashboard.tsx` (bar/radar/sortable table)
- [x] Add JSON-LD blocks (Product, Review, FAQ, Breadcrumb)
- [x] Hook "Add to My Stack" to `productBookmarks.insert`
- [x] Hook "Subscribe to Updates" to `productAlerts.insert`
- [x] Add ROI estimator component with persistence to `roiCalculations.save`
- [x] Add mobile fixed conversion bottom bar

### Step 5 — Visibility + deployment checks

- [x] Add top navbar route entry for PDP discovery (`Products` -> `/products`)
- [x] Add `/products` hub page that links to PDP routes (`/products/:slug`)
- [x] Verify live production currently points to old `main` SHA from Coolify logs
- [ ] Push latest PDP/navbar commits to `main` and re-deploy on Coolify
