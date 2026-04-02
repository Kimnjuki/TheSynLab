import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { ProductDecisionCard } from "./ProductDecisionCard";
import type { DecisionCardData, HubProduct } from "./types";

type Item = {
  product: HubProduct;
  decision: DecisionCardData;
  trustScore: number;
  integrationScore: number;
};

type Props = {
  label: string;
  icon?: React.ReactNode;
  items: Item[];
};

export function ProductHubSectionGroup({ label, icon, items }: Props) {
  return (
    <Collapsible defaultOpen>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold">{label}</h2>
          <Badge variant="outline">{items.length}</Badge>
        </div>
        <CollapsibleTrigger className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          Toggle <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((it) => (
            <ProductDecisionCard
              key={it.product._id}
              product={it.product}
              decision={it.decision}
              trustScore={it.trustScore}
              integrationScore={it.integrationScore}
              followCount={it.product.followCount ?? 0}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
