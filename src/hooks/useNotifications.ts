import { useState, useCallback, useEffect } from "react";
import { Notification } from "@/components/dashboard/NotificationsDropdown";
import { usePushNotifications } from "./usePushNotifications";

const generateId = () => Math.random().toString(36).substring(2, 9);

// Sample notifications for demo
const sampleNotifications: Notification[] = [
  {
    id: generateId(),
    title: "Welcome to Project Nova!",
    message: "Start exploring our features. Press ⌘K to open the command palette.",
    type: "info",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: generateId(),
    title: "Task completed",
    message: "Your task 'Review product specifications' has been marked as complete.",
    type: "success",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: generateId(),
    title: "Upcoming deadline",
    message: "You have 3 tasks due in the next 24 hours. Don't forget to check them!",
    type: "warning",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    action: {
      label: "View tasks",
      onClick: () => window.location.href = "/tasks",
    },
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const { showNotification, permission } = usePushNotifications();

  const addNotification = useCallback((
    notification: Omit<Notification, "id" | "timestamp" | "read">,
    options?: { sendPush?: boolean }
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    // Send push notification if enabled
    if (options?.sendPush !== false && permission === "granted") {
      showNotification(notification.title, {
        body: notification.message,
        tag: `notification-${newNotification.id}`,
      });
    }

    return newNotification.id;
  }, [showNotification, permission]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    unreadCount,
  };
};
