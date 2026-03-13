// Re-export Convex products hooks for backward compatibility
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ProductFilters {
  hub?: string;
  category?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  priceRange?: number[] | [number, number];
  categories?: string[];
  trustScore?: number[] | [number, number];
  integrationScore?: number[] | [number, number];
}

export function useProducts(filters: ProductFilters = {}) {
  const priceRange = filters.priceRange as number[] | undefined;
  
  const productsData = useQuery(api.products.list, {
    hub: filters.hub,
    category: filters.categories?.[0] || filters.category,
    status: filters.status || "active",
    priceMin: priceRange?.[0],
    priceMax: priceRange?.[1],
  });

  // Transform Convex data to match expected format
  let products = ((productsData || []) as any[]).map(product => ({
    ...product,
    id: product._id,
    product_name: product.productName,
    product_slug: product.productSlug,
    product_type: product.productType,
    price_currency: product.priceCurrency,
    price_model: product.priceModel,
    release_date: product.releaseDate,
    featured_image_url: product.featuredImageUrl,
    gallery_images: product.galleryImages,
    video_url: product.videoUrl,
    official_website: product.officialWebsite,
    documentation_url: product.documentationUrl,
    support_url: product.supportUrl,
    is_sponsored: product.isSponsored,
    sponsor_disclosed: product.sponsorDisclosed,
    created_at: product._creationTime,
    updated_at: product._creationTime,
    created_by: product.createdBy,
    updated_by: product.updatedBy,
    data_hash: product.dataHash,
    // Score relations
    nova_trust_scores: product.trustScores ? [{ total_score: product.trustScores.totalScore }] : [],
    nova_integration_scores: product.integrationScores ? [{ total_score: product.integrationScores.totalScore }] : [],
  }));

  // Apply client-side filtering for trust/integration scores
  const trustScore = filters.trustScore as number[] | undefined;
  const integrationScore = filters.integrationScore as number[] | undefined;

  if (trustScore && trustScore.length >= 2) {
    products = products.filter((p: any) => {
      const score = p.nova_trust_scores?.[0]?.total_score || 0;
      return score >= trustScore[0] && score <= trustScore[1];
    });
  }

  if (integrationScore && integrationScore.length >= 2) {
    products = products.filter((p: any) => {
      const score = p.nova_integration_scores?.[0]?.total_score || 0;
      return score >= integrationScore[0] && score <= integrationScore[1];
    });
  }

  return {
    products,
    isLoading: productsData === undefined,
    error: null,
  };
}
