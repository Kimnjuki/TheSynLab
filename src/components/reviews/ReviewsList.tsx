import { useAuth } from "@/contexts/AuthContext";
import { useReviews, useVoteHelpful, useHasVotedHelpful } from "@/hooks/convex/useReviews";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ReviewsListProps {
  productId: string | number;
}

function ReviewItem({ review, userId }: { review: any; userId?: string }) {
  const { voteHelpful } = useVoteHelpful();
  const { hasVoted } = useHasVotedHelpful(review._id || review.id);

  const handleVote = async () => {
    if (!userId) {
      toast.error("Please sign in to vote");
      return;
    }

    try {
      await voteHelpful(review._id || review.id);
    } catch (error) {
      toast.error("Failed to record vote");
    }
  };

  const displayName = review.profile?.displayName || "Anonymous User";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-foreground">{displayName}</div>
                {review.verifiedPurchase && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified Purchase
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {review._creationTime 
                    ? format(new Date(review._creationTime), "MMM d, yyyy")
                    : ""}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">{review.reviewTitle}</h4>
            <p className="text-foreground leading-relaxed">{review.reviewContent}</p>
          </div>

          {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
              {review.pros && review.pros.length > 0 && (
                <div>
                  <h5 className="font-semibold text-sm text-foreground mb-2">Pros</h5>
                  <ul className="space-y-1">
                    {review.pros.map((pro: string, i: number) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {review.cons && review.cons.length > 0 && (
                <div>
                  <h5 className="font-semibold text-sm text-foreground mb-2">Cons</h5>
                  <ul className="space-y-1">
                    {review.cons.map((con: string, i: number) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-destructive">-</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVote}
              className="gap-2"
            >
              <ThumbsUp className={`w-4 h-4 ${hasVoted ? "fill-primary" : ""}`} />
              Helpful ({review.helpfulCount || 0})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReviewsList({ productId }: ReviewsListProps) {
  const { user } = useAuth();
  const { reviews, isLoading } = useReviews(String(productId));

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading reviews...
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  const averageRating = (
    reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground">{averageRating}</div>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(parseFloat(averageRating))
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review: any) => (
          <ReviewItem 
            key={review._id || review.id} 
            review={review} 
            userId={user?.id}
          />
        ))}
      </div>
    </div>
  );
}
