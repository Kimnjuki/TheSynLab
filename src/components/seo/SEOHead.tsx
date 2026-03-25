import { Helmet } from "react-helmet-async";

type SEOHeadProps = {
  title: string;
  metaDescription?: string;
  canonicalUrl?: string;
  schemaMarkup?: Record<string, unknown> | Array<Record<string, unknown>>;
  ogImage?: string;
  robots?: string;
};

const trimTitle = (title: string) => (title.length > 60 ? `${title.slice(0, 57)}...` : title);
const trimMeta = (meta?: string) => (meta && meta.length > 160 ? `${meta.slice(0, 157)}...` : meta);

export function SEOHead({ title, metaDescription, canonicalUrl, schemaMarkup, ogImage, robots }: SEOHeadProps) {
  const safeTitle = title ? trimTitle(title) : undefined;
  const safeMeta = trimMeta(metaDescription);
  return (
    <Helmet>
      {safeTitle && <title>{safeTitle}</title>}
      {safeMeta && <meta name="description" content={safeMeta} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {safeTitle && <meta property="og:title" content={safeTitle} />}
      {safeMeta && <meta property="og:description" content={safeMeta} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="robots" content={robots ?? "index,follow"} />
      {schemaMarkup && (
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      )}
    </Helmet>
  );
}
