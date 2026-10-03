import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultConsent, getLastConsent, onConsentUpdated, type ConsentFlags } from "@/lib/consent";

type AdSlotContextValue = {
  consent: ConsentFlags;
  canLoadAds: boolean;
};

const AdSlotContext = createContext<AdSlotContextValue>({
  consent: defaultConsent,
  canLoadAds: false,
});

const ADSENSE_SRC_PREFIX = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

/**
 * The AdSense loader already exists in `index.html` (with `?client=<pub-id>`) so that
 * prerendered pages and the SPA share exactly one loader. This component used to match
 * on the *full* src including the query string, never found that tag, and appended a
 * second, client-less `adsbygoogle.js` on every consent — a duplicate request that also
 * raced the push queue. Match by prefix and never inject twice.
 */
function adsenseLoaderPresent(): boolean {
  return Boolean(document.querySelector(`script[src^="${ADSENSE_SRC_PREFIX}"]`));
}

/**
 * Debug override: `?ads=1` forces `canLoadAds` true (consent gate bypass) so ad
 * rendering can be verified without clicking through the cookie banner.
 * Always false in production unless the query param is present.
 */
function adsDebugOverride(): boolean {
  try {
    return new URLSearchParams(window.location.search).get("ads") === "1";
  } catch {
    return false;
  }
}

export function AdSlotProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentFlags>(defaultConsent);
  const [adsForced] = useState<boolean>(() => adsDebugOverride());

  useEffect(() => {
    const unsubscribe = onConsentUpdated((next) => setConsent(next));
    // Consent may have been granted before this provider mounted (returning visitor):
    // pick up the last emitted state instead of starting from `defaultConsent`.
    const existing = getLastConsent();
    if (existing) setConsent(existing);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!consent.advertisingCookies || adsenseLoaderPresent()) return;
    const client = (import.meta.env.VITE_ADSENSE_CLIENT as string | undefined)?.trim();
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = client
      ? `${ADSENSE_SRC_PREFIX}?client=${encodeURIComponent(client)}`
      : ADSENSE_SRC_PREFIX;
    document.head.appendChild(script);
  }, [consent.advertisingCookies]);

  const value = useMemo(
    () => ({
      consent,
      canLoadAds: consent.advertisingCookies || adsForced,
    }),
    [consent, adsForced]
  );

  return <AdSlotContext.Provider value={value}>{children}</AdSlotContext.Provider>;
}

export function useAdConsent() {
  return useContext(AdSlotContext);
}
