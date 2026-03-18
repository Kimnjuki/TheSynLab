import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, Filter } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const VOTE_THRESHOLD = 50;

export function ScoreProposalVote() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { user } = useAuth();

  const proposals = useQuery(api.scoreWeightProposals.listOpen) ?? [];
  const vote = useMutation(api.scoreWeightProposals.vote);

  const categories = ["all", ...new Set(proposals.map((p) => p.category))];

  const filtered =
    categoryFilter === "all"
      ? proposals
      : proposals.filter((p) => p.category === categoryFilter);

  const handleVote = async (id: Id<"scoreWeightProposals">) => {
    if (!user) {
      toast.error("Sign in to vote");
      return;
    }
    try {
      await vote({ proposalId: id, userId: user.id });
      toast.success("Vote recorded!");
    } catch (e: any) {
      toast.error(e.message ?? "Could not vote");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(cat)}
          >
            {cat === "all" ? "All Categories" : cat}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm">No open proposals.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const hasVoted =
              user && (p.votes ?? []).some((v: any) => v.userId === user.id);
            const progress = Math.min(100, (p.voteCount / VOTE_THRESHOLD) * 100);
            return (
              <Card key={p._id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm">{p.weightFactor}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {p.category}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant={hasVoted ? "secondary" : "outline"}
                      className="gap-1"
                      onClick={() => handleVote(p._id)}
                      disabled={!!hasVoted}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      {p.voteCount}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xs text-muted-foreground">{p.rationale}</p>
                  <div className="flex gap-4 text-xs">
                    <span>
                      Current: <strong>{p.currentWeight}</strong>
                    </span>
                    <span>
                      Proposed: <strong>{p.proposedWeight}</strong>
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Progress value={progress} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground">
                      {p.voteCount} / {VOTE_THRESHOLD} votes needed
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
