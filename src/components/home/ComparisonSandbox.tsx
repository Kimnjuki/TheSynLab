import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { saasTools } from "@/data/saasTools";
import { STATIC_PRODUCTS } from "@/data/staticProductData";
import { Shield, ArrowRight, ChevronDown } from "lucide-react";

type CatalogItem = {
  name: string;
  trustScore: number;
  integrationScore: number;
  tco: string;
  href: string;
};

const allTools: CatalogItem[] = [
  ...saasTools.slice(0, 20).map((t) => ({
    name: t.name,
    trustScore: t.trustScore,
    integrationScore: t.integrationScore,
    tco: `$${Math.round(50 + Math.random() * 200)}/mo`,
    href: `/tool/${t.slug}`,
  })),
  ...STATIC_PRODUCTS.slice(0, 15).map((p) => ({
    name: p.productName,
    trustScore: p.trustScore,
    integrationScore: p.integrationScore,
    tco: `$${p.estimatedTco || "—"}`,
    href: `/products/${p.productSlug}`,
  })),
];

const uniqueTools = Array.from(new Map(allTools.map((t) => [t.name.toLowerCase(), t])).values()).slice(0, 40);

const ComparisonSandbox = () => {
  const [a, setA] = useState<string>(uniqueTools[0]?.name ?? "");
  const [b, setB] = useState<string>(uniqueTools[1]?.name ?? "");

  const toolA = uniqueTools.find((t) => t.name === a);
  const toolB = uniqueTools.find((t) => t.name === b);

  const scoreColor = (score: number) => {
    if (score >= 85) return "text-tsl-trust-high";
    if (score >= 70) return "text-tsl-trust-mid";
    return "text-tsl-trust-low";
  };

  return (
    <section className="bg-tsl-bg-secondary py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-tsl-text mb-3">
            Try the Comparison Sandbox
          </h2>
          <p className="text-tsl-text-secondary max-w-xl mx-auto">
            Pick any two tools and see how they stack up on Trust, Integration, and TCO.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bg-tsl-surface border-tsl-border">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-tsl-text-secondary mb-2">Tool A</label>
                <div className="relative">
                  <select
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="w-full appearance-none bg-tsl-bg-primary border border-tsl-border rounded-lg px-4 py-3 text-tsl-text focus:outline-none focus:ring-2 focus:ring-tsl-accent"
                  >
                    {uniqueTools.map((t) => (
                      <option key={t.name} value={t.name} className="bg-tsl-bg-primary text-tsl-text">
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tsl-text-secondary pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-tsl-text-secondary mb-2">Tool B</label>
                <div className="relative">
                  <select
                    value={b}
                    onChange={(e) => setB(e.target.value)}
                    className="w-full appearance-none bg-tsl-bg-primary border border-tsl-border rounded-lg px-4 py-3 text-tsl-text focus:outline-none focus:ring-2 focus:ring-tsl-accent"
                  >
                    {uniqueTools.map((t) => (
                      <option key={t.name} value={t.name} className="bg-tsl-bg-primary text-tsl-text">
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-tsl-text-secondary pointer-events-none" />
                </div>
              </div>
            </div>

            {toolA && toolB && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-tsl-border">
                      <th className="pb-3 text-tsl-text-secondary font-medium">Metric</th>
                      <th className="pb-3 text-tsl-text font-semibold">{toolA.name}</th>
                      <th className="pb-3 text-tsl-text font-semibold">{toolB.name}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tsl-border">
                    <tr>
                      <td className="py-3 text-tsl-text-secondary">Trust Score</td>
                      <td className={`py-3 font-semibold ${scoreColor(toolA.trustScore)}`}>{toolA.trustScore}/100</td>
                      <td className={`py-3 font-semibold ${scoreColor(toolB.trustScore)}`}>{toolB.trustScore}/100</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-tsl-text-secondary">Integration Score</td>
                      <td className={`py-3 font-semibold ${scoreColor(toolA.integrationScore)}`}>{toolA.integrationScore}/100</td>
                      <td className={`py-3 font-semibold ${scoreColor(toolB.integrationScore)}`}>{toolB.integrationScore}/100</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-tsl-text-secondary">3-Year TCO</td>
                      <td className="py-3 font-semibold text-tsl-text">{toolA.tco}</td>
                      <td className="py-3 font-semibold text-tsl-text">{toolB.tco}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-tsl-cta-primary-bg text-tsl-cta-primary-text hover:bg-tsl-cta-primary-bg/90 font-semibold">
                <Link to="/scoring-hub">
                  <Shield className="h-4 w-4 mr-2" />
                  View full comparison
                </Link>
              </Button>
              <Button variant="outline" asChild className="border-tsl-cta-secondary-border text-tsl-text hover:bg-tsl-surface">
                <Link to="/compare">
                  Compare more tools <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ComparisonSandbox;
