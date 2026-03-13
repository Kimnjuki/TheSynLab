import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const LoadingSpinner = ({ size = "md", className, text }: LoadingSpinnerProps) => (
  <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
    <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
    {text && <p className="text-sm text-muted-foreground">{text}</p>}
  </div>
);

export const PageLoader = ({ text = "Loading..." }: { text?: string }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export const InlineLoader = ({ text }: { text?: string }) => (
  <div className="flex items-center gap-2 py-2">
    <LoadingSpinner size="sm" />
    {text && <span className="text-sm text-muted-foreground">{text}</span>}
  </div>
);

export const OverlayLoader = ({ text }: { text?: string }) => (
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export const ButtonLoader = () => (
  <Loader2 className="h-4 w-4 animate-spin" />
);
