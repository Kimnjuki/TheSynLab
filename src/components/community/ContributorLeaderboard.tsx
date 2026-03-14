/**
 * S6: Contributor Leaderboard
 * Top contributors by reviews, votes, proposals.
 */

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContributorLeaderboardProps {
  limit?: number;
  className?: string;
}

export function ContributorLeaderboard({ limit = 10, className }: ContributorLeaderboardProps) {
  const leaderboard = useQuery(
    api["community/leaderboard"].getContributorLeaderboard,
    { limit }
  );

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Contributors
        </CardTitle>
        <CardDescription>
          Community members with the most impact
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leaderboard ? (
          <ul className="space-y-3">
            {leaderboard.map((row: { displayName?: string; clerkId?: string; totalScore?: number; rank?: number }, i) => (
              <li
                key={row.clerkId ?? i}
                className="flex items-center gap-3 rounded-lg border p-2"
              >
                <span className="text-muted-foreground w-6">
                  #{row.rank ?? i + 1}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {(row.displayName ?? "?")[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate font-medium">
                  {row.displayName ?? "Anonymous"}
                </span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {row.totalScore ?? 0}
                </Badge>
              </li>
            ))}
          </ul>
        ) : (
          <Skeleton className="h-32 w-full" />
        )}
        {leaderboard && leaderboard.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No contributors yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
