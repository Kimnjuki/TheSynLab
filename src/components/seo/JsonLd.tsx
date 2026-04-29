import { Helmet } from "react-helmet-async";

const SITE_URL = "https://thesynlab.com";

interface JsonLdProps {
  type: "Article" | "Product" | "SoftwareApplication" | "WebPage" | "BreadcrumbList" | "FAQPage" | "Review" | "ItemList" | "Organization";
  article?: {
    title: string;
    description: string;
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    image?: string;
    url: string;
  };
  product?: {
    name: string;
    description: string;
    image?: string;
    url: string;
    rating?: number;
    reviewCount?: number;
  };
  softwareApp?: {
    name: string;
    description: string;
    url: string;
    image?: string;
    applicationCategory?: string;
    operatingSystem?: string;
    price?: number;
    priceCurrency?: string;
    rating?: number;
    reviewCount?: number;
    featureList?: string[];
    screenshots?: string[];
  };
  faq?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; url: string }[];
  itemList?: { name: string; url: string; position?: number }[];
  custom?: Record<string, unknown>;
}

const abs = (url: string) =>
  url.startsWith("http") ? url : `${SITE_URL}${url}`;

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
    url: abs(article.url),
  };
}

function buildProductSchema(product: NonNullable<JsonLdProps["product"]>) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: abs(product.url),
  };
  if (product.rating != null && product.reviewCount != null && product.reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 10,
      worstRating: 0,
    };
  }
  return schema;
}

function buildSoftwareAppSchema(app: NonNullable<JsonLdProps["softwareApp"]>) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    url: abs(app.url),
    applicationCategory: app.applicationCategory ?? "SoftwareApplication",
    operatingSystem: app.operatingSystem ?? "Web",
  };
  if (app.image) schema.image = app.image;
  if (app.featureList?.length) schema.featureList = app.featureList.join(", ");
  if (app.screenshots?.length) schema.screenshot = app.screenshots;
  if (app.price != null) {
    schema.offers = {
      "@type": "Offer",
      price: app.price,
      priceCurrency: app.priceCurrency ?? "USD",
    };
  }
  if (app.rating != null) {
    const reviewCount = app.reviewCount ?? 1;
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(app.rating.toFixed(2)),
      reviewCount,
      bestRating: 10,
      worstRating: 0,
    };
  }
  return schema;
}

function buildFaqSchema(faq: NonNullable<JsonLdProps["faq"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function buildBreadcrumbSchema(breadcrumbs: NonNullable<JsonLdProps["breadcrumbs"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

function buildItemListSchema(items: NonNullable<JsonLdProps["itemList"]>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: item.position ?? i + 1,
      name: item.name,
      url: abs(item.url),
    })),
  };
}

export function JsonLd({ type, article, product, softwareApp, faq, breadcrumbs, itemList, custom }: JsonLdProps) {
  let schema: Record<string, unknown> = { "@context": "https://schema.org", "@type": type };

  if (type === "Article" && article) schema = buildArticleSchema(article);
  else if (type === "Product" && product) schema = buildProductSchema(product);
  else if (type === "SoftwareApplication" && softwareApp) schema = buildSoftwareAppSchema(softwareApp);
  else if (type === "FAQPage" && faq) schema = buildFaqSchema(faq);
  else if (type === "BreadcrumbList" && breadcrumbs) schema = buildBreadcrumbSchema(breadcrumbs);
  else if (type === "ItemList" && itemList) schema = buildItemListSchema(itemList);

  if (custom) schema = { ...schema, ...custom };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
