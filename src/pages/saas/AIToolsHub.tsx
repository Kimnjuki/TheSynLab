import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PenLine, Video, Palette, Share2, Code2, Zap, HeadphonesIcon,
  ArrowRight, TrendingUp, Star, Search,
} from "lucide-react";
import {
  saasTools,
  TOOL_CATEGORIES,
  BEST_OF_LISTS,
  type ToolCategory,
} from "@/data/saasTools";

const CATEGORY_ICONS: Record<ToolCategory, React.ElementType> = {
  "content-ai": PenLine,
  "video-audio": Video,
  design: Palette,
  "social-marketing": Share2,
  "dev-infra": Code2,
  productivity: Zap,
  "sales-support": HeadphonesIcon,
};

const CATEGORY_COLORS: Record<ToolCategory, string> = {
  "content-ai": "from-violet-500 to-purple-600",
  "video-audio": "from-red-500 to-rose-600",
  design: "from-pink-500 to-fuchsia-600",
  "social-marketing": "from-blue-500 to-cyan-600",
  "dev-infra": "from-emerald-500 to-green-600",
  productivity: "from-amber-500 to-orange-600",
  "sales-support": "from-sky-500 to-indigo-600",
};

const SCORE_COLOR = (score: number) =>
  score >= 4.2 ? "text-green-600" : score >= 3.8 ? "text-amber-600" : "text-red-500";

export default function AIToolsHub() {
  const featured = saasTools.filter((t) => t.kd <= 65 && t.volume >= 4400).slice(0, 8);
  const categories = Object.entries(TOOL_CATEGORIES) as [ToolCategory, (typeof TOOL_CATEGORIES)[ToolCategory]][];

  const canonical = "https://www.thesynlab.com/hub/ai-tools";
  const title = "AI & SaaS Tools Hub — Reviews, Comparisons & Alternatives | TheSynLab";
  const description =
    "Independent reviews, side-by-side comparisons, and curated alternatives for 80+ AI and SaaS tools. Trust-scored by TheSynLab so you choose the right tool faster.";

  const breadcrumbs = [
    { name: "Home", url: "https://www.thesynlab.com" },
    { name: "AI Tools Hub", url: canonical },
  ];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: canonical,
    publisher: {
      "@type": "Organization",
      name: "TheSynLab",
      url: "https://www.thesynlab.com",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags title={title} description={description} canonical={canonical} ogType="website" />
      <JsonLd type="BreadcrumbList" breadcrumbs={breadcrumbs} />
      <JsonLd type="WebPage" custom={webPageSchema} />
      <Header />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <TrendingUp className="h-3 w-3" />
            Competing with G2 &amp; Product Hunt
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            The AI &amp; SaaS Tools Hub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Honest, benchmarked reviews of 80+ AI and SaaS tools — with Trust Scores, side-by-side
            comparisons, and curated alternatives to help you build a smarter stack.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/hub/ai-tools/content-ai">
              <Button size="lg" className="gap-2">
                <PenLine className="h-4 w-4" /> AI Writing Tools
              </Button>
            </Link>
            <Link to="/hub/ai-tools/dev-infra">
              <Button size="lg" variant="outline" className="gap-2">
                <Code2 className="h-4 w-4" /> Dev &amp; Infra
              </Button>
            </Link>
            <Link to="/tools/compare">
              <Button size="lg" variant="ghost" className="gap-2">
                <Search className="h-4 w-4" /> Compare Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID ────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Browse by Category</h2>
        <p className="mb-8 text-muted-foreground">
          {saasTools.length} tools reviewed across {categories.length} categories.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map(([slug, cat]) => {
            const Icon = CATEGORY_ICONS[slug];
            const count = saasTools.filter((t) => t.category === slug).length;
            return (
              <Link key={slug} to={`/hub/ai-tools/${slug}`}>
                <Card className="group h-full cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${CATEGORY_COLORS[slug]} text-white shadow`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="mt-2 text-base">{cat.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                    <p className="mt-3 text-xs font-medium text-primary">
                      {count} tools reviewed →
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED TOOLS ───────────────────────────────────── */}
      <section className="border-t bg-muted/30 py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Tool Reviews</h2>
              <p className="text-muted-foreground">Top picks by TheSynLab Trust Score</p>
            </div>
            <Link to="/hub/ai-tools/productivity">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tool) => (
              <Link key={tool.slug} to={`/tool/${tool.slug}`}>
                <Card className="group h-full cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-semibold leading-snug">
                        {tool.name}
                      </CardTitle>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {tool.category.replace("-", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {tool.shortDescription}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs font-medium">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className={SCORE_COLOR(tool.trustScore)}>
                          {tool.trustScore.toFixed(1)}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {tool.pricing.hasFree ? "Free plan" : "Paid from " + tool.pricing.startingPrice}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST-OF ROUNDUPS ─────────────────────────────────── */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">Best-Of Roundups</h2>
        <p className="mb-8 text-muted-foreground">
          Curated shortlists by use case — ranked by TheSynLab Trust Score.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(BEST_OF_LISTS).map(([slug, list]) => (
            <Link key={slug} to={`/best/${slug}`}>
              <Card className="group h-full cursor-pointer border-dashed transition-all duration-200 hover:border-primary hover:shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">{list.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground">{list.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {list.toolSlugs.slice(0, 4).map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">
                        {s.replace(/-/g, " ")}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="border-t bg-gradient-to-r from-primary/10 to-secondary/10 py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold">Build your verified tool stack</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Every tool on TheSynLab is benchmarked for trust, privacy, and integration depth.
            Compare any two tools or let our Stack Builder find the right combination for your workflow.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/tools/stack-builder">
              <Button className="gap-2">
                <Zap className="h-4 w-4" /> Open Stack Builder
              </Button>
            </Link>
            <Link to="/tools/compare">
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" /> Compare Two Tools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
