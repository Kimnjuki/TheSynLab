import { useEffect } from "react";
import {
  getLastConsent,
  onConsentUpdated,
  type ConsentFlags,
} from "@/lib/consent";

/** Public site key from Ahrefs Web Analytics installation. */
const AHREFS_DATA_KEY = "slaxd03NBrOQOSrpgty7bw";

/** Legacy direct GA4 when `VITE_GTM_CONTAINER_ID` is unset (matches previous index.html). */
const GA4_DEFAULT = "G-XMGRJBSN5Y";

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

function injectGa4(measurementId: string) {
  if (document.getElementById("ga4-gtag-script")) return;
  const gtagScript = document.createElement("script");
  gtagScript.id = "ga4-gtag-script";
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(gtagScript);
  const inline = document.createElement("script");
  inline.id = "ga4-gtag-inline";
  inline.textContent = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)});
`;
  document.head.appendChild(inline);
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

      if (!consent.analyticsCookies) return;

      const gtmId = (import.meta.env.VITE_GTM_CONTAINER_ID as string | undefined)?.trim();
      if (gtmId) {
        // GTM only: add Ahrefs (Custom HTML) and other tags in the container to avoid duplicate loads.
        injectGtm(gtmId);
      } else {
        injectAhrefs();
        const gaId =
          (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() ||
          GA4_DEFAULT;
        injectGa4(gaId);
      }
    };

    const unsub = onConsentUpdated(run);
    const existing = getLastConsent();
    if (existing) run(existing);
    return unsub;
  }, []);

  return null;
}
