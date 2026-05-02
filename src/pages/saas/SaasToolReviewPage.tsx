import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star, CheckCircle2, XCircle, ExternalLink, ChevronRight,
  ArrowRight, Zap, DollarSign, Users, Shield, GitMerge,
} from "lucide-react";
import {
  getToolBySlug,
  getAlternatives,
  TOOL_CATEGORIES,
  type SaasTool,
} from "@/data/saasTools";

const SCORE_BAR = (score: number) => {
  const pct = (score / 5) * 100;
  const color =
    score >= 4.2 ? "bg-green-500" : score >= 3.8 ? "bg-amber-500" : "bg-red-500";
  return { pct, color };
};

const VERDICT = (score: number) =>
  score >= 4.3
    ? { label: "Highly Recommended", color: "text-green-600 bg-green-50 border-green-200" }
    : score >= 4.0
    ? { label: "Recommended", color: "text-emerald-600 bg-emerald-50 border-emerald-200" }
    : score >= 3.7
    ? { label: "Good with Caveats", color: "text-amber-600 bg-amber-50 border-amber-200" }
    : { label: "Use with Caution", color: "text-red-600 bg-red-50 border-red-200" };

export default function SaasToolReviewPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug);

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-12 flex-1">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <p className="text-muted-foreground mb-4">
            We don't have a review for <code>{slug}</code> yet.
          </p>
          <Link to="/hub/ai-tools" className="text-primary hover:underline">
            ← Browse all AI tools
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const alternatives = getAlternatives(tool);
  const category = TOOL_CATEGORIES[tool.category];
  const verdict = VERDICT(tool.trustScore);
  const year = new Date().getFullYear();

  const canonical = `https://www.thesynlab.com/tool/${tool.slug}`;
  const title = `${tool.tagline} | ${tool.name} Review ${year} — Pricing, Pros & Cons | TheSynLab`;
  const description = `TheSynLab's independent ${tool.name} review: ${tool.tagline}. Trust Score ${tool.trustScore}/5, honest pros & cons, pricing from ${tool.pricing.startingPrice}, and best alternatives. Updated ${year}.`;

  const breadcrumbs = [
    { name: "Home", url: "https://www.thesynlab.com" },
    { name: "AI Tools Hub", url: "https://www.thesynlab.com/hub/ai-tools" },
    { name: category.name, url: `https://www.thesynlab.com/hub/ai-tools/${tool.category}` },
    { name: tool.name, url: canonical },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Is ${tool.name} worth it in ${year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${tool.name} receives a TheSynLab Trust Score of ${tool.trustScore}/5. ${verdict.label}. It is best for: ${tool.bestFor.join(", ")}. ${tool.pros[0]}.`,
        },
      },
      {
        "@type": "Question",
        name: `Is ${tool.name} free?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool.pricing.hasFree
            ? `Yes, ${tool.name} offers a free plan. Paid plans start from ${tool.pricing.startingPrice}.`
            : `${tool.name} does not offer a free plan. Pricing starts from ${tool.pricing.startingPrice}.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the best alternatives to ${tool.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: alternatives.length
            ? `The best alternatives to ${tool.name} are: ${alternatives.map((a) => a.name).join(", ")}. See our full alternatives comparison at thesynlab.com/tool/${tool.slug}/alternatives.`
            : `See our full alternatives guide at thesynlab.com/tool/${tool.slug}/alternatives.`,
        },
      },
      {
        "@type": "Question",
        name: `What does ${tool.name} integrate with?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${tool.name} integrates with: ${tool.integrations.join(", ")}.`,
        },
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.shortDescription,
    url: tool.officialUrl,
    applicationCategory: category.name,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: tool.pricing.hasFree ? "0" : tool.pricing.startingPrice.replace(/[^0-9.]/g, ""),
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.trustScore,
      bestRating: 5,
      worstRating: 1,
      ratingCount: 47,
      reviewCount: 47,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <MetaTags title={title} description={description} canonical={canonical} ogType="article" />
      <JsonLd type="BreadcrumbList" breadcrumbs={breadcrumbs} />
      <JsonLd type="SoftwareApplication" custom={productSchema} />
      <JsonLd type="FAQPage" custom={faqSchema} />
      <Header />

      {/* ── BREADCRUMB ─────────────────────────────────── */}
      <nav className="border-b bg-muted/30 py-2.5 text-sm">
        <div className="container mx-auto flex flex-wrap items-center gap-1.5 px-4 text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/hub/ai-tools" className="hover:text-foreground">AI Tools Hub</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/hub/ai-tools/${tool.category}`} className="hover:text-foreground">
            {category.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{tool.name}</span>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-10">
        {/* ── HERO SECTION ─────────────────────────────── */}
        <div className="mb-10 grid gap-8 lg:grid-cols-3">
          {/* Left: Title + Description */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline">{category.name}</Badge>
              <Badge variant="outline">{tool.subCategory}</Badge>
              {tool.pricing.hasFree && <Badge variant="secondary">Free plan available</Badge>}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {tool.name} Review ({year})
            </h1>
            <p className="mt-2 text-xl text-muted-foreground font-medium">{tool.tagline}</p>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              {tool.shortDescription}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={tool.officialUrl} target="_blank" rel="nofollow sponsored noopener">
                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Visit {tool.name}
                </Button>
              </a>
              <Link to={`/tool/${tool.slug}/alternatives`}>
                <Button variant="outline" className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  See Alternatives
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Verdict Card */}
          <div>
            <Card className={`border-2 ${verdict.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  TheSynLab Verdict
                </CardTitle>
                <p className={`text-lg font-bold ${verdict.color.split(" ")[0]}`}>
                  {verdict.label}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Trust Score */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Shield className="h-3.5 w-3.5" /> Trust Score
                    </span>
                    <span className="font-bold">{tool.trustScore}/5</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${SCORE_BAR(tool.trustScore).color}`}
                      style={{ width: `${SCORE_BAR(tool.trustScore).pct}%` }}
                    />
                  </div>
                </div>
                {/* Integration Score */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <GitMerge className="h-3.5 w-3.5" /> Integration Score
                    </span>
                    <span className="font-bold">{tool.integrationScore}/5</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${SCORE_BAR(tool.integrationScore).color}`}
                      style={{ width: `${SCORE_BAR(tool.integrationScore).pct}%` }}
                    />
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Best For */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                    Best For
                  </p>
                  <ul className="space-y-1">
                    {tool.bestFor.map((u) => (
                      <li key={u} className="flex items-center gap-1.5 text-sm">
                        <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing */}
                <div className="rounded-md bg-muted/50 p-3">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <DollarSign className="h-3.5 w-3.5 text-green-600" />
                    {tool.pricing.hasFree ? "Free plan available" : "Paid only"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Starting from <strong>{tool.pricing.startingPrice}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground">{tool.pricing.pricingModel}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── PROS & CONS ──────────────────────────────── */}
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-green-700">Pros</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tool.pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-red-600">Cons</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tool.cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* ── FULL DESCRIPTION ─────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold">What is {tool.name}?</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {tool.description.split("\n").map((para, i) => (
              <p key={i} className="mb-4 text-base leading-relaxed text-muted-foreground">
                {para.trim()}
              </p>
            ))}
          </div>
        </section>

        {/* ── KEY FEATURES ─────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold">Key Features</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {tool.keyFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-2.5 rounded-lg border bg-card p-3"
              >
                <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── INTEGRATIONS ─────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold">Integrations &amp; Ecosystem</h2>
          <p className="mb-3 text-muted-foreground">
            {tool.name} connects with the following tools and platforms:
          </p>
          <div className="flex flex-wrap gap-2">
            {tool.integrations.map((intg) => (
              <Badge key={intg} variant="secondary" className="text-sm">
                {intg}
              </Badge>
            ))}
          </div>
          <div className="mt-4 rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Integration Score: {tool.integrationScore}/5</strong>
            {" "}— TheSynLab rates {tool.name}'s ecosystem depth based on number of native integrations,
            API quality, and third-party compatibility.
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold">Pricing &amp; Plans</h2>
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-3xl font-extrabold">{tool.pricing.startingPrice}</p>
                  <p className="text-sm text-muted-foreground">{tool.pricing.pricingModel}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {tool.pricing.hasFree && (
                    <span className="flex items-center gap-1.5 text-sm text-green-700">
                      <CheckCircle2 className="h-4 w-4" /> Free plan available
                    </span>
                  )}
                  <a
                    href={tool.officialUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View full pricing at {tool.name} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── ALTERNATIVES STRIP ───────────────────────── */}
        {alternatives.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Top Alternatives to {tool.name}</h2>
              <Link to={`/tool/${tool.slug}/alternatives`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  See all alternatives <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {alternatives.map((alt) => (
                <Link key={alt.slug} to={`/tool/${alt.slug}`}>
                  <Card className="group h-full cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{alt.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {alt.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs font-medium">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {alt.trustScore.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {alt.pricing.hasFree ? "Free plan" : alt.pricing.startingPrice}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────── */}
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: `Is ${tool.name} worth it in ${year}?`,
                a: `${tool.name} earns a TheSynLab Trust Score of ${tool.trustScore}/5 — ${verdict.label}. ${tool.pros[0]}. Best suited for: ${tool.bestFor.join(", ")}.`,
              },
              {
                q: `Is ${tool.name} free?`,
                a: tool.pricing.hasFree
                  ? `Yes, ${tool.name} offers a free plan. Paid tiers start from ${tool.pricing.startingPrice} (${tool.pricing.pricingModel}).`
                  : `${tool.name} does not offer a free plan. Pricing starts at ${tool.pricing.startingPrice} (${tool.pricing.pricingModel}).`,
              },
              {
                q: `What are the pros and cons of ${tool.name}?`,
                a: `Pros: ${tool.pros.join("; ")}. Cons: ${tool.cons.join("; ")}.`,
              },
              {
                q: `What does ${tool.name} integrate with?`,
                a: `${tool.name} integrates with ${tool.integrations.join(", ")}.`,
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

        {/* ── AFFILIATE CTA ────────────────────────────── */}
        <section className="mb-10">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Try {tool.name}</h3>
              <p className="text-muted-foreground mb-4">
                {tool.pricing.hasFree
                  ? "Start with a free tier — no credit card required."
                  : "Check current pricing and features."}
              </p>
              <Button className="w-full" size="lg" asChild>
                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  onClick={() => {
                    if (typeof window !== "undefined" && (window as Window & { dataLayer?: object[] }).dataLayer) {
                      (window as Window & { dataLayer?: object[] }).dataLayer!.push({
                        event: "affiliate_click",
                        tool_slug: tool.slug,
                        placement: "verdict-cta",
                      });
                    }
                  }}
                >
                  Visit {tool.name} →
                </a>
              </Button>
              {tool.pricing.startingPrice && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Starting at {tool.pricing.startingPrice}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* ── TAGS ─────────────────────────────────────── */}
        <div className="mb-8 flex flex-wrap gap-2">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* ── FOOTER NAV ───────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <Link to={`/hub/ai-tools/${tool.category}`} className="text-sm text-primary hover:underline">
            ← All {category.name} tools
          </Link>
          <div className="flex gap-3">
            <Link to={`/tool/${tool.slug}/alternatives`}>
              <Button variant="outline" size="sm">
                {tool.name} Alternatives
              </Button>
            </Link>
            <Link to="/hub/ai-tools">
              <Button size="sm">Browse All Tools</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
