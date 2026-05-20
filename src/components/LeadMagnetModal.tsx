import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, ArrowRight } from "lucide-react";

interface LeadMagnet {
  slug: string;
  title: string;
  description: string;
  type: "pdf" | "checklist" | "template";
  icon?: string;
}

const leadMagnets: Record<string, LeadMagnet> = {
  "trust-score-checklist": {
    slug: "trust-score-checklist",
    title: "12-Point Trust Score Checklist",
    description: "Evaluate any tool against our lab's scoring methodology. Includes scoring template and vendor comparison sheet.",
    type: "checklist",
  },
  "smart-home-security": {
    slug: "smart-home-security",
    title: "Smart Home Security Setup Blueprint",
    description: "Step-by-step guide to securing your smart home stack. Router config, IoT segmentation, and monitoring setup.",
    type: "pdf",
  },
  "tco-report": {
    slug: "tco-report",
    title: "3-Year TCO Report",
    description: "Download your personalized total cost of ownership analysis. Compare up to 5 tools side-by-side.",
    type: "pdf",
  },
  "stack-blueprint": {
    slug: "stack-blueprint",
    title: "Your Recommended Stack Blueprint",
    description: "Your personalized tool stack organized by productivity tier. Budget-aware recommendations included.",
    type: "template",
  },
  "hybrid-office-template": {
    slug: "hybrid-office-template",
    title: "Hybrid Office Stack Template",
    description: "Ready-to-use hybrid setup for your team. Room configs, hardware picks, and remote collaboration tools.",
    type: "template",
  },
};

interface Props {
  magnetSlug?: string;
  trigger?: "scroll" | "tool-complete" | "manual";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const LeadMagnetModal = ({ magnetSlug = "trust-score-checklist", trigger = "manual", open: controlledOpen, onOpenChange: controlledOnOpen }: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [downloaded, setDownloaded] = useState(false);

  const magnet = leadMagnets[magnetSlug] || leadMagnets["trust-score-checklist"];
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpen || setInternalOpen;

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDownloaded(true);
    toast.success(`✓ "${magnet.title}" sent to ${email}`);
    setTimeout(() => setOpen(false), 1500);
  };

  const typeLabel = magnet.type === "pdf" ? "PDF Guide" : magnet.type === "checklist" ? "Checklist" : "Template";

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{typeLabel}</span>
            <span className="text-xs text-muted-foreground">Free download</span>
          </div>
          <DialogTitle className="text-xl">{magnet.title}</DialogTitle>
          <DialogDescription className="text-sm">{magnet.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDownload} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="lead-email" className="text-sm font-medium">
              Enter your email to download
            </label>
            <Input
              id="lead-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={downloaded}
            />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={downloaded}>
            <Download className="h-4 w-4" />
            {downloaded ? "Sent! ✓" : `Download ${typeLabel}`}
          </Button>
          <p className="text-xs text-muted-foreground text-center">No spam. Unsubscribe anytime.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadMagnetModal;
export { leadMagnets, type LeadMagnet };
