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

export default function CookieBanner() {
  const convex = useConvex();
  const [open, setOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [consent, setConsent] = useState<ConsentFlags>(defaultConsent);
  const [currentConsent, setCurrentConsent] = useState<any | undefined>(undefined);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  const createConsent = useMutation(api.cmpConsent.createCmpConsentRecord);
  const updateConsent = useMutation(api.cmpConsent.updateCmpConsentRecord);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    void convex
      .query(api.cmpConsent.getCmpConsent, { sessionId })
      .then((result) => {
        if (cancelled) return;
        setCurrentConsent(result ?? null);
      })
      .catch(() => {
        // During partial deploys/back-end drift, avoid crashing UI: fall back to local default.
        if (cancelled) return;
        setCurrentConsent(null);
      });
    return () => {
      cancelled = true;
    };
  }, [convex, sessionId]);

  useEffect(() => {
    if (currentConsent === undefined) return;
    if (!currentConsent) {
      setOpen(true);
      return;
    }
    const loaded: ConsentFlags = {
      necessaryCookies: currentConsent.necessaryCookies,
      analyticsCookies: currentConsent.analyticsCookies,
      advertisingCookies: currentConsent.advertisingCookies,
      functionalCookies: currentConsent.functionalCookies,
    };
    setConsent(loaded);
    emitConsentUpdated(loaded);
    setOpen(false);
  }, [currentConsent]);

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

  const saveConsent = async (method: "explicit_accept" | "explicit_reject" | "granular") => {
    if (!sessionId) return;
    if (!currentConsent) {
      await createConsent({
        sessionId,
        consentVersion: CONSENT_VERSION,
        consentMethod: method,
        ipCountry: getIpCountryGuess(),
        userAgent: navigator.userAgent,
        ...consent,
      });
    } else {
      await updateConsent({
        sessionId,
        updatedFlags: actionable,
      });
    }
    emitConsentUpdated(consent);
    setOpen(false);
    setPreferencesOpen(false);
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
              onClick={() => {
                setConsent({
                  necessaryCookies: true,
                  analyticsCookies: true,
                  advertisingCookies: true,
                  functionalCookies: true,
                });
                void saveConsent("explicit_accept");
              }}
            >
              Accept all
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConsent(defaultConsent);
                void saveConsent("explicit_reject");
              }}
            >
              Reject optional
            </Button>
            {preferencesOpen && (
              <Button type="button" variant="outline" onClick={() => void saveConsent("granular")}>
                Save preferences
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
