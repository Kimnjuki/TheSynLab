/**
 * S5: Personalized Dashboard
 * Recommendations based on user preference profile.
 */

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonalizedDashboardProps {
  userId?: string;
  className?: string;
}

export function PersonalizedDashboard({ userId, className }: PersonalizedDashboardProps) {
  const profile = useQuery(
    api["recommendations/matchScore"].getUserPreferenceProfile,
    userId ? { userId } : "skip"
  );
  const recommendations = useQuery(
    api["recommendations/matchScore"].getRecommendations,
    userId ? { userId } : "skip"
  );

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          For You
        </CardTitle>
        <CardDescription>
          Recommendations based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile ? (
          <div className="rounded-lg border p-3 text-sm space-y-1">
            {profile.workStyle && (
              <span className="text-muted-foreground">Work style: </span>
              <Badge variant="secondary">{profile.workStyle}</Badge>
            )}
            {profile.budgetRange && (
              <div className="text-muted-foreground">Budget: {profile.budgetRange}</div>
            )}
          </div>
        ) : !userId ? (
          <p className="text-sm text-muted-foreground">Sign in to see personalized recommendations.</p>
        ) : (
          <Skeleton className="h-16 w-full" />
        )}
        {recommendations && recommendations.length > 0 ? (
          <div className="space-y-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Top matches
            </span>
            <ul className="space-y-1 text-sm">
              {recommendations.slice(0, 5).map((r: { productName?: string; matchScore?: number }) => (
                <li key={r.productName} className="flex justify-between">
                  <span>{r.productName}</span>
                  <Badge variant="outline">{r.matchScore ?? 0}%</Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : userId && (
          <Skeleton className="h-24 w-full" />
        )}
      </CardContent>
    </Card>
  );
}
