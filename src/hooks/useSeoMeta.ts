/**
 * SEO meta hook – provides a consistent shape for per-page meta and JSON-LD.
 * Use with MetaTags and JsonLd components (FEAT-001).
 */

const SITE_URL = "https://thesynlab.com";
const DEFAULT_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f8f36f0c-e7ec-4d45-90a0-2036be5191f5/id-preview-b0cd2a6d--f300eb6b-f1a7-48c2-9b76-81c2c602b334.lovable.app-1770468126707.png";

export interface SeoMetaInput {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  twitterCard?: "summary" | "summary_large_image";
  noindex?: boolean;
  /** For Article/Product JSON-LD */
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  /** Product-specific */
  productName?: string;
  productImage?: string;
  /** Review rating 1–5 for aggregateRating */
  rating?: number;
  reviewCount?: number;
}

export function useSeoMeta(input: SeoMetaInput) {
  const canonical = input.canonical?.startsWith("http")
    ? input.canonical
    : input.canonical
      ? `${SITE_URL}${input.canonical.startsWith("/") ? "" : "/"}${input.canonical}`
      : undefined;
  const ogImage =
    input.ogImage?.startsWith("http") ? input.ogImage : input.ogImage ? `${SITE_URL}${input.ogImage}` : DEFAULT_IMAGE;

  return {
    title: input.title,
    description: input.description,
    canonical,
    ogImage,
    ogType: input.ogType ?? "website",
    twitterCard: input.twitterCard ?? "summary_large_image",
    noindex: input.noindex ?? false,
    publishedTime: input.publishedTime,
    modifiedTime: input.modifiedTime,
    author: input.author,
    section: input.section,
    tags: input.tags,
    productName: input.productName,
    productImage: input.productImage,
    rating: input.rating,
    reviewCount: input.reviewCount,
    siteUrl: SITE_URL,
  };
}
