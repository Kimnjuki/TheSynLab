import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultConsent, onConsentUpdated, type ConsentFlags } from "@/lib/consent";

type AdSlotContextValue = {
  consent: ConsentFlags;
  canLoadAds: boolean;
};

const AdSlotContext = createContext<AdSlotContextValue>({
  consent: defaultConsent,
  canLoadAds: false,
});

const ADSENSE_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

export function AdSlotProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentFlags>(defaultConsent);

  useEffect(() => {
    return onConsentUpdated((next) => setConsent(next));
  }, []);

  useEffect(() => {
    if (!consent.advertisingCookies) return;
    const existing = document.querySelector(`script[src="${ADSENSE_SRC}"]`);
    if (existing) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = ADSENSE_SRC;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }, [consent.advertisingCookies]);

  const value = useMemo(
    () => ({
      consent,
      canLoadAds: consent.advertisingCookies,
    }),
    [consent]
  );

  return <AdSlotContext.Provider value={value}>{children}</AdSlotContext.Provider>;
}

export function useAdConsent() {
  return useContext(AdSlotContext);
}
