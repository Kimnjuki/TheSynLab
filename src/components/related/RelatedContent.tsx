import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ScoreBadge from "@/components/ScoreBadge";
import { ArrowRight, BookOpen, LayoutGrid, GitCompare } from "lucide-react";
import { STATIC_PRODUCTS } from "@/data/staticProductData";

interface Props {
  /** Current product slug (for product pages) */
  productSlug?: string;
  /** Current article slug (for blog/guide pages) */
  articleSlug?: string;
  /** Hub slug for filtering related products */
  hubSlug?: string;
  /** Number of products to show */
  limit?: number;
}

export default function RelatedContent({ productSlug, articleSlug, hubSlug, limit = 3 }: Props) {
  const relatedProducts = useMemo(() => {
    if (!hubSlug) return [];

    // Filter products in same hub, excluding current product
    const sameHub = STATIC_PRODUCTS.filter(
      (p) => p.hubSlug === hubSlug && p.productSlug !== productSlug
    );

    // Sort by trust score descending, take top N
    return sameHub.sort((a, b) => b.trustScore - a.trustScore).slice(0, limit);
  }, [hubSlug, productSlug, limit]);

  const currentHub = useMemo(() => {
    if (!hubSlug) return null;
    return STATIC_PRODUCTS.find((p) => p.hubSlug === hubSlug);
  }, [hubSlug]);

  if (!hubSlug) return null;

  // Build vs comparison links for the current product
  const vsPairs = useMemo(() => {
    if (!productSlug) return [];

    const pairs = [];
    for (const peer of relatedProducts) {
      // Order alphabetically for consistent slug
      const sorted = [productSlug, peer.productSlug].sort();
      pairs.push({
        slug: `vs/${sorted[0]}-vs-${sorted[1]}`,
        name: peer.productName,
      });
    }
    return pairs;
  }, [productSlug, relatedProducts]);

  return (
    <div className="mt-10">
      {/* Internal linking header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          You May Also Like
        </h2>
        <p className="text-sm text-muted-foreground">
          Related products, comparisons, and guides from TheSynLab
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Related product cards */}
        {relatedProducts.map((p) => (
          <Link key={p.productSlug} to={`/products/${p.productSlug}`}>
            <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2 flex-1">
                    {p.productName}
                  </h3>
                  {p.trustScore && (
                    <span className="text-xs font-bold ml-2 tabular-nums">{p.trustScore}/10</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {p.bestFor?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                  {p.longDescription || p.shortDescription || p.description}
                </p>
                <div className="flex items-center gap-1 text-xs text-primary mt-2">
                  View review <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* VS comparisons links */}
      {vsPairs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground self-center">Compare:</span>
          {vsPairs.map((pair) => (
            <Button key={pair.slug} variant="outline" size="sm" className="text-xs h-7" asChild>
              <Link to={`/${pair.slug}`}>
                <GitCompare className="mr-1 h-3 w-3" />
                vs {pair.name}
              </Link>
            </Button>
          ))}
        </div>
      )}

      {/* Hub link */}
      {hubSlug && (
        <div className="mt-4 pt-3 border-t text-sm">
          <Link
            to={`/hub/${hubSlug.replace(/_/g, "-")}`}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            <LayoutGrid className="h-4 w-4" />
            Browse all {hubSlug.replace(/_/g, " ")} tools
            <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
