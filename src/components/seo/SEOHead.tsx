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
const SITE_URL = "https://thesynlab.com";

const toAbsoluteSiteUrl = (url?: string) => {
  if (!url) return undefined;
  try {
    const parsed = new URL(url, SITE_URL);
    if (parsed.hostname === "www.thesynlab.com") {
      parsed.hostname = "thesynlab.com";
    }
    return parsed.toString();
  } catch {
    return undefined;
  }
};

export function SEOHead({ title, metaDescription, canonicalUrl, schemaMarkup, ogImage, robots }: SEOHeadProps) {
  const safeTitle = title ? trimTitle(title) : undefined;
  const safeMeta = trimMeta(metaDescription);
  const resolvedCanonical = toAbsoluteSiteUrl(canonicalUrl);
  const resolvedOgImage = toAbsoluteSiteUrl(ogImage);
  return (
    <Helmet>
      {safeTitle && <title>{safeTitle}</title>}
      {safeMeta && <meta name="description" content={safeMeta} />}
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}
      {safeTitle && <meta property="og:title" content={safeTitle} />}
      {safeMeta && <meta property="og:description" content={safeMeta} />}
      {resolvedCanonical && <meta property="og:url" content={resolvedCanonical} />}
      {resolvedOgImage && <meta property="og:image" content={resolvedOgImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="robots" content={robots ?? "index,follow"} />
      {schemaMarkup && (
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      )}
    </Helmet>
  );
}
