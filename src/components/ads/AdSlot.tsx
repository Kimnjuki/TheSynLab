import { useEffect, useMemo, useRef, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAdConsent } from "./AdSlotProvider";
import { useElementInView } from "@/hooks/useElementInView";
import { useAdSlotBudget } from "@/hooks/useAdSlotBudget";
import {
  getAdniumZoneForSlot,
  mountAdniumZone,
  type AdNetwork,
  type AdniumZone,
} from "@/lib/adnium";

type AdFormat = "300x250" | "728x90" | "300x600" | "in_article";

const formatDimensions: Record<AdFormat, { width: number; height: number }> = {
  "300x250": { width: 300, height: 250 },
  "728x90": { width: 728, height: 90 },
  "300x600": { width: 300, height: 600 },
  in_article: { width: 728, height: 250 },
};

/** AdSense ad-unit id per AdSlot `slotName` (build-time config). */
const ADSENSE_ENV_SLOTS: Record<string, string | undefined> = {
  review_sidebar: import.meta.env.VITE_ADSENSE_SLOT_REVIEW_SIDEBAR,
  home_leaderboard: import.meta.env.VITE_ADSENSE_SLOT_HOME_LEADERBOARD,
  compare_inline: import.meta.env.VITE_ADSENSE_SLOT_COMPARE_INLINE,
  comparison_sidebar: import.meta.env.VITE_ADSENSE_SLOT_COMPARE_SIDEBAR,
  hub_hero_below: import.meta.env.VITE_ADSENSE_SLOT_HUB_HERO_BELOW,
  forum_in_article_1: import.meta.env.VITE_ADSENSE_SLOT_FORUM_IN_ARTICLE_1,
};

/** Subset of a Convex `adSlotConfigs` row that this component needs. */
type AdSlotConfig = {
  slotName: string;
  position: string;
  isActive?: boolean;
  adNetworkTag?: string;
  minContentLength?: number;
};

/**
 * Reserved ad unit.
 *
 * Placement/efficiency rules enforced here (see docs/ADNIUM_INTEGRATION.md):
 *  1. Consent first — nothing is requested before advertising cookies are accepted.
 *  2. Per-pageview budget — never more units than `VITE_AD_UNITS_PER_PAGE` per page.
 *  3. Content threshold — never next to thin content (`minContentLength`).
 *  4. Lazy load — the unit is only requested once it is within 300 px of the viewport.
 *  5. Viewability — the impression is logged only after 50 % of the unit has been
 *     visible for 1 s (IAB), so reported impressions match what advertisers bought.
 *  6. Network routing — Convex `adNetworkTag` pins AdSense or Adnium; an unfilled
 *     AdSense-backed slot is backfilled by Adnium instead of collapsing to an empty box.
 *  7. Layout stability — the slot keeps its IAB height while loading (no CLS).
 */

export function AdSlot({
  slotName,
  pageTemplate,
  iabFormat,
  position,
  minContentLength,
}: {
  slotName: string;
  pageTemplate: string;
  iabFormat: AdFormat;
  position: string;
  minContentLength?: number;
}) {
  const convex = useConvex();
  const { canLoadAds } = useAdConsent();
  const logged = useRef(false);
  const insRef = useRef<HTMLModElement | null>(null);
  const adniumRef = useRef<HTMLDivElement | null>(null);
  const adsensePushDone = useRef(false);
  const [config, setConfig] = useState<AdSlotConfig[]>([]);
  const logImpression = useMutation(api.adSlots.logAdSlotImpression);

  // Rules 4 + 5: one observer drives lazy loading, a second confirms viewability.
  const { ref: setVisibilityRef, inView, confirmed } = useElementInView<HTMLElement>({
    rootMargin: "300px 0px",
    confirmRatio: 0.5,
    confirmMs: 1000,
  });

  // Rule 2: per-pageview budget, claimed in mount order.
  const inBudget = useAdSlotBudget(`${slotName}:${position}`);

  useEffect(() => {
    let cancelled = false;
    void convex
      .query(api.adSlots.listByTemplate, { pageTemplate })
      .then((rows) => {
        if (cancelled) return;
        setConfig(Array.isArray(rows) ? (rows as AdSlotConfig[]) : []);
      })
      .catch(() => {
        if (cancelled) return;
        setConfig([]);
      });
    return () => {
      cancelled = true;
    };
  }, [convex, pageTemplate]);

  const slotConfig = useMemo(
    () => config.find((s) => s.slotName === slotName && s.position === position),
    [config, slotName, position]
  );

  const adsenseClient = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined)?.trim();
  const envSlotId = ADSENSE_ENV_SLOTS[slotName]?.trim();
  const fallbackWithoutDb = import.meta.env.VITE_ADSENSE_FALLBACK_WITHOUT_DB === "1";

  const hasDbRow = slotConfig !== undefined;
  const adsenseReady =
    Boolean(adsenseClient && envSlotId) &&
    (!hasDbRow ? fallbackWithoutDb : Boolean(slotConfig?.isActive));

  const dims = formatDimensions[iabFormat];
  const hasEnoughContent =
    !minContentLength || document.body.innerText.split(/\s+/).length >= minContentLength;

  const adniumZone: AdniumZone | null = useMemo(() => getAdniumZoneForSlot(slotName), [slotName]);

  // Rule 6: routing. `adNetworkTag` (Convex) is an explicit pin; otherwise AdSense has
  // priority and Adnium backfills whatever AdSense cannot serve.
  const network: AdNetwork = useMemo(() => {
    const tag = (slotConfig?.adNetworkTag ?? "").trim().toLowerCase();
    if (tag === "adnium") return adniumZone ? "adnium" : "none";
    if (tag === "adsense") return adsenseReady ? "adsense" : adniumZone ? "adnium" : "none";
    if (adsenseReady) return "adsense";
    return adniumZone ? "adnium" : "none";
  }, [slotConfig?.adNetworkTag, adsenseReady, adniumZone]);

  const active = canLoadAds && hasEnoughContent && inBudget && network !== "none";

  // AdSense: push once, only when the unit is actually approaching the viewport.
  useEffect(() => {
    if (network !== "adsense" || !inView || !insRef.current || adsensePushDone.current) return;
    adsensePushDone.current = true;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      adsensePushDone.current = false;
    }
  }, [network, inView]);

  // Adnium: mount the zone tag inside the slot container with the same lazy trigger.
  useEffect(() => {
    if (network !== "adnium" || !inView || !adniumRef.current || !adniumZone) return;
    mountAdniumZone(adniumRef.current, adniumZone);
  }, [network, inView, adniumZone]);

  // Rule 5: one impression per slot, logged only once it is measurably viewable.
  useEffect(() => {
    if (!active || !confirmed || logged.current) return;
    logged.current = true;
    void logImpression({
      slotName,
      pageTemplate,
      metadata: {
        iabFormat,
        position,
        network,
        adniumZone: adniumZone?.id,
        viewable: true,
      },
    }).catch(() => {
      // Non-blocking telemetry call; ignore runtime drift errors.
    });
  }, [
    active,
    confirmed,
    slotName,
    pageTemplate,
    iabFormat,
    position,
    network,
    adniumZone?.id,
    logImpression,
  ]);

  if (!active) {
    // Production renders nothing instead of a visible "reserved slot" box. Run dev or set
    // VITE_ADS_DEBUG_PLACEHOLDERS=1 to see the reserved grid while laying pages out.
    const debugPlaceholders =
      import.meta.env.DEV || import.meta.env.VITE_ADS_DEBUG_PLACEHOLDERS === "1";
    if (!debugPlaceholders) return null;
    return (
      <aside
        aria-label={`Advertisement slot ${slotName} (empty)`}
        className="mx-auto my-6 w-full max-w-full"
      >
        <div
          className="mx-auto flex items-center justify-center rounded-md border border-dashed bg-muted/30 text-xs text-muted-foreground"
          style={{ width: Math.min(dims.width, 728), height: dims.height, maxWidth: "100%" }}
        >
          {`Reserved ad slot (${iabFormat}) — ${slotName}`}
        </div>
      </aside>
    );
  }

  return (
    <aside
      ref={setVisibilityRef}
      aria-label={`Advertisement slot ${slotName}`}
      className="mx-auto my-6 w-full max-w-full"
      style={{ minHeight: dims.height }}
    >
      <div className="mb-2 text-center text-[11px] uppercase tracking-wide text-muted-foreground">
        Advertisement
      </div>
      {network === "adsense" ? (
        <ins
          ref={insRef}
          className="adsbygoogle mx-auto block"
          style={{ display: "block", minHeight: dims.height, maxWidth: "100%" }}
          data-ad-client={adsenseClient}
          data-ad-slot={envSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div
          id={adniumZone ? `adn-${adniumZone.id}` : undefined}
          ref={adniumRef}
          className="mx-auto"
          style={{
            minHeight: dims.height,
            width: Math.min(dims.width, 728),
            maxWidth: "100%",
          }}
        />
      )}
    </aside>
  );
}
