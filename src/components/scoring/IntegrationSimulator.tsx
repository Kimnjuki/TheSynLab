/**
 * S4: Integration Simulator
 * Simulate product A + B integration compatibility.
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Zap, Cpu, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationSimulatorProps {
  productAId: Id<"novaProducts">;
  productBId: Id<"novaProducts">;
  productAName?: string;
  productBName?: string;
  onSimulate?: (score: number, details: unknown) => void;
  className?: string;
}

export function IntegrationSimulator({
  productAId,
  productBId,
  productAName = "Product A",
  productBName = "Product B",
  onSimulate,
  className,
}: IntegrationSimulatorProps) {
  const [complexity, setComplexity] = useState(3);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<{ score: number; details?: unknown } | null>(null);

  const compatibility = useQuery(
    api["simulator/getCompatibility"].getCompatibilityForSimulation,
    {
      ecosystemA: productAName,
      ecosystemB: productBName,
    }
  );

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResult(null);
    try {
      // Stub: in production, call Convex action
      await new Promise((r) => setTimeout(r, 800));
      const score = compatibility?.compatibilityScore ?? 72 + Math.round((5 - complexity) * 8);
      const details = compatibility ?? { score, complexity };
      setResult({ score: Math.min(100, score), details });
      onSimulate?.(score, details);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Integration Simulator
        </CardTitle>
        <CardDescription>
          Simulate {productAName} + {productBName} integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Setup Complexity (1–5)</Label>
          <Slider
            value={[complexity]}
            onValueChange={([v]) => setComplexity(v)}
            min={1}
            max={5}
            step={1}
          />
        </div>
        <Button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="w-full"
        >
          {isSimulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Simulating…
            </>
          ) : (
            <>
              <Cpu className="mr-2 h-4 w-4" />
              Run Simulation
            </>
          )}
        </Button>
        {result && (
          <div className="flex items-center justify-between rounded-lg border p-3">
            <span className="text-sm font-medium">Compatibility Score</span>
            <Badge
              variant={result.score >= 70 ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {result.score >= 70 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {result.score}%
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
