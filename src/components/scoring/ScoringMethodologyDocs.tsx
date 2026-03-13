import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Shield, Link2, Award, FileText, Scale, TrendingUp, Clock, Database,
  AlertTriangle, CheckCircle2, XCircle, Eye, Lock, Globe, Zap, Users,
  Server, Code, Workflow, BarChart3, History, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreComponent {
  name: string;
  weight: number;
  maxPoints: number;
  description: string;
  dataSources: string[];
  criteria: { level: string; requirement: string; points: number }[];
  icon: React.ElementType;
}

const trustScoreComponents: ScoreComponent[] = [
  {
    name: "Data Privacy Practices",
    weight: 30,
    maxPoints: 3.0,
    description: "Evaluates how the product collects, stores, and uses personal data.",
    dataSources: ["Privacy policy analysis", "Data flow audits", "Third-party tracker detection", "GDPR/CCPA compliance verification"],
    criteria: [
      { level: "Excellent", requirement: "Minimal data collection, local processing, no third-party sharing", points: 3.0 },
      { level: "Good", requirement: "Clear opt-out, encrypted storage, limited sharing with disclosure", points: 2.0 },
      { level: "Fair", requirement: "Standard collection with privacy policy, some third-party integrations", points: 1.0 },
      { level: "Poor", requirement: "Extensive data collection, unclear policies, broad sharing", points: 0.5 }
    ],
    icon: Eye
  },
  {
    name: "Encryption Standards",
    weight: 20,
    maxPoints: 2.0,
    description: "Assesses the strength and implementation of encryption for data at rest and in transit.",
    dataSources: ["SSL/TLS certificate analysis", "End-to-end encryption verification", "Key management audit", "Security headers check"],
    criteria: [
      { level: "Excellent", requirement: "E2E encryption, zero-knowledge architecture, TLS 1.3", points: 2.0 },
      { level: "Good", requirement: "Strong encryption at rest and transit, TLS 1.2+", points: 1.5 },
      { level: "Fair", requirement: "Basic encryption, some unencrypted endpoints", points: 0.8 },
      { level: "Poor", requirement: "Weak or missing encryption, outdated protocols", points: 0.3 }
    ],
    icon: Lock
  },
  {
    name: "Terms Transparency",
    weight: 20,
    maxPoints: 2.0,
    description: "Reviews clarity, fairness, and user-friendliness of terms of service.",
    dataSources: ["ToS readability analysis", "Hidden clause detection", "User rights assessment", "Change notification policy"],
    criteria: [
      { level: "Excellent", requirement: "Plain language, user-favorable, clear data rights, easy opt-out", points: 2.0 },
      { level: "Good", requirement: "Readable terms, reasonable clauses, deletion available", points: 1.5 },
      { level: "Fair", requirement: "Standard legal language, some concerning clauses", points: 0.8 },
      { level: "Poor", requirement: "Confusing terms, hidden data usage, difficult account deletion", points: 0.3 }
    ],
    icon: FileText
  },
  {
    name: "Ethical AI Practices",
    weight: 20,
    maxPoints: 2.0,
    description: "Evaluates AI/ML usage transparency, bias mitigation, and user control.",
    dataSources: ["AI disclosure statements", "Algorithm transparency reports", "Opt-out availability", "Training data policies"],
    criteria: [
      { level: "Excellent", requirement: "Full AI disclosure, user data not used for training, bias audits", points: 2.0 },
      { level: "Good", requirement: "Clear AI usage, opt-out available, documented practices", points: 1.5 },
      { level: "Fair", requirement: "Basic disclosure, limited user control", points: 0.8 },
      { level: "Poor", requirement: "No disclosure, unclear AI usage, no opt-out", points: 0.3 }
    ],
    icon: Zap
  },
  {
    name: "Third-Party Security Audits",
    weight: 10,
    maxPoints: 1.0,
    description: "Validates independent security certifications and audit history.",
    dataSources: ["SOC 2 reports", "ISO 27001 certification", "Penetration test reports", "Bug bounty programs"],
    criteria: [
      { level: "Excellent", requirement: "SOC 2 Type II + ISO 27001 + active bug bounty", points: 1.0 },
      { level: "Good", requirement: "SOC 2 Type II or equivalent certification", points: 0.7 },
      { level: "Fair", requirement: "Basic security audit or SOC 2 Type I", points: 0.4 },
      { level: "Poor", requirement: "No third-party audits or certifications", points: 0.1 }
    ],
    icon: Shield
  }
];

const integrationScoreComponents: ScoreComponent[] = [
  {
    name: "API Documentation & Availability",
    weight: 30,
    maxPoints: 3.0,
    description: "Assesses API quality, documentation completeness, and rate limits.",
    dataSources: ["API documentation review", "Rate limit testing", "Endpoint coverage analysis", "Developer community feedback"],
    criteria: [
      { level: "Excellent", requirement: "Comprehensive REST/GraphQL API, unlimited reasonable usage, SDKs", points: 3.0 },
      { level: "Good", requirement: "Well-documented API, generous rate limits, good coverage", points: 2.0 },
      { level: "Fair", requirement: "Basic API, limited endpoints, strict rate limits", points: 1.0 },
      { level: "Poor", requirement: "No public API or severely limited access", points: 0.3 }
    ],
    icon: Code
  },
  {
    name: "Cross-Platform Support",
    weight: 30,
    maxPoints: 3.0,
    description: "Evaluates availability and quality across operating systems and devices.",
    dataSources: ["Platform availability check", "Feature parity analysis", "Sync reliability testing", "Offline capability"],
    criteria: [
      { level: "Excellent", requirement: "Native apps all platforms + web + full feature parity + offline", points: 3.0 },
      { level: "Good", requirement: "Major platforms with good feature parity", points: 2.0 },
      { level: "Fair", requirement: "Limited platforms or significant feature gaps", points: 1.0 },
      { level: "Poor", requirement: "Single platform only or web-only", points: 0.3 }
    ],
    icon: Globe
  },
  {
    name: "Smart Home Ecosystem Support",
    weight: 20,
    maxPoints: 2.0,
    description: "Tests compatibility with major smart home platforms and protocols.",
    dataSources: ["Matter certification", "HomeKit/Alexa/Google Home testing", "Hub compatibility matrix", "Protocol support"],
    criteria: [
      { level: "Excellent", requirement: "Matter + HomeKit + Alexa + Google + local API", points: 2.0 },
      { level: "Good", requirement: "3+ ecosystems with reliable integration", points: 1.5 },
      { level: "Fair", requirement: "1-2 ecosystems with basic support", points: 0.8 },
      { level: "Poor", requirement: "Proprietary-only or cloud-dependent", points: 0.3 }
    ],
    icon: Server
  },
  {
    name: "Automation Platform Support",
    weight: 10,
    maxPoints: 1.0,
    description: "Checks compatibility with workflow automation tools.",
    dataSources: ["Zapier/Make integration testing", "IFTTT applet availability", "n8n/Pipedream support", "Webhook capabilities"],
    criteria: [
      { level: "Excellent", requirement: "Native integrations + webhooks + full trigger/action support", points: 1.0 },
      { level: "Good", requirement: "Major automation platforms with good coverage", points: 0.7 },
      { level: "Fair", requirement: "Limited automation support or basic webhooks only", points: 0.4 },
      { level: "Poor", requirement: "No automation platform support", points: 0.1 }
    ],
    icon: Workflow
  },
  {
    name: "Developer Community",
    weight: 10,
    maxPoints: 1.0,
    description: "Assesses the strength and activity of the developer ecosystem.",
    dataSources: ["GitHub activity", "Stack Overflow questions", "Community forums", "Third-party integrations count"],
    criteria: [
      { level: "Excellent", requirement: "Active open-source community, 50+ third-party integrations", points: 1.0 },
      { level: "Good", requirement: "Growing community, 20+ integrations, regular updates", points: 0.7 },
      { level: "Fair", requirement: "Small community, limited third-party support", points: 0.4 },
      { level: "Poor", requirement: "No developer community or documentation", points: 0.1 }
    ],
    icon: Users
  }
];

const integrationDepthLevels = [
  { level: 1, name: "Basic Connection", description: "Simple one-way data sync, manual triggers only", color: "bg-destructive/20 text-destructive", examples: ["Export to CSV", "Basic webhook", "Email notifications"] },
  { level: 2, name: "Standard Integration", description: "Two-way sync with limited triggers and actions", color: "bg-accent/20 text-accent", examples: ["Zapier basic triggers", "Calendar sync", "Contact import/export"] },
  { level: 3, name: "Deep Integration", description: "Real-time bi-directional sync, custom field mapping", color: "bg-secondary/20 text-secondary", examples: ["Full API access", "Real-time webhooks", "Custom automations"] },
  { level: 4, name: "Native Partnership", description: "Embedded features, SSO, unified experience", color: "bg-success/20 text-success", examples: ["Native embeds", "Shared authentication", "Deep UI integration"] }
];

export default function ScoringMethodologyDocs() {
  const [selectedTab, setSelectedTab] = useState("trust");

  const renderScoreComponent = (component: ScoreComponent, index: number) => (
    <AccordionItem key={component.name} value={`item-${index}`} className="border rounded-lg px-4 mb-3">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-4 w-full">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <component.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold">{component.name}</div>
            <div className="text-sm text-muted-foreground">Weight: {component.weight}% • Max: {component.maxPoints} points</div>
          </div>
          <Badge variant="outline" className="mr-4">{component.maxPoints} pts</Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        <p className="text-muted-foreground">{component.description}</p>
        
        <div>
          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Database className="h-4 w-4" /> Data Sources
          </h5>
          <div className="flex flex-wrap gap-2">
            {component.dataSources.map((source) => (
              <Badge key={source} variant="secondary" className="text-xs">{source}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Scale className="h-4 w-4" /> Scoring Criteria
          </h5>
          <div className="space-y-2">
            {component.criteria.map((criterion) => (
              <div key={criterion.level} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                {criterion.level === "Excellent" && <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />}
                {criterion.level === "Good" && <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0" />}
                {criterion.level === "Fair" && <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0" />}
                {criterion.level === "Poor" && <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{criterion.level}</span>
                    <span className="text-sm text-primary font-semibold">{criterion.points} pts</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{criterion.requirement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
          <Award className="h-4 w-4" />
          <span className="text-sm font-medium">Transparent Scoring Framework</span>
        </div>
        <h2 className="text-3xl font-bold">Complete Scoring Methodology</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Every score is calculated using documented criteria, verified data sources, and reproducible methodology. 
          Our multi-factor framework ensures objective, comparable evaluations.
        </p>
      </div>

      {/* Formula Display */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Scoring Formula</h3>
          <div className="font-mono text-sm md:text-base bg-background/80 p-4 rounded-lg inline-block">
            <span className="text-primary">Total Score</span> = Σ (
            <span className="text-secondary">Component Score</span> × 
            <span className="text-accent">Weight</span>) × 
            <span className="text-success">Reliability Factor</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Each component is scored independently (0-100%), multiplied by its weight, 
            and adjusted by a reliability factor based on data freshness and verification status.
          </p>
        </div>
      </Card>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="trust" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Trust Score
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Link2 className="h-4 w-4" /> Integration Score
          </TabsTrigger>
          <TabsTrigger value="depth" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Integration Depth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trust" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Trust Score Components</h3>
                <p className="text-sm text-muted-foreground">10-point scale evaluating privacy, security, and transparency</p>
              </div>
              <Badge className="bg-primary">10.0 Max Score</Badge>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {trustScoreComponents.map((component, i) => renderScoreComponent(component, i))}
            </Accordion>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">Integration Score Components</h3>
                <p className="text-sm text-muted-foreground">10-point scale evaluating connectivity and ecosystem support</p>
              </div>
              <Badge className="bg-secondary">10.0 Max Score</Badge>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {integrationScoreComponents.map((component, i) => renderScoreComponent(component, i))}
            </Accordion>
          </Card>
        </TabsContent>

        <TabsContent value="depth" className="space-y-6">
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Integration Depth Score</h3>
              <p className="text-muted-foreground">
                Beyond simple "integrates with X" claims, we measure the actual depth and quality of each integration.
              </p>
            </div>
            
            <div className="space-y-4">
              {integrationDepthLevels.map((level) => (
                <div key={level.level} className="p-4 rounded-lg border">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={cn("px-3 py-1 rounded-full font-semibold text-sm", level.color)}>
                      Level {level.level}
                    </div>
                    <h4 className="font-semibold">{level.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {level.examples.map((example) => (
                      <Badge key={example} variant="outline" className="text-xs">{example}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Longitudinal Scoring */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
            <History className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Longitudinal Score Tracking</h3>
            <p className="text-muted-foreground mb-4">
              We track how scores evolve with each major update, security incident, or feature change. 
              Every score adjustment is logged with reasoning and timestamp.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium">Score Increases</span>
                </div>
                <p className="text-xs text-muted-foreground">New certifications, improved privacy, added integrations</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Score Decreases</span>
                </div>
                <p className="text-xs text-muted-foreground">Security breaches, deprecated APIs, policy changes</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Update Frequency</span>
                </div>
                <p className="text-xs text-muted-foreground">Scores reviewed every 6 months or on major changes</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Sources */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" /> Data Sources & Signals
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Official Sources</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Privacy policies</li>
              <li>• Security certifications</li>
              <li>• API documentation</li>
              <li>• Press releases</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Technical Analysis</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• SSL/security headers</li>
              <li>• Traffic analysis</li>
              <li>• API rate limit testing</li>
              <li>• Integration testing</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Community Signals</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• App store reviews</li>
              <li>• Community forums</li>
              <li>• GitHub issues</li>
              <li>• Expert reviews</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Real-Time Monitoring</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Outage tracking</li>
              <li>• Breach notifications</li>
              <li>• Policy changes</li>
              <li>• Integration deprecations</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
