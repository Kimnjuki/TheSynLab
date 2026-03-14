/**
 * S3: Blockchain / Verification Badge for Reviews
 * Shows verification level and chain status.
 */

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldCheck, Hash, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationLevel = "none" | "verified_purchase" | "chain_verified" | "full";

interface ReviewVerificationBadgeProps {
  level: VerificationLevel;
  txHash?: string;
  network?: string;
  synTokens?: number;
  className?: string;
}

const levelConfig: Record<
  VerificationLevel,
  { label: string; icon: "none" | "verified" | "chain"; color: string }
> = {
  none: { label: "Unverified", icon: "none", color: "text-muted-foreground" },
  verified_purchase: {
    label: "Verified purchase",
    icon: "verified",
    color: "text-emerald-600",
  },
  chain_verified: {
    label: "Chain verified",
    icon: "chain",
    color: "text-blue-600",
  },
  full: {
    label: "Fully verified",
    icon: "chain",
    color: "text-emerald-600",
  },
};

export function ReviewVerificationBadge({
  level,
  txHash,
  network = "base",
  synTokens,
  className,
}: ReviewVerificationBadgeProps) {
  const config = levelConfig[level];

  if (level === "none") return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "gap-1 border-emerald-500/30 bg-emerald-500/5",
              config.color,
              className
            )}
          >
            {config.icon === "chain" ? (
              <Hash className="h-3 w-3" />
            ) : (
              <ShieldCheck className="h-3 w-3" />
            )}
            <span>{config.label}</span>
            {synTokens != null && synTokens > 0 && (
              <span className="text-muted-foreground text-[10px]">
                +{synTokens} SYN
              </span>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 text-xs">
            <p className="font-medium">{config.label}</p>
            {txHash && (
              <p className="font-mono text-[10px] break-all">
                Tx: {txHash.slice(0, 10)}...
              </p>
            )}
            {network && <p>Network: {network}</p>}
            {synTokens != null && synTokens > 0 && (
              <p>Earned {synTokens} SYN tokens for verified review</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
