import { Badge } from "@/components/ui/badge";

export function FellowBadge({ isFellow }: { isFellow?: boolean }) {
  if (!isFellow) return null;
  return <Badge className="bg-amber-600 hover:bg-amber-600">Fellow</Badge>;
}
