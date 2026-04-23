/**
 * Per-page meta tags: title, description, canonical, OG, Twitter Card (FEAT-001, SEO-001, SEO-004).
 * Use with useSeoMeta() and render on every page.
 */

import { Helmet } from "react-helmet-async";
import type { SeoMetaInput } from "@/hooks/useSeoMeta";

interface MetaTagsProps extends SeoMetaInput {
  /** Optional site name suffix for title */
  siteName?: string;
}

const SITE_NAME = "TheSynLab";
const SITE_URL = "https://thesynlab.com";

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

export function MetaTags({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
  siteName = SITE_NAME,
}: MetaTagsProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${siteName}`;
  const resolvedCanonical = toAbsoluteSiteUrl(canonical);
  const image = toAbsoluteSiteUrl(ogImage);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      {resolvedCanonical && <meta property="og:url" content={resolvedCanonical} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
