import { Bell, BellOff, BellRing, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings = ({ className }: NotificationSettingsProps) => {
  const { isSupported, permission, requestPermission, showNotification } = usePushNotifications();

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      showNotification("Notifications Enabled! 🎉", {
        body: "You'll now receive push notifications for important updates.",
        tag: "notification-enabled",
      });
    }
  };

  const handleTestNotification = () => {
    showNotification("Test Notification", {
      body: "This is a test notification from Synergy Craft Lab.",
      tag: "test-notification",
    });
  };

  if (!isSupported) {
    return (
      <Card className={cn("border-destructive/50", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-destructive" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser doesn't support push notifications. Try using a modern browser like Chrome, Firefox, or Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified about important updates, task reminders, and mentions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            {permission === "granted" ? (
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            ) : permission === "denied" ? (
              <div className="p-2 rounded-full bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-muted">
                <BellRing className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-medium">
                {permission === "granted"
                  ? "Notifications Enabled"
                  : permission === "denied"
                  ? "Notifications Blocked"
                  : "Notifications Not Enabled"}
              </p>
              <p className="text-sm text-muted-foreground">
                {permission === "granted"
                  ? "You'll receive push notifications"
                  : permission === "denied"
                  ? "Enable in browser settings"
                  : "Click to enable push notifications"}
              </p>
            </div>
          </div>
          {permission === "default" && (
            <Button onClick={handleEnableNotifications}>
              Enable
            </Button>
          )}
          {permission === "granted" && (
            <Button variant="outline" onClick={handleTestNotification}>
              Test
            </Button>
          )}
        </div>

        {/* Notification Preferences */}
        {permission === "granted" && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Notification Types</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="task-reminders" className="flex flex-col gap-1">
                  <span>Task Reminders</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Get notified about upcoming deadlines
                  </span>
                </Label>
                <Switch id="task-reminders" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="mentions" className="flex flex-col gap-1">
                  <span>Mentions</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    When someone mentions you in comments
                  </span>
                </Label>
                <Switch id="mentions" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="task-updates" className="flex flex-col gap-1">
                  <span>Task Updates</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Status changes on tasks you're assigned to
                  </span>
                </Label>
                <Switch id="task-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="comments" className="flex flex-col gap-1">
                  <span>New Comments</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Replies to your comments and threads
                  </span>
                </Label>
                <Switch id="comments" defaultChecked />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
