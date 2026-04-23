import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs/promises";
import { componentTagger } from "lovable-tagger";
import { blogArticles } from "./src/data/blogArticles";
import { saasTools, BEST_OF_LISTS, TOOL_CATEGORIES } from "./src/data/saasTools";

const SITE_URL = "https://thesynlab.com";
const HOME_TITLE = "TheSynLab – Next-Gen Tech Reviews & Workflow Optimization";
const HOME_DESCRIPTION =
  "In-depth tech reviews with unique Trust & Integration Scores. Expert analysis of productivity tools, smart home devices, and office hardware to build your perfect workflow ecosystem.";

const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclosure",
  "/blog",
  "/products",
  "/products/watchlist",
  "/tools",
  "/tools/compare",
  "/tools/compatibility",
  "/tools/compatibility-leaderboard",
  "/tools/stack-builder",
  "/tools/hub-builder",
  "/tools/find",
  "/tools/roi-calculator",
  "/forum",
  "/community/leaderboard",
  "/community/setups",
  "/search",
  "/scoring-hub",
  "/hub/ai-tools",
  "/hubs/intelligent-home",
  "/hubs/hybrid-office",
  "/hubs/ai-workflow",
];

const dynamicRoutes = [
  ...blogArticles.map((article) => `/blog/${article.slug}`),
  ...saasTools.flatMap((tool) => [`/tool/${tool.slug}`, `/tool/${tool.slug}/alternatives`]),
  ...Object.keys(BEST_OF_LISTS).map((useCase) => `/best/${useCase}`),
  ...Object.keys(TOOL_CATEGORIES).map((category) => `/hub/ai-tools/${category}`),
];

const prerenderRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));

const buildSitemapXml = () => {
  const allRoutes = prerenderRoutes;

  const urls = allRoutes
    .map((route) => {
      const loc = `${SITE_URL}${route}`;
      const priority = route === "/" ? "1.0" : route.startsWith("/blog/") ? "0.8" : "0.7";
      const changefreq = route.startsWith("/blog/") ? "weekly" : "monthly";
      return `  <url><loc>${loc}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const slugToTitle = (route: string) =>
  route
    .replace(/^\/+/, "")
    .replaceAll("/", " / ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const upsertTag = (html: string, pattern: RegExp, replacement: string) => (pattern.test(html) ? html.replace(pattern, replacement) : html);

const staticMetaByRoute: Record<string, { title: string; description: string }> = {
  "/": { title: HOME_TITLE, description: HOME_DESCRIPTION },
  "/blog": { title: "Tech Blog & Reviews | TheSynLab", description: "Latest smart home, productivity, and AI tool deep dives from TheSynLab." },
  "/products": { title: "Products Hub | TheSynLab", description: "Explore reviewed products with Trust and Integration scoring insights." },
  "/tools": { title: "Tools Hub | TheSynLab", description: "Interactive tools for comparison, compatibility, budget, and ROI analysis." },
  "/forum": { title: "Community Forum | TheSynLab", description: "Join the TheSynLab community to discuss setups, tools, and workflows." },
};

type StaticPageMeta = {
  route: string;
  title: string;
  description: string;
};

const buildStaticPagesMeta = (): StaticPageMeta[] => {
  const pages: StaticPageMeta[] = [];

  for (const route of staticRoutes) {
    const fromMap = staticMetaByRoute[route];
    pages.push({
      route,
      title: fromMap?.title ?? `${slugToTitle(route)} | TheSynLab`,
      description: fromMap?.description ?? HOME_DESCRIPTION,
    });
  }

  for (const article of blogArticles) {
    pages.push({
      route: `/blog/${article.slug}`,
      title: article.seoTitle || `${article.title} | TheSynLab`,
      description: article.metaDescription || article.excerpt || article.title,
    });
  }

  for (const tool of saasTools) {
    pages.push({
      route: `/tool/${tool.slug}`,
      title: `${tool.name} Review | TheSynLab`,
      description: tool.shortDescription || tool.tagline || HOME_DESCRIPTION,
    });
    pages.push({
      route: `/tool/${tool.slug}/alternatives`,
      title: `${tool.name} Alternatives | TheSynLab`,
      description: `Best alternatives to ${tool.name} with side-by-side scoring and fit analysis.`,
    });
  }

  for (const [category, details] of Object.entries(TOOL_CATEGORIES)) {
    pages.push({
      route: `/hub/ai-tools/${category}`,
      title: `${details.name} | TheSynLab`,
      description: details.description || HOME_DESCRIPTION,
    });
  }

  for (const [useCase, details] of Object.entries(BEST_OF_LISTS)) {
    pages.push({
      route: `/best/${useCase}`,
      title: `${details.title} | TheSynLab`,
      description: details.description || HOME_DESCRIPTION,
    });
  }

  return Array.from(new Map(pages.map((page) => [page.route, page])).values());
};

const generateStaticHtmlPages = async (distDir: string) => {
  const indexPath = path.resolve(distDir, "index.html");
  const indexHtml = await fs.readFile(indexPath, "utf8");
  const pages = buildStaticPagesMeta();

  for (const page of pages) {
    const canonical = `${SITE_URL}${page.route === "/" ? "/" : page.route}`;
    let html = indexHtml;
    html = upsertTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
    html = upsertTag(
      html,
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${escapeHtml(page.description)}">`
    );
    html = upsertTag(
      html,
      /<link\s+rel=["']canonical["'][^>]*>/i,
      `<link rel="canonical" href="${escapeHtml(canonical)}" />`
    );
    html = upsertTag(
      html,
      /<meta\s+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${escapeHtml(page.title)}">`
    );
    html = upsertTag(
      html,
      /<meta\s+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${escapeHtml(page.description)}">`
    );
    html = upsertTag(
      html,
      /<meta\s+property=["']og:url["'][^>]*>/i,
      `<meta property="og:url" content="${escapeHtml(canonical)}">`
    );

    const outputPath =
      page.route === "/" ? indexPath : path.resolve(distDir, page.route.replace(/^\/+/, ""), "index.html");
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, "utf8");
  }
};

const sitemapPlugin = () => ({
  name: "thesynlab-sitemap",
  async closeBundle() {
    const distDir = path.resolve(__dirname, "dist");
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(path.resolve(distDir, "sitemap.xml"), buildSitemapXml(), "utf8");
    await generateStaticHtmlPages(distDir);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    sitemapPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
