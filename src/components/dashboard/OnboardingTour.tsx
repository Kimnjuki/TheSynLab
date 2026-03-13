import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position?: "top" | "bottom" | "left" | "right" | "center";
}

interface OnboardingTourProps {
  steps?: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  storageKey?: string;
}

const defaultSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Project Nova! 🚀",
    description: "Let's take a quick tour to help you get started with the platform. You'll discover powerful features for product reviews, task management, and smart home integration.",
    position: "center",
  },
  {
    id: "navigation",
    title: "Easy Navigation",
    description: "Use the navigation bar to explore different sections: Compare products, check Community Setups, manage Tasks, and more. Press ⌘K anytime to quickly search and navigate.",
    position: "center",
  },
  {
    id: "tasks",
    title: "Task Management",
    description: "The Tasks section offers multiple views: Kanban boards, Gantt charts, Calendar, and List views. Create tasks, set priorities, and track your progress all in one place.",
    position: "center",
  },
  {
    id: "compare",
    title: "Product Comparison",
    description: "Compare up to 4 products side-by-side with our Trust Scores and Integration Scores. Make informed decisions based on real data and community reviews.",
    position: "center",
  },
  {
    id: "automations",
    title: "Powerful Automations",
    description: "Create custom workflows with our visual automation builder. Set triggers, conditions, and actions to automate repetitive tasks and boost your productivity.",
    position: "center",
  },
  {
    id: "complete",
    title: "You're All Set! 🎉",
    description: "You're ready to explore Project Nova. Remember, you can always access help through the command palette (⌘K) or the documentation. Happy exploring!",
    position: "center",
  },
];

export const OnboardingTour = ({
  steps = defaultSteps,
  isOpen,
  onClose,
  onComplete,
  storageKey = "onboarding-completed",
}: OnboardingTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, "true");
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, "true");
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-all duration-300",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleSkip}
      />

      {/* Tour Card */}
      <Card
        className={cn(
          "relative z-10 w-full max-w-md mx-4 shadow-2xl transition-all duration-300 transform",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleSkip}
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="pt-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          {/* Step Content */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  idx === currentStep
                    ? "bg-primary w-6"
                    : idx < currentStep
                    ? "bg-primary/50"
                    : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3">
            {!isFirstStep ? (
              <Button
                variant="outline"
                onClick={handlePrev}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="flex-1 text-muted-foreground"
              >
                Skip Tour
              </Button>
            )}

            <Button onClick={handleNext} className="flex-1">
              {isLastStep ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook to manage onboarding state
export const useOnboarding = (storageKey = "onboarding-completed") => {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      // Delay showing the tour for better UX
      const timer = setTimeout(() => setShowTour(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const startTour = () => setShowTour(true);
  const closeTour = () => setShowTour(false);
  const resetTour = () => {
    localStorage.removeItem(storageKey);
    setShowTour(true);
  };

  return { showTour, startTour, closeTour, resetTour };
};
