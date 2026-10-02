/**
 * Cross-network ad policy — what may run, and when.
 *
 * TheSynLab serves two demand sources, both consent-gated and both lazily initialised:
 *   • `adsense`  — Google AdSense `<ins>` units (`src/components/ads/AdSlot.tsx`)
 *   • `adsterra` — Adsterra native banner + display banner in slots, plus the popunder
 *                  (`src/lib/adsterra.ts`)
 *
 * This module holds the rules that are *shared* between them so a network module never
 * has to know about the other's env vars.
 */

export type AdNetwork = "adsense" | "adsterra" | "none";

/**
 * `import.meta.env` is typed with explicit keys in `src/vite-env.d.ts`; ad-network
 * config is optionally-present, so read it through a narrow record view instead of
 * sprinkling casts through each module.
 */
const env = import.meta.env as unknown as Record<string, string | undefined>;

/** Trimmed env read; empty/whitespace values are treated as "not set". */
export function readAdEnv(key: string): string | undefined {
  const value = env[key];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

/** Panel/private routes never carry ad tags. */
const AD_TAG_EXCLUDED_PREFIXES = ["/admin", "/auth", "/profile", "/settings", "/tasks"];

/** Route guard shared by every site-wide ad tag. */
export function shouldRunAdScriptsOnPath(pathname: string): boolean {
  return !AD_TAG_EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
