import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

interface CompetitorBenchmarkProps {
  productId: Id<"novaProducts">;
  productSlug: string;
}

export function CompetitorBenchmark({ productId, productSlug }: CompetitorBenchmarkProps) {
  const comparisons = useQuery(api.products.getComparisons, { productId, limit: 3 }) ?? [];

  if (comparisons.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5" />
          Top Alternatives
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2 font-medium">Product</th>
                <th className="text-center pb-2 font-medium">Trust</th>
                <th className="text-center pb-2 font-medium">Integration</th>
                <th className="text-center pb-2 font-medium">Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c) => {
                const p = c.otherProduct!;
                return (
                  <tr key={c._id} className="border-b last:border-0">
                    <td className="py-2">
                      <div className="font-medium text-xs">{p.productName}</div>
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {p.category}
                      </Badge>
                    </td>
                    <td className="text-center py-2 text-xs">
                      {p.trustScore != null ? (
                        <span className="font-semibold">{p.trustScore}/10</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="text-center py-2 text-xs">
                      {p.integrationScore != null ? (
                        <span className="font-semibold">{p.integrationScore}/10</span>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>
                    <td className="text-center py-2 text-xs">
                      {p.price != null ? `$${p.price}` : "N/A"}
                    </td>
                    <td className="py-2">
                      <Link to={`/products/${p.productSlug}`}>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Link to={`/tools/compare?products=${productSlug}`}>
          <Button variant="outline" size="sm" className="w-full gap-2">
            <BarChart2 className="h-4 w-4" />
            Compare all alternatives
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
