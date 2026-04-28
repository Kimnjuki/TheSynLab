import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Layers,
  Timer,
  DollarSign,
  Lock,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionSummaryCardProps {
  bestForTags?: string[];
  avoidIfTags?: string[];
  stackFitRole?: string;
  maturityLevel?: string;
  learningCurve?: string;
  timeToFirstValueMinutes?: number;
  costTier?: string;
  lockInRisk?: string;
  whoShouldUse?: string;
  whoShouldAvoid?: string;
}

const LOCK_IN_COLORS: Record<string, string> = {
  Low: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-700 border-red-200",
};

const COST_TIER_COLORS: Record<string, string> = {
  Free: "bg-green-100 text-green-700",
  Freemium: "bg-blue-100 text-blue-700",
  Paid: "bg-purple-100 text-purple-700",
  Enterprise: "bg-orange-100 text-orange-700",
};

function ttfvLabel(minutes?: number): string {
  if (!minutes) return "Unknown";
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}

export function DecisionSummaryCard({
  bestForTags,
  avoidIfTags,
  stackFitRole,
  maturityLevel,
  learningCurve,
  timeToFirstValueMinutes,
  costTier,
  lockInRisk,
  whoShouldUse,
  whoShouldAvoid,
}: DecisionSummaryCardProps) {
  const hasBestFor = bestForTags && bestForTags.length > 0;
  const hasAvoidIf = avoidIfTags && avoidIfTags.length > 0;

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Decision Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick metrics row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {costTier && (
            <div className="rounded-lg border bg-background p-3 text-center">
              <DollarSign className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Cost Tier</p>
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block", COST_TIER_COLORS[costTier] ?? "bg-muted text-muted-foreground")}>
                {costTier}
              </span>
            </div>
          )}
          {lockInRisk && (
            <div className="rounded-lg border bg-background p-3 text-center">
              <Lock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Lock-in Risk</p>
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block border", LOCK_IN_COLORS[lockInRisk] ?? "bg-muted text-muted-foreground")}>
                {lockInRisk}
              </span>
            </div>
          )}
          {timeToFirstValueMinutes !== undefined && (
            <div className="rounded-lg border bg-background p-3 text-center">
              <Timer className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Setup Time</p>
              <p className="text-sm font-semibold mt-1">{ttfvLabel(timeToFirstValueMinutes)}</p>
            </div>
          )}
          {learningCurve && (
            <div className="rounded-lg border bg-background p-3 text-center">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Learning Curve</p>
              <p className="text-sm font-semibold mt-1">{learningCurve}</p>
            </div>
          )}
        </div>

        {/* Stack role + maturity */}
        {(stackFitRole || maturityLevel) && (
          <div className="flex flex-wrap gap-2">
            {stackFitRole && (
              <div className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">Stack Role:</span>
                <span className="font-medium text-xs">{stackFitRole}</span>
              </div>
            )}
            {maturityLevel && (
              <div className="flex items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-sm">
                <span className="text-muted-foreground text-xs">Maturity:</span>
                <span className="font-medium text-xs">{maturityLevel}</span>
              </div>
            )}
          </div>
        )}

        {/* Best For */}
        {(hasBestFor || whoShouldUse) && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              Best For
            </div>
            {hasBestFor ? (
              <div className="flex flex-wrap gap-1.5">
                {bestForTags!.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{whoShouldUse}</p>
            )}
          </div>
        )}

        {/* Avoid If */}
        {(hasAvoidIf || whoShouldAvoid) && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600">
              <XCircle className="h-4 w-4" />
              Avoid If
            </div>
            {hasAvoidIf ? (
              <div className="flex flex-wrap gap-1.5">
                {avoidIfTags!.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-red-200 text-red-600 bg-red-50">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{whoShouldAvoid}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
