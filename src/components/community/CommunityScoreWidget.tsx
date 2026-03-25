import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Id } from "../../../convex/_generated/dataModel";

export function CommunityScoreWidget({ productId }: { productId: Id<"novaProducts"> }) {
  const data = useQuery(api.community.getCommunityScoreForProduct, { productId });
  const aggregate = useQuery(api.communityScoreRatings.getAggregateProductScore, { productId });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Scores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Badge variant="secondary">Sample: {data?.sampleSize ?? 0}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Trust: <span className="font-semibold text-foreground">{(data?.trustAvg ?? 0).toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Integration: <span className="font-semibold text-foreground">{(data?.integrationAvg ?? 0).toFixed(2)}</span>
        </div>
        <div className="pt-2 border-t text-xs text-muted-foreground">
          Users Choice vs Lab Choice: {aggregate?.usersChoiceTrust ?? 0}/{aggregate?.usersChoiceIntegration ?? 0} vs{" "}
          {aggregate?.labChoiceTrust ?? 0}/{aggregate?.labChoiceIntegration ?? 0}
        </div>
      </CardContent>
    </Card>
  );
}
