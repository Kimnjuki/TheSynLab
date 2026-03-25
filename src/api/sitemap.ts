const SITE_URL = "https://www.thesynlab.com";

const toUrl = (path: string) =>
  `<url><loc>${SITE_URL}${path}</loc><changefreq>weekly</changefreq></url>`;

export type SitemapSource = {
  contentHubs: Array<{ slug: string }>;
  novaPosts: Array<{ postSlug: string; postStatus?: string }>;
  comparisonArticles: Array<{ slug: string }>;
};

export function generateDynamicSitemapXml(source: SitemapSource) {
  const urls: string[] = [toUrl("/")];

  for (const hub of source.contentHubs) {
    urls.push(toUrl(`/hubs/${hub.slug}`));
  }
  for (const post of source.novaPosts) {
    if (!post.postStatus || post.postStatus === "published") {
      urls.push(toUrl(`/blog/${post.postSlug}`));
    }
  }
  for (const comparison of source.comparisonArticles) {
    urls.push(toUrl(`/compare/${comparison.slug}`));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}
