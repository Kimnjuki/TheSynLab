import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function LabFreshnessBadge({
  testedDate,
  label = "Last lab tested",
}: {
  testedDate?: number;
  label?: string;
}) {
  if (!testedDate) return null;
  const days = (Date.now() - testedDate) / (24 * 60 * 60 * 1000);
  const variant =
    days <= 30 ? "default" : days <= 90 ? "secondary" : "outline";

  return (
    <Badge variant={variant} className="gap-1 font-normal">
      <FlaskConical className="h-3 w-3" />
      {label}: {formatDistanceToNow(testedDate, { addSuffix: true })}
    </Badge>
  );
}
