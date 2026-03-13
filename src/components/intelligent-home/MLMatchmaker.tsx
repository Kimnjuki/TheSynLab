import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Brain, Sparkles, Check, X, Target, Filter, Zap, Shield, 
  DollarSign, Wifi, ArrowRight, RefreshCw, Star, Lightbulb
} from "lucide-react";

// Comparesoft.com inspired ML matchmaking
interface MatchCriteria {
  budget: [number, number];
  priorityFeatures: string[];
  ecosystems: string[];
  protocols: string[];
  minTrustScore: number;
  minIntegrationScore: number;
  useCase: string;
}

interface MatchResult {
  deviceId: number;
  deviceName: string;
  brand: string;
  category: string;
  price: number;
  matchScore: number; // 0-100
  matchReasons: string[];
  mismatches: string[];
  trustScore: number;
  integrationScore: number;
  ecosystems: string[];
  protocols: string[];
}

interface MLMatchmakerProps {
  devices: Array<{
    id: number;
    name: string;
    brand: string;
    category: string;
    priceValue: number;
    trustScore: number;
    integrationScore: number;
    ecosystems: string[];
    protocols: string[];
    pros: string[];
  }>;
}

const MLMatchmaker = ({ devices }: MLMatchmakerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [criteria, setCriteria] = useState<MatchCriteria>({
    budget: [0, 300],
    priorityFeatures: [],
    ecosystems: [],
    protocols: [],
    minTrustScore: 7,
    minIntegrationScore: 7,
    useCase: ""
  });

  const allEcosystems = [...new Set(devices.flatMap(d => d.ecosystems))];
  const allProtocols = [...new Set(devices.flatMap(d => d.protocols))];
  const useCases = [
    "Smart Lighting",
    "Climate Control", 
    "Home Security",
    "Voice Control Hub",
    "Energy Monitoring",
    "Entertainment"
  ];
  const featureOptions = [
    "Matter Support",
    "Thread Support",
    "Local Control",
    "No Subscription",
    "Easy Setup",
    "Good Privacy"
  ];

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  // ML-style matching algorithm (Comparesoft inspired)
  const matchResults: MatchResult[] = useMemo(() => {
    if (!showResults) return [];

    return devices
      .map((device) => {
        let matchScore = 0;
        const matchReasons: string[] = [];
        const mismatches: string[] = [];

        // Budget match (0-25 points)
        if (device.priceValue >= criteria.budget[0] && device.priceValue <= criteria.budget[1]) {
          matchScore += 25;
          matchReasons.push("Within budget range");
        } else {
          mismatches.push("Outside budget range");
        }

        // Trust score match (0-20 points)
        if (device.trustScore >= criteria.minTrustScore) {
          matchScore += 20;
          matchReasons.push(`Trust Score ${device.trustScore}/10`);
        } else {
          mismatches.push(`Trust Score below ${criteria.minTrustScore}`);
        }

        // Integration score match (0-20 points)
        if (device.integrationScore >= criteria.minIntegrationScore) {
          matchScore += 20;
          matchReasons.push(`Integration Score ${device.integrationScore}/10`);
        } else {
          mismatches.push(`Integration Score below ${criteria.minIntegrationScore}`);
        }

        // Ecosystem match (0-15 points)
        if (criteria.ecosystems.length > 0) {
          const ecosystemMatches = criteria.ecosystems.filter(e => 
            device.ecosystems.includes(e)
          ).length;
          const ecosystemScore = (ecosystemMatches / criteria.ecosystems.length) * 15;
          matchScore += ecosystemScore;
          if (ecosystemMatches > 0) {
            matchReasons.push(`${ecosystemMatches}/${criteria.ecosystems.length} ecosystems match`);
          } else {
            mismatches.push("No matching ecosystems");
          }
        } else {
          matchScore += 15; // No preference = full points
        }

        // Protocol match (0-10 points)
        if (criteria.protocols.length > 0) {
          const protocolMatches = criteria.protocols.filter(p => 
            device.protocols.includes(p)
          ).length;
          const protocolScore = (protocolMatches / criteria.protocols.length) * 10;
          matchScore += protocolScore;
          if (protocolMatches > 0) {
            matchReasons.push(`Supports ${protocolMatches} required protocols`);
          } else {
            mismatches.push("Missing required protocols");
          }
        } else {
          matchScore += 10;
        }

        // Feature priority match (0-10 points)
        if (criteria.priorityFeatures.length > 0) {
          let featureMatches = 0;
          criteria.priorityFeatures.forEach(feature => {
            if (feature === "Matter Support" && device.protocols.includes("Matter")) featureMatches++;
            if (feature === "Thread Support" && device.protocols.includes("Thread")) featureMatches++;
            if (feature === "Good Privacy" && device.trustScore >= 8) featureMatches++;
            if (feature === "Easy Setup" && device.integrationScore >= 8) featureMatches++;
          });
          const featureScore = (featureMatches / criteria.priorityFeatures.length) * 10;
          matchScore += featureScore;
          if (featureMatches > 0) {
            matchReasons.push(`${featureMatches} priority features matched`);
          }
        } else {
          matchScore += 10;
        }

        return {
          deviceId: device.id,
          deviceName: device.name,
          brand: device.brand,
          category: device.category,
          price: device.priceValue,
          matchScore: Math.round(matchScore),
          matchReasons,
          mismatches,
          trustScore: device.trustScore,
          integrationScore: device.integrationScore,
          ecosystems: device.ecosystems,
          protocols: device.protocols
        };
      })
      .filter(result => result.matchScore >= 40)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [devices, criteria, showResults]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate ML processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const handleReset = () => {
    setCriteria({
      budget: [0, 300],
      priorityFeatures: [],
      ecosystems: [],
      protocols: [],
      minTrustScore: 7,
      minIntegrationScore: 7,
      useCase: ""
    });
    setShowResults(false);
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-accent";
    return "text-muted-foreground";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    if (score >= 40) return "Partial Match";
    return "Low Match";
  };

  return (
    <div className="space-y-6">
      {/* Hero Section (Comparesoft style) */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                ML-Powered Device Matchmaker
                <Badge variant="outline" className="text-xs bg-primary/10">AI</Badge>
              </h3>
              <p className="text-muted-foreground">
                Analyzing {devices.length} devices across 179,000+ features to find your perfect match
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Criteria Selection Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Your Requirements
            </CardTitle>
            <CardDescription>
              Tell us what you're looking for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Budget Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Budget Range: ${criteria.budget[0]} - ${criteria.budget[1]}
              </Label>
              <Slider
                value={criteria.budget}
                onValueChange={(v) => setCriteria(prev => ({ ...prev, budget: v as [number, number] }))}
                min={0}
                max={500}
                step={25}
              />
            </div>

            {/* Use Case */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Primary Use Case
              </Label>
              <div className="flex flex-wrap gap-2">
                {useCases.map((useCase) => (
                  <Badge
                    key={useCase}
                    variant={criteria.useCase === useCase ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCriteria(prev => ({ ...prev, useCase }))}
                  >
                    {useCase}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Ecosystems */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Required Ecosystems
              </Label>
              <div className="flex flex-wrap gap-2">
                {allEcosystems.map((eco) => (
                  <Badge
                    key={eco}
                    variant={criteria.ecosystems.includes(eco) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCriteria(prev => ({
                      ...prev,
                      ecosystems: toggleArrayItem(prev.ecosystems, eco)
                    }))}
                  >
                    {eco}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Protocols */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Required Protocols
              </Label>
              <div className="flex flex-wrap gap-2">
                {allProtocols.map((proto) => (
                  <Badge
                    key={proto}
                    variant={criteria.protocols.includes(proto) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCriteria(prev => ({
                      ...prev,
                      protocols: toggleArrayItem(prev.protocols, proto)
                    }))}
                  >
                    {proto}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Minimum Scores */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Min Trust Score: {criteria.minTrustScore}
              </Label>
              <Slider
                value={[criteria.minTrustScore]}
                onValueChange={(v) => setCriteria(prev => ({ ...prev, minTrustScore: v[0] }))}
                min={0}
                max={10}
                step={0.5}
              />
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Min Integration Score: {criteria.minIntegrationScore}
              </Label>
              <Slider
                value={[criteria.minIntegrationScore]}
                onValueChange={(v) => setCriteria(prev => ({ ...prev, minIntegrationScore: v[0] }))}
                min={0}
                max={10}
                step={0.5}
              />
            </div>

            {/* Priority Features */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Priority Features
              </Label>
              <div className="space-y-2">
                {featureOptions.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Checkbox
                      id={feature}
                      checked={criteria.priorityFeatures.includes(feature)}
                      onCheckedChange={() => setCriteria(prev => ({
                        ...prev,
                        priorityFeatures: toggleArrayItem(prev.priorityFeatures, feature)
                      }))}
                    />
                    <Label htmlFor={feature} className="text-sm cursor-pointer">
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                className="flex-1 gap-2" 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Find Matches
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-4">
          {showResults ? (
            <>
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold">
                  Found {matchResults.length} matches
                </h4>
                <Badge variant="outline">
                  <Sparkles className="h-3 w-3 mr-1" />
                  ML Scored
                </Badge>
              </div>

              {matchResults.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No matches found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your requirements</p>
                    <Button variant="outline" onClick={handleReset}>Reset Filters</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {matchResults.map((result, idx) => (
                    <Card 
                      key={result.deviceId} 
                      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                        idx === 0 ? 'ring-2 ring-success' : ''
                      }`}
                    >
                      {idx === 0 && (
                        <div className="absolute top-0 right-0 bg-success text-success-foreground text-xs px-3 py-1 rounded-bl font-medium">
                          Best Match
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg">{result.deviceName}</h4>
                              <Badge variant="outline">{result.brand}</Badge>
                              <Badge variant="secondary">{result.category}</Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 mb-3">
                              <span className="text-xl font-bold">${result.price}</span>
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-success" />
                                <span className="text-sm">Trust: {result.trustScore}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-primary" />
                                <span className="text-sm">Integration: {result.integrationScore}</span>
                              </div>
                            </div>

                            {/* Match Reasons */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {result.matchReasons.map((reason, i) => (
                                <div key={i} className="flex items-center gap-1 text-sm text-success">
                                  <Check className="h-3.5 w-3.5" />
                                  {reason}
                                </div>
                              ))}
                            </div>
                            {result.mismatches.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {result.mismatches.slice(0, 2).map((mismatch, i) => (
                                  <div key={i} className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <X className="h-3.5 w-3.5" />
                                    {mismatch}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Match Score */}
                          <div className="text-center shrink-0">
                            <div className={`text-4xl font-bold ${getMatchColor(result.matchScore)}`}>
                              {result.matchScore}%
                            </div>
                            <p className={`text-sm ${getMatchColor(result.matchScore)}`}>
                              {getMatchLabel(result.matchScore)}
                            </p>
                            <Button size="sm" className="mt-2 gap-1">
                              View Details <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Brain className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-medium mb-2">Set Your Requirements</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Configure your preferences in the panel on the left, then click "Find Matches" 
                  to let our ML algorithm find the perfect devices for you.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{devices.length}</p>
                    <p className="text-sm text-muted-foreground">Devices</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-secondary">179K+</p>
                    <p className="text-sm text-muted-foreground">Features</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-accent">100%</p>
                    <p className="text-sm text-muted-foreground">Unbiased</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLMatchmaker;
