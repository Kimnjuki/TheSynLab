import { useEffect } from "react";
import {
  getLastConsent,
  onConsentUpdated,
  type ConsentFlags,
} from "@/lib/consent";

/** Public site key from Ahrefs Web Analytics installation. */
const AHREFS_DATA_KEY = "slaxd03NBrOQOSrpgty7bw";

function injectAhrefs() {
  if (document.getElementById("ahrefs-analytics-script")) return;
  const s = document.createElement("script");
  s.id = "ahrefs-analytics-script";
  s.src = "https://analytics.ahrefs.com/analytics.js";
  s.async = true;
  s.setAttribute("data-key", AHREFS_DATA_KEY);
  document.head.appendChild(s);
}

function injectGtm(containerId: string) {
  if (document.getElementById("gtm-script")) return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const j = document.createElement("script");
  j.id = "gtm-script";
  j.async = true;
  j.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
  const first = document.getElementsByTagName("script")[0];
  first.parentNode!.insertBefore(j, first);

  if (!document.getElementById("gtm-noscript")) {
    const ns = document.createElement("noscript");
    ns.id = "gtm-noscript";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(containerId)}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    ns.appendChild(iframe);
    document.body.insertBefore(ns, document.body.firstChild);
  }
}

export default function AnalyticsScripts() {
  useEffect(() => {
    const run = (consent: ConsentFlags) => {
      // Update Google Consent Mode based on user choice
      if (typeof gtag !== 'undefined') {
        gtag('consent', 'update', {
          'analytics_storage': consent.analyticsCookies ? 'granted' : 'denied',
          'ad_storage': consent.advertisingCookies ? 'granted' : 'denied',
          'ad_user_data': consent.advertisingCookies ? 'granted' : 'denied',
          'ad_personalization': consent.advertisingCookies ? 'granted' : 'denied',
        });
      }

      // GA4 is loaded directly in index.html head (prevents prerender vs client duplicate).
      // This component only: (1) updates consent mode, (2) loads Ahrefs, (3) optionally GTM.
      if (!consent.analyticsCookies) return;

      const gtmId = (import.meta.env.VITE_GTM_CONTAINER_ID as string | undefined)?.trim();
      if (gtmId) {
        injectGtm(gtmId);
      } else {
        injectAhrefs();
      }
    };

    const unsub = onConsentUpdated(run);
    const existing = getLastConsent();
    if (existing) run(existing);
    return unsub;
  }, []);

  return null;
}
