import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Shield, GitMerge, DollarSign, Scale, Puzzle, FlaskConical,
  RefreshCw, FileText, Award, CheckCircle2, ArrowRight, Eye,
} from "lucide-react";

const SITE = "https://thesynlab.com";
const year = new Date().getFullYear();

/**
 * Score weights — kept in sync with src/components/Methodology.tsx and
 * src/components/scoring/ScoringMethodologyDocs.tsx (the canonical component
 * breakdowns). This page explains them in prose for humans and AI crawlers.
 */
const SCORES = [
  {
    icon: Shield,
    name: "Trust Score",
    scale: "0–100 (shown as x.x/5 on tool reviews)",
    question: "Can I depend on this vendor with my data and my business?",
    measures: [
      "Data privacy practices (30%) — what is collected, retention, resale, training use",
      "Encryption standards (20%) — in transit, at rest, key management",
      "Terms-of-service transparency (20%) — plain-language rights, exit terms",
      "Ethical AI practices (20%) — training data disclosure, opt-outs, model provenance",
      "Independent security audits (10%) — SOC 2 / ISO evidence, breach history",
    ],
  },
  {
    icon: GitMerge,
    name: "Integration Score",
    scale: "0–100 (shown as x.x/5 on tool reviews)",
    question: "How easily does this tool connect to the rest of my stack?",
    measures: [
      "API availability & quality (30%) — public REST/SDK, rate limits, docs",
      "Cross-platform support (30%) — web, desktop, mobile, ecosystem parity",
      "Smart-home / protocol support (20%) — Matter, Zigbee, HomeKit where relevant",
      "Automation-tool support (10%) — Zapier, Make, n8n, webhooks",
      "Developer community (10%) — open-source adapters, community recipes",
    ],
  },
  {
    icon: DollarSign,
    name: "TCO Score",
    scale: "3-year cost model (USD)",
    question: "What does this really cost over three years?",
    measures: [
      "Subscription cost × seats",
      "Usage overages (credits, exports, API calls)",
      "Required add-ons and plan upgrades",
      "Implementation and migration cost",
      "Lock-in / exit cost — export fidelity, data portability",
    ],
  },
  {
    icon: Scale,
    name: "Vendor Risk Profile",
    scale: "Low / Medium / High",
    question: "How risky is depending on this company?",
    measures: [
      "Vendor lock-in and data portability",
      "GDPR / compliance readiness",
      "SLA track record and uptime observations",
      "Financial stability and funding posture",
    ],
  },
  {
    icon: Puzzle,
    name: "Ecosystem Fit",
    scale: "Relative to your declared stack",
    question: "How well does this work with the tools you already run?",
    measures: [
      "Native support for your declared ecosystems",
      "Hub/relay requirements (e.g. requires a Matter hub)",
      "Workflow-graph compatibility with the rest of your stack",
    ],
  },
];

const SCORE_BANDS = [
  { range: "4.3 – 5.0", label: "Highly Recommended", color: "text-green-700", meaning: "Dependable on this dimension with no significant caveats found in testing." },
  { range: "4.0 – 4.2", label: "Recommended", color: "text-emerald-700", meaning: "Strong performance with minor caveats that most users can work around." },
  { range: "3.7 – 3.9", label: "Good with Caveats", color: "text-amber-700", meaning: "Genuinely useful, but one or more limitations matter for specific users — read the Cons section." },
  { range: "Below 3.7", label: "Use with Caution", color: "text-red-600", meaning: "Significant weaknesses, unverified claims, or elevated vendor risk. Choose an alternative unless the trade-off suits you." },
];

const INTERPRETATION_PATTERNS = [
  {
    pattern: "High Trust · low Integration",
    meaning: "Dependable and safe, but hard to connect. Expect manual exports, thin APIs, or middleware work.",
  },
  {
    pattern: "High Integration · low Trust",
    meaning: "Powerful ecosystem fit with governance concerns. Verify data handling before connecting it to customer data.",
  },
  {
    pattern: "Low TCO · high lock-in",
    meaning: "Inexpensive now, potentially costly later. Model the exit cost before you standardise on it.",
  },
  {
    pattern: "High Ecosystem Fit",
    meaning: "Best for your declared stack — not necessarily best overall. Fit is contextual, not absolute.",
  },
];

const NEED_MATRIX = [
  { need: "Privacy-sensitive team", signal: "Trust Score + Vendor Risk Profile", href: "/scores/trust-score-index" },
  { need: "Fast implementation", signal: "Integration Score + setup-complexity notes", href: "/scores/integration-score-index" },
  { need: "Budget-conscious buyer", signal: "3-year TCO model", href: "/tco-calculator" },
  { need: "Multi-tool workflow", signal: "Ecosystem Fit + API depth", href: "/stack-builder" },
  { need: "Enterprise procurement", signal: "Security evidence, SLA, portability, vendor stability", href: "/scoring-hub" },
];

const FAQS = [
  {
    q: "Are TheSynLab scores influenced by affiliate commissions?",
    a: "No. TheSynLab is funded by affiliate commissions and advertising, but scoring is independent of commercial relationships. Commissions vary per vendor and do not enter any score formula. Details: /how-we-make-money.",
  },
  {
    q: "How long do you test each product before scoring it?",
    a: "A minimum of 14 days of hands-on use per product, on a real (usually paid) plan, completing documented workflows including at least one integration setup and one export/migration test.",
  },
  {
    q: "How often are scores updated?",
    a: "Scores are re-verified at least every 6–12 months, and sooner when a vendor ships a major update, changes pricing, or reports a security incident. Every review shows its last verified date.",
  },
  {
    q: "Do scores differ between categories?",
    a: "Yes. Expectations are category-adjusted: a consumer smart-home device is not measured against enterprise SaaS procurement criteria. Scores are always comparable within a category.",
  },
  {
    q: "What does a high Integration Score with a low Trust Score mean?",
    a: "The tool connects easily to your stack but has governance or privacy concerns. It can still be the right choice for non-sensitive workflows — see the interpretation patterns above.",
  },
  {
    q: "Can vendors pay for a better score or review?",
    a: "No. Sponsored placements are labelled separately and never affect editorial scores. Vendors can showcase existing verified scores through the vendor program, but cannot buy or change them.",
  },
];

export default function MethodologyPage() {
  const breadcrumbs = [
    { name: "TheSynLab", item: `${SITE}/` },
    { name: "Testing Methodology", item: `${SITE}/methodology` },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `How We Test & Score Tools: TheSynLab Methodology ${year}`,
      description:
        "How TheSynLab calculates Trust Score, Integration Score, 3-year TCO, and vendor-risk profiles: the 14-day testing protocol, score weights, interpretation guide, and independence policies.",
      url: `${SITE}/methodology`,
      isPartOf: { "@type": "WebSite", name: "TheSynLab", url: SITE },
      dateModified: `${year}-09-12`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.item,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title={`How We Test & Score Tools: Methodology ${year} | TheSynLab`}
        description="How TheSynLab calculates Trust Score, Integration Score, 3-year TCO, and vendor-risk profiles: the 14-day testing protocol, score weights, interpretation guide, and independence policies."
        canonical="/methodology"
        ogType="article"
      />
      <JsonLd schema={jsonLd} />
      <Header />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:underline">TheSynLab</Link>
              <span className="mx-2">›</span>
              <span className="text-foreground">Testing Methodology</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-4xl">
              How We Test &amp; Score: The {year} TheSynLab Methodology
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed">
              The independent technology decision lab for comparing tools by trust,
              integration, total cost, and real-world performance. This page explains
              exactly what each score measures, how it is calculated, what evidence
              goes into it, and how you should interpret it.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="outline"><FlaskConical className="h-3 w-3 mr-1 inline" /> 14+ days hands-on testing</Badge>
              <Badge variant="outline"><RefreshCw className="h-3 w-3 mr-1 inline" /> Re-verified every 6–12 months</Badge>
              <Badge variant="outline"><Eye className="h-3 w-3 mr-1 inline" /> Scores independent of affiliate income</Badge>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-5xl">
          {/* ── What each score measures ───────────────────────── */}
          <section className="mb-14" id="scores">
            <h2 className="text-3xl font-bold mb-2">What each score measures</h2>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Five independent dimensions, each answering a different buying question.
              A high score on one never compensates for a low score on another.
            </p>
            <div className="space-y-6">
              {SCORES.map((s) => (
                <Card key={s.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <s.icon className="h-5 w-5 text-primary shrink-0" />
                      {s.name}
                      <span className="text-xs font-normal text-muted-foreground ml-auto">{s.scale}</span>
                    </CardTitle>
                    <p className="text-sm italic text-muted-foreground">“{s.question}”</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {s.measures.map((m) => (
                        <li key={m} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── Testing protocol ───────────────────────────────── */}
          <section className="mb-14" id="protocol">
            <h2 className="text-3xl font-bold mb-2">How we test</h2>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Every review is based on first-hand evidence, not vendor marketing or
              scraped feature lists. Each test records:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Plan tested", "The exact tier (free or paid) used, so results map to a real budget."],
                ["Test duration", "Minimum 14 days of production-like use; longer for benchmark-heavy guides."],
                ["Workflows completed", "Documented real tasks — at minimum one integration setup and one export/migration."],
                ["Devices & integrations used", "Browser, OS, mobile, and every ecosystem we connected during the test."],
                ["Evidence collected", "Screenshots, benchmark tables, timing measurements, and test logs."],
                ["What failed", "Friction points, outages, and workarounds — a review that only praises tells you nothing."],
                ["Last verified date", "The date the facts (pricing, features, integrations) were last re-checked."],
                ["Reviewer", "A named editor with direct testing experience of the category."],
              ].map(([title, desc]) => (
                <Card key={title}>
                  <CardContent className="pt-6">
                    <p className="font-semibold mb-1">{title}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── Score ranges ───────────────────────────────────── */}
          <section className="mb-14" id="ranges">
            <h2 className="text-3xl font-bold mb-2">What the score ranges mean</h2>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Scores are category-adjusted: a consumer smart-home device is not
              measured against enterprise procurement criteria. Within a category,
              the bands mean the same thing everywhere on the site.
            </p>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Score band</th>
                        <th className="px-4 py-3 text-left font-medium">Verdict label</th>
                        <th className="px-4 py-3 text-left font-medium">What it means</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SCORE_BANDS.map((b) => (
                        <tr key={b.range} className="border-t">
                          <td className="px-4 py-3 font-mono">{b.range}</td>
                          <td className={`px-4 py-3 font-semibold ${b.color}`}>{b.label}</td>
                          <td className="px-4 py-3 text-muted-foreground">{b.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── Interpretation patterns ────────────────────────── */}
          <section className="mb-14" id="patterns">
            <h2 className="text-3xl font-bold mb-2">Reading scores together</h2>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Scores are decision inputs, not trophies. The combinations carry the signal:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {INTERPRETATION_PATTERNS.map((p) => (
                <Card key={p.pattern}>
                  <CardContent className="pt-6">
                    <p className="font-semibold text-primary mb-1">{p.pattern}</p>
                    <p className="text-sm text-muted-foreground">{p.meaning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ── Recommendation matrix ──────────────────────────── */}
          <section className="mb-14" id="matrix">
            <h2 className="text-3xl font-bold mb-2">Which score should you trust for your decision?</h2>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              Match your primary need to the signal that predicts it:
            </p>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">If you need…</th>
                        <th className="px-4 py-3 text-left font-medium">Look at…</th>
                        <th className="px-4 py-3 text-left font-medium">Start here</th>
                      </tr>
                    </thead>
                    <tbody>
                      {NEED_MATRIX.map((row) => (
                        <tr key={row.need} className="border-t">
                          <td className="px-4 py-3 font-medium">{row.need}</td>
                          <td className="px-4 py-3">{row.signal}</td>
                          <td className="px-4 py-3">
                            <Link to={row.href} className="text-primary hover:underline whitespace-nowrap">
                              Open tool <ArrowRight className="h-3 w-3 inline" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── Independence & policy ──────────────────────────── */}
          <section className="mb-14" id="independence">
            <h2 className="text-3xl font-bold mb-2">Independence, updates &amp; corrections</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <Award className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold mb-1">How we make money</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Affiliate-funded, never score-influenced. Commission levels per
                    vendor are not part of any formula.
                  </p>
                  <Link to="/how-we-make-money" className="text-sm text-primary hover:underline">Read the policy →</Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <FileText className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold mb-1">Corrections &amp; updates</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Factual errors are corrected and dated. Vendors have a
                    right-of-reply before publication of material claims.
                  </p>
                  <Link to="/editorial" className="text-sm text-primary hover:underline">Editorial policy →</Link>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Scale className="h-5 w-5 text-primary mb-2" />
                  <p className="font-semibold mb-1">Affiliate disclosure</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Every outbound commercial link is labelled, and sponsored
                    placements are visually distinct from reviews.
                  </p>
                  <Link to="/disclosure" className="text-sm text-primary hover:underline">Full disclosure →</Link>
                </CardContent>
              </Card>
            </div>
            <p className="text-sm text-muted-foreground mt-6 max-w-3xl">
              Want the interactive version — ecosystem fit, decision recipes, and
              score-change history? Visit the{" "}
              <Link to="/scoring-hub" className="text-primary hover:underline">Scoring Hub</Link>.
              Questions or corrections: <Link to="/contact" className="text-primary hover:underline">contact the lab</Link>.
            </p>
          </section>

          {/* ── FAQ ────────────────────────────────────────────── */}
          <section className="mb-14" id="faq">
            <h2 className="text-3xl font-bold mb-8">Methodology FAQ</h2>
            <div className="space-y-4">
              {FAQS.map((f) => (
                <Card key={f.q}>
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm mb-1">{f.q}</p>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}



