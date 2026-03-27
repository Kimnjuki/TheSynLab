import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, AlertCircle, X, HelpCircle } from "lucide-react";

const PROTOCOLS = [
  "Matter",
  "Zigbee",
  "Z-Wave",
  "Thread",
  "Apple HomeKit",
  "Google Home",
  "Amazon Alexa",
  "Bluetooth",
  "Wi-Fi 6",
];

function cellIcon(level?: string, requiresHub?: boolean) {
  if (!level || level === "unknown")
    return <HelpCircle className="h-5 w-5 text-muted-foreground mx-auto" />;
  if (level === "full" && !requiresHub)
    return <Check className="h-5 w-5 text-green-600 mx-auto" />;
  if (level === "full" && requiresHub)
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex justify-center">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </span>
          </TooltipTrigger>
          <TooltipContent>Full support via hub</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  if (level === "partial")
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex justify-center">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </span>
          </TooltipTrigger>
          <TooltipContent>Partial integration</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  return <X className="h-5 w-5 text-red-500 mx-auto" />;
}

export function ProtocolCompatibilityMatrix({
  ecosystems,
}: {
  ecosystems: Array<{
    ecosystem: string;
    compatibilityLevel: string;
    requiresHub?: boolean;
    setupComplexity?: number;
    verifiedCount?: number;
    integrationMethod?: string;
  }>;
}) {
  const map = new Map(ecosystems.map((e) => [e.ecosystem, e]));

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Protocol & ecosystem matrix — native support, hub path, or gap.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {PROTOCOLS.map((name) => {
          const row = map.get(name);
          return (
            <div
              key={name}
              className="border rounded-lg p-3 flex flex-col items-center gap-2 bg-card text-center"
            >
              <span className="text-xs font-semibold leading-tight">{name}</span>
              {cellIcon(row?.compatibilityLevel, row?.requiresHub)}
              {row && (
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {row.compatibilityLevel}
                  </Badge>
                  {row.requiresHub && (
                    <Badge variant="secondary" className="text-[10px]">
                      Hub
                    </Badge>
                  )}
                </div>
              )}
              {row?.verifiedCount != null && row.verifiedCount > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  {row.verifiedCount} verified
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
