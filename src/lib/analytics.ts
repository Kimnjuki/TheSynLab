import ReactGA from "react-ga4";

/**
 * Google Analytics 4 (GA4) utility module.
 *
 * Reads the measurement ID from VITE_GA4_MEASUREMENT_ID (defined in .env / .env.example).
 * Falls back to the default TheSynLab GA4 property (G-NC8K7M5LRX) if not set.
 *
 * Usage:
 *   import { initGA, trackPageView, trackEvent } from "@/lib/analytics";
 *
 *   initGA();
 *   trackPageView(location.pathname + location.search);
 *   trackEvent("click", "affiliate_link", "Notion");
 */

const GA_MEASUREMENT_ID =
  (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() ||
  "G-NC8K7M5LRX";

let initialized = false;

/** Initialise GA4 (safe to call multiple times — only initialises once). */
export function initGA(): void {
  if (initialized || typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;

  ReactGA.initialize(GA_MEASUREMENT_ID, {
    gaOptions: {
      cookie_flags: "SameSite=None;Secure",
    },
  });
  initialized = true;
}

/** Track a page view (call on every route change). */
export function trackPageView(path: string): void {
  if (typeof window === "undefined" || !initialized) return;
  ReactGA.send({ hitType: "pageview", page: path });
}

/**
 * Track a custom event.
 *
 * @param category  Event category (e.g. "user", "product", "engagement")
 * @param action    Event action (e.g. "click", "search", "affiliate_click")
 * @param label     Optional event label (e.g. product slug or button name)
 * @param value     Optional numeric value (e.g. price, score, duration)
 */
export function trackEvent(
  category: string,
  action: string,
  label?: string,
  value?: number
): void {
  if (typeof window === "undefined" || !initialized) return;
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
}

/** Track an exception / error. */
export function trackException(description: string, fatal = false): void {
  if (typeof window === "undefined" || !initialized) return;
  ReactGA.event({
    category: "Error",
    action: "exception",
    label: description,
    nonInteraction: true,
    ...(fatal ? { value: 1 } : {}),
  });
}