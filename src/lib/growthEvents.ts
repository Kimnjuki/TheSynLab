/**
 * TheSynLab Growth Events — GA4 instrumentation library.
 *
 * Central registry of the funnel events defined in the SEO/CTR/Growth audit
 * (§6 Product events, §10 Comparison-page tracking). Every helper fans out to
 * BOTH transport channels:
 *
 *   1. GA4 via the existing `trackEvent` wrapper (react-ga4).
 *   2. GTM `dataLayer.push` (used by GTM triggers + server-side tagging),
 *      guarded so it is a no-op when dataLayer is absent.
 *
 * Usage:
 *   import { scorecardViewed, affiliateClick } from "@/lib/growthEvents";
 *   scorecardViewed(tool.slug);
 *   affiliateClick(tool.slug, "verdict-cta");
 */

import { trackEvent } from "@/lib/analytics";

/** Push a raw event object onto the GTM dataLayer when present. */
function pushDataLayer(payload: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const dl = (window as Window & { dataLayer?: object[] }).dataLayer;
  if (Array.isArray(dl)) dl.push(payload);
}

/** Single internal dispatch: GA4 event + matching dataLayer push. */
function emit(
  gaCategory: string,
  gaAction: string,
  label?: string,
  value?: number,
  extra?: Record<string, unknown>
): void {
  trackEvent(gaCategory, gaAction, label, value);
  pushDataLayer({
    event: gaAction,
    event_category: gaCategory,
    event_label: label,
    value,
    ...extra,
  });
}

// ── Money pages / review scorecards ────────────────────────────────────────

/** A tool review scorecard was rendered (non-interaction proxy via pageview timing). */
export function scorecardViewed(toolSlug: string, score?: number): void {
  emit("engagement", "scorecard_viewed", toolSlug, score);
}

/** Affiliate / outbound link click, with CTA placement context. */
export function affiliateClick(toolSlug: string, placement: string): void {
  emit("commerce", "affiliate_click", toolSlug, undefined, { placement });
}

/** Click through from a comparison to a full tool review. */
export function toolReviewClick(toolSlug: string, pageType: string): void {
  emit("engagement", "tool_review_click", toolSlug, undefined, { page_type: pageType });
}

/** Click on a vendor pricing link. */
export function pricingLinkClick(toolSlug: string, placement: string): void {
  emit("commerce", "pricing_link_click", toolSlug, undefined, { placement });
}

/** Click on an alternatives link. */
export function alternativeLinkClick(toolSlug: string, placement: string): void {
  emit("engagement", "alternative_link_click", toolSlug, undefined, { placement });
}

// ── Comparison engine ──────────────────────────────────────────────────────

/** Comparison engine session started (first product selected or ≥2 loaded from URL). */
export function comparisonStarted(productCount: number): void {
  emit("engagement", "comparison_started", undefined, productCount);
}

/** User touched a filter in the comparison grid. */
export function toolFilterUsed(filterName: string, filterValue: string): void {
  emit("engagement", "tool_filter_used", filterName, undefined, { filter_value: filterValue });
}

/** Interaction with the comparison feature table (tab switch / table scroll). */
export function comparisonTableInteraction(category: string, productCount: number): void {
  emit("engagement", "comparison_table_interaction", category, productCount);
}

// ── Decision tools ─────────────────────────────────────────────────────────

/** Stack Builder session opened. */
export function stackBuilderStarted(): void {
  emit("product", "stack_builder_started");
}

/** Stack Builder session completed (finalized/validated stack). */
export function stackBuilderCompleted(productCount: number): void {
  emit("product", "stack_builder_completed", undefined, productCount);
}

// ── Capture & utility ──────────────────────────────────────────────────────

/** Newsletter / email capture success. */
export function emailSignup(location: string): void {
  emit("lead", "email_signup", location);
}

/** Downloadable asset started (reports, PDFs, generated stack files). */
export function downloadStarted(asset: string): void {
  emit("engagement", "download_started", asset);
}

/** On-site search used. */
export function searchUsed(query: string, resultCount?: number): void {
  emit("engagement", "search_used", query, resultCount);
}

/** Reader scrolled past 75% of the page (engagement proxy). */
export function scrollDepth75(path: string): void {
  emit("engagement", "scroll_75_percent", path);
}
