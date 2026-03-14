import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScoreBadge from "@/components/ScoreBadge";
import { Check, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: any;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function ProductCard({ product, isSelected, onSelect, disabled }: ProductCardProps) {
  const slug = product.productSlug ?? product.product_slug;
  const name = product.productName ?? product.product_name;
  const image = product.featuredImageUrl ?? product.featured_image_url;
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <Link to={`/products/${slug}`}>
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative cursor-pointer hover:opacity-90 transition-opacity">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          {isSelected && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-2">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4 space-y-3">
        <div>
          <Link to={`/products/${slug}`}>
            <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors cursor-pointer">
              {name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">{product.hub?.replace('_', ' ')}</Badge>
          {product.price && (
            <span className="text-lg font-bold text-primary">
              ${product.price}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <ScoreBadge 
            score={product.nova_trust_scores?.[0]?.total_score || 0} 
            label="Trust" 
            type="trust" 
            className="flex-1 p-2" 
          />
          <ScoreBadge 
            score={product.nova_integration_scores?.[0]?.total_score || 0} 
            label="Integration" 
            type="integration" 
            className="flex-1 p-2" 
          />
        </div>

        <div className="space-y-2">
          <Button 
            onClick={onSelect} 
            disabled={disabled}
            variant={isSelected ? "default" : "outline"}
            className="w-full"
          >
            {isSelected ? "Selected" : disabled ? "Max 4 Products" : "Select to Compare"}
          </Button>
          <Link to={`/products/${slug}`}>
            <Button variant="ghost" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
