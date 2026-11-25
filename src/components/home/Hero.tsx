import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { STATIC_PRODUCTS } from "@/data/staticProductData";

/** Featured cards must use the same catalog snapshot as /products/:slug — never hard-coded sample scores. */
const FEATURED_SLUGS = ["notion", "airtable", "clickup"] as const;

const featuredTools = FEATURED_SLUGS.map((slug) => {
  const product = STATIC_PRODUCTS.find((p) => p.productSlug === slug);
  if (!product) return null;
  return {
    name: product.productName,
    slug: product.productSlug,
    trustScore: product.trustScore,
    href: `/products/${product.productSlug}`,
  };
}).filter(Boolean) as Array<{
  name: string;
  slug: string;
  trustScore: number;
  href: string;
}>;

const proofPoints = [
  { label: `${STATIC_PRODUCTS.length} products in catalog`, icon: CheckCircle2 },
  { label: "14+ day testing protocol", icon: Clock },
  { label: "0 pay-for-placement scores", icon: Shield },
];

const scoreBand = (score: number) => {
  if (score >= 8.4) return { label: "Strong", className: "border-tsl-trust-high text-tsl-trust-high" };
  if (score >= 7.0) return { label: "Mixed", className: "border-tsl-trust-mid text-tsl-trust-mid" };
  return { label: "Caution", className: "border-tsl-trust-low text-tsl-trust-low" };
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-tsl-bg-primary py-20 md:py-28 lg:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tsl-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tsl-accent-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-tsl-border bg-tsl-surface text-tsl-text text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4 text-tsl-accent" />
              Independent · Evidence-led · No pay-for-placement
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-tsl-text mb-6">
              Independent AI &amp; SaaS Reviews You Can Actually Trust
            </h1>

            <p className="text-lg md:text-xl text-tsl-text-secondary mb-8 max-w-xl">
              We score tools on Trust, Integration, and ownership cost with a published methodology — so you choose faster and avoid lock-in.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              <Button size="lg" asChild className="bg-tsl-cta-primary-bg text-tsl-cta-primary-text hover:bg-tsl-cta-primary-bg/90 text-base px-8 font-semibold">
                <Link to="/hub/ai-tools">
                  Find the right tool <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-tsl-cta-secondary-border text-tsl-text hover:bg-tsl-surface text-base px-8 font-semibold">
                <Link to="/scoring-hub">
                  Compare tools
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-tsl-cta-secondary-border text-tsl-text hover:bg-tsl-surface text-base px-8 font-semibold">
                <Link to="/decision-studio">
                  Build my stack
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {proofPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.label} className="flex items-center gap-2 text-sm text-tsl-text-secondary">
                    <Icon className="h-4 w-4 text-tsl-accent" />
                    {point.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="grid gap-4">
              {featuredTools.map((tool, idx) => {
                const band = scoreBand(tool.trustScore);
                const scoreColor =
                  tool.trustScore >= 8.4
                    ? "text-tsl-trust-high"
                    : tool.trustScore >= 7.0
                      ? "text-tsl-trust-mid"
                      : "text-tsl-trust-low";
                return (
                  <Link
                    key={tool.slug}
                    to={tool.href}
                    className="flex items-center justify-between p-5 rounded-2xl border border-tsl-border bg-tsl-surface shadow-lg hover:border-tsl-accent/40 transition-colors"
                    style={{ animationDelay: `${idx * 120}ms` }}
                  >
                    <div>
                      <p className="text-sm text-tsl-text-secondary mb-1">Catalog score</p>
                      <p className="text-xl font-bold text-tsl-text">{tool.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-tsl-text-secondary">Trust Score</p>
                        <p className={`text-2xl font-bold ${scoreColor}`}>{tool.trustScore.toFixed(1)}/10</p>
                      </div>
                      <div className={`h-12 w-12 rounded-full border-4 flex items-center justify-center ${band.className}`}>
                        <span className={`text-[10px] font-bold leading-tight text-center px-1 ${band.className.split(" ")[1]}`}>
                          {band.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
