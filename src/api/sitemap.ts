import { saasTools, TOOL_CATEGORIES, BEST_OF_LISTS } from "@/data/saasTools";

const SITE_URL = "https://www.thesynlab.com";

const toUrl = (
  path: string,
  priority = "0.7",
  changefreq = "weekly"
) =>
  `<url><loc>${SITE_URL}${path}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;

export type SitemapSource = {
  contentHubs: Array<{ slug: string }>;
  novaPosts: Array<{ postSlug: string; postStatus?: string }>;
  comparisonArticles: Array<{ slug: string }>;
};

export function generateDynamicSitemapXml(source: SitemapSource) {
  const urls: string[] = [toUrl("/", "1.0", "daily")];

  // ── Existing content ────────────────────────────────────────────────────
  for (const hub of source.contentHubs) {
    urls.push(toUrl(`/hubs/${hub.slug}`, "0.8"));
  }
  for (const post of source.novaPosts) {
    if (!post.postStatus || post.postStatus === "published") {
      urls.push(toUrl(`/blog/${post.postSlug}`));
    }
  }
  for (const comparison of source.comparisonArticles) {
    urls.push(toUrl(`/compare/${comparison.slug}`));
  }

  // ── AI & SaaS Tools Intelligence Layer ──────────────────────────────────
  // Master hub
  urls.push(toUrl("/hub/ai-tools", "0.9", "daily"));

  // Category pages
  for (const category of Object.keys(TOOL_CATEGORIES)) {
    urls.push(toUrl(`/hub/ai-tools/${category}`, "0.8", "weekly"));
  }

  // Individual tool reviews + alternatives
  for (const tool of saasTools) {
    urls.push(toUrl(`/tool/${tool.slug}`, "0.8", "monthly"));
    urls.push(toUrl(`/tool/${tool.slug}/alternatives`, "0.7", "monthly"));
  }

  // Best-of roundup pages
  for (const useCase of Object.keys(BEST_OF_LISTS)) {
    urls.push(toUrl(`/best/${useCase}`, "0.8", "monthly"));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}
