import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface Props {
  productName: string;
  priceFrom?: string;
  affiliateUrl?: string;
}

const MobileStickyBar = ({ productName, priceFrom, affiliateUrl }: Props) => {
  const handleClick = () => {
    window.open(affiliateUrl || "#", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t bg-card shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="text-sm">
          <p className="font-medium leading-tight">{productName}</p>
          {priceFrom && <p className="text-xs text-muted-foreground">from {priceFrom}</p>}
        </div>
        <Button size="sm" onClick={handleClick} className="gap-1 shrink-0">
          Visit →
          <ShoppingCart className="h-3 w-3" />
        </Button>
      </div>
      <p className="text-[10px] text-center text-muted-foreground pb-1">Affiliate link — no extra cost</p>
    </div>
  );
};

export default MobileStickyBar;
