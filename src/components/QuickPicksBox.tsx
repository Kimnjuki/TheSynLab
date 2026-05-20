import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";

interface QuickPickItem {
  productName: string;
  productSlug: string;
  priceRange: string;
  trustScore: number;
  bestFor: string;
  affiliateUrl?: string;
}

interface Props {
  headline?: string;
  items: QuickPickItem[];
  contextLabel?: string;
}

const QuickPicksBox = ({ headline = "Quick Picks", items, contextLabel = "Top Rated" }: Props) => {
  if (!items || items.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-primary overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {headline}
            </h2>
            <p className="text-sm text-muted-foreground">{contextLabel}</p>
          </div>
        </div>
      </div>
      <div className="divide-y">
        {items.map((item, i) => (
          <div key={item.productSlug} className="flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-muted-foreground/30">#{i + 1}</span>
                <Link to={`/products/${item.productSlug}`} className="font-semibold hover:text-primary truncate">
                  {item.productName}
                </Link>
                <Badge variant="secondary" className="text-xs">{item.bestFor}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{item.priceRange}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <div className="text-center hidden sm:block">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <div
                      key={s}
                      className={`h-1.5 w-1.5 rounded-full ${s < item.trustScore ? "bg-green-500" : "bg-muted"}`}
                    />
                  ))}
                </div>
              </div>
              <Button size="sm" variant="outline" asChild className="gap-1">
                <Link to={`/products/${item.productSlug}`}>
                  View <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuickPicksBox;
export type { QuickPickItem };
