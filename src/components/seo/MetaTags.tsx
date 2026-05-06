/**
 * SEO head manager — handles all meta tags, canonical, OG, Twitter Card, JSON-LD.
 * Merge of legacy SEOHead and MetaTags. Keeps the MetaTags export name for backwards compat.
 * All pages use this single component via useSeoMeta().
 */

import { Helmet } from "react-helmet-async";
import type { SeoMetaInput } from "@/hooks/useSeoMeta";

const SITE_NAME = "TheSynLab";
const SITE_URL = "https://thesynlab.com";
const DEFAULT_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f8f36f0c-e7ec-4d45-90a0-2036be5191f5/id-preview-b0cd2a6d--f300eb6b-f1a7-48c2-9b76-81c2c602b334.lovable.app-1770468126707.png";

interface MetaTagsProps extends SeoMetaInput {
  siteName?: string;
  /** Pass an array or single JSON-LD object */
  schemaMarkup?: Record<string, unknown> | Array<Record<string, unknown>>;
  robots?: string;
}

function toAbsoluteSiteUrl(url?: string) {
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
}

const trimTitle = (title: string) => (title.length > 60 ? `${title.slice(0, 57)}...` : title);
const trimMeta = (meta?: string) => (meta && meta.length > 160 ? `${meta.slice(0, 157)}...` : meta);

export function MetaTags({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
  siteName = SITE_NAME,
  schemaMarkup,
  robots,
}: MetaTagsProps) {
  const fullTitle = title.includes(siteName) ? title : `${trimTitle(title)} | ${siteName}`;
  const safeMeta = trimMeta(description);
  const resolvedCanonical = toAbsoluteSiteUrl(canonical);
  const image = toAbsoluteSiteUrl(ogImage) || DEFAULT_IMAGE;
  const robotsContent = robots ?? (noindex ? "noindex, nofollow" : "index, follow");

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {safeMeta && <meta name="description" content={safeMeta} />}
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}

      <meta name="robots" content={robotsContent} />
      <meta name="twitter:card" content={twitterCard} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={ogType} />
      {fullTitle && <meta property="og:title" content={fullTitle} />}
      {safeMeta && <meta property="og:description" content={safeMeta} />}
      {resolvedCanonical && <meta property="og:url" content={resolvedCanonical} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:title" content={fullTitle} />
      {safeMeta && <meta name="twitter:description" content={safeMeta} />}
      {image && <meta name="twitter:image" content={image} />}

      {schemaMarkup && !Array.isArray(schemaMarkup) && (
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      )}
      {schemaMarkup && Array.isArray(schemaMarkup) && schemaMarkup.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
}

/** Legacy alias — maps old SEOHead props to MetaTags. */
export function SEOHead({
  title,
  metaDescription,
  canonicalUrl,
  schemaMarkup,
  ogImage,
  robots,
}: {
  title: string;
  metaDescription?: string;
  canonicalUrl?: string;
  schemaMarkup?: Record<string, unknown> | Array<Record<string, unknown>>;
  ogImage?: string;
  robots?: string;
}) {
  return (
    <MetaTags
      title={title}
      description={metaDescription ?? title}
      canonical={canonicalUrl}
      ogImage={ogImage}
      robots={robots}
      schemaMarkup={schemaMarkup}
    />
  );
}
