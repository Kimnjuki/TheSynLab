export type ConsentFlags = {
  necessaryCookies: boolean;
  analyticsCookies: boolean;
  advertisingCookies: boolean;
  functionalCookies: boolean;
};

const SESSION_KEY = "synlab_session_id";
const CONSENT_EVENT = "synlab-consent-updated";

export const CONSENT_VERSION = "2026-03-31";

export const defaultConsent: ConsentFlags = {
  necessaryCookies: true,
  analyticsCookies: false,
  advertisingCookies: false,
  functionalCookies: false,
};

export function getOrCreateSessionId() {
  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, next);
  return next;
}

export function emitConsentUpdated(consent: ConsentFlags) {
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
}

export function onConsentUpdated(handler: (consent: ConsentFlags) => void) {
  const listener = (event: Event) => {
    const payload = (event as CustomEvent<ConsentFlags>).detail;
    handler(payload);
  };
  window.addEventListener(CONSENT_EVENT, listener);
  return () => window.removeEventListener(CONSENT_EVENT, listener);
}

export function getIpCountryGuess() {
  const language = navigator.language || "en-US";
  const parts = language.split("-");
  return parts[1]?.toUpperCase();
}
