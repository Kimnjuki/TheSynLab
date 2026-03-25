import { SEOHead } from "@/components/seo/SEOHead";

type Props = {
  name: string;
  description: string;
  url: string;
  image?: string;
  trustScore?: number;
  integrationScore?: number;
};

export function ScoreRichSnippet({ name, description, url, image, trustScore, integrationScore }: Props) {
  const avg = ((trustScore ?? 0) + (integrationScore ?? 0)) / 2;
  return (
    <SEOHead
      title={name}
      metaDescription={description}
      canonicalUrl={url}
      ogImage={image}
      schemaMarkup={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        image,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: Number(avg.toFixed(2)),
          reviewCount: 2,
        },
      }}
    />
  );
}
