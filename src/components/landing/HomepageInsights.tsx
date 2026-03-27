import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Leaf, Percent, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function safeDistance(ts: number) {
  if (!Number.isFinite(ts)) return "—";
  try {
    return formatDistanceToNow(ts, { addSuffix: true });
  } catch {
    return "—";
  }
}

export function HomepageInsights() {
  const feed = useQuery(api.homepageInsights.liveScoreFeed, { hoursBack: 48 }) ?? [];
  const health = useQuery(api.homepageInsights.ecosystemHealthSummary);
  const trending = useQuery(api.homepageInsights.trendingTopicsForHome, { limit: 6 }) ?? [];
  const deals = useQuery(api.homepageInsights.dealHighlights, { limit: 4 }) ?? [];

  return (
    <section className="py-12 border-y bg-muted/10">
      <div className="container mx-auto px-4 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold">This week in SynLab</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Live score activity, ecosystem health, trending topics, and standout deals.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Live score feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {feed.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No scores refreshed in the last 48h — check back after the next lab run.
                </p>
              ) : (
                <ul className="space-y-2 max-h-56 overflow-y-auto">
                  {feed.slice(0, 10).map((row, i) => (
                    <li key={`${row.productId}-${row.kind}-${i}`} className="flex justify-between items-center text-sm border-b border-border/50 pb-2 last:border-0">
                      <Link
                        to={`/products/${row.slug}`}
                        className="font-medium hover:text-primary truncate pr-2"
                      >
                        {row.name}
                      </Link>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={row.kind === "trust" ? "default" : "secondary"} className="text-xs">
                          {row.kind === "trust" ? "Trust" : "Integration"} {row.score.toFixed(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {safeDistance(row.testedDate)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-lg">Ecosystem health</CardTitle>
            </CardHeader>
            <CardContent>
              {health?.pct ? (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-emerald-500/10 p-3">
                    <div className="text-2xl font-bold text-emerald-700">{health.pct.native}%</div>
                    <div className="text-xs text-muted-foreground">Native / full</div>
                  </div>
                  <div className="rounded-lg bg-amber-500/10 p-3">
                    <div className="text-2xl font-bold text-amber-700">{health.pct.partial}%</div>
                    <div className="text-xs text-muted-foreground">Partial</div>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <div className="text-2xl font-bold">{health.pct.limited}%</div>
                    <div className="text-xs text-muted-foreground">Limited / none</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading ecosystem stats…</p>
              )}
              <p className="text-xs text-muted-foreground mt-3">
                Based on Matter, Zigbee, Z-Wave, Thread, HomeKit, Alexa, and Google Home rows in our compatibility database.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Trending now</CardTitle>
            </CardHeader>
            <CardContent>
              {trending.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active trending topics yet.</p>
              ) : (
                <ul className="space-y-2">
                  {trending.map((t) => (
                    <li key={t._id} className="flex justify-between gap-2 text-sm">
                      <span className="font-medium">{t.topic}</span>
                      {t.postSlug ? (
                        <Link
                          to={`/blog/${t.postSlug}`}
                          className="text-primary text-xs shrink-0 hover:underline"
                        >
                          Read
                        </Link>
                      ) : (
                        <Badge variant="outline" className="text-xs">Editorial queue</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Percent className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Deal pulse</CardTitle>
            </CardHeader>
            <CardContent>
              {deals.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No large price drops on tracked affiliate links right now.
                </p>
              ) : (
                <ul className="space-y-2">
                  {deals.map((d) => (
                    <li key={d.productId} className="flex justify-between text-sm">
                      <Link to={`/products/${d.slug}`} className="hover:text-primary truncate pr-2">
                        {d.name}
                      </Link>
                      <Badge variant="secondary" className="shrink-0">
                        −{d.pctOff}%
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
