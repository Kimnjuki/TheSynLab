import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { STATIC_PRODUCTS } from "../../data/staticProductData";

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
  const [timedOut, setTimedOut] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const priceRange = filters.priceRange as number[] | undefined;
  const products = useQuery(api.products.list, {
    hub: filters.hub,
    category: filters.categories?.[0],
    status: filters.status || "active",
    priceMin: priceRange?.[0],
    priceMax: priceRange?.[1],
  });

  useEffect(() => {
    setTimedOut(false);
    setUsingFallback(false);
    if (products !== undefined) return;
    const timeout = window.setTimeout(() => {
      setTimedOut(true);
      setUsingFallback(true);
    }, 8000);
    return () => window.clearTimeout(timeout);
  }, [products, filters.hub, filters.status, filters.category, filters.priceRange, filters.categories, filters.trustScore, filters.integrationScore]);

  // Fallback for when Convex is disabled or unavailable.
  // Match StaticProduct fields so the rest of the code can consume consistent shape.
  const staticFallback = usingFallback
    ? STATIC_PRODUCTS.map((p, idx) => ({
        ...p,
        _id: `static-${p.productSlug}-${idx}`,
        _creationTime: Date.now(),
        productName: p.productName,
        productSlug: p.productSlug,
        productType: p.productType,
        priceCurrency: p.priceCurrency,
        priceModel: p.priceModel,
        releaseDate: new Date().toISOString(),
        featuredImageUrl: "",
        galleryImages: [] as string[],
        videoUrl: "",
        officialWebsite: "",
        documentationUrl: "",
        supportUrl: "",
        isSponsored: false,
        sponsorDisclosed: false,
        createdBy: "",
        updatedBy: "",
        dataHash: "",
        trustScores: { totalScore: p.trustScore },
        integrationScores: { totalScore: p.integrationScore },
      }))
    : [];

  // If Convex returned data, use it. If Convex is disabled/timed out, use static fallback.
  // If Convex is enabled but returned empty (seeds not run), also use static fallback as safety net.
  const convexReturnedData = products !== undefined;
  const convexHasProducts = convexReturnedData && products.length > 0;
  const sourceData = convexHasProducts ? products : staticFallback;

  // Apply client-side filtering for trust/integration scores
  let filteredProducts = (sourceData || []) as any[];

  const trustScore = filters.trustScore as number[] | undefined;
  const integrationScore = filters.integrationScore as number[] | undefined;

  if (trustScore && trustScore.length >= 2) {
    filteredProducts = filteredProducts.filter((p: any) => {
      const score = p.nova_trust_scores?.[0]?.total_score || 0;
      return score >= trustScore[0] && score <= trustScore[1];
    });
  }

  if (integrationScore && integrationScore.length >= 2) {
    filteredProducts = filteredProducts.filter((p: any) => {
      const score = p.nova_integration_scores?.[0]?.total_score || 0;
      return score >= integrationScore[0] && score <= integrationScore[1];
    });
  }

  // Normalize for Compare/UI: add id (and slug for URL support)
  const normalized = filteredProducts.map((p: any) => ({
    ...p,
    id: p._id ?? p.id,
    productSlug: p.productSlug ?? p.product_slug,
    productName: p.productName ?? p.product_name,
    featuredImageUrl: p.featuredImageUrl ?? p.featured_image_url,
  }));

  return {
    products: normalized,
    isLoading: products === undefined && !usingFallback,
    // Only show timeout error if fallback is also empty — if static data loaded, no need to alarm the user
    error: timedOut && staticFallback.length === 0 ? "Product service timeout. Data source may be unavailable." : null,
  };
}

export function useProductBySlug(slug: string) {
  const product = useQuery(api.products.getBySlug, { slug });

  return {
    product,
    isLoading: product === undefined,
    error: null,
  };
}

export function useProductById(id: string) {
  const product = useQuery(api.products.getById, { id: id as any });

  return {
    product,
    isLoading: product === undefined,
    error: null,
  };
}

export function useCreateProduct() {
  const createProduct = useMutation(api.products.create);

  return {
    createProduct,
    isLoading: false,
  };
}

export function useUpdateProduct() {
  const updateProduct = useMutation(api.products.update);

  return {
    updateProduct: async (data: any) => updateProduct(data),
    isLoading: false,
  };
}

export function useDeleteProduct() {
  const deleteProduct = useMutation(api.products.remove);

  return {
    deleteProduct: async (id: string) => deleteProduct({ id: id as any }),
    isLoading: false,
  };
}
