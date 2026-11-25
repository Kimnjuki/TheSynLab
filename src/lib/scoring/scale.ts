/**
 * Typed score-scale helpers (T04/T05 foundation).
 * Convert only when the source scale is explicitly known — never invent evidence.
 */

export type ScoreScale = "0-5" | "0-10" | "0-100";

export interface ScaledScore {
  value: number;
  scale: ScoreScale;
  sourceScale: ScoreScale;
  converted: boolean;
}

export function isValidScore(value: number, scale: ScoreScale): boolean {
  if (!Number.isFinite(value)) return false;
  const max = scale === "0-5" ? 5 : scale === "0-10" ? 10 : 100;
  return value >= 0 && value <= max;
}

/** Convert only when both scales are typed. Unknown → null (quarantine). */
export function convertScore(
  value: number,
  from: ScoreScale,
  to: ScoreScale
): ScaledScore | null {
  if (!isValidScore(value, from)) return null;
  if (from === to) {
    return { value, scale: to, sourceScale: from, converted: false };
  }

  const to100 =
    from === "0-5" ? value * 20 : from === "0-10" ? value * 10 : value;

  let next: number;
  if (to === "0-100") next = to100;
  else if (to === "0-10") next = to100 / 10;
  else next = to100 / 20;

  if (to !== "0-100") {
    next = Math.round(next * 10) / 10;
  } else {
    next = Math.round(next);
  }

  if (!isValidScore(next, to)) return null;
  return { value: next, scale: to, sourceScale: from, converted: true };
}

/** Explicit fixture: 6.8/10 → 68/100 without fabricating new evidence. */
export const SCALE_CONVERSION_FIXTURES = [
  { from: "0-10" as const, to: "0-100" as const, input: 6.8, expected: 68 },
  { from: "0-5" as const, to: "0-10" as const, input: 3.4, expected: 6.8 },
  { from: "0-100" as const, to: "0-10" as const, input: 68, expected: 6.8 },
];