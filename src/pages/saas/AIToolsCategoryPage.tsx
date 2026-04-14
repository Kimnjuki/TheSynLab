import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ExternalLink, ArrowRight, ChevronRight } from "lucide-react";
import {
  saasTools,
  TOOL_CATEGORIES,
  type ToolCategory,
} from "@/data/saasTools";

const SCORE_COLOR = (score: number) =>
  score >= 4.2 ? "text-green-600" : score >= 3.8 ? "text-amber-600" : "text-red-500";

export default function AIToolsCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const cat = TOOL_CATEGORIES[category as ToolCategory];
  const tools = saasTools.filter((t) => t.category === (category as ToolCategory));

  if (!cat || tools.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <Link to="/hub/ai-tools" className="text-primary hover:underline">
            ← Back to AI Tools Hub
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const canonical = `https://www.thesynlab.com/hub/ai-tools/${category}`;
  const title = `${cat.name} — ${tools.length} Tools Reviewed & Compared | TheSynLab`;
  const description = `Independent reviews of ${tools.length} ${cat.name.toLowerCase()} tools. Trust Scores, pricing breakdowns, and curated alternatives — updated ${new Date().getFullYear()}.`;

  const topTools = [...tools].sort((a, b) => b.trustScore - a.trustScore).slice(0, 3);

  const breadcrumbs = [
    { name: "Home", url: "https://www.thesynlab.com" },
    { name: "AI Tools Hub", url: "https://www.thesynlab.com/hub/ai-tools" },
    { name: cat.name, url: canonical },
  ];

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url: canonical,
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `https://www.thesynlab.com/tool/${t.slug}`,
      description: t.shortDescription,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags title={title} description={description} canonical={canonical} ogType="website" />
      <JsonLd type="BreadcrumbList" breadcrumbs={breadcrumbs} />
      <JsonLd type="WebPage" custom={listSchema} />
      <Header />

      {/* ── BREADCRUMB ───────────────────────────────────── */}
      <nav className="border-b bg-muted/30 py-2.5 text-sm">
        <div className="container mx-auto flex items-center gap-1.5 px-4 text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/hub/ai-tools" className="hover:text-foreground">AI Tools Hub</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{cat.name}</span>
        </div>
      </nav>

      {/* ── HEADER ───────────────────────────────────────── */}
      <section className="border-b bg-gradient-to-br from-background to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-extrabold tracking-tight">{cat.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{cat.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{tools.length} tools reviewed</span>
            <span>·</span>
            <span>Ranked by TheSynLab Trust Score</span>
            <span>·</span>
            <span>Updated {new Date().getFullYear()}</span>
          </div>
        </div>
      </section>

      {/* ── TOP 3 ────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="mb-6 text-xl font-bold">Top Rated {cat.name} Tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {topTools.map((tool, i) => (
            <Link key={tool.slug} to={`/tool/${tool.slug}`}>
              <Card className="group h-full cursor-pointer border-2 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      #{i + 1}
                    </span>
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {tool.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`flex items-center gap-1 font-semibold ${SCORE_COLOR(tool.trustScore)}`}>
                      <Star className="h-4 w-4 fill-current" />
                      {tool.trustScore.toFixed(1)} / 5
                    </span>
                    <Badge variant={tool.pricing.hasFree ? "secondary" : "outline"} className="text-xs">
                      {tool.pricing.hasFree ? "Free plan" : tool.pricing.startingPrice}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FULL TOOL LIST ───────────────────────────────── */}
      <section className="border-t bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-xl font-bold">All {cat.name} Tools ({tools.length})</h2>
          <div className="space-y-3">
            {[...tools]
              .sort((a, b) => b.trustScore - a.trustScore)
              .map((tool) => (
                <Card key={tool.slug} className="group transition-shadow hover:shadow-sm">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link
                          to={`/tool/${tool.slug}`}
                          className="font-semibold hover:text-primary hover:underline"
                        >
                          {tool.name}
                        </Link>
                        <Badge variant="outline" className="text-xs">{tool.subCategory}</Badge>
                        {tool.pricing.hasFree && (
                          <Badge variant="secondary" className="text-xs">Free plan</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {tool.shortDescription}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {tool.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className={`text-lg font-bold ${SCORE_COLOR(tool.trustScore)}`}>
                          {tool.trustScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Trust</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-foreground">
                          {tool.integrationScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Integration</p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/tool/${tool.slug}`}>
                          <Button size="sm" variant="outline" className="gap-1">
                            Review <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link to={`/tool/${tool.slug}/alternatives`}>
                          <Button size="sm" variant="ghost" className="text-xs">
                            Alts
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SCHEMA ───────────────────────────────────── */}
      <JsonLd
        type="WebPage"
        custom={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: `What are the best ${cat.name.toLowerCase()} tools in ${new Date().getFullYear()}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `Based on TheSynLab's independent benchmarking, the top ${cat.name.toLowerCase()} tools are ${topTools.map((t) => t.name).join(", ")}. Each is rated by Trust Score, integration depth, and pricing value.`,
              },
            },
            {
              "@type": "Question",
              name: `Which ${cat.name.toLowerCase()} tools have a free plan?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `Free plans are available for: ${tools.filter((t) => t.pricing.hasFree).map((t) => t.name).join(", ")}.`,
              },
            },
          ],
        }}
      />

      {/* ── BACK + CTA ───────────────────────────────────── */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/hub/ai-tools" className="flex items-center gap-1 text-sm text-primary hover:underline">
            ← Back to AI Tools Hub
          </Link>
          <div className="flex gap-3">
            <Link to="/tools/compare">
              <Button variant="outline" size="sm">Compare Tools</Button>
            </Link>
            <Link to="/tools/stack-builder">
              <Button size="sm">Build Your Stack</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
