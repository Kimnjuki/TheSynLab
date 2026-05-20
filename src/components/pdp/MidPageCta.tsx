import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, Info } from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  description?: string;
  affiliateUrl?: string;
}

interface Props {
  productName: string;
  tiers?: PricingTier[];
  affiliateUrl?: string;
}

const MidPageCta = ({ productName, tiers, affiliateUrl }: Props) => {
  const defaultTiers: PricingTier[] = tiers || [
    { name: "Free", price: "$0", description: "Get started", affiliateUrl },
    { name: "Starter", price: "From $16/mo", description: "For small teams", affiliateUrl },
    { name: "Pro", price: "From $99/mo", description: "For power users", affiliateUrl },
  ];

  return (
    <Card className="p-6 space-y-4">
      <h3 className="font-semibold">{productName} Pricing</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {defaultTiers.map((tier) => (
          <div key={tier.name} className="p-4 rounded-lg border bg-muted/30 space-y-2">
            <p className="font-medium text-sm">{tier.name}</p>
            <p className="text-2xl font-bold">{tier.price}</p>
            {tier.description && <p className="text-xs text-muted-foreground">{tier.description}</p>}
            <Button
              size="sm"
              className="w-full"
              onClick={() => window.open(tier.affiliateUrl || affiliateUrl || "#", "_blank", "noopener,noreferrer")}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Get {tier.name}
            </Button>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <Info className="h-3 w-3" />
        Affiliate link — no extra cost to you
      </div>
    </Card>
  );
};

export default MidPageCta;
