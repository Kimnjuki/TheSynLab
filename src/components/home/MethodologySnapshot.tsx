import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { FlaskConical, Gauge, TrendingDown, FileText, ArrowRight } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Hands-on testing",
    desc: "Every tool tested for at least 14 days in real workflows.",
    icon: FlaskConical,
  },
  {
    step: 2,
    title: "Scoring",
    desc: "Trust Score (privacy, security, transparency) and Integration Score (APIs, ecosystem).",
    icon: Gauge,
  },
  {
    step: 3,
    title: "TCO & risk",
    desc: "3-year cost, lock-in risk, and data portability assessed.",
    icon: TrendingDown,
  },
  {
    step: 4,
    title: "Independent verdict",
    desc: "Clear recommendations with pros, cons, and alternatives.",
    icon: FileText,
  },
];

const MethodologySnapshot = () => {
  return (
    <section className="bg-tsl-bg-primary py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tsl-text mb-4">
            How We Score Every Tool
          </h2>
          <p className="text-tsl-text-secondary max-w-2xl mx-auto">
            Our 4-step process keeps scores transparent, repeatable, and free from vendor influence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.step} className="bg-tsl-surface border-tsl-border relative">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-tsl-accent/10 flex items-center justify-center text-tsl-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-tsl-accent uppercase tracking-wider">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-tsl-text">
                    {item.title}
                  </h3>
                  <p className="text-sm text-tsl-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
                {item.step < steps.length && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <ArrowRight className="h-6 w-6 text-tsl-border" />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/scoring-hub"
            className="inline-flex items-center gap-2 text-sm font-medium text-tsl-accent hover:underline"
          >
            View full methodology <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MethodologySnapshot;
