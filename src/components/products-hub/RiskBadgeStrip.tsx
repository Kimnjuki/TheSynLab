import { Badge } from "@/components/ui/badge";

type Props = {
  lockInRisk: string;
  exportQuality: string;
  dataResidency: string;
};

const dotClass: Record<string, string> = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

export function RiskBadgeStrip({ lockInRisk, exportQuality, dataResidency }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg border p-2 text-xs">
      <Badge variant="outline" className="justify-center gap-1">
        <span className={`h-2 w-2 rounded-full ${dotClass[lockInRisk] ?? "bg-muted-foreground"}`} />
        Lock-in: {lockInRisk}
      </Badge>
      <Badge variant="outline" className="justify-center">Export: {exportQuality}</Badge>
      <Badge variant="outline" className="justify-center">
        {dataResidency === "eu-friendly" ? "EU" : dataResidency === "us-only" ? "US" : "GL"} Data
      </Badge>
    </div>
  );
}
