import { Badge } from "@/components/ui/badge";

type Props = {
  tier?: string;
  complexity?: string;
  overflowWarning?: string;
};

export function PricingSignalBadge({ tier = "$$", complexity = "Tiered", overflowWarning }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Badge>{tier}</Badge>
      <Badge variant="outline">{complexity}</Badge>
      {overflowWarning ? <Badge variant="secondary">{overflowWarning}</Badge> : null}
    </div>
  );
}
