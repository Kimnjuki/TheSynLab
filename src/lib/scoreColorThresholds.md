# Score Color Thresholds Reference

> **Purpose:** Document every `scoreColor`/`SCORE_COLOR`/`getScoreColor`-style function in the
> codebase, the scale it operates on, and the threshold bands it uses.
>
> **Last updated:** Phase 11 / Gap 3.10 reconciliation
> **Goal:** Every function that receives a trust or integration score must expect a 0-10
> normalized value (the canonical TheSynLab trust scale). Other metric types
> (sentiment 0-1, risk /100, privacy /10, fit-score /100) have their own documented scales.

---

## 1. Canonical 0-10 Trust Score Threshold Map

The reference bands (derived from the methodology page):

| Band   | Label             | Min (inclusive) | Color (text)        | Color (bg)          |
|--------|-------------------|-----------------|---------------------|---------------------|
| Green  | Trustworthy       | 8.4             | `text-green-600`    | `bg-green-500`      |
| Amber  | Caution           | 7.0 - 8.3       | `text-amber-600`    | `bg-amber-500`      |
| Red    | Not Trustworthy   | < 7.0           | `text-red-500`      | `bg-red-500`        |

> **Note:** Page-level `SCORE_COLOR` functions use 8.4/7.6 (doubled from old /5 4.2/3.8).
> `ScoreBadge` and `SCORE_BAR` use 9/7 for coarse 3-tier display. All are /10 scale.

---

## 2. Function Inventory — Trust Score (/10) Functions

| File | Function | Green >= | Amber/Mid >= | Red < | Notes |
|------|----------|----------|-------------|-------|-------|
| `src/components/ScoreBadge.tsx:11` | `getScoreColor` | 9 | 7 | — | Coarse 3-tier badge display |
| `src/components/home/ComparisonSandbox.tsx:44` | `scoreColor` | 7 | 5 | — | 3-tier with design tokens |
| `src/pages/saas/AIToolsCategoryPage.tsx:16` | `SCORE_COLOR` | 8.4 | 7.0 | — | 3-tier green/amber/red |
| `src/pages/saas/AIToolsHub.tsx:40` | `SCORE_COLOR` | 8.4 | 7.0 | — | 3-tier green/amber/red |
| `src/pages/saas/BestToolsRoundup.tsx:19` | `SCORE_COLOR` | 8.4 | 7.0 | — | 3-tier green/amber/red |
| `src/pages/saas/ToolAlternativesPage.tsx:20` | `SCORE_COLOR` | 8.4 | 7.0 | — | 3-tier green/amber/red |
| `src/pages/saas/SaasToolReviewPage.tsx:24` | `SCORE_BAR` | 9 | 7 | — | Returns {pct, color}; pct = score/10*100 |
| `src/pages/saas/SaasToolReviewPage.tsx:31` | `VERDICT` | 8.6 | 8.0 (amber) | 7.4 (red) | 4-tier textual verdict |
| `src/pages/TrustIndex.tsx:50` | `trustScoreColor` | 8.5 | 7.0 | — | /10 scale (was /100 85/70) |

---

## 3. /5 -> /10 Conversion Points

| File | Field | Raw Scale | Conversion | Resulting Scale |
|------|-------|-----------|------------|-----------------|
| `src/pages/saas/SaasToolReviewPage.tsx:70` | `tool.trustScore` | 0-5 | `* 2` | 0-10 |
| `src/pages/saas/SaasToolReviewPage.tsx:71` | `tool.integrationScore` | 0-5 | `* 2` | 0-10 |
| `src/components/ai/IntegrationScoreBreakdown.tsx:24` | `score` (prop) | 0-10 | `* 10` internal | 0-100 pct |
| `src/components/ai/TrustScoreBreakdown.tsx:87` | `overallScore` | 0-10 | `* 10` internal | 0-100 pct |

---

## 4. Data Sources — Score Scales at Rest

| File | Fields | Scale | Notes |
|------|--------|-------|-------|
| `src/data/saasTools.ts` | `trustScore`, `integrationScore` | **0-5** | Raw data; multiply by 2 before display as /10 |
| `src/data/staticProductData.ts` | `trustScore`, `integrationScore` | **0-10** | Already canonical; no conversion needed |
| `src/data/expandedProductsStatic.ts` | `trustScore`, `integrationScore` | **0-10** | Already canonical |

---

## 5. Other Metric Scales (NOT trust scores)

| File | Function | Metric | Scale | Green >= | Amber/Mid >= | Red < |
|------|----------|--------|-------|---------|-------------|-------|
| `src/components/ai/FitScoreWidget.tsx:27` | `getScoreColor` | Fit Score | /100 | 80 | 60 | — |
| `src/components/ai/SentimentTimeline.tsx:27` | `getScoreColor` | Sentiment | /1 (x100 display) | 0.7 | 0.4 | — |
| `src/components/products-hub/SocialProofBadge.tsx:16` | `scoreColor` | Social Proof | /100 | 75 | 60 | 40 |
| `src/components/intelligent-home/PrivacyScorecard.tsx:287` | `getScoreColor` | Privacy Score | /10 | 8 | 6 | 4 |
| `src/components/intelligent-home/SentimentAnalysis.tsx:117` | `getScoreColor` | Sentiment | /100 | 80 | 60 | 40 |
| `src/pages/HybridOfficeHub.tsx:160` | `getScoreColor` | Ergonomic Score | /100 | 80 | 60 | 40 |
| `src/pages/TrustIndex.tsx:50` | `trustScoreColor` | Convex novaProducts | /100 | 85 | 70 | — |

---

## 6. Inconsistencies Found

### 6-A. Threshold fragmentation (all /10, but different bands)

Four `SCORE_COLOR` page functions now standardized to **8.4 green / 7.0 amber** for visual consistency.

Remaining intentional variations by component purpose:

| Component set | Green >= | Amber/Mid >= | Rationale |
|---------------|----------|-------------|-----------|
| Page `SCORE_COLOR` (4 files) | 8.4 | 7.0 | Standardized 3-tier green/amber/red |
| `ScoreBadge`, `SaasToolReviewPage.SCORE_BAR` | 9 | 7 | Coarse 3-tier for small badge display |
| `ComparisonSandbox.scoreColor` | 7 | 5 | 3-tier with design tokens (tsl-trust-high/mid/low) |
| `SaasToolReviewPage.VERDICT` | 8.6 | 8.0 / 7.4 | 4-tier textual verdict label |
| `TrustIndex.trustScoreColor` | 8.5 | 7.0 | /10 scale (fixed from /100 85/70) |

**Impact of standardization:** A tool with trust score 8.2 now consistently appears amber across all page-level `SCORE_COLOR` functions (>=7.0, <8.4). Remaining variations are intentional: coarse badges (>=7 secondary), comparison sandbox (>=7 high/green), verdict labels (>=8.0 recommended), and TrustIndex (>=7.0 amber).

### 6-B. eco.rating and setupComplexity

The checklist (Gap 3.10) notes these remain on /5 and must NOT be converted.
Verification needed: confirm no display component feeds them through a /10 color function.

### 6-C. TrustIndex.tsx thresholds — FIXED

`trustScoreColor` thresholds changed from /100 (85/70) to /10 (8.5/7.0) to match
the canonical scale used across the codebase. Display at line 224 (`Math.round(entry.trustScore)`)
is consistent with /10 scale output.