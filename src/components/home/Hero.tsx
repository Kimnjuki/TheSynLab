import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, CheckCircle2, Clock, Sparkles } from "lucide-react";

const proofPoints = [
  { label: "300+ tools reviewed", icon: CheckCircle2 },
  { label: "14+ days hands-on testing", icon: Clock },
  { label: "0 pay-for-placement scores", icon: Shield },
];

const sampleTools = [
  { name: "Notion", score: 92 },
  { name: "Airtable", score: 88 },
  { name: "ClickUp", score: 85 },
];

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
              Independent · Lab-Tested · No Vendor Influence
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-tsl-text mb-6">
              Independent AI &amp; SaaS Reviews You Can Actually Trust
            </h1>

            <p className="text-lg md:text-xl text-tsl-text-secondary mb-8 max-w-xl">
              We test every tool for 14+ days and score it on Trust, Integration, and 3-Year TCO — so you choose faster and avoid lock-in.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              <Button size="lg" asChild className="bg-tsl-cta-primary-bg text-tsl-cta-primary-text hover:bg-tsl-cta-primary-bg/90 text-base px-8 font-semibold">
                <Link to="/scoring-hub">
                  Compare Tools <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-tsl-cta-secondary-border text-tsl-text hover:bg-tsl-surface text-base px-8 font-semibold">
                <Link to="/decision-studio">
                  Build Your Stack
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
              {sampleTools.map((tool, idx) => (
                <div
                  key={tool.name}
                  className="flex items-center justify-between p-5 rounded-2xl border border-tsl-border bg-tsl-surface shadow-lg"
                  style={{ animationDelay: `${idx * 120}ms` }}
                >
                  <div>
                    <p className="text-sm text-tsl-text-secondary mb-1">Sample Tool</p>
                    <p className="text-xl font-bold text-tsl-text">{tool.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-tsl-text-secondary">Trust Score</p>
                      <p className="text-2xl font-bold text-tsl-trust-high">{tool.score}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full border-4 border-tsl-trust-high flex items-center justify-center">
                      <span className="text-xs font-bold text-tsl-trust-high">A+</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
