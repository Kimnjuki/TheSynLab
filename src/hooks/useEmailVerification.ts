import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useEmailVerification() {
  const { user } = useAuth();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (user) {
      // For simple auth, assume verified
      setIsVerified(true);
    } else {
      setIsVerified(null);
    }
  }, [user]);

  const dismissBanner = () => {
    setDismissed(true);
    // Persist dismissal for this session
    sessionStorage.setItem("email-verification-dismissed", "true");
  };

  // Check if previously dismissed this session
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("email-verification-dismissed");
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  const showBanner = user && isVerified === false && !dismissed;

  return {
    isVerified,
    showBanner,
    dismissBanner,
    email: user?.email || "",
  };
}
