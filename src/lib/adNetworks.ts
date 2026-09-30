/**
 * Cross-network ad policy — what may run, and when.
 *
 * TheSynLab serves three demand sources, all consent-gated and all lazily initialised:
 *   • `adsense`  — Google AdSense `<ins>` units (`src/components/ads/AdSlot.tsx`)
 *   • `adsterra` — Adsterra Native Banner in slots + popunder (`src/lib/adsterra.ts`)
 *   • `adnium`   — Adnium in-slot zones + popunder (`src/lib/adnium.ts`)
 *
 * This module holds the rules that are *shared* between them so a network module never
 * has to know about the others' env vars.
 */

export type AdNetwork = "adsense" | "adnium" | "adsterra" | "none";

/** Which popunder tag(s) are allowed to run. */
export type PopunderNetwork = "adsterra" | "adnium" | "both" | "none";

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

/**
 * Popunder arbitration — `VITE_POPUNDER_NETWORK`.
 *
 * Popunder tags hijack the first qualifying click in a document. Running two of them on
 * the same property means the same click fires two pop-unders: users see a second window
 * they never asked for (a common cause of Firefox/Chrome popup blocks and of AdSense
 * policy violations), and the two networks each claim the same session. Exactly one is
 * therefore active unless the deployment deliberately opts into `both`.
 *
 * `none` disables popunders while keeping every in-slot unit on the page.
 * Which value is in play is always explicit: `.env`, `.env.example` and the Dockerfile
 * all set it, and each network still has its own hard kill switch
 * (`VITE_ADSTERRA_POPUNDER=0`, `VITE_ADNIUM_POPUNDER=0`).
 */
export function getPopunderNetwork(): PopunderNetwork {
  const raw = readAdEnv("VITE_POPUNDER_NETWORK")?.toLowerCase();
  if (raw === "adsterra" || raw === "adnium" || raw === "both" || raw === "none") return raw;
  // Default: the Adsterra tag is complete and live, the Adnium tag needs zone ids.
  return "adsterra";
}

/** True when this network's popunder tag is the one allowed to run. */
export function isPopunderAllowed(network: "adsterra" | "adnium"): boolean {
  const active = getPopunderNetwork();
  return active === "both" || active === network;
}
