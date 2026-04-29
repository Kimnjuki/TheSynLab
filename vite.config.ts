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

// Routes that get pre-rendered HTML + appear in sitemap
const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclosure",
  "/blog",
  "/products",
  "/tools",
  "/tools/compare",
  "/tools/compatibility",
  "/tools/roi-calculator",
  "/tools/stack-builder",
  "/tools/budget-calculator",
  "/scoring-hub",
  "/hub/ai-tools",
  "/hubs",
  "/hubs/intelligent-home",
  "/hubs/hybrid-office",
  "/hubs/ai-workflow",
  // spec v2.0 canonical routes
  "/compare",
  "/stack-builder",
  "/decision-studio",
  "/workflows",
  "/alternatives",
];

// Pages with no server-renderable content — tell Google not to index until real content exists
const NOINDEX_ROUTES = new Set([
  "/forum",
  "/community/setups",
  "/community/leaderboard",
  "/products/watchlist",
  "/search",
  "/tasks",
  "/tools/find",
  "/tools/hub-builder",
  "/tools/compatibility-leaderboard",
  "/tools/automations",
  "/admin",
  "/profile",
  "/settings",
  "/auth",
]);

const dynamicRoutes = [
  ...blogArticles.map((article) => `/blog/${article.slug}`),
  ...saasTools.flatMap((tool) => [`/tool/${tool.slug}`, `/tool/${tool.slug}/alternatives`]),
  ...Object.keys(BEST_OF_LISTS).map((useCase) => `/best/${useCase}`),
  ...Object.keys(TOOL_CATEGORIES).map((category) => `/hub/ai-tools/${category}`),
];

const prerenderRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));

const buildSitemapXml = () => {
  // Exclude noindex routes from sitemap
  const sitemapRoutes = prerenderRoutes.filter((r) => !NOINDEX_ROUTES.has(r));

  const urls = sitemapRoutes
    .map((route) => {
      const loc = `${SITE_URL}${route}`;
      const priority =
        route === "/" ? "1.0" :
        route.startsWith("/blog/") || route.startsWith("/tool/") ? "0.8" :
        route.startsWith("/hub/ai-tools/") || route.startsWith("/best/") ? "0.8" :
        "0.7";
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

const upsertTag = (html: string, pattern: RegExp, replacement: string) =>
  (pattern.test(html) ? html.replace(pattern, replacement) : html);

const breadcrumbSchema = (items: { name: string; item?: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    ...(crumb.item ? { item: crumb.item } : {}),
  })),
});

const staticMetaByRoute: Record<string, { title: string; description: string }> = {
  "/": { title: HOME_TITLE, description: HOME_DESCRIPTION },
  "/blog": {
    title: "Tech Blog & Reviews | TheSynLab",
    description: "Latest smart home, productivity, and AI tool deep dives from TheSynLab editors.",
  },
  "/products": {
    title: "Products Hub | TheSynLab",
    description: "Explore reviewed products with Trust Scores and Integration Scores. Smart home, AI tools, SaaS platforms.",
  },
  "/tools": {
    title: "Tools Hub | TheSynLab",
    description: "Interactive tools for stack building, comparison, compatibility, budget, and ROI analysis.",
  },
  "/tools/compare": {
    title: "Compare Tech Products Side-by-Side | TheSynLab",
    description: "Compare any two or more products on trust score, integration score, TCO, and ecosystem fit.",
  },
  "/compare": {
    title: "Compare Tech Products Side-by-Side | TheSynLab",
    description: "Compare any two or more products on trust score, integration score, TCO, and ecosystem fit.",
  },
  "/tools/stack-builder": {
    title: "Tech Stack Builder | TheSynLab",
    description: "Build your ideal tech stack, check compatibility scores, and get AI-generated integration notes.",
  },
  "/stack-builder": {
    title: "Tech Stack Builder | TheSynLab",
    description: "Build your ideal tech stack, check compatibility scores, and get AI-generated integration notes.",
  },
  "/tools/roi-calculator": {
    title: "Software ROI Calculator | TheSynLab",
    description: "Calculate the exact return on investment of any tool, including hidden onboarding and migration costs.",
  },
  "/scoring-hub": {
    title: "Scoring & Decision Hub | TheSynLab",
    description: "Transparent scoring methodology, ecosystem fit analysis, curated stacks, and personalized recommendations.",
  },
  "/hubs": {
    title: "Product Hubs – AI Tools, Smart Home, SaaS & More | TheSynLab",
    description: "Browse all TheSynLab product hubs. Every hub scored for trust, integration depth, TCO, and vendor risk.",
  },
  "/decision-studio": {
    title: "Decision Studio – SaaS Decision Tool & Software ROI Calculator | TheSynLab",
    description: "Interactive decision lab: ROI calculator, 3-year TCO analysis, vendor risk scoring, what-if simulations, and migration planning.",
  },
  "/workflows": {
    title: "Workflow Automation Templates & No-Code Recipes | TheSynLab",
    description: "Curated no-code automation recipes and workflow templates for sales, devops, content, e-commerce, and more.",
  },
  "/alternatives": {
    title: "Best Software Alternatives — Find Better Tools | TheSynLab",
    description: "Discover the best alternatives to popular SaaS tools. Every alternative scored for integration depth, TCO, vendor risk, and trust.",
  },
  "/forum": {
    title: "Community Forum | TheSynLab",
    description: "Join the TheSynLab community to discuss setups, tools, and workflows.",
  },
};

type StaticPageMeta = {
  route: string;
  title: string;
  description: string;
  jsonLd: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

const buildStaticPagesMeta = (): StaticPageMeta[] => {
  const pages: StaticPageMeta[] = [];

  // Static pages
  for (const route of [...staticRoutes, ...Array.from(NOINDEX_ROUTES)]) {
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
      noindex: NOINDEX_ROUTES.has(route),
    });
  }

  // Blog articles — Article schema + BreadcrumbList + FAQPage + HowTo
  for (const article of blogArticles) {
    const route = `/blog/${article.slug}`;
    const faqs = extractFaqFromMd(article.content, article.title);
    const howToSteps = extractHowToSteps(article.content);
    const articleSchemas: any[] = [
      {
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
        publisher: {
          "@type": "Organization",
          name: "TheSynLab",
          url: SITE_URL,
        },
      },
      breadcrumbSchema([
        { name: "TheSynLab", item: `${SITE_URL}/` },
        { name: "Blog", item: `${SITE_URL}/blog` },
        { name: article.title },
      ]),
    ];

    // Add FAQPage schema for AI Overview optimization (Google loves this)
    if (faqs.length >= 1) {
      articleSchemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.slice(0, 5).map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    // Add HowTo schema for step-by-step content
    if (howToSteps.length >= 2) {
      articleSchemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: article.title,
        description: article.excerpt || article.metaDescription,
        step: howToSteps.slice(0, 6).map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.name,
          text: step.text,
        })),
      });
    }

    pages.push({
      route,
      title: article.seoTitle || `${article.title} | TheSynLab`,
      description: article.metaDescription || article.excerpt || article.title,
      jsonLd: articleSchemas,
    });
  }

  // SaaS tool review pages — SoftwareApplication + BreadcrumbList
  for (const tool of saasTools) {
    const toolRoute = `/tool/${tool.slug}`;
    pages.push({
      route: toolRoute,
      title: `${tool.name} Review ${new Date().getFullYear()} — Trust Score & Integration | TheSynLab`,
      description: tool.shortDescription || tool.tagline || HOME_DESCRIPTION,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: tool.name,
          description: tool.shortDescription || tool.tagline || HOME_DESCRIPTION,
          applicationCategory: tool.category,
          url: `${SITE_URL}${toolRoute}`,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: tool.trustScore,
            bestRating: "5",
            worstRating: "1",
            ratingCount: "1",
          },
        },
        breadcrumbSchema([
          { name: "TheSynLab", item: `${SITE_URL}/` },
          { name: "AI Tools", item: `${SITE_URL}/hub/ai-tools` },
          { name: tool.name },
        ]),
      ],
    });

    // Alternatives page — CollectionPage + BreadcrumbList
    const altRoute = `/tool/${tool.slug}/alternatives`;
    pages.push({
      route: altRoute,
      title: `Best ${tool.name} Alternatives ${new Date().getFullYear()} | TheSynLab`,
      description: `Best alternatives to ${tool.name} with side-by-side trust score, integration score, and TCO analysis.`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Best ${tool.name} Alternatives`,
          description: `Best alternatives to ${tool.name} with side-by-side trust score, integration score, and TCO analysis.`,
          url: `${SITE_URL}${altRoute}`,
        },
        breadcrumbSchema([
          { name: "TheSynLab", item: `${SITE_URL}/` },
          { name: "AI Tools", item: `${SITE_URL}/hub/ai-tools` },
          { name: tool.name, item: `${SITE_URL}/tool/${tool.slug}` },
          { name: `${tool.name} Alternatives` },
        ]),
      ],
    });
  }

  // AI Tools category hub pages — CollectionPage + BreadcrumbList
  for (const [category, details] of Object.entries(TOOL_CATEGORIES)) {
    const catRoute = `/hub/ai-tools/${category}`;
    pages.push({
      route: catRoute,
      title: `Best ${details.name} Tools ${new Date().getFullYear()} | TheSynLab`,
      description: details.description || HOME_DESCRIPTION,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Best ${details.name} Tools`,
          description: details.description || HOME_DESCRIPTION,
          url: `${SITE_URL}${catRoute}`,
        },
        breadcrumbSchema([
          { name: "TheSynLab", item: `${SITE_URL}/` },
          { name: "AI Tools", item: `${SITE_URL}/hub/ai-tools` },
          { name: details.name },
        ]),
      ],
    });
  }

  // Best-of list pages — ItemList + BreadcrumbList
  for (const [useCase, details] of Object.entries(BEST_OF_LISTS)) {
    const bestRoute = `/best/${useCase}`;
    pages.push({
      route: bestRoute,
      title: `${details.title} | TheSynLab`,
      description: details.description || HOME_DESCRIPTION,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: details.title,
          description: details.description || HOME_DESCRIPTION,
          url: `${SITE_URL}${bestRoute}`,
          numberOfItems: details.toolSlugs?.length ?? 0,
          itemListElement: (details.toolSlugs ?? []).map((slug, i) => {
            const t = saasTools.find((s) => s.slug === slug);
            return {
              "@type": "ListItem",
              position: i + 1,
              name: t?.name ?? slug,
              url: `${SITE_URL}/tool/${slug}`,
            };
          }),
        },
        breadcrumbSchema([
          { name: "TheSynLab", item: `${SITE_URL}/` },
          { name: "AI Tools", item: `${SITE_URL}/hub/ai-tools` },
          { name: details.title },
        ]),
      ],
    });
  }

  return Array.from(new Map(pages.map((page) => [page.route, page])).values());
};

/** Extract FAQ items from markdown content (for Schema.org FAQPage) */
const extractFaqFromMd = (md: string, title: string): { question: string; answer: string }[] => {
  const faqs: { question: string; answer: string }[] = [];
  const lines = md.split("\n");

  // Strategy 1: Match heading-style questions ("## What is X?")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const headingQ = line.match(/^#{2,3}\s+(.+\?)\s*$/);
    if (headingQ) {
      const question = headingQ[1].replace(/\*\*/g, "").trim();
      const answerParts: string[] = [];
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const next = lines[j].trim();
        if (!next || next.startsWith("#") || next.match(/^[-*+]\s/)) break;
        answerParts.push(next.replace(/\*\*/g, "").replace(/`(.+?)`/g, "$1"));
      }
      if (answerParts.length >= 1) {
        faqs.push({ question, answer: answerParts.slice(0, 3).join(" ") });
      }
    }
  }

  // Strategy 2: For comparison articles, create synthetic FAQ from title
  if (title.match(/\b(vs|versus|or)\b/i) || title.match(/^which/i)) {
    const vsParts = title.replace(/\?/g, "").split(/\b(vs|versus)\b/i);
    if (vsParts.length >= 3) {
      const a = vsParts[0].trim();
      const b = vsParts.slice(2).join(" ").trim().replace(/:.*$/, "").trim();
      if (a && b) {
        faqs.push({
          question: `Which is better: ${a} or ${b}?`,
          answer: `Our in-depth comparison evaluates ${a} and ${b} using Trust Scores and real-world testing.`
        });
        faqs.push({
          question: `What are the key differences between ${a} and ${b}?`,
          answer: `We break down the differences in scoring, features, pricing, and performance.`
        });
      }
    }
  }

  return faqs;
};

/** Extract headings for Table of Contents */
const extractTocFromMd = (md: string): { level: number; text: string; id: string }[] => {
  const toc: { level: number; text: string; id: string }[] = [];
  for (const line of md.split("\n")) {
    const h = line.trim().match(/^(##|###)\s+(.*)/);
    if (h) {
      const text = h[2].replace(/\*\*/g, "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      toc.push({ level: h[1].length, text, id });
    }
  }
  return toc;
};

/** Extract first meaningful paragraph as a quick-answer summary */
const extractQuickAnswer = (md: string): string => {
  for (const line of md.split("\n")) {
    const trimmed = line.trim();
    // Skip headings, empty lines, lists
    if (!trimmed || trimmed.startsWith("#") || trimmed.startsWith("-") || trimmed.startsWith("*")) continue;
    // First paragraph that looks like a real sentence
    if (trimmed.length > 50 && trimmed.includes(" ")) {
      return trimmed.replace(/\*\*/g, "").replace(/`(.+?)`/g, "$1").slice(0, 300);
    }
  }
  return "";
};

/** Check for HowTo steps ("Step N:" pattern) */
const extractHowToSteps = (md: string): { name: string; text: string }[] => {
  const steps: { name: string; text: string }[] = [];
  const lines = md.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const stepMatch = lines[i].trim().match(/^###?\s*Step\s+(\d+)[:\-]?\s+(.*)/i);
    if (stepMatch) {
      const name = `Step ${stepMatch[1]}: ${stepMatch[2].replace(/\*\*/g, "").trim()}`;
      // Collect description from next few lines
      const descParts: string[] = [];
      for (let j = i + 1; j < Math.min(i + 8, lines.length); j++) {
        const next = lines[j].trim();
        if (!next || next.startsWith("#") || next.match(/^Step\s+\d+/i)) break;
        descParts.push(next.replace(/\*\*/g, "").replace(/`(.+?)`/g, "$1"));
      }
      steps.push({ name, text: descParts.slice(0, 3).join(" ") });
    }
  }
  return steps;
};

const mdToHtml = (md: string, maxChars = 8000): string => {
  const limited = md.slice(0, maxChars);
  const lines: string[] = [];
  let inList = false;

  for (const raw of limited.split("\n")) {
    const line = raw.trim();
    if (!line) {
      if (inList) { lines.push("</ul>"); inList = false; }
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) {
      if (inList) { lines.push("</ul>"); inList = false; }
      const level = Math.min(h[1].length + 1, 4);
      const text = h[2];
      const id = escapeHtml(text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
      lines.push(`<h${level} id="${id}">${escapeHtml(text)}</h${level}>`);
      continue;
    }
    const li = line.match(/^[-*+]\s+(.*)/);
    if (li) {
      if (!inList) { lines.push("<ul>"); inList = true; }
      lines.push(`<li>${escapeHtml(li[1])}</li>`);
      continue;
    }
    if (inList) { lines.push("</ul>"); inList = false; }
    lines.push(`<p>${escapeHtml(line.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/`(.+?)`/g, "$1"))}</p>`);
  }
  if (inList) lines.push("</ul>");
  return lines.join("\n");
};

const buildStaticBodyHtml = (route: string): string => {
  const year = new Date().getFullYear();
  const li = (items: string[]) => items.map((i) => `<li>${escapeHtml(i)}</li>`).join("");
  const NAV_STYLE = `font-size:.85rem;margin-bottom:1rem`;
  const MAIN_STYLE = `font-family:system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem`;

  // ── Blog listing ─────────────────────────────────────────────────────────
  if (route === "/blog") {
    const articleLinks = blogArticles
      .slice()
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map((a) =>
        `<li style="margin-bottom:.75rem"><a href="/blog/${a.slug}"><b>${escapeHtml(a.title)}</b></a> ` +
        `<span style="color:#666;font-size:.85rem">— ${escapeHtml(a.excerpt.slice(0, 120))}…</span></li>`
      )
      .join("");
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Blog</nav>
<h1>Tech Blog &amp; Reviews</h1>
<p>In-depth reviews, comparisons, and workflow guides for SaaS tools, AI products, smart home devices, and productivity software — all independently scored.</p>
<ul style="list-style:none;padding:0">${articleLinks}</ul>
</main>`;
  }

  // ── Products hub ─────────────────────────────────────────────────────────
  if (route === "/products") {
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Products</nav>
<h1>Products Hub — Trust Scored &amp; Integration Rated</h1>
<p>Browse hundreds of reviewed products with our proprietary Trust Score and Integration Score. Covering smart home devices, SaaS platforms, AI tools, and developer infrastructure.</p>
<h2>Browse by Hub</h2>
<ul>
<li><a href="/hub/ai-tools"><b>AI &amp; SaaS Tools</b></a> — 300+ tools scored for reliability, integrations, and TCO</li>
<li><a href="/hub/ai_workflow"><b>AI Workflow</b></a> — Automation platforms, LLMs, no-code builders</li>
<li><a href="/hub/intelligent_home"><b>Intelligent Home</b></a> — Smart home hubs, voice assistants, sensors</li>
<li><a href="/hub/hybrid_office"><b>Hybrid Office</b></a> — Collaboration, video conferencing, remote-work tools</li>
</ul>
<p><a href="/tools/compare">Compare products side-by-side →</a> &nbsp;·&nbsp; <a href="/stack-builder">Build your stack →</a></p>
</main>`;
  }

  // ── Tools hub ────────────────────────────────────────────────────────────
  if (route === "/tools") {
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Tools</nav>
<h1>Decision Tools</h1>
<p>Free interactive tools to help you compare, budget, and build your tech stack with confidence.</p>
<ul>
<li><a href="/compare"><b>Compare Tools</b></a> — Side-by-side comparison with trust, integration, and TCO scores</li>
<li><a href="/stack-builder"><b>Stack Builder</b></a> — Assemble your ideal stack and get compatibility analysis</li>
<li><a href="/decision-studio"><b>Decision Studio</b></a> — ROI calculator, 3-year TCO modeler, vendor risk scoring</li>
<li><a href="/tools/roi-calculator"><b>ROI Calculator</b></a> — Model exact return-on-investment including hidden costs</li>
<li><a href="/tools/budget-calculator"><b>Budget Calculator</b></a> — Total cost of ownership across competing products</li>
<li><a href="/tools/compatibility"><b>Compatibility Checker</b></a> — Check integration compatibility between tools</li>
</ul>
</main>`;
  }

  // ── Compare (canonical alias) ─────────────────────────────────────────────
  if (route === "/compare") {
    const topTools = saasTools.slice(0, 12);
    const toolLinks = topTools.map((t) =>
      `<li><a href="/tool/${t.slug}">${escapeHtml(t.name)}</a> (Trust ${t.trustScore}/5, Integration ${t.integrationScore}/5)</li>`
    ).join("");
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Compare</nav>
<h1>Compare Tech Products Side-by-Side</h1>
<p>Select any two to four products to compare trust score, integration depth, 3-year TCO, vendor risk, and ecosystem compatibility — all on one page.</p>
<h2>Popular Comparisons</h2>
<ul>${toolLinks}</ul>
<p>Use the comparison bar: click <b>+ Compare</b> on any product card, then hit <b>Compare Now</b>.</p>
</main>`;
  }

  // ── Stack Builder (canonical alias) ──────────────────────────────────────
  if (route === "/stack-builder" || route === "/tools/stack-builder") {
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Stack Builder</nav>
<h1>Tech Stack Builder</h1>
<p>Assemble your ideal tech stack and instantly get: ecosystem compatibility scores, 3-year TCO delta vs your current tools, AI-generated integration notes, and a printable stack summary.</p>
<h2>How It Works</h2>
<ul>
<li>Search and add tools to your stack canvas</li>
<li>See real-time compatibility scores between selected tools</li>
<li>Get AI-generated warnings about integration gaps</li>
<li>Export your stack as a shareable summary or migration roadmap</li>
</ul>
<p><a href="/decision-studio">Decision Studio →</a> for ROI and TCO analysis alongside stack building.</p>
</main>`;
  }

  // ── Hubs index ───────────────────────────────────────────────────────────
  if (route === "/hubs") {
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Hubs</nav>
<h1>Product Hubs — Scored by Category</h1>
<p>Every TheSynLab hub includes trust scores, integration grades, 3-year TCO analysis, and vendor risk profiles across its entire product catalog.</p>
<ul>
<li><a href="/hub/ai-tools"><b>AI Tools Hub</b></a> — 300+ AI writing, coding, video, and automation tools independently reviewed</li>
<li><a href="/hub/ai_workflow"><b>AI &amp; Workflow</b></a> — Automation platforms, LLMs, no-code builders, and workflow orchestrators</li>
<li><a href="/hub/intelligent_home"><b>Intelligent Home</b></a> — Smart home hubs, voice assistants, sensors, and IoT platforms</li>
<li><a href="/hub/hybrid_office"><b>Hybrid Office</b></a> — Collaboration, video conferencing, and remote-work essentials</li>
<li><a href="/products"><b>SaaS &amp; Developer Tools</b></a> — Full product directory: CRMs, databases, infrastructure, and developer tooling</li>
</ul>
</main>`;
  }

  // ── Decision Studio ───────────────────────────────────────────────────────
  if (route === "/decision-studio") {
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Decision Studio</nav>
<h1>Decision Studio — SaaS Decision Tool &amp; Software ROI Calculator</h1>
<p>The interactive decision lab for software buyers. Model ROI, compare 3-year TCO, simulate stack changes, evaluate vendor risk, and plan migrations — all in one place.</p>
<h2>Studio Tools</h2>
<ul>
<li><a href="/tools/roi-calculator"><b>ROI Calculator</b></a> — Model exact return-on-investment including onboarding, migration, and training costs</li>
<li><a href="/tools/budget-calculator"><b>3-Year TCO Analysis</b></a> — Compare true total cost of ownership including hidden costs and API overages</li>
<li><a href="/scoring-hub"><b>Vendor Risk Scoring</b></a> — Evaluate lock-in risk, data portability, SLA reliability, and compliance coverage</li>
<li><a href="/stack-builder"><b>Stack Builder</b></a> — Assemble your ideal stack with compatibility scoring and AI-generated integration notes</li>
<li><b>What-If Simulations</b> — Swap a tool in your stack and instantly see how it changes cost and risk profiles</li>
<li><b>Migration Roadmap</b> — AI-assisted migration planning with dependency mapping and timeline estimates</li>
</ul>
<p>Targets: software ROI calculator, SaaS decision tool, tech stack comparison, total cost of ownership software</p>
</main>`;
  }

  // ── Workflows index ───────────────────────────────────────────────────────
  if (route === "/workflows") {
    const recipes = [
      { title: "Automated Lead Enrichment & CRM Sync", tools: "HubSpot, Clearbit, Slack, OpenAI", useCase: "Sales & CRM" },
      { title: "AI Content Publishing Pipeline", tools: "Notion, OpenAI, WordPress, Buffer", useCase: "Content Marketing" },
      { title: "Incident → Alert → Runbook Automation", tools: "PagerDuty, Confluence, Slack, Jira", useCase: "DevOps & SRE" },
      { title: "E-Commerce Order to Fulfilment", tools: "Shopify, Airtable, ShipStation, Postmark", useCase: "E-Commerce" },
      { title: "Weekly Analytics Report Bot", tools: "Google Analytics, Stripe, Claude, Slack", useCase: "Analytics" },
      { title: "AI Customer Support Triage", tools: "Intercom, OpenAI, Zendesk", useCase: "Customer Support" },
    ];
    const recipeItems = recipes.map((r) =>
      `<li><b>${escapeHtml(r.title)}</b> <span style="color:#666">(${escapeHtml(r.useCase)})</span> — Tools: ${escapeHtml(r.tools)}</li>`
    ).join("");
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Workflows</nav>
<h1>Workflow Automation Templates &amp; No-Code Recipes</h1>
<p>Curated, tool-scored integration playbooks. Each recipe links to integration-rated products so you pick the right stack, not just any stack. Covering sales, devops, content, e-commerce, analytics, and customer support.</p>
<ul>${recipeItems}</ul>
<p>All recipes are filterable by use-case, difficulty, and integrated tools. <a href="/hubs/ai-workflow">Open AI Workflow Hub →</a> to build custom automation pipelines.</p>
</main>`;
  }

  // ── Alternatives index ────────────────────────────────────────────────────
  if (route === "/alternatives") {
    const topTools = saasTools
      .filter((t) => t.alternativeSlugs.length > 0)
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 30);
    const toolLinks = topTools.map((t) =>
      `<li><a href="/tool/${t.slug}/alternatives"><b>Best alternatives to ${escapeHtml(t.name)}</b></a> ` +
      `(${t.alternativeSlugs.length} alternatives, Trust ${t.trustScore}/5)</li>`
    ).join("");
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Alternatives</nav>
<h1>Best Software Alternatives — Find Better Tools</h1>
<p>Every alternative scored for integration grade, 3-year TCO, vendor risk, and real user trust — not just star ratings. Browse by tool or by category.</p>
<ul style="list-style:none;padding:0">${toolLinks}</ul>
<p><a href="/hub/ai-tools">Browse all AI Tools →</a> &nbsp;·&nbsp; <a href="/compare">Compare tools side-by-side →</a></p>
</main>`;
  }

  // ── Scoring Hub ───────────────────────────────────────────────────────────
  if (route === "/scoring-hub") {
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Scoring Hub</nav>
<h1>Scoring &amp; Decision Hub</h1>
<p>Transparent methodology, ecosystem fit analysis, curated stacks, and personalized recommendations powered by TheSynLab Trust &amp; Integration Scores.</p>
<h2>What We Score</h2>
<ul>
<li><b>Trust Score (0–100)</b> — Reliability, privacy practices, transparency, SLA track record, security posture</li>
<li><b>Integration Score (0–100)</b> — Native integrations, API quality, middleware support, webhook support, ecosystem breadth</li>
<li><b>TCO Score</b> — 3-year total cost including seat pricing, overages, migration, and lock-in risk</li>
<li><b>Vendor Risk Profile</b> — Lock-in risk, data portability, GDPR readiness, financial stability</li>
</ul>
<h2>Decision Tools</h2>
<ul>
<li><a href="/decision-studio">Decision Studio</a> — ROI calculator, TCO modeler, what-if simulations</li>
<li><a href="/stack-builder">Stack Builder</a> — Compatibility scoring and integration gap analysis</li>
<li><a href="/compare">Compare Tools</a> — Side-by-side comparison on all score dimensions</li>
</ul>
</main>`;
  }

  // ── Legal & company pages ─────────────────────────────────────────────────
  if (route === "/privacy") return `<main style="${MAIN_STYLE}">
<h1>Privacy Policy</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab is committed to protecting your privacy and being transparent about how we collect, use, and share your information.</p>
<h2>Information We Collect</h2><p>We collect information you provide (email, profile info, reviews) and automatically collected usage data (IP address, browser type, pages visited).</p>
<h2>Google AdSense &amp; Cookies</h2><p>We use Google AdSense for advertisements. Non-essential cookies (analytics, advertising, preferences) are only activated after you give explicit consent via our Cookie Consent Manager. You may opt out of personalised advertising via Google Ads Settings.</p>
<h2>How We Use Your Information</h2><p>To provide our services, send newsletters (with consent), analyse usage patterns, and improve your experience. We do not sell your personal data to third parties.</p>
<h2>Your Rights (GDPR &amp; CCPA)</h2><p>EEA/UK residents may request access, rectification, erasure, or portability of their data. California residents have rights under CCPA. Contact: privacy@thesynlab.com</p>
<h2>Contact</h2><p>Email: privacy@thesynlab.com</p>
</main>`;

  if (route === "/terms") return `<main style="${MAIN_STYLE}">
<h1>Terms of Service</h1><p>Last Updated: January 12, 2026</p>
<p>By accessing or using TheSynLab you agree to be bound by these Terms of Service.</p>
<h2>User Responsibilities</h2><p>You are responsible for maintaining the confidentiality of your account credentials and ensuring your use complies with applicable laws.</p>
<h2>Intellectual Property</h2><p>Our reviews, Trust Scores, Integration Scores, and methodologies are owned by TheSynLab and protected by copyright law.</p>
<h2>Affiliate Links &amp; Advertising</h2><p>TheSynLab participates in affiliate programs and may earn commissions on purchases at no additional cost to you. This does not affect our editorial independence.</p>
<h2>Contact</h2><p>Email: legal@thesynlab.com</p>
</main>`;

  if (route === "/disclosure") return `<main style="${MAIN_STYLE}">
<h1>Affiliate Disclosure</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab participates in affiliate marketing programs. When you click product links on our site and make a purchase, we may earn a commission at no additional cost to you.</p>
<h2>Our Editorial Independence</h2><p>Affiliate relationships do not influence our reviews, Trust Scores, or recommendations. All products are evaluated independently.</p>
<h2>FTC Compliance</h2><p>Per FTC 16 CFR Part 255, we disclose that we may receive compensation for links on this website.</p>
<h2>Contact</h2><p>Email: affiliates@thesynlab.com</p>
</main>`;

  if (route === "/about") return `<main style="${MAIN_STYLE}">
<h1>About TheSynLab</h1>
<p>TheSynLab is an independent technology review platform evaluating SaaS tools, smart home devices, and productivity software using our proprietary Trust Score and Integration Score methodology.</p>
<h2>Our Mission</h2><p>We help professionals and teams make confident technology decisions through honest, data-driven reviews.</p>
<h2>Our Scoring System</h2><p>Every tool receives a <b>Trust Score</b> (reliability, privacy, transparency) and an <b>Integration Score</b> (ecosystem compatibility, API quality). Both range from 0 to 100.</p>
<h2>Editorial Independence</h2><p>Funded through affiliate commissions and advertising — scores and recommendations are never influenced by commercial relationships. See our <a href="/disclosure">Affiliate Disclosure</a>.</p>
</main>`;

  // ── Tool review page ──────────────────────────────────────────────────────
  const toolMatch = route.match(/^\/tool\/([^/]+)$/);
  if (toolMatch) {
    const tool = saasTools.find((t) => t.slug === toolMatch[1]);
    if (tool) {
      const verdict =
        tool.trustScore >= 4.3 ? "Highly Recommended" :
        tool.trustScore >= 4.0 ? "Recommended" :
        tool.trustScore >= 3.7 ? "Good with Caveats" : "Use with Caution";
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools</a> › ${escapeHtml(tool.name)}</nav>
<h1>${escapeHtml(tool.name)} Review (${year})</h1>
<p style="font-size:1.1rem">${escapeHtml(tool.tagline)}</p>
<p>${escapeHtml(tool.shortDescription)}</p>
<section><h2>TheSynLab Verdict</h2><p><b>Trust Score:</b> ${tool.trustScore}/5 &nbsp;·&nbsp; <b>Integration Score:</b> ${tool.integrationScore}/5 &nbsp;·&nbsp; <b>Verdict:</b> ${verdict}</p></section>
<section><h2>Pricing</h2><p>${tool.pricing.hasFree ? "Free plan available. " : ""}Starting at <b>${escapeHtml(tool.pricing.startingPrice)}</b>. ${escapeHtml(tool.pricing.pricingModel)}.</p></section>
<section><h2>Key Features</h2><ul>${li(tool.keyFeatures)}</ul></section>
<section><h2>Best For</h2><ul>${li(tool.bestFor)}</ul></section>
<section><h2>Pros</h2><ul>${li(tool.pros)}</ul></section>
<section><h2>Cons</h2><ul>${li(tool.cons)}</ul></section>
<section><h2>Integrations</h2><p>${escapeHtml(tool.integrations.join(", "))}.</p></section>
<p><a href="/tool/${tool.slug}/alternatives">Best alternatives to ${escapeHtml(tool.name)} →</a></p>
</main>`;
    }
  }

  // ── Tool alternatives page ────────────────────────────────────────────────
  const altMatch = route.match(/^\/tool\/([^/]+)\/alternatives$/);
  if (altMatch) {
    const tool = saasTools.find((t) => t.slug === altMatch[1]);
    if (tool) {
      const alts = saasTools
        .filter((t) => t.category === tool.category && t.slug !== tool.slug)
        .slice(0, 10);
      const altsHtml = alts
        .map((a) =>
          `<li><a href="/tool/${a.slug}"><b>${escapeHtml(a.name)}</b></a> — Trust Score ${a.trustScore}/5 · Integration Score ${a.integrationScore}/5 · ${escapeHtml(a.shortDescription)}</li>`
        )
        .join("");
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools</a> › <a href="/tool/${tool.slug}">${escapeHtml(tool.name)}</a> › Alternatives</nav>
<h1>Best Alternatives to ${escapeHtml(tool.name)} (${year})</h1>
<p>${escapeHtml(tool.shortDescription)}</p>
<p>Independent comparison of the top ${escapeHtml(tool.name)} alternatives, ranked by Trust Score and Integration Score with side-by-side TCO analysis.</p>
<ul>${altsHtml}</ul>
<p><a href="/tool/${tool.slug}">← Back to ${escapeHtml(tool.name)} full review</a></p>
</main>`;
    }
  }

  // ── Blog article page ─────────────────────────────────────────────────────
  const blogMatch = route.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const article = blogArticles.find((a) => a.slug === blogMatch[1]);
    if (article) {
      const bodyHtml = mdToHtml(article.content, 8000);
      const toc = extractTocFromMd(article.content);
      const faqs = extractFaqFromMd(article.content, article.title);
      const quickAnswer = extractQuickAnswer(article.content);
      const howToSteps = extractHowToSteps(article.content);

      // Build Quick Answer box (AI Overview optimized)
      const quickAnswerHtml = quickAnswer
        ? `<div style="background:#f0f7ff;border-left:4px solid #2563eb;padding:1rem;margin-bottom:1.5rem;border-radius:4px">
<p style="margin:0;font-size:.95rem"><b>⚡ Quick Answer:</b> ${escapeHtml(quickAnswer)}</p>
</div>`
        : "";

      // Build Table of Contents (helps AI crawlers understand structure)
      const tocHtml = toc.length > 3
        ? `<nav style="background:#f9fafb;border:1px solid #e5e7eb;padding:1rem;margin-bottom:1.5rem;border-radius:4px">
<p style="margin:0 0 .5rem 0;font-weight:bold">📋 Table of Contents</p>
<ol style="margin:0;padding-left:1.25rem">${toc.filter(t => t.level <= 3).map(t =>
          `<li style="margin-bottom:.25rem"><a href="#${t.id}">${escapeHtml(t.text)}</a></li>`
        ).join("")}</ol>
</nav>`
        : "";

      // Build FAQ section (prerendered for AI crawlers)
      const faqHtml = faqs.length >= 1
        ? `<div style="background:#faf5ff;border:1px solid #e9d5ff;padding:1rem;margin:1.5rem 0;border-radius:4px">
<h2 style="margin:0 0 .75rem 0;font-size:1.1rem">❓ Frequently Asked Questions</h2>
${faqs.slice(0, 5).map(faq =>
          `<div style="margin-bottom:.75rem;padding-bottom:.75rem;border-bottom:1px solid #e9d5ff">
<p style="margin:0 0 .25rem 0;font-weight:bold">${escapeHtml(faq.question)}</p>
<p style="margin:0;color:#555">${escapeHtml(faq.answer)}</p>
</div>`
        ).join("")}</div>`
        : "";

      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/blog">Blog</a> › ${escapeHtml(article.title)}</nav>
<h1>${escapeHtml(article.title)}</h1>
<p style="color:#666;font-size:.875rem">By ${escapeHtml(article.author)} · ${article.publishedAt} · ${article.readingTime} min read</p>
<p><b>${escapeHtml(article.excerpt)}</b></p>
${quickAnswerHtml}
${tocHtml}
${bodyHtml}
${faqHtml}
</main>`;
    }
  }

  // ── AI Tools category hub ─────────────────────────────────────────────────
  const categoryMatch = route.match(/^\/hub\/ai-tools\/([^/]+)$/);
  if (categoryMatch) {
    const cat = (TOOL_CATEGORIES as Record<string, { name: string; description?: string }>)[categoryMatch[1]];
    if (cat) {
      const tools = saasTools.filter((t) => t.category === categoryMatch[1]);
      const toolsHtml = tools
        .sort((a, b) => b.trustScore - a.trustScore)
        .map((t) =>
          `<li><a href="/tool/${t.slug}"><b>${escapeHtml(t.name)}</b></a> — Trust ${t.trustScore}/5 · Integration ${t.integrationScore}/5 · ${escapeHtml(t.shortDescription)}</li>`
        )
        .join("");
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools Hub</a> › ${escapeHtml(cat.name)}</nav>
<h1>Best ${escapeHtml(cat.name)} Tools (${year})</h1>
<p>${escapeHtml(cat.description || "")}</p>
<ul>${toolsHtml}</ul>
</main>`;
    }
  }

  // ── Best-of list page ─────────────────────────────────────────────────────
  const bestMatch = route.match(/^\/best\/([^/]+)$/);
  if (bestMatch) {
    const best = (BEST_OF_LISTS as Record<string, { title: string; description?: string; toolSlugs?: string[] }>)[bestMatch[1]];
    if (best) {
      const tools = (best.toolSlugs ?? []).map((slug) => saasTools.find((t) => t.slug === slug)).filter(Boolean) as typeof saasTools;
      const toolsHtml = tools.map((t) =>
        `<li><a href="/tool/${t.slug}"><b>${escapeHtml(t.name)}</b></a> — Trust ${t.trustScore}/5 · ${escapeHtml(t.shortDescription)}</li>`
      ).join("");
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools Hub</a></nav>
<h1>${escapeHtml(best.title)}</h1>
<p>${escapeHtml(best.description || "")}</p>
<ul>${toolsHtml}</ul>
</main>`;
    }
  }

  // ── Default fallback ──────────────────────────────────────────────────────
  return `<main style="${MAIN_STYLE}">
<h1>TheSynLab — Independent Tech Reviews</h1>
<p>${escapeHtml(HOME_DESCRIPTION)}</p>
<ul>
<li><a href="/hub/ai-tools">AI &amp; SaaS Tools Hub</a></li>
<li><a href="/blog">Tech Blog &amp; Reviews</a></li>
<li><a href="/compare">Compare Tools</a></li>
<li><a href="/decision-studio">Decision Studio</a></li>
<li><a href="/workflows">Workflow Templates</a></li>
<li><a href="/about">About TheSynLab</a></li>
</ul>
</main>`;
};

const generateStaticHtmlPages = async (distDir: string) => {
  const indexPath = path.resolve(distDir, "index.html");
  const indexHtml = await fs.readFile(indexPath, "utf8");
  const pages = buildStaticPagesMeta();

  for (const page of pages) {
    const canonical = `${SITE_URL}${page.route === "/" ? "/" : page.route}`;

    // Build JSON-LD script block(s) — supports single object or array
    const jsonLdBlocks = Array.isArray(page.jsonLd) ? page.jsonLd : [page.jsonLd];
    const jsonLdScripts = jsonLdBlocks
      .map(
        (schema) =>
          `<script type="application/ld+json">${JSON.stringify(schema).replaceAll("</script>", "<\\/script>")}</script>`
      )
      .join("\n    ");

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

    // Replace existing JSON-LD block(s) or insert before </head>
    if (/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i.test(html)) {
      html = html.replace(
        /<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/i,
        jsonLdScripts
      );
    } else {
      html = html.replace("</head>", `    ${jsonLdScripts}\n  </head>`);
    }

    // Inject noindex for thin/dynamic pages
    if (page.noindex) {
      html = html.replace(
        "</head>",
        `    <meta name="robots" content="noindex,follow">\n  </head>`
      );
    }

    // Inject pre-rendered body so crawlers see real content
    const staticBody = buildStaticBodyHtml(page.route);
    html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">\n${staticBody}\n</div>`);

    const outputPath =
      page.route === "/"
        ? indexPath
        : path.resolve(distDir, page.route.replace(/^\/+/, ""), "index.html");
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
