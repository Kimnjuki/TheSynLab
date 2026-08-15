import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Cpu, Shield, Home, Briefcase, PenLine } from "lucide-react";

const categories = [
  {
    title: "AI & Workflow Tools",
    desc: "No-code builders, LLM platforms, and workflow orchestrators — ranked by real-world fit.",
    href: "/hub/ai_workflow",
    icon: Cpu,
  },
  {
    title: "SaaS & Developer Tools",
    desc: "CRMs, databases, and infrastructure scored on privacy, APIs, and TCO.",
    href: "/category/saas-dev",
    icon: Shield,
  },
  {
    title: "Intelligent Home",
    desc: "Smart hubs, sensors, and voice assistants tested for reliability and Matter compatibility.",
    href: "/category/smart-home",
    icon: Home,
  },
  {
    title: "Hybrid Office",
    desc: "Collaboration, video, and remote-work essentials.",
    href: "/category/hybrid-office",
    icon: Briefcase,
  },
  {
    title: "Productivity & AI",
    desc: "Writing, coding, video, and productivity platforms.",
    href: "/blog/best-ai-productivity-tools-2026",
    icon: PenLine,
  },
];

const CategoryGrid = () => {
  return (
    <section className="bg-tsl-bg-primary py-16 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-tsl-text mb-4">
            Our Categories
          </h2>
          <p className="text-tsl-text-secondary max-w-2xl mx-auto">
            Browse curated hubs of lab-tested tools. Each category is ranked by Trust Score, Integration Score, and 3-year TCO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.title} to={cat.href}>
                <Card className="h-full bg-tsl-surface border-tsl-border hover:border-tsl-accent/40 transition-all duration-200 hover:-translate-y-1 group">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="h-12 w-12 rounded-xl bg-tsl-accent/10 flex items-center justify-center text-tsl-accent group-hover:bg-tsl-accent group-hover:text-tsl-cta-primary-text transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-tsl-text mb-2 group-hover:text-tsl-accent transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-tsl-text-secondary leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-tsl-accent mt-2">
                      View all <ArrowRight className="h-4 w-4" />
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

export default CategoryGrid;
