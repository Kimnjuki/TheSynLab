/**
 * JSON-LD structured data for SEO (FEAT-001, SEO-002).
 * Renders script type="application/ld+json" for Article, Product, Review, BreadcrumbList.
 */

import { Helmet } from "react-helmet-async";
import type { SeoMetaInput } from "@/hooks/useSeoMeta";

const SITE_URL = "https://www.thesynlab.com";

interface JsonLdProps {
  /** Page type for schema */
  type: "Article" | "Product" | "WebPage" | "BreadcrumbList";
  /** For Article: title, description, dates, author */
  article?: {
    title: string;
    description: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    image?: string;
    url: string;
  };
  /** For Product: name, description, image, url, optional rating */
  product?: {
    name: string;
    description: string;
    image?: string;
    url: string;
    rating?: number;
    reviewCount?: number;
  };
  /** For BreadcrumbList: array of { name, url } */
  breadcrumbs?: { name: string; url: string }[];
  /** Raw schema object (merged with type) */
  custom?: Record<string, unknown>;
}

function buildArticleSchema(article: NonNullable<JsonLdProps["article"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime ?? article.publishedTime,
    author: article.author ? { "@type": "Person", name: article.author } : undefined,
    image: article.image,
    url: article.url.startsWith("http") ? article.url : `${SITE_URL}${article.url}`,
  };
}

function buildProductSchema(product: NonNullable<JsonLdProps["product"]>) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: product.url.startsWith("http") ? product.url : `${SITE_URL}${product.url}`,
  };
  if (product.rating != null && product.reviewCount != null && product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
    };
  }
  return schema;
}

function buildBreadcrumbSchema(breadcrumbs: NonNullable<JsonLdProps["breadcrumbs"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function JsonLd({ type, article, product, breadcrumbs, custom }: JsonLdProps) {
  let schema: Record<string, unknown> = { "@context": "https://schema.org", "@type": type };

  if (type === "Article" && article) schema = buildArticleSchema(article);
  else if (type === "Product" && product) schema = buildProductSchema(product);
  else if (type === "BreadcrumbList" && breadcrumbs) schema = buildBreadcrumbSchema(breadcrumbs);
  if (custom) schema = { ...schema, ...custom };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
