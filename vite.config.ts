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
  jsonLd: Record<string, unknown>;
};

const buildStaticPagesMeta = (): StaticPageMeta[] => {
  const pages: StaticPageMeta[] = [];

  for (const route of staticRoutes) {
    const fromMap = staticMetaByRoute[route];
    pages.push({
      route,
      title: fromMap?.title ?? `${slugToTitle(route)} | TheSynLab`,
      description: fromMap?.description ?? HOME_DESCRIPTION,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": route === "/" ? "WebSite" : "WebPage",
        name: fromMap?.title ?? `${slugToTitle(route)} | TheSynLab`,
        description: fromMap?.description ?? HOME_DESCRIPTION,
        url: `${SITE_URL}${route === "/" ? "/" : route}`,
      },
    });
  }

  for (const article of blogArticles) {
    const route = `/blog/${article.slug}`;
    pages.push({
      route,
      title: article.seoTitle || `${article.title} | TheSynLab`,
      description: article.metaDescription || article.excerpt || article.title,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription || article.excerpt || article.title,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        author: article.author ? { "@type": "Person", name: article.author } : undefined,
        image: article.image,
        mainEntityOfPage: `${SITE_URL}${route}`,
        url: `${SITE_URL}${route}`,
      },
    });
  }

  for (const tool of saasTools) {
    const toolRoute = `/tool/${tool.slug}`;
    pages.push({
      route: toolRoute,
      title: `${tool.name} Review | TheSynLab`,
      description: tool.shortDescription || tool.tagline || HOME_DESCRIPTION,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.shortDescription || tool.tagline || HOME_DESCRIPTION,
        applicationCategory: tool.category,
        url: `${SITE_URL}${toolRoute}`,
      },
    });
    const altRoute = `/tool/${tool.slug}/alternatives`;
    pages.push({
      route: altRoute,
      title: `${tool.name} Alternatives | TheSynLab`,
      description: `Best alternatives to ${tool.name} with side-by-side scoring and fit analysis.`,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${tool.name} Alternatives`,
        description: `Best alternatives to ${tool.name} with side-by-side scoring and fit analysis.`,
        url: `${SITE_URL}${altRoute}`,
      },
    });
  }

  for (const [category, details] of Object.entries(TOOL_CATEGORIES)) {
    pages.push({
      route: `/hub/ai-tools/${category}`,
      title: `${details.name} | TheSynLab`,
      description: details.description || HOME_DESCRIPTION,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${details.name} | TheSynLab`,
        description: details.description || HOME_DESCRIPTION,
        url: `${SITE_URL}/hub/ai-tools/${category}`,
      },
    });
  }

  for (const [useCase, details] of Object.entries(BEST_OF_LISTS)) {
    pages.push({
      route: `/best/${useCase}`,
      title: `${details.title} | TheSynLab`,
      description: details.description || HOME_DESCRIPTION,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${details.title} | TheSynLab`,
        description: details.description || HOME_DESCRIPTION,
        url: `${SITE_URL}/best/${useCase}`,
      },
    });
  }

  return Array.from(new Map(pages.map((page) => [page.route, page])).values());
};

const stripMarkdown = (md: string, maxChars = 4000): string =>
  md
    .slice(0, maxChars)
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/^\s*>\s*/gm, "")
    .trim();

const buildStaticBodyHtml = (route: string): string => {
  const year = new Date().getFullYear();
  const li = (items: string[]) => items.map((i) => `<li>${escapeHtml(i)}</li>`).join("");

  // Tool review page
  const toolMatch = route.match(/^\/tool\/([^/]+)$/);
  if (toolMatch) {
    const tool = saasTools.find((t) => t.slug === toolMatch[1]);
    if (tool) {
      const verdict =
        tool.trustScore >= 4.3 ? "Highly Recommended" :
        tool.trustScore >= 4.0 ? "Recommended" :
        tool.trustScore >= 3.7 ? "Good with Caveats" : "Use with Caution";
      return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<nav style="font-size:.85rem;margin-bottom:1rem"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools</a> › ${escapeHtml(tool.name)}</nav>
<h1>${escapeHtml(tool.name)} Review (${year})</h1>
<p style="font-size:1.1rem">${escapeHtml(tool.tagline)}</p>
<p>${escapeHtml(tool.shortDescription)}</p>
<section><h2>TheSynLab Scores</h2><p><b>Trust Score:</b> ${tool.trustScore}/5 &nbsp;·&nbsp; <b>Integration Score:</b> ${tool.integrationScore}/5 &nbsp;·&nbsp; <b>Verdict:</b> ${verdict}</p></section>
<section><h2>Pricing</h2><p>${tool.pricing.hasFree ? "Free plan available. " : ""}Starting at <b>${escapeHtml(tool.pricing.startingPrice)}</b>. ${escapeHtml(tool.pricing.pricingModel)}.</p></section>
<section><h2>Pros</h2><ul>${li(tool.pros)}</ul></section>
<section><h2>Cons</h2><ul>${li(tool.cons)}</ul></section>
<section><h2>Key Features</h2><ul>${li(tool.keyFeatures)}</ul></section>
<section><h2>Best For</h2><ul>${li(tool.bestFor)}</ul></section>
<section><h2>Integrations</h2><p>${escapeHtml(tool.integrations.join(", "))}.</p></section>
<p><a href="/tool/${tool.slug}/alternatives">See alternatives to ${escapeHtml(tool.name)} →</a></p>
</main>`;
    }
  }

  // Tool alternatives page
  const altMatch = route.match(/^\/tool\/([^/]+)\/alternatives$/);
  if (altMatch) {
    const tool = saasTools.find((t) => t.slug === altMatch[1]);
    if (tool) {
      const alts = saasTools
        .filter((t) => t.category === tool.category && t.slug !== tool.slug)
        .slice(0, 8);
      const altsHtml = alts
        .map((a) => `<li><a href="/tool/${a.slug}"><b>${escapeHtml(a.name)}</b></a> — Trust Score ${a.trustScore}/5 · ${escapeHtml(a.shortDescription)}</li>`)
        .join("");
      return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<nav style="font-size:.85rem;margin-bottom:1rem"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools</a> › <a href="/tool/${tool.slug}">${escapeHtml(tool.name)}</a> › Alternatives</nav>
<h1>Best Alternatives to ${escapeHtml(tool.name)} (${year})</h1>
<p>Independent comparison of the top ${escapeHtml(tool.name)} alternatives, ranked by Trust Score and Integration Score.</p>
<ul>${altsHtml}</ul>
<p><a href="/tool/${tool.slug}">← Back to ${escapeHtml(tool.name)} full review</a></p>
</main>`;
    }
  }

  // Blog article page
  const blogMatch = route.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const article = blogArticles.find((a) => a.slug === blogMatch[1]);
    if (article) {
      const plain = stripMarkdown(article.content, 4000);
      const bodyHtml = plain
        .split(/\n\n+/)
        .filter(Boolean)
        .slice(0, 12)
        .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
        .join("");
      return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<nav style="font-size:.85rem;margin-bottom:1rem"><a href="/">TheSynLab</a> › <a href="/blog">Blog</a></nav>
<h1>${escapeHtml(article.title)}</h1>
<p style="color:#666;font-size:.875rem">By ${escapeHtml(article.author)} · ${article.publishedAt} · ${article.readingTime} min read</p>
<p><b>${escapeHtml(article.excerpt)}</b></p>
${bodyHtml}
</main>`;
    }
  }

  // Category hub page
  const categoryMatch = route.match(/^\/hub\/ai-tools\/([^/]+)$/);
  if (categoryMatch) {
    const cat = (TOOL_CATEGORIES as Record<string, { name: string; description?: string }>)[categoryMatch[1]];
    if (cat) {
      const tools = saasTools.filter((t) => t.category === categoryMatch[1]);
      const toolsHtml = tools
        .map((t) => `<li><a href="/tool/${t.slug}"><b>${escapeHtml(t.name)}</b></a> — Trust Score ${t.trustScore}/5 · ${escapeHtml(t.shortDescription)}</li>`)
        .join("");
      return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<nav style="font-size:.85rem;margin-bottom:1rem"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools Hub</a></nav>
<h1>Best ${escapeHtml(cat.name)} — Independent Reviews (${year})</h1>
<p>${escapeHtml(cat.description || "")}</p>
<ul>${toolsHtml}</ul>
</main>`;
    }
  }

  // Best-of list page
  const bestMatch = route.match(/^\/best\/([^/]+)$/);
  if (bestMatch) {
    const best = (BEST_OF_LISTS as Record<string, { title: string; description?: string }>)[bestMatch[1]];
    if (best) {
      return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<nav style="font-size:.85rem;margin-bottom:1rem"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools Hub</a></nav>
<h1>${escapeHtml(best.title)}</h1>
<p>${escapeHtml(best.description || "")}</p>
</main>`;
    }
  }

  // Legal & informational pages
  if (route === "/privacy") return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<h1>Privacy Policy</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab is committed to protecting your privacy and being transparent about how we collect, use, and share your information.</p>
<h2>Information We Collect</h2><p>We collect information you provide (email, profile info, reviews) and automatically collected usage data (IP address, browser type, pages visited).</p>
<h2>Google AdSense &amp; Cookies</h2><p>We use Google AdSense for advertisements. Non-essential cookies (analytics, advertising, preferences) are only activated after you give explicit consent via our Cookie Consent Manager. You may opt out of personalised advertising via Google Ads Settings.</p>
<h2>How We Use Your Information</h2><p>To provide our services, send newsletters (with consent), analyse usage patterns, and improve your experience. We do not sell your personal data to third parties.</p>
<h2>Your Rights (GDPR &amp; CCPA)</h2><p>EEA/UK residents may request access, rectification, erasure, or portability of their data. California residents have rights under CCPA including the right to know what data is collected and the right to deletion. Contact: privacy@thesynlab.com</p>
<h2>Contact</h2><p>Email: privacy@thesynlab.com</p>
</main>`;

  if (route === "/terms") return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<h1>Terms of Service</h1><p>Last Updated: January 12, 2026</p>
<p>By accessing or using TheSynLab you agree to be bound by these Terms of Service. If you do not agree, please do not use our service. You must be at least 18 years of age to use our service.</p>
<h2>User Responsibilities</h2><p>You are responsible for maintaining the confidentiality of your account credentials and ensuring your use complies with applicable laws. Do not use the service for illegal purposes or to impersonate others.</p>
<h2>Intellectual Property</h2><p>Our reviews, Trust Scores, Integration Scores, and methodologies are owned by TheSynLab and protected by copyright law. Our scoring represents our independent editorial assessment.</p>
<h2>Affiliate Links &amp; Advertising</h2><p>TheSynLab participates in affiliate programs and may earn commissions on purchases — at no additional cost to you. This does not affect our editorial independence. See our Affiliate Disclosure for full details.</p>
<h2>Disclaimer</h2><p>Reviews are provided for informational purposes only. TheSynLab is not liable for purchase decisions made based on our content. Trust Scores reflect our independent assessment at the time of review.</p>
<h2>Contact</h2><p>Email: legal@thesynlab.com</p>
</main>`;

  if (route === "/disclosure") return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<h1>Affiliate Disclosure</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab participates in affiliate marketing programs. When you click product links on our site and make a purchase, we may earn a commission — at no additional cost to you.</p>
<h2>Our Editorial Independence</h2><p>Affiliate relationships do not influence our reviews, Trust Scores, or recommendations. All products are evaluated independently before we publish our assessments. Our editorial standards are non-negotiable.</p>
<h2>FTC Compliance</h2><p>Per FTC 16 CFR Part 255, we disclose that we may receive compensation for links on this website. This disclosure applies to all content published on TheSynLab. Affiliate links are marked with rel="nofollow sponsored" attributes.</p>
<h2>Programs We Participate In</h2><p>We participate in Amazon Associates, ShareASale, PartnerStack, and direct SaaS affiliate partnerships. Commission rates vary by program and product category.</p>
<h2>Contact</h2><p>Questions about our affiliate relationships? Email: affiliates@thesynlab.com</p>
</main>`;

  if (route === "/about") return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<h1>About TheSynLab</h1>
<p>TheSynLab is an independent technology review platform that evaluates SaaS tools, smart home devices, and productivity software using our proprietary Trust Score and Integration Score methodology.</p>
<h2>Our Mission</h2><p>We help professionals and teams make confident technology decisions through honest, data-driven reviews that prioritise real-world performance over marketing claims.</p>
<h2>Our Scoring System</h2><p>Every tool receives a <b>Trust Score</b> (measuring reliability, privacy, and transparency) and an <b>Integration Score</b> (measuring ecosystem compatibility and API quality). Both scores range from 1 to 5.</p>
<h2>Editorial Independence</h2><p>Funded through affiliate commissions and advertising — but our scores and recommendations are never influenced by commercial relationships. See our <a href="/disclosure">Affiliate Disclosure</a>.</p>
</main>`;

  // Default fallback for all other static pages
  return `<main style="font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem">
<h1>TheSynLab — Independent Tech Reviews</h1>
<p>${escapeHtml(HOME_DESCRIPTION)}</p>
<ul><li><a href="/hub/ai-tools">AI &amp; SaaS Tools Hub</a></li><li><a href="/blog">Tech Blog &amp; Reviews</a></li><li><a href="/tools/compare">Compare Tools</a></li><li><a href="/about">About TheSynLab</a></li></ul>
</main>`;
};

const generateStaticHtmlPages = async (distDir: string) => {
  const indexPath = path.resolve(distDir, "index.html");
  const indexHtml = await fs.readFile(indexPath, "utf8");
  const pages = buildStaticPagesMeta();

  for (const page of pages) {
    const canonical = `${SITE_URL}${page.route === "/" ? "/" : page.route}`;
    const jsonLd = JSON.stringify(page.jsonLd).replaceAll("</script>", "<\\/script>");
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
    html = upsertTag(
      html,
      /<meta\s+name=["']twitter:title["'][^>]*>/i,
      `<meta name="twitter:title" content="${escapeHtml(page.title)}">`
    );
    html = upsertTag(
      html,
      /<meta\s+name=["']twitter:description["'][^>]*>/i,
      `<meta name="twitter:description" content="${escapeHtml(page.description)}">`
    );
    if (/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
      html = html.replace(
        /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i,
        `<script type="application/ld+json">${jsonLd}</script>`
      );
    } else {
      html = html.replace("</head>", `    <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
    }

    // Inject pre-rendered body so crawlers see real content (not empty <div id="root">)
    const staticBody = buildStaticBodyHtml(page.route);
    html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">\n${staticBody}\n</div>`);

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
