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

  const url = `https://thesynlab.com/products/${data.product.productSlug}`;
  const ratingValue = (data.product.overallScore ?? data.trustScore ?? 0) as number;
  const reviewCount = data.reviewCount > 0 ? data.reviewCount : 1;

  const featureList = Array.isArray(data.product.features)
    ? data.product.features.map((f: any) => (typeof f === "string" ? f : f?.name ?? "")).filter(Boolean).join(", ")
    : undefined;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: data.product.productName,
    description: data.product.description ?? "",
    image: data.product.featuredImageUrl,
    url,
    applicationCategory: data.product.category ?? "SoftwareApplication",
    operatingSystem: "Web",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(2)),
      bestRating: 10,
      worstRating: 0,
      reviewCount,
    },
    review: {
      "@type": "Review",
      author: { "@type": "Person", name: data.authorDisplayName },
      reviewRating: {
        "@type": "Rating",
        ratingValue: Number(ratingValue.toFixed(2)),
        bestRating: 10,
        worstRating: 0,
      },
    },
  };

  if (data.product.price != null) {
    schema.offers = {
      "@type": "Offer",
      price: data.product.price,
      priceCurrency: data.product.priceCurrency ?? "USD",
    };
  }
  if (featureList) schema.featureList = featureList;
  if (data.product.galleryImages?.length) schema.screenshot = data.product.galleryImages;
  if (data.product.officialWebsite) schema.sameAs = data.product.officialWebsite;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

