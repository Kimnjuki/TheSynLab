import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "us", label: "US", flag: "🇺🇸" },
  { code: "eu", label: "EU", flag: "🇪🇺" },
  { code: "gb", label: "UK", flag: "🇬🇧" },
  { code: "ke", label: "Kenya", flag: "🇰🇪" },
  { code: "in", label: "India", flag: "🇮🇳" },
  { code: "au", label: "Australia", flag: "🇦🇺" },
  { code: "jp", label: "Japan", flag: "🇯🇵" },
];

interface LocaleScoreBadgeProps {
  productId: Id<"novaProducts">;
  baseTrustScore?: number;
  baseIntegrationScore?: number;
  className?: string;
}

export function LocaleScoreBadge({
  productId,
  baseTrustScore,
  baseIntegrationScore,
  className,
}: LocaleScoreBadgeProps) {
  const [locale, setLocale] = useState("us");
  const adjustment = useQuery(api.scores.getLocaleAdjustment, {
    productId,
    locale,
  });

  const adjTrust =
    adjustment?.adjustedTrustScore ?? baseTrustScore;
  const adjIntegration =
    adjustment?.adjustedIntegrationScore ?? baseIntegrationScore;

  const trustDelta = adjTrust != null && baseTrustScore != null
    ? (adjTrust - baseTrustScore).toFixed(1)
    : null;
  const integDelta =
    adjIntegration != null && baseIntegrationScore != null
      ? (adjIntegration - baseIntegrationScore).toFixed(1)
      : null;

  const selected = LOCALES.find((l) => l.code === locale)!;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-1 text-xs h-7", className)}
        >
          <Globe className="h-3 w-3" />
          {selected.flag} {selected.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3 space-y-3">
        <div>
          <p className="text-xs font-medium mb-2">Score region:</p>
          <div className="flex flex-wrap gap-1">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLocale(l.code)}
                className={cn(
                  "text-xs px-2 py-0.5 rounded border transition-colors",
                  locale === l.code
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent"
                )}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        {adjustment ? (
          <div className="space-y-2">
            {adjTrust != null && (
              <div className="flex justify-between text-xs">
                <span>Trust Score ({selected.label})</span>
                <span className="font-semibold">
                  {adjTrust.toFixed(1)}
                  {trustDelta && (
                    <span
                      className={cn(
                        "ml-1",
                        Number(trustDelta) > 0
                          ? "text-green-600"
                          : "text-red-500"
                      )}
                    >
                      ({Number(trustDelta) > 0 ? "+" : ""}{trustDelta})
                    </span>
                  )}
                </span>
              </div>
            )}
            {adjIntegration != null && (
              <div className="flex justify-between text-xs">
                <span>Integration ({selected.label})</span>
                <span className="font-semibold">
                  {adjIntegration.toFixed(1)}
                  {integDelta && (
                    <span
                      className={cn(
                        "ml-1",
                        Number(integDelta) > 0
                          ? "text-green-600"
                          : "text-red-500"
                      )}
                    >
                      ({Number(integDelta) > 0 ? "+" : ""}{integDelta})
                    </span>
                  )}
                </span>
              </div>
            )}
            {adjustment.localRegulations?.length ? (
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Local regulations:
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {adjustment.localRegulations.map((r) => (
                    <Badge key={r} variant="outline" className="text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No locale-specific adjustments for {selected.label}.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
