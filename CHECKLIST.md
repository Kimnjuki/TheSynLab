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
