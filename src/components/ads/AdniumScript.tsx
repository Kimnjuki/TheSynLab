import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getLastConsent, onConsentUpdated } from "@/lib/consent";
import {
  buildAdniumUrl,
  getAdniumPopunderZone,
  getAdniumTriggerClasses,
  isAdniumPopunderEnabled,
  shouldRunAdniumOnPath,
} from "@/lib/adnium";

const SCRIPT_ID = "adnium-popunder-script";
const CONTAINER_ID = "adnium-popunder-container";

/**
 * Injects Adnium's site-wide tag once the visitor has accepted advertising cookies.
 *
 * Deliberately mirrors `AnalyticsScripts` / `FacebookPixel`: consent bus in, one
 * idempotent DOM injection out, `null` render.
 *
 * Semantics:
 *  • At most **one tag per document load** (guarded by the container/script id), which is
 *    how Adnium expects to be installed — a popunder session is per page load, not per
 *    SPA route change.
 *  • The tag is only injected while the visitor is on a content route, so landing on
 *    `/admin`, `/auth`, `/profile`, `/settings` or `/tasks` never arms it; a later
 *    navigation to a content route does.
 *  • The tag is mounted inside a hidden container because Adnium resolves its zone from
 *    its own parent element.
 *  • Only clicks on `VITE_ADNIUM_TRIGGER_CLASSES` (non-navigation elements) may open a
 *    popunder — Adnium's documented way of keeping the tag Google-compliant next to
 *    AdSense.
 */
export function AdniumScript() {
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
    if (!isAdniumPopunderEnabled()) return;
    if (!shouldRunAdniumOnPath(pathname)) return;
    if (document.getElementById(CONTAINER_ID) || document.getElementById(SCRIPT_ID)) return;

    const zone = getAdniumPopunderZone();
    if (!zone) return;

    const container = document.createElement("div");
    container.id = CONTAINER_ID;
    container.style.display = "none";
    container.setAttribute("aria-hidden", "true");

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "text/javascript";
    script.async = true;
    const triggers = getAdniumTriggerClasses();
    if (triggers.length) script.setAttribute("data-trigger-classes", triggers.join(" "));
    script.src = buildAdniumUrl(zone);

    container.appendChild(script);
    document.body.appendChild(container);
  }, [advertisingAccepted, pathname]);

  return null;
}

export default AdniumScript;
