import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Cpu, Home, Briefcase, Zap, LayoutGrid } from "lucide-react";

const HUBS = [
  {
    slug: "ai_workflow",
    label: "AI & Workflow Tools",
    href: "/hub/ai_workflow",
    description: "Discover the best AI productivity tools, automation platforms, and workflow engines. From LLMs to no-code builders.",
    icon: Cpu,
    color: "from-violet-500 to-purple-600",
    tags: ["AI", "Automation", "No-Code"],
    productCount: "200+",
  },
  {
    slug: "intelligent_home",
    label: "Intelligent Home",
    href: "/hub/intelligent_home",
    description: "Smart home hubs, voice assistants, sensors, and automation controllers. Find the right ecosystem for your setup.",
    icon: Home,
    color: "from-blue-500 to-cyan-600",
    tags: ["Smart Home", "IoT", "Voice"],
    productCount: "150+",
  },
  {
    slug: "hybrid_office",
    label: "Hybrid Office",
    href: "/hub/hybrid_office",
    description: "Collaboration tools, video conferencing, project management, and remote-work essentials for distributed teams.",
    icon: Briefcase,
    color: "from-emerald-500 to-teal-600",
    tags: ["Collaboration", "Remote", "Productivity"],
    productCount: "120+",
  },
  {
    slug: "ai-tools",
    label: "AI Tools",
    href: "/hub/ai-tools",
    description: "Deep-dive into AI writing assistants, coding copilots, image generators, and developer AI APIs. Integration scores & TCO analysis.",
    icon: Zap,
    color: "from-orange-500 to-amber-600",
    tags: ["LLMs", "Copilots", "APIs"],
    productCount: "300+",
  },
  {
    slug: "saas",
    label: "SaaS & Developer Tools",
    href: "/products",
    description: "Full product directory covering SaaS platforms, developer tooling, databases, CRMs, and more. Trust-scored and TCO-rated.",
    icon: LayoutGrid,
    color: "from-pink-500 to-rose-600",
    tags: ["SaaS", "Dev Tools", "Databases"],
    productCount: "500+",
  },
];

export default function HubsIndex() {
  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Product Hubs – TheSynLab"
        description="Browse all TheSynLab product hubs: AI Tools, Smart Home, Hybrid Office, and more. Every hub includes trust scores, integration grades, TCO analysis, and expert reviews."
        canonical="/hubs"
      />
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 border-b">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Hubs</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every category scored for trust, integration depth, TCO, and vendor risk. Pick your hub to find the right tools for your stack.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HUBS.map((hub) => {
              const Icon = hub.icon;
              return (
                <Link key={hub.slug} to={hub.href} className="group">
                  <Card className="h-full border hover:border-primary/40 hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6 flex flex-col gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${hub.color} flex items-center justify-center shadow-md`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {hub.label}
                          </h2>
                          <span className="text-xs text-muted-foreground font-medium">{hub.productCount} products</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{hub.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {hub.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-primary">
                        Explore hub <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
