import { useState, useCallback, useMemo } from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { MetaTags } from "@/components/seo/MetaTags";
import { ToolPageSEO } from "@/components/seo/ToolPageSEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  RefreshCw,
  Download,
  Lightbulb,
  AlertTriangle,
  Clock,
  DollarSign,
  Layers,
  Zap,
  Users,
  PenTool,
  HeadphonesIcon,
  Code2,
  Briefcase,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import type { Id } from "@/../convex/_generated/dataModel";

interface ProductOption {
  _id: Id<"novaProducts">;
  productName: string;
  productSlug: string;
  hub: string;
}

const roles = [
  { id: "Content Marketer", label: "Content Marketer", icon: <PenTool className="h-5 w-5" />, description: "Create, distribute, and optimize content at scale" },
  { id: "Sales Lead", label: "Sales Lead", icon: <Users className="h-5 w-5" />, description: "Manage pipeline, outreach, and CRM automation" },
  { id: "Customer Support", label: "Customer Support", icon: <HeadphonesIcon className="h-5 w-5" />, description: "Automate ticket triage, responses, and feedback loops" },
  { id: "Developer", label: "Developer / Engineer", icon: <Code2 className="h-5 w-5" />, description: "CI/CD, monitoring, code review workflows" },
  { id: "Operations", label: "Operations", icon: <Settings className="h-5 w-5" />, description: "Process automation, reporting, and cross-team sync" },
  { id: "Founder", label: "Founder", icon: <Briefcase className="h-5 w-5" />, description: "Full-stack oversight, growth, and lean operations" },
];

const workflowGoals: Record<string, { id: string; title: string; description: string }[]> = {
  "Content Marketer": [
    { id: "content-pipeline", title: "Content Marketing Pipeline", description: "End-to-end content creation, review, and distribution" },
    { id: "social-automation", title: "Social Media Automation", description: "Schedule, post, and analyze across platforms" },
    { id: "seo-workflow", title: "SEO Content Optimization", description: "Keyword research → brief → publish → track" },
  ],
  "Sales Lead": [
    { id: "outreach-flow", title: "Sales Outreach Automation", description: "Lead gen, email sequences, follow-ups" },
    { id: "crm-sync", title: "Lead Gen + CRM Sync", description: "Capture leads from web forms directly into CRM" },
    { id: "pipeline-mgmt", title: "Pipeline Management", description: "Deal tracking, reminders, and forecasting" },
  ],
  "Customer Support": [
    { id: "ticket-auto", title: "Ticket Triage & Auto-Reply", description: "Classify, prioritize, and auto-respond to tickets" },
    { id: "feedback-loop", title: "Feedback Collection Loop", description: "Capture, analyze, and action user feedback" },
  ],
  "Developer": [
    { id: "dev-pipeline", title: "Developer Productivity Pipeline", description: "PR reviews, CI/CD notifications, deployment tracking" },
    { id: "monitoring", title: "Monitoring & Alerting", description: "Centralize logs, alerts, and incident responses" },
  ],
  "Operations": [
    { id: "analytics-reporting", title: "Analytics & Reporting Automation", description: "Automated dashboards, weekly reports, data syncs" },
    { id: "procurement", title: "Tool Procurement & Onboarding", description: "Request → approve → provision → track usage" },
  ],
  "Founder": [
    { id: "full-stack-ops", title: "Full-Stack Operations", description: "CRM + project mgmt + finance in one view" },
    { id: "growth-automation", title: "Growth Automation Stack", description: "Marketing + sales + analytics unified workflow" },
  ],
};

const WorkflowBlueprint = () => {
  const [sessionId] = useState(() => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`);
  const [step, setStep] = useState<"role" | "goal" | "stack" | "results">("role");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<Id<"novaProducts">[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const allProducts = useQuery(api.products.list, { status: "active" }) ?? [];
  const generateBlueprint = useAction(api.workflowBlueprint.generateCustomBlueprint);

  const goals = selectedRole ? workflowGoals[selectedRole] || [] : [];

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return (allProducts as ProductOption[]).filter(
      (p) =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !selectedStack.includes(p._id)
    ).slice(0, 8);
  }, [searchQuery, allProducts, selectedStack]);

  const toggleStackProduct = useCallback((id: Id<"novaProducts">) => {
    setSelectedStack((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedRole || !selectedGoal) return;
    setLoading(true);
    try {
      const result = await generateBlueprint({
        selectedRole,
        selectedUseCase: selectedGoal,
        selectedStack: selectedStack.length > 0 ? selectedStack : undefined,
        sessionId,
      });
      setResults(result);
      setStep("results");
      toast.success("Blueprint generated!");
    } catch (err) {
      console.error("Blueprint error:", err);
      toast.error("Failed to generate. Try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedGoal, selectedStack, sessionId, generateBlueprint]);

  const handleRestart = useCallback(() => {
    setStep("role");
    setSelectedRole(null);
    setSelectedGoal(null);
    setSelectedStack([]);
    setResults(null);
  }, []);

  // ---- RESULTS VIEW ----
  if (step === "results") {
    const blueprint = results?.blueprint;

    return (
      <div className="min-h-screen bg-background">
        <MetaTags title="Your AI Workflow Blueprint — TheSynLab" description="Step-by-step AI workflow blueprint with recommended tools, Trust Scores, and cost estimates." canonical="/workflow-blueprint" />
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-2"><Layers className="mr-1 h-3.5 w-3.5" />Your Blueprint</Badge>
            <h1 className="text-3xl font-bold">{blueprint?.blueprintTitle || selectedGoal}</h1>
            {blueprint?.description && <p className="mt-2 text-muted-foreground">{blueprint.description}</p>}
          </div>

          {blueprint && (
            <>
              {/* Meta info */}
              <Card className="mb-8">
                <CardContent className="flex flex-wrap items-center justify-center gap-6 p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedRole}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant={blueprint.difficulty === "Beginner" ? "outline" : blueprint.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                      {blueprint.difficulty || "Intermediate"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>~{blueprint.estimatedSetupHours}h setup</span>
                  </div>
                  {results.estimatedMonthlyCost > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>~${Math.round(results.estimatedMonthlyCost)}/mo</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Steps flow */}
              <h2 className="mb-4 text-xl font-semibold">Step-by-Step Workflow</h2>
              <div className="mb-8 space-y-4">
                {(blueprint.steps || []).map((step: any, i: number) => (
                  <div key={i} className="relative">
                    {i < (blueprint.steps?.length || 1) - 1 && (
                      <div className="absolute left-6 top-12 h-full w-0.5 bg-border" />
                    )}
                    <Card>
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {step.stepNumber || i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{step.title}</h3>
                              {step.toolName && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                  <Zap className="mr-1 h-3 w-3" />
                                  {step.toolName}
                                </Badge>
                              )}
                            </div>
                            {step.estimatedMinutes && (
                              <Badge variant="secondary" className="shrink-0 text-xs">
                                ~{step.estimatedMinutes}min
                              </Badge>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                          {step.automationPlatform && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Automation: {step.automationPlatform}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Automations & Pitfalls */}
              <div className="mb-8 grid gap-6 md:grid-cols-2">
                {blueprint.keyAutomations?.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4 text-amber-500" />Key Automations</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {blueprint.keyAutomations.map((a: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />{a}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                {blueprint.pitfalls?.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-red-500" />Pitfalls to Avoid</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {blueprint.pitfalls.map((p: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />{p}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Export */}
              <div className="flex justify-center gap-4">
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export as PDF</Button>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export as Notion Markdown</Button>
              </div>
            </>
          )}

          {!blueprint && (
            <Card className="py-12 text-center">
              <Lightbulb className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No Blueprint Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try a different role or goal combination</p>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={handleRestart}><RefreshCw className="mr-2 h-4 w-4" />Start Over</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---- STACK SELECTION VIEW ----
  if (step === "stack") {
    return (
      <div className="min-h-screen bg-background">
        <MetaTags title="AI Workflow Blueprint Generator — TheSynLab" description="Select your role and goals, and get a step-by-step AI workflow blueprint with recommended tools." canonical="/workflow-blueprint" />
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-12">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-2"><Layers className="mr-1 h-3.5 w-3.5" />Blueprint Generator</Badge>
            <h1 className="text-2xl font-bold">Select Your Current Stack</h1>
            <p className="text-sm text-muted-foreground">Optional — helps us tailor the blueprint to tools you already use</p>
          </div>

          <Card className="mx-auto max-w-lg">
            <CardContent className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                />
                {searchQuery && filteredProducts.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                    {(filteredProducts as ProductOption[]).map((p) => (
                      <button
                        key={p._id}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                        onClick={() => {
                          toggleStackProduct(p._id);
                          setSearchQuery("");
                        }}
                      >
                        <Check className={`h-3.5 w-3.5 ${selectedStack.includes(p._id) ? "text-primary" : "text-transparent"}`} />
                        {p.productName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedStack.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {(allProducts as ProductOption[]).filter((p) => selectedStack.includes(p._id)).map((p) => (
                    <Badge key={p._id} variant="secondary" className="cursor-pointer" onClick={() => toggleStackProduct(p._id)}>
                      {p.productName} ✕
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep("goal")}><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
                <Button onClick={handleGenerate} disabled={loading}>
                  {loading ? "Generating..." : <>Generate Blueprint <ArrowRight className="ml-1 h-4 w-4" /></>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // ---- GOAL SELECTION ----
  if (step === "goal" && selectedRole) {
    return (
      <div className="min-h-screen bg-background">
        <MetaTags title="AI Workflow Blueprint Generator — TheSynLab" description="Select your role and goals, and get a step-by-step AI workflow blueprint." canonical="/workflow-blueprint" />
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-12">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-2"><Layers className="mr-1 h-3.5 w-3.5" />Blueprint Generator</Badge>
            <h1 className="text-2xl font-bold">What's Your Workflow Goal?</h1>
            <p className="text-sm text-muted-foreground">Choose a pre-built workflow template for {selectedRole}</p>
          </div>

          <div className="space-y-3">
            {goals.map((g) => (
              <Card key={g.id} className="cursor-pointer transition-colors hover:border-primary/50" onClick={() => { setSelectedGoal(g.id); setStep("stack"); }}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{g.title}</h3>
                    <p className="text-xs text-muted-foreground">{g.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="ghost" onClick={() => setStep("role")}><ArrowLeft className="mr-1 h-4 w-4" />Change Role</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---- ROLE SELECTION ----
  return (
    <div className="min-h-screen bg-background">
      <ToolPageSEO
        title="AI Workflow Blueprint Generator — Build Your Automation Stack"
        description="Select your role and goals, and get a step-by-step AI workflow blueprint with recommended tools, Trust Scores, and cost estimates."
        canonical="/workflow-blueprint"
        toolName="Workflow Blueprint Generator"
        toolDescription="Select your role, choose a goal, and get a custom step-by-step automation blueprint with recommended tools and cost estimates."
        faqs={[
          { question: "How does the Workflow Blueprint work?", answer: "Select your role (Content Marketer, Sales, Developer, etc.), choose a workflow goal, optionally add your existing tools, and get a step-by-step blueprint." },
          { question: "What roles are supported?", answer: "Content Marketer, Sales Lead, Customer Support, Developer, Operations, and Founder — with pre-built goals for each." },
          { question: "Is the blueprint free?", answer: "Yes — completely free, no account required." },
        ]}
        howToSteps={[
          { name: "Select your role", text: "Choose from 6 roles: Content Marketer, Sales Lead, Customer Support, Developer, Operations, or Founder." },
          { name: "Pick a workflow goal", text: "Select a pre-built automation goal tailored to your role." },
          { name: "Add your current tools (optional)", text: "Tell us which tools you already use for a more tailored blueprint." },
          { name: "Get your blueprint", text: "Receive a complete step-by-step automation blueprint with tool recommendations, cost estimates, and pitfalls to avoid." },
        ]}
      />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2"><Layers className="mr-1 h-3.5 w-3.5" />Blueprint Generator</Badge>
          <h1 className="text-3xl font-bold">Build Your AI Workflow Blueprint</h1>
          <p className="mt-2 text-muted-foreground">Select your role, choose a goal, and get a custom step-by-step automation blueprint</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className={`cursor-pointer transition-all hover:border-primary/50 ${selectedRole === role.id ? "border-primary ring-1 ring-primary" : ""}`} onClick={() => { setSelectedRole(role.id); setStep("goal"); }}>
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {role.icon}
                </div>
                <h3 className="font-medium">{role.label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{role.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkflowBlueprint;
