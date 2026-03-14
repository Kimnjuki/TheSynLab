/**
 * FEAT-007: RSS 2.0 feed for published posts.
 * GET https://<deployment>.convex.site/feed.xml
 */

import { httpAction } from "./_generated/server";
import { internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

const SITE_URL = "https://www.thesynlab.com";

export const getPublishedForRss = internalQuery({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("novaPosts").collect();
    return posts
      .filter((p) => p.postStatus === "published" && p.publishedAt)
      .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
      .slice(0, 100)
      .map((p) => ({
        title: p.postTitle,
        slug: p.postSlug,
        description: p.postExcerpt ?? p.postContent?.slice(0, 300) ?? "",
        image: p.featuredImageUrl,
        publishedAt: p.publishedAt!,
        hub: p.hub,
      }));
  },
});

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const getFeed = httpAction(async (ctx) => {
  const items = await ctx.runQuery(internal.rss.getPublishedForRss);

  const rssItems = items
    .map((p) => {
      const link = `${SITE_URL}/blog/${p.slug}`;
      const pubDate = new Date(p.publishedAt * 1000).toUTCString();
      const desc = escapeXml(p.description);
      const title = escapeXml(p.title);
      const enclosure =
        p.image ?
          `\n    <enclosure url="${escapeXml(p.image)}" type="image/jpeg"/>`
        : "";
      return `  <item>
    <title>${title}</title>
    <link>${link}</link>
    <description><![CDATA[${p.description.slice(0, 500)}]]></description>
    <pubDate>${pubDate}</pubDate>
    <guid isPermaLink="true">${link}</guid>
    <category>${escapeXml(p.hub ?? "")}</category>${enclosure}
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>TheSynLab – Tech Reviews &amp; Workflow</title>
    <link>${SITE_URL}</link>
    <description>In-depth tech reviews with Trust &amp; Integration Scores. Productivity tools, smart home, office hardware.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
});
