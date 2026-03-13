import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Network, ArrowLeftRight, CheckCircle2, AlertTriangle, XCircle,
  Zap, Link2, Home, Briefcase, Laptop, Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationNode {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
}

interface IntegrationEdge {
  from: string;
  to: string;
  quality: "native" | "deep" | "standard" | "basic" | "broken";
  bidirectional: boolean;
  notes: string;
  limitations?: string[];
  features?: string[];
}

const smartHomeNodes: IntegrationNode[] = [
  { id: "home-assistant", name: "Home Assistant", category: "Hub", icon: "🏠", color: "bg-blue-500" },
  { id: "homekit", name: "Apple HomeKit", category: "Ecosystem", icon: "🍎", color: "bg-gray-700" },
  { id: "alexa", name: "Amazon Alexa", category: "Ecosystem", icon: "🔊", color: "bg-sky-500" },
  { id: "google-home", name: "Google Home", category: "Ecosystem", icon: "🎨", color: "bg-red-500" },
  { id: "matter", name: "Matter", category: "Protocol", icon: "🔗", color: "bg-purple-500" },
  { id: "hue", name: "Philips Hue", category: "Lighting", icon: "💡", color: "bg-amber-500" },
  { id: "ring", name: "Ring", category: "Security", icon: "🔔", color: "bg-blue-400" },
  { id: "nest", name: "Nest", category: "Climate", icon: "🌡️", color: "bg-green-500" },
  { id: "aqara", name: "Aqara", category: "Sensors", icon: "📡", color: "bg-orange-500" },
  { id: "sonos", name: "Sonos", category: "Audio", icon: "🔈", color: "bg-black" },
];

const smartHomeEdges: IntegrationEdge[] = [
  { from: "home-assistant", to: "hue", quality: "native", bidirectional: true, notes: "Full local API access", features: ["Scenes", "Effects", "Entertainment areas", "Sensors"] },
  { from: "home-assistant", to: "homekit", quality: "deep", bidirectional: true, notes: "Via HomeKit Controller integration", features: ["Device control", "Automations"] },
  { from: "home-assistant", to: "alexa", quality: "deep", bidirectional: true, notes: "Via Nabu Casa or custom skill", features: ["Voice control", "Routines", "Announcements"] },
  { from: "home-assistant", to: "google-home", quality: "deep", bidirectional: true, notes: "Via Nabu Casa cloud", features: ["Voice control", "Routines"] },
  { from: "home-assistant", to: "ring", quality: "standard", bidirectional: false, notes: "Requires cloud, some features limited", limitations: ["No live view", "Delayed notifications"] },
  { from: "home-assistant", to: "nest", quality: "standard", bidirectional: true, notes: "Via Google SDM API", limitations: ["Requires Google Cloud project", "Limited to newer devices"] },
  { from: "home-assistant", to: "aqara", quality: "native", bidirectional: true, notes: "Direct Zigbee or via hub", features: ["All sensors", "Real-time updates", "Local control"] },
  { from: "home-assistant", to: "sonos", quality: "native", bidirectional: true, notes: "Full local control", features: ["Grouping", "TTS", "Media control", "Favorites"] },
  { from: "homekit", to: "hue", quality: "native", bidirectional: true, notes: "Official HomeKit support", features: ["Scenes", "Adaptive lighting", "Siri control"] },
  { from: "homekit", to: "aqara", quality: "native", bidirectional: true, notes: "Via Aqara Hub", features: ["All sensors", "Automations"] },
  { from: "alexa", to: "hue", quality: "native", bidirectional: true, notes: "Official skill", features: ["Voice control", "Routines", "Groups"] },
  { from: "alexa", to: "ring", quality: "native", bidirectional: true, notes: "Same ecosystem (Amazon)", features: ["Full integration", "Announcements", "Routines"] },
  { from: "google-home", to: "hue", quality: "native", bidirectional: true, notes: "Official integration", features: ["Voice control", "Routines", "Room sync"] },
  { from: "google-home", to: "nest", quality: "native", bidirectional: true, notes: "Same ecosystem (Google)", features: ["Full integration", "Presence", "Automations"] },
  { from: "matter", to: "homekit", quality: "native", bidirectional: true, notes: "Full Matter support", features: ["Thread", "Local control"] },
  { from: "matter", to: "alexa", quality: "native", bidirectional: true, notes: "Full Matter support", features: ["Thread via Echo 4th gen+"] },
  { from: "matter", to: "google-home", quality: "native", bidirectional: true, notes: "Full Matter support", features: ["Thread via Nest Hub"] },
  { from: "matter", to: "home-assistant", quality: "native", bidirectional: true, notes: "Full Matter support", features: ["Local control", "Thread"] },
];

const productivityNodes: IntegrationNode[] = [
  { id: "notion", name: "Notion", category: "Docs", icon: "📝", color: "bg-gray-800" },
  { id: "slack", name: "Slack", category: "Chat", icon: "💬", color: "bg-purple-600" },
  { id: "linear", name: "Linear", category: "Tasks", icon: "🔷", color: "bg-indigo-500" },
  { id: "github", name: "GitHub", category: "Code", icon: "🐙", color: "bg-gray-700" },
  { id: "figma", name: "Figma", category: "Design", icon: "🎨", color: "bg-pink-500" },
  { id: "zapier", name: "Zapier", category: "Automation", icon: "⚡", color: "bg-orange-500" },
  { id: "google", name: "Google Workspace", category: "Suite", icon: "📧", color: "bg-blue-500" },
  { id: "calendar", name: "Calendar (Google/MS)", category: "Calendar", icon: "📅", color: "bg-green-500" },
];

const productivityEdges: IntegrationEdge[] = [
  { from: "notion", to: "slack", quality: "deep", bidirectional: true, notes: "Native integration", features: ["Link previews", "Page creation", "Notifications", "Database sync"] },
  { from: "notion", to: "github", quality: "standard", bidirectional: false, notes: "Via synced databases", features: ["PR/Issue sync", "Link previews"], limitations: ["One-way sync", "Manual setup"] },
  { from: "notion", to: "calendar", quality: "deep", bidirectional: true, notes: "Native calendar sync", features: ["Event sync", "Calendar views", "Reminders"] },
  { from: "linear", to: "slack", quality: "native", bidirectional: true, notes: "Excellent integration", features: ["Issue creation", "Updates", "Triage", "Search"] },
  { from: "linear", to: "github", quality: "native", bidirectional: true, notes: "Deep code integration", features: ["PR linking", "Auto-close issues", "Branch creation"] },
  { from: "linear", to: "figma", quality: "deep", bidirectional: true, notes: "Design-dev handoff", features: ["Embed designs", "Link to issues"] },
  { from: "slack", to: "google", quality: "native", bidirectional: true, notes: "Official integration", features: ["Calendar sync", "Drive previews", "Meet shortcuts"] },
  { from: "slack", to: "github", quality: "native", bidirectional: true, notes: "Official GitHub app", features: ["PR notifications", "Issue updates", "Deploy alerts"] },
  { from: "figma", to: "slack", quality: "deep", bidirectional: true, notes: "Native integration", features: ["Design previews", "Comments", "Updates"] },
  { from: "zapier", to: "notion", quality: "deep", bidirectional: true, notes: "Extensive actions", features: ["Create pages", "Update databases", "Triggers"] },
  { from: "zapier", to: "slack", quality: "native", bidirectional: true, notes: "Extensive triggers/actions", features: ["Messages", "Channels", "Reactions"] },
  { from: "zapier", to: "linear", quality: "deep", bidirectional: true, notes: "Good coverage", features: ["Create issues", "Update status", "Comments"] },
];

const getQualityInfo = (quality: IntegrationEdge["quality"]) => {
  switch (quality) {
    case "native":
      return { color: "text-success", bg: "bg-success/10", label: "Native", icon: CheckCircle2, description: "Official partnership, full feature support" };
    case "deep":
      return { color: "text-secondary", bg: "bg-secondary/10", label: "Deep", icon: CheckCircle2, description: "Comprehensive integration with bi-directional sync" };
    case "standard":
      return { color: "text-accent", bg: "bg-accent/10", label: "Standard", icon: AlertTriangle, description: "Basic integration with some limitations" };
    case "basic":
      return { color: "text-muted-foreground", bg: "bg-muted", label: "Basic", icon: AlertTriangle, description: "Limited integration, one-way sync" };
    case "broken":
      return { color: "text-destructive", bg: "bg-destructive/10", label: "Broken", icon: XCircle, description: "Integration deprecated or non-functional" };
  }
};

export default function IntegrationGraph() {
  const [category, setCategory] = useState<"smart-home" | "productivity">("smart-home");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<IntegrationEdge | null>(null);

  const nodes = category === "smart-home" ? smartHomeNodes : productivityNodes;
  const edges = category === "smart-home" ? smartHomeEdges : productivityEdges;

  const getNodeConnections = (nodeId: string) => {
    return edges.filter(e => e.from === nodeId || e.to === nodeId);
  };

  const getConnectedNodes = (nodeId: string) => {
    const connections = getNodeConnections(nodeId);
    const connectedIds = new Set<string>();
    connections.forEach(c => {
      if (c.from === nodeId) connectedIds.add(c.to);
      if (c.to === nodeId) connectedIds.add(c.from);
    });
    return connectedIds;
  };

  const handleEdgeClick = (edge: IntegrationEdge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
          <Network className="h-4 w-4" />
          <span className="text-sm font-medium">Integration Graph</span>
        </div>
        <h2 className="text-2xl font-bold">See How Products Connect</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Visual map showing integration quality between products. Click any connection to see detailed compatibility info.
        </p>
      </div>

      {/* Category Toggle */}
      <div className="flex justify-center">
        <Tabs value={category} onValueChange={(v) => { setCategory(v as any); setSelectedNode(null); setSelectedEdge(null); }}>
          <TabsList>
            <TabsTrigger value="smart-home" className="flex items-center gap-2">
              <Home className="h-4 w-4" /> Smart Home
            </TabsTrigger>
            <TabsTrigger value="productivity" className="flex items-center gap-2">
              <Laptop className="h-4 w-4" /> Productivity
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Graph Visualization */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Integration Map</h3>
              <div className="flex gap-2">
                {["native", "deep", "standard", "basic"].map((q) => {
                  const info = getQualityInfo(q as any);
                  return (
                    <Badge key={q} variant="outline" className={cn("text-xs", info.color)}>
                      {info.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Simplified Graph - Grid Layout */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {nodes.map((node) => {
                const isSelected = selectedNode === node.id;
                const isConnected = selectedNode ? getConnectedNodes(selectedNode).has(node.id) : false;
                const isHighlighted = isSelected || isConnected || !selectedNode;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-center",
                      isSelected && "border-primary ring-2 ring-primary/20",
                      isConnected && "border-secondary",
                      !isHighlighted && "opacity-30",
                      "hover:border-primary/50"
                    )}
                  >
                    <div className="text-2xl mb-2">{node.icon}</div>
                    <div className="text-xs font-medium truncate">{node.name}</div>
                    <Badge variant="secondary" className="text-[10px] mt-1">{node.category}</Badge>
                  </button>
                );
              })}
            </div>

            {/* Connection List */}
            {selectedNode && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-semibold mb-3">
                  Connections for {nodes.find(n => n.id === selectedNode)?.name}
                </h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {getNodeConnections(selectedNode).map((edge, i) => {
                    const otherNodeId = edge.from === selectedNode ? edge.to : edge.from;
                    const otherNode = nodes.find(n => n.id === otherNodeId);
                    const info = getQualityInfo(edge.quality);
                    
                    return (
                      <button
                        key={i}
                        onClick={() => handleEdgeClick(edge)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
                          selectedEdge === edge ? "border-primary bg-primary/5" : "hover:bg-muted"
                        )}
                      >
                        <span className="text-xl">{otherNode?.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{otherNode?.name}</div>
                          <div className="flex items-center gap-1 text-xs">
                            <Badge className={cn("text-[10px]", info.bg, info.color)}>{info.label}</Badge>
                            {edge.bidirectional && <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Integration Details
            </h3>

            {!selectedEdge ? (
              <div className="text-center py-8 text-muted-foreground">
                <Network className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select a node then click a connection to see integration details</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{nodes.find(n => n.id === selectedEdge.from)?.icon}</span>
                    <ArrowLeftRight className="h-4 w-4" />
                    <span className="text-xl">{nodes.find(n => n.id === selectedEdge.to)?.icon}</span>
                  </div>
                  <Badge className={cn(getQualityInfo(selectedEdge.quality).bg, getQualityInfo(selectedEdge.quality).color)}>
                    {getQualityInfo(selectedEdge.quality).label}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">
                    {nodes.find(n => n.id === selectedEdge.from)?.name} ↔ {nodes.find(n => n.id === selectedEdge.to)?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedEdge.notes}</p>
                </div>

                {selectedEdge.bidirectional && (
                  <Badge variant="outline" className="text-xs">
                    <ArrowLeftRight className="h-3 w-3 mr-1" />
                    Bi-directional sync
                  </Badge>
                )}

                {selectedEdge.features && selectedEdge.features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-success">Features</h4>
                    <div className="space-y-1">
                      {selectedEdge.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEdge.limitations && selectedEdge.limitations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-accent">Limitations</h4>
                    <div className="space-y-1">
                      {selectedEdge.limitations.map((l, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-3 w-3 text-accent" />
                          <span>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Legend */}
          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-3">Integration Quality Levels</h4>
            <div className="space-y-2">
              {["native", "deep", "standard", "basic"].map((q) => {
                const info = getQualityInfo(q as any);
                return (
                  <div key={q} className="flex items-start gap-2">
                    <info.icon className={cn("h-4 w-4 mt-0.5", info.color)} />
                    <div>
                      <span className={cn("text-sm font-medium", info.color)}>{info.label}</span>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
