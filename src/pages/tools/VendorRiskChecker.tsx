import { useState, useCallback, useMemo } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { MetaTags } from "@/components/seo/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Lock,
  Database,
  FileText,
  Link2,
  Activity,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import type { Id } from "@/../convex/_generated/dataModel";

interface ProductOption {
  _id: Id<"novaProducts">;
  productName: string;
  productSlug: string;
  hub: string;
}

type RiskLabel = "Low" | "Medium" | "High" | "Critical";
type Dimension = "dataPortability" | "contractLockIn" | "proprietaryFormats" | "integrationDependency" | "apiStability";

const dimensionLabels: Record<Dimension, string> = {
  dataPortability: "Data Portability",
  contractLockIn: "Contract Lock-in",
  proprietaryFormats: "Proprietary Formats",
  integrationDependency: "Integration Dependency",
  apiStability: "API Stability",
};

const dimensionIcons: Record<Dimension, React.ReactNode> = {
  dataPortability: <Database className="h-4 w-4" />,
  contractLockIn: <FileText className="h-4 w-4" />,
  proprietaryFormats: <Lock className="h-4 w-4" />,
  integrationDependency: <Link2 className="h-4 w-4" />,
  apiStability: <Activity className="h-4 w-4" />,
};

const riskColor: Record<RiskLabel, string> = {
  Low: "text-green-500 border-green-500",
  Medium: "text-amber-500 border-amber-500",
  High: "text-orange-500 border-orange-500",
  Critical: "text-red-500 border-red-500",
};

const riskBg: Record<RiskLabel, string> = {
  Low: "bg-green-500/10",
  Medium: "bg-amber-500/10",
  High: "bg-orange-500/10",
  Critical: "bg-red-500/10",
};

const contextualQuestions = [
  {
    key: "centrality",
    question: "How central is this tool to your daily operations?",
    options: [
      { id: "nice_to_have", label: "Nice to have — could swap anytime", value: 1 },
      { id: "important", label: "Important but has alternatives", value: 3 },
      { id: "critical", label: "Critical — everything runs through it", value: 5 },
    ],
  },
  {
    key: "dataExport",
    question: "How often do you export your data from this tool?",
    options: [
      { id: "never", label: "Never — data stays in the tool", value: 5 },
      { id: "rarely", label: "Rarely — once or twice a year", value: 3 },
      { id: "often", label: "Regularly — weekly or monthly exports", value: 1 },
    ],
  },
  {
    key: "contract",
    question: "What's your current contract situation?",
    options: [
      { id: "monthly", label: "Month-to-month — no lock-in", value: 1 },
      { id: "annual", label: "Annual contract", value: 3 },
      { id: "multi_year", label: "Multi-year commitment", value: 5 },
    ],
  },
  {
    key: "integrationDepth",
    question: "How deeply have you integrated this tool?",
    options: [
      { id: "standalone", label: "Standalone — no integrations", value: 1 },
      { id: "some", label: "A few API connections", value: 3 },
      { id: "deep", label: "Deep custom integrations & workflows", value: 5 },
    ],
  },
];

const VendorRiskChecker = () => {
  const [step, setStep] = useState<"search" | "questions" | "results">("search");
  const [sessionId] = useState(() => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [questionStep, setQuestionStep] = useState(0);

  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];
  const runCheck = useAction(api.vendorRisk.runVendorRiskCheck);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return (allProducts as ProductOption[]).filter((p) =>
      p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 10);
  }, [searchQuery, allProducts]);

  const handleSelectProduct = useCallback((product: ProductOption) => {
    setSelectedProduct(product);
    setStep("questions");
    setQuestionStep(0);
    setAnswers({});
    setResults(null);
    setSearchQuery("");
  }, []);

  const handleAnswer = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (questionStep < contextualQuestions.length - 1) {
      setTimeout(() => setQuestionStep((s) => s + 1), 200);
    }
  }, [questionStep]);

  const handleRunCheck = useCallback(async () => {
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const result = await runCheck({
        productId: selectedProduct._id,
        userAnswers: answers,
        sessionId,
      });
      setResults(result);
      setStep("results");
      toast.success("Risk assessment complete!");
    } catch (err) {
      console.error("Risk check error:", err);
      toast.error("Assessment failed. Try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedProduct, answers, sessionId, runCheck]);

  const handleRestart = useCallback(() => {
    setStep("search");
    setSelectedProduct(null);
    setAnswers({});
    setResults(null);
    setQuestionStep(0);
  }, []);

  const currentQuestion = contextualQuestions[questionStep];
  const answerGiven = answers[currentQuestion?.key || ""];
  const allAnswered = contextualQuestions.every((q) => answers[q.key]);

  // Dimension gauge color
  const gaugeColor = (score: number, inverted = false) => {
    const val = inverted ? score : 10 - score;
    if (val <= 3) return "text-green-500";
    if (val <= 6) return "text-amber-500";
    return "text-red-500";
  };

  const gaugeFill = (score: number, inverted = false) => {
    const val = inverted ? score : 10 - score;
    return `${Math.round(val * 10)}%`;
  };

  const radialGauge = (score: number, label: string, color: string, size = 100) => (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center rounded-full border-4"
        style={{
          width: size,
          height: size,
          borderColor: "hsl(var(--border))",
          background: `conic-gradient(${color} ${(score / 10) * 360}deg, transparent ${(score / 10) * 360}deg)`,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full bg-background"
          style={{ width: size - 16, height: size - 16 }}
        >
          <span className={`text-xl font-bold ${color}`}>{score.toFixed(1)}</span>
        </div>
      </div>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </div>
  );

  // ----- RESULTS VIEW -----
  if (step === "results" && results) {
    const riskProfile = results.riskProfile || {};
    const overallScore: number = riskProfile.overallRiskScore ?? 5;
    const riskLabel: RiskLabel = riskProfile.riskLabel || (overallScore >= 7 ? "High" : overallScore >= 4 ? "Medium" : "Low");
    const dims = riskProfile.dimensions || {};
    const alternatives = results.alternatives || [];
    const mitigationTips = results.mitigationTips || [];

    return (
      <div className="min-h-screen bg-background">
        <MetaTags title="Vendor Risk Assessment Results — TheSynLab" description={`Risk profile for ${selectedProduct?.productName || "tool"} — Lock-in score, data portability, and safer alternatives.`} canonical="/vendor-risk-checker" />
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-12">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-2">
              <ShieldAlert className="mr-1 h-3.5 w-3.5" />
              Risk Assessment Complete
            </Badge>
            <h1 className="text-3xl font-bold">
              {selectedProduct?.productName} — Risk Profile
            </h1>
          </div>

          {/* Lock-in Meter */}
          <Card className={`mx-auto max-w-md ${riskBg[riskLabel]} border-2 ${riskColor[riskLabel].split(" ")[0]} mb-8 text-center`}>
            <CardContent className="p-8">
              <h2 className="mb-4 text-lg font-semibold">Lock-in Meter</h2>
              <div className="flex justify-center">
                {radialGauge(overallScore, riskLabel, riskColor[riskLabel].split(" ")[0], 140)}
              </div>
              <Badge variant="outline" className={`mt-4 ${riskColor[riskLabel]}`}>
                <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                {riskLabel} Risk
              </Badge>
            </CardContent>
          </Card>

          {/* Dimension breakdown */}
          <h2 className="mb-4 text-xl font-semibold">Dimension Breakdown</h2>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.entries(dimensionLabels) as [Dimension, string][]).map(([key, label]) => {
              const score = dims[key] ?? 5;
              const color = gaugeColor(score);
              return (
                <Card key={key}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={color}>{dimensionIcons[key]}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{label}</span>
                        <span className={`font-bold ${color}`}>{score.toFixed(1)}/10</span>
                      </div>
                      <Progress value={score * 10} className="mt-1 h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <Card className="mb-8 border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Lower-Risk Alternatives
                </CardTitle>
                <CardDescription>Safer options worth considering</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {alternatives.map((alt: any, i: number) => (
                    <li key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        {alt.productName || alt._id || `Alternative ${i + 1}`}
                      </span>
                      {alt.riskLabel && <Badge variant="outline" className={riskColor[alt.riskLabel as RiskLabel] || ""}>{alt.riskLabel}</Badge>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Mitigation tips */}
          {mitigationTips.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Mitigation Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mitigationTips.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <Button variant="outline" onClick={handleRestart}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Another Tool
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ----- QUESTIONS VIEW -----
  if (step === "questions" && selectedProduct) {
    return (
      <div className="min-h-screen bg-background">
        <MetaTags title="SaaS Vendor Risk Checker — TheSynLab" description="Run a vendor risk check on any SaaS tool. Get a lock-in score, data portability grade, and safer alternatives." canonical="/vendor-risk-checker" />
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-12">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-2"><ShieldAlert className="mr-1 h-3.5 w-3.5" />Vendor Risk Checker</Badge>
            <h1 className="text-2xl font-bold">Assess {selectedProduct.productName}</h1>
            <p className="text-sm text-muted-foreground">Answer 4 quick questions for your risk profile</p>
          </div>

          <Progress value={((questionStep + 1) / contextualQuestions.length) * 100} className="mb-8" />

          <Card className="mx-auto max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">Question {questionStep + 1} of {contextualQuestions.length}</Badge>
              </div>
              <CardTitle className="mt-2 text-lg">{currentQuestion?.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(currentQuestion?.options || []).map((opt) => (
                <Button
                  key={opt.id}
                  variant={answers[currentQuestion.key] === opt.id ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => handleAnswer(currentQuestion.key, opt.id)}
                >
                  {opt.label}
                </Button>
              ))}
            </CardContent>
            <div className="flex items-center justify-between border-t p-4">
              <Button variant="ghost" onClick={() => questionStep > 0 ? setQuestionStep((s) => s - 1) : handleRestart()}>
                <ArrowLeft className="mr-1 h-4 w-4" />{questionStep > 0 ? "Back" : "Change Tool"}
              </Button>
              {allAnswered ? (
                <Button onClick={handleRunCheck} disabled={loading}>
                  {loading ? "Assessing..." : <>Run Risk Check <ArrowRight className="ml-1 h-4 w-4" /></>}
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Answer all questions to continue</span>
              )}
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // ----- SEARCH VIEW -----
  return (
    <div className="min-h-screen bg-background">
      <MetaTags title="SaaS Vendor Risk Checker — Assess Lock-in, Exit Risk & Data Portability" description="Run a vendor risk check on any SaaS tool in 60 seconds. Get a lock-in score, data portability grade, and safer alternatives." canonical="/vendor-risk-checker" />
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2"><ShieldAlert className="mr-1 h-3.5 w-3.5" />Vendor Risk Checker</Badge>
          <h1 className="text-3xl font-bold">Assess Your Vendor Risk</h1>
          <p className="mt-2 text-muted-foreground">Search for a tool and get its lock-in score, data portability grade, and safer alternatives in 60 seconds.</p>
        </div>

        <Card className="mx-auto max-w-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
              {searchQuery && filteredProducts.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                  {(filteredProducts as ProductOption[]).map((p) => (
                    <button
                      key={p._id}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-accent"
                      onClick={() => handleSelectProduct(p)}
                    >
                      <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <span className="font-medium">{p.productName}</span>
                        <Badge variant="outline" className="ml-2 text-[10px]">{p.hub}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && filteredProducts.length === 0 && (
                <p className="mt-2 text-center text-sm text-muted-foreground">No tools found matching "{searchQuery}"</p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VendorRiskChecker;
