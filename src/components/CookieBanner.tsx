import { useEffect, useMemo, useState } from "react";
import { useConvex, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CONSENT_VERSION,
  defaultConsent,
  emitConsentUpdated,
  getIpCountryGuess,
  getOrCreateSessionId,
  type ConsentFlags,
} from "@/lib/consent";

const LOCAL_CONSENT_KEY = "synlab_cookie_consent";

function loadLocalConsent(): ConsentFlags | null {
  try {
    const raw = localStorage.getItem(LOCAL_CONSENT_KEY);
    if (raw) return JSON.parse(raw) as ConsentFlags;
  } catch {
    // localStorage unavailable (private mode, etc.)
  }
  return null;
}

function saveLocalConsent(flags: ConsentFlags) {
  try {
    localStorage.setItem(LOCAL_CONSENT_KEY, JSON.stringify(flags));
  } catch {
    // Silently ignore — localStorage may be full or blocked
  }
}

export default function CookieBanner() {
  const convex = useConvex();
  const [open, setOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [consent, setConsent] = useState<ConsentFlags>(defaultConsent);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
    // Always start by checking localStorage — works even if Convex is down
    const local = loadLocalConsent();
    if (local) {
      setConsent(local);
      emitConsentUpdated(local);
      // Still check Convex in background for server sync, but don't block the UI
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, []);

  const createConsent = useMutation(api.cmpConsent.createCmpConsentRecord);
  const updateConsent = useMutation(api.cmpConsent.updateCmpConsentRecord);

  // Background sync: load Convex record and reconcile with localStorage
  useEffect(() => {
    if (!sessionId) return;
    const local = loadLocalConsent();
    let cancelled = false;
    void convex
      .query(api.cmpConsent.getCmpConsent, { sessionId })
      .then((result) => {
        if (cancelled) return;
        if (result) {
          const serverFlags: ConsentFlags = {
            necessaryCookies: result.necessaryCookies,
            analyticsCookies: result.analyticsCookies,
            advertisingCookies: result.advertisingCookies,
            functionalCookies: result.functionalCookies,
          };
          // Server wins if user has a saved server record but no local one
          if (!local) {
            setConsent(serverFlags);
            saveLocalConsent(serverFlags);
            emitConsentUpdated(serverFlags);
            setOpen(false);
          }
        }
      })
      .catch(() => {
        // Convex unavailable — no-op, localStorage consent already applied
      });
    return () => {
      cancelled = true;
    };
  }, [convex, sessionId]);

  useEffect(() => {
    const reopen = () => {
      setPreferencesOpen(true);
      setOpen(true);
    };
    window.addEventListener("open-cookie-settings", reopen);
    return () => window.removeEventListener("open-cookie-settings", reopen);
  }, []);

  const actionable = useMemo(
    () => ({
      analyticsCookies: consent.analyticsCookies,
      advertisingCookies: consent.advertisingCookies,
      functionalCookies: consent.functionalCookies,
    }),
    [consent]
  );

  const handleConsent = (
    flags: ConsentFlags,
    method: "explicit_accept" | "explicit_reject" | "granular",
  ) => {
    // 1. Save locally immediately — always works, no async
    setConsent(flags);
    saveLocalConsent(flags);
    emitConsentUpdated(flags);
    setOpen(false);
    setPreferencesOpen(false);

    // 2. Fire-and-forget to Convex — never blocks the UI
    if (!sessionId) return;
    const record = {
      sessionId,
      consentVersion: CONSENT_VERSION,
      consentMethod: method,
      ipCountry: getIpCountryGuess(),
      userAgent: navigator.userAgent,
      ...flags,
    };
    createConsent(record).catch(() => {
      updateConsent({ sessionId, updatedFlags: actionable }).catch(() => {
        // Convex unavailable — consent is saved locally, no data loss
      });
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setPreferencesOpen(true);
          setOpen(true);
        }}
        className="fixed bottom-6 left-6 z-40 rounded-full border bg-background px-3 py-2 text-xs shadow-md hover:bg-muted"
        aria-label="Cookie settings"
      >
        Cookie Settings
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Privacy & Cookie Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We use cookies to run core features, improve analytics, and optionally load advertising.
            You can update this any time from Cookie Settings.
          </p>

          {preferencesOpen && (
            <div className="space-y-3 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <Label>Necessary cookies</Label>
                <Switch checked disabled aria-label="Necessary cookies always enabled" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics-switch">Analytics cookies</Label>
                <Switch
                  id="analytics-switch"
                  checked={consent.analyticsCookies}
                  onCheckedChange={(checked) =>
                    setConsent((prev) => ({ ...prev, analyticsCookies: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="ads-switch">Advertising cookies</Label>
                <Switch
                  id="ads-switch"
                  checked={consent.advertisingCookies}
                  onCheckedChange={(checked) =>
                    setConsent((prev) => ({ ...prev, advertisingCookies: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="functional-switch">Functional cookies</Label>
                <Switch
                  id="functional-switch"
                  checked={consent.functionalCookies}
                  onCheckedChange={(checked) =>
                    setConsent((prev) => ({ ...prev, functionalCookies: checked }))
                  }
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!preferencesOpen && (
              <Button type="button" variant="secondary" onClick={() => setPreferencesOpen(true)}>
                Customize
              </Button>
            )}
            <Button
              type="button"
              onClick={() =>
                handleConsent(
                  {
                    necessaryCookies: true,
                    analyticsCookies: true,
                    advertisingCookies: true,
                    functionalCookies: true,
                  },
                  "explicit_accept",
                )
              }
            >
              Accept all
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleConsent(defaultConsent, "explicit_reject")}
            >
              Reject optional
            </Button>
            {preferencesOpen && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleConsent(consent, "granular")}
              >
                Save preferences
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
