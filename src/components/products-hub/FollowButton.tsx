import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  isFollowing: boolean;
  count: number;
  disabled?: boolean;
  onToggle?: (next: boolean) => Promise<void> | void;
  onRequireAuth?: () => void;
  isAuthed?: boolean;
};

export function FollowButton({ isFollowing, count, disabled, onToggle, onRequireAuth, isAuthed = true }: Props) {
  const [optimisticFollowing, setOptimisticFollowing] = useState(isFollowing);
  const [optimisticCount, setOptimisticCount] = useState(count);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const label = optimisticFollowing ? (hover ? "Unfollow" : "Watching") : "Follow";
  return (
    <Button
      size="sm"
      variant={optimisticFollowing ? "secondary" : "outline"}
      disabled={disabled || loading}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={async () => {
        if (!isAuthed) return onRequireAuth?.();
        const next = !optimisticFollowing;
        setOptimisticFollowing(next);
        setOptimisticCount((c) => c + (next ? 1 : -1));
        setLoading(true);
        try {
          await onToggle?.(next);
        } finally {
          setLoading(false);
        }
      }}
      className="gap-1"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <motion.span animate={{ scale: optimisticFollowing ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.25 }}>
          <Star className={`h-4 w-4 ${optimisticFollowing ? "fill-amber-400 text-amber-500" : ""}`} />
        </motion.span>
      )}
      {label} <span className="text-xs text-muted-foreground">{optimisticCount}</span>
    </Button>
  );
}
