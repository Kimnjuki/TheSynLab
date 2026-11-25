/**
 * T03 — Canonical integrity tables (additive).
 * See docs/T03_SCHEMA_MAPPING.md.
 * Do not mutate or reinterpret legacy novaTrustScores / novaIntegrationScores here.
 */
import { v } from "convex/values";
import {
  scoreScaleProvenanceValidator,
  scoreScaleValidator,
} from "./lib/scoreScale";

const claimStatus = v.union(
  v.literal("draft"),
  v.literal("verified"),
  v.literal("unverified"),
  v.literal("expired"),
  v.literal("retracted"),
  v.literal("quarantined"),
);

const publicationStatus = v.union(
  v.literal("draft"),
  v.literal("provisional"),
  v.literal("published"),
  v.literal("superseded"),
  v.literal("quarantined"),
);

const criterionState = v.union(
  v.literal("pass"),
  v.literal("fail"),
  v.literal("unknown"),
  v.literal("na"),
);

/** Versioned scoring rubric (category-specific). Illustrative until editorial approval. */
export const canonicalRubricsFields = {
  categoryKey: v.string(), // e.g. saas_trust, saas_integration, hardware_trust
  version: v.string(), // semver-like "0.1.0"
  title: v.string(),
  criteria: v.array(
    v.object({
      criterionId: v.string(),
      label: v.string(),
      weight: v.number(), // relative weight; sum documented per rubric
      mandatory: v.boolean(),
      applicabilityNote: v.optional(v.string()),
    }),
  ),
  applicabilityRules: v.optional(v.string()),
  scoreScale: scoreScaleValidator, // proposed storage default 0-100 when approved
  status: publicationStatus,
  effectiveAt: v.optional(v.number()),
  approvedBy: v.optional(v.string()),
  approvedAt: v.optional(v.number()),
  notes: v.optional(v.string()),
  createdAt: v.number(),
  createdBy: v.optional(v.string()),
};

/** Product plan scoped to region / billing (separate from seat quotes). */
export const canonicalProductPlansFields = {
  productId: v.id("novaProducts"),
  name: v.string(),
  region: v.optional(v.string()),
  billingCurrency: v.string(),
  validFrom: v.optional(v.number()),
  validTo: v.optional(v.number()),
  status: publicationStatus,
  createdAt: v.number(),
};

/** Point-in-time price capture with typed units. */
export const canonicalPriceObservationsFields = {
  planId: v.id("canonicalProductPlans"),
  sourceUrl: v.optional(v.string()),
  capturedAt: v.number(),
  billingUnit: v.string(), // seat_month | account_month | one_time | usage
  amountMinor: v.number(), // integer minor currency units
  currency: v.string(),
  taxStatus: v.union(
    v.literal("included"),
    v.literal("excluded"),
    v.literal("unknown"),
  ),
  minSeats: v.optional(v.number()),
  evidenceId: v.optional(v.id("canonicalEvidenceArtifacts")),
  createdAt: v.number(),
};

/** Hands-on or researched test run metadata (no fabricated histories). */
export const canonicalTestRunsFields = {
  productId: v.id("novaProducts"),
  planId: v.optional(v.id("canonicalProductPlans")),
  rubricId: v.id("canonicalRubrics"),
  reviewerId: v.optional(v.string()),
  status: v.union(
    v.literal("planned"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("aborted"),
    v.literal("quarantined"),
  ),
  startAt: v.optional(v.number()),
  endAt: v.optional(v.number()),
  activeMinutes: v.optional(v.number()),
  environment: v.optional(v.string()),
  datasetVersion: v.optional(v.string()),
  acquisition: v.optional(v.string()), // purchased | trial | vendor_provided | research_only
  conflictDeclaration: v.optional(v.string()),
  createdAt: v.number(),
};

export const canonicalTestResultsFields = {
  runId: v.id("canonicalTestRuns"),
  criterionId: v.string(),
  state: criterionState,
  measurement: v.optional(v.number()),
  unit: v.optional(v.string()),
  repetitions: v.optional(v.number()),
  artifactIds: v.optional(v.array(v.id("canonicalEvidenceArtifacts"))),
  limitations: v.optional(v.string()),
  createdAt: v.number(),
};

/** Metadata for evidence; blob bytes live in storage (T06). */
export const canonicalEvidenceArtifactsFields = {
  runId: v.optional(v.id("canonicalTestRuns")),
  kind: v.string(), // screenshot | log | csv | policy_pdf | other
  sha256: v.optional(v.string()),
  storageKey: v.optional(v.string()),
  capturedAt: v.optional(v.number()),
  publicRedactedKey: v.optional(v.string()),
  redactionStatus: v.union(
    v.literal("none"),
    v.literal("pending"),
    v.literal("redacted"),
    v.literal("blocked"),
  ),
  retentionClass: v.optional(v.string()),
  accessLevel: v.union(
    v.literal("private"),
    v.literal("internal"),
    v.literal("public_redacted"),
  ),
  createdAt: v.number(),
};

/** Marketing / editorial claims with provenance and expiry. */
export const canonicalClaimsFields = {
  subjectType: v.string(), // product | site | methodology | social_proof
  subjectId: v.optional(v.string()), // slug or product id string
  text: v.string(),
  claimType: v.union(
    v.literal("observed"),
    v.literal("vendor_reported"),
    v.literal("inferred"),
  ),
  sourceIds: v.optional(v.array(v.string())),
  artifactIds: v.optional(v.array(v.id("canonicalEvidenceArtifacts"))),
  verifiedAt: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
  reviewerId: v.optional(v.string()),
  status: claimStatus,
  createdAt: v.number(),
};

/**
 * Immutable-ish published score snapshot.
 * Links optional legacy trust/integration rows without rewriting them.
 */
export const canonicalScoreSnapshotsFields = {
  productId: v.id("novaProducts"),
  planId: v.optional(v.id("canonicalProductPlans")),
  rubricId: v.id("canonicalRubrics"),
  runIds: v.optional(v.array(v.id("canonicalTestRuns"))),
  dimensionKey: v.string(), // trust | integration | custom
  dimensionScores: v.array(
    v.object({
      criterionId: v.string(),
      score: v.optional(v.number()),
      state: criterionState,
      weight: v.number(),
    }),
  ),
  totalScore: v.optional(v.number()),
  scoreScale: scoreScaleValidator,
  scoreScaleProvenance: scoreScaleProvenanceValidator,
  /** Optional link to legacy row — read-only reference, not a conversion proof. */
  legacyTrustScoreId: v.optional(v.id("novaTrustScores")),
  legacyIntegrationScoreId: v.optional(v.id("novaIntegrationScores")),
  coverage: v.optional(v.number()), // 0-1 weighted evidence coverage
  evidenceTier: v.optional(v.string()), // lab | researched | vendor | unknown
  computedAt: v.number(),
  publishedAt: v.optional(v.number()),
  supersedesId: v.optional(v.id("canonicalScoreSnapshots")),
  status: publicationStatus,
  createdAt: v.number(),
  createdBy: v.optional(v.string()),
};

export const canonicalIntegrationEdgesFields = {
  sourceProductId: v.id("novaProducts"),
  sourcePlanId: v.optional(v.id("canonicalProductPlans")),
  targetProductId: v.id("novaProducts"),
  targetPlanId: v.optional(v.id("canonicalProductPlans")),
  direction: v.union(
    v.literal("unidirectional"),
    v.literal("bidirectional"),
  ),
  operations: v.optional(v.array(v.string())),
  authMethod: v.optional(v.string()),
  protocolVersion: v.optional(v.string()),
  testRunId: v.optional(v.id("canonicalTestRuns")),
  limits: v.optional(v.string()),
  lastVerifiedAt: v.optional(v.number()),
  state: v.union(
    v.literal("verified"),
    v.literal("unverified"),
    v.literal("broken"),
    v.literal("unknown"),
  ),
  createdAt: v.number(),
};

/** Typed 36-month cost scenario (complements session tcoCalculations). */
export const canonicalCostScenariosFields = {
  productId: v.id("novaProducts"),
  planId: v.optional(v.id("canonicalProductPlans")),
  ownerId: v.optional(v.string()),
  inputVersion: v.string(),
  inputs: v.any(), // structured TCO36 inputs; validated in app layer
  priceObservationIds: v.optional(v.array(v.id("canonicalPriceObservations"))),
  assumptions: v.optional(v.string()),
  tco36Total: v.optional(v.number()),
  effectiveMonthly: v.optional(v.number()),
  annualSeatQuote: v.optional(v.number()),
  currency: v.string(),
  priceVerifiedAt: v.optional(v.number()),
  unknownCostsNote: v.optional(v.string()),
  status: publicationStatus,
  createdAt: v.number(),
};
