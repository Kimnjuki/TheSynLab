import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, ThumbsUp, Award } from "lucide-react";

interface Props {
  labScore?: number;
  communityScore?: number;
  totalReviews?: number;
  helpfulVotes?: number;
  showCombined?: boolean;
  size?: "sm" | "md" | "lg";
}

const CommunityConfidenceBadge = ({
  labScore,
  communityScore,
  totalReviews = 0,
  helpfulVotes = 0,
  showCombined = true,
  size = "md",
}: Props) => {
  const hasCommunityData = totalReviews > 0;
  const combinedScore = labScore && hasCommunityData 
    ? Math.round((labScore * 0.6 + (communityScore || 0) * 0.4) * 10) / 10
    : labScore || communityScore || 0;

  const sizeClasses = size === "sm" ? "text-xs p-3" : size === "lg" ? "text-base p-6" : "text-sm p-4";
  const dotSize = size === "sm" ? "h-2 w-2" : size === "lg" ? "h-4 w-4" : "h-3 w-3";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`${sizeClasses} cursor-default hover:bg-muted/50 transition-colors`}>
            <div className="flex items-center gap-2">
              <Users className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} text-primary`} />
              <span className="font-semibold">{combinedScore.toFixed(1)}</span>
              <span className="text-muted-foreground">/5</span>
              {hasCommunityData && (
                <div className="flex items-center gap-1 ml-1">
                  <div className={`${dotSize} rounded-full ${totalReviews > 10 ? "bg-green-500" : totalReviews > 3 ? "bg-yellow-500" : "bg-muted"}`} />
                  <span className="text-[10px] text-muted-foreground">{totalReviews}</span>
                </div>
              )}
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2 text-xs">
            {labScore !== undefined && (
              <div className="flex justify-between gap-4">
                <span className="flex items-center gap-1"><Award className="h-3 w-3" /> Lab Score</span>
                <span className="font-medium">{labScore}/5</span>
              </div>
            )}
            {hasCommunityData && (
              <>
                <div className="flex justify-between gap-4">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Community Score</span>
                  <span className="font-medium">{communityScore?.toFixed(1) || "—"}/5</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> Helpful votes</span>
                  <span className="font-medium">{helpfulVotes}</span>
                </div>
                <div className="flex justify-between gap-4 text-muted-foreground">
                  <span>Total reviews</span>
                  <span>{totalReviews}</span>
                </div>
              </>
            )}
            {showCombined && labScore !== undefined && hasCommunityData && (
              <div className="pt-2 border-t text-muted-foreground">
                Combined score: {labScore} × 60% + {communityScore?.toFixed(1)} × 40% = <strong>{combinedScore.toFixed(1)}</strong>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CommunityConfidenceBadge;
