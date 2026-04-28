import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, Zap, GitMerge, Bot, BarChart2, Mail, ShoppingCart } from "lucide-react";

interface WorkflowRecipe {
  id: string;
  title: string;
  description: string;
  useCase: string;
  tools: string[];
  steps: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  icon: React.ElementType;
  href: string;
}

const RECIPES: WorkflowRecipe[] = [
  {
    id: "lead-enrichment",
    title: "Automated Lead Enrichment & CRM Sync",
    description: "New form submission → enrich with Clearbit → score with AI → push to HubSpot → notify Slack.",
    useCase: "Sales & CRM",
    tools: ["HubSpot", "Clearbit", "Slack", "OpenAI"],
    steps: 5,
    difficulty: "Intermediate",
    icon: Mail,
    href: "/hubs/ai-workflow",
  },
  {
    id: "content-pipeline",
    title: "AI Content Publishing Pipeline",
    description: "Brief in Notion → GPT-4 draft → Grammarly review → publish to WordPress → share on Buffer.",
    useCase: "Content Marketing",
    tools: ["Notion", "OpenAI", "WordPress", "Buffer"],
    steps: 5,
    difficulty: "Beginner",
    icon: Zap,
    href: "/hubs/ai-workflow",
  },
  {
    id: "devops-alert",
    title: "Incident → Alert → Runbook Automation",
    description: "PagerDuty alert → fetch runbook from Confluence → post to Slack → auto-create Jira ticket.",
    useCase: "DevOps & SRE",
    tools: ["PagerDuty", "Confluence", "Slack", "Jira"],
    steps: 4,
    difficulty: "Advanced",
    icon: GitMerge,
    href: "/hubs/ai-workflow",
  },
  {
    id: "ecommerce-order",
    title: "E-Commerce Order to Fulfilment",
    description: "Shopify order → inventory check in Airtable → fulfil via ShipStation → send transactional email via Postmark.",
    useCase: "E-Commerce",
    tools: ["Shopify", "Airtable", "ShipStation", "Postmark"],
    steps: 4,
    difficulty: "Intermediate",
    icon: ShoppingCart,
    href: "/hubs/ai-workflow",
  },
  {
    id: "analytics-report",
    title: "Weekly Analytics Report Bot",
    description: "Pull GA4 + Stripe data → Claude summarises insights → post digest to Slack channel every Monday.",
    useCase: "Analytics",
    tools: ["Google Analytics", "Stripe", "Claude", "Slack"],
    steps: 3,
    difficulty: "Beginner",
    icon: BarChart2,
    href: "/hubs/ai-workflow",
  },
  {
    id: "ai-support-triage",
    title: "AI Customer Support Triage",
    description: "Intercom ticket → GPT-4 classifies intent → auto-reply for FAQs → escalate complex cases to Zendesk.",
    useCase: "Customer Support",
    tools: ["Intercom", "OpenAI", "Zendesk"],
    steps: 3,
    difficulty: "Intermediate",
    icon: Bot,
    href: "/hubs/ai-workflow",
  },
];

const USE_CASES = ["All", "Sales & CRM", "Content Marketing", "DevOps & SRE", "E-Commerce", "Analytics", "Customer Support"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

export default function WorkflowsIndex() {
  const [search, setSearch] = useState("");
  const [useCase, setUseCase] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const filtered = RECIPES.filter((r) => {
    const matchesSearch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tools.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesUseCase = useCase === "All" || r.useCase === useCase;
    const matchesDifficulty = difficulty === "All" || r.difficulty === difficulty;
    return matchesSearch && matchesUseCase && matchesDifficulty;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Workflow Automation Templates & Recipes | TheSynLab"
        description="Browse no-code automation recipes and workflow templates. Curated integration playbooks for sales, devops, content, e-commerce, and more — with tool recommendations and step-by-step guides."
        canonical="/workflows"
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 border-b">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">Workflow Recipes</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Workflow Automation Templates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Curated, tool-scored integration playbooks. Each recipe links to integration-rated products so you pick the right stack, not just any stack.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-14 z-30 border-b bg-background/95 backdrop-blur py-3">
          <div className="container mx-auto px-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recipes or tools…"
                className="pl-9 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {USE_CASES.map((uc) => (
                <Button
                  key={uc}
                  variant={useCase === uc ? "default" : "outline"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setUseCase(uc)}
                >
                  {uc}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {DIFFICULTIES.map((d) => (
                <Button
                  key={d}
                  variant={difficulty === d ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setDifficulty(d)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Recipe Grid */}
        <section className="container mx-auto px-4 py-10">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No recipes match your filters.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((recipe) => {
                const Icon = recipe.icon;
                return (
                  <Card key={recipe.id} className="group hover:border-primary/40 hover:shadow-md transition-all">
                    <CardContent className="p-5 flex flex-col gap-4 h-full">
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                      <div className="flex-1">
                        <Badge variant="outline" className="text-xs mb-2">{recipe.useCase}</Badge>
                        <h3 className="font-semibold leading-snug mb-2 group-hover:text-primary transition-colors">
                          {recipe.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{recipe.description}</p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {recipe.tools.map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">{tool}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{recipe.steps} steps</span>
                          <Link to={recipe.href}>
                            <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs group-hover:text-primary pl-0">
                              View recipe <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-3">Need a custom workflow?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Use the AI Workflow Hub to design custom automation pipelines with drag-and-drop node editing.
            </p>
            <Link to="/hubs/ai-workflow">
              <Button className="gap-2"><Zap className="h-4 w-4" /> Open AI Workflow Hub</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
