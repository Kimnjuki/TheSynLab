import { MetaTags } from "@/components/seo/MetaTags";
import {
  websiteSchema,
  organizationSchema,
  breadcrumbSchema,
  webAppSchema,
  howToSchema,
  faqSchema,
} from "@/lib/seoSchema";

interface ToolPageSEOProps {
  title: string;
  description: string;
  canonical: string;
  toolName: string;
  toolDescription: string;
  faqs: { question: string; answer: string }[];
  howToSteps?: { name: string; text: string }[];
  noindex?: boolean;
}

export function ToolPageSEO({
  title,
  description,
  canonical,
  toolName,
  toolDescription,
  faqs,
  howToSteps,
  noindex,
}: ToolPageSEOProps) {
  const schemas = [
    websiteSchema(),
    organizationSchema(),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Interactive Tools", url: "/tools" },
      { name: toolName, url: canonical },
    ]),
    webAppSchema({
      name: toolName,
      description: toolDescription,
      url: canonical,
    }),
    faqSchema(faqs),
  ];

  if (howToSteps && howToSteps.length > 0) {
    schemas.push(
      howToSchema({
        name: toolName,
        description: toolDescription,
        steps: howToSteps,
      })
    );
  }

  return (
    <MetaTags
      title={title}
      description={description}
      canonical={canonical}
      noindex={noindex}
      schemaMarkup={schemas}
      ogType="website"
    />
  );
}
