# T03 — Canonical data model mapping (additive)

**Branch:** `feat/t03-canonical-data-model`  
**Status:** Mapping + additive Convex tables drafted. **No production migration, no legacy score reinterpretation, no deploy.**  
**Gate:** Owner approval required before any destructive schema change or data backfill that mutates existing `novaTrustScores` / `novaIntegrationScores` values.

---

## Spec sources

| Source | Role |
|---|---|
| `thesynlab_research_and_cursor_plan.json` 뿯↽ `technical_architecture.data_entities` | Proposed entities |
| `scoring_specification.canonical_scale` | Proposed storage 0–100; convert only when source scale is known |
| Phase 0 UI freeze | Public product pages display **0–10**; catalog counts from `STATIC_PRODUCTS` |
| `convex/schema.ts` | Existing persistence |

---

## Scale policy (do not silently convert)

| Layer | Scale | Rule |
|---|---|---|
| Public product UI / prerender (Phase 0) | **0–10** | Keep until T04/T05 + editorial approval |
| Research proposed storage | **0–100** | New snapshot rows may store 0–100 **only with explicit `scoreScale`** |
| Legacy `novaTrustScores.totalScore` / component fields | **unknown** until typed | Quarantine via `scoreScaleProvenance = "unknown"`; never invent conversion |
| Static catalog (`STATIC_PRODUCTS`) | Documented **/10** | Typed; convertible via `src/lib/scoring/scale.ts` |
| `saasTools` trust/integration | **/5** (UI 뿯½2 뿯↽ /10) | Typed; convert only with `from: "0-5"` |

Unknown ≠ failed ≠ N/A. Quarantined rows are not eligible for categorical “best of” rankings.

---

## Entity 뿯↽ existing persistence map

| Proposed entity | Existing table / surface | Mapping decision |
|---|---|---|
| **Product** | `novaProducts` | **Reuse.** Add optional `canonicalCategoryId`, `vendorId` later; do not fork catalog. |
| **ProductPlan** | Partial: `productPricingParams` + `novaProducts.price*` | **New table** `canonicalProductPlans` (additive). Link `productId`. Do not delete pricing params. |
| **PriceObservation** | Partial: `productPricingParams.lastVerifiedAt`, `sourceUrl` | **New table** `canonicalPriceObservations`. |
| **Rubric** | Partial: `methodologyVersion` strings on trust/integration scores | **New table** `canonicalRubrics`. Legacy methodology strings stay; new scores reference rubric ids. |
| **TestRun** | Partial: `labTestedAt` / `labTestedBy` on product; notes on score rows | **New table** `canonicalTestRuns`. |
| **TestResult** | Partial: `testResults` any-blob on integration scores | **New table** `canonicalTestResults`. |
| **EvidenceArtifact** | Partial: `evidenceUrls` string arrays | **New table** `canonicalEvidenceArtifacts` (metadata only; blob storage later in T06). |
| **Claim** | None (hard-coded marketing copy) | **New table** `canonicalClaims` + status enum. |
| **ScoreSnapshot** | Partial: `novaTrustScores` / `novaIntegrationScores` with `isCurrent` | **New table** `canonicalScoreSnapshots`. Legacy rows remain the read path until adapters + T05. |
| **Review** | `productReviews` (+ translations) | **Reuse** with optional `scoreSnapshotId` field when wiring (additive optional). |
| **IntegrationEdge** | `novaEcosystemCompatibility`, stack/compat tables | **New table** `canonicalIntegrationEdges` for plan-to-plan tested edges; keep ecosystem table. |
| **CostScenario** | `tcoCalculations`, `productTcoScores`, client `calculateTco36` | **New table** `canonicalCostScenarios` for typed 36-month scenarios; keep session calculators. |
| Conflict/disclosure / correction / unknown | Disclosure pages; no structured store | Deferred tables or fields in later PRs; claims status covers “unverified”. |

Dual static catalogs (`STATIC_PRODUCTS`, `saasTools`) are **not** Convex tables. T03 does not merge them; T05 selects published snapshots for UI.

---

## Additive Convex module

| File | Purpose |
|---|---|
| `convex/schemaCanonical.ts` | Table field schemas for T03 entities |
| `convex/schema.ts` | Registers `canonical*` tables (spread / `defineTable`) |
| `convex/lib/scoreScale.ts` | Shared Convex-side scale literals matching `src/lib/scoring/scale.ts` |

---

## Migration / rollback plan (not executed)

1. **Backup:** Convex dashboard export or `npx convex export` of production/staging before any backfill.  
2. **Forward (idempotent):** Insert-only into `canonical*` tables; never overwrite `novaTrustScores.totalScore`.  
3. **Legacy adapter (read path):** Prefer `canonicalScoreSnapshots` where `publishedAt` set and `status === "published"`; else fall back to `novaTrustScores`/`novaIntegrationScores` where `isCurrent`.  
4. **Quarantine job:** Rows with missing/unknown scale 뿯↽ `status: "quarantined"`, excluded from rankings.  
5. **Rollback:** Stop writing to `canonical*`; remove optional FKs; legacy tables unchanged 뿯↽ read path restores automatically.

**Not in this PR:** destructive drops, value rewriting, production deploy, fabricated TestRun histories.

---

## Acceptance checklist (T03)

- [x] Proposed entities mapped onto existing persistence with exact table names  
- [x] Additive typed tables for rubric, snapshot, claim, evidence, plan, price, test run/result, cost scenario, integration edge  
- [ ] Staging migration pass (blocked — needs owner staging + approval)  
- [ ] Rollback drill on staging (blocked)  
- [ ] Unknown-scale quarantine job (follows after approval)

---

## Next after approval

1. Owner approves additive deploy of empty `canonical*` tables to staging.  
2. Idempotent seed of **draft** rubrics (illustrative weights from spec — marked `status: "draft"`, not production-scoring).  
3. T04 pure scoring engine against `canonicalRubrics` + fixtures.  
4. T05 switch public surfaces to published snapshots only.
