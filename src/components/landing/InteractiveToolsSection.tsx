import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  DollarSign,
  ShieldAlert,
  Layers,
  Award,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const tools = [
  { title: "Stack Quiz", href: "/stack-quiz", description: "Get personalized product recs in 60 seconds", icon: <Sparkles className="h-5 w-5" /> },
  { title: "TCO Calculator", href: "/tco-calculator", description: "Compare costs across tools side-by-side", icon: <DollarSign className="h-5 w-5" /> },
  { title: "Vendor Risk Checker", href: "/vendor-risk-checker", description: "Assess lock-in & data portability risk", icon: <ShieldAlert className="h-5 w-5" /> },
  { title: "Workflow Blueprint", href: "/workflow-blueprint", description: "Your custom automation blueprint", icon: <Layers className="h-5 w-5" /> },
  { title: "Trust Index", href: "/trust-index", description: "Leaderboard by Trust Score", icon: <Award className="h-5 w-5" /> },
  { title: "My Stack", href: "/my-stack", description: "Save & analyze your tool stack", icon: <BarChart3 className="h-5 w-5" /> },
];

export function InteractiveToolsSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2">Interactive Tools</Badge>
          <h2 className="text-2xl font-bold">Smart Tools for Smarter Decisions</h2>
          <p className="mt-2 text-muted-foreground">
            From stack discovery to vendor risk — interactive tools to optimize your tech stack
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.href} to={tool.href}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-medium">{tool.title}</h3>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Button variant="outline" asChild>
            <Link to="/tools">
              View All Tools <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
