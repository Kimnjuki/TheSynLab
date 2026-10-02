import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLastConsent, onConsentUpdated } from "@/lib/consent";
import { isAdsterraPopunderEnabled, getAdsterraPopunderSrc } from "@/lib/adsterra";
import { shouldRunAdScriptsOnPath } from "@/lib/adNetworks";

const SCRIPT_ID = "adsterra-popunder-script";

/**
 * Injects Adsterra's popunder tag once the visitor has accepted advertising cookies.
 *
 * Same contract as `AnalyticsScripts`: consent bus in, one idempotent DOM injection
 * out, `null` render.
 *
 *  • At most **one tag per document load** (guarded by the script id) — a popunder session
 *    is per page load, not per SPA route change.
 *  • Only injected while the visitor is on a content route, so landing on `/admin`,
 *    `/auth`, `/profile`, `/settings` or `/tasks` never arms it.
 *  • Adsterra is the only popunder network configured, so there is nothing to arbitrate;
 *    `VITE_ADSTERRA_POPUNDER=0` is the kill switch (see `src/lib/adNetworks.ts`).
 */
export function AdsterraScript() {
  const { pathname } = useLocation();
  const [advertisingAccepted, setAdvertisingAccepted] = useState(false);

  useEffect(() => {
    const apply = (consent: { advertisingCookies: boolean }) =>
      setAdvertisingAccepted(consent.advertisingCookies);
    const unsubscribe = onConsentUpdated(apply);
    // Consent may predate this mount (returning visitor / earlier in the page load).
    const existing = getLastConsent();
    if (existing) apply(existing);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!advertisingAccepted) return;
    if (!isAdsterraPopunderEnabled()) return;
    if (!shouldRunAdScriptsOnPath(pathname)) return;
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    // Cloudflare Rocket Loader must not rewrite the tag (see src/lib/adsterra.ts).
    script.setAttribute("data-cfasync", "false");
    script.src = getAdsterraPopunderSrc();
    document.body.appendChild(script);
  }, [advertisingAccepted, pathname]);

  return null;
}

export default AdsterraScript;
