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
  const image =
    ogImage?.startsWith("http") ? ogImage : ogImage ? `https://www.thesynlab.com${ogImage}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
