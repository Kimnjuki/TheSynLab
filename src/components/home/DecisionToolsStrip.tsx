import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Calculator, Layers, Sparkles, ArrowRight } from "lucide-react";

const tools = [
  {
    title: "Compare Tools",
    desc: "Side-by-side on Trust, Integration, and TCO",
    icon: Scale,
    href: "/scoring-hub",
  },
  {
    title: "Decision Studio",
    desc: "ROI calculator and TCO modeler",
    icon: Calculator,
    href: "/decision-studio",
  },
  {
    title: "Stack Builder",
    desc: "Assemble your ideal stack with AI notes",
    icon: Layers,
    href: "/decision-studio#stack-builder",
  },
  {
    title: "Stack Quiz",
    desc: "Not sure where to start? 2-minute quiz",
    icon: Sparkles,
    href: "/tools/quiz",
  },
];

const DecisionToolsStrip = () => {
  return (
    <section className="bg-tsl-bg-secondary py-16 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-tsl-text mb-3">
            Quick Decision Tools
          </h2>
          <p className="text-tsl-text-secondary max-w-xl mx-auto">
            Jump straight into the tool that fits your current need — no browsing required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.title} to={tool.href}>
                <Card className="h-full bg-tsl-surface border-tsl-border hover:border-tsl-accent/50 transition-all duration-200 hover:-translate-y-1 group">
                  <CardContent className="flex flex-col items-start gap-4 p-6">
                    <div className="h-12 w-12 rounded-xl bg-tsl-accent/10 flex items-center justify-center text-tsl-accent group-hover:bg-tsl-accent group-hover:text-tsl-cta-primary-text transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-tsl-text mb-1 group-hover:text-tsl-accent transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-tsl-text-secondary">
                        {tool.desc}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-tsl-accent mt-2">
                      Open tool <ArrowRight className="h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DecisionToolsStrip;
