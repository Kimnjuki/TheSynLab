import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star, CheckCircle2, XCircle, ArrowRight, ChevronRight, ExternalLink,
  Shield, GitMerge, DollarSign,
} from "lucide-react";
import {
  getToolBySlug,
  getAlternatives,
  saasTools,
  TOOL_CATEGORIES,
} from "@/data/saasTools";

const SCORE_COLOR = (s: number) =>
  s >= 4.2 ? "text-green-600" : s >= 3.8 ? "text-amber-600" : "text-red-500";

export default function ToolAlternativesPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <Link to="/hub/ai-tools" className="text-primary hover:underline">
            ← Browse all AI tools
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const directAlts = getAlternatives(tool);
  // Also pull same-category tools not already listed
  const categoryAlts = saasTools
    .filter(
      (t) =>
        t.category === tool.category &&
        t.slug !== tool.slug &&
        !directAlts.find((a) => a.slug === t.slug)
    )
    .slice(0, 4);

  const allAlts = [...directAlts, ...categoryAlts];
  const year = new Date().getFullYear();
  const category = TOOL_CATEGORIES[tool.category];

  const canonical = `https://www.thesynlab.com/tool/${tool.slug}/alternatives`;
  const title = `Best ${tool.name} Alternatives in ${year} — Ranked by TheSynLab`;
  const description = `Looking for ${tool.name} alternatives? We compared ${allAlts.length}+ options on Trust Score, pricing, and features so you don't have to. Updated ${year}.`;

  const breadcrumbs = [
    { name: "Home", url: "https://www.thesynlab.com" },
    { name: "AI Tools Hub", url: "https://www.thesynlab.com/hub/ai-tools" },
    { name: category.name, url: `https://www.thesynlab.com/hub/ai-tools/${tool.category}` },
    { name: tool.name, url: `https://www.thesynlab.com/tool/${tool.slug}` },
    { name: "Alternatives", url: canonical },
  ];

  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description,
    url: canonical,
    numberOfItems: allAlts.length,
    itemListElement: allAlts.map((alt, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: alt.name,
      url: `https://www.thesynlab.com/tool/${alt.slug}`,
      description: alt.shortDescription,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the best alternative to ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: directAlts[0]
            ? `${directAlts[0].name} is TheSynLab's top-rated alternative to ${tool.name} with a Trust Score of ${directAlts[0].trustScore}/5. ${directAlts[0].shortDescription}`
            : `Browse our full list of ${tool.name} alternatives at thesynlab.com/tool/${tool.slug}/alternatives.`,
        },
      },
      {
        "@type": "Question",
        name: `Is there a free alternative to ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: (() => {
            const freeAlts = allAlts.filter((a) => a.pricing.hasFree);
            return freeAlts.length
              ? `Yes. Free alternatives to ${tool.name} include: ${freeAlts.map((a) => a.name).join(", ")}.`
              : `Most ${tool.name} alternatives are also paid tools. Check individual reviews for trial options.`;
          })(),
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

      {/* ── BREADCRUMB ─────────────────────────────────── */}
      <nav className="border-b bg-muted/30 py-2.5 text-sm">
        <div className="container mx-auto flex flex-wrap items-center gap-1.5 px-4 text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/hub/ai-tools" className="hover:text-foreground">AI Tools Hub</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/tool/${tool.slug}`} className="hover:text-foreground">{tool.name}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">Alternatives</span>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-10">
        {/* ── HEADER ───────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Best {tool.name} Alternatives ({year})
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            We tested and ranked {allAlts.length} alternatives to {tool.name} — scored on trust,
            integrations, pricing, and real-world usability.
          </p>
        </div>

        {/* ── QUICK COMPARISON TABLE ───────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">Quick Comparison</h2>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3 font-semibold">Tool</th>
                  <th className="px-4 py-3 font-semibold text-center">Trust Score</th>
                  <th className="px-4 py-3 font-semibold text-center">Integration</th>
                  <th className="px-4 py-3 font-semibold">Starting Price</th>
                  <th className="px-4 py-3 font-semibold">Best For</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {/* Current tool row */}
                <tr className="border-b bg-primary/5 font-medium">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2">
                      {tool.name}
                      <Badge variant="secondary" className="text-xs">Current</Badge>
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-center font-bold ${SCORE_COLOR(tool.trustScore)}`}>
                    {tool.trustScore.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 text-center">{tool.integrationScore.toFixed(1)}</td>
                  <td className="px-4 py-3">{tool.pricing.startingPrice}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tool.bestFor[0]}</td>
                  <td className="px-4 py-3">
                    <Link to={`/tool/${tool.slug}`} className="text-primary hover:underline text-xs">
                      Review
                    </Link>
                  </td>
                </tr>
                {/* Alternatives */}
                {allAlts.map((alt) => (
                  <tr key={alt.slug} className="border-b transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">
                      <Link to={`/tool/${alt.slug}`} className="hover:text-primary hover:underline">
                        {alt.name}
                      </Link>
                    </td>
                    <td className={`px-4 py-3 text-center font-bold ${SCORE_COLOR(alt.trustScore)}`}>
                      {alt.trustScore.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-center">{alt.integrationScore.toFixed(1)}</td>
                    <td className="px-4 py-3">
                      {alt.pricing.hasFree ? (
                        <span className="text-green-700 font-medium">Free plan</span>
                      ) : (
                        alt.pricing.startingPrice
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{alt.bestFor[0]}</td>
                    <td className="px-4 py-3">
                      <Link to={`/tool/${alt.slug}`} className="text-primary hover:underline text-xs">
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── DETAILED ALTERNATIVE CARDS ───────────────── */}
        <section className="mb-10">
          <h2 className="mb-6 text-xl font-bold">
            Detailed {tool.name} Alternative Reviews
          </h2>
          <div className="space-y-6">
            {allAlts.map((alt, i) => (
              <Card key={alt.slug} className="overflow-hidden">
                <CardHeader className="bg-muted/20 pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>
                        <CardTitle className="text-lg">
                          <Link to={`/tool/${alt.slug}`} className="hover:text-primary hover:underline">
                            {alt.name}
                          </Link>
                        </CardTitle>
                        {alt.pricing.hasFree && (
                          <Badge variant="secondary" className="text-xs">Free plan</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{alt.tagline}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className={`text-xl font-extrabold ${SCORE_COLOR(alt.trustScore)}`}>
                          {alt.trustScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Trust</p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/tool/${alt.slug}`}>
                          <Button size="sm">Read Review</Button>
                        </Link>
                        <a href={alt.officialUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">{alt.shortDescription}</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Pros vs {tool.name}
                      </p>
                      <ul className="space-y-1">
                        {alt.pros.slice(0, 2).map((p) => (
                          <li key={p} className="flex items-start gap-1.5 text-xs text-green-700">
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Cons vs {tool.name}
                      </p>
                      <ul className="space-y-1">
                        {alt.cons.slice(0, 2).map((c) => (
                          <li key={c} className="flex items-start gap-1.5 text-xs text-red-600">
                            <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                        Pricing
                      </p>
                      <p className="text-sm font-medium">{alt.pricing.startingPrice}</p>
                      <p className="text-xs text-muted-foreground">{alt.pricing.pricingModel}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── DECISION GUIDE ───────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">
            When to Stay with {tool.name} vs. Switch
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-green-700">
                  Stay with {tool.name} if…
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.pros.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-green-800">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-amber-700">
                  Consider switching if…
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tool.cons.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-amber-800">
                      <ArrowRight className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold">FAQ — {tool.name} Alternatives</h2>
          <div className="space-y-3">
            {[
              {
                q: `What is the best alternative to ${tool.name}?`,
                a: directAlts[0]
                  ? `${directAlts[0].name} is our top pick with a Trust Score of ${directAlts[0].trustScore}/5. ${directAlts[0].shortDescription}`
                  : `See the full list above for ranked alternatives.`,
              },
              {
                q: `Is there a free alternative to ${tool.name}?`,
                a: (() => {
                  const freeAlts = allAlts.filter((a) => a.pricing.hasFree);
                  return freeAlts.length
                    ? `Yes: ${freeAlts.map((a) => a.name).join(", ")} all offer free plans.`
                    : `Most alternatives are paid. See pricing column above for details.`;
                })(),
              },
              {
                q: `Which ${tool.name} alternative has the best integrations?`,
                a: (() => {
                  const best = [...allAlts].sort((a, b) => b.integrationScore - a.integrationScore)[0];
                  return best
                    ? `${best.name} scores highest on integrations with a ${best.integrationScore}/5 Integration Score.`
                    : `See the comparison table above for integration scores.`;
                })(),
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

        {/* ── FOOTER NAV ───────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <Link to={`/tool/${tool.slug}`} className="text-sm text-primary hover:underline">
            ← {tool.name} Full Review
          </Link>
          <div className="flex gap-3">
            <Link to={`/hub/ai-tools/${tool.category}`}>
              <Button variant="outline" size="sm">All {category.name}</Button>
            </Link>
            <Link to="/tools/compare">
              <Button size="sm">Compare Tools</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
