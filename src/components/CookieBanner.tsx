import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { emitConsentUpdated, type ConsentFlags as CanonicalConsent } from "@/lib/consent";

export interface ConsentFlags {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  improvement: boolean;
}

const defaultConsent: ConsentFlags = {
  analytics: false,
  marketing: false,
  preferences: false,
  improvement: false,
};

const CONSENT_KEY = "thesynlab_consent_v1";

function getStoredConsent(): ConsentFlags | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      return JSON.parse(stored) as ConsentFlags;
    }
  } catch {
    // ignore
  }
  return null;
}

function storeConsent(flags: ConsentFlags) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(flags));
  } catch {
    // ignore
  }
}

/**
 * Publish the choice to the canonical consent bus (`@/lib/consent`).
 *
 * AN-5: before this, the mounted banner only wrote its own localStorage key and
 * talked to `window.gtag` directly, while `AnalyticsScripts`, `AdSlotProvider`
 * and the footer "Cookie Settings" button all listened on the *other* bus
 * (`emitConsentUpdated`) which nothing ever fired. Result: Ahrefs/GTM never
 * loaded, `canLoadAds` stayed false so every ad unit rendered a placeholder,
 * and the footer button did nothing.
 */
function publishConsent(flags: ConsentFlags): void {
  const canonical: CanonicalConsent = {
    necessaryCookies: true,
    analyticsCookies: flags.analytics,
    advertisingCookies: flags.marketing,
    functionalCookies: flags.preferences || flags.improvement,
  };
  emitConsentUpdated(canonical);
}

function applyConsent(flags: ConsentFlags) {
  // GA4 consent update (Consent Mode v2 — defaults live in index.html)
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: flags.analytics ? "granted" : "denied",
      ad_storage: flags.marketing ? "granted" : "denied",
      ad_user_data: flags.marketing ? "granted" : "denied",
      ad_personalization: flags.marketing ? "granted" : "denied",
    });
  }
  publishConsent(flags);
}

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentFlags>(defaultConsent);

  // Initialize: check localStorage on mount
  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setConsent(stored);
      applyConsent(stored);
    } else {
      // No stored consent — publish the denied default so downstream consumers
      // (AdSlotProvider, AnalyticsScripts) have an explicit state to act on.
      applyConsent(defaultConsent);
      // Show the banner
      setOpen(true);
    }
  }, []);

  // Footer "Cookie Settings" button → open the preferences sheet.
  useEffect(() => {
    const handleOpenSettings = () => {
      const stored = getStoredConsent();
      if (stored) setConsent(stored);
      setPreferencesOpen(true);
      setOpen(true);
    };
    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => window.removeEventListener("open-cookie-settings", handleOpenSettings);
  }, []);

  const handleAcceptAll = () => {
    const all: ConsentFlags = {
      analytics: true,
      marketing: true,
      preferences: true,
      improvement: true,
    };
    setConsent(all);
    storeConsent(all);
    applyConsent(all);
    setOpen(false);
  };

  const handleRejectAll = () => {
    const none: ConsentFlags = { ...defaultConsent };
    setConsent(none);
    storeConsent(none);
    applyConsent(none);
    setOpen(false);
  };

  const handleSavePreferences = () => {
    storeConsent(consent);
    applyConsent(consent);
    setPreferencesOpen(false);
    setOpen(false);
  };

  if (!open && !preferencesOpen) return null;

  return (
    <>
      {open && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">🍪 Cookie Settings</CardTitle>
              <CardDescription>
                We use cookies to improve your experience, analyze traffic, and show
                personalized content. You can choose which categories to allow.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={handleRejectAll}>
                Reject All
              </Button>
              <Sheet open={preferencesOpen} onOpenChange={setPreferencesOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary">Preferences</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Cookie Preferences</SheetTitle>
                    <SheetDescription>
                      Customize which cookies you allow.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="analytics">Analytics</Label>
                      <Switch
                        id="analytics"
                        checked={consent.analytics}
                        onCheckedChange={(v) =>
                          setConsent((prev) => ({ ...prev, analytics: v }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="marketing">Marketing</Label>
                      <Switch
                        id="marketing"
                        checked={consent.marketing}
                        onCheckedChange={(v) =>
                          setConsent((prev) => ({ ...prev, marketing: v }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="preferences">Preferences</Label>
                      <Switch
                        id="preferences"
                        checked={consent.preferences}
                        onCheckedChange={(v) =>
                          setConsent((prev) => ({ ...prev, preferences: v }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="improvement">Product Improvement</Label>
                      <Switch
                        id="improvement"
                        checked={consent.improvement}
                        onCheckedChange={(v) =>
                          setConsent((prev) => ({ ...prev, improvement: v }))
                        }
                      />
                    </div>
                    <Button onClick={handleSavePreferences} className="mt-4">
                      Save Preferences
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              <Button onClick={handleAcceptAll}>Accept All</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

