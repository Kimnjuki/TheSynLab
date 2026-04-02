import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { SocialProofBadge } from "./SocialProofBadge";
import { FollowButton } from "./FollowButton";
import { RiskBadgeStrip } from "./RiskBadgeStrip";
import { IntegrationMiniGraph } from "./IntegrationMiniGraph";
import { PricingSignalBadge } from "./PricingSignalBadge";
import type { HubProduct, DecisionCardData } from "./types";

type MiniNode = { id: string; name: string; logoUrl?: string | null; connectionMethod: string; strength: number };

type Props = {
  product: HubProduct;
  decision: DecisionCardData;
  trustScore: number;
  integrationScore: number;
  reviewCount?: number;
  reviewRating?: number;
  topTheme?: string;
  followCount?: number;
  isFollowing?: boolean;
  miniGraphNodes?: MiniNode[];
};

export function ProductDecisionCard({
  product,
  decision,
  trustScore,
  integrationScore,
  reviewCount = 0,
  reviewRating = 0,
  topTheme = "",
  followCount = 0,
  isFollowing = false,
  miniGraphNodes = [],
}: Props) {
  const [hovered, setHovered] = useState(false);
  const integrationOverflow = Math.max(0, (miniGraphNodes.length || decision.keyIntegrations.length) - 5);
  const badges = useMemo(() => {
    const row = [];
    if (decision.bestForTags?.length) row.push(`Best for: ${decision.bestForTags[0]}`);
    if (decision.selfHostOption) row.push("Self-host option");
    if (decision.soc2Ready || decision.gdprReady) row.push("SOC 2 & GDPR ready");
    return row.slice(0, 3);
  }, [decision]);

  return (
    <motion.article
      className="relative rounded-xl border bg-card p-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4, boxShadow: "0 20px 35px rgba(0,0,0,0.18)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      aria-label={`${product.productName} decision card`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-3">
          {product.featuredImageUrl ? (
            <img src={product.featuredImageUrl} alt={`${product.productName} logo`} className="h-12 w-12 rounded-md object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs">{product.productName.slice(0, 2)}</div>
          )}
          <div>
            <h3 className="font-semibold">{product.productName}</h3>
            <p className="line-clamp-2 text-xs text-muted-foreground">{product.verdictSummary}</p>
            <div className="mt-2 flex gap-2">
              <SocialProofBadge variant="trust" score={trustScore} />
              <SocialProofBadge variant="integration" score={integrationScore} />
            </div>
          </div>
        </div>
        <FollowButton isFollowing={isFollowing} count={followCount} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {badges.map((b) => <Badge key={b} variant="secondary">{b}</Badge>)}
      </div>

      <div className="mt-3">
        <RiskBadgeStrip lockInRisk={decision.lockInRisk} exportQuality={decision.exportQuality} dataResidency={decision.dataResidency} />
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium">Pros</div>
          <ul className="space-y-1">
            {decision.topPros.slice(0, 3).map((pro) => (
              <li key={pro} className="flex items-center gap-1 text-xs"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{pro}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium">Watch-outs</div>
          <ul className="space-y-1">
            {decision.topWatchOuts.slice(0, 2).map((w) => (
              <li key={w} className="flex items-center gap-1 text-xs"><AlertTriangle className="h-3.5 w-3.5 text-amber-500" />{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Top integrations row">
        {decision.keyIntegrations.slice(0, 5).map((tool) => (
          <span key={tool} className="inline-flex h-6 items-center gap-1 rounded-full border px-2 text-[11px]">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[9px]">
              {tool.slice(0, 1).toUpperCase()}
            </span>
            {tool}
          </span>
        ))}
        {integrationOverflow > 0 ? <Badge variant="outline">+{integrationOverflow} more</Badge> : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SocialProofBadge variant="review_summary" score={reviewRating} reviewCount={reviewCount} />
        <Badge variant="outline">{decision.workflowTemplateCount} templates</Badge>
        <Badge variant="outline">{decision.communityStackCount} stacks</Badge>
        {topTheme ? <span className="text-xs text-muted-foreground">Theme: {topTheme}</span> : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" aria-label={`Open decision engine for ${product.productName}`}>Open Decision Engine</Button>
        <Badge variant="secondary" aria-label={`Compare ${product.productName}`}>Compare</Badge>
        <Badge variant="secondary" aria-label={`Compatibility for ${product.productName}`}>Compatibility</Badge>
        <Badge variant="secondary" aria-label={`Budget signal for ${product.productName}`}>Budget</Badge>
        <PricingSignalBadge tier={decision.typicalCostTier} complexity={decision.pricingComplexity} />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{followCount} people tracking updates</span>
        <FollowButton isFollowing={isFollowing} count={followCount} />
      </div>

      <AnimatePresence>
        {hovered ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pointer-events-none absolute bottom-2 right-2 rounded-lg border bg-background/95 p-1"
          >
            <IntegrationMiniGraph centerLabel={product.productName} nodes={miniGraphNodes} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.article>
  );
}
