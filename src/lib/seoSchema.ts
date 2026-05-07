import type { SeoMetaInput } from "@/hooks/useSeoMeta";

const SITE_URL = "https://thesynlab.com";

/**
 * Build schema for Interactive Tools pages.
 * Google AI crawlers understand HowTo, FAQPage, WebApplication, and BreadcrumbList
 * as rich entity schemas. This gives the best snippet surface area.
 */

/** WebSite schema — one per page, provides aiSearchInfo signals */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TheSynLab",
    url: SITE_URL,
    description:
      "Next-gen tech reviews with unique Trust & Integration Scores. Interactive tools for stack discovery, TCO comparison, vendor risk assessment, and workflow automation.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Organization schema — E-E-A-T signal */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TheSynLab",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Next-gen tech review platform with Trust & Integration Scores for productivity tools, smart home, and office hardware.",
    foundingDate: "2024",
  };
}

/** BreadcrumbList schema */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/** WebApplication schema for interactive tools */
export function webAppSchema({
  name,
  description,
  url,
  operatingSystem = "Web",
  applicationCategory = "BusinessApplication",
  offers,
}: {
  name: string;
  description: string;
  url: string;
  operatingSystem?: string;
  applicationCategory?: string;
  offers?: { price: number; priceCurrency: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url: `${SITE_URL}${url}`,
    operatingSystem,
    applicationCategory,
    ...(offers && {
      offers: {
        "@type": "Offer",
        price: offers.price,
        priceCurrency: offers.priceCurrency,
      },
    }),
  };
}

/** FAQPage schema for tool help content */
export function faqSchema(entries: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: e.answer,
      },
    })),
  };
}

/** HowTo schema for step-by-step tools (Stack Quiz, Blueprint, Risk Checker) */
export function howToSchema({
  name,
  description,
  steps,
  totalTime,
}: {
  name: string;
  description: string;
  steps: { name: string; text: string; url?: string }[];
  totalTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...(totalTime && { totalTime }),
    step: steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      ...(step.url && { url: `${SITE_URL}${step.url}` }),
    })),
  };
}
