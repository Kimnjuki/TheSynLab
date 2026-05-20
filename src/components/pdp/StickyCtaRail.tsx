import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface Props {
  productName: string;
  productSlug: string;
  priceFrom?: string;
  trustScore?: number;
  integrationScore?: number;
  affiliateUrl?: string;
}

const StickyCtaRail = ({ productName, productSlug, priceFrom, trustScore, integrationScore, affiliateUrl }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const handleClick = () => {
    const url = affiliateUrl || `https://thesynlab.com/products/${productSlug}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="hidden lg:block fixed right-0 top-1/3 z-40 w-[100px]">
      <div className="bg-card border rounded-l-lg shadow-lg p-3 space-y-3">
        <p className="text-xs font-semibold text-center leading-tight">{productName}</p>
        {trustScore && (
          <div className="text-center">
            <span className="text-[10px] text-muted-foreground">Trust</span>
            <div className="flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i < Math.round(trustScore) ? "bg-green-500" : "bg-muted"}`}
                />
              ))}
            </div>
          </div>
        )}
        {priceFrom && <p className="text-xs font-medium text-center">from {priceFrom}</p>}
        <Button size="sm" className="w-full text-xs" onClick={handleClick}>
          <ShoppingCart className="h-3 w-3 mr-1" />
          Visit
        </Button>
        <p className="text-[9px] text-muted-foreground text-center">Affiliate link</p>
      </div>
    </div>
  );
};

export default StickyCtaRail;
