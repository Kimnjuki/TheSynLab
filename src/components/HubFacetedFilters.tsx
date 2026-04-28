import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface HubFilterState {
  pricingTier: string[];
  lockInRisk: string[];
  selfHostAvailable: boolean | null;
  gdprReady: boolean | null;
  minTrustScore: number;
  minIntegrationScore: number;
  sortBy: string;
}

const DEFAULT_FILTERS: HubFilterState = {
  pricingTier: [],
  lockInRisk: [],
  selfHostAvailable: null,
  gdprReady: null,
  minTrustScore: 0,
  minIntegrationScore: 0,
  sortBy: "overallScore",
};

const PRICING_TIERS = ["Free", "Freemium", "Paid", "Enterprise"];
const LOCK_IN_RISKS = ["Low", "Medium", "High"];
const SORT_OPTIONS = [
  { value: "overallScore", label: "Overall Score" },
  { value: "integrationScore", label: "Integration Score" },
  { value: "trustScore", label: "Trust Score" },
  { value: "tcoScore", label: "TCO Score" },
  { value: "trendingRank", label: "Trending" },
  { value: "reviewCount", label: "Most Reviewed" },
];

interface Props {
  filters: HubFilterState;
  onChange: (filters: HubFilterState) => void;
  productCount: number;
}

function toggleArrayItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

function hasActiveFilters(f: HubFilterState): boolean {
  return (
    f.pricingTier.length > 0 ||
    f.lockInRisk.length > 0 ||
    f.selfHostAvailable !== null ||
    f.gdprReady !== null ||
    f.minTrustScore > 0 ||
    f.minIntegrationScore > 0
  );
}

export function HubFacetedFilters({ filters, onChange, productCount }: Props) {
  const [expanded, setExpanded] = useState(false);
  const active = hasActiveFilters(filters);

  const update = (patch: Partial<HubFilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className="mb-8">
      {/* Top bar: sort + expand toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn("gap-2", active && "border-primary text-primary")}
            onClick={() => setExpanded((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {active && (
              <Badge className="ml-1 h-4 w-4 p-0 justify-center text-[10px] bg-primary">
                {[filters.pricingTier.length, filters.lockInRisk.length, filters.selfHostAvailable !== null ? 1 : 0, filters.gdprReady !== null ? 1 : 0].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          {active && (
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground" onClick={() => onChange(DEFAULT_FILTERS)}>
              <X className="h-3 w-3" /> Clear all
            </Button>
          )}
          <span className="text-sm text-muted-foreground">{productCount} products</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0">Sort by</span>
          <Select value={filters.sortBy} onValueChange={(v) => update({ sortBy: v })}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active filter chips */}
      {active && (
        <div className="flex flex-wrap gap-2 mb-3">
          {filters.pricingTier.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1 cursor-pointer" onClick={() => update({ pricingTier: toggleArrayItem(filters.pricingTier, t) })}>
              {t} <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.lockInRisk.map((r) => (
            <Badge key={r} variant="secondary" className="gap-1 cursor-pointer" onClick={() => update({ lockInRisk: toggleArrayItem(filters.lockInRisk, r) })}>
              Lock-in: {r} <X className="h-3 w-3" />
            </Badge>
          ))}
          {filters.selfHostAvailable !== null && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => update({ selfHostAvailable: null })}>
              Self-host: {filters.selfHostAvailable ? "Yes" : "No"} <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.gdprReady !== null && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => update({ gdprReady: null })}>
              GDPR: {filters.gdprReady ? "Yes" : "No"} <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.minTrustScore > 0 && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => update({ minTrustScore: 0 })}>
              Trust ≥ {filters.minTrustScore} <X className="h-3 w-3" />
            </Badge>
          )}
          {filters.minIntegrationScore > 0 && (
            <Badge variant="secondary" className="gap-1 cursor-pointer" onClick={() => update({ minIntegrationScore: 0 })}>
              Integration ≥ {filters.minIntegrationScore} <X className="h-3 w-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Expanded filter panel */}
      {expanded && (
        <div className="rounded-lg border bg-muted/30 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pricing Tier */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Pricing</p>
            <div className="flex flex-wrap gap-2">
              {PRICING_TIERS.map((tier) => (
                <Button
                  key={tier}
                  variant={filters.pricingTier.includes(tier) ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => update({ pricingTier: toggleArrayItem(filters.pricingTier, tier) })}
                >
                  {tier}
                </Button>
              ))}
            </div>
          </div>

          {/* Lock-in Risk */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Lock-in Risk</p>
            <div className="flex flex-wrap gap-2">
              {LOCK_IN_RISKS.map((risk) => (
                <Button
                  key={risk}
                  variant={filters.lockInRisk.includes(risk) ? "default" : "outline"}
                  size="sm"
                  className={cn("h-7 text-xs", filters.lockInRisk.includes(risk) && risk === "High" && "bg-red-500 hover:bg-red-600 border-red-500")}
                  onClick={() => update({ lockInRisk: toggleArrayItem(filters.lockInRisk, risk) })}
                >
                  {risk}
                </Button>
              ))}
            </div>
          </div>

          {/* Boolean flags */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Compliance</p>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant={filters.selfHostAvailable === true ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => update({ selfHostAvailable: filters.selfHostAvailable === true ? null : true })}
                >
                  Self-host ✓
                </Button>
                <Button
                  variant={filters.gdprReady === true ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => update({ gdprReady: filters.gdprReady === true ? null : true })}
                >
                  GDPR ✓
                </Button>
              </div>
            </div>
          </div>

          {/* Score thresholds */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Min Trust Score: <span className="text-foreground font-bold">{filters.minTrustScore > 0 ? filters.minTrustScore : "Any"}</span>
              </p>
              <Slider
                value={[filters.minTrustScore]}
                onValueChange={([v]) => update({ minTrustScore: v })}
                min={0}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Min Integration Score: <span className="text-foreground font-bold">{filters.minIntegrationScore > 0 ? filters.minIntegrationScore : "Any"}</span>
              </p>
              <Slider
                value={[filters.minIntegrationScore]}
                onValueChange={([v]) => update({ minIntegrationScore: v })}
                min={0}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function useHubFilters() {
  const [filters, setFilters] = useState<HubFilterState>(DEFAULT_FILTERS);
  return { filters, setFilters };
}

export function applyHubFilters(products: any[], filters: HubFilterState): any[] {
  let out = [...products];

  if (filters.minTrustScore > 0) {
    out = out.filter((p) => {
      const score = p.nova_trust_scores?.[0]?.total_score ?? p.trustScore ?? 0;
      return score >= filters.minTrustScore;
    });
  }
  if (filters.minIntegrationScore > 0) {
    out = out.filter((p) => {
      const score = p.nova_integration_scores?.[0]?.total_score ?? p.integrationScore ?? 0;
      return score >= filters.minIntegrationScore;
    });
  }

  const sortMap: Record<string, (a: any, b: any) => number> = {
    overallScore: (a, b) => (b.overallScore ?? 0) - (a.overallScore ?? 0),
    integrationScore: (a, b) => (b.nova_integration_scores?.[0]?.total_score ?? 0) - (a.nova_integration_scores?.[0]?.total_score ?? 0),
    trustScore: (a, b) => (b.nova_trust_scores?.[0]?.total_score ?? 0) - (a.nova_trust_scores?.[0]?.total_score ?? 0),
    reviewCount: (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
    trendingRank: (a, b) => (a.trendingRank ?? 999) - (b.trendingRank ?? 999),
  };
  if (sortMap[filters.sortBy]) {
    out.sort(sortMap[filters.sortBy]);
  }

  return out;
}
