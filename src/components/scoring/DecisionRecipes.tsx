import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ChefHat, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle,
  Home, Briefcase, Users, Laptop, Zap, Shield, DollarSign, Clock,
  Sparkles, XCircle, Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Recipe {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  questions: Question[];
}

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; description?: string }[];
}

interface Recommendation {
  name: string;
  category: string;
  trustScore: number;
  integrationScore: number;
  price: string;
  whyChosen: string;
  tradeoffs: { pro: string; con: string }[];
  bestFor: string[];
}

const recipes: Recipe[] = [
  {
    id: "remote-team",
    title: "Remote-First Team Setup",
    description: "Build the perfect stack for distributed teams",
    icon: Users,
    category: "Productivity",
    questions: [
      {
        id: "size",
        question: "What's your team size?",
        options: [
          { value: "solo", label: "Solo / Freelancer", description: "Just me" },
          { value: "small", label: "Small Team", description: "2-10 people" },
          { value: "medium", label: "Medium Team", description: "11-50 people" },
          { value: "large", label: "Large Team", description: "50+ people" }
        ]
      },
      {
        id: "priority",
        question: "What's your top priority?",
        options: [
          { value: "collaboration", label: "Real-time Collaboration", description: "Work together seamlessly" },
          { value: "async", label: "Async Communication", description: "Different timezones, flexible hours" },
          { value: "security", label: "Security & Compliance", description: "Enterprise-grade protection" },
          { value: "cost", label: "Cost Efficiency", description: "Maximum value for budget" }
        ]
      },
      {
        id: "existing",
        question: "What's your current main tool?",
        options: [
          { value: "google", label: "Google Workspace", description: "Gmail, Docs, Drive" },
          { value: "microsoft", label: "Microsoft 365", description: "Outlook, Teams, OneDrive" },
          { value: "slack", label: "Slack + Others", description: "Mix of tools" },
          { value: "nothing", label: "Starting Fresh", description: "No current tools" }
        ]
      },
      {
        id: "budget",
        question: "What's your monthly budget per user?",
        options: [
          { value: "free", label: "Free Only", description: "$0/user" },
          { value: "low", label: "Budget", description: "Under $20/user" },
          { value: "medium", label: "Standard", description: "$20-50/user" },
          { value: "high", label: "Enterprise", description: "$50+/user" }
        ]
      },
      {
        id: "privacy",
        question: "How important is data privacy?",
        options: [
          { value: "critical", label: "Critical", description: "Must be local/E2E encrypted" },
          { value: "important", label: "Very Important", description: "GDPR compliant required" },
          { value: "standard", label: "Standard", description: "Basic security is fine" },
          { value: "flexible", label: "Flexible", description: "Convenience over privacy" }
        ]
      }
    ]
  },
  {
    id: "smart-home-starter",
    title: "Smart Home Starter Kit",
    description: "Your first smart home setup done right",
    icon: Home,
    category: "Smart Home",
    questions: [
      {
        id: "phone",
        question: "What's your primary phone ecosystem?",
        options: [
          { value: "ios", label: "iPhone / iOS", description: "Apple ecosystem" },
          { value: "android", label: "Android", description: "Google/Samsung/etc" },
          { value: "mixed", label: "Mixed Household", description: "Both iOS and Android" }
        ]
      },
      {
        id: "priority",
        question: "What matters most to you?",
        options: [
          { value: "privacy", label: "Privacy First", description: "Local processing, no cloud" },
          { value: "ease", label: "Ease of Use", description: "Simple setup, just works" },
          { value: "power", label: "Power & Flexibility", description: "Advanced automations" },
          { value: "cost", label: "Budget Friendly", description: "Best value for money" }
        ]
      },
      {
        id: "skill",
        question: "What's your technical comfort level?",
        options: [
          { value: "beginner", label: "Beginner", description: "Prefer plug-and-play" },
          { value: "intermediate", label: "Intermediate", description: "Comfortable with apps" },
          { value: "advanced", label: "Advanced", description: "Can handle some tinkering" },
          { value: "expert", label: "Expert", description: "Bring on the complexity" }
        ]
      },
      {
        id: "focus",
        question: "What's your first smart home focus?",
        options: [
          { value: "lighting", label: "Smart Lighting", description: "Bulbs, switches, scenes" },
          { value: "security", label: "Security", description: "Cameras, locks, sensors" },
          { value: "climate", label: "Climate Control", description: "Thermostats, fans, AC" },
          { value: "entertainment", label: "Entertainment", description: "Speakers, TV control" }
        ]
      },
      {
        id: "budget",
        question: "What's your starting budget?",
        options: [
          { value: "minimal", label: "Minimal", description: "Under $100" },
          { value: "starter", label: "Starter", description: "$100-300" },
          { value: "moderate", label: "Moderate", description: "$300-600" },
          { value: "premium", label: "Premium", description: "$600+" }
        ]
      }
    ]
  },
  {
    id: "hybrid-office",
    title: "Hybrid Office Fit-Out",
    description: "Equipment for the modern hybrid workspace",
    icon: Briefcase,
    category: "Office Hardware",
    questions: [
      {
        id: "days",
        question: "How often do you work from home?",
        options: [
          { value: "mostly-home", label: "Mostly Remote", description: "4-5 days/week at home" },
          { value: "hybrid", label: "True Hybrid", description: "2-3 days each" },
          { value: "mostly-office", label: "Mostly Office", description: "1-2 days/week at home" }
        ]
      },
      {
        id: "work",
        question: "What type of work do you primarily do?",
        options: [
          { value: "meetings", label: "Video Calls Heavy", description: "Lots of meetings" },
          { value: "creative", label: "Creative Work", description: "Design, video, audio" },
          { value: "coding", label: "Development", description: "Coding, technical work" },
          { value: "general", label: "General Office", description: "Docs, email, spreadsheets" }
        ]
      },
      {
        id: "space",
        question: "What's your home office situation?",
        options: [
          { value: "dedicated", label: "Dedicated Room", description: "Full home office" },
          { value: "corner", label: "Desk Corner", description: "Space in shared room" },
          { value: "mobile", label: "Mobile Setup", description: "Kitchen table, couch, etc" }
        ]
      },
      {
        id: "priority",
        question: "What would improve your work most?",
        options: [
          { value: "ergonomics", label: "Ergonomics", description: "Chair, desk, posture" },
          { value: "video", label: "Video Quality", description: "Camera, lighting, audio" },
          { value: "productivity", label: "Productivity", description: "Monitors, peripherals" },
          { value: "health", label: "Health & Wellness", description: "Standing desk, lighting" }
        ]
      },
      {
        id: "budget",
        question: "What's your total budget?",
        options: [
          { value: "minimal", label: "Essential Only", description: "Under $300" },
          { value: "moderate", label: "Good Setup", description: "$300-800" },
          { value: "premium", label: "Premium Setup", description: "$800-2000" },
          { value: "unlimited", label: "Best Available", description: "$2000+" }
        ]
      }
    ]
  }
];

// Generate recommendations based on answers
const generateRecommendations = (recipeId: string, answers: Record<string, string>): Recommendation[] => {
  // This would normally call an API or use more sophisticated logic
  const recommendations: Recommendation[] = [];
  
  if (recipeId === "remote-team") {
    if (answers.priority === "async" || answers.priority === "collaboration") {
      recommendations.push({
        name: "Notion",
        category: "Knowledge Base",
        trustScore: 8.2,
        integrationScore: 8.8,
        price: "$10/user/mo",
        whyChosen: "Best-in-class for async documentation and collaboration",
        tradeoffs: [
          { pro: "Extremely flexible workspace", con: "Learning curve for advanced features" },
          { pro: "Excellent API and integrations", con: "Can be slow with large databases" }
        ],
        bestFor: ["Documentation", "Wikis", "Project tracking", "Async collaboration"]
      });
    }
    
    if (answers.security === "critical" || answers.privacy === "critical") {
      recommendations.push({
        name: "Proton Suite",
        category: "Email & Storage",
        trustScore: 9.5,
        integrationScore: 7.2,
        price: "$12/user/mo",
        whyChosen: "End-to-end encryption with Swiss privacy laws",
        tradeoffs: [
          { pro: "Maximum privacy and security", con: "Fewer integrations than Google/Microsoft" },
          { pro: "Zero-access encryption", con: "Some features less polished" }
        ],
        bestFor: ["Privacy-conscious teams", "Legal/medical industries", "Security-first orgs"]
      });
    }
    
    recommendations.push({
      name: "Linear",
      category: "Project Management",
      trustScore: 8.5,
      integrationScore: 8.9,
      price: "$8/user/mo",
      whyChosen: "Fast, keyboard-driven project management for modern teams",
      tradeoffs: [
        { pro: "Lightning-fast interface", con: "Opinionated workflow" },
        { pro: "Excellent GitHub integration", con: "Less flexible than Jira" }
      ],
      bestFor: ["Dev teams", "Startups", "Fast-moving teams"]
    });
  }
  
  if (recipeId === "smart-home-starter") {
    if (answers.priority === "privacy") {
      recommendations.push({
        name: "Home Assistant",
        category: "Smart Home Hub",
        trustScore: 9.4,
        integrationScore: 9.8,
        price: "$150 (one-time)",
        whyChosen: "100% local processing with 3,300+ integrations",
        tradeoffs: [
          { pro: "Complete privacy, no cloud required", con: "Steeper learning curve" },
          { pro: "Ultimate flexibility and control", con: "Requires initial setup time" }
        ],
        bestFor: ["Privacy enthusiasts", "Power users", "DIY automation fans"]
      });
    } else if (answers.priority === "ease") {
      recommendations.push({
        name: "Apple HomeKit",
        category: "Smart Home Ecosystem",
        trustScore: 9.1,
        integrationScore: 7.5,
        price: "Included with iOS",
        whyChosen: "Seamless experience for Apple users with strong privacy",
        tradeoffs: [
          { pro: "Just works with Apple devices", con: "Limited to HomeKit-certified devices" },
          { pro: "End-to-end encryption", con: "Smaller device ecosystem" }
        ],
        bestFor: ["iPhone users", "Simplicity seekers", "Privacy-conscious beginners"]
      });
    }
    
    if (answers.focus === "lighting") {
      recommendations.push({
        name: "Philips Hue",
        category: "Smart Lighting",
        trustScore: 8.3,
        integrationScore: 9.2,
        price: "$150-300 starter kit",
        whyChosen: "Most reliable and widely compatible smart lighting system",
        tradeoffs: [
          { pro: "Works with everything", con: "Premium pricing" },
          { pro: "Excellent app and automations", con: "Requires Hue Bridge for full features" }
        ],
        bestFor: ["Reliability seekers", "Multi-ecosystem homes", "Quality-first buyers"]
      });
    }
  }
  
  if (recipeId === "hybrid-office") {
    if (answers.priority === "video") {
      recommendations.push({
        name: "Logitech Brio 4K",
        category: "Webcam",
        trustScore: 8.4,
        integrationScore: 9.0,
        price: "$199",
        whyChosen: "Professional-grade video quality with excellent low-light performance",
        tradeoffs: [
          { pro: "4K resolution, HDR support", con: "Premium price point" },
          { pro: "Windows Hello compatible", con: "Requires good lighting for best results" }
        ],
        bestFor: ["Video call heavy roles", "Content creators", "Remote presenters"]
      });
    }
    
    if (answers.priority === "ergonomics") {
      recommendations.push({
        name: "Herman Miller Aeron",
        category: "Office Chair",
        trustScore: 8.8,
        integrationScore: 6.0,
        price: "$1,395",
        whyChosen: "Industry-standard ergonomic chair with 12-year warranty",
        tradeoffs: [
          { pro: "Exceptional ergonomics and build quality", con: "High initial investment" },
          { pro: "12-year warranty, holds value", con: "Takes time to find right settings" }
        ],
        bestFor: ["Long work sessions", "Back pain sufferers", "Investment in health"]
      });
    }
  }
  
  return recommendations;
};

export default function DecisionRecipes() {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (selectedRecipe && currentQuestion < selectedRecipe.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setSelectedRecipe(null);
    }
  };

  const handleReset = () => {
    setSelectedRecipe(null);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const recommendations = selectedRecipe ? generateRecommendations(selectedRecipe.id, answers) : [];

  if (!selectedRecipe) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent">
            <ChefHat className="h-4 w-4" />
            <span className="text-sm font-medium">Decision Recipes</span>
          </div>
          <h2 className="text-2xl font-bold">Get Personalized Recommendations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Answer 5 quick questions and get a curated shortlist with clear trade-offs. No endless catalogs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="p-6 cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => handleSelectRecipe(recipe)}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <recipe.icon className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="secondary" className="mb-2">{recipe.category}</Badge>
              <h3 className="text-lg font-semibold mb-2">{recipe.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{recipe.description}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {recipe.questions.length} questions • ~2 min
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">{selectedRecipe.category}</Badge>
            <h2 className="text-2xl font-bold">{selectedRecipe.title}</h2>
            <p className="text-muted-foreground">Your personalized recommendations</p>
          </div>
          <Button variant="outline" onClick={handleReset}>
            Start Over
          </Button>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {index === 0 && <Star className="h-5 w-5 text-accent fill-accent" />}
                      <h3 className="text-xl font-semibold">{rec.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{rec.category}</Badge>
                      <span className="text-sm text-muted-foreground">{rec.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-primary/10 text-primary">
                      <Shield className="h-3 w-3 mr-1" />
                      Trust: {rec.trustScore}
                    </Badge>
                    <Badge className="bg-secondary/10 text-secondary">
                      <Zap className="h-3 w-3 mr-1" />
                      Integration: {rec.integrationScore}
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{rec.whyChosen}</p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-success">Pros</h4>
                    {rec.tradeoffs.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm mb-1">
                        <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{t.pro}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-accent">Trade-offs</h4>
                    {rec.tradeoffs.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm mb-1">
                        <AlertTriangle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                        <span>{t.con}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Best for:</span>
                  {rec.bestFor.map((use) => (
                    <Badge key={use} variant="secondary" className="text-xs">{use}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const question = selectedRecipe.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedRecipe.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Badge variant="outline">
          Question {currentQuestion + 1} of {selectedRecipe.questions.length}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card className="p-8">
        <h3 className="text-xl font-semibold mb-6">{question.question}</h3>

        <RadioGroup
          value={answers[question.id] || ""}
          onValueChange={(value) => handleAnswer(question.id, value)}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div key={option.value}>
              <Label
                htmlFor={option.value}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors",
                  answers[question.id] === option.value
                    ? "border-primary bg-primary/5"
                    : "border-transparent bg-muted/50 hover:bg-muted"
                )}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      <Button
        size="lg"
        className="w-full"
        onClick={handleNext}
        disabled={!answers[question.id]}
      >
        {currentQuestion === selectedRecipe.questions.length - 1 ? (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Get Recommendations
          </>
        ) : (
          <>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
}
