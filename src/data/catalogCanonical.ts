/**
 * Dual-catalog consolidation for indexing.
 * When the same slug exists in saasTools (/tool/:slug) and STATIC_PRODUCTS
 * (/products/:slug), Google often picks a different canonical than we intend.
 * Prefer the dedicated /tool/:slug review as the indexable URL.
 */

export const TOOL_CANONICAL_OVER_PRODUCT = [
  "airops",
  "blaze-ai",
  "lalal-ai",
  "magical-ai",
  "mubert",
  "murf-ai",
  "opus-clip",
  "play-ht",
  "remnote",
  "slite",
  "superwhisper",
  "syllaby",
  "tactiq",
  "taskade",
  "textexpander",
  "wispr-flow",
  "writesonic",
] as const;

const overlapSet = new Set<string>(TOOL_CANONICAL_OVER_PRODUCT);

export function prefersToolCanonical(slug: string): boolean {
  return overlapSet.has(slug);
}

export function toolCanonicalPath(slug: string): string {
  return `/tool/${slug}`;
}

export function toolCanonicalUrl(slug: string): string {
  return `https://thesynlab.com/tool/${slug}`;
}