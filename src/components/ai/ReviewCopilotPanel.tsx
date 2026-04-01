import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ReviewCopilotPanel({ productId }: { productId: string }) {
  const run = useAction((api as any)["ai/reviewCopilot"].generateContextualReview);
  const [useCase, setUseCase] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const onRun = async () => {
    if (!useCase.trim()) return;
    setLoading(true);
    try {
      const res = await run({
        productId,
        userId: null,
        userContext: {
          useCase,
          teamSize: 1,
          region: "global",
          privacySensitivity: "medium",
          budget: 100,
        },
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>For Your Use Case</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input value={useCase} onChange={(e) => setUseCase(e.target.value)} placeholder="Describe your use case..." />
        <Button onClick={onRun} disabled={loading || !useCase.trim()}>
          {loading ? "Generating..." : "Generate contextual review"}
        </Button>
        {data && (
          <div className="text-sm space-y-2">
            <p>{data.reframedSummary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
