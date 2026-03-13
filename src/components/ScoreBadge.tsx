import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  label: string;
  type: "trust" | "integration";
  className?: string;
}

const ScoreBadge = ({ score, label, type, className }: ScoreBadgeProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-success";
    if (score >= 7) return "text-secondary";
    if (score >= 5) return "text-accent";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Fair";
    return "Poor";
  };

  const getBgColor = (score: number) => {
    if (score >= 9) return "bg-success/10 border-success/20";
    if (score >= 7) return "bg-secondary/10 border-secondary/20";
    if (score >= 5) return "bg-accent/10 border-accent/20";
    return "bg-destructive/10 border-destructive/20";
  };

  return (
    <div className={cn("inline-flex flex-col items-center gap-2 p-4 rounded-xl border-2", getBgColor(score), className)}>
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
      <div className={cn("text-4xl font-bold", getScoreColor(score))}>
        {score.toFixed(1)}
      </div>
      <div className="text-sm font-medium text-foreground/80">
        {getScoreLabel(score)}
      </div>
      <div className="flex gap-0.5 mt-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-all",
              i < Math.round(score) 
                ? getScoreColor(score).replace("text-", "bg-")
                : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ScoreBadge;
