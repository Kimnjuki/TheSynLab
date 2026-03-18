import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const severityColors: Record<string, string> = {
  low: "text-gray-600 border-gray-300",
  medium: "text-amber-600 border-amber-300",
  high: "text-red-500 border-red-300",
  critical: "text-purple-600 border-purple-300",
};

export function SecurityAuditLog() {
  const auditLogs = useQuery(api.security.getAuditLogs) ?? [];
  const blockedIps = useQuery(api.security.getBlockedIps) ?? [];
  const failedLogins = useQuery(api.security.getRecentFailedLogins) ?? [];

  const todayLogs = auditLogs.filter(
    (l) => l._creationTime > Date.now() - 86400000
  );
  const highSeverity = auditLogs.filter(
    (l) => l.severity === "high" || l.severity === "critical"
  );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold">{todayLogs.length}</div>
            <p className="text-sm text-muted-foreground">Events Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-red-500">{highSeverity.length}</div>
            <p className="text-sm text-muted-foreground">High Severity</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-amber-600">{blockedIps.length}</div>
            <p className="text-sm text-muted-foreground">Blocked IPs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Event</th>
                  <th className="text-center pb-2">Severity</th>
                  <th className="text-center pb-2">User</th>
                  <th className="text-center pb-2">IP</th>
                  <th className="text-center pb-2">Status</th>
                  <th className="text-center pb-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 20).map((log) => (
                  <tr key={log._id} className="border-b last:border-0">
                    <td className="py-2">{log.eventType}</td>
                    <td className="text-center py-2">
                      <Badge variant="outline" className={severityColors[log.severity] ?? ""}>
                        {log.severity}
                      </Badge>
                    </td>
                    <td className="text-center py-2 text-xs text-muted-foreground">
                      {log.username ?? log.userId ?? "—"}
                    </td>
                    <td className="text-center py-2 text-xs text-muted-foreground">
                      {log.ipAddress ?? "—"}
                    </td>
                    <td className="text-center py-2">
                      <Badge
                        variant={log.status === "success" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {log.status}
                      </Badge>
                    </td>
                    <td className="text-center py-2 text-xs text-muted-foreground">
                      {format(new Date(log._creationTime), "MMM d HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {blockedIps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Blocked IPs ({blockedIps.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {blockedIps.map((ip) => (
                <Badge key={ip._id} variant="destructive" className="text-xs">
                  {ip.ipAddress} ({ip.reason})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
