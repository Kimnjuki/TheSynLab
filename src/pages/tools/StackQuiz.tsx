import { useState, useCallback } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { MetaTags } from "@/components/seo/MetaTags";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Send, Sparkles, Star, Share2 } from "lucide-react";
import { SynLabScorecard } from "@/components/widgets/SynLabScorecard";
import { toast } from "sonner";

const genId = () => crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

type AnswerMap = Record<string, string | string[]>;

const StackQuiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [sessionId] = useState(() => genId());
  const [email, setEmail] = useState("");
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const quizQuestions = useQuery(api.quiz.getQuizConfig);
  const recommendations = useAction(api.quiz.getQuizRecommendations);
  const captureEmail = useMutation(api.quiz.captureQuizEmail);
  const addToStack = useMutation(api.myStack.addToMyStack);

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const currentQuestion = quizQuestions?.[step];
  const isLastStep = quizQuestions ? step >= quizQuestions.length - 1 : false;
  const progress = quizQuestions ? ((step + 1) / quizQuestions.length) * 100 : 0;

  const handleAnswer = useCallback(
    (questionKey: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionKey]: value }));

      // Auto-advance for single_choice
      if (
        currentQuestion?.questionType === "single_choice" &&
        step < (quizQuestions?.length || 1) - 1
      ) {
        setTimeout(() => setStep((s) => s + 1), 300);
      }
    },
    [currentQuestion, quizQuestions?.length, step]
  );

  const handleNext = useCallback(() => {
    if (isLastStep) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  }, [isLastStep, step]);

  const handleBack = useCallback(() => {
    if (step > 0) setStep((s) => s - 1);
  }, [step]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await recommendations({ answers, sessionId });
      setResults(result);
    } catch (err) {
      console.error("Quiz error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) return;
    try {
      await captureEmail({ sessionId, email });
      setEmailSubmitted(true);
      toast.success("Report sent! Check your inbox.");
    } catch {
      toast.error("Could not save email.");
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
    setShowEmailGate(false);
    setEmailSubmitted(false);
  };

  const handleAddToStack = async (productId: any) => {
    try {
      await addToStack({ sessionId, productId });
      toast.success("Added to My Stack!");
    } catch {
      toast.error("Could not add to stack.");
    }
  };

  // --- Results View ---
  if (results) {
    return (
      <div className="min-h-screen bg-background">
        <MetaTags
          title="Your Personalized AI Tool Stack — SynLab Stack Quiz"
          description="See your top 3 recommended AI & SaaS tools with Trust Scores, Integration Scores, and cost estimates — personalized by the SynLab Stack Quiz."
          canonical="/stack-quiz"
        />
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-8 text-center">
            <Badge variant="secondary" className="mb-2">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Your Results
            </Badge>
            <h1 className="text-3xl font-bold">
              Your Personalised Tool Stack
            </h1>
            <p className="mt-2 text-muted-foreground">
              Based on your answers, here are the best tools for your needs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {(results.products || []).map((product: any, i: number) => (
              <div key={product._id}>
                <div className="mb-2 text-center">
                  <Badge>#{i + 1} Pick</Badge>
                </div>
                <SynLabScorecard
                  product={product}
                  variant="full"
                  showTco
                  showRisk
                  onAddToStack={() => handleAddToStack(product._id)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => navigate(`/tool/${product.productSlug}`)}
                >
                  <Share2 className="mr-1 h-3.5 w-3.5" />
                  Read Full Review
                </Button>
              </div>
            ))}
          </div>

          {results.segmentTag && (
            <Card className="mt-8">
              <CardContent className="flex items-center gap-3 p-4">
                <Star className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">
                    Segment identified:{" "}
                    <Badge variant="outline">{results.segmentTag}</Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    These tools are top-rated for this profile
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email gate */}
          {!showEmailGate && !emailSubmitted && (
            <div className="mt-8 text-center">
              <Button onClick={() => setShowEmailGate(true)} size="lg">
                <Send className="mr-2 h-4 w-4" />
                Download Your Stack Report (PDF)
              </Button>
            </div>
          )}

          {showEmailGate && !emailSubmitted && (
            <Card className="mx-auto mt-8 max-w-md">
              <CardContent className="p-6">
                <h3 className="mb-2 font-semibold">Get Your Full Stack Report</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  We'll send you a detailed PDF with scores, cost breakdowns, and
                  alternative picks.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button onClick={handleEmailSubmit}>Send</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {emailSubmitted && (
            <Card className="mx-auto mt-8 max-w-md border-green-500">
              <CardContent className="p-6 text-center">
                <Check className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <p className="font-medium">Report sent! Check your inbox.</p>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Take the Quiz Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Loading ---
  if (!quizQuestions) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  // --- Quiz ---
  return (
    <div className="min-h-screen bg-background">
      <MetaTags
        title="SynLab Stack Quiz — Find the Right AI & SaaS Tools"
        description="Answer 6 questions and get your personalised AI tool stack with Trust Scores, Integration Scores, and 3-year TCO estimates."
        canonical="/stack-quiz"
      />
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            SynLab Stack Quiz
          </Badge>
          <h1 className="text-3xl font-bold">Find Your Perfect Stack</h1>
          <p className="mt-2 text-muted-foreground">
            Answer a few quick questions and we'll match you with the best tools
          </p>
        </div>

        <Progress value={progress} className="mb-8" />

        <Card className="mx-auto max-w-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                Step {step + 1} of {quizQuestions.length}
              </Badge>
            </div>
            <CardTitle className="mt-2 text-xl">
              {currentQuestion?.questionText}
            </CardTitle>
            {currentQuestion?.helpText && (
              <CardDescription>{currentQuestion.helpText}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {(currentQuestion?.options || []).map((option) => {
              const isSelected =
                currentQuestion.questionType === "multi_choice"
                  ? (answers[currentQuestion.questionKey] as string[])?.includes(
                      option.id
                    )
                  : answers[currentQuestion.questionKey] === option.id;

              const handleClick = () => {
                if (currentQuestion.questionType === "multi_choice") {
                  const current = (answers[currentQuestion.questionKey] as string[]) || [];
                  const updated = isSelected
                    ? current.filter((id) => id !== option.id)
                    : [...current, option.id];
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.questionKey]: updated,
                  }));
                } else {
                  handleAnswer(currentQuestion.questionKey, option.id);
                }
              };

              return (
                <Button
                  key={option.id}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={handleClick}
                >
                  {isSelected && <Check className="mr-2 h-4 w-4" />}
                  {option.label}
                </Button>
              );
            })}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                loading ||
                !answers[currentQuestion?.questionKey || ""] ||
                (currentQuestion?.questionType === "multi_choice" &&
                  Array.isArray(answers[currentQuestion?.questionKey || ""]) &&
                  (answers[currentQuestion?.questionKey || ""] as string[]).length === 0)
              }
            >
              {isLastStep ? (
                loading ? (
                  "Finding your stack..."
                ) : (
                  <>
                    See My Results
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </>
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default StackQuiz;
