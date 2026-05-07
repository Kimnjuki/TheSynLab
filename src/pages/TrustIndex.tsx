import React, { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { MetaTags } from "@/components/seo/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  BarChart3,
  Lightbulb,
  Hash,
  ArrowUp,
  ArrowDown,
  Medal,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";
import type { Id } from "@/../convex/_generated/dataModel";

interface TrustEntry {
  rank: number;
  productId: Id<"novaProducts"> & { productName?: string; productSlug?: string; hub?: string };
  trustScore: number;
  integrationScore: number;
  rankDelta: number;
  badge?: string;
}

// Hub slugs for the trust index tabs
const HUB_SLUGS = [
  { slug: "productivity", label: "Productivity" },
  { slug: "ai-software", label: "AI Software" },
  { slug: "smart-home", label: "Smart Home" },
  { slug: "office-hardware", label: "Office Hardware" },
  { slug: "martech", label: "MarTech" },
  { slug: "collaboration", label: "Collaboration" },
];

const trustScoreColor = (score: number) => {
  if (score >= 85) return "text-green-500";
  if (score >= 70) return "text-amber-500";
  return "text-red-500";
};

const BadgeIcon = ({ badge }: { badge?: string }) => {
  switch (badge) {
    case "top_rated": return <Medal className="h-4 w-4 text-yellow-500" />;
    case "rising": return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "editor_choice": return <Star className="h-4 w-4 text-purple-500" />;
    case "stable": return <Minus className="h-4 w-4 text-blue-500" />;
    default: return null;
  }
};

const RankDelta = ({ delta }: { delta: number }) => {
  if (delta > 0) return <span className="flex items-center gap-0.5 text-xs text-green-500"><ArrowUp className="h-3 w-3" />{delta}</span>;
  if (delta < 0) return <span className="flex items-center gap-0.5 text-xs text-red-500"><ArrowDown className="h-3 w-3" />{Math.abs(delta)}</span>;
  return <span className="flex items-center gap-0.5 text-xs text-muted-foreground"><Minus className="h-3 w-3" /></span>;
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="ml-auto h-4 w-16" />
      </div>
    ))}
  </div>
);

const TrustIndexLeaderboard = () => {
  const allSnapshots = useQuery(api.trustIndex.getAllCurrentSnapshots) ?? [];
  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];

  const productMap = useMemo(() => {
    const m = new Map<string, any>();
    (allProducts as any[]).forEach((p) => m.set(p._id, p));
    return m;
  }, [allProducts]);

  // Group entries by hub
  const entriesByHub = useMemo(() => {
    const result: Record<string, TrustEntry[]> = {};
    (allSnapshots as any[]).forEach((snap: any) => {
      const entries: TrustEntry[] = (snap.rankedEntries || []).map((e: any) => ({
        ...e,
        productId: e.productId,
        productName: productMap.get(e.productId)?.productName || "Unknown",
        productSlug: productMap.get(e.productId)?.productSlug || "",
        hub: productMap.get(e.productId)?.hub || snap.hubSlug,
      }));
      result[snap.hubSlug] = entries;
    });
    return result;
  }, [allSnapshots, productMap]);

  const [activeHub, setActiveHub] = useState("productivity");
  const entries = entriesByHub[activeHub] || [];
  const currentSnapshot = (allSnapshots as any[]).find((s) => s.hubSlug === activeHub);
  const publishedDate = currentSnapshot?.publishedAt
    ? new Date(currentSnapshot.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="Trust Index Leaderboard — TheSynLab"
        description="Ranked by unique Trust Score & Integration Score. See the most trustworthy tools in productivity, AI, smart home, and more."
        canonical="/trust-index"
      />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2">
            <Award className="mr-1 h-4 w-4" />
            Trust Index
          </Badge>
          <h1 className="text-3xl font-bold">Product Trust Leaderboard</h1>
          <p className="mt-2 text-muted-foreground">
            Ranked by Trust Score &amp; Integration Score — updated monthly
          </p>
          {publishedDate && (
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: {publishedDate}
            </p>
          )}
        </div>

        {/* Hub tabs */}
        <Tabs value={activeHub} onValueChange={setActiveHub} className="mb-8">
          <TabsList className="flex w-full flex-wrap justify-center">
            {HUB_SLUGS.map((hub) => (
              <TabsTrigger key={hub.slug} value={hub.slug}>
                {hub.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {HUB_SLUGS.map((hub) => (
            <TabsContent key={hub.slug} value={hub.slug} className="mt-6">
              {entries.length === 0 ? (
                <LoadingSkeleton />
              ) : (
                <div className="space-y-2">
                  {entries.map((entry, i) => (
                    <Link
                      key={entry.productId}
                      to={entry.productSlug ? `/products/${entry.productSlug}` : "#"}
                      className={`flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent ${
                        i === 0 ? "border-yellow-500/30 bg-yellow-500/5" : ""
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex w-10 shrink-0 justify-center">
                        {i === 0 ? (
                          <Medal className="h-6 w-6 text-yellow-500" />
                        ) : i === 1 ? (
                          <Medal className="h-6 w-6 text-gray-400" />
                        ) : i === 2 ? (
                          <Medal className="h-6 w-6 text-amber-600" />
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground">
                            #{entry.rank}
                          </span>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium">
                            {entry.productName || "Unknown"}
                          </span>
                          <BadgeIcon badge={entry.badge} />
                          <RankDelta delta={entry.rankDelta} />
                        </div>
                        <p className="text-xs text-muted-foreground capitalize">
                          {entry.hub}
                        </p>
                      </div>

                      {/* Scores */}
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-xs text-muted-foreground">Trust</p>
                          <p className={`text-sm font-bold ${trustScoreColor(entry.trustScore)}`}>
                            {Math.round(entry.trustScore)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Integration</p>
                          <p className="text-sm font-bold">
                            {Math.round(entry.integrationScore)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default TrustIndexLeaderboard;
