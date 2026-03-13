import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Shield, DollarSign, Zap, Home, ArrowRight, ArrowLeft, 
  Check, Star, Wifi, Lock, Users, ChevronRight, RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface Question {
  id: string;
  question: string;
  description: string;
  type: 'single' | 'multiple' | 'slider';
  options?: { value: string; label: string; description: string; icon?: React.ReactNode }[];
  sliderConfig?: { min: number; max: number; step: number; labels: string[] };
}

interface EcosystemResult {
  id: string;
  name: string;
  logo: string;
  matchScore: number;
  privacyRating: string;
  priceRange: string;
  deviceCount: number;
  localControl: boolean;
  matterSupport: boolean;
  highlights: string[];
  tradeoffs: string[];
  bestFor: string;
}

const questions: Question[] = [
  {
    id: 'priority',
    question: 'What is your #1 priority for your smart home?',
    description: 'This helps us understand what matters most to you',
    type: 'single',
    options: [
      { value: 'privacy', label: 'Privacy & Security', description: 'Maximum data protection and local processing', icon: <Shield className="h-5 w-5" /> },
      { value: 'compatibility', label: 'Device Compatibility', description: 'Works with the most devices and brands', icon: <Wifi className="h-5 w-5" /> },
      { value: 'ease', label: 'Ease of Use', description: 'Simple setup and daily operation', icon: <Zap className="h-5 w-5" /> },
      { value: 'budget', label: 'Budget Friendly', description: 'Best value for money', icon: <DollarSign className="h-5 w-5" /> },
    ]
  },
  {
    id: 'existing',
    question: 'Which devices do you already own?',
    description: 'Select all that apply to ensure compatibility',
    type: 'multiple',
    options: [
      { value: 'apple', label: 'Apple (iPhone, iPad, Mac)', description: 'iOS ecosystem', icon: <span className="text-lg">🍎</span> },
      { value: 'android', label: 'Android Phone/Tablet', description: 'Google ecosystem', icon: <span className="text-lg">🤖</span> },
      { value: 'alexa', label: 'Amazon Echo/Alexa', description: 'Alexa ecosystem', icon: <span className="text-lg">🔷</span> },
      { value: 'google', label: 'Google Home/Nest', description: 'Google Home ecosystem', icon: <span className="text-lg">🔵</span> },
    ]
  },
  {
    id: 'technical',
    question: 'How technical are you?',
    description: 'This helps us match you with the right complexity level',
    type: 'slider',
    sliderConfig: { min: 1, max: 5, step: 1, labels: ['Beginner', 'Casual', 'Comfortable', 'Advanced', 'Expert'] }
  },
  {
    id: 'budget',
    question: 'What\'s your budget for smart home devices?',
    description: 'Including hub/controller and initial devices',
    type: 'single',
    options: [
      { value: 'low', label: 'Under $200', description: 'Basic starter setup', icon: <span className="text-lg">💵</span> },
      { value: 'medium', label: '$200 - $500', description: 'Moderate investment', icon: <span className="text-lg">💰</span> },
      { value: 'high', label: '$500 - $1000', description: 'Comprehensive setup', icon: <span className="text-lg">💎</span> },
      { value: 'premium', label: '$1000+', description: 'Premium whole-home', icon: <span className="text-lg">🏆</span> },
    ]
  },
  {
    id: 'cloud',
    question: 'How do you feel about cloud-based services?',
    description: 'Cloud services offer convenience but may have privacy trade-offs',
    type: 'single',
    options: [
      { value: 'ok', label: 'No Problem', description: 'Convenience is more important', icon: <span className="text-lg">☁️</span> },
      { value: 'minimize', label: 'Prefer to Minimize', description: 'Local when possible', icon: <span className="text-lg">🏠</span> },
      { value: 'avoid', label: 'Strictly Local Only', description: 'Maximum privacy required', icon: <Lock className="h-5 w-5" /> },
    ]
  },
];

const ecosystems: EcosystemResult[] = [
  {
    id: 'homeassistant',
    name: 'Home Assistant',
    logo: '🏠',
    matchScore: 0,
    privacyRating: 'Tier 1 (Highest)',
    priceRange: '$50-150',
    deviceCount: 3300,
    localControl: true,
    matterSupport: true,
    highlights: ['100% local processing', '3,300+ integrations', 'Open source', 'No cloud dependency'],
    tradeoffs: ['Requires technical knowledge', 'Self-managed updates', 'Hardware required'],
    bestFor: 'Privacy absolutists & tech enthusiasts'
  },
  {
    id: 'homekit',
    name: 'Apple HomeKit',
    logo: '🍎',
    matchScore: 0,
    privacyRating: 'Tier 2 (High)',
    priceRange: '$99-299',
    deviceCount: 800,
    localControl: true,
    matterSupport: true,
    highlights: ['End-to-end encryption', 'Private Cloud Compute', 'Secure enclave', 'No data mining'],
    tradeoffs: ['Apple devices required', 'Higher prices', 'Smaller ecosystem'],
    bestFor: 'Privacy-conscious Apple users'
  },
  {
    id: 'aqara',
    name: 'Aqara',
    logo: '🔷',
    matchScore: 0,
    privacyRating: 'Tier 2 (High)',
    priceRange: '$99-179',
    deviceCount: 128,
    localControl: true,
    matterSupport: true,
    highlights: ['Privacy-first design', 'Multi-protocol hub', 'Affordable pricing', 'Cross-platform'],
    tradeoffs: ['Smaller brand', 'Mainly Aqara devices', 'Limited Z-Wave'],
    bestFor: 'Privacy-conscious value seekers'
  },
  {
    id: 'smartthings',
    name: 'Samsung SmartThings',
    logo: '⚡',
    matchScore: 0,
    privacyRating: 'Tier 2-3 (Medium)',
    priceRange: '$49-149',
    deviceCount: 3000,
    localControl: true,
    matterSupport: true,
    highlights: ['Multi-protocol support', 'Platform agnostic', 'Robust automation', 'Samsung integration'],
    tradeoffs: ['No dedicated hub', 'Steep learning curve', 'Requires Aeotec hub for Z-Wave'],
    bestFor: 'Power users wanting flexibility'
  },
  {
    id: 'google',
    name: 'Google Home',
    logo: '🔵',
    matchScore: 0,
    privacyRating: 'Tier 3 (Medium-Low)',
    priceRange: '$29-299',
    deviceCount: 50000,
    localControl: false,
    matterSupport: true,
    highlights: ['50,000+ devices', 'Gemini AI integration', 'Strong Android integration', 'Matter support'],
    tradeoffs: ['Cloud-dependent', 'Privacy concerns', 'Data collection'],
    bestFor: 'Android users wanting max compatibility'
  },
  {
    id: 'alexa',
    name: 'Amazon Alexa',
    logo: '🔶',
    matchScore: 0,
    privacyRating: 'Tier 3 (Low)',
    priceRange: '$30-250',
    deviceCount: 100000,
    localControl: false,
    matterSupport: true,
    highlights: ['100,000+ devices', 'Mature ecosystem', 'Extensive automation', 'Affordable'],
    tradeoffs: ['Cloud-dependent', 'Data used for training', 'No local processing'],
    bestFor: 'Budget-conscious users wanting max compatibility'
  },
];

const EcosystemSelector = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSingleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleMultipleAnswer = (value: string) => {
    const current = (answers[currentQuestion.id] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: updated }));
  };

  const handleSliderAnswer = (value: number[]) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value[0] }));
  };

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'multiple') return true;
    if (currentQuestion.type === 'slider') return answer !== undefined;
    return !!answer;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const calculateScores = (): EcosystemResult[] => {
    return ecosystems.map(eco => {
      let score = 50; // Base score
      
      // Priority scoring
      const priority = answers['priority'] as string;
      if (priority === 'privacy') {
        if (eco.localControl) score += 25;
        if (eco.id === 'homeassistant' || eco.id === 'homekit') score += 15;
      } else if (priority === 'compatibility') {
        score += Math.min(30, eco.deviceCount / 3000);
      } else if (priority === 'ease') {
        if (eco.id === 'alexa' || eco.id === 'google') score += 20;
        if (eco.id === 'homeassistant') score -= 10;
      } else if (priority === 'budget') {
        if (eco.priceRange.includes('$30') || eco.priceRange.includes('$49')) score += 20;
      }

      // Existing devices scoring
      const existing = (answers['existing'] as string[]) || [];
      if (existing.includes('apple') && eco.id === 'homekit') score += 20;
      if (existing.includes('android') && eco.id === 'google') score += 15;
      if (existing.includes('alexa') && eco.id === 'alexa') score += 20;
      if (existing.includes('google') && eco.id === 'google') score += 20;

      // Technical level scoring
      const technical = (answers['technical'] as number) || 3;
      if (technical >= 4 && eco.id === 'homeassistant') score += 25;
      if (technical <= 2 && (eco.id === 'alexa' || eco.id === 'google')) score += 15;
      if (technical <= 2 && eco.id === 'homeassistant') score -= 20;

      // Cloud preference scoring
      const cloud = answers['cloud'] as string;
      if (cloud === 'avoid' && eco.localControl) score += 25;
      if (cloud === 'avoid' && !eco.localControl) score -= 30;
      if (cloud === 'minimize' && eco.localControl) score += 10;

      return { ...eco, matchScore: Math.min(100, Math.max(0, score)) };
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  if (showResults) {
    const results = calculateScores();
    const topResult = results[0];

    return (
      <div className="space-y-6">
        {/* Top Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">AI Recommendation</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="text-7xl">{topResult.logo}</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{topResult.name}</h2>
                  <p className="text-muted-foreground mb-4">{topResult.bestFor}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      {topResult.privacyRating}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <DollarSign className="h-3 w-3" />
                      {topResult.priceRange}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Home className="h-3 w-3" />
                      {topResult.deviceCount.toLocaleString()}+ devices
                    </Badge>
                    {topResult.localControl && (
                      <Badge className="bg-success text-success-foreground gap-1">
                        <Lock className="h-3 w-3" />
                        Local Control
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                      <circle 
                        cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" 
                        strokeDasharray={`${topResult.matchScore * 2.51} 251`}
                        className="text-primary transition-all duration-1000" 
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold">{topResult.matchScore}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Match Score</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-success mb-2">✓ Why This Fits</p>
                  <ul className="space-y-1">
                    {topResult.highlights.map((h, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-accent mb-2">⚠ Trade-offs to Consider</p>
                  <ul className="space-y-1">
                    {topResult.tradeoffs.map((t, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Other Options */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.slice(1, 4).map((eco, index) => (
            <motion.div
              key={eco.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
            >
              <Card className="hover:border-primary/50 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{eco.logo}</span>
                    <div>
                      <h4 className="font-semibold">{eco.name}</h4>
                      <p className="text-xs text-muted-foreground">{eco.bestFor}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{eco.matchScore}% match</Badge>
                    <Badge variant="secondary">{eco.privacyRating.split(' ')[0]} {eco.privacyRating.split(' ')[1]}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button onClick={handleRestart} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI-Powered Ecosystem Selector</span>
        </div>
        <h2 className="text-2xl font-bold">Find Your Perfect Smart Home Ecosystem</h2>
        <p className="text-muted-foreground">Answer {questions.length} quick questions for personalized recommendations</p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Question {currentStep + 1} of {questions.length}</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              <CardDescription>{currentQuestion.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === 'single' && currentQuestion.options && (
                <RadioGroup
                  value={answers[currentQuestion.id] as string || ''}
                  onValueChange={handleSingleAnswer}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${answers[currentQuestion.id] === option.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'}`}
                    >
                      <RadioGroupItem value={option.value} className="sr-only" />
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      {answers[currentQuestion.id] === option.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </label>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'multiple' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const selected = ((answers[currentQuestion.id] as string[]) || []).includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleMultipleAnswer(option.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left
                          ${selected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'}`}
                      >
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {selected && <Check className="h-5 w-5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'slider' && currentQuestion.sliderConfig && (
                <div className="space-y-6 py-4">
                  <Slider
                    value={[answers[currentQuestion.id] as number || currentQuestion.sliderConfig.min]}
                    onValueChange={handleSliderAnswer}
                    min={currentQuestion.sliderConfig.min}
                    max={currentQuestion.sliderConfig.max}
                    step={currentQuestion.sliderConfig.step}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm">
                    {currentQuestion.sliderConfig.labels.map((label, i) => (
                      <span 
                        key={i} 
                        className={`text-center ${
                          (answers[currentQuestion.id] as number) === i + 1 
                            ? 'text-primary font-medium' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="gap-2"
        >
          {currentStep === questions.length - 1 ? 'Get Recommendations' : 'Next'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EcosystemSelector;
