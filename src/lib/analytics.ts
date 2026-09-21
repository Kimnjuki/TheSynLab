/**
 * Google Analytics 4 (GA4) utility module — TheSynLab.
 *
 * AN-1 (single property): the Google tag is loaded ONCE, from `index.html`, with the
 * measurement ID injected at build time from VITE_GA4_MEASUREMENT_ID. This module
 * never initialises a second gtag/react-ga4 instance: doing so produced two
 * properties receiving the same session, which is why GA4 reports disagreed with
 * each other and with Search Console.
 *
 * AN-2 (no duplicate page views): gtag fires `page_view` automatically on load and
 * on browser-history changes (Enhanced Measurement). `trackPageView()` therefore
 * only sends page views for SPA navigations it has not already sent — see
 * https://developers.google.cn/analytics/devguides/collection/ga4/views
 * ("Ensure you disable automatic pageviews before sending manual ones to avoid
 * duplicate pageviews").
 *
 * AN-3 (no synthetic metadata): never set `engagement_time_msec` by hand. GA4
 * derives engagement time from the time between events; overriding it with a
 * hardcoded value destroys "Average engagement time".
 * https://support.google.com/analytics/answer/11109416
 *
 * AN-4 (no bot / localhost pollution): `index.html` sets `window.__tslGaActive`
 * to false for automated clients and local hosts. Every helper here is a no-op
 * unless that flag is true, so bot traffic cannot enter the property.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    /** Set by the inline Google tag loader in index.html. */
    __tslGaActive?: boolean;
  }
}

/** Canonical measurement ID — must match index.html / vite.config.ts injection. */
const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() || "G-NC8K7M5LRX";

/** True when the Google tag is running for this client (see index.html AN-2/AN-4). */
export function isAnalyticsEnabled(): boolean {
  return typeof window !== "undefined" && window.__tslGaActive === true;
}

/** Landing URL already counted by the automatic page_view that the tag sends on load. */
let lastSentPageKey: string | null =
  typeof window !== "undefined"
    ? window.location.pathname + window.location.search
    : null;

function push(args: unknown[]): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/**
 * Kept for backwards compatibility. The Google tag is loaded by index.html, so
 * there is nothing to initialise — this only reports configuration drift in dev.
 */
export function initGA(): void {
  if (typeof window === "undefined") return;
  if (import.meta.env.DEV && !isAnalyticsEnabled()) {
    // Expected in local development (the tag is gated off for local hosts).
    return;
  }
}

/**
 * Send a virtual page view for an SPA navigation.
 *
 * The first call for the current landing URL is intentionally skipped: GA4 already
 * sent it when the tag loaded. Sending it again is the classic SPA double-count.
 */
export function trackPageView(path: string): void {
  if (!isAnalyticsEnabled()) return;

  const key = path || window.location.pathname + window.location.search;
  if (key === lastSentPageKey) return;
  lastSentPageKey = key;

  push([
    "event",
    "page_view",
    {
      page_location: window.location.origin + key,
      page_title: document.title,
      page_path: key,
    },
  ]);
}

/**
 * Track a custom event.
 *
 * @param category  Event category (e.g. "user", "product", "engagement")
 * @param action    Event action (e.g. "click", "affiliate_click")
 * @param label     Optional event label (e.g. product slug or button name)
 * @param value     Optional numeric value (e.g. price, score, duration)
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  if (!isAnalyticsEnabled()) return;

  // `engagement_time_msec` is deliberately never set here — see AN-3.
  const params: Record<string, unknown> = { event_category: category };
  if (label !== undefined) params.event_label = label;
  if (value !== undefined) params.value = value;

  push(["event", action, params]);
}

/** Track an exception / error. */
export function trackException(description: string, fatal = false): void {
  if (!isAnalyticsEnabled()) return;
  push([
    "event",
    "exception",
    {
      event_category: "Error",
      description,
      fatal,
      non_interaction: true,
    },
  ]);
}

/** Measurement ID currently compiled into the bundle (for diagnostics/UI). */
export const ANALYTICS_MEASUREMENT_ID = GA_MEASUREMENT_ID;
