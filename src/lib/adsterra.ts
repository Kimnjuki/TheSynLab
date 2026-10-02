import { readAdEnv } from "./adNetworks";

/**
 * Adsterra integration — single source of truth.
 *
 * Three formats from the Adsterra dashboard are wired here:
 *
 * 1. **Native Banner** (in-slot, rendered by `AdSlot`):
 *    <script async="async" data-cfasync="false" src="…/<KEY>/invoke.js"></script>
 *    <div id="container-<KEY>"></div>
 *    The key is part of both the script URL and the container id — the tag looks for
 *    `#container-<KEY>` in the page, which is why exactly one element may carry that id
 *    (`src/hooks/useAdUnitClaim.ts` enforces it) and why `AdSlot` renders the container
 *    itself instead of letting the network inject one.
 *
 * 2. **Display Banner** (in-slot, rendered by `AdSlot` via an isolated iframe):
 *    <script>atOptions = { key: '<NUMERIC>', format: 'iframe',
 *                         height: <H>, width: <W>, params: {} };</script>
 *    <script src="https://www.highperformanceformat.com/<NUMERIC>/invoke.js"></script>
 *    Unlike the Native Banner above this format has *no container div*. The loader
 *    reads the global `atOptions`, which collides when two units share a React SPA
 *    pageview — so `AdSlot` never injects this tag into the main document:
 *    `buildAdsterraBannerSrcDoc()` renders the exact dashboard snippet into an
 *    isolated `srcdoc` iframe, one per slot.
 *
 * 3. **Popunder** (site-wide, rendered by `AdsterraScript`):
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

/** Container id prefix for Native Banners (Adsterra resolves `#container-<KEY>`). */
export const ADSTERRA_CONTAINER_PREFIX = "container-";

/** Display Banner `invoke.js` host (dashboard default; verbatim per-slot override wins). */
export const ADSTERRA_BANNER_HOST_FALLBACK = "https://www.highperformanceformat.com";

/**
 * Display Banner unit defaults — the two ids supplied from the Adsterra dashboard.
 *
 * Id → creative size is fixed by the dashboard, **not** by this mapping: verify each
 * key's dimensions in Adsterra → Websites → your site → the banner row, and correct
 * the width/height below (or via env) if they differ. A wrong size here clips the
 * creative (slot too small) or leaves a gap — it never breaks the tag.
 */
export const ADSTERRA_BANNER_MEDIUM_RECTANGLE_KEY_FALLBACK = "31489400";
export const ADSTERRA_BANNER_MEDIUM_RECTANGLE_WIDTH_FALLBACK = 300;
export const ADSTERRA_BANNER_MEDIUM_RECTANGLE_HEIGHT_FALLBACK = 250;
export const ADSTERRA_BANNER_LEADERBOARD_KEY_FALLBACK = "31489635";
export const ADSTERRA_BANNER_LEADERBOARD_WIDTH_FALLBACK = 728;
export const ADSTERRA_BANNER_LEADERBOARD_HEIGHT_FALLBACK = 90;

export type AdsterraNativeUnit = {
  key: string;
  src: string;
};

export type AdsterraBannerSize = "300x250" | "728x90";

export type AdsterraBannerUnit = {
  key: string;
  width: number;
  height: number;
  src: string;
};

/** Display Banner slot preference: "banner" forces the iframe unit, "native" the div unit. */
export type AdsterraSlotPreference = "auto" | "banner" | "native";

/** Slot name → env suffix, mirroring the AdSense slot map. */
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

/** Numeric-only variant for the classic display-banner keys. */
function isPlausibleBannerKey(key: string): boolean {
  return /^[0-9]{5,16}$/.test(key);
}

/** Positive finite int; falls back when the env override is garbage. */
function readPositiveInt(envKey: string, fallback: number): number {
  const raw = readAdEnv(envKey);
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Host portion of a banner `invoke.js` URL, used when only a key override is given.
 * Falls back to the dashboard default host when the configured src is not a URL.
 */
function bannerHostFromSrc(src: string): string {
  try {
    return new URL(src).origin;
  } catch {
    return ADSTERRA_BANNER_HOST_FALLBACK;
  }
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
 * Classic Display Banner unit for a named AdSlot, or null when Adsterra has no
 * banner unit for it.
 *
 * Two ways to configure, per slot:
 *   1. Explicit key — `VITE_ADSTERRA_BANNER_SLOT_<SLOTNAME>=31489400` (+ optional
 *      `_WIDTH` / `_HEIGHT` / `_SRC`). Verbatim `_SRC` wins; otherwise the loader is
 *      `<default-banner-host>/<key>/invoke.js`.
 *   2. Size default — when no explicit key is set, a slot whose IAB format matches a
 *      known banner size (`300x250` → medium rectangle, `728x90` → leaderboard)
 *      reuses that size's unit (`VITE_ADSTERRA_BANNER_300X250_KEY` /
 *      `VITE_ADSTERRA_BANNER_728X90_KEY`, defaulting to the two committed ids).
 *
 * A per-slot `_PREFER=banner|native` override pins the format; without it the slot
 * resolves both candidates and `AdSlot` prefers the banner whose size matches the
 * slot's IAB format.
 */
export function getAdsterraBannerUnit(
  slotName: string,
  iabFormat?: string
): AdsterraBannerUnit | null {
  if (!isAdsterraEnabled()) return null;

  const suffix = ADSTERRA_SLOT_SUFFIXES[slotName];
  const explicitKey = suffix ? readAdEnv(`VITE_ADSTERRA_BANNER_SLOT_${suffix}`) : undefined;
  if (explicitKey) {
    if (!isPlausibleBannerKey(explicitKey)) return null;
    const width = suffix
      ? readPositiveInt(`VITE_ADSTERRA_BANNER_SLOT_${suffix}_WIDTH`, 0)
      : 0;
    const height = suffix
      ? readPositiveInt(`VITE_ADSTERRA_BANNER_SLOT_${suffix}_HEIGHT`, 0)
      : 0;
    const fallbackSize =
      iabFormat === "728x90"
        ? { width: ADSTERRA_BANNER_LEADERBOARD_WIDTH_FALLBACK, height: ADSTERRA_BANNER_LEADERBOARD_HEIGHT_FALLBACK }
        : { width: ADSTERRA_BANNER_MEDIUM_RECTANGLE_WIDTH_FALLBACK, height: ADSTERRA_BANNER_MEDIUM_RECTANGLE_HEIGHT_FALLBACK };
    const overrideSrc = suffix ? readAdEnv(`VITE_ADSTERRA_BANNER_SLOT_${suffix}_SRC`) : undefined;
    const host = bannerHostFromSrc(
      overrideSrc ?? readAdEnv("VITE_ADSTERRA_BANNER_SRC") ?? ADSTERRA_BANNER_HOST_FALLBACK
    );
    return {
      key: explicitKey,
      width: width || fallbackSize.width,
      height: height || fallbackSize.height,
      src: overrideSrc ?? `${host}/${explicitKey}/invoke.js`,
    };
  }

  const size: AdsterraBannerSize | null =
    iabFormat === "300x250" ? "300x250" : iabFormat === "728x90" ? "728x90" : null;
  if (!size) return null;
  const compact = size.replace("x", "X");

  if (size === "300x250") {
    const key =
      readAdEnv(`VITE_ADSTERRA_BANNER_${compact}_KEY`) ?? ADSTERRA_BANNER_MEDIUM_RECTANGLE_KEY_FALLBACK;
    if (!isPlausibleBannerKey(key)) return null;
    const host = bannerHostFromSrc(
      readAdEnv(`VITE_ADSTERRA_BANNER_${compact}_SRC`) ??
        readAdEnv("VITE_ADSTERRA_BANNER_SRC") ??
        ADSTERRA_BANNER_HOST_FALLBACK
    );
    return {
      key,
      width: readPositiveInt(
        `VITE_ADSTERRA_BANNER_${compact}_WIDTH`,
        ADSTERRA_BANNER_MEDIUM_RECTANGLE_WIDTH_FALLBACK
      ),
      height: readPositiveInt(
        `VITE_ADSTERRA_BANNER_${compact}_HEIGHT`,
        ADSTERRA_BANNER_MEDIUM_RECTANGLE_HEIGHT_FALLBACK
      ),
      src:
        readAdEnv(`VITE_ADSTERRA_BANNER_${compact}_SRC`) ?? `${host}/${key}/invoke.js`,
    };
  }

  const key =
    readAdEnv(`VITE_ADSTERRA_BANNER_${compact}_KEY`) ?? ADSTERRA_BANNER_LEADERBOARD_KEY_FALLBACK;
  if (!isPlausibleBannerKey(key)) return null;
  const host = bannerHostFromSrc(
    readAdEnv(`VITE_ADSTERRA_BANNER_${compact}_SRC`) ??
      readAdEnv("VITE_ADSTERRA_BANNER_SRC") ??
      ADSTERRA_BANNER_HOST_FALLBACK
  );
  return {
    key,
    width: readPositiveInt(
      `VITE_ADSTERRA_BANNER_${compact}_WIDTH`,
      ADSTERRA_BANNER_LEADERBOARD_WIDTH_FALLBACK
    ),
    height: readPositiveInt(
      `VITE_ADSTERRA_BANNER_${compact}_HEIGHT`,
      ADSTERRA_BANNER_LEADERBOARD_HEIGHT_FALLBACK
    ),
    src: readAdEnv(`VITE_ADSTERRA_BANNER_${compact}_SRC`) ?? `${host}/${key}/invoke.js`,
  };
}

/**
 * Slot format preference (`VITE_ADSTERRA_SLOT_<SLOTNAME>_PREFER=banner|native`).
 * Defaults to `auto` — `AdSlot` prefers the banner unit when its size matches the
 * slot's IAB format, native otherwise.
 */
export function getAdsterraSlotPreference(slotName: string): AdsterraSlotPreference {
  const suffix = ADSTERRA_SLOT_SUFFIXES[slotName];
  const raw = suffix ? readAdEnv(`VITE_ADSTERRA_SLOT_${suffix}_PREFER`)?.toLowerCase() : undefined;
  if (raw === "banner" || raw === "native") return raw;
  return "auto";
}

/**
 * Builds the isolated `srcdoc` document for a Display Banner unit — the exact
 * dashboard snippet (`atOptions` + `invoke.js`), sandboxed per slot so two units can
 * share a pageview without colliding on the global `atOptions`.
 */
export function buildAdsterraBannerSrcDoc(unit: AdsterraBannerUnit): string {
  const options = `var atOptions = { key: '${unit.key}', format: 'iframe', height: ${unit.height}, width: ${unit.width}, params: {} };`;
  // NOTE: `</scr` + `ipt>` avoids the literal `</script>` sequence, which would close the
  // enclosing bundle `<script>` at deploy time. ESLint's no-useless-escape forbids `<\/`.
  const close = "</scr" + "ipt>";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=${unit.width},initial-scale=1"><style>html,body{margin:0;padding:0;background:transparent}body{display:flex;align-items:flex-start;justify-content:center}</style></head><body><script data-cfasync="false">${options}${close}<script data-cfasync="false" async src="${unit.src}">${close}</body></html>`;
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
