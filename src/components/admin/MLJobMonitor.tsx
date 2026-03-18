import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export function MLJobMonitor() {
  const jobs = useQuery(api.mlPredictionJobs.listRecent) ?? [];
  const retryJob = useMutation(api.mlPredictionJobs.retry);

  const handleRetry = async (jobId: Id<"mlPredictionJobs">) => {
    try {
      await retryJob({ jobId });
      toast.success("Job queued for retry");
    } catch {
      toast.error("Failed to retry job");
    }
  };

  const statusColors: Record<string, string> = {
    pending: "text-amber-600 border-amber-300",
    running: "text-blue-600 border-blue-300",
    completed: "text-green-600 border-green-300",
    failed: "text-red-500 border-red-300",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          ML Prediction Jobs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Product</th>
                <th className="text-center pb-2">Status</th>
                <th className="text-center pb-2">Score</th>
                <th className="text-center pb-2">Model</th>
                <th className="text-center pb-2">Started</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs">{job.productId}</td>
                  <td className="text-center py-2">
                    <Badge variant="outline" className={statusColors[job.jobStatus] ?? ""}>
                      {job.jobStatus}
                    </Badge>
                  </td>
                  <td className="text-center py-2">
                    {job.outputScore != null ? job.outputScore.toFixed(1) : "—"}
                  </td>
                  <td className="text-center py-2 text-xs text-muted-foreground">
                    {job.modelVersion ?? "—"}
                  </td>
                  <td className="text-center py-2 text-xs text-muted-foreground">
                    {format(new Date(job.startedAt), "MMM d HH:mm")}
                  </td>
                  <td className="py-2">
                    {job.jobStatus === "failed" && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => handleRetry(job._id)}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No ML jobs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
