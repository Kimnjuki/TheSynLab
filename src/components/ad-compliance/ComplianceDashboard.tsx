import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  FileText,
  Eye
} from "lucide-react";

// Mock data for demonstration
const mockStats = {
  total: 156,
  approved: 98,
  rejected: 23,
  pending: 18,
  flagged: 17,
  avgScore: 76,
  todaySubmissions: 12,
  weeklyTrend: 8.5,
};

const recentSubmissions = [
  { id: "ad-001", title: "Summer Sale Campaign", status: "approved", score: 95, time: "2 min ago" },
  { id: "ad-002", title: "Weight Loss Supplement", status: "rejected", score: 25, time: "15 min ago" },
  { id: "ad-003", title: "Finance App Promo", status: "requires_review", score: 62, time: "1 hour ago" },
  { id: "ad-004", title: "Gaming Tournament", status: "flagged", score: 48, time: "2 hours ago" },
  { id: "ad-005", title: "E-commerce Flash Deal", status: "approved", score: 88, time: "3 hours ago" },
];

const topViolations = [
  { category: "Healthcare Claims", count: 12, severity: "HIGH" },
  { category: "Financial Disclosures", count: 8, severity: "HIGH" },
  { category: "Clickbait Language", count: 7, severity: "MEDIUM" },
  { category: "Missing Privacy Policy", count: 5, severity: "MEDIUM" },
  { category: "Personal Attributes", count: 4, severity: "MEDIUM" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved": return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "rejected": return <XCircle className="h-4 w-4 text-red-500" />;
    case "requires_review": return <Eye className="h-4 w-4 text-yellow-500" />;
    case "flagged": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    approved: "default",
    rejected: "destructive",
    requires_review: "secondary",
    flagged: "outline",
    pending: "outline",
  };
  return variants[status] || "outline";
};

export function ComplianceDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total}</div>
            <p className="text-xs text-muted-foreground">
              +{mockStats.todaySubmissions} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((mockStats.approved / mockStats.total) * 100).toFixed(1)}%
            </div>
            <Progress 
              value={(mockStats.approved / mockStats.total) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgScore}/100</div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="mr-1 h-3 w-3" />
              +{mockStats.weeklyTrend}% this week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pending + mockStats.flagged}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.pending} pending, {mockStats.flagged} flagged
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>Latest ad content submitted for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSubmissions.map((submission) => (
                <div 
                  key={submission.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(submission.status)}
                    <div>
                      <p className="font-medium text-sm">{submission.title}</p>
                      <p className="text-xs text-muted-foreground">{submission.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      submission.score >= 80 ? "text-green-500" :
                      submission.score >= 50 ? "text-yellow-500" : "text-red-500"
                    }`}>
                      {submission.score}
                    </span>
                    <Badge variant={getStatusBadge(submission.status)}>
                      {submission.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Violations */}
        <Card>
          <CardHeader>
            <CardTitle>Top Violation Categories</CardTitle>
            <CardDescription>Most common policy violations this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topViolations.map((violation, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{violation.category}</span>
                      <Badge 
                        variant={violation.severity === "HIGH" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {violation.severity}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{violation.count} ads</span>
                  </div>
                  <Progress 
                    value={(violation.count / topViolations[0].count) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Status Distribution</CardTitle>
          <CardDescription>Overview of all ad submission statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
                <Eye className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStats.flagged}</p>
                <p className="text-sm text-muted-foreground">Flagged</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
