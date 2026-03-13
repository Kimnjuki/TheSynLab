import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateReview } from "@/hooks/convex/useReviews";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string | number;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const { createReview } = useCreateReview();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const prosArray = pros.split('\n').filter(p => p.trim());
      const consArray = cons.split('\n').filter(c => c.trim());

      await createReview({
        productId: productId as any,
        rating,
        reviewTitle: title,
        reviewContent: content,
        pros: prosArray.length > 0 ? prosArray : undefined,
        cons: consArray.length > 0 ? consArray : undefined,
      });

      toast.success("Thank you for your review!");

      setRating(0);
      setTitle("");
      setContent("");
      setPros("");
      setCons("");
      
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Your Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-0 border-0 bg-transparent cursor-pointer"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Review Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your experience"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Review *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about your experience with this product"
              rows={5}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pros">Pros (one per line)</Label>
              <Textarea
                id="pros"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="What did you like?"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cons">Cons (one per line)</Label>
              <Textarea
                id="cons"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="What could be improved?"
                rows={4}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || !user}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
