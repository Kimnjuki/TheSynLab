import { readAdEnv as read } from "./adNetworks";

/**
 * Adnium ad-network integration — single source of truth.
 *
 * Adnium is one of three demand sources (AdSense · Adsterra · Adnium); cross-network
 * rules live in `src/lib/adNetworks.ts`. It is wired the same way the AdSense slots
 * already are: build-time `VITE_*` env vars, advertising-cookie consent gating
 * (`@/lib/consent`) and Convex `adSlotConfigs` rows for per-template routing
 * (`adNetworkTag`).
 *
 * Publisher key: `ADN55c88d9c53ef4` (from adn_verify.txt). Override with
 * `VITE_ADNIUM_SITE_KEY` if the key in the Adnium dashboard changes.
 *
 * Official popunder tag (Adnium Help Center "Popunder code trigger class solution"):
 *   //a.adnium.com/popunder?fpt=1&ctu=1&tu=1&r=<rand>&id=<zone>&pid=<pid>&sid=<sid>&tid=<type>&w=<w>&h=<h>
 *   + data-trigger-classes="<css classes>"  ← restricts the popunder to clicks on the
 *     listed non-navigation elements. Adnium's own guidance: "add as many
 *     non-navigation classes as possible… maximize the number of popunders while
 *     staying google compliant."
 *
 * Zone types (`tid`), per the Adnium API `publisher/zone/types` list: 1 = banner,
 * 2 = interstitial, 3 = in-page push, 4 = popunder. Popunder is the default.
 */

/** Public Adnium publisher key committed for the Adnium verification file (adn_verify.txt). */
export const ADNIUM_KEY_FALLBACK = "ADN55c88d9c53ef4";

/** Adnium tag host (protocol-relative in Adnium's own snippet; we pin https). */
export const ADNIUM_HOST = "https://a.adnium.com";

export type AdniumZone = {
  /** Adnium zone id. */
  id: string;
  /** Adnium publisher id. */
  pid: string;
  /** Adnium site id. */
  sid: string;
  /** Adnium zone type (1 banner · 2 interstitial · 3 in-page push · 4 popunder). */
  type: string;
  width: string;
  height: string;
};

/** Adnium publisher key — env override wins, committed fallback otherwise. */
export function getAdniumSiteKey(): string {
  return read("VITE_ADNIUM_SITE_KEY") ?? ADNIUM_KEY_FALLBACK;
}

/**
 * Adnium is opt-out: it is active unless `VITE_ADNIUM_ENABLED=0`, so the platform
 * works out of the box the moment zones are configured.
 */
export function isAdniumEnabled(): boolean {
  return read("VITE_ADNIUM_ENABLED") !== "0";
}

/** Site-wide popunder tag. Opt-out via `VITE_ADNIUM_POPUNDER=0`. */
export function isAdniumPopunderEnabled(): boolean {
  return isAdniumEnabled() && read("VITE_ADNIUM_POPUNDER") !== "0";
}

/** CSS classes allowed to trigger a popunder (Adnium `data-trigger-classes`). */
export function getAdniumTriggerClasses(): string[] {
  return (read("VITE_ADNIUM_TRIGGER_CLASSES") ?? "")
    .split(/[\s,]+/)
    .map((cls) => cls.trim())
    .filter(Boolean);
}

/** Zone id per AdSlot `slotName` (mirrors the AdSense `VITE_ADSENSE_SLOT_*` map). */
const ADNIUM_ENV_SLOTS: Record<string, string | undefined> = {
  review_sidebar: import.meta.env.VITE_ADNIUM_SLOT_REVIEW_SIDEBAR,
  home_leaderboard: import.meta.env.VITE_ADNIUM_SLOT_HOME_LEADERBOARD,
  compare_inline: import.meta.env.VITE_ADNIUM_SLOT_COMPARE_INLINE,
  comparison_sidebar: import.meta.env.VITE_ADNIUM_SLOT_COMPARE_SIDEBAR,
  hub_hero_below: import.meta.env.VITE_ADNIUM_SLOT_HUB_HERO_BELOW,
  forum_in_article_1: import.meta.env.VITE_ADNIUM_SLOT_FORUM_IN_ARTICLE_1,
};

function zoneFromParts(zoneId: string, type: string): AdniumZone {
  return {
    id: zoneId,
    pid: read("VITE_ADNIUM_ZONE_PID") ?? "0",
    sid: read("VITE_ADNIUM_ZONE_SID") ?? "0",
    type,
    width: read("VITE_ADNIUM_ZONE_WIDTH") ?? "0",
    height: read("VITE_ADNIUM_ZONE_HEIGHT") ?? "0",
  };
}

/**
 * Adnium zone for a named AdSlot, or null when that slot has no Adnium zone yet.
 *
 * In-slot zones default to `tid=1` (banner) — an in-slot unit must not be a popunder —
 * and can be overridden per deployment with `VITE_ADNIUM_SLOT_TYPE` (e.g. `3` for
 * in-page push).
 */
export function getAdniumZoneForSlot(slotName: string): AdniumZone | null {
  if (!isAdniumEnabled()) return null;
  const raw = ADNIUM_ENV_SLOTS[slotName];
  const zoneId = typeof raw === "string" ? raw.trim() : "";
  if (!zoneId) return null;
  return zoneFromParts(zoneId, read("VITE_ADNIUM_SLOT_TYPE") ?? "1");
}

/** Site-wide zone (`VITE_ADNIUM_ZONE_ID`), popunder by default. Null when unset. */
export function getAdniumPopunderZone(): AdniumZone | null {
  const zoneId = read("VITE_ADNIUM_ZONE_ID");
  if (!zoneId) return null;
  return zoneFromParts(zoneId, read("VITE_ADNIUM_ZONE_TYPE") ?? "4");
}

/**
 * Builds the Adnium invocation URL.
 *
 * `VITE_ADNIUM_TAG_URL` (the exact code from Adnium → Zones → Get code) always wins
 * when present, so an in-page-push/native/in-slot zone can be dropped in verbatim with
 * `{id}`, `{pid}`, `{sid}`, `{type}`, `{width}`, `{height}`, `{key}` and `{random}`
 * placeholders. Without it we emit Adnium's published popunder tag.
 */
export function buildAdniumUrl(zone: AdniumZone): string {
  const random = String(Math.floor(Math.random() * 99999999));
  const key = getAdniumSiteKey();
  const template = read("VITE_ADNIUM_TAG_URL");

  if (template) {
    const values: Record<string, string> = {
      id: zone.id,
      pid: zone.pid,
      sid: zone.sid,
      type: zone.type,
      width: zone.width,
      height: zone.height,
      key,
      random,
    };
    return template.replace(/\{(\w+)\}/g, (match, name: string) => values[name] ?? match);
  }

  const params = new URLSearchParams({
    fpt: "1",
    ctu: "1",
    tu: "1",
    r: random,
    id: zone.id,
    pid: zone.pid,
    sid: zone.sid,
    tid: zone.type,
    w: zone.width,
    h: zone.height,
  });
  params.set("key", key);
  return `${ADNIUM_HOST}/popunder?${params.toString()}`;
}

/**
 * Mounts an Adnium zone into `container` exactly once and returns the created tag.
 *
 * Adnium's tag resolves its zone from its own parent element, so the script has to be
 * appended to the element that represents the zone (`<div id="adn-<zoneId>">`), not to
 * `document.head`.
 */
export function mountAdniumZone(container: HTMLElement, zone: AdniumZone): HTMLScriptElement | null {
  if (!isAdniumEnabled()) return null;
  const selector = `script[data-adnium-zone="${zone.id}"]`;
  const existing = document.querySelector<HTMLScriptElement>(selector);
  if (existing) return existing;

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.setAttribute("data-adnium-zone", zone.id);
  const triggers = getAdniumTriggerClasses();
  if (triggers.length) script.setAttribute("data-trigger-classes", triggers.join(" "));
  script.src = buildAdniumUrl(zone);
  container.appendChild(script);
  return script;
}

