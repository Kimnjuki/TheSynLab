import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  productName: string;
  productSlug: string;
  score?: number;
  bullets?: string[];
  affiliateUrl?: string;
  alternativesCount?: number;
}

const VerdictCtaBox = ({ productName, productSlug, score, bullets, affiliateUrl, alternativesCount }: Props) => {
  const handleClick = () => {
    window.open(affiliateUrl || `https://thesynlab.com/products/${productSlug}`, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="p-6 border-l-4 border-l-primary space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Why choose {productName}?</h3>
        {score && (
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary">{score}</span>
            <span className="text-sm text-muted-foreground">/5</span>
          </div>
        )}
      </div>
      {bullets && bullets.length > 0 && (
        <ul className="space-y-2">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="text-green-500 mt-0.5">✓</span>
              {bullet}
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleClick} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Visit {productName}
        </Button>
        {alternativesCount !== undefined && (
          <Button variant="ghost" asChild>
            <Link to={`/compare?product=${productSlug}`}>
              See {alternativesCount} alternatives
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">Affiliate link — no extra cost to you</p>
    </Card>
  );
};

export default VerdictCtaBox;
