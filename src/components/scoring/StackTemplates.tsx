import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers, CheckCircle2, DollarSign, Shield, Link2, Star,
  User, Users, Building, Home, Laptop, Briefcase, Sparkles,
  ArrowRight, Copy, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface StackProduct {
  name: string;
  category: string;
  role: string;
  trustScore: number;
  integrationScore: number;
  price: string;
  whyChosen: string;
  alternatives?: string[];
}

interface StackTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  teamSize: string;
  totalCost: string;
  avgTrustScore: number;
  avgIntegrationScore: number;
  products: StackProduct[];
  synergies: string[];
  useCases: string[];
}

const stackTemplates: StackTemplate[] = [
  {
    id: "solo-founder",
    title: "Solo Founder Stack",
    description: "Lean, powerful tools for bootstrapped founders",
    icon: User,
    category: "Productivity",
    teamSize: "1 person",
    totalCost: "$50-100/mo",
    avgTrustScore: 8.5,
    avgIntegrationScore: 8.8,
    products: [
      {
        name: "Notion",
        category: "Knowledge Base",
        role: "Central hub for docs, tasks, and planning",
        trustScore: 8.2,
        integrationScore: 8.8,
        price: "$10/mo",
        whyChosen: "All-in-one workspace replaces 5+ separate tools",
        alternatives: ["Obsidian (free)", "Coda"]
      },
      {
        name: "Linear",
        category: "Task Management",
        role: "Fast issue tracking and roadmap",
        trustScore: 8.5,
        integrationScore: 8.9,
        price: "$8/mo",
        whyChosen: "Keyboard-first speed, excellent for solo dev work",
        alternatives: ["GitHub Issues (free)", "Todoist"]
      },
      {
        name: "Vercel",
        category: "Hosting",
        role: "Deploy and host web applications",
        trustScore: 8.3,
        integrationScore: 9.2,
        price: "$20/mo",
        whyChosen: "Zero-config deploys, great DX, generous free tier",
        alternatives: ["Netlify", "Railway"]
      },
      {
        name: "Convex",
        category: "Backend",
        role: "Database, realtime, and serverless functions",
        trustScore: 8.7,
        integrationScore: 8.5,
        price: "Free tier / usage-based",
        whyChosen: "Realtime backend with type-safe API and React hooks",
        alternatives: ["Supabase", "Firebase"]
      }
    ],
    synergies: [
      "Notion → Linear: Link docs to issues seamlessly",
      "Vercel → Convex: Type-safe backend with realtime sync",
      "All tools have Slack integrations for notifications"
    ],
    useCases: ["SaaS MVPs", "Side projects", "Indie hacking", "Consulting"]
  },
  {
    id: "10-person-agency",
    title: "10-Person Agency Stack",
    description: "Collaborative tools for growing creative agencies",
    icon: Users,
    category: "Agency",
    teamSize: "10 people",
    totalCost: "$500-800/mo",
    avgTrustScore: 8.3,
    avgIntegrationScore: 9.0,
    products: [
      {
        name: "Slack",
        category: "Communication",
        role: "Real-time team communication",
        trustScore: 7.8,
        integrationScore: 9.5,
        price: "$87.50/mo",
        whyChosen: "Industry standard, connects to everything",
        alternatives: ["Microsoft Teams", "Discord"]
      },
      {
        name: "Notion",
        category: "Wiki & Docs",
        role: "Client deliverables, SOPs, knowledge base",
        trustScore: 8.2,
        integrationScore: 8.8,
        price: "$100/mo",
        whyChosen: "Client-facing pages, templates, databases",
        alternatives: ["Confluence", "Slite"]
      },
      {
        name: "Figma",
        category: "Design",
        role: "Collaborative design and prototyping",
        trustScore: 8.5,
        integrationScore: 8.8,
        price: "$150/mo",
        whyChosen: "Real-time collaboration, dev handoff, FigJam",
        alternatives: ["Sketch", "Adobe XD"]
      },
      {
        name: "Linear",
        category: "Project Management",
        role: "Sprint planning and issue tracking",
        trustScore: 8.5,
        integrationScore: 8.9,
        price: "$80/mo",
        whyChosen: "Clean UI, fast, excellent for product teams",
        alternatives: ["Asana", "Monday.com"]
      },
      {
        name: "Harvest + Forecast",
        category: "Time & Resource",
        role: "Time tracking and capacity planning",
        trustScore: 8.0,
        integrationScore: 7.5,
        price: "$120/mo",
        whyChosen: "Integrated time tracking with resource planning",
        alternatives: ["Toggl", "Clockify + Float"]
      }
    ],
    synergies: [
      "Slack ↔ Linear: Issue updates in channels, create from messages",
      "Figma ↔ Linear: Link designs to development issues",
      "Notion ↔ Slack: Rich link previews, page notifications",
      "Harvest → Invoicing tools: Automatic invoice generation"
    ],
    useCases: ["Web development agencies", "Design studios", "Marketing agencies", "Product consultancies"]
  },
  {
    id: "smart-home-starter",
    title: "Smart Home Starter Kit",
    description: "Privacy-focused essentials for beginners",
    icon: Home,
    category: "Smart Home",
    teamSize: "1 household",
    totalCost: "$400-600 one-time",
    avgTrustScore: 9.0,
    avgIntegrationScore: 9.2,
    products: [
      {
        name: "Home Assistant Yellow",
        category: "Hub",
        role: "Central smart home controller",
        trustScore: 9.4,
        integrationScore: 9.8,
        price: "$150",
        whyChosen: "100% local, 3,300+ integrations, privacy-first",
        alternatives: ["Home Assistant Green ($99)", "Aqara Hub M3"]
      },
      {
        name: "Philips Hue Starter Kit",
        category: "Lighting",
        role: "Smart lighting foundation",
        trustScore: 8.3,
        integrationScore: 9.2,
        price: "$200",
        whyChosen: "Most reliable, works with everything",
        alternatives: ["IKEA Tradfri", "Nanoleaf Essentials"]
      },
      {
        name: "Aqara Door Sensor",
        category: "Sensors",
        role: "Entry point monitoring",
        trustScore: 8.7,
        integrationScore: 8.5,
        price: "$20",
        whyChosen: "Affordable Zigbee sensors, local processing",
        alternatives: ["Eve Door Sensor", "Sonoff"]
      },
      {
        name: "Aqara Motion Sensor",
        category: "Sensors",
        role: "Presence detection for automations",
        trustScore: 8.7,
        integrationScore: 8.5,
        price: "$25",
        whyChosen: "Fast response, reliable, battery lasts 2+ years",
        alternatives: ["Hue Motion Sensor", "Ikea Tradfri"]
      }
    ],
    synergies: [
      "Home Assistant + Hue: Full local control, no cloud needed",
      "Aqara sensors + Home Assistant: Instant automations",
      "All Zigbee devices: Single protocol, mesh network"
    ],
    useCases: ["First smart home", "Privacy-focused setup", "DIY enthusiasts", "Apartment renters"]
  },
  {
    id: "hybrid-office-pro",
    title: "Hybrid Office Pro Setup",
    description: "Premium ergonomic setup for remote work",
    icon: Briefcase,
    category: "Office Hardware",
    teamSize: "1 person",
    totalCost: "$2,500-3,500",
    avgTrustScore: 8.5,
    avgIntegrationScore: 7.2,
    products: [
      {
        name: "Herman Miller Aeron",
        category: "Chair",
        role: "Ergonomic seating for long sessions",
        trustScore: 8.8,
        integrationScore: 5.0,
        price: "$1,395",
        whyChosen: "12-year warranty, industry-standard ergonomics",
        alternatives: ["Steelcase Leap", "Secretlab Titan"]
      },
      {
        name: "Fully Jarvis",
        category: "Desk",
        role: "Height-adjustable standing desk",
        trustScore: 8.2,
        integrationScore: 6.5,
        price: "$599",
        whyChosen: "Best value standing desk, memory presets",
        alternatives: ["Uplift V2", "IKEA Bekant"]
      },
      {
        name: "LG 27\" 4K Monitor",
        category: "Display",
        role: "Primary work display",
        trustScore: 8.0,
        integrationScore: 7.0,
        price: "$350",
        whyChosen: "USB-C, excellent color accuracy, height adjustable",
        alternatives: ["Dell U2723QE", "Apple Studio Display"]
      },
      {
        name: "Logitech MX Keys + MX Master 3",
        category: "Peripherals",
        role: "Keyboard and mouse combo",
        trustScore: 8.3,
        integrationScore: 8.5,
        price: "$200",
        whyChosen: "Multi-device, excellent typing feel, ergonomic",
        alternatives: ["Apple Magic Keyboard/Mouse", "Keychron"]
      },
      {
        name: "Elgato Wave:3",
        category: "Audio",
        role: "Professional microphone for calls",
        trustScore: 8.5,
        integrationScore: 8.0,
        price: "$150",
        whyChosen: "Best audio quality for video calls, mute button",
        alternatives: ["Blue Yeti", "Shure MV7"]
      }
    ],
    synergies: [
      "Logitech Flow: Switch peripherals between 3 devices",
      "USB-C hub unifies monitor, peripherals, charging",
      "Sit-stand routine with desk presets"
    ],
    useCases: ["Full-time remote work", "Video-heavy roles", "Developer setup", "Executive home office"]
  }
];

export default function StackTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<StackTemplate | null>(null);
  const [category, setCategory] = useState("all");

  const categories = ["all", ...new Set(stackTemplates.map(t => t.category))];
  
  const filteredTemplates = category === "all" 
    ? stackTemplates 
    : stackTemplates.filter(t => t.category === category);

  const copyStackList = (template: StackTemplate) => {
    const list = template.products.map(p => `- ${p.name} (${p.category}): ${p.price}`).join("\n");
    navigator.clipboard.writeText(`${template.title}\n\n${list}\n\nTotal: ${template.totalCost}`);
    toast.success("Stack list copied to clipboard!");
  };

  if (selectedTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedTemplate(null)}>
            ← Back to templates
          </Button>
          <Button variant="outline" onClick={() => copyStackList(selectedTemplate)}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Stack
          </Button>
        </div>

        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <selectedTemplate.icon className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">{selectedTemplate.category}</Badge>
              <h2 className="text-2xl font-bold mb-1">{selectedTemplate.title}</h2>
              <p className="text-muted-foreground">{selectedTemplate.description}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <div className="text-sm text-muted-foreground">Team Size</div>
              <div className="font-semibold">{selectedTemplate.teamSize}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <div className="text-sm text-muted-foreground">Total Cost</div>
              <div className="font-semibold">{selectedTemplate.totalCost}</div>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 text-center">
              <div className="text-sm text-muted-foreground">Avg Trust</div>
              <div className="font-semibold text-primary">{selectedTemplate.avgTrustScore.toFixed(1)}</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/10 text-center">
              <div className="text-sm text-muted-foreground">Avg Integration</div>
              <div className="font-semibold text-secondary">{selectedTemplate.avgIntegrationScore.toFixed(1)}</div>
            </div>
          </div>
        </Card>

        {/* Products */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Stack Components</h3>
          {selectedTemplate.products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold">{product.name}</h4>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.role}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-primary">{product.price}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-primary/10 text-primary text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        {product.trustScore}
                      </Badge>
                      <Badge className="bg-secondary/10 text-secondary text-xs">
                        <Link2 className="h-3 w-3 mr-1" />
                        {product.integrationScore}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm"><strong>Why chosen:</strong> {product.whyChosen}</p>
                </div>

                {product.alternatives && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Alternatives:</span>
                    {product.alternatives.map((alt) => (
                      <Badge key={alt} variant="secondary" className="text-xs">{alt}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Synergies */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Link2 className="h-5 w-5 text-secondary" />
            Stack Synergies
          </h3>
          <div className="space-y-2">
            {selectedTemplate.synergies.map((synergy, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                <span className="text-sm">{synergy}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Use Cases */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Best For</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTemplate.useCases.map((useCase) => (
              <Badge key={useCase} variant="secondary">{useCase}</Badge>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
          <Layers className="h-4 w-4" />
          <span className="text-sm font-medium">Curated Stack Templates</span>
        </div>
        <h2 className="text-2xl font-bold">Pre-Built Stacks for Every Need</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Expertly curated product combinations with our scores and clear reasoning for each choice.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center flex-wrap gap-2">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className="cursor-pointer capitalize"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <template.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <Badge variant="secondary" className="mb-1">{template.category}</Badge>
                <h3 className="text-lg font-semibold">{template.title}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2 rounded bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground">Team Size</div>
                <div className="text-sm font-medium">{template.teamSize}</div>
              </div>
              <div className="p-2 rounded bg-muted/50 text-center">
                <div className="text-xs text-muted-foreground">Cost</div>
                <div className="text-sm font-medium">{template.totalCost}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge className="bg-primary/10 text-primary">
                  <Shield className="h-3 w-3 mr-1" />
                  {template.avgTrustScore.toFixed(1)}
                </Badge>
                <Badge className="bg-secondary/10 text-secondary">
                  <Link2 className="h-3 w-3 mr-1" />
                  {template.avgIntegrationScore.toFixed(1)}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                View <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
