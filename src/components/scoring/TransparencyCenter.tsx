import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Eye, DollarSign, History, Settings2, Shield, Link2, AlertTriangle,
  CheckCircle2, XCircle, TrendingUp, TrendingDown, Minus, Filter,
  RefreshCw, ExternalLink, FileText, Scale
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ScoreChange {
  date: string;
  product: string;
  scoreType: "trust" | "integration";
  previousScore: number;
  newScore: number;
  reason: string;
  category: string;
}

interface AffiliateDisclosure {
  product: string;
  hasAffiliate: boolean;
  affiliateProgram?: string;
  commissionType?: string;
  disclosedSince: string;
}

interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

const scoreChanges: ScoreChange[] = [
  {
    date: "2026-01-15",
    product: "Notion",
    scoreType: "trust",
    previousScore: 8.0,
    newScore: 8.2,
    reason: "Added GDPR data processing agreement, improved privacy controls",
    category: "Privacy Improvement"
  },
  {
    date: "2026-01-10",
    product: "Ring",
    scoreType: "trust",
    previousScore: 6.8,
    newScore: 6.2,
    reason: "Police partnership controversy, end-to-end encryption delayed",
    category: "Privacy Concern"
  },
  {
    date: "2026-01-08",
    product: "Home Assistant",
    scoreType: "integration",
    previousScore: 9.6,
    newScore: 9.8,
    reason: "Matter 1.3 support added, Thread border router improvements",
    category: "Integration Added"
  },
  {
    date: "2026-01-05",
    product: "Slack",
    scoreType: "integration",
    previousScore: 9.5,
    newScore: 9.3,
    reason: "Deprecated legacy webhook format, some integrations broken",
    category: "Integration Deprecated"
  },
  {
    date: "2025-12-28",
    product: "Google Nest",
    scoreType: "trust",
    previousScore: 7.0,
    newScore: 7.2,
    reason: "Local processing for common commands, reduced cloud dependency",
    category: "Privacy Improvement"
  },
  {
    date: "2025-12-20",
    product: "Linear",
    scoreType: "integration",
    previousScore: 8.7,
    newScore: 8.9,
    reason: "Native Figma integration, improved GitHub sync",
    category: "Integration Added"
  }
];

const affiliateDisclosures: AffiliateDisclosure[] = [
  { product: "Home Assistant", hasAffiliate: false, disclosedSince: "2024-01-01" },
  { product: "Philips Hue", hasAffiliate: true, affiliateProgram: "Amazon Associates", commissionType: "3-5%", disclosedSince: "2024-01-01" },
  { product: "Notion", hasAffiliate: true, affiliateProgram: "Notion Partners", commissionType: "20% first year", disclosedSince: "2024-01-01" },
  { product: "Linear", hasAffiliate: true, affiliateProgram: "Linear Affiliates", commissionType: "15% first year", disclosedSince: "2024-06-01" },
  { product: "Herman Miller", hasAffiliate: true, affiliateProgram: "Direct Partnership", commissionType: "5%", disclosedSince: "2024-01-01" },
  { product: "Aqara", hasAffiliate: true, affiliateProgram: "Amazon Associates", commissionType: "3-4%", disclosedSince: "2024-01-01" },
  { product: "Convex", hasAffiliate: false, disclosedSince: "2024-01-01" },
];

const whatIfScenarios: WhatIfScenario[] = [
  { id: "no-cloud", name: "No Cloud Required", description: "Exclude products that require cloud accounts to function", active: false },
  { id: "open-source", name: "Open Source Only", description: "Prioritize open-source and self-hosted solutions", active: false },
  { id: "privacy-first", name: "Privacy First", description: "Weight privacy components 2x in Trust Score", active: false },
  { id: "no-subscription", name: "No Subscriptions", description: "Exclude products with mandatory subscriptions", active: false },
  { id: "local-api", name: "Local API Required", description: "Only include products with local API access", active: false },
  { id: "e2e-encryption", name: "E2E Encryption Required", description: "Must have end-to-end encryption", active: false },
];

// Mock products that would be affected by filters
const mockProducts = [
  { name: "Home Assistant", trustScore: 9.4, integrationScore: 9.8, cloudRequired: false, openSource: true, subscription: false, localApi: true, e2e: true },
  { name: "Apple HomeKit", trustScore: 9.1, integrationScore: 7.5, cloudRequired: false, openSource: false, subscription: false, localApi: true, e2e: true },
  { name: "Philips Hue", trustScore: 8.3, integrationScore: 9.2, cloudRequired: false, openSource: false, subscription: false, localApi: true, e2e: false },
  { name: "Ring", trustScore: 6.2, integrationScore: 7.8, cloudRequired: true, openSource: false, subscription: true, localApi: false, e2e: false },
  { name: "Notion", trustScore: 8.2, integrationScore: 8.8, cloudRequired: true, openSource: false, subscription: true, localApi: false, e2e: false },
  { name: "Obsidian", trustScore: 9.2, integrationScore: 7.5, cloudRequired: false, openSource: false, subscription: false, localApi: true, e2e: true },
  { name: "Proton Suite", trustScore: 9.5, integrationScore: 7.2, cloudRequired: true, openSource: true, subscription: true, localApi: false, e2e: true },
];

export default function TransparencyCenter() {
  const [activeScenarios, setActiveScenarios] = useState<string[]>([]);
  const [privacyWeight, setPrivacyWeight] = useState([1]);

  const toggleScenario = (id: string) => {
    setActiveScenarios(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const getFilteredProducts = () => {
    return mockProducts.filter(p => {
      if (activeScenarios.includes("no-cloud") && p.cloudRequired) return false;
      if (activeScenarios.includes("open-source") && !p.openSource) return false;
      if (activeScenarios.includes("no-subscription") && p.subscription) return false;
      if (activeScenarios.includes("local-api") && !p.localApi) return false;
      if (activeScenarios.includes("e2e-encryption") && !p.e2e) return false;
      return true;
    }).map(p => ({
      ...p,
      adjustedTrustScore: activeScenarios.includes("privacy-first") 
        ? Math.min(10, p.trustScore * (1 + (privacyWeight[0] - 1) * 0.1))
        : p.trustScore
    })).sort((a, b) => b.adjustedTrustScore - a.adjustedTrustScore);
  };

  const getChangeIcon = (change: ScoreChange) => {
    if (change.newScore > change.previousScore) return <TrendingUp className="h-4 w-4 text-success" />;
    if (change.newScore < change.previousScore) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getCategoryColor = (category: string) => {
    if (category.includes("Improvement") || category.includes("Added")) return "bg-success/10 text-success";
    if (category.includes("Concern") || category.includes("Deprecated")) return "bg-destructive/10 text-destructive";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">Transparency Center</span>
        </div>
        <h2 className="text-2xl font-bold">Our Commitment to Transparency</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Full disclosure on monetization, score changes, and the ability to filter results by your values.
        </p>
      </div>

      <Tabs defaultValue="disclosures">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disclosures" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> Funding
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Score History
          </TabsTrigger>
          <TabsTrigger value="whatif" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" /> What-If Filters
          </TabsTrigger>
        </TabsList>

        {/* Funding & Monetization */}
        <TabsContent value="disclosures" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Our Monetization Policy</h3>
                <p className="text-muted-foreground">
                  We earn revenue through affiliate links and sponsorships. This <strong>never</strong> influences 
                  our scores or recommendations. Here's exactly how we're funded.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">60%</div>
                <div className="text-sm text-muted-foreground">Affiliate Commissions</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-secondary">25%</div>
                <div className="text-sm text-muted-foreground">Premium Memberships</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-accent">15%</div>
                <div className="text-sm text-muted-foreground">Sponsored Reviews</div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-success/30 bg-success/5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Independence Guarantee</p>
                  <p className="text-sm text-muted-foreground">
                    Scores are calculated algorithmically. Affiliate status is disclosed per-product. 
                    Sponsored content is clearly labeled. Our methodology is publicly documented.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Per-Product Affiliate Disclosure</h3>
            <div className="space-y-3">
              {affiliateDisclosures.map((disclosure) => (
                <div key={disclosure.product} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {disclosure.hasAffiliate ? (
                      <Badge variant="outline" className="bg-accent/10 text-accent">Affiliate</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-success/10 text-success">No Affiliate</Badge>
                    )}
                    <span className="font-medium">{disclosure.product}</span>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    {disclosure.hasAffiliate ? (
                      <span>{disclosure.affiliateProgram} • {disclosure.commissionType}</span>
                    ) : (
                      <span>Independent review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Score Change History */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Score Change Log</h3>
                <p className="text-sm text-muted-foreground">Every score change with reasoning and timestamp</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Updated daily
              </Badge>
            </div>

            <div className="space-y-4">
              {scoreChanges.map((change, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getChangeIcon(change)}
                      <div>
                        <span className="font-semibold">{change.product}</span>
                        <Badge 
                          variant="outline" 
                          className={cn("ml-2 text-xs", change.scoreType === "trust" ? "text-primary" : "text-secondary")}
                        >
                          {change.scoreType === "trust" ? <Shield className="h-3 w-3 mr-1" /> : <Link2 className="h-3 w-3 mr-1" />}
                          {change.scoreType === "trust" ? "Trust" : "Integration"}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{change.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground line-through">{change.previousScore.toFixed(1)}</span>
                      <span className="text-lg font-semibold">{change.newScore.toFixed(1)}</span>
                      <span className={cn(
                        "text-sm font-medium",
                        change.newScore > change.previousScore ? "text-success" : "text-destructive"
                      )}>
                        ({change.newScore > change.previousScore ? "+" : ""}{(change.newScore - change.previousScore).toFixed(1)})
                      </span>
                    </div>
                    <Badge className={getCategoryColor(change.category)}>{change.category}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">{change.reason}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* What-If Simulator */}
        <TabsContent value="whatif" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-1">What-If Scenario Simulator</h3>
              <p className="text-muted-foreground">
                Toggle scenarios to see how rankings change based on your values. Watch scores reorder dynamically.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {whatIfScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-colors",
                    activeScenarios.includes(scenario.id) ? "border-primary bg-primary/5" : "border-transparent bg-muted/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{scenario.name}</span>
                    <Switch
                      checked={activeScenarios.includes(scenario.id)}
                      onCheckedChange={() => toggleScenario(scenario.id)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
              ))}
            </div>

            {activeScenarios.includes("privacy-first") && (
              <div className="p-4 rounded-lg bg-muted/50 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Privacy Weight Multiplier</span>
                  <span className="text-sm text-primary font-semibold">{privacyWeight[0]}x</span>
                </div>
                <Slider
                  value={privacyWeight}
                  onValueChange={setPrivacyWeight}
                  min={1}
                  max={3}
                  step={0.5}
                  className="w-full"
                />
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Filtered Rankings</h3>
              <Badge variant="outline">
                {getFilteredProducts().length} of {mockProducts.length} products
              </Badge>
            </div>

            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {getFilteredProducts().map((product, i) => (
                  <motion.div
                    key={product.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">#{i + 1}</span>
                      <span className="font-medium">{product.name}</span>
                      <div className="flex gap-1">
                        {product.openSource && <Badge variant="outline" className="text-xs">Open Source</Badge>}
                        {product.e2e && <Badge variant="outline" className="text-xs">E2E</Badge>}
                        {product.localApi && <Badge variant="outline" className="text-xs">Local API</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="bg-primary/10 text-primary">
                        <Shield className="h-3 w-3 mr-1" />
                        {(activeScenarios.includes("privacy-first") ? product.adjustedTrustScore : product.trustScore).toFixed(1)}
                      </Badge>
                      <Badge className="bg-secondary/10 text-secondary">
                        <Link2 className="h-3 w-3 mr-1" />
                        {product.integrationScore.toFixed(1)}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>

            {getFilteredProducts().length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No products match all selected criteria</p>
                <p className="text-sm">Try removing some filters</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
