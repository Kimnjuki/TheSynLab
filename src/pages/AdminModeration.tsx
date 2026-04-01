import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo, useState } from "react";

export default function AdminModeration() {
  const { user } = useAuth();
  const queue = useQuery(api.forumModeration.listModerationQueue) ?? [];
  const resolveViolation = useMutation(api.forumModeration.resolveViolation);
  const dismissViolation = useMutation(api.forumModeration.dismissViolation);
  const keepViolationPending = useMutation(api.forumModeration.keepViolationPending);
  const escalateViolation = useMutation(api.forumModeration.escalateViolation);
  const [severityFilter, setSeverityFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "user_report" | "forum_thread" | "forum_reply">("ALL");

  const filteredQueue = useMemo(() => {
    return queue.filter((item) => {
      const severityMatch = severityFilter === "ALL" || item.severity === severityFilter;
      const sourceMatch = sourceFilter === "ALL" || item.reportSource === sourceFilter;
      return severityMatch && sourceMatch;
    });
  }, [queue, severityFilter, sourceFilter]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10 space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Moderation Queue</h1>
          <p className="text-sm text-muted-foreground">
            Unresolved forum moderation violations sorted by severity.
          </p>
        </div>

        <Card>
          <CardContent className="p-4 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="severity-filter" className="text-sm text-muted-foreground">
                Severity
              </label>
              <select
                id="severity-filter"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="ALL">All severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="source-filter" className="text-sm text-muted-foreground">
                Source
              </label>
              <select
                id="source-filter"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as any)}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="ALL">All sources</option>
                <option value="user_report">User report</option>
                <option value="forum_thread">Forum thread</option>
                <option value="forum_reply">Forum reply</option>
              </select>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              Showing {filteredQueue.length} of {queue.length}
            </div>
          </CardContent>
        </Card>

        {filteredQueue.length === 0 && (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No unresolved moderation violations for this filter.
            </CardContent>
          </Card>
        )}

        {filteredQueue.map((item) => (
          <Card key={item._id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Badge variant={item.severity === "HIGH" || item.severity === "CRITICAL" ? "destructive" : "secondary"}>
                  {item.severity}
                </Badge>
                <span>{item.violationCategory}</span>
                <Badge variant="outline" className="ml-auto">
                  {item.reportSource ?? "unknown_source"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">{item.description || item.violationRule}</p>
              {item.reportedContent && (
                <div className="rounded border bg-muted/30 p-3 whitespace-pre-wrap">
                  {item.reportedContent.slice(0, 500)}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={async () => {
                    await resolveViolation({
                      violationId: item._id,
                      resolvedBy: user?.id,
                      resolutionNotes: "Resolved from admin moderation queue.",
                    });
                  }}
                >
                  Mark resolved
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    await dismissViolation({
                      violationId: item._id,
                      dismissedBy: user?.id,
                      notes: "Dismissed from moderation queue as false positive.",
                    });
                  }}
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await keepViolationPending({
                      violationId: item._id,
                      reviewedBy: user?.id,
                      notes: "Kept pending for additional evidence review.",
                    });
                  }}
                >
                  Keep pending
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={async () => {
                    await escalateViolation({
                      violationId: item._id,
                      escalatedBy: user?.id,
                      notes: "Escalated by moderator due to higher risk assessment.",
                    });
                  }}
                >
                  Escalate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </main>
      <Footer />
    </div>
  );
}
