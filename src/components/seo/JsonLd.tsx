import { Helmet } from "react-helmet-async";

const SITE_URL = "https://thesynlab.com";

export interface PersonData {
  name: string;
  description?: string;
  image?: string;
  sameAs?: string[];
  jobTitle?: string;
  url?: string;
}

export interface ReviewData {
  itemReviewed: {
    name: string;
    description?: string;
    image?: string;
    url?: string;
    sameAs?: string;
  };
  reviewBody: string;
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  author: string | PersonData;
  datePublished?: string;
  publisher?: { name: string; sameAs?: string; image?: string };
}

export interface ArticleData {
  title: string;
  description: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  authorUrl?: string;
  authorBio?: string;
  image?: string;
  url: string;
  articleBody?: string;
  wordCount?: number;
  tags?: string[];
  timeRequired?: string;
}

export interface SoftwareAppData {
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
  pricingModel?: string;
  offers?: { [key: string]: string }[];
  memoryRequirements?: string;
  processorRequirements?: string;
  releaseNotes?: string;
  softwareVersion?: string;
  author?: string | PersonData;
}

export interface OrganizationData {
  name: string;
  description?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
  address?: {
    street: string;
    locality: string;
    region?: string;
    postalCode: string;
    country: string;
  };
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType: string;
  };
}

interface JsonLdProps {
  type: "Article" | "NewsArticle" | "Product" | "SoftwareApplication" | "WebPage" | "WebSite" | "BreadcrumbList" | "FAQPage" | "Review" | "ItemList" | "Organization" | "Person" | "HowTo";
  article?: ArticleData;
  product?: {
    name: string;
    description: string;
    image?: string;
    url: string;
    rating?: number;
    reviewCount?: number;
  };
  softwareApp?: SoftwareAppData;
  faq?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; url: string }[];
  itemList?: { name: string; url: string; position?: number }[];
  review?: ReviewData;
  person?: PersonData;
  organization?: OrganizationData;
  webSite?: {
    name: string;
    url: string;
    searchAction?: { target: string; queryInput: string };
    description?: string;
    image?: string;
  };
  howTo?: {
    name: string;
    description?: string;
    image?: string;
    totalTime?: string;
    estimatedCost?: { currency: string; value: string };
    steps: { name: string; text: string; image?: string; url?: string }[];
  };
  custom?: Record<string, unknown>;
}

const abs = (url: string) =>
  url.startsWith("http") ? url : `${SITE_URL}${url}`;

function buildArticleSchema(article: ArticleData) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime ?? article.publishedTime,
    image: article.image,
    url: abs(article.url),
  };
  if (article.author) {
    schema.author = article.authorUrl
      ? { "@type": "Person", name: article.author, url: article.authorUrl, description: article.authorBio }
      : { "@type": "Person", name: article.author };
  }
  if (article.articleBody) schema.articleBody = article.articleBody;
  if (article.wordCount) schema.wordCount = article.wordCount;
  if (article.tags?.length) schema.keywords = article.tags.join(", ");
  if (article.timeRequired) schema.timeRequired = article.timeRequired;
  schema.publisher = {
    "@type": "Organization",
    name: "TheSynLab",
    logo: { "@type": "ImageObject", url: abs("/logo.png") },
  };
  return schema;
}

function buildNewsArticleSchema(article: ArticleData) {
  const base = buildArticleSchema(article) as Record<string, unknown>;
  base["@type"] = "NewsArticle";
  return base;
}

function buildPersonSchema(person: PersonData) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
  };
  if (person.description) schema.description = person.description;
  if (person.image) schema.image = person.image;
  if (person.jobTitle) schema.jobTitle = person.jobTitle;
  if (person.url) schema.url = abs(person.url);
  if (person.sameAs?.length) schema.sameAs = person.sameAs;
  return schema;
}

function buildReviewSchema(review: ReviewData) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "SoftwareApplication",
      name: review.itemReviewed.name,
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.reviewRating.ratingValue,
      bestRating: review.reviewRating.bestRating ?? 5,
      worstRating: review.reviewRating.worstRating ?? 1,
    },
  };
  if (review.itemReviewed.description) (schema.itemReviewed as Record<string, unknown>).description = review.itemReviewed.description;
  if (review.itemReviewed.image) (schema.itemReviewed as Record<string, unknown>).image = review.itemReviewed.image;
  if (review.itemReviewed.url) (schema.itemReviewed as Record<string, unknown>).url = review.itemReviewed.url;
  if (review.itemReviewed.sameAs) (schema.itemReviewed as Record<string, unknown>).sameAs = review.itemReviewed.sameAs;

  if (typeof review.author === "string") {
    schema.author = { "@type": "Person", name: review.author };
  } else {
    schema.author = { "@type": "Person", name: review.author.name };
    if (review.author.sameAs) (schema.author as Record<string, unknown>).sameAs = review.author.sameAs;
  }
  if (review.datePublished) schema.datePublished = review.datePublished;
  if (review.publisher) {
    schema.publisher = {
      "@type": "Organization",
      name: review.publisher.name,
    };
    if (review.publisher.sameAs) (schema.publisher as Record<string, unknown>).sameAs = review.publisher.sameAs;
    if (review.publisher.image) (schema.publisher as Record<string, unknown>).logo = review.publisher.image;
  }
  return schema;
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

function buildSoftwareAppSchema(app: SoftwareAppData) {
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
  if (app.featureList?.length) schema.featureList = app.featureList;
  if (app.screenshots?.length) schema.screenshot = app.screenshots;
  if (app.softwareVersion) schema.softwareVersion = app.softwareVersion;
  if (app.releaseNotes) schema.releaseNotes = app.releaseNotes;
  if (app.memoryRequirements) schema.memoryRequirements = app.memoryRequirements;
  if (app.processorRequirements) schema.processorRequirements = app.processorRequirements;
  
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
  if (app.author) {
    schema.author = typeof app.author === "string"
      ? { "@type": "Person", name: app.author }
      : { "@type": "Person", name: app.author.name };
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

function buildWebSiteSchema(ws: NonNullable<JsonLdProps["webSite"]>) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ws.name,
    url: abs(ws.url),
  };
  if (ws.description) schema.description = ws.description;
  if (ws.image) schema.image = ws.image;
  if (ws.searchAction) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: ws.searchAction.target,
      },
      queryInput: ws.searchAction.queryInput,
    };
  }
  return schema;
}

function buildOrganizationSchema(org: OrganizationData) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
  };
  if (org.description) schema.description = org.description;
  if (org.url) schema.url = abs(org.url);
  if (org.logo) schema.logo = abs(org.logo);
  if (org.sameAs?.length) schema.sameAs = org.sameAs;
  if (org.address) {
    schema.address = {
      "@type": "PostalAddress",
      streetAddress: org.address.street,
      addressLocality: org.address.locality,
      postalCode: org.address.postalCode,
      addressCountry: org.address.country,
    };
    if (org.address.region) (schema.address as Record<string, unknown>).addressRegion = org.address.region;
  }
  if (org.contactPoint) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      contactType: org.contactPoint.contactType,
    };
    if (org.contactPoint.telephone) (schema.contactPoint as Record<string, unknown>).telephone = org.contactPoint.telephone;
    if (org.contactPoint.email) (schema.contactPoint as Record<string, unknown>).email = org.contactPoint.email;
  }
  return schema;
}

function buildHowToSchema(howTo: NonNullable<JsonLdProps["howTo"]>) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howTo.name,
    step: howTo.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
  if (howTo.description) schema.description = howTo.description;
  if (howTo.image) schema.image = howTo.image;
  if (howTo.totalTime) schema.totalTime = howTo.totalTime;
  if (howTo.estimatedCost) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: howTo.estimatedCost.currency,
      value: howTo.estimatedCost.value,
    };
  }
  howTo.steps.forEach((s, i) => {
    if (s.image) (schema.step as Record<string, unknown>[])[i].image = s.image;
    if (s.url) (schema.step as Record<string, unknown>[])[i].url = s.url;
  });
  return schema;
}

export function JsonLd({ type, article, product, softwareApp, faq, breadcrumbs, itemList, review, person, organization, webSite, howTo, custom }: JsonLdProps) {
  let schema: Record<string, unknown> = { "@context": "https://schema.org", "@type": type };

  if ((type === "Article" || type === "NewsArticle") && article) {
    schema = type === "NewsArticle" ? buildNewsArticleSchema(article) : buildArticleSchema(article);
  } else if (type === "Product" && product) schema = buildProductSchema(product);
  else if (type === "SoftwareApplication" && softwareApp) schema = buildSoftwareAppSchema(softwareApp);
  else if (type === "FAQPage" && faq) schema = buildFaqSchema(faq);
  else if (type === "BreadcrumbList" && breadcrumbs) schema = buildBreadcrumbSchema(breadcrumbs);
  else if (type === "ItemList" && itemList) schema = buildItemListSchema(itemList);
  else if (type === "Review" && review) schema = buildReviewSchema(review);
  else if (type === "Person" && person) schema = buildPersonSchema(person);
  else if (type === "Organization" && organization) schema = buildOrganizationSchema(organization);
  else if (type === "WebSite" && webSite) schema = buildWebSiteSchema(webSite);
  else if (type === "HowTo" && howTo) schema = buildHowToSchema(howTo);

  if (custom) schema = { ...schema, ...custom };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
