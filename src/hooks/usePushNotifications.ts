import { useState, useEffect, useCallback } from "react";

export type NotificationPermissionState = "default" | "granted" | "denied";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermissionState>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    const supported = "Notification" in window;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission as NotificationPermissionState);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn("Push notifications are not supported in this browser");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermissionState);
      return result === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    }
  }, [isSupported]);

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || permission !== "granted") {
        console.warn("Cannot send notification: permission not granted");
        return null;
      }

      try {
        const notification = new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          ...options,
        });

        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          notification.close();
        };

        return notification;
      } catch (error) {
        console.error("Error sending notification:", error);
        return null;
      }
    },
    [isSupported, permission]
  );

  const showNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      // If permission not granted, request it first
      if (permission === "default") {
        const granted = await requestPermission();
        if (!granted) return null;
      }

      return sendNotification(title, options);
    },
    [permission, requestPermission, sendNotification]
  );

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
  };
};
