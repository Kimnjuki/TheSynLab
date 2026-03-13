import { Star, ThumbsUp, Shield, Wifi, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DeviceReview {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  trustScore: number;
  integrationScore: number;
  price: string;
  pros: string[];
  cons: string[];
  protocols: string[];
  ecosystems: string[];
  featured?: boolean;
}

interface DeviceReviewCardProps {
  device: DeviceReview;
  onViewDetails?: (device: DeviceReview) => void;
}

const DeviceReviewCard = ({ device, onViewDetails }: DeviceReviewCardProps) => {
  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 ${
      device.featured ? 'ring-2 ring-primary/30' : ''
    }`}>
      {device.featured && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
          Editor's Pick
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-3xl">
            {device.category === 'Lighting' && '💡'}
            {device.category === 'Climate' && '🌡️'}
            {device.category === 'Security' && '🔒'}
            {device.category === 'Camera' && '📹'}
            {device.category === 'Hub' && '🏠'}
            {device.category === 'Plug' && '🔌'}
            {device.category === 'Speaker' && '🔊'}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(device.rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {device.reviewCount} reviews
            </span>
          </div>
        </div>
        
        <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
          {device.name}
        </CardTitle>
        <Badge variant="secondary" className="w-fit">{device.category}</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="h-3.5 w-3.5 text-success" />
              <span className="text-xs font-medium">Trust Score</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={device.trustScore * 10} className="h-1.5 flex-1" />
              <span className="text-sm font-bold">{device.trustScore}</span>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-muted/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Wifi className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={device.integrationScore * 10} className="h-1.5 flex-1" />
              <span className="text-sm font-bold">{device.integrationScore}</span>
            </div>
          </div>
        </div>

        {/* Protocols */}
        <div className="flex flex-wrap gap-1">
          {device.protocols.slice(0, 4).map((protocol) => (
            <Badge key={protocol} variant="outline" className="text-xs">
              {protocol}
            </Badge>
          ))}
        </div>

        {/* Price & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-lg font-bold">{device.price}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails?.(device)}
            >
              Details
            </Button>
            <Button size="sm" className="gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
              Buy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceReviewCard;
export type { DeviceReview };
