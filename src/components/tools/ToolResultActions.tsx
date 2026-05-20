import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Download, Save, Mail, ArrowRight } from "lucide-react";

interface Props {
  toolName: string;
  toolSlug: string;
  resultSummary?: string;
  hasEmailGate?: boolean;
  onSaveToStack?: () => void;
}

const ToolResultActions = ({ toolName, toolSlug, resultSummary, hasEmailGate = true, onSaveToStack }: Props) => {
  const [email, setEmail] = useState("");
  const [showGate, setShowGate] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleEmailGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setDownloaded(true);
    toast.success(`✓ Results sent to ${email}`);
    setShowGate(false);
  };

  const handleSaveToStack = () => {
    if (onSaveToStack) {
      onSaveToStack();
    } else {
      toast.success(`✓ "${toolName}" saved to My Stack!`);
    }
  };

  return (
    <Card className="p-6 space-y-4 border-l-4 border-l-primary">
      <div>
        <h3 className="font-semibold text-lg">Your {toolName} Results</h3>
        {resultSummary && <p className="text-sm text-muted-foreground mt-1">{resultSummary}</p>}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSaveToStack} variant="default" className="gap-2">
          <Save className="h-4 w-4" />
          Save to My Stack
        </Button>

        {hasEmailGate && !downloaded && (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowGate(!showGate)}
          >
            <Mail className="h-4 w-4" />
            {showGate ? "Hide" : "Email Results"}
          </Button>
        )}

        <Button variant="ghost" asChild className="gap-2">
          <Link to={`/tools?tool=${toolSlug}`}>
            Browse related tools <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {showGate && !downloaded && (
        <form onSubmit={handleEmailGate} className="flex gap-2 pt-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Download className="h-3 w-3 mr-1" />
            Send
          </Button>
        </form>
      )}

      <p className="text-xs text-muted-foreground">Free forever. No credit card.</p>
    </Card>
  );
};

export default ToolResultActions;
