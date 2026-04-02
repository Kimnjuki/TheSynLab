import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Bell, Layers, ShieldCheck } from "lucide-react";

type HeroProps = {
  product: {
    productName: string;
    verdictSummary?: string;
    featuredImageUrl?: string;
    videoUrl?: string;
    officialWebsite?: string;
    priceModel?: string;
  };
  bestForTags?: string[];
  trustScore?: number;
  integrationScore?: number;
  isVerified?: boolean;
  onAddToStack: () => void;
  onSubscribe: () => void;
};

function scoreClass(score?: number) {
  if (score == null) return "bg-muted text-muted-foreground";
  if (score >= 70) return "bg-emerald-600 text-white";
  if (score >= 50) return "bg-amber-500 text-black";
  return "bg-rose-600 text-white";
}

export function ProductHero({
  product,
  bestForTags,
  trustScore,
  integrationScore,
  isVerified,
  onAddToStack,
  onSubscribe,
}: HeroProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {product.featuredImageUrl ? (
            <img src={product.featuredImageUrl} alt={`${product.productName} logo`} className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <div className="h-14 w-14 rounded-lg bg-primary/15 flex items-center justify-center text-lg font-bold">
              {product.productName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{product.productName}</h1>
            {product.verdictSummary && <p className="text-muted-foreground">{product.verdictSummary}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isVerified ? "SynLab Editorial Verified" : "Editorial Review"}
          </Badge>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreClass(trustScore)}`}>Trust {trustScore ?? "N/A"}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreClass(integrationScore)}`}>Integration {integrationScore ?? "N/A"}</span>
          {product.priceModel && <Badge variant="secondary">{product.priceModel}</Badge>}
        </div>

        {bestForTags?.length ? (
          <div className="flex flex-wrap gap-2">
            {bestForTags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {product.officialWebsite && (
            <Button asChild aria-label="Visit product website">
              <a href={product.officialWebsite} target="_blank" rel="noopener noreferrer">Visit Product</a>
            </Button>
          )}
          <Button variant="outline" onClick={onAddToStack} aria-label="Add product to my stack">
            <Layers className="h-4 w-4" /> Add to My Stack
          </Button>
          <Button variant="ghost" onClick={onSubscribe} aria-label="Subscribe to product updates">
            <Bell className="h-4 w-4" /> Subscribe to Updates
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-primary/30 p-2">
        <AspectRatio ratio={16 / 9}>
          {product.videoUrl ? (
            <iframe
              src={product.videoUrl}
              title={`${product.productName} video`}
              className="h-full w-full rounded-lg"
              allow="autoplay; encrypted-media"
            />
          ) : product.featuredImageUrl ? (
            <img src={product.featuredImageUrl} alt={product.productName} className="h-full w-full rounded-lg object-cover" />
          ) : (
            <div className="h-full w-full rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">No media</div>
          )}
        </AspectRatio>
      </div>
    </section>
  );
}
