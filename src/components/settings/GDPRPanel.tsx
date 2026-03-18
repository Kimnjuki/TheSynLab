import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Send } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-600 border-amber-300",
  processing: "text-blue-600 border-blue-300",
  completed: "text-green-600 border-green-300",
  rejected: "text-red-500 border-red-300",
};

export function GDPRPanel({ novaUserId }: { novaUserId?: Id<"novaUsers"> }) {
  const { user } = useAuth();
  const [requestType, setRequestType] = useState<string>("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requests = useQuery(
    api.gdpr.listByUser,
    novaUserId ? { userId: novaUserId } : "skip"
  ) ?? [];
  const submitRequest = useMutation(api.gdpr.submit);

  const handleSubmit = async () => {
    if (!requestType || !novaUserId) {
      toast.error("Select a request type and ensure you are logged in");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitRequest({ userId: novaUserId, requestType, requestDetails: details });
      toast.success("GDPR request submitted");
      setRequestType("");
      setDetails("");
    } catch {
      toast.error("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Rights Request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Request Type</label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="export">Export My Data</SelectItem>
                <SelectItem value="deletion">Delete My Data</SelectItem>
                <SelectItem value="correction">Correct My Data</SelectItem>
                <SelectItem value="restriction">Restrict Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Additional Details (optional)</label>
            <Textarea
              placeholder="Describe what data you want to address..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !requestType}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Submitting…" : "Submit Request"}
          </Button>
        </CardContent>
      </Card>

      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Your Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req._id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{req.requestType}</span>
                    <Badge variant="outline" className={STATUS_COLORS[req.status] ?? ""}>
                      {req.status}
                    </Badge>
                  </div>
                  {req.requestDetails && (
                    <p className="text-xs text-muted-foreground">{req.requestDetails}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Submitted {format(new Date(req.requestedAt), "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
