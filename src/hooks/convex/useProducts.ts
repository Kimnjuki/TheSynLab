import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

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
  const products = useQuery(api.products.list, {
    hub: filters.hub,
    category: filters.categories?.[0],
    status: filters.status || "active",
    priceMin: priceRange?.[0],
    priceMax: priceRange?.[1],
  });

  // Apply client-side filtering for trust/integration scores
  let filteredProducts = (products || []) as any[];

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
    isLoading: products === undefined,
    error: null,
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
