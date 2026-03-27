import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface WeightedScoreCustomizerProps {
  products: any[];
}

export function WeightedScoreCustomizer({ products }: WeightedScoreCustomizerProps) {
  const [wTrust, setWTrust] = useState(35);
  const [wInt, setWInt] = useState(35);
  const [wPrice, setWPrice] = useState(15);
  const [wTco, setWTco] = useState(15);

  const sum = wTrust + wInt + wPrice + wTco;
  const norm = sum > 0 ? sum / 100 : 1;

  const ranked = useMemo(() => {
    return products.map((p) => {
      const trust = p.nova_trust_scores?.[0]?.total_score ?? 0;
      const integ = p.nova_integration_scores?.[0]?.total_score ?? 0;
      const price = p.price ?? 0;
      const maxPrice = Math.max(
        ...products.map((x) => x.price ?? 0),
        1
      );
      const priceScore = maxPrice > 0 ? 10 * (1 - price / maxPrice) : 5;
      const tcoProxy = priceScore;

      const combined =
        (trust * wTrust + integ * wInt + priceScore * wPrice + tcoProxy * wTco) /
        (100 * norm);

      return {
        id: p._id ?? p.id,
        name: p.productName ?? p.product_name,
        combined: Math.round(combined * 10) / 10,
        trust,
        integ,
      };
    }).sort((a, b) => b.combined - a.combined);
  }, [products, wTrust, wInt, wPrice, wTco, norm]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Weighted score customizer</CardTitle>
        <p className="text-sm text-muted-foreground font-normal">
          Drag weights for trust, integration, price value, and TCO proxy — rankings update live.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Trust</span>
              <span>{wTrust}%</span>
            </div>
            <Slider value={[wTrust]} min={0} max={60} step={5} onValueChange={(v) => setWTrust(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Integration</span>
              <span>{wInt}%</span>
            </div>
            <Slider value={[wInt]} min={0} max={60} step={5} onValueChange={(v) => setWInt(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Price value</span>
              <span>{wPrice}%</span>
            </div>
            <Slider value={[wPrice]} min={0} max={40} step={5} onValueChange={(v) => setWPrice(v[0])} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>TCO proxy</span>
              <span>{wTco}%</span>
            </div>
            <Slider value={[wTco]} min={0} max={40} step={5} onValueChange={(v) => setWTco(v[0])} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium">Adjusted ranking</p>
          {ranked.map((r, i) => (
            <div key={String(r.id)} className="flex items-center gap-3">
              <span className="text-muted-foreground w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate font-medium">{r.name}</span>
                  <span className="tabular-nums">{r.combined}</span>
                </div>
                <Progress value={r.combined * 10} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
