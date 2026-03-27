import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function EcosystemOverlapPanel({
  productIds,
}: {
  productIds: Id<"novaProducts">[];
}) {
  const e0 = useQuery(
    api.products.getEcosystems,
    productIds[0] ? { productId: productIds[0] } : "skip"
  );
  const e1 = useQuery(
    api.products.getEcosystems,
    productIds[1] ? { productId: productIds[1] } : "skip"
  );
  const e2 = useQuery(
    api.products.getEcosystems,
    productIds[2] ? { productId: productIds[2] } : "skip"
  );
  const e3 = useQuery(
    api.products.getEcosystems,
    productIds[3] ? { productId: productIds[3] } : "skip"
  );

  const lists = [e0, e1, e2, e3].filter(Boolean) as NonNullable<typeof e0>[];

  const { intersection, union } = useMemo(() => {
    if (lists.length === 0) return { intersection: [] as string[], union: [] as string[] };
    const sets = lists.map((list) => new Set(list.map((x: { ecosystem: string }) => x.ecosystem)));
    const first = sets[0]!;
    const inter = [...first].filter((eco) => sets.every((s) => s.has(eco)));
    const uni = new Set<string>();
    sets.forEach((s) => s.forEach((x) => uni.add(x)));
    return { intersection: inter, union: [...uni].sort() };
  }, [lists]);

  if (productIds.length < 2) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Ecosystem overlap</CardTitle>
        <p className="text-sm text-muted-foreground font-normal">
          Ecosystems supported across all selected products — shared list shows where automations can meet.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Shared by all</p>
          <div className="flex flex-wrap gap-1">
            {intersection.length === 0 ? (
              <span className="text-sm text-amber-700">No single ecosystem is &quot;full&quot; across every row — check the matrix for bridges.</span>
            ) : (
              intersection.map((e) => (
                <Badge key={e} variant="default">
                  {e}
                </Badge>
              ))
            )}
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">Union (any product)</p>
          <div className="flex flex-wrap gap-1">
            {union.slice(0, 24).map((e) => (
              <Badge key={e} variant="outline" className="text-xs">
                {e}
              </Badge>
            ))}
            {union.length > 24 && (
              <Badge variant="secondary">+{union.length - 24} more</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
