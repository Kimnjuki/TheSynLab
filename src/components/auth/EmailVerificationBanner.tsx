import { useState } from "react";
import { AlertTriangle, Mail, X, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EmailVerificationBannerProps {
  email: string;
  onDismiss?: () => void;
}

export const EmailVerificationBanner = ({ email, onDismiss }: EmailVerificationBannerProps) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleResendVerification = async () => {
    setSending(true);
    
    // Mock verification - in production, integrate with Clerk email verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSending(false);
    setSent(true);
    toast({
      title: "Verification email sent",
      description: "Please check your inbox and spam folder.",
    });
  };

  return (
    <div className={cn(
      "relative flex items-center gap-3 px-4 py-3 rounded-lg border",
      sent 
        ? "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400"
        : "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400"
    )}>
      {sent ? (
        <CheckCircle className="h-5 w-5 shrink-0" />
      ) : (
        <AlertTriangle className="h-5 w-5 shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {sent ? "Verification email sent!" : "Email not verified"}
        </p>
        <p className="text-xs opacity-80 truncate">
          {sent 
            ? "Check your inbox and spam folder"
            : `Please verify ${email} to unlock all features`
          }
        </p>
      </div>

      {!sent && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleResendVerification}
          disabled={sending}
          className="shrink-0 border-yellow-500/50 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20"
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Mail className="h-4 w-4 mr-1.5" />
              Resend
            </>
          )}
        </Button>
      )}

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-foreground/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
