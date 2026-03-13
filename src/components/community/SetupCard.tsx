import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink } from "lucide-react";
import { useState } from "react";

interface SetupCardProps {
  setup: any;
}

export function SetupCard({ setup }: SetupCardProps) {
  const [likes, setLikes] = useState(setup.view_count || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1);
      setIsLiked(true);
    }
  };

  const images = setup.gallery_images || [];
  const mainImage = images[0] || setup.featured_image_url;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative">
        {mainImage ? (
          <img 
            src={mainImage} 
            alt={setup.post_title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {setup.hub && (
            <Badge className="capitalize bg-background/90 backdrop-blur">
              {setup.hub.replace('_', ' ')}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-2">{setup.post_title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {setup.post_excerpt || "No description provided"}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-2 ${isLiked ? 'text-destructive' : ''}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            {likes}
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            View Details
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
