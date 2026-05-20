import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail, ArrowRight, X } from "lucide-react";

interface Props {
  scrollThreshold?: number;
  triggerOn?: "scroll" | "timer" | "exit" | "tool-complete";
  delayMs?: number;
  title?: string;
  subtitle?: string;
  leadMagnetSlug?: string;
  source?: string;
}

const ContextualEmailCapture = ({
  scrollThreshold = 55,
  triggerOn = "scroll",
  delayMs = 10000,
  title,
  subtitle,
  leadMagnetSlug,
  source = "contextual",
}: Props) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    if (triggerOn === "timer") {
      const timer = setTimeout(() => setVisible(true), delayMs);
      return () => clearTimeout(timer);
    }

    if (triggerOn === "scroll") {
      const handleScroll = () => {
        const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
        if (scrolled >= scrollThreshold && !visible && !dismissed) {
          setVisible(true);
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [scrollThreshold, delayMs, triggerOn, visible, dismissed]);

  useEffect(() => {
    if (triggerOn !== "exit" || dismissed) return;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [triggerOn, dismissed]);

  if (!visible || dismissed) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success(leadMagnetSlug ? "✓ Guide sent to your inbox!" : "✓ Welcome to TheSynLab insights!");
    setTimeout(() => setVisible(false), 2000);
  };

  const defaultTitle = leadMagnetSlug ? "Want the full guide?" : "Get weekly Trust Score updates →";
  const defaultSubtitle = leadMagnetSlug
    ? "Enter your email and we'll send it straight to your inbox."
    : "New reviews, tools, and exclusive deals every Tuesday.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="relative max-w-md w-full mx-4 p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={() => { setVisible(false); setDismissed(true); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold">{title || defaultTitle}</h3>
          <p className="text-sm text-muted-foreground">{subtitle || defaultSubtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={subscribed}
            />
            <Button type="submit" className="w-full gap-2" disabled={subscribed}>
              {subscribed ? "✓ Sent!" : <>{leadMagnetSlug ? "Send me the guide" : "Subscribe"} <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">No spam. Unsubscribe in one click.</p>
        </div>
      </Card>
    </div>
  );
};

export default ContextualEmailCapture;
