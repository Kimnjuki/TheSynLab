import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Sparkles,
  DollarSign,
  ShieldAlert,
  Layers,
  Award,
  BarChart3,
  ArrowRight,
  GitCompare,
  Puzzle,
  LayoutDashboard,
  Trophy,
  Search,
  Calculator,
  TrendingUp,
} from "lucide-react";

const newTools = [
  { title: "Stack Quiz", href: "/stack-quiz", description: "Answer 6 questions and get your personalized product stack + SynLabScorecard.", icon: <Sparkles className="h-5 w-5" />, badge: "New" },
  { title: "TCO Calculator", href: "/tco-calculator", description: "Compare total cost of ownership across up to 3 tools side-by-side.", icon: <DollarSign className="h-5 w-5" />, badge: "New" },
  { title: "Vendor Risk Checker", href: "/vendor-risk-checker", description: "Assess lock-in risk, data portability, and find safer alternatives.", icon: <ShieldAlert className="h-5 w-5" />, badge: "New" },
  { title: "Workflow Blueprint", href: "/workflow-blueprint", description: "Get a step-by-step automation blueprint tailored to your role and stack.", icon: <Layers className="h-5 w-5" />, badge: "New" },
  { title: "Trust Index", href: "/trust-index", description: "Leaderboard of tools ranked by Trust Score & Integration Score.", icon: <Award className="h-5 w-5" />, badge: "New" },
  { title: "My Stack Dashboard", href: "/my-stack", description: "Save tools, run risk checks, and estimate monthly costs.", icon: <BarChart3 className="h-5 w-5" />, badge: "New" },
];

const legacyTools = [
  { title: "Compare Engine", href: "/tools/compare", description: "Compare products side by side.", icon: <GitCompare className="h-5 w-5" /> },
  { title: "Compatibility Checker", href: "/tools/compatibility-checker", description: "Check ecosystem support.", icon: <Puzzle className="h-5 w-5" /> },
  { title: "Hub Builder", href: "/tools/hub-builder", description: "Build a multi-device canvas and save to your profile.", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "Compatibility Leaderboard", href: "/tools/compatibility-leaderboard", description: "Rankings by ecosystem breadth and verification.", icon: <Trophy className="h-5 w-5" /> },
  { title: "AI Product Finder", href: "/tools/find", description: "Natural language search over the catalog with scores.", icon: <Search className="h-5 w-5" /> },
  { title: "Budget Calculator", href: "/tools/budget-calculator", description: "Estimate spend and trade-offs.", icon: <Calculator className="h-5 w-5" /> },
  { title: "ROI Calculator", href: "/tools/roi-calculator", description: "Project ROI and payback period.", icon: <TrendingUp className="h-5 w-5" /> },
];

export default function ToolsHub() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MetaTags
        title="Interactive Tools — TheSynLab"
        description="Interactive tools for stack discovery, TCO comparison, vendor risk assessment, workflow automation, and product comparison."
        canonical="/tools"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold">Interactive Tools</h1>
          <p className="mt-2 text-muted-foreground">
            Discover, compare, assess, and optimize your tech stack
          </p>
        </div>

        {/* New tools section */}
        <h2 className="mb-4 text-xl font-semibold">What's New</h2>
        <div className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {newTools.map((tool) => (
            <Link key={tool.href} to={tool.href} className="">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {tool.icon}
                    </div>
                    {tool.badge && (
                      <Badge variant="secondary" className="text-[10px]">{tool.badge}</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-3 text-base">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Legacy tools section */}
        <h2 className="mb-4 text-xl font-semibold">More Tools</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {legacyTools.map((tool) => (
            <Link key={tool.href} to={tool.href} className="">
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {tool.icon}
                  </div>
                  <CardTitle className="mt-3 text-base">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  <div className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
