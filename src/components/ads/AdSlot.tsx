import { useEffect, useMemo, useRef } from "react";
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
  const config = useQuery(api.adSlots.listByTemplate, { pageTemplate }) ?? [];
  const logImpression = useMutation(api.adSlots.logAdSlotImpression);

  const slotConfig = useMemo(
    () => config.find((s) => s.slotName === slotName && s.position === position),
    [config, slotName, position]
  );
  const dims = formatDimensions[iabFormat];
  const isActive = Boolean(slotConfig?.isActive && canLoadAds);
  const hasEnoughContent =
    !minContentLength || document.body.innerText.split(/\s+/).length >= minContentLength;

  useEffect(() => {
    if (!isActive || !hasEnoughContent || logged.current) return;
    logged.current = true;
    void logImpression({
      slotName,
      pageTemplate,
      metadata: { iabFormat, position, source: "ui-render" },
    });
  }, [isActive, hasEnoughContent, slotName, pageTemplate, iabFormat, position, logImpression]);

  return (
    <aside
      aria-label={`Advertisement slot ${slotName}`}
      className="mx-auto my-6 w-full max-w-full"
      style={{ minHeight: dims.height }}
    >
      <div className="mb-2 text-center text-[11px] uppercase tracking-wide text-muted-foreground">
        Advertisement
      </div>
      <div
        className="mx-auto flex items-center justify-center rounded-md border border-dashed bg-muted/30 text-xs text-muted-foreground"
        style={{
          width: Math.min(dims.width, 728),
          height: dims.height,
          maxWidth: "100%",
        }}
      >
        {isActive && hasEnoughContent
          ? `Ad slot active: ${slotName}`
          : `Reserved ad slot (${iabFormat})`}
      </div>
    </aside>
  );
}
