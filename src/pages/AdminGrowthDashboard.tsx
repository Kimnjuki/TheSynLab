/**
 * AdminGrowthDashboard — SEO health, LLM citation tracking, CWV stats.
 * Shows key growth metrics at a glance for the SynLab team.
 */
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Search,
  MousePointerClick,
  FileText,
  Bot,
  Gauge,
  Globe,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Zap,
  ExternalLink,
} from "lucide-react";

export default function AdminGrowthDashboard() {
  // These queries will hit Convex once deployed — for now show static guidance
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-blue-500" />
          Growth Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          SEO performance, LLM citation tracking, and Core Web Vitals monitoring.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Search className="h-4 w-4 text-green-500" />
              SEO Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">82/100</p>
            <p className="text-xs text-muted-foreground">Estimated site health score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4 text-purple-500" />
              AI Citations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">Deploy aiCitationTracker to begin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Gauge className="h-4 w-4 text-blue-500" />
              CWV Pass Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">Requires Crux API or analytics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-500" />
              Indexed Pages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">182</p>
            <p className="text-xs text-muted-foreground">Per GSC (May 29, 2026)</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Growth Checklist</CardTitle>
          <CardDescription>Implementation progress from the Growth Plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { done: true, label: "Schema: aiCitationTracker table added", icon: "CheckCircle2" },
              { done: true, label: "Schema: FAQ fields added to novaPosts", icon: "CheckCircle2" },
              { done: true, label: "Schema: llmCitationSummary on products + posts", icon: "CheckCircle2" },
              { done: true, label: "Schema: CWV + AI overview fields on seoHealthMetrics", icon: "CheckCircle2" },
              { done: true, label: "Schema: keyword cluster + competitor tracking on contentHubs", icon: "CheckCircle2" },
              { done: true, label: "Content: FAQ sections added to 6 blog articles", icon: "CheckCircle2" },
              { done: true, label: "Content: 15 blog articles with llmCitationSummary", icon: "CheckCircle2" },
              { done: true, label: "Content: 7 top products with llmCitationSummary", icon: "CheckCircle2" },
              { done: false, label: "Deploy: Push to Coolify to go live", icon: "Zap" },
              { done: false, label: "GA4: Mark key events in Admin console", icon: "MousePointerClick" },
              { done: false, label: "GEO: Submit sitemap to Google, Bing, Yandex", icon: "Search" },
              { done: false, label: "Monitoring: Configure Key Events for outbound_click", icon: "BarChart3" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                )}
                <span className={item.done ? "text-muted-foreground line-through text-sm" : "text-sm"}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">SEO Quick Reference</CardTitle>
          <CardDescription>Key metrics to track for growth</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="gsc">
            <TabsList>
              <TabsTrigger value="gsc">GSC</TabsTrigger>
              <TabsTrigger value="ga4">GA4</TabsTrigger>
              <TabsTrigger value="seo">Technical SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="gsc" className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Impressions (80 days)</p>
                  <p className="text-2xl font-bold">2,245</p>
                </div>
                <div>
                  <p className="font-medium">Clicks (80 days)</p>
                  <p className="text-2xl font-bold">6</p>
                </div>
                <div>
                  <p className="font-medium">CTR</p>
                  <p className="text-2xl font-bold">0.27%</p>
                </div>
                <div>
                  <p className="font-medium">Indexed</p>
                  <p className="text-2xl font-bold">182</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Data from GSC (May 29, 2026). Impression growth: <strong>95× in 3 months</strong>.
                Focus on CTR via meta title/description optimization.
              </p>
            </TabsContent>
            <TabsContent value="ga4" className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Homepage Views (28d)</p>
                  <p className="text-2xl font-bold">61</p>
                </div>
                <div>
                  <p className="font-medium">Active Users (28d)</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div>
                  <p className="font-medium">Key Events</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div>
                  <p className="font-medium">Conversions</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Data from GA4 (May 6 → Jun 2, 2026). 9 key events configured in code but not marked in GA4 Admin.
              </p>
            </TabsContent>
            <TabsContent value="seo" className="space-y-3 pt-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Canonical tags — all pages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  JSON-LD schema — FAQPage, Product, Article, BreadcrumbList
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  Prerendered HTML — all routes have static content
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  robots.txt — AI crawler-specific rules
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  sitemap.xml — all routes, lastmod dates
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  GA4 key events — need manual activation in Admin
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                  AdSense — submitted, awaiting review after content fix
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
