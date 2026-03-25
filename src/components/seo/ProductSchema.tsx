import { Helmet } from "react-helmet-async";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export function ProductSchema({
  productId,
  authorUserId,
}: {
  productId: Id<"novaProducts">;
  authorUserId?: string;
}) {
  const data = useQuery(api.seoSchema.getProductSchemaData, {
    productId,
    authorUserId,
  });

  if (!data) return null;

  const url = `https://www.thesynlab.com/products/${data.product.productSlug}`;
  const ratingValue =
    (data.product.overallScore ?? data.trustScore ?? 0) as number;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.product.productName,
    description: data.product.description ?? "",
    image: data.product.featuredImageUrl,
    url,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(2)),
      bestRating: 10,
      worstRating: 0,
      ratingCount: 1,
      reviewCount: 1,
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: data.authorDisplayName,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: Number(ratingValue.toFixed(2)),
        bestRating: 10,
        worstRating: 0,
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

