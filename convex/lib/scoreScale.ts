/**
 * Shared score-scale literals for T03+ (Convex side).
 * Convert only when source scale is explicitly known — never invent evidence.
 * Mirrors src/lib/scoring/scale.ts.
 */
import { v } from "convex/values";

export const scoreScaleValidator = v.union(
  v.literal("0-5"),
  v.literal("0-10"),
  v.literal("0-100"),
);

export const scoreScaleProvenanceValidator = v.union(
  v.literal("typed"),
  v.literal("converted"),
  v.literal("unknown"),
  v.literal("quarantined"),
);

export type ScoreScale = "0-5" | "0-10" | "0-100";
export type ScoreScaleProvenance =
  | "typed"
  | "converted"
  | "unknown"
  | "quarantined";
