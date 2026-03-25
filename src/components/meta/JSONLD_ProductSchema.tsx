import { Helmet } from "react-helmet-async";

type JSONLDProductSchemaProps = {
  productName: string;
  description: string;
  url: string;
  image?: string;
  overallScore?: number;
  trustScore?: number;
};

export function JSONLD_ProductSchema({
  productName,
  description,
  url,
  image,
  overallScore,
  trustScore,
}: JSONLDProductSchemaProps) {
  const rating = overallScore ?? trustScore ?? 0;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description,
    image,
    url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(rating.toFixed(2)),
      bestRating: 10,
      worstRating: 0,
      reviewCount: 1,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
