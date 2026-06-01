import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SlidersHorizontal,
  Grid3X3,
  List,
} from "lucide-react";

interface ToolItem {
  title: string;
  href: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  category?: "discovery" | "comparison" | "risk" | "planning" | "tracking";
  trustedScore?: 1 | 2 | 3;
}

const allTools: ToolItem[] = [
  { title: "Stack Quiz", href: "/stack-quiz", description: "Answer 6 questions and get your personalized product stack + SynLabScorecard.", icon: <Sparkles className="h-5 w-5" />, badge: "New", category: "discovery", trustedScore: 3 },
  { title: "TCO Calculator", href: "/tco-calculator", description: "Compare total cost of ownership across up to 3 tools side-by-side.", icon: <DollarSign className="h-5 w-5" />, badge: "New", category: "comparison", trustedScore: 3 },
  { title: "Vendor Risk Checker", href: "/vendor-risk-checker", description: "Assess lock-in risk, data portability, and find safer alternatives.", icon: <ShieldAlert className="h-5 w-5" />, badge: "New", category: "risk", trustedScore: 3 },
  { title: "Workflow Blueprint", href: "/workflow-blueprint", description: "Get a step-by-step automation blueprint tailored to your role and stack.", icon: <Layers className="h-5 w-5" />, badge: "New", category: "planning", trustedScore: 2 },
  { title: "Trust Index", href: "/trust-index", description: "Leaderboard of tools ranked by Trust Score & Integration Score.", icon: <Award className="h-5 w-5" />, badge: "New", category: "tracking", trustedScore: 3 },
  { title: "My Stack Dashboard", href: "/my-stack", description: "Save tools, run risk checks, and estimate monthly costs.", icon: <BarChart3 className="h-5 w-5" />, badge: "New", category: "tracking", trustedScore: 2 },
  { title: "Compare Engine", href: "/tools/compare", description: "Compare products side by side.", icon: <GitCompare className="h-5 w-5" />, category: "comparison", trustedScore: 2 },
  { title: "Compatibility Checker", href: "/tools/compatibility-checker", description: "Check ecosystem support.", icon: <Puzzle className="h-5 w-5" />, category: "discovery", trustedScore: 2 },
  { title: "Hub Builder", href: "/tools/hub-builder", description: "Build a multi-device canvas and save to your profile.", icon: <LayoutDashboard className="h-5 w-5" />, category: "planning", trustedScore: 1 },
  { title: "Compatibility Leaderboard", href: "/tools/compatibility-leaderboard", description: "Rankings by ecosystem breadth and verification.", icon: <Trophy className="h-5 w-5" />, category: "tracking", trustedScore: 1 },
  { title: "AI Product Finder", href: "/tools/find", description: "Natural language search over the catalog with scores.", icon: <Search className="h-5 w-5" />, category: "discovery", trustedScore: 1 },
  { title: "Budget Calculator", href: "/tools/budget-calculator", description: "Estimate spend and trade-offs.", icon: <Calculator className="h-5 w-5" />, category: "planning", trustedScore: 2 },
  { title: "ROI Calculator", href: "/tools/roi-calculator", description: "Project ROI and payback period.", icon: <TrendingUp className="h-5 w-5" />, category: "planning", trustedScore: 2 },
];

const categories = [
  { value: "all", label: "All Tools" },
  { value: "discovery", label: "Discovery" },
  { value: "comparison", label: "Comparison" },
  { value: "risk", label: "Risk Assessment" },
  { value: "planning", label: "Planning" },
  { value: "tracking", label: "Tracking" },
] as const;

export default function ToolsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"default" | "name" | "trusted">("default");

  const filtered = allTools
    .filter((tool) => {
      if (activeCategory !== "all" && tool.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return tool.title.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      if (sortBy === "trusted") return (b.trustedScore || 0) - (a.trustedScore || 0);
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MetaTags
        title="Free SaaS Decision Tools: Compare, Calculate & Choose Smarter — TheSynLab"
        description="Interactive tools to compare vendors, calculate TCO, assess risk, and discover your ideal software stack. TCO Calculator, Stack Quiz, Vendor Risk Checker, and more — all free, all data-backed."
        canonical="/tools"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Interactive Tools</h1>
          <p className="mt-2 text-muted-foreground">Discover, compare, assess, and optimize your tech stack</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools, comparisons, guides…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "default" | "name" | "trusted")}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs"
            >
              <option value="default">Newest</option>
              <option value="name">Name A-Z</option>
              <option value="trusted">Trusted first</option>
            </select>
            <div className="flex border rounded-md">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">{filtered.length} tool{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Tools Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <Link key={tool.href} to={tool.href}>
                <Card className="h-full transition-colors hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {tool.icon}
                      </div>
                      <div className="flex gap-1">
                        {tool.badge && <Badge variant="secondary" className="text-[10px]">{tool.badge}</Badge>}
                        {tool.trustedScore === 3 && (
                          <Badge variant="outline" className="text-[10px] text-green-600 border-green-300">Lab Verified</Badge>
                        )}
                      </div>
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
        ) : (
          <div className="space-y-3">
            {filtered.map((tool) => (
              <Link key={tool.href} to={tool.href}>
                <div className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{tool.title}</p>
                      {tool.badge && <Badge variant="secondary" className="text-[10px] shrink-0">{tool.badge}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No tools match your search.</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
