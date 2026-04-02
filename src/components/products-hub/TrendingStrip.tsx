import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { TrendingProduct } from "./types";

type Props = {
  bestOfMonth: TrendingProduct[];
  fastestRising: TrendingProduct[];
  allTimeLeaders: TrendingProduct[];
};

function CompactCards({ items }: { items: TrendingProduct[] }) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-3 py-2">
        {items.map((it) => (
          <div key={it.product._id} className="min-w-[220px] rounded-lg border p-3">
            <div className="text-2xl font-bold text-muted-foreground">{it.trendingRank}</div>
            <div className="text-sm font-semibold">{it.product.productName}</div>
            <div className="mt-2 flex gap-2">
              <Badge>{Math.round(it.trustScore ?? 0)}</Badge>
              <Badge variant={it.trustScoreDelta >= 0 ? "secondary" : "destructive"}>
                {it.trustScoreDelta >= 0 ? "▲" : "▼"} {it.trustScoreDelta.toFixed(1)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function TrendingStrip({ bestOfMonth, fastestRising, allTimeLeaders }: Props) {
  return (
    <Tabs defaultValue="best">
      <TabsList>
        <TabsTrigger value="best">Best of Month</TabsTrigger>
        <TabsTrigger value="rising">Fastest Rising</TabsTrigger>
        <TabsTrigger value="leaders">All-Time Leaders</TabsTrigger>
      </TabsList>
      <TabsContent value="best"><CompactCards items={bestOfMonth} /></TabsContent>
      <TabsContent value="rising"><CompactCards items={fastestRising} /></TabsContent>
      <TabsContent value="leaders"><CompactCards items={allTimeLeaders} /></TabsContent>
    </Tabs>
  );
}
