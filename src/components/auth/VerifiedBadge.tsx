import { CheckCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  variant?: "default" | "compact";
  className?: string;
}

export const VerifiedBadge = ({ variant = "default", className }: VerifiedBadgeProps) => {
  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <CheckCircle className={cn("h-4 w-4 text-green-500", className)} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Verified email</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
      "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30",
      className
    )}>
      <Shield className="h-3 w-3" />
      Verified
    </div>
  );
};
