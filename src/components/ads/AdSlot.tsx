import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAdConsent } from "./AdSlotProvider";

type AdFormat = "300x250" | "728x90" | "300x600" | "in_article";

const formatDimensions: Record<AdFormat, { width: number; height: number }> = {
  "300x250": { width: 300, height: 250 },
  "728x90": { width: 728, height: 90 },
  "300x600": { width: 300, height: 600 },
  in_article: { width: 728, height: 250 },
};

const ADSENSE_ENV_SLOTS: Record<string, string | undefined> = {
  review_sidebar: import.meta.env.VITE_ADSENSE_SLOT_REVIEW_SIDEBAR,
  home_leaderboard: import.meta.env.VITE_ADSENSE_SLOT_HOME_LEADERBOARD,
  compare_inline: import.meta.env.VITE_ADSENSE_SLOT_COMPARE_INLINE,
  comparison_sidebar: import.meta.env.VITE_ADSENSE_SLOT_COMPARE_SIDEBAR,
};

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
  const { canLoadAds } = useAdConsent();
  const logged = useRef(false);
  const insRef = useRef<HTMLModElement | null>(null);
  const adsensePushDone = useRef(false);
  const config = useQuery(api.adSlots.listByTemplate, { pageTemplate }) ?? [];
  const logImpression = useMutation(api.adSlots.logAdSlotImpression);

  const slotConfig = useMemo(
    () => config.find((s) => s.slotName === slotName && s.position === position),
    [config, slotName, position]
  );

  const adsenseClient = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined)?.trim();
  const envSlotId = ADSENSE_ENV_SLOTS[slotName]?.trim();
  const fallbackWithoutDb = import.meta.env.VITE_ADSENSE_FALLBACK_WITHOUT_DB === "1";

  const hasDbRow = slotConfig !== undefined;
  const allowAdsense =
    canLoadAds &&
    Boolean(adsenseClient && envSlotId) &&
    (!hasDbRow ? fallbackWithoutDb : Boolean(slotConfig?.isActive));

  const dims = formatDimensions[iabFormat];
  const hasEnoughContent =
    !minContentLength || document.body.innerText.split(/\s+/).length >= minContentLength;

  useLayoutEffect(() => {
    if (!allowAdsense || !hasEnoughContent || !insRef.current || adsensePushDone.current) return;
    adsensePushDone.current = true;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      adsensePushDone.current = false;
    }
  }, [allowAdsense, hasEnoughContent]);

  useEffect(() => {
    if (!hasEnoughContent || logged.current) return;
    logged.current = true;
    void logImpression({
      slotName,
      pageTemplate,
      metadata: { iabFormat, position, source: allowAdsense ? "adsense" : "placeholder" },
    });
  }, [hasEnoughContent, slotName, pageTemplate, iabFormat, position, logImpression, allowAdsense]);

  const showPlaceholder = !allowAdsense || !hasEnoughContent;

  return (
    <aside
      aria-label={`Advertisement slot ${slotName}`}
      className="mx-auto my-6 w-full max-w-full"
      style={{ minHeight: dims.height }}
    >
      <div className="mb-2 text-center text-[11px] uppercase tracking-wide text-muted-foreground">
        Advertisement
      </div>
      {!showPlaceholder ? (
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
          className="mx-auto flex items-center justify-center rounded-md border border-dashed bg-muted/30 text-xs text-muted-foreground"
          style={{
            width: Math.min(dims.width, 728),
            height: dims.height,
            maxWidth: "100%",
          }}
        >
          {slotConfig?.isActive && canLoadAds && hasEnoughContent
            ? `Ad slot active: ${slotName}`
            : `Reserved ad slot (${iabFormat})`}
        </div>
      )}
    </aside>
  );
}
