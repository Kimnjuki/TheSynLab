import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Check, Loader2, ArrowRight } from "lucide-react";

interface Props {
  /** Lightweight inline variant (for mid-article) vs card variant (for page bottom) */
  variant?: "inline" | "card";
  /** Source tracking string (e.g. "product_clickup" or "hub_productivity") */
  source?: string;
  /** Optional custom headline to override default */
  headline?: string;
}

const ROLES = [
  { value: "founder", label: "Founder / CEO" },
  { value: "pm", label: "Product Manager" },
  { value: "it", label: "IT / Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "ops", label: "Operations" },
  { value: "other", label: "Other" },
];

const TOPICS = [
  { value: "productivity", label: "Productivity Tools" },
  { value: "ai_workflow", label: "AI Workflow" },
  { value: "intelligent_home", label: "Smart Home" },
  { value: "hybrid_office", label: "Hybrid Office" },
  { value: "all", label: "All Topics" },
];

export default function NewsletterSignupBanner({ variant = "card", source = "website", headline }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [topics, setTopics] = useState<string[]>(["all"]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const subscribe = useMutation(api.newsletter.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      const result = await subscribe({
        email,
        source,
        preferences: { role, topics },
      });
      if (result.ok) {
        setSubmitted(true);
        toast.success(
          result.message === "already_subscribed"
            ? "You're already subscribed!"
            : "Welcome to the SynLab Scorecard!"
        );
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={`rounded-2xl border border-green-200 bg-green-50 p-6 text-center ${variant === "inline" ? "my-6" : ""}`}>
        <Check className="mx-auto mb-2 h-8 w-8 text-green-500" />
        <h3 className="text-lg font-semibold text-green-800">You're on the list!</h3>
        <p className="text-sm text-green-600">
          Check your inbox for the SynLab Scorecard — weekly re-scores, privacy alerts, and TCO tips.
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="my-6 rounded-xl border bg-gradient-to-r from-primary/5 to-primary/10 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold">{headline || "Get the SynLab Scorecard"}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Weekly re-scores, privacy alerts, and TCO tips. No hype, just data.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm max-w-[200px]"
              required
            />
            <Button type="submit" size="sm" className="h-9" disabled={loading}>
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><ArrowRight className="h-3.5 w-3.5 mr-1" /> Join</>}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="secondary">
            <Mail className="mr-1 h-3 w-3" />
            Newsletter
          </Badge>
        </div>
        <CardTitle className="text-xl">{headline || "Get the SynLab Scorecard"}</CardTitle>
        <CardDescription>
          Weekly re-scores, privacy alerts, and TCO tips. Free. No hype, just data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email address</label>
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Your role</label>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <Badge
                  key={r.value}
                  variant={role === r.value ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setRole(r.value)}
                >
                  {r.label}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Topics</label>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <Badge
                  key={t.value}
                  variant={topics.includes(t.value) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (t.value === "all") {
                      setTopics(["all"]);
                    } else {
                      const next = topics.includes("all")
                        ? [t.value]
                        : topics.filter((x) => x !== "all");
                      if (next.includes(t.value)) {
                        setTopics(next.filter((x) => x !== t.value));
                      } else {
                        setTopics([...next, t.value]);
                      }
                      if (next.length === 0 && !next.includes(t.value)) {
                        setTopics(["all"]);
                      }
                    }
                  }}
                >
                  {t.label}
                </Badge>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            {loading ? "Subscribing..." : "Subscribe — Free Scorecard"}
          </Button>
          <p className="text-[11px] text-muted-foreground text-center">
            No spam. Unsubscribe anytime. Read our <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
