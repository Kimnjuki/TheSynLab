/**
 * A/B Test Harness — cookie-based variant assignment
 * 
 * Usage:
 *   const variant = useAbTest('hero-cta');
 *   // variant → 'control' | 'variant-a' | 'variant-b'
 */

import { trackEvent } from '@/lib/analytics';

const STORAGE_KEY = 'synlab_ab_tests';

const defaultExperiments: Record<string, { variants: string[]; weights?: number[] }> = {
  'hero-cta': {
    variants: ['control', 'variant-a'],
    // control: "Take the Stack Quiz", variant-a: "Start free quiz →"
  },
  'tool-detail-layout': {
    variants: ['control', 'variant-a'],
    // control: current layout, variant-a: quick picks first
  },
  'quick-picks-box': {
    variants: ['control', 'variant-a'],
    // control: static, variant-a: animated/persistent
  },
};

function getStoredAssignments(): Record<string, string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function storeAssignment(name: string, variant: string): void {
  try {
    const assignments = getStoredAssignments();
    assignments[name] = variant;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch {
    // localStorage unavailable
  }
}

function assignVariant(experiment: { variants: string[]; weights?: number[] }): string {
  const { variants, weights } = experiment;
  if (variants.length === 1) return variants[0];

  const w = weights || variants.map(() => 1 / variants.length);
  const totalWeight = w.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;

  for (let i = 0; i < variants.length; i++) {
    rand -= w[i];
    if (rand <= 0) return variants[i];
  }
  return variants[0];
}

/**
 * Get the assigned variant for an A/B test experiment.
 * Assignments are deterministic per user session (stored in localStorage).
 */
export function getAbVariant(experimentName: string): string {
  const experiment = defaultExperiments[experimentName];
  if (!experiment) return 'control';

  const stored = getStoredAssignments();
  if (stored[experimentName]) return stored[experimentName];

  const variant = assignVariant(experiment);
  storeAssignment(experimentName, variant);
  return variant;
}

/**
 * Track A/B test impression + conversion events.
 * Routes through the single GA4 helper (one property, bot/localhost gated) instead
 * of tagging `window.gtag` directly with an `any` cast.
 */
export function trackAbEvent(
  experimentName: string,
  variant: string,
  eventType: 'impression' | 'conversion',
  metadata?: Record<string, string>
): void {
  trackEvent('experiment', 'ab_test', `${experimentName}:${variant}:${eventType}`, undefined);
  pushExperimentContext({ experiment_name: experimentName, variant, event_type: eventType, ...metadata });
}

/** Push experiment context onto the GTM dataLayer when present (no-op otherwise). */
function pushExperimentContext(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const dl = window.dataLayer;
  if (Array.isArray(dl)) dl.push({ event: 'ab_test', ...payload });
}


/**
 * React hook for A/B test variants.
 */
export function useAbTest(experimentName: string): string {
  if (typeof window === 'undefined') return 'control';
  return getAbVariant(experimentName);
}

export const experiments = defaultExperiments;
export type ExperimentName = keyof typeof defaultExperiments;
