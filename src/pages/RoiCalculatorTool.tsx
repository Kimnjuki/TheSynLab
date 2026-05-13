import { useMemo, useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToolPageSEO } from "@/components/seo/ToolPageSEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Download,
  Share2,
  BarChart3,
  Briefcase,
  PiggyBank,
  Award,
  Copy,
  Check,
} from "lucide-react";

const STORAGE_KEY = "thesynlab_roi_calc";

interface RoiResult {
  annualValue: number;
  annualCost: number;
  monthlySavings: number;
  roiPercent: number;
  paybackMonths: number;
  threeYearNetValue: number;
}

const formatCurrency = (val: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);

const formatPercent = (val: number): string =>
  val > 0 ? `+${val.toFixed(0)}%` : `${val.toFixed(0)}%`;

export default function RoiCalculatorTool() {
  // Load saved state
  const [teamSize, setTeamSize] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).teamSize ?? 10 : 10;
    } catch { return 10; }
  });
  const [hourlyRate, setHourlyRate] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).hourlyRate ?? 50 : 50;
    } catch { return 50; }
  });
  const [monthlyCost, setMonthlyCost] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).monthlyCost ?? 500 : 500;
    } catch { return 500; }
  });
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).hoursSavedPerWeek ?? 2 : 2;
    } catch { return 2; }
  });
  const [onboardingCost, setOnboardingCost] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved).onboardingCost ?? 2000 : 2000;
    } catch { return 2000; }
  });
  const [copied, setCopied] = useState(false);

  // Persist state
  useEffect(() => {
    const data = { teamSize, hourlyRate, monthlyCost, hoursSavedPerWeek, onboardingCost };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }, [teamSize, hourlyRate, monthlyCost, hoursSavedPerWeek, onboardingCost]);

  const result: RoiResult = useMemo(() => {
    const weeksPerYear = 52;
    const annualTimeValue = teamSize * hourlyRate * hoursSavedPerWeek * weeksPerYear;
    const annualSubCost = monthlyCost * 12;
    const monthlySavings = (teamSize * hourlyRate * hoursSavedPerWeek * (weeksPerYear / 12)) - monthlyCost;
    const totalAnnualValue = annualTimeValue;
    const totalAnnualCost = annualSubCost + (onboardingCost / 3);
    const roi = annualSubCost > 0
      ? ((annualTimeValue - annualSubCost) / annualSubCost) * 100
      : 0;
    const payback = monthlySavings > 0
      ? onboardingCost / monthlySavings
      : Infinity;
    const threeYearNet = (annualTimeValue - annualSubCost) * 3 - onboardingCost;

    return {
      annualValue: annualTimeValue,
      annualCost: annualSubCost,
      monthlySavings,
      roiPercent: roi,
      paybackMonths: payback,
      threeYearNetValue: threeYearNet,
    };
  }, [teamSize, hourlyRate, monthlyCost, hoursSavedPerWeek, onboardingCost]);

  const handleExport = useCallback(() => {
    window.print();
  }, []);

  const handleShare = useCallback(() => {
    const params = new URLSearchParams({
      seats: String(teamSize),
      rate: String(hourlyRate),
      cost: String(monthlyCost),
      hours: String(hoursSavedPerWeek),
      setup: String(onboardingCost),
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Could not copy. Try manually copying the URL.");
    });
  }, [teamSize, hourlyRate, monthlyCost, hoursSavedPerWeek, onboardingCost]);

  // Load shareable params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("seats")) setTeamSize(Number(params.get("seats")));
    if (params.has("rate")) setHourlyRate(Number(params.get("rate")));
    if (params.has("cost")) setMonthlyCost(Number(params.get("cost")));
    if (params.has("hours")) setHoursSavedPerWeek(Number(params.get("hours")));
    if (params.has("setup")) setOnboardingCost(Number(params.get("setup")));
  }, []);

  const roiColor = result.roiPercent >= 100 ? "text-green-600" : result.roiPercent >= 0 ? "text-amber-600" : "text-red-600";
  const paybackText = result.paybackMonths === Infinity
    ? "N/A (not projected)"
    : `${result.paybackMonths < 1 ? "<1" : Math.ceil(result.paybackMonths)} months`;

  return (
    <div className="min-h-screen bg-background">
      <ToolPageSEO
        title="ROI Calculator — Estimate SaaS Tool Value — TheSynLab"
        description="Calculate the expected ROI, payback period, and 3-year net value of any SaaS tool. Estimate time savings, subscription costs, and onboarding expenses."
        canonical="/tools/roi-calculator"
        toolName="ROI Calculator"
        toolDescription="Calculate the expected return on investment for any SaaS tool or software investment. Estimate time savings, subscription costs, and onboarding expenses."
        faqs={[
          { question: "How is ROI calculated?", answer: "ROI = (Annual value of time saved - Annual subscription cost) / Annual subscription cost × 100. Time saved is estimated based on team size × hourly rate × hours saved per week." },
          { question: "What is a good ROI for SaaS tools?", answer: "A positive ROI means the tool saves more value than it costs. Above 100% means it pays for itself and delivers equal value above cost." },
          { question: "How is payback period calculated?", answer: "Payback period = One-time onboarding costs / Monthly net savings. It shows how many months it takes to recover the initial investment." },
          { question: "Can I share my calculation?", answer: "Yes — click the Share button to generate a shareable URL with your current inputs." },
        ]}
      />
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 text-center">
          <Badge variant="secondary" className="mb-2">
            <Calculator className="mr-1 h-3.5 w-3.5" />
            ROI Calculator
          </Badge>
          <h1 className="text-3xl font-bold">SaaS ROI Calculator</h1>
          <p className="mt-1 text-muted-foreground">
            Estimate the return on any software investment — from team productivity tools to AI platforms
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Inputs — 2 cols */}
          <div className="space-y-5 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5" />
                  Your Inputs
                </CardTitle>
                <CardDescription>
                  Adjust the parameters to match your team and tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Team size */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Team Size: <strong>{teamSize}</strong>
                  </Label>
                  <Slider
                    value={[teamSize]}
                    onValueChange={([v]) => setTeamSize(Math.max(1, v))}
                    min={1}
                    max={200}
                    step={1}
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>1</span>
                    <span>200</span>
                  </div>
                </div>

                {/* Hourly rate */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    Avg. Hourly Rate: <strong>${hourlyRate}</strong>
                  </Label>
                  <Slider
                    value={[hourlyRate]}
                    onValueChange={([v]) => setHourlyRate(Math.max(15, v))}
                    min={15}
                    max={250}
                    step={5}
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>$15</span>
                    <span>$250</span>
                  </div>
                </div>

                {/* Monthly cost */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Monthly Subscription Cost: <strong>{formatCurrency(monthlyCost)}</strong>
                  </Label>
                  <Slider
                    value={[monthlyCost]}
                    onValueChange={([v]) => setMonthlyCost(Math.max(0, v))}
                    min={0}
                    max={10000}
                    step={50}
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>$0</span>
                    <span>$10K</span>
                  </div>
                </div>

                {/* Hours saved per week */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Hours Saved Per User/Week: <strong>{hoursSavedPerWeek}h</strong>
                  </Label>
                  <Slider
                    value={[hoursSavedPerWeek]}
                    onValueChange={([v]) => setHoursSavedPerWeek(Math.max(0, v))}
                    min={0}
                    max={20}
                    step={0.5}
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>0h</span>
                    <span>20h</span>
                  </div>
                </div>

                {/* Onboarding cost */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    Onboarding + Migration Cost: <strong>{formatCurrency(onboardingCost)}</strong>
                  </Label>
                  <Slider
                    value={[onboardingCost]}
                    onValueChange={([v]) => setOnboardingCost(Math.max(0, v))}
                    min={0}
                    max={50000}
                    step={500}
                  />
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>$0</span>
                    <span>$50K</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleShare}>
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
                {copied ? "Copied!" : "Share Analysis"}
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export (PDF)
              </Button>
            </div>
          </div>

          {/* Results — 3 cols */}
          <div className="space-y-5 lg:col-span-3">
            {/* Hero result */}
            <Card className={`border-2 ${result.roiPercent >= 100 ? "border-green-500/50" : result.roiPercent >= 0 ? "border-amber-500/50" : "border-red-500/50"}`}>
              <CardContent className="py-8 text-center">
                <div className="mb-1 text-sm text-muted-foreground">Expected ROI</div>
                <div className={`text-5xl font-extrabold ${roiColor}`}>
                  {formatPercent(result.roiPercent)}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {result.roiPercent >= 200
                    ? "Exceptional return — this tool more than pays for itself"
                    : result.roiPercent >= 100
                    ? "Strong return — this tool delivers significant value above cost"
                    : result.roiPercent >= 0
                    ? "Modest return — the tool roughly breaks even"
                    : "Negative return — the subscription costs exceed the estimated time savings"}
                </p>
              </CardContent>
            </Card>

            {/* Detail cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Annual Time Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(result.annualValue)}</div>
                  <p className="text-[11px] text-muted-foreground">
                    {teamSize} users × ${hourlyRate}/hr × {hoursSavedPerWeek}h × 52 weeks
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-red-500" />
                    Annual Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(result.annualCost)}</div>
                  <p className="text-[11px] text-muted-foreground">
                    {formatCurrency(monthlyCost)}/mo × 12
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                    <PiggyBank className="h-4 w-4 text-blue-500" />
                    Monthly Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${result.monthlySavings >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(result.monthlySavings)}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Net savings per month after subscription
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1.5 text-sm font-medium">
                    <Award className="h-4 w-4 text-amber-500" />
                    3-Year Net Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${result.threeYearNetValue >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(result.threeYearNetValue)}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Net value after {formatCurrency(onboardingCost)} setup cost
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payback period */}
            <Card>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Payback Period</div>
                    <div className="text-xl font-bold">{paybackText}</div>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>Setup cost: {formatCurrency(onboardingCost)}</div>
                  <div>Monthly savings: {formatCurrency(result.monthlySavings)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Methodology */}
            <details className="rounded-lg border p-4 text-sm text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground">
                How this is calculated
              </summary>
              <div className="mt-3 space-y-1.5">
                <p><strong>Annual Time Value</strong> = Team Size × Hourly Rate × Hours Saved/Week × 52</p>
                <p><strong>ROI</strong> = (Annual Time Value − Annual Cost) / Annual Cost × 100</p>
                <p><strong>Monthly Savings</strong> = Monthly Time Value − Monthly Cost</p>
                <p><strong>Payback Period</strong> = Onboarding Cost / Monthly Savings (if positive)</p>
                <p><strong>3-Year Net Value</strong> = (Annual Time Value − Annual Cost) × 3 − Onboarding Cost</p>
                <p className="mt-2 text-[11px]">
                  Calculations are estimates. Actual ROI depends on adoption rates, training effectiveness, and workflow integration quality. Use the Decision Studio for multi-product comparisons.
                </p>
              </div>
            </details>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
