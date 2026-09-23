import { useParams } from "react-router-dom";
import { getToolBySlug } from "@/data/saasTools";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, ExternalLink, Star, DollarSign } from "lucide-react";

/**
 * Minimal iframe-friendly scorecard for embedding on third-party sites.
 * Served at /widget/tool/:slug with CSP frame-ancestors * override in nginx.
 * No Header/Footer to keep payload minimal (~5 KB).
 * Gap 3.15 — Widget/Embed program.
 */
export default function ToolEmbedPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug);
  const year = new Date().getFullYear();

  if (!tool) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        Tool not found. Visit{" "}
        <a
          href={`https://thesynlab.com/tool/${slug}`}
          className="underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          the full review
        </a>
        .
      </div>
    );
  }

  const trustScore = tool.trustScore * 2;
  const integrationScore = tool.integrationScore * 2;

  const trustColor =
    trustScore >= 9
      ? "text-green-500"
      : trustScore >= 7
      ? "text-amber-500"
      : "text-red-500";

  const integColor =
    integrationScore >= 9
      ? "text-green-500"
      : integrationScore >= 7
      ? "text-amber-500"
      : "text-red-500";

  return (
    <div className="font-sans">
      <Card className="border-2 border-border/50 shadow-none bg-card">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-foreground">{tool.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {tool.tagline}
              </p>
            </div>
            <Badge variant="secondary" className="text-xs">
              TheSynLab {year}
            </Badge>
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className={`flex items-center gap-1.5 text-center ${trustColor}`}>
              <Shield className="h-4 w-4 mx-auto" />
              <div>
                <div className="font-bold text-lg">{trustScore.toFixed(1)}</div>
                <div className="text-[10px] text-muted-foreground">Trust Score</div>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 text-center ${integColor}`}>
              <Zap className="h-4 w-4 mx-auto" />
              <div>
                <div className="font-bold text-lg">{integrationScore.toFixed(1)}</div>
                <div className="text-[10px] text-muted-foreground">Integration</div>
              </div>
            </div>
          </div>

          {/* Pricing + CTA */}
          <div className="border-t pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                {tool.pricing.startingPrice}
                {tool.pricing.hasFree ? " · Free plan" : ""}
              </div>
              <a
                href={`https://thesynlab.com/tool/${tool.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
              >
                Full Review <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>Editorial score — not a user rating</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
