import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PDPAlternative } from "./types";

export function AlternativesStrip({ alternatives }: { alternatives: PDPAlternative[] }) {
  if (!alternatives.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Similar tools</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-3">
          {alternatives.map((alt) => (
            <Link key={alt._id} to={`/products/${alt.productSlug}`} aria-label={`Compare with ${alt.productName}`}>
              <Card className="w-[280px] border-primary/20 hover:border-primary/50 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    {alt.featuredImageUrl ? (
                      <img src={alt.featuredImageUrl} alt={alt.productName} className="h-12 w-12 rounded-md object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted" />
                    )}
                    <div>
                      <p className="font-semibold">{alt.productName}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{alt.verdictSummary ?? "Alternative option"}</p>
                      <p className="mt-1 text-xs">Trust {alt.trustScore ?? "N/A"} | Integration {alt.integrationScore ?? "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
