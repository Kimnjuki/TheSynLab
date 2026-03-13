import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Cookie, Settings, Shield, X } from "lucide-react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "cookie_consent";
const COOKIE_PREFERENCES_KEY = "cookie_preferences";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  advertising: boolean;
  preferences: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true, // Always true, cannot be disabled
  analytics: false,
  advertising: false,
  preferences: false,
};

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a consent choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay to avoid layout shift on page load
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const saveConsent = (newPreferences: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      advertising: true,
      preferences: true,
    });
  };

  const declineAll = () => {
    saveConsent({
      essential: true,
      analytics: false,
      advertising: false,
      preferences: false,
    });
  };

  const savePreferences = () => {
    saveConsent(preferences);
  };

  // Function to open settings from footer link
  useEffect(() => {
    const handleOpenSettings = () => {
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
      setShowSettings(true);
      setShowBanner(true);
    };

    window.addEventListener("open-cookie-settings", handleOpenSettings);
    return () => window.removeEventListener("open-cookie-settings", handleOpenSettings);
  }, []);

  if (!showBanner) {
    return (
      // Floating Cookie Settings Button
      <button
        onClick={() => {
          const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
          if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
          }
          setShowSettings(true);
          setShowBanner(true);
        }}
        className="fixed bottom-6 left-6 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 hover:scale-105"
        aria-label="Cookie Settings"
      >
        <Cookie className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Cookie Preferences</CardTitle>
                <CardDescription className="text-xs">
                  Manage your privacy settings
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={declineAll}
              className="h-8 w-8"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showSettings ? (
            // Simple Banner View
            <>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your experience, analyze site traffic, and serve personalized ads. 
                By clicking "Accept All", you consent to our use of cookies. 
                Read our{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{" "}
                for more information.
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={acceptAll} className="flex-1">
                  Accept All
                </Button>
                <Button onClick={declineAll} variant="outline" className="flex-1">
                  Decline All
                </Button>
                <Button
                  onClick={() => setShowSettings(true)}
                  variant="secondary"
                  className="flex-1 gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Customize
                </Button>
              </div>
            </>
          ) : (
            // Detailed Settings View
            <>
              <div className="space-y-4">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="space-y-1">
                    <Label className="font-medium">Essential Cookies</Label>
                    <p className="text-xs text-muted-foreground">
                      Required for basic site functionality. Cannot be disabled.
                    </p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label className="font-medium">Analytics Cookies</Label>
                    <p className="text-xs text-muted-foreground">
                      Help us understand how visitors use our site.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.analytics}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, analytics: checked })
                    }
                  />
                </div>

                {/* Advertising Cookies */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label className="font-medium">Advertising Cookies</Label>
                    <p className="text-xs text-muted-foreground">
                      Used to show relevant ads via Google AdSense.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.advertising}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, advertising: checked })
                    }
                  />
                </div>

                {/* Preference Cookies */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="space-y-1">
                    <Label className="font-medium">Preference Cookies</Label>
                    <p className="text-xs text-muted-foreground">
                      Remember your settings and preferences.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.preferences}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, preferences: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button onClick={savePreferences} className="flex-1">
                  Save Preferences
                </Button>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                You can change these preferences anytime by clicking the cookie icon.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieConsent;
