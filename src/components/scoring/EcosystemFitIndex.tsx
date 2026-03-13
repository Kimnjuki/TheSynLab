import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers, Plus, X, Sparkles, CheckCircle2, AlertTriangle, XCircle,
  Zap, ArrowRight, Shield, Link2, TrendingUp, Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface StackItem {
  id: string;
  name: string;
  category: string;
  icon: string;
}

interface ProductFit {
  id: number;
  name: string;
  category: string;
  fitScore: number;
  trustScore: number;
  integrationScore: number;
  compatibleWith: string[];
  conflicts: string[];
  missingIntegrations: string[];
  synergies: string[];
}

const popularTools: StackItem[] = [
  { id: "notion", name: "Notion", category: "Productivity", icon: "📝" },
  { id: "slack", name: "Slack", category: "Communication", icon: "💬" },
  { id: "google-workspace", name: "Google Workspace", category: "Productivity", icon: "📧" },
  { id: "microsoft-365", name: "Microsoft 365", category: "Productivity", icon: "📊" },
  { id: "zoom", name: "Zoom", category: "Communication", icon: "📹" },
  { id: "asana", name: "Asana", category: "Project Management", icon: "✅" },
  { id: "trello", name: "Trello", category: "Project Management", icon: "📋" },
  { id: "linear", name: "Linear", category: "Project Management", icon: "🔷" },
  { id: "figma", name: "Figma", category: "Design", icon: "🎨" },
  { id: "github", name: "GitHub", category: "Development", icon: "🐙" },
  { id: "philips-hue", name: "Philips Hue", category: "Smart Lighting", icon: "💡" },
  { id: "google-home", name: "Google Home", category: "Smart Home", icon: "🏠" },
  { id: "alexa", name: "Amazon Alexa", category: "Smart Home", icon: "🔊" },
  { id: "apple-homekit", name: "Apple HomeKit", category: "Smart Home", icon: "🍎" },
  { id: "ring", name: "Ring", category: "Security", icon: "🔔" },
  { id: "nest", name: "Google Nest", category: "Smart Home", icon: "🌡️" },
  { id: "sonos", name: "Sonos", category: "Audio", icon: "🔈" },
  { id: "ecobee", name: "Ecobee", category: "Climate", icon: "❄️" },
];

// Simulated product recommendations based on stack
const generateRecommendations = (stack: StackItem[]): ProductFit[] => {
  const hasSmartHome = stack.some(s => ["Smart Home", "Smart Lighting", "Security", "Climate"].includes(s.category));
  const hasProductivity = stack.some(s => ["Productivity", "Project Management"].includes(s.category));
  
  const recommendations: ProductFit[] = [];
  
  if (hasSmartHome) {
    recommendations.push({
      id: 1,
      name: "Home Assistant",
      category: "Smart Home Hub",
      fitScore: 95,
      trustScore: 9.4,
      integrationScore: 9.8,
      compatibleWith: stack.filter(s => ["Smart Home", "Smart Lighting", "Security", "Climate"].includes(s.category)).map(s => s.name),
      conflicts: [],
      missingIntegrations: [],
      synergies: ["Unifies all your smart home devices", "Local processing enhances privacy", "Automation across platforms"]
    });
    
    recommendations.push({
      id: 2,
      name: "Aqara Hub M3",
      category: "Smart Home Hub",
      fitScore: 88,
      trustScore: 8.7,
      integrationScore: 8.9,
      compatibleWith: stack.filter(s => s.category === "Smart Home").map(s => s.name),
      conflicts: stack.some(s => s.id === "alexa") ? ["Limited Alexa features"] : [],
      missingIntegrations: stack.some(s => s.id === "ring") ? ["Ring integration requires workaround"] : [],
      synergies: ["Matter protocol support", "Local Zigbee processing"]
    });
  }
  
  if (hasProductivity) {
    recommendations.push({
      id: 3,
      name: "Raycast",
      category: "Productivity Tool",
      fitScore: 92,
      trustScore: 9.0,
      integrationScore: 9.2,
      compatibleWith: stack.filter(s => ["Productivity", "Project Management", "Development"].includes(s.category)).map(s => s.name),
      conflicts: [],
      missingIntegrations: [],
      synergies: ["Quick access to all your tools", "AI-powered workflows", "Unified search across apps"]
    });
    
    recommendations.push({
      id: 4,
      name: "Zapier",
      category: "Automation",
      fitScore: 85,
      trustScore: 8.2,
      integrationScore: 9.5,
      compatibleWith: stack.map(s => s.name),
      conflicts: [],
      missingIntegrations: [],
      synergies: ["Connects all your productivity tools", "Automated workflows", "Time savings"]
    });
  }
  
  return recommendations.sort((a, b) => b.fitScore - a.fitScore);
};

export default function EcosystemFitIndex() {
  const [selectedStack, setSelectedStack] = useState<StackItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [category, setCategory] = useState("all");

  const filteredTools = popularTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "all" || tool.category === category;
    const notInStack = !selectedStack.find(s => s.id === tool.id);
    return matchesSearch && matchesCategory && notInStack;
  });

  const categories = ["all", ...new Set(popularTools.map(t => t.category))];
  
  const recommendations = generateRecommendations(selectedStack);

  const addToStack = (tool: StackItem) => {
    if (selectedStack.length < 10) {
      setSelectedStack([...selectedStack, tool]);
    }
  };

  const removeFromStack = (toolId: string) => {
    setSelectedStack(selectedStack.filter(s => s.id !== toolId));
  };

  const getFitColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-secondary";
    if (score >= 60) return "text-accent";
    return "text-destructive";
  };

  const getFitBg = (score: number) => {
    if (score >= 90) return "bg-success/10 border-success/20";
    if (score >= 75) return "bg-secondary/10 border-secondary/20";
    if (score >= 60) return "bg-accent/10 border-accent/20";
    return "bg-destructive/10 border-destructive/20";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary">
          <Layers className="h-4 w-4" />
          <span className="text-sm font-medium">Ecosystem Fit Index</span>
        </div>
        <h2 className="text-2xl font-bold">Find Products That Fit Your Stack</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Input your current tools and devices, and our engine scores how well each product fits your exact ecosystem.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stack Builder */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Your Current Stack
              <Badge variant="outline" className="ml-auto">{selectedStack.length}/10</Badge>
            </h3>

            {/* Selected Stack */}
            <div className="min-h-[80px] p-4 rounded-lg border-2 border-dashed mb-4 flex flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {selectedStack.length === 0 ? (
                  <p className="text-muted-foreground text-sm w-full text-center">
                    Add tools and devices from below to build your stack
                  </p>
                ) : (
                  selectedStack.map((tool) => (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge 
                        variant="secondary" 
                        className="py-2 px-3 text-sm cursor-pointer hover:bg-destructive/20"
                        onClick={() => removeFromStack(tool.id)}
                      >
                        <span className="mr-2">{tool.icon}</span>
                        {tool.name}
                        <X className="h-3 w-3 ml-2" />
                      </Badge>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tools and devices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
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

            {/* Available Tools */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filteredTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto py-2"
                  onClick={() => addToStack(tool)}
                  disabled={selectedStack.length >= 10}
                >
                  <span className="mr-2">{tool.icon}</span>
                  <span className="truncate">{tool.name}</span>
                  <Plus className="h-3 w-3 ml-auto" />
                </Button>
              ))}
            </div>
          </Card>

          {/* Analyze Button */}
          <Button 
            size="lg" 
            className="w-full"
            disabled={selectedStack.length === 0}
            onClick={() => setShowResults(true)}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Analyze Stack Compatibility
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommended Products
            </h3>

            {!showResults || selectedStack.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Add tools to your stack and click analyze to see recommendations</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className={cn("p-4 rounded-lg border-2", getFitBg(product.fitScore))}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                        <div className={cn("text-2xl font-bold", getFitColor(product.fitScore))}>
                          {product.fitScore}%
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Ecosystem Fit</span>
                          <span className={getFitColor(product.fitScore)}>{product.fitScore}%</span>
                        </div>
                        <Progress value={product.fitScore} className="h-1.5" />
                      </div>

                      <div className="flex gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Trust: {product.trustScore}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Link2 className="h-3 w-3 mr-1" />
                          Integration: {product.integrationScore}
                        </Badge>
                      </div>

                      {product.synergies.length > 0 && (
                        <div className="space-y-1">
                          {product.synergies.slice(0, 2).map((synergy, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{synergy}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {product.conflicts.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {product.conflicts.map((conflict, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs">
                              <AlertTriangle className="h-3 w-3 text-accent flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{conflict}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
