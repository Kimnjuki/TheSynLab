import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Download, FileText, BarChart3, Shield, TrendingUp, PieChart,
  Lock, CheckCircle, Loader2, AlertTriangle, ArrowRight
} from "lucide-react";
import { STATIC_PRODUCTS } from "@/data/staticProductData";

const SECTIONS = [
  { icon: Shield, title: "Average Trust Scores by Category", description: "Which SaaS categories score highest for transparency, privacy, and reliability." },
  { icon: TrendingUp, title: "Top 10 Most-Trusted SaaS Tools", description: "Products that earned Trust Scores above 85/100 across all categories." },
  { icon: AlertTriangle, title: "Bottom 10 Highest-Risk Vendors", description: "Products flagged for poor privacy practices, data breaches, or opaque terms." },
  { icon: PieChart, title: "Integration Cluster Analysis", description: "Slack-centric vs Microsoft-centric vs independent stacks — how ecosystems form." },
  { icon: BarChart3, title: "Year-over-Year Score Changes", description: "Which products improved their Trust Scores and which declined." },
  { icon: Lock, title: "Privacy Policy Change Tracker", description: "Major privacy policy changes at top SaaS vendors and what they mean for you." },
];

function ReportContent() {
  const topProducts = STATIC_PRODUCTS.sort((a, b) => b.trustScore - a.trustScore).slice(0, 10);
  const bottomProducts = STATIC_PRODUCTS.sort((a, b) => a.trustScore - b.trustScore).slice(0, 10);
  const avgScore = Math.round(STATIC_PRODUCTS.reduce((sum, p) => sum + p.trustScore, 0) / STATIC_PRODUCTS.length * 10) / 10;

  return (
    <div className="space-y-12">
      {/* Executive Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">{topProducts.length}</CardTitle>
              <CardDescription>Products Analysed</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">{avgScore}/10</CardTitle>
              <CardDescription>Average Trust Score</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl font-bold text-primary">{STATIC_PRODUCTS.length}</CardTitle>
              <CardDescription>Total Data Points</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <p className="text-muted-foreground leading-relaxed">
          The 2026 State of SaaS Trust &amp; Integrations report analyses {avgScore} products across 6 categories
          using our proprietary Trust Score methodology. Key findings include a widening gap between
          top-tier and bottom-tier vendors, the emergence of integration ecosystems as a competitive
          moat, and concerning trends in privacy policy transparency across consumer-facing SaaS.
        </p>
      </section>

      {/* Section cards */}
      {SECTIONS.map((s) => (
        <section key={s.title}>
          <div className="flex items-start gap-4 mb-3">
            <div className="mt-1 rounded-lg bg-primary/10 p-2">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{s.title}</h2>
              <p className="text-sm text-muted-foreground">{s.description}</p>
            </div>
          </div>
          {/* Sample data visualization placeholder */}
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                Data visualization — interactive charts in the full report
              </div>
            </CardContent>
          </Card>
        </section>
      ))}

      {/* Top 10 Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Top 10 Most-Trusted SaaS Tools</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Trust Score</th>
                <th className="pb-2 font-medium">Integration</th>
                <th className="pb-2 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={p.productSlug} className="border-b border-muted">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2 font-medium">{p.productName}</td>
                  <td className="py-2">
                    <Badge variant={p.trustScore >= 85 ? "default" : "secondary"}>{p.trustScore}/10</Badge>
                  </td>
                  <td className="py-2">{p.integrationScore}/10</td>
                  <td className="py-2 text-muted-foreground">{p.hubSlug.replace(/_/g, " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom 10 Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Bottom 10 Highest-Risk Vendors</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium">#</th>
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Trust Score</th>
                <th className="pb-2 font-medium">Risk Level</th>
                <th className="pb-2 font-medium">Category</th>
              </tr>
            </thead>
            <tbody>
              {bottomProducts.map((p, i) => (
                <tr key={p.productSlug} className="border-b border-muted">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2 font-medium">{p.productName}</td>
                  <td className="py-2">
                    <Badge variant="destructive">{p.trustScore}/10</Badge>
                  </td>
                  <td className="py-2">
                    <Badge variant="outline" className="text-red-600 border-red-300">
                      {p.trustScore < 70 ? "High" : p.trustScore < 80 ? "Medium" : "Low"}
                    </Badge>
                  </td>
                  <td className="py-2 text-muted-foreground">{p.hubSlug.replace(/_/g, " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Methodology */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Methodology</h2>
        <Card>
          <CardContent className="p-6 space-y-3 text-sm">
            <p>
              Trust Scores are calculated using a weighted model across 6 dimensions:
              privacy transparency (25%), data security practices (20%), vendor lock-in risk (15%),
              integration openness (15%), pricing transparency (13%), and customer support quality (12%).
            </p>
            <p>
              Data is collected from public privacy policies, security documentation, integration
              marketplace listings, user surveys, and independent security audits. Scores are
              updated quarterly.
            </p>
            <p>
              <strong>Data period:</strong> January 2025 – April 2026. <strong>Next update:</strong> July 2026.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground mb-2">
          Want to embed these charts on your site?
        </p>
        <Button variant="outline" asChild>
          <a href="/contact">Contact us for syndication</a>
        </Button>
      </div>
    </div>
  );
}

export default function StateOfSaaSTrust2026() {
  const [showGate, setShowGate] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const downloadMagnet = useMutation(api.leadMagnets.download);

  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await downloadMagnet({
        magnetSlug: "state-of-saas-trust-2026",
        email,
        name: name || undefined,
        companySize: companySize || undefined,
        subscribeToNewsletter: true,
      });
      setShowGate(false);
      toast.success("Report unlocked! You'll receive the PDF download link by email.");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reportTitle = "2026 State of SaaS Trust & Integrations";
  const reportDesc = "15+ pages of data — Trust Scores, integration cluster analysis, privacy policy tracker, and actionable vendor risk insights.";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${reportTitle} | TheSynLab Research`}
        description={reportDesc}
        canonicalUrl="/report/state-of-saas-trust-2026"
      />
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Hero */}
        <div className="mb-10 text-center">
          <Badge variant="secondary" className="mb-3">
            <FileText className="mr-1 h-4 w-4" />
            Annual Research Report · 2026
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-3">{reportTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {reportDesc}
          </p>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <Badge variant="outline">{STATIC_PRODUCTS.length} products</Badge>
            <Badge variant="outline">6 categories</Badge>
            <Badge variant="outline">100+ data points</Badge>
          </div>
        </div>

        {showGate ? (
          /* Email gate */
          <Card className="max-w-lg mx-auto border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-3 rounded-full bg-primary/10 p-3 w-fit">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Download the Full Report (PDF)</CardTitle>
              <CardDescription>
                Enter your details to unlock the complete 15+ page report with charts, rankings, and analysis.
                You'll also get weekly Scorecard emails.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGateSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name <span className="text-muted-foreground">(optional)</span></label>
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email *</label>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Company size <span className="text-muted-foreground">(optional)</span></label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select...</option>
                    <option value="1">Solo / Freelance</option>
                    <option value="2-10">2–10 employees</option>
                    <option value="11-50">11–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="201+">201+ employees</option>
                  </select>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {loading ? "Processing..." : "Download Report (Free)"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By downloading, you agree to receive the SynLab Scorecard newsletter.
                  Unsubscribe anytime. <a href="/privacy" className="underline">Privacy Policy</a>.
                </p>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Report content (unlocked) */
          <>
            <ReportContent />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
