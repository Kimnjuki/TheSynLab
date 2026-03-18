import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, Award, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerificationTier = "community" | "verified_purchase" | "expert" | "lab_certified";

const TIER_CONFIG: Record<
  VerificationTier,
  { label: string; icon: React.ElementType; className: string }
> = {
  community: { label: "Community Review", icon: Users, className: "text-gray-600 border-gray-300 bg-gray-50" },
  verified_purchase: { label: "Verified Purchase", icon: ShoppingCart, className: "text-blue-600 border-blue-300 bg-blue-50" },
  expert: { label: "Expert Tested", icon: Award, className: "text-purple-600 border-purple-300 bg-purple-50" },
  lab_certified: { label: "Lab Certified", icon: FlaskConical, className: "text-green-600 border-green-300 bg-green-50" },
};

interface VerificationBadgeProps {
  level?: string;
  className?: string;
}

export function VerificationBadge({ level, className }: VerificationBadgeProps) {
  const tier = (level as VerificationTier | undefined) ?? "community";
  const config = TIER_CONFIG[tier] ?? TIER_CONFIG.community;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 text-xs font-medium", config.className, className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
