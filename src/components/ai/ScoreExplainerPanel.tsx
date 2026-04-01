import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function ScoreExplainerPanel({ productId }: { productId: string }) {
  const run = useAction((api as any)["ai/scoreExplainer"].generateScoreExplanation);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const onGenerate = async () => {
    setLoading(true);
    try {
      const res = await run({ productId, scoreType: "both" });
      setData(res?.data ?? res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why this score?</CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline">{open ? "Hide explanation" : "Show explanation"}</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-3">
            {!data && (
              <Button onClick={onGenerate} disabled={loading}>
                {loading ? "Generating..." : "Generate AI explanation"}
              </Button>
            )}
            {data && (
              <div className="space-y-2 text-sm">
                <p>{data.explanation}</p>
                {Array.isArray(data.strengths) && <p><strong>Strengths:</strong> {data.strengths.join("; ")}</p>}
                {Array.isArray(data.weaknesses) && <p><strong>Weaknesses:</strong> {data.weaknesses.join("; ")}</p>}
                {Array.isArray(data.redFlags) && data.redFlags.length > 0 && (
                  <p><strong>Red flags:</strong> {data.redFlags.join("; ")}</p>
                )}
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
