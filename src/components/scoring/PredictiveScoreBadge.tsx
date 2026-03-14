/**
 * S1: AI-Powered Predictive Score Badge
 * Displays ML-predicted integration score with confidence indicator.
 */

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PredictiveScoreBadgeProps {
  score: number;
  confidence?: number; // 0-1
  model?: string;
  className?: string;
}

export function PredictiveScoreBadge({
  score,
  confidence = 0,
  model = "v1",
  className,
}: PredictiveScoreBadgeProps) {
  const displayScore = Math.round(score * 10) / 10;
  const confidencePct = Math.round((confidence || 0) * 100);
  const isHighConfidence = confidencePct >= 70;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="secondary"
            className={cn(
              "gap-1 font-mono",
              isHighConfidence && "border-emerald-500/50 bg-emerald-500/10",
              className
            )}
          >
            <Sparkles className="h-3 w-3" />
            <span>{displayScore}/10</span>
            {confidencePct > 0 && (
              <span className="text-muted-foreground text-[10px]">
                {confidencePct}%
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <p className="font-medium">AI-Predicted Integration Score</p>
            <p>Model: {model}</p>
            {confidencePct > 0 && <p>Confidence: {confidencePct}%</p>}
            <p className="text-muted-foreground">Based on feature analysis</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
