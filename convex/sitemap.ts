/**
 * FEAT-002: Sitemap and robots.txt HTTP actions.
 * Served at https://<deployment>.convex.site/sitemap.xml and /robots.txt
 */

import { httpAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

const SITE_URL = "https://thesynlab.com";

// Internal queries for sitemap data (not exposed to client)
export const getPublishedPosts = internalQuery({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("novaPosts").collect();
    return posts
      .filter((p) => p.postStatus === "published")
      .map((p) => ({
        slug: p.postSlug,
        updated: p.publishedAt ? new Date(p.publishedAt * 1000).toISOString().slice(0, 10) : "",
      }));
  },
});

export const getActiveProductSlugs = internalQuery({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("novaProducts").collect();
    return products.filter((p) => p.status === "active").map((p) => p.productSlug);
  },
});

export const getForumThreadSlugs = internalQuery({
  args: {},
  handler: async (ctx) => {
    const threads = await ctx.db.query("forumThreads").collect();
    return threads.map((t) => t.slug);
  },
});

export const getContentHubSlugs = internalQuery({
  args: {},
  handler: async (ctx) => {
    const hubs = await ctx.db.query("contentHubs").collect();
    return hubs.filter((h) => h.isActive).map((h) => h.slug);
  },
});

export const getComparisonArticleSlugs = internalQuery({
  args: {},
  handler: async (ctx) => {
    const comparisons = await ctx.db.query("comparisonArticles").collect();
    return comparisons.map((c) => c.slug);
  },
});

export const getSitemap = httpAction(async (ctx) => {
  const posts = await ctx.runQuery(internal.sitemap.getPublishedPosts);
  const products = await ctx.runQuery(internal.sitemap.getActiveProductSlugs);
  const threads = await ctx.runQuery(internal.sitemap.getForumThreadSlugs).catch(() => []);
  const hubs = await ctx.runQuery(internal.sitemap.getContentHubSlugs).catch(() => []);
  const comparisons = await ctx.runQuery(internal.sitemap.getComparisonArticleSlugs).catch(() => []);

  const urls: string[] = [
    "<url><loc>" + SITE_URL + "/</loc><changefreq>weekly</changefreq><priority>1</priority></url>",
    "<url><loc>" + SITE_URL + "/blog</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>",
    "<url><loc>" + SITE_URL + "/forum</loc><changefreq>daily</changefreq><priority>0.8</priority></url>",
    "<url><loc>" + SITE_URL + "/tools/compare</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>",
  ];

  for (const p of posts) {
    const lastmod = p.updated ? "<lastmod>" + p.updated + "</lastmod>" : "";
    urls.push(
      "<url><loc>" + SITE_URL + "/blog/" + p.slug + "</loc>" + lastmod + "<changefreq>weekly</changefreq><priority>0.8</priority></url>"
    );
  }
  for (const s of products) {
    urls.push(
      "<url><loc>" + SITE_URL + "/products/" + s + "</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>"
    );
  }
  for (const t of threads) {
    urls.push(
      "<url><loc>" + SITE_URL + "/forum/thread/" + t + "</loc><changefreq>daily</changefreq><priority>0.6</priority></url>"
    );
  }
  for (const hub of hubs) {
    urls.push(
      "<url><loc>" + SITE_URL + "/hub/" + hub + "</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>"
    );
  }
  for (const c of comparisons) {
    urls.push(
      "<url><loc>" + SITE_URL + "/compare/" + c + "</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>"
    );
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join("\n") +
    "\n</urlset>";

  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
});

export const getRobots = httpAction(async () => {
  const text = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
});
