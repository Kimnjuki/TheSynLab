import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star, CheckCircle2, ArrowRight, ChevronRight, ExternalLink,
  Trophy, Zap, DollarSign,
} from "lucide-react";
import {
  getBestOfTools,
  BEST_OF_LISTS,
  TOOL_CATEGORIES,
} from "@/data/saasTools";

const SCORE_COLOR = (s: number) =>
  s >= 4.2 ? "text-green-600" : s >= 3.8 ? "text-amber-600" : "text-red-500";

const MEDAL = ["🥇", "🥈", "🥉"];

export default function BestToolsRoundup() {
  const { useCase = "" } = useParams<{ useCase: string }>();
  const listMeta = BEST_OF_LISTS[useCase];
  const tools = getBestOfTools(useCase);

  if (!listMeta || tools.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <h1 className="text-2xl font-bold mb-4">List Not Found</h1>
          <Link to="/hub/ai-tools" className="text-primary hover:underline">
            ← Browse all AI tools
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const year = new Date().getFullYear();
  const sorted = [...tools].sort((a, b) => b.trustScore - a.trustScore);
  const winner = sorted[0];

  const canonical = `https://www.thesynlab.com/best/${useCase}`;
  const title = `${listMeta.title} in ${year} — Ranked & Reviewed | TheSynLab`;
  const description = `TheSynLab's definitive ranking of the ${listMeta.title.toLowerCase()} in ${year}. Trust-scored, independently tested, with pricing breakdowns and honest comparisons.`;

  const breadcrumbs = [
    { name: "Home", url: "https://www.thesynlab.com" },
    { name: "AI Tools Hub", url: "https://www.thesynlab.com/hub/ai-tools" },
    { name: listMeta.title, url: canonical },
  ];

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url: canonical,
    numberOfItems: sorted.length,
    itemListElement: sorted.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: `https://www.thesynlab.com/tool/${t.slug}`,
      description: t.shortDescription,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the best ${listMeta.title.replace("Best ", "").toLowerCase()} in ${year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Based on TheSynLab's independent benchmarking, ${winner.name} is the top-rated option with a Trust Score of ${winner.trustScore}/5. ${winner.shortDescription}`,
        },
      },
      {
        "@type": "Question",
        name: `Which ${listMeta.title.replace("Best ", "").toLowerCase()} offer a free plan?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: (() => {
            const free = sorted.filter((t) => t.pricing.hasFree);
            return free.length
              ? `Free plans are available for: ${free.map((t) => t.name).join(", ")}.`
              : `None of the top options offer a completely free plan, but most offer free trials.`;
          })(),
        },
      },
      {
        "@type": "Question",
        name: `How did TheSynLab rank these tools?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `TheSynLab ranks tools using a proprietary Trust Score (1–5) that covers data privacy, encryption standards, terms transparency, ethical AI practices, and integration depth. All scores are independently assigned.`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags title={title} description={description} canonical={canonical} ogType="article" />
      <JsonLd type="BreadcrumbList" breadcrumbs={breadcrumbs} />
      <JsonLd type="ItemList" custom={listSchema} />
      <JsonLd type="FAQPage" custom={faqSchema} />
      <Header />

      {/* ── BREADCRUMB ───────────────────────────────── */}
      <nav className="border-b bg-muted/30 py-2.5 text-sm">
        <div className="container mx-auto flex flex-wrap items-center gap-1.5 px-4 text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/hub/ai-tools" className="hover:text-foreground">AI Tools Hub</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{listMeta.title}</span>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="border-b bg-gradient-to-br from-background to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-amber-500" />
            <Badge variant="secondary">TheSynLab Ranking — {year}</Badge>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {listMeta.title} ({year})
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{listMeta.description}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="text-muted-foreground">
              <strong className="text-foreground">{sorted.length} tools</strong> tested &amp; ranked
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Ranked by TheSynLab Trust Score</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Updated {year}</span>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* ── TOP PICK CALLOUT ─────────────────────────── */}
        <section className="mb-10">
          <Card className="border-2 border-amber-300 bg-amber-50/40 dark:bg-amber-950/20">
            <CardContent className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="text-4xl leading-none">🏆</div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">
                  TheSynLab Top Pick
                </p>
                <h2 className="text-xl font-extrabold">{winner.name}</h2>
                <p className="text-sm text-muted-foreground mt-1">{winner.shortDescription}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm">
                  <span className={`flex items-center gap-1 font-bold ${SCORE_COLOR(winner.trustScore)}`}>
                    <Star className="h-4 w-4 fill-current" />
                    {winner.trustScore}/5 Trust Score
                  </span>
                  <span className="text-muted-foreground">
                    {winner.pricing.hasFree ? "Free plan available" : `From ${winner.pricing.startingPrice}`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link to={`/tool/${winner.slug}`}>
                  <Button>Read Review</Button>
                </Link>
                <a href={winner.officialUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── RANKED LIST ──────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-6 text-2xl font-bold">All {sorted.length} Tools Ranked</h2>
          <div className="space-y-5">
            {sorted.map((tool, i) => (
              <Card key={tool.slug} className="group transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    {/* Rank Medal */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-2xl leading-none">
                        {i < 3 ? MEDAL[i] : `#${i + 1}`}
                      </span>
                      <div className="text-center">
                        <p className={`text-2xl font-extrabold ${SCORE_COLOR(tool.trustScore)}`}>
                          {tool.trustScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">/ 5</p>
                      </div>
                    </div>

                    {/* Tool Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link
                          to={`/tool/${tool.slug}`}
                          className="text-lg font-bold hover:text-primary hover:underline"
                        >
                          {tool.name}
                        </Link>
                        <Badge variant="outline" className="text-xs">{tool.subCategory}</Badge>
                        {tool.pricing.hasFree && (
                          <Badge variant="secondary" className="text-xs">Free plan</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{tool.shortDescription}</p>

                      {/* Key pros */}
                      <ul className="grid gap-1 sm:grid-cols-2 mb-3">
                        {tool.pros.slice(0, 2).map((p) => (
                          <li key={p} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-600" />
                            {p}
                          </li>
                        ))}
                      </ul>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {tool.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <div className="rounded-md border bg-muted/30 p-2 text-center min-w-[100px]">
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="text-sm font-bold">
                          {tool.pricing.hasFree ? "Free" : tool.pricing.startingPrice}
                        </p>
                      </div>
                      <Link to={`/tool/${tool.slug}`}>
                        <Button size="sm" className="w-full gap-1">
                          Review <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link to={`/tool/${tool.slug}/alternatives`}>
                        <Button size="sm" variant="ghost" className="w-full text-xs">
                          Alternatives
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── SCORING METHODOLOGY ──────────────────────── */}
        <section className="mb-10 rounded-xl border bg-muted/30 p-6">
          <h2 className="mb-3 text-lg font-bold">How TheSynLab Scores These Tools</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Every tool in this list is independently benchmarked using TheSynLab's proprietary
            scoring framework — no sponsored rankings, no pay-to-play placements.
          </p>
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            {[
              {
                icon: <Shield className="h-4 w-4 text-primary" />,
                label: "Trust Score (1–5)",
                detail: "Data privacy, encryption, terms transparency, ethical AI",
              },
              {
                icon: <Zap className="h-4 w-4 text-primary" />,
                label: "Integration Score (1–5)",
                detail: "API quality, native integrations, ecosystem fit",
              },
              {
                icon: <DollarSign className="h-4 w-4 text-primary" />,
                label: "Pricing Value",
                detail: "Features-per-dollar compared to direct competitors",
              },
            ].map(({ icon, label, detail }) => (
              <div key={label} className="flex items-start gap-2.5">
                <div className="mt-0.5">{icon}</div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/scoring-hub" className="text-sm text-primary hover:underline">
              Learn about our scoring methodology →
            </Link>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">FAQ</h2>
          <div className="space-y-3">
            {[
              {
                q: `What is the best ${listMeta.title.replace("Best ", "").toLowerCase()} in ${year}?`,
                a: `${winner.name} is TheSynLab's #1 pick with a ${winner.trustScore}/5 Trust Score. ${winner.shortDescription}`,
              },
              {
                q: `Which options offer a free plan?`,
                a: (() => {
                  const free = sorted.filter((t) => t.pricing.hasFree);
                  return free.length
                    ? `${free.map((t) => t.name).join(", ")} all offer free plans.`
                    : `No free plans — but most offer free trials.`;
                })(),
              },
              {
                q: `How does TheSynLab rank these tools?`,
                a: `TheSynLab uses independent Trust Scores based on data privacy, encryption, terms transparency, integration depth, and ethical AI standards. Rankings are not influenced by affiliate relationships.`,
              },
            ].map(({ q, a }) => (
              <Card key={q}>
                <CardContent className="p-4">
                  <p className="font-semibold text-sm mb-1">{q}</p>
                  <p className="text-sm text-muted-foreground">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── EXPLORE MORE ─────────────────────────────── */}
        <section className="mb-6">
          <h2 className="mb-4 text-xl font-bold">Explore More Best-Of Lists</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(BEST_OF_LISTS)
              .filter(([slug]) => slug !== useCase)
              .slice(0, 5)
              .map(([slug, list]) => (
                <Link key={slug} to={`/best/${slug}`}>
                  <Button variant="outline" size="sm">{list.title}</Button>
                </Link>
              ))}
            <Link to="/hub/ai-tools">
              <Button size="sm">All Tool Categories →</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
