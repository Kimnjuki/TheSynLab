import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "trust" | "integration" | "follow" | "review_summary";

type Props = {
  variant: Variant;
  score?: number;
  count?: number;
  reviewCount?: number;
  className?: string;
};

function scoreColor(score: number) {
  if (score < 40) return "text-red-500";
  if (score < 60) return "text-orange-500";
  if (score < 75) return "text-yellow-500";
  return "text-emerald-500";
}

export function SocialProofBadge({ variant, score = 0, count = 0, reviewCount = 0, className }: Props) {
  const [inView, setInView] = useState(false);
  useEffect(() => setInView(true), []);
  const percent = useMemo(() => Math.max(0, Math.min(100, score)), [score]);
  const circumference = 2 * Math.PI * 17;
  const offset = circumference - (percent / 100) * circumference;

  if (variant === "follow") {
    return <span className={cn("rounded-full bg-muted px-2 py-1 text-xs", className)}>{count} tracking</span>;
  }
  if (variant === "review_summary") {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs", className)}>
        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {score.toFixed(1)} ({reviewCount})
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs", className)}>
      <svg width="40" height="40" aria-label={`${variant} score ${percent}`}>
        <circle cx="20" cy="20" r="17" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="none" />
        <motion.circle
          cx="20"
          cy="20"
          r="17"
          stroke="currentColor"
          className={scoreColor(percent)}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: inView ? offset : circumference }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          transform="rotate(-90 20 20)"
        />
        <text x="20" y="24" textAnchor="middle" className="fill-current text-[10px]">{Math.round(percent)}</text>
      </svg>
      {variant === "trust" ? "Trust" : "Integration"}
    </span>
  );
}
