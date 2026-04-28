import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  TrendingUp,
  Shield,
  GitBranch,
  ArrowRight,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BarChart2,
  Layers,
} from "lucide-react";

const FEATURES = [
  {
    icon: Calculator,
    title: "ROI Calculator",
    description: "Model exact return-on-investment for any tool against your current setup. Includes hidden costs: onboarding, migration, training.",
    href: "/tools/roi-calculator",
    cta: "Calculate ROI",
  },
  {
    icon: DollarSign,
    title: "3-Year TCO Analysis",
    description: "Compare true total cost of ownership across competing products, including seat pricing, add-ons, API overages, and lock-in penalties.",
    href: "/tools/budget-calculator",
    cta: "Model TCO",
  },
  {
    icon: Shield,
    title: "Vendor Risk Scoring",
    description: "Evaluate lock-in risk, data portability, SLA reliability, compliance coverage, and financial stability of any vendor.",
    href: "/scoring-hub",
    cta: "Check Risk",
  },
  {
    icon: GitBranch,
    title: "Migration Roadmap",
    description: "AI-assisted migration planning from your current stack to a target stack. Dependency mapping, rollback steps, and timeline estimates.",
    href: "/tools/stack-builder",
    cta: "Plan Migration",
  },
  {
    icon: Layers,
    title: "Stack Builder",
    description: "Assemble your ideal stack and get compatibility scores, TCO delta vs your current stack, and AI-generated integration notes.",
    href: "/stack-builder",
    cta: "Build Stack",
  },
  {
    icon: BarChart2,
    title: "What-If Simulations",
    description: "Swap a tool in your stack and instantly see how it changes your integration score, cost profile, and vendor risk exposure.",
    href: "/tools/stack-builder",
    cta: "Run Simulation",
  },
];

function QuickRoiPanel() {
  const [seats, setSeats] = useState(10);
  const [currentCost, setCurrentCost] = useState(500);
  const [hoursSaved, setHoursSaved] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(75);

  const annualCurrentCost = currentCost * 12;
  const annualValueSaved = hoursSaved * hourlyRate * 52;
  const annualRoi = annualValueSaved - annualCurrentCost;
  const roiPercent = annualCurrentCost > 0 ? Math.round((annualRoi / annualCurrentCost) * 100) : 0;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Quick ROI Estimate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="text-sm">Team size: <span className="font-semibold text-foreground">{seats} seats</span></Label>
          <Slider value={[seats]} onValueChange={([v]) => setSeats(v)} min={1} max={500} step={1} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Monthly tool cost ($)</Label>
            <Input type="number" value={currentCost} onChange={(e) => setCurrentCost(Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Hours saved / week / person</Label>
            <Input type="number" value={hoursSaved} onChange={(e) => setHoursSaved(Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Avg. hourly rate ($)</Label>
            <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} />
          </div>
        </div>
        <div className="rounded-lg bg-muted p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Annual tool cost</span>
            <span className="font-medium">${annualCurrentCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Annual value of time saved</span>
            <span className="font-medium text-green-600">${annualValueSaved.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold border-t pt-2 mt-2">
            <span>Net Annual ROI</span>
            <span className={annualRoi >= 0 ? "text-green-600" : "text-red-500"}>
              {annualRoi >= 0 ? "+" : ""}${annualRoi.toLocaleString()} ({roiPercent}%)
            </span>
          </div>
        </div>
        <Link to="/tools/roi-calculator">
          <Button className="w-full gap-2">
            Full ROI Analysis <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function TcoPanel() {
  return (
    <Card className="border-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-secondary" />
          3-Year TCO Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Enter up to 3 competing products to compare their true 3-year total cost of ownership, including hidden costs.
        </p>
        <div className="space-y-3">
          {["Tool A", "Tool B", "Tool C"].map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: ["#6366f1", "#10b981", "#f59e0b"][i] }} />
              <Input placeholder={`Search ${label}…`} className="flex-1" />
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-muted/50 border border-dashed p-6 text-center text-sm text-muted-foreground">
          Add 2+ products to see TCO chart
        </div>
        <Link to="/tools/budget-calculator">
          <Button variant="outline" className="w-full gap-2">
            Open Full TCO Modeler <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

const RISK_SIGNALS = [
  { label: "Data export support", ok: true },
  { label: "GDPR compliant", ok: true },
  { label: "SLA ≥ 99.9%", ok: true },
  { label: "No forced annual contracts", ok: false },
  { label: "Open-source / self-hostable", ok: false },
];

function RiskPanel() {
  return (
    <Card className="border-orange-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Vendor Risk Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Sample risk profile — search a product for real data.</p>
        <div className="space-y-2">
          {RISK_SIGNALS.map((s) => (
            <div key={s.label} className="flex items-center gap-3 text-sm">
              {s.ok
                ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                : <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />}
              <span className={s.ok ? "" : "text-muted-foreground"}>{s.label}</span>
            </div>
          ))}
        </div>
        <Link to="/scoring-hub">
          <Button variant="outline" className="w-full gap-2">
            Full Risk Methodology <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function DecisionStudio() {
  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Decision Studio – SaaS Decision Tool & Software ROI Calculator | TheSynLab"
        description="Interactive decision lab for software buyers. Model ROI, compare 3-year TCO, simulate stack changes, evaluate vendor risk, and plan migrations — all in one place."
        canonical="/decision-studio"
      />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 border-b">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">Decision Studio</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Make Software Decisions With Confidence
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              ROI calculator, 3-year TCO analysis, vendor risk scoring, what-if simulations, and AI-assisted migration planning — all in one interactive lab.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/tools/roi-calculator">
                <Button size="lg" className="gap-2">
                  <Calculator className="h-5 w-5" /> Calculate ROI
                </Button>
              </Link>
              <Link to="/stack-builder">
                <Button size="lg" variant="outline" className="gap-2">
                  <Layers className="h-5 w-5" /> Build Your Stack
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Studio Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="group hover:border-primary/30 hover:shadow-md transition-all">
                  <CardContent className="p-5 flex flex-col gap-3 h-full">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    </div>
                    <Link to={f.href}>
                      <Button variant="ghost" size="sm" className="gap-2 pl-0 group-hover:text-primary">
                        {f.cta} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Interactive Panels */}
          <h2 className="text-2xl font-bold mb-6">Try It Now</h2>
          <Tabs defaultValue="roi" className="space-y-6">
            <TabsList>
              <TabsTrigger value="roi" className="gap-2"><Calculator className="h-4 w-4" /> ROI</TabsTrigger>
              <TabsTrigger value="tco" className="gap-2"><TrendingUp className="h-4 w-4" /> TCO</TabsTrigger>
              <TabsTrigger value="risk" className="gap-2"><Shield className="h-4 w-4" /> Risk</TabsTrigger>
            </TabsList>
            <TabsContent value="roi"><QuickRoiPanel /></TabsContent>
            <TabsContent value="tco"><TcoPanel /></TabsContent>
            <TabsContent value="risk"><RiskPanel /></TabsContent>
          </Tabs>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/30 py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to build your stack?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Use the Stack Builder to assemble your ideal stack, get AI-generated integration notes, and export a migration roadmap.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/stack-builder">
                <Button className="gap-2"><Layers className="h-4 w-4" /> Stack Builder</Button>
              </Link>
              <Link to="/tools/stack-builder">
                <Button variant="outline" className="gap-2"><Users className="h-4 w-4" /> Team Stack</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
