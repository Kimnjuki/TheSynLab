import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { chatCompletion } from "@/lib/ai/client";
import {
  Bot, Zap, FileText, ArrowRight, Check, X, Copy,
  Sparkles, Brain, MessageSquare, Code, Image, Search,
  GitBranch, Play, Pause, RotateCcw, Save, Trash2, BookOpen,
  Loader2, Lightbulb, Cpu, Globe, Wand2, ClipboardList,
  Terminal, ChevronRight, ExternalLink, Share2, Plus, Clock,
  Target, Rocket
} from "lucide-react";
import { toast } from "sonner";
import { useSavedPrompts, useWorkflowConfigs } from "@/hooks/useHubData";
import { useAuth } from "@/contexts/AuthContext";

// ─── Workflow Node Types ───
const nodeTypes = [
  { id: "trigger", label: "Trigger", icon: Zap, color: "bg-yellow-500" },
  { id: "ai", label: "AI Agent", icon: Brain, color: "bg-purple-500" },
  { id: "action", label: "Action", icon: Play, color: "bg-blue-500" },
  { id: "condition", label: "Condition", icon: GitBranch, color: "bg-orange-500" },
];

// ─── AI Agents for Comparison ───
const aiAgents = [
  {
    id: "nvidia",
    name: "Llama 3.1 70B",
    provider: "NVIDIA NIM",
    strengths: ["Speed", "Reasoning", "Open-source", "Cost-effective"],
    weaknesses: ["No multimodal", "Context window"],
    bestFor: ["Real-time chat", "Content generation", "Product comparisons", "Code generation"],
    pricing: "Free tier + $0.50/1M tokens",
    speed: 90,
    accuracy: 91,
    costEfficiency: 95,
  },
  {
    id: "gpt4",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    strengths: ["Reasoning", "Code Generation", "Creative Writing"],
    weaknesses: ["Speed", "Cost"],
    bestFor: ["Complex analysis", "Long-form content", "Technical tasks"],
    pricing: "$10/1M input, $30/1M output",
    speed: 65,
    accuracy: 95,
    costEfficiency: 60,
  },
  {
    id: "claude",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    strengths: ["Safety", "Long Context", "Nuanced responses"],
    weaknesses: ["Real-time data", "Image generation"],
    bestFor: ["Research", "Document analysis", "Customer support"],
    pricing: "$3/1M input, $15/1M output",
    speed: 80,
    accuracy: 92,
    costEfficiency: 85,
  },
  {
    id: "gemini",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    strengths: ["Multimodal", "Speed", "Integration"],
    weaknesses: ["Consistency", "Complex reasoning"],
    bestFor: ["Quick tasks", "Image understanding", "Google ecosystem"],
    pricing: "$0.075/1M input, $0.30/1M output",
    speed: 95,
    accuracy: 88,
    costEfficiency: 95,
  },
];

// ─── Prompt Templates ───
const promptTemplates = [
  {
    id: 1,
    category: "Content Creation",
    title: "Blog Post Outline Generator",
    description: "Create structured outlines for blog posts with SEO optimization",
    prompt: `You are an expert content strategist. Create a detailed blog post outline for the topic: [TOPIC]

Include:
1. Compelling headline options (3 variations)
2. Meta description (155 characters)
3. Introduction hook
4. 5-7 main sections with subpoints
5. Key statistics to include
6. Call-to-action suggestions
7. Internal/external linking opportunities

Target audience: [AUDIENCE]
Tone: [TONE]`,
    variables: ["TOPIC", "AUDIENCE", "TONE"],
    uses: 1247,
  },
  {
    id: 2,
    category: "Code Generation",
    title: "React Component Builder",
    description: "Generate TypeScript React components with best practices",
    prompt: `Create a React functional component with the following specifications:

Component Name: [COMPONENT_NAME]
Purpose: [PURPOSE]
Props: [PROPS]

Requirements:
- Use TypeScript with proper interfaces
- Include proper JSDoc comments
- Follow React best practices
- Use Tailwind CSS for styling
- Include error handling
- Add loading states if applicable
- Make it accessible (ARIA labels)

Return the complete component code.`,
    variables: ["COMPONENT_NAME", "PURPOSE", "PROPS"],
    uses: 892,
  },
  {
    id: 3,
    category: "Data Analysis",
    title: "Data Insight Extractor",
    description: "Analyze datasets and extract actionable insights",
    prompt: `Analyze the following data and provide insights:

Data: [DATA]

Please provide:
1. Executive Summary (2-3 sentences)
2. Key Trends Identified
3. Anomalies or Outliers
4. Actionable Recommendations
5. Visualization Suggestions
6. Questions for Further Investigation

Format the response with clear headers and bullet points.`,
    variables: ["DATA"],
    uses: 654,
  },
  {
    id: 4,
    category: "Customer Support",
    title: "Support Response Generator",
    description: "Create empathetic and helpful customer support responses",
    prompt: `You are a friendly customer support agent for [COMPANY].

Customer Issue: [ISSUE]
Customer Sentiment: [SENTIMENT]
Previous Interactions: [HISTORY]

Generate a response that:
1. Acknowledges their frustration (if applicable)
2. Clearly explains the solution
3. Provides step-by-step instructions
4. Offers additional help
5. Ends with a positive note

Tone: Professional yet warm
Max length: 200 words`,
    variables: ["COMPANY", "ISSUE", "SENTIMENT", "HISTORY"],
    uses: 2103,
  },
  {
    id: 5,
    category: "Marketing",
    title: "Ad Copy Variations",
    description: "Generate multiple ad copy variations for A/B testing",
    prompt: `Create 5 ad copy variations for:

Product/Service: [PRODUCT]
Target Platform: [PLATFORM]
Goal: [GOAL]
Character Limit: [LIMIT]

For each variation, provide:
- Headline
- Body copy
- Call-to-action
- Emotional angle used

Include variations for: urgency, social proof, benefit-focused, problem-solution, and curiosity-driven approaches.`,
    variables: ["PRODUCT", "PLATFORM", "GOAL", "LIMIT"],
    uses: 1567,
  },
];

// ─── Try-It-Yourself Starter Workflows ───
const starterWorkflows = [
  {
    id: "blog-writer",
    title: "AI Blog Writer",
    description: "Write a complete blog post from a topic idea",
    icon: FileText,
    color: "bg-blue-500",
    systemPrompt: "You are a professional blog writer. Write a complete, well-structured blog post with introduction, body sections, and conclusion. Use clear headings and actionable advice. Keep the tone {tone} and target {audience}.",
  },
  {
    id: "product-compare",
    title: "SaaS Product Comparison",
    description: "Generate a detailed product comparison table",
    icon: ClipboardList,
    color: "bg-purple-500",
    systemPrompt: "You are a SaaS product analyst. Create a detailed comparison of {product1} vs {product2}. Include: key features, pricing, pros/cons, ideal user profiles, and a final recommendation. Format with clear sections.",
  },
  {
    id: "code-gen",
    title: "Code Generator",
    description: "Generate code snippets from natural language",
    icon: Terminal,
    color: "bg-green-500",
    systemPrompt: "You are a senior software engineer. Write clean, well-documented code for the following request. Use TypeScript. Include types, error handling, and JSDoc comments. Explain your approach briefly before the code.",
  },
  {
    id: "social-post",
    title: "Social Media Post",
    description: "Create engaging social media content",
    icon: Share2,
    color: "bg-orange-500",
    systemPrompt: "You are a social media strategist. Create {count} social media posts about {topic} for {platform}. Each post should be engaging, include relevant hashtags, and have a clear call-to-action. Vary the format between informative, entertaining, and promotional.",
  },
];

// ─── Sample Workflow for Visualizer ───
const sampleWorkflow = [
  { id: 1, type: "trigger", label: "New Email Received", x: 50, y: 100 },
  { id: 2, type: "condition", label: "Contains Invoice?", x: 250, y: 100 },
  { id: 3, type: "ai", label: "Extract Data", x: 450, y: 50 },
  { id: 4, type: "action", label: "Save to Database", x: 650, y: 50 },
  { id: 5, type: "action", label: "Archive Email", x: 450, y: 150 },
];

// ─── Tool icon helper ───
// We need a Tool icon that doesn't exist in lucide. Use Wrench as substitute
const ToolIcon = () => <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const TargetIcon = () => <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const RocketIcon = () => <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>;

// ─── Code Examples ───
const CODE_CURL_EXAMPLE = `curl -X POST https://integrate.api.nvidia.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_NVIDIA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '` + String.fromCharCode(123) + `"model":"meta/llama-3.1-8b-instruct","messages":[` + String.fromCharCode(123) + `"role":"user","content":"Hello!"` + String.fromCharCode(125) + `]` + String.fromCharCode(125) + `'`;

const CODE_CLIENT_EXAMPLE = `// src/lib/ai/client.ts - every AI feature uses this
import { chatCompletion } from "@/lib/ai/client";

const result = await chatCompletion([
  ` + String.fromCharCode(123) + ` role: "system", content: systemPrompt ` + String.fromCharCode(125) + `,
  ` + String.fromCharCode(123) + ` role: "user", content: userPrompt ` + String.fromCharCode(125) + `,
], ` + String.fromCharCode(123) + ` temperature: 0.7, maxTokens: 1536 ` + String.fromCharCode(125) + `);`;

const AIWorkflowHub = () => {
  const { user } = useAuth();
  const { prompts: savedPrompts, savePrompt, deletePrompt } = useSavedPrompts();
  const { configs: savedWorkflows, saveConfig: saveWorkflow, deleteConfig: deleteWorkflow } = useWorkflowConfigs();

  const [selectedTemplate, setSelectedTemplate] = useState<typeof promptTemplates[0] | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [compareAgents, setCompareAgents] = useState<string[]>(["nvidia", "claude"]);
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");

  // Live sandbox state
  const [sandboxWorkflow, setSandboxWorkflow] = useState(starterWorkflows[0].id);
  const [sandboxInputs, setSandboxInputs] = useState<Record<string, string>>({});
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxHistory, setSandboxHistory] = useState<
    Array<{ workflow: string; input: Record<string, string>; output: string; timestamp: string }>
  >([]);
  const [customPrompt, setCustomPrompt] = useState("");

  const hasNvidiaKey = Boolean(import.meta.env.VITE_NVIDIA_API_KEY);

  const handleTemplateSelect = (template: typeof promptTemplates[0]) => {
    setSelectedTemplate(template);
    const vars: Record<string, string> = {};
    template.variables.forEach((v) => (vars[v] = ""));
    setTemplateVariables(vars);
    setGeneratedPrompt("");
  };

  const generatePrompt = () => {
    if (!selectedTemplate) return;
    let result = selectedTemplate.prompt;
    Object.entries(templateVariables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\[${key}\\]`, "g"), value || `[${key}]`);
    });
    setGeneratedPrompt(result);
    toast.success("Prompt generated!");
  };

  const copyText = useCallback((text: string, label = "Copied!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  }, []);

  const toggleAgentCompare = (agentId: string) => {
    setCompareAgents((prev) => {
      if (prev.includes(agentId)) return prev.filter((id) => id !== agentId);
      if (prev.length >= 3) {
        toast.error("Maximum 3 agents for comparison");
        return prev;
      }
      return [...prev, agentId];
    });
  };

  const runWorkflowDemo = () => {
    setWorkflowRunning(true);
    toast.info("Running workflow simulation...");
    setTimeout(() => {
      setWorkflowRunning(false);
      toast.success("Workflow completed successfully!");
    }, 3000);
  };

  const handleSavePrompt = async () => {
    if (!generatedPrompt) { toast.error("Generate a prompt first"); return; }
    if (!promptTitle.trim()) { toast.error("Please enter a title"); return; }
    await savePrompt({
      template_id: selectedTemplate?.id || null,
      custom_prompt: generatedPrompt,
      variables: templateVariables,
      title: promptTitle,
      category: selectedTemplate?.category || "Custom",
    });
    setPromptTitle("");
  };

  const handleSaveWorkflow = async () => {
    await saveWorkflow({
      name: "Email Invoice Workflow",
      description: "Automated email invoice processing",
      workflow_nodes: sampleWorkflow,
      workflow_connections: [],
      is_active: true,
    });
  };

  // ─── Sandbox: Live NVIDIA-powered AI ───
  const runSandbox = useCallback(async () => {
    const workflow = starterWorkflows.find((w) => w.id === sandboxWorkflow);
    if (!workflow) return;

    let systemPrompt = workflow.systemPrompt;
    Object.entries(sandboxInputs).forEach(([key, value]) => {
      systemPrompt = systemPrompt.replace(`{${key}}`, value || `[${key}]`);
    });

    const userPrompt =
      customPrompt ||
      `Execute this workflow. Generate the output based on the instructions provided.`;

    setSandboxLoading(true);
    setSandboxOutput("");

    try {
      const result = await chatCompletion(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        { temperature: 0.7, maxTokens: 1536 }
      );

      setSandboxOutput(result);
      setSandboxHistory((prev) =>
        [
          {
            workflow: sandboxWorkflow,
            input: { ...sandboxInputs },
            output: result,
            timestamp: new Date().toLocaleString(),
          },
          ...prev,
        ].slice(0, 10)
      );

      toast.success("Output generated!");
    } catch (err) {
      setSandboxOutput(
        "An error occurred. Please check your API configuration.\n\n" +
          (err instanceof Error ? err.message : "")
      );
      toast.error("Failed to generate");
    } finally {
      setSandboxLoading(false);
    }
  }, [sandboxWorkflow, sandboxInputs, customPrompt]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MetaTags
        title="AI Workflow Hub — Build, Test & Deploy AI Workflows with NVIDIA"
        description="Build interactive AI workflows powered by NVIDIA NIM. Test prompts, generate content, compare AI agents, and create automation workflows live."
        canonical="/hub/ai-workflow"
      />
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Workflow Hub</h1>
              <p className="text-muted-foreground">
                Build, test, and deploy AI-powered automation workflows &mdash; live, interactive, and
                running on <Cpu className="h-3.5 w-3.5 inline" /> <strong className="text-purple-500">NVIDIA NIM</strong>
              </p>
            </div>
          </div>

          {/* API status banner */}
          {!hasNvidiaKey && (
            <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 text-sm text-amber-600 flex items-center gap-2">
              <Cpu className="h-4 w-4 shrink-0" />
              <span>
                <strong>NVIDIA NIM not configured.</strong> Missing{" "}
                <code className="text-xs bg-amber-500/10 px-1 py-0.5 rounded">
                  VITE_NVIDIA_API_KEY
                </code>{" "}
                in environment. The sandbox will show example output.{" "}
                <a
                  href="https://build.nvidia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-800"
                >
                  Get a free key &rarr;
                </a>
              </span>
            </div>
          )}
        </div>

        <Tabs defaultValue="sandbox" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="sandbox" className="gap-2">
              <Wand2 className="h-4 w-4" />
              Try It Yourself
            </TabsTrigger>
            <TabsTrigger value="visualizer" className="gap-2">
              <GitBranch className="h-4 w-4" />
              Workflow Visualizer
            </TabsTrigger>
            <TabsTrigger value="compare" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Agent Comparison
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Prompt Templates
            </TabsTrigger>
          </TabsList>

          {/* ════════════════════════════════════════════════════════
              TAB 1: Try It Yourself — Live NVIDIA Sandbox
              ════════════════════════════════════════════════════════ */}
          <TabsContent value="sandbox" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* ─── Input: Configuration ─── */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Wand2 className="h-5 w-5 text-purple-500" />
                      Choose Your Workflow
                    </CardTitle>
                    <CardDescription>
                      Select a starter workflow, fill in the parameters, and generate live content
                      with NVIDIA NIM (<strong>Llama 3.1 70B</strong>).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Workflow selector cards */}
                    <div className="grid grid-cols-2 gap-2">
                      {starterWorkflows.map((wf) => {
                        const Icon = wf.icon;
                        const isActive = sandboxWorkflow === wf.id;
                        return (
                          <button
                            key={wf.id}
                            type="button"
                            onClick={() => {
                              setSandboxWorkflow(wf.id);
                              setSandboxOutput("");
                              setSandboxInputs({});
                            }}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              isActive
                                ? "border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/30"
                                : "border-border hover:border-purple-500/30 bg-card"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div
                                className={`h-6 w-6 rounded ${wf.color} flex items-center justify-center`}
                              >
                                <Icon className="h-3.5 w-3.5 text-white" />
                              </div>
                              <span className="text-sm font-medium">{wf.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{wf.description}</p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Dynamic parameter inputs */}
                    <div className="space-y-3 pt-2 border-t">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Parameters
                      </p>
                      {(() => {
                        const workflow = starterWorkflows.find((w) => w.id === sandboxWorkflow);
                        if (!workflow) return null;
                        const params =
                          workflow.systemPrompt
                            .match(/\{(\w+)\}/g)
                            ?.map((p) => p.slice(1, -1)) || [];

                        return params.map((param) => (
                          <div key={param}>
                            <label className="text-xs font-medium mb-1 block capitalize">
                              {param.replace(/_/g, " ")}
                            </label>
                            {param === "tone" ? (
                              <Select
                                value={sandboxInputs[param] || ""}
                                onValueChange={(v) =>
                                  setSandboxInputs((prev) => ({ ...prev, [param]: v }))
                                }
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder="Select tone..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="professional">Professional</SelectItem>
                                  <SelectItem value="conversational">Conversational</SelectItem>
                                  <SelectItem value="humorous">Humorous</SelectItem>
                                  <SelectItem value="technical">Technical</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : param === "audience" ? (
                              <Select
                                value={sandboxInputs[param] || ""}
                                onValueChange={(v) =>
                                  setSandboxInputs((prev) => ({ ...prev, [param]: v }))
                                }
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder="Select audience..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beginners">Beginners</SelectItem>
                                  <SelectItem value="intermediate">Intermediate</SelectItem>
                                  <SelectItem value="experts">Experts</SelectItem>
                                  <SelectItem value="general">General audience</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : param === "platform" ? (
                              <Select
                                value={sandboxInputs[param] || ""}
                                onValueChange={(v) =>
                                  setSandboxInputs((prev) => ({ ...prev, [param]: v }))
                                }
                              >
                                <SelectTrigger className="h-9 text-sm">
                                  <SelectValue placeholder="Select platform..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Twitter/X">Twitter / X</SelectItem>
                                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                  <SelectItem value="Instagram">Instagram</SelectItem>
                                  <SelectItem value="TikTok">TikTok</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : param === "count" ? (
                              <Input
                                type="number"
                                min={1}
                                max={10}
                                value={sandboxInputs[param] || "3"}
                                onChange={(e) =>
                                  setSandboxInputs((prev) => ({
                                    ...prev,
                                    [param]: e.target.value,
                                  }))
                                }
                                className="h-9 text-sm"
                              />
                            ) : (
                              <Input
                                value={sandboxInputs[param] || ""}
                                onChange={(e) =>
                                  setSandboxInputs((prev) => ({
                                    ...prev,
                                    [param]: e.target.value,
                                  }))
                                }
                                placeholder={`Enter ${param.replace(/_/g, " ")}...`}
                                className="h-9 text-sm"
                              />
                            )}
                          </div>
                        ));
                      })()}
                    </div>

                    {/* Custom prompt */}
                    <div className="space-y-2 pt-2 border-t">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Additional Instructions{" "}
                        <span className="text-[10px] font-normal lowercase">(optional)</span>
                      </label>
                      <Textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Tell the AI more about what you want..."
                        className="min-h-[60px] text-sm resize-none"
                      />
                    </div>

                    <Button
                      onClick={runSandbox}
                      disabled={sandboxLoading}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {sandboxLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Zap className="h-5 w-5" />
                      )}
                      {sandboxLoading ? "Generating with NVIDIA NIM..." : "Generate"}
                    </Button>

                    {hasNvidiaKey && (
                      <p className="text-[10px] text-muted-foreground text-center">
                        Running on <strong className="text-purple-500">NVIDIA NIM</strong> via{" "}
                        <Cpu className="h-3 w-3 inline" /> Llama 3.1 70B
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* ─── Output: Results ─── */}
              <div className="space-y-4">
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Output
                      </CardTitle>
                      {sandboxOutput && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => copyText(sandboxOutput, "Output copied!")}
                          >
                            <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                              setSandboxOutput("");
                              setCustomPrompt("");
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <CardDescription>
                      {sandboxLoading
                        ? "Processing your request..."
                        : sandboxOutput
                          ? "Generated result"
                          : "Configure and generate to see output"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {sandboxLoading ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse" />
                          <span className="animate-pulse">Contacting NVIDIA NIM...</span>
                        </div>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="h-4 bg-muted animate-pulse rounded"
                            style={{ width: `${60 + i * 10}%` }}
                          />
                        ))}
                      </div>
                    ) : sandboxOutput ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {sandboxOutput}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                        <Wand2 className="h-8 w-8 mb-2 opacity-40" />
                        <p className="text-sm">Your generated content will appear here</p>
                        <p className="text-xs mt-1">
                          Select a workflow, fill in the parameters, and click Generate
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* History */}
                {sandboxHistory.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Recent Generations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-40 overflow-y-auto">
                      {sandboxHistory.map((entry, i) => {
                        const wf = starterWorkflows.find((w) => w.id === entry.workflow);
                        return (
                          <div
                            key={i}
                            className="flex items-start gap-2 p-2 rounded border border-border bg-card/50 text-xs"
                          >
                            {wf && (
                              <wf.icon
                                className={`h-4 w-4 mt-0.5 ${wf.color.replace("bg-", "text-").replace("-500", "")}-500`}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{wf?.title || entry.workflow}</p>
                              <p className="text-muted-foreground truncate">
                                {entry.output.slice(0, 100)}...
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {entry.timestamp}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 shrink-0"
                              onClick={() => {
                                setSandboxOutput(entry.output);
                                copyText(entry.output, "Loaded from history");
                              }}
                            >
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* ─── How to Create Your Own Workflow ─── */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  How to Build Your Own AI Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    {
                      step: 1,
                      title: "Choose a Goal",
                      desc: "Decide what you want to automate &mdash; blogging, comparisons, support tickets, or code generation.",
                    },
                    {
                      step: 2,
                      title: "Pick Your Tools",
                      desc: "Choose AI tools like NVIDIA NIM, Zapier, or custom code. Most have free tiers to start.",
                    },
                    {
                      step: 3,
                      title: "Build the Workflow",
                      desc: "Connect triggers &rarr; AI agents &rarr; actions using the visual builder or a simple script.",
                    },
                    {
                      step: 4,
                      title: "Deploy &amp; Scale",
                      desc: "Run on a schedule, via webhook, or manually. Monitor with analytics and iterate.",
                    },
                  ].map(({ step, title, desc }) => (
                    <div key={step} className="p-4 rounded-lg border bg-card">
                      <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
                        <span className="text-sm font-bold text-purple-500">{step}</span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{title}</h4>
                      <p
                        className="text-xs text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: desc }}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg border border-purple-500/20 bg-purple-500/5">
                  <div className="flex items-start gap-3">
                    <Cpu className="h-5 w-5 text-purple-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-sm mb-1">
                        Pro Tip: Use NVIDIA NIM for Free
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        NVIDIA offers generous free credits for Llama 3.1 models. Sign up at{" "}
                        <a
                          href="https://build.nvidia.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-500 hover:underline">
                        build.nvidia.com
                      </a>, get your API key, and add it as <code className="text-xs bg-purple-500/10 px-1 rounded">VITE_NVIDIA_API_KEY</code> in your environment.
                      The same key works across all TheSynLab AI features.
                    </p>
                  </div>
                </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://build.nvidia.com/explore/discover" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Explore NVIDIA NIM Models
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developer.nvidia.com/nim" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="h-3.5 w-3.5 mr-1" />
                      NIM Documentation
                    </a>
                  </Button>
                </div>

                {/* Code snippet: how to replicate */}
                <div className="mt-6 p-4 rounded-lg border">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-green-500" />
                    How to Replicate This Workflow Yourself
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-medium mb-1">1. Get a free NVIDIA API key</p>
                      <div className="bg-muted p-2 rounded overflow-x-auto font-mono text-xs whitespace-pre-wrap">{CODE_CURL_EXAMPLE}</div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">2. Add the key to your project</p>
                      <div className="bg-muted p-2 rounded overflow-x-auto font-mono text-xs whitespace-pre-wrap">{"echo \"VITE_NVIDIA_API_KEY=your-key-here\" >> .env\n# That's it. The AI features activate automatically."}</div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">3. The SynLab client handles the rest</p>
                      <div className="bg-muted p-2 rounded overflow-x-auto font-mono text-xs whitespace-pre-wrap">{CODE_CLIENT_EXAMPLE}</div>
                    </div>
                    <p className="text-muted-foreground mt-2">
                      That&apos;s it! The workflow above uses the exact same API. NVIDIA NIM gives you 
                      access to Llama 3.1, Nemotron, Mixtral, and 100+ other models.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AIWorkflowHub;
