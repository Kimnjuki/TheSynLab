import { readAdEnv } from "./adNetworks";

/**
 * Adsterra integration — single source of truth.
 *
 * Two formats from the Adsterra dashboard are wired here:
 *
 * 1. **Native Banner** (in-slot, rendered by `AdSlot`):
 *    <script async="async" data-cfasync="false" src="…/<KEY>/invoke.js"></script>
 *    <div id="container-<KEY>"></div>
 *    The key is part of both the script URL and the container id — the tag looks for
 *    `#container-<KEY>` in the page, which is why exactly one element may carry that id
 *    (`src/hooks/useAdUnitClaim.ts` enforces it) and why `AdSlot` renders the container
 *    itself instead of letting the network inject one.
 *
 * 2. **Popunder** (site-wide, rendered by `AdsterraScript`):
 *    <script src="…/<xx>/<yy>/<zz>/<HASH>.js"></script>
 *    Mounted after advertising consent and only once per document load.
 *
 * `data-cfasync="false"` is not decoration: without it Cloudflare Rocket Loader rewrites
 * the tag and the unit never fills. Keep it on every Adsterra tag.
 */

/** Native Banner key (from the dashboard snippet). */
export const ADSTERRA_NATIVE_KEY_FALLBACK = "6c361a6751ca12f38bc29d1189826773";

/** Native Banner loader for the key above. */
export const ADSTERRA_NATIVE_SRC_FALLBACK =
  "https://pl31590134.profitableratecpmnetwork.com/6c361a6751ca12f38bc29d1189826773/invoke.js";

/** Popunder tag. */
export const ADSTERRA_POPUNDER_SRC_FALLBACK =
  "https://pl31589899.profitableratecpmnetwork.com/43/2b/19/432b19cb46f5e384280a7ece2773593a.js";

/** Container id Adsterra looks for, given a unit key. */
export const ADSTERRA_CONTAINER_PREFIX = "container-";

export type AdsterraNativeUnit = {
  key: string;
  src: string;
};

/** Slot name → env suffix, mirroring the AdSense/Adnium slot maps. */
const ADSTERRA_SLOT_SUFFIXES: Record<string, string> = {
  review_sidebar: "REVIEW_SIDEBAR",
  home_leaderboard: "HOME_LEADERBOARD",
  compare_inline: "COMPARE_INLINE",
  comparison_sidebar: "COMPARE_SIDEBAR",
  hub_hero_below: "HUB_HERO_BELOW",
  forum_in_article_1: "FORUM_IN_ARTICLE_1",
};

/**
 * Loose sanity check for a pasted key/URL segment. Catches the realistic failure modes —
 * a whole `<script>` tag pasted into the env var, trailing punctuation, an empty value —
 * without hard-coding Adsterra's current id length, which would silently disable the
 * network if they ever change it.
 */
function isPlausibleKey(key: string): boolean {
  return /^[A-Za-z0-9]{8,64}$/.test(key);
}

/** Adsterra is opt-out: active unless `VITE_ADSTERRA_ENABLED=0`. */
export function isAdsterraEnabled(): boolean {
  return readAdEnv("VITE_ADSTERRA_ENABLED") !== "0";
}

/** Popunder tag; opt-out via `VITE_ADSTERRA_POPUNDER=0`. */
export function isAdsterraPopunderEnabled(): boolean {
  return isAdsterraEnabled() && readAdEnv("VITE_ADSTERRA_POPUNDER") !== "0";
}

/** Popunder tag URL (verbatim override wins). */
export function getAdsterraPopunderSrc(): string {
  return readAdEnv("VITE_ADSTERRA_POPUNDER_SRC") ?? ADSTERRA_POPUNDER_SRC_FALLBACK;
}

export function buildAdsterraContainerId(key: string): string {
  return `${ADSTERRA_CONTAINER_PREFIX}${key}`;
}

/**
 * Native Banner unit for a named AdSlot, or null when Adsterra has no unit for it.
 *
 * A per-slot key (`VITE_ADSTERRA_SLOT_<SLOTNAME>`) reuses the default loader and swaps
 * the key segment, which is how additional Adsterra native banners on the same account
 * are addressed. A unit living on a different `pl<id>` host sets
 * `VITE_ADSTERRA_SLOT_<SLOTNAME>_SRC` as well.
 */
export function getAdsterraNativeUnit(slotName: string): AdsterraNativeUnit | null {
  if (!isAdsterraEnabled()) return null;

  const defaultSrc = readAdEnv("VITE_ADSTERRA_NATIVE_SRC") ?? ADSTERRA_NATIVE_SRC_FALLBACK;
  const defaultKey = readAdEnv("VITE_ADSTERRA_NATIVE_KEY") ?? ADSTERRA_NATIVE_KEY_FALLBACK;

  const suffix = ADSTERRA_SLOT_SUFFIXES[slotName];
  const slotKey = suffix ? readAdEnv(`VITE_ADSTERRA_SLOT_${suffix}`) : undefined;

  const key = slotKey ?? defaultKey;
  if (!isPlausibleKey(key)) return null;

  let src = defaultSrc;
  if (slotKey && slotKey !== defaultKey) {
    const override = suffix ? readAdEnv(`VITE_ADSTERRA_SLOT_${suffix}_SRC`) : undefined;
    src = override ?? (defaultSrc.includes(defaultKey) ? defaultSrc.split(defaultKey).join(slotKey) : defaultSrc);
  }

  return { key, src };
}

/**
 * Injects an Adsterra Native Banner loader once for the given unit.
 *
 * The tag is appended to `<body>` (not to the container element) because Adsterra
 * resolves its target by `#container-<KEY>` lookup, and appended only after the slot is
 * near the viewport — Adsterra scripts are heavy and must not compete with first paint.
 */
export function mountAdsterraNativeUnit(unit: AdsterraNativeUnit): HTMLScriptElement | null {
  if (!isAdsterraEnabled() || !isPlausibleKey(unit.key)) return null;

  const selector = `script[data-adsterra-native="${unit.key}"]`;
  const existing = document.querySelector<HTMLScriptElement>(selector);
  if (existing) return existing;

  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("data-adsterra-native", unit.key);
  // Rocket Loader / other CF optimisations must leave this tag alone (see module docs).
  script.setAttribute("data-cfasync", "false");
  script.src = unit.src;
  document.body.appendChild(script);
  return script;
}
