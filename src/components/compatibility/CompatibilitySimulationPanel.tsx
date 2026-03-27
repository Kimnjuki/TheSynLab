import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { toast } from "sonner";

export function CompatibilitySimulationPanel({
  productA,
  productB,
  userId,
}: {
  productA: { _id: Id<"novaProducts">; productName: string } | null;
  productB: { _id: Id<"novaProducts">; productName: string } | null;
  userId?: string;
}) {
  const [useCase, setUseCase] = useState("Alexa routine automation");
  const [result, setResult] = useState<{
    resultScore: number;
    resultDetails: {
      sharedEcosystems: string[];
      steps: { label: string; status: string; detail: string }[];
    };
  } | null>(null);
  const run = useMutation(api.integrationSimulations.runHeuristic);

  const handleRun = async () => {
    if (!productA || !productB) {
      toast.error("Select two products first.");
      return;
    }
    try {
      const r = await run({
        userId,
        productAId: productA._id,
        productBId: productB._id,
        useCase,
      });
      setResult({ resultScore: r.resultScore, resultDetails: r.resultDetails as any });
      toast.success("Simulation complete");
    } catch (e) {
      toast.error("Simulation failed");
      console.error(e);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Compatibility simulation</CardTitle>
        <p className="text-sm text-muted-foreground font-normal">
          Heuristic pass/fail across shared ecosystems, hub path, and voice assistants (stored in integrationSimulations).
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs">Use case</Label>
          <Input
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="e.g. Can A trigger B via Matter?"
            className="mt-1"
          />
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {productA && (
            <Badge variant="secondary">A: {productA.productName}</Badge>
          )}
          {productB && (
            <Badge variant="secondary">B: {productB.productName}</Badge>
          )}
        </div>
        <Button onClick={handleRun} className="gap-2" disabled={!productA || !productB}>
          <Play className="h-4 w-4" />
          Run simulation
        </Button>

        {result && (
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Result score</span>
              <span className="text-2xl font-bold text-primary">{result.resultScore}</span>
            </div>
            {result.resultDetails.sharedEcosystems?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Shared ecosystems</p>
                <div className="flex flex-wrap gap-1">
                  {result.resultDetails.sharedEcosystems.map((e) => (
                    <Badge key={e} variant="outline">
                      {e}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <ul className="space-y-2">
              {result.resultDetails.steps?.map((s, i) => (
                <li key={i} className="text-sm border-l-2 pl-2 border-primary/30">
                  <span className="font-medium">{s.label}</span>{" "}
                  <Badge
                    variant={
                      s.status === "pass"
                        ? "default"
                        : s.status === "warn"
                          ? "secondary"
                          : "destructive"
                    }
                    className="ml-1 text-[10px]"
                  >
                    {s.status}
                  </Badge>
                  <p className="text-muted-foreground text-xs mt-0.5">{s.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
