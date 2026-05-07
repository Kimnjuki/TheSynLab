import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Share2, AlertTriangle, DollarSign, Lock } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";

interface Product {
  _id: Id<"novaProducts">;
  productName: string;
  productSlug: string;
  hub: string;
  pricingTier?: string;
  riskBadge?: string;
  featuredImageUrl?: string;
  description?: string;
  overallScore?: number;
  price?: number;
}

interface SynLabScorecardProps {
  product: Product;
  variant?: "full" | "compact" | "inline";
  showTco?: boolean;
  showRisk?: boolean;
  trustScore?: number;
  integrationScore?: number;
  riskLabel?: string;
  onAddToStack?: () => void;
}

export const SynLabScorecard = ({
  product,
  variant = "compact",
  showTco = false,
  showRisk = false,
  trustScore = 0,
  integrationScore = 0,
  riskLabel,
  onAddToStack,
}: SynLabScorecardProps) => {
  const trustColor = useMemo(
    () => (trustScore >= 4 ? "text-green-500" : trustScore >= 3 ? "text-amber-500" : "text-red-500"),
    [trustScore]
  );
  const integrationColor = useMemo(
    () =>
      integrationScore >= 4
        ? "text-green-500"
        : integrationScore >= 3
          ? "text-amber-500"
          : "text-red-500",
    [integrationScore]
  );

  const tcoLabel = product.pricingTier || (product.price ? product.price > 100 ? "$$$" : "$" : "Free");

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-3 text-sm">
        <div className={`flex items-center gap-1 ${trustColor}`}>
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-semibold">{trustScore.toFixed(1)}</span>
          <span className="text-muted-foreground">Trust</span>
        </div>
        <div className={`flex items-center gap-1 ${integrationColor}`}>
          <Share2 className="h-3.5 w-3.5" />
          <span className="font-semibold">{integrationScore.toFixed(1)}</span>
          <span className="text-muted-foreground">Integ.</span>
        </div>
        {showRisk && riskLabel && (
          <Badge
            variant={
              riskLabel === "Low" ? "outline" : riskLabel === "Critical" ? "destructive" : "secondary"
            }
            className="text-xs"
          >
            <AlertTriangle className="mr-1 h-3 w-3" />
            {riskLabel}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={variant === "compact" ? "max-w-sm" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{product.productName}</h4>
            {product.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          {product.featuredImageUrl && (
            <img src={product.featuredImageUrl} alt="" className="h-10 w-10 rounded object-contain" />
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted p-2 text-center">
            <div className={`text-lg font-bold ${trustColor}`}>{trustScore.toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground">Trust Score</div>
          </div>
          <div className="rounded-lg bg-muted p-2 text-center">
            <div className={`text-lg font-bold ${integrationColor}`}>{integrationScore.toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground">Integ. Score</div>
          </div>
          {showTco && (
            <div className="rounded-lg bg-muted p-2 text-center">
              <div className="text-lg font-bold">
                <DollarSign className="inline h-4 w-4" />
                {tcoLabel}
              </div>
              <div className="text-[10px] text-muted-foreground">TCO Tier</div>
            </div>
          )}
          {showRisk && riskLabel && (
            <div className="rounded-lg bg-muted p-2 text-center">
              <div className="text-lg font-bold">
                <Lock className="inline h-4 w-4" />
              </div>
              <div className="text-[10px] text-muted-foreground">{riskLabel}</div>
            </div>
          )}
        </div>

        {onAddToStack && (
          <Button size="sm" variant="outline" className="mt-3 w-full" onClick={onAddToStack}>
            Add to My Stack
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
