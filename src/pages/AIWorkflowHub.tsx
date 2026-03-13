import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, Zap, FileText, ArrowRight, Check, X, Copy, 
  Sparkles, Brain, MessageSquare, Code, Image, Search,
  GitBranch, Play, Pause, RotateCcw, Save, Trash2, BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { useSavedPrompts, useWorkflowConfigs } from "@/hooks/useHubData";
import { useAuth } from "@/contexts/AuthContext";

// Workflow Node Types
const nodeTypes = [
  { id: "trigger", label: "Trigger", icon: Zap, color: "bg-yellow-500" },
  { id: "ai", label: "AI Agent", icon: Brain, color: "bg-purple-500" },
  { id: "action", label: "Action", icon: Play, color: "bg-blue-500" },
  { id: "condition", label: "Condition", icon: GitBranch, color: "bg-orange-500" },
];

// AI Agents for Comparison
const aiAgents = [
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
  {
    id: "llama",
    name: "Llama 3.3 70B",
    provider: "Meta",
    strengths: ["Open source", "Customizable", "Privacy"],
    weaknesses: ["Setup complexity", "No cloud hosting"],
    bestFor: ["Self-hosting", "Fine-tuning", "Privacy-sensitive"],
    pricing: "Free (self-hosted)",
    speed: 75,
    accuracy: 85,
    costEfficiency: 100,
  },
];

// Prompt Templates
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

// Sample workflow for visualization
const sampleWorkflow = [
  { id: 1, type: "trigger", label: "New Email Received", x: 50, y: 100 },
  { id: 2, type: "condition", label: "Contains Invoice?", x: 250, y: 100 },
  { id: 3, type: "ai", label: "Extract Data", x: 450, y: 50 },
  { id: 4, type: "action", label: "Save to Database", x: 650, y: 50 },
  { id: 5, type: "action", label: "Archive Email", x: 450, y: 150 },
];

const AIWorkflowHub = () => {
  const { user } = useAuth();
  const { prompts: savedPrompts, savePrompt, deletePrompt } = useSavedPrompts();
  const { configs: savedWorkflows, saveConfig: saveWorkflow, deleteConfig: deleteWorkflow } = useWorkflowConfigs();
  
  const [selectedTemplate, setSelectedTemplate] = useState<typeof promptTemplates[0] | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [compareAgents, setCompareAgents] = useState<string[]>(["gpt4", "claude"]);
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [promptTitle, setPromptTitle] = useState("");

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

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Copied to clipboard!");
  };

  const toggleAgentCompare = (agentId: string) => {
    setCompareAgents((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId);
      }
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
    if (!generatedPrompt) {
      toast.error("Generate a prompt first");
      return;
    }
    if (!promptTitle.trim()) {
      toast.error("Please enter a title for your prompt");
      return;
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Workflow Hub</h1>
              <p className="text-muted-foreground">
                Build, compare, and optimize AI-powered workflows
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="visualizer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
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

          {/* Workflow Visualizer */}
          <TabsContent value="visualizer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Interactive Workflow Builder
                </CardTitle>
                <CardDescription>
                  Visualize and design AI automation workflows with our node-based editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  {nodeTypes.map((node) => (
                    <div
                      key={node.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className={`h-6 w-6 rounded ${node.color} flex items-center justify-center`}>
                        <node.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{node.label}</span>
                    </div>
                  ))}
                </div>

                {/* Workflow Canvas */}
                <div className="relative h-[300px] rounded-xl border-2 border-dashed bg-muted/30 overflow-hidden">
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Connection lines */}
                    <line x1="130" y1="100" x2="250" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray={workflowRunning ? "5,5" : "0"}>
                      {workflowRunning && <animate attributeName="stroke-dashoffset" from="10" to="0" dur="0.5s" repeatCount="indefinite" />}
                    </line>
                    <line x1="330" y1="100" x2="450" y2="75" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray={workflowRunning ? "5,5" : "0"} />
                    <line x1="330" y1="100" x2="450" y2="150" stroke="hsl(var(--muted-foreground))" strokeWidth="2" strokeDasharray="4,4" />
                    <line x1="530" y1="75" x2="650" y2="75" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray={workflowRunning ? "5,5" : "0"} />
                  </svg>

                  {sampleWorkflow.map((node) => {
                    const nodeType = nodeTypes.find((n) => n.id === node.type);
                    return (
                      <div
                        key={node.id}
                        className={`absolute px-4 py-2 rounded-lg border-2 bg-card shadow-lg transition-all ${
                          workflowRunning ? "animate-pulse" : ""
                        }`}
                        style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded ${nodeType?.color} flex items-center justify-center`}>
                            {nodeType && <nodeType.icon className="h-4 w-4 text-white" />}
                          </div>
                          <span className="text-xs font-medium whitespace-nowrap">{node.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Sample: Email Invoice Processing Workflow
                  </p>
                  <div className="flex gap-2">
                    {user && (
                      <Button variant="outline" size="sm" onClick={handleSaveWorkflow}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setWorkflowRunning(false)} disabled={!workflowRunning}>
                      <Pause className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                    <Button size="sm" onClick={runWorkflowDemo} disabled={workflowRunning}>
                      <Play className="h-4 w-4 mr-1" />
                      Run Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Active Workflows", value: "12", icon: GitBranch },
                { label: "Tasks Automated", value: "3,847", icon: Zap },
                { label: "Time Saved", value: "127h", icon: RotateCcw },
                { label: "Success Rate", value: "99.2%", icon: Check },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Agent Comparison */}
          <TabsContent value="compare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Compare AI Agents
                </CardTitle>
                <CardDescription>
                  Select up to 3 AI models to compare their capabilities side-by-side
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {aiAgents.map((agent) => (
                    <Button
                      key={agent.id}
                      variant={compareAgents.includes(agent.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAgentCompare(agent.id)}
                    >
                      {agent.name}
                      {compareAgents.includes(agent.id) && <Check className="h-4 w-4 ml-1" />}
                    </Button>
                  ))}
                </div>

                <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${compareAgents.length}, 1fr)` }}>
                  {compareAgents.map((agentId) => {
                    const agent = aiAgents.find((a) => a.id === agentId);
                    if (!agent) return null;
                    return (
                      <Card key={agent.id} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <Badge variant="secondary">{agent.provider}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{agent.pricing}</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Speed</span>
                              <span>{agent.speed}%</span>
                            </div>
                            <Progress value={agent.speed} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Accuracy</span>
                              <span>{agent.accuracy}%</span>
                            </div>
                            <Progress value={agent.accuracy} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Cost Efficiency</span>
                              <span>{agent.costEfficiency}%</span>
                            </div>
                            <Progress value={agent.costEfficiency} className="h-2" />
                          </div>

                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Strengths</p>
                            <div className="flex flex-wrap gap-1">
                              {agent.strengths.map((s) => (
                                <Badge key={s} variant="outline" className="text-xs bg-green-500/10 text-green-600">
                                  <Check className="h-3 w-3 mr-1" />
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">Weaknesses</p>
                            <div className="flex flex-wrap gap-1">
                              {agent.weaknesses.map((w) => (
                                <Badge key={w} variant="outline" className="text-xs bg-red-500/10 text-red-600">
                                  <X className="h-3 w-3 mr-1" />
                                  {w}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Best For</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {agent.bestFor.map((use) => (
                                <li key={use} className="flex items-center gap-2">
                                  <ArrowRight className="h-3 w-3 text-primary" />
                                  {use}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prompt Templates */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Template List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Prompt Template Library
                  </CardTitle>
                  <CardDescription>
                    Curated prompts for common AI workflows
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {promptTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary ${
                        selectedTemplate?.id === template.id ? "border-primary bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {template.category}
                          </Badge>
                          <h4 className="font-medium">{template.title}</h4>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{template.uses} uses</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Template Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    {selectedTemplate ? "Customize Template" : "Select a Template"}
                  </CardTitle>
                  <CardDescription>
                    {selectedTemplate
                      ? "Fill in the variables to generate your prompt"
                      : "Click on a template to start customizing"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedTemplate ? (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        {selectedTemplate.variables.map((variable) => (
                          <div key={variable}>
                            <label className="text-sm font-medium mb-1 block">{variable}</label>
                            <Input
                              placeholder={`Enter ${variable.toLowerCase()}...`}
                              value={templateVariables[variable] || ""}
                              onChange={(e) =>
                                setTemplateVariables((prev) => ({
                                  ...prev,
                                  [variable]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        ))}
                      </div>

                      <Button onClick={generatePrompt} className="w-full">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Prompt
                      </Button>

                      {generatedPrompt && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Generated Prompt</label>
                            <Button variant="ghost" size="sm" onClick={copyPrompt}>
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <Textarea
                            value={generatedPrompt}
                            onChange={(e) => setGeneratedPrompt(e.target.value)}
                            className="min-h-[200px] font-mono text-sm"
                          />
                          
                          {user && (
                            <div className="flex gap-2 pt-2">
                              <Input
                                placeholder="Enter a title for your prompt..."
                                value={promptTitle}
                                onChange={(e) => setPromptTitle(e.target.value)}
                              />
                              <Button onClick={handleSavePrompt}>
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                      <FileText className="h-12 w-12 mb-4 opacity-50" />
                      <p>Select a template from the list</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AIWorkflowHub;
