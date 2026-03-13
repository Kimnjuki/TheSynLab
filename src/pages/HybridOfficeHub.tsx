import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Briefcase, Monitor, Armchair, Lightbulb, Check, X, AlertTriangle,
  DollarSign, Activity, ShoppingCart, Package, Star, Award, Save, Trash2, History
} from "lucide-react";
import { toast } from "sonner";
import { useErgonomicAssessments } from "@/hooks/useHubData";
import { useAuth } from "@/contexts/AuthContext";

// Ergonomic Assessment Criteria
const ergonomicFactors = [
  {
    id: "monitor",
    name: "Monitor Position",
    icon: Monitor,
    questions: [
      { id: "height", label: "Monitor at eye level?", weight: 20 },
      { id: "distance", label: "20-26 inches from eyes?", weight: 15 },
      { id: "tilt", label: "Slight downward tilt?", weight: 10 },
    ],
  },
  {
    id: "chair",
    name: "Chair Setup",
    icon: Armchair,
    questions: [
      { id: "lumbar", label: "Lumbar support?", weight: 20 },
      { id: "armrests", label: "Adjustable armrests?", weight: 10 },
      { id: "feet", label: "Feet flat on floor?", weight: 10 },
    ],
  },
  {
    id: "lighting",
    name: "Lighting",
    icon: Lightbulb,
    questions: [
      { id: "natural", label: "Natural light available?", weight: 5 },
      { id: "glare", label: "No screen glare?", weight: 5 },
      { id: "task", label: "Task lighting present?", weight: 5 },
    ],
  },
];

// Hardware Bundles
const hardwareBundles = [
  {
    id: "starter",
    name: "Starter Setup",
    description: "Essential equipment for remote work",
    price: 500,
    products: [
      { name: "24\" IPS Monitor", price: 180 },
      { name: "Basic Ergonomic Chair", price: 200 },
      { name: "Keyboard & Mouse Combo", price: 50 },
      { name: "Laptop Stand", price: 40 },
      { name: "Desk Lamp", price: 30 },
    ],
    trustScore: 7.2,
    integrationScore: 6.5,
  },
  {
    id: "professional",
    name: "Professional Setup",
    description: "Optimized for productivity and comfort",
    price: 1200,
    products: [
      { name: "27\" 4K Monitor", price: 350 },
      { name: "Herman Miller Style Chair", price: 450 },
      { name: "Mechanical Keyboard", price: 120 },
      { name: "Ergonomic Mouse", price: 80 },
      { name: "Monitor Arm", price: 100 },
      { name: "USB-C Dock", price: 100 },
    ],
    trustScore: 8.5,
    integrationScore: 8.0,
  },
  {
    id: "executive",
    name: "Executive Suite",
    description: "Premium experience with top-tier equipment",
    price: 2500,
    products: [
      { name: "32\" 4K Curved Monitor", price: 600 },
      { name: "Herman Miller Aeron", price: 1200 },
      { name: "Custom Mechanical Keyboard", price: 200 },
      { name: "Logitech MX Master 3S", price: 100 },
      { name: "Dual Monitor Arms", price: 150 },
      { name: "Thunderbolt Dock", price: 250 },
    ],
    trustScore: 9.2,
    integrationScore: 9.5,
  },
  {
    id: "developer",
    name: "Developer Station",
    description: "Optimized for coding and multi-tasking",
    price: 1800,
    products: [
      { name: "Dual 27\" Monitors", price: 600 },
      { name: "Split Ergonomic Keyboard", price: 250 },
      { name: "Vertical Mouse", price: 70 },
      { name: "Standing Desk Converter", price: 300 },
      { name: "Premium Chair", price: 400 },
      { name: "Multi-port Hub", price: 80 },
      { name: "Webcam 1080p", price: 100 },
    ],
    trustScore: 8.8,
    integrationScore: 9.0,
  },
];

// Role-based recommendations
const roleRecommendations = {
  developer: ["developer", "professional"],
  designer: ["executive", "professional"],
  manager: ["executive", "professional"],
  writer: ["professional", "starter"],
  analyst: ["developer", "professional"],
};

const HybridOfficeHub = () => {
  const { user } = useAuth();
  const { assessments, saveAssessment, deleteAssessment } = useErgonomicAssessments();
  
  // Ergonomic Calculator State
  const [ergonomicAnswers, setErgonomicAnswers] = useState<Record<string, boolean>>({});
  
  // Bundle Selector State
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [budget, setBudget] = useState([1500]);

  // Calculate Ergonomic Score
  const ergonomicScore = useMemo(() => {
    let score = 0;
    let maxScore = 0;

    ergonomicFactors.forEach((factor) => {
      factor.questions.forEach((q) => {
        maxScore += q.weight;
        if (ergonomicAnswers[`${factor.id}-${q.id}`]) {
          score += q.weight;
        }
      });
    });

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  }, [ergonomicAnswers]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Needs Improvement";
    return "Poor";
  };

  const getImprovementTips = () => {
    const tips: string[] = [];
    
    ergonomicFactors.forEach((factor) => {
      factor.questions.forEach((q) => {
        if (!ergonomicAnswers[`${factor.id}-${q.id}`]) {
          tips.push(`${factor.name}: ${q.label.replace("?", "")}`);
        }
      });
    });

    return tips;
  };

  // Filter bundles by budget and role
  const recommendedBundles = useMemo(() => {
    let filtered = hardwareBundles.filter((b) => b.price <= budget[0]);
    
    if (selectedRole && roleRecommendations[selectedRole as keyof typeof roleRecommendations]) {
      const roleIds = roleRecommendations[selectedRole as keyof typeof roleRecommendations];
      filtered = filtered.sort((a, b) => {
        const aIndex = roleIds.indexOf(a.id);
        const bIndex = roleIds.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    return filtered;
  }, [budget, selectedRole]);

  const handleSaveAssessment = async () => {
    await saveAssessment({
      answers: ergonomicAnswers,
      score: ergonomicScore,
      improvement_tips: getImprovementTips(),
      selected_bundle: recommendedBundles[0]?.id || null,
      role: selectedRole || null,
      budget: budget[0],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Hybrid Office Hub</h1>
              <p className="text-muted-foreground">
                Ergonomic assessments, hardware bundles, and setup optimization
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="ergonomic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="ergonomic" className="gap-2">
              <Activity className="h-4 w-4" />
              Ergonomic Score
            </TabsTrigger>
            <TabsTrigger value="bundles" className="gap-2">
              <Package className="h-4 w-4" />
              Hardware Bundles
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Setup Optimizer
            </TabsTrigger>
          </TabsList>

          {/* Ergonomic Score Calculator */}
          <TabsContent value="ergonomic" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Ergonomic Assessment
                  </CardTitle>
                  <CardDescription>
                    Answer these questions to get your workspace health score
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {ergonomicFactors.map((factor) => (
                    <div key={factor.id} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <factor.icon className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">{factor.name}</h4>
                      </div>
                      <div className="pl-7 space-y-2">
                        {factor.questions.map((q) => (
                          <div
                            key={q.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:border-primary transition-colors"
                          >
                            <span className="text-sm">{q.label}</span>
                            <div className="flex gap-2">
                              <Button
                                variant={ergonomicAnswers[`${factor.id}-${q.id}`] === true ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  setErgonomicAnswers((prev) => ({
                                    ...prev,
                                    [`${factor.id}-${q.id}`]: true,
                                  }))
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant={ergonomicAnswers[`${factor.id}-${q.id}`] === false ? "destructive" : "outline"}
                                size="sm"
                                onClick={() =>
                                  setErgonomicAnswers((prev) => ({
                                    ...prev,
                                    [`${factor.id}-${q.id}`]: false,
                                  }))
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Your Ergonomic Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-6">
                    <div className={`text-6xl font-bold ${getScoreColor(ergonomicScore)}`}>
                      {ergonomicScore}%
                    </div>
                    <p className={`text-xl font-medium mt-2 ${getScoreColor(ergonomicScore)}`}>
                      {getScoreLabel(ergonomicScore)}
                    </p>
                  </div>

                  <Progress value={ergonomicScore} className="h-3" />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    {ergonomicFactors.map((factor) => {
                      const factorScore = factor.questions.reduce((acc, q) => {
                        return acc + (ergonomicAnswers[`${factor.id}-${q.id}`] ? 1 : 0);
                      }, 0);
                      const factorMax = factor.questions.length;
                      
                      return (
                        <div key={factor.id} className="p-3 rounded-lg bg-muted">
                          <factor.icon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                          <p className="text-lg font-bold">{factorScore}/{factorMax}</p>
                          <p className="text-xs text-muted-foreground">{factor.name}</p>
                        </div>
                      );
                    })}
                  </div>

                  {ergonomicScore < 100 && (
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <h4 className="font-medium">Areas to Improve</h4>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {getImprovementTips().slice(0, 4).map((tip, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {user && Object.keys(ergonomicAnswers).length > 0 && (
                    <Button onClick={handleSaveAssessment} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save Assessment
                    </Button>
                  )}

                  {assessments.length > 0 && (
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <History className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">Previous Assessments</h4>
                      </div>
                      <div className="space-y-2 max-h-[150px] overflow-y-auto">
                        {assessments.slice(0, 3).map((assessment) => (
                          <div key={assessment.id} className="flex items-center justify-between p-2 bg-background rounded border">
                            <div>
                              <span className={`font-bold ${getScoreColor(assessment.score)}`}>
                                {assessment.score}%
                              </span>
                              <span className="text-xs text-muted-foreground ml-2">
                                {new Date(assessment.assessment_date).toLocaleDateString()}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAssessment(assessment.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Hardware Bundles */}
          <TabsContent value="bundles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Pre-Configured Hardware Bundles
                </CardTitle>
                <CardDescription>
                  Complete setups curated for different work styles and budgets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hardwareBundles.map((bundle) => (
                    <Card
                      key={bundle.id}
                      className="relative overflow-hidden hover:border-primary transition-colors"
                    >
                      {bundle.id === "professional" && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl">
                          Popular
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{bundle.name}</CardTitle>
                        <CardDescription>{bundle.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-3xl font-bold">${bundle.price}</div>
                        
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Trust</p>
                            <p className={`font-bold ${bundle.trustScore >= 8 ? "text-green-500" : "text-yellow-500"}`}>
                              {bundle.trustScore}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Integration</p>
                            <p className={`font-bold ${bundle.integrationScore >= 8 ? "text-green-500" : "text-yellow-500"}`}>
                              {bundle.integrationScore}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {bundle.products.slice(0, 4).map((product, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                              <span className="truncate pr-2">{product.name}</span>
                              <span className="text-muted-foreground">${product.price}</span>
                            </div>
                          ))}
                          {bundle.products.length > 4 && (
                            <p className="text-xs text-muted-foreground">
                              +{bundle.products.length - 4} more items
                            </p>
                          )}
                        </div>

                        <Button className="w-full" onClick={() => toast.success(`${bundle.name} added to comparison!`)}>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          View Bundle
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setup Optimizer */}
          <TabsContent value="optimizer" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Setup Optimizer
                  </CardTitle>
                  <CardDescription>
                    Get personalized recommendations based on your role and budget
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Your Role</label>
                    <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
                      {Object.keys(roleRecommendations).map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <RadioGroupItem value={role} id={role} />
                          <Label htmlFor={role} className="capitalize">{role}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Budget: ${budget[0]}
                    </label>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      min={300}
                      max={3000}
                      step={100}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>$300</span>
                      <span>$3000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Recommended for You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendedBundles.length > 0 ? (
                    <div className="space-y-4">
                      {recommendedBundles.map((bundle, index) => (
                        <div
                          key={bundle.id}
                          className={`p-4 rounded-lg border ${
                            index === 0 ? "border-primary bg-primary/5" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{bundle.name}</h4>
                                {index === 0 && (
                                  <Badge className="bg-primary">Best Match</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{bundle.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">${bundle.price}</p>
                              <p className="text-xs text-muted-foreground">
                                ${(bundle.price - budget[0]).toFixed(0)} {bundle.price <= budget[0] ? "under" : "over"} budget
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {bundle.products.map((product, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {product.name}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Trust Score:</span>
                              <span className={`font-bold ${bundle.trustScore >= 8 ? "text-green-500" : "text-yellow-500"}`}>
                                {bundle.trustScore}/10
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">Integration:</span>
                              <span className={`font-bold ${bundle.integrationScore >= 8 ? "text-green-500" : "text-yellow-500"}`}>
                                {bundle.integrationScore}/10
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Increase your budget to see recommendations</p>
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

export default HybridOfficeHub;
