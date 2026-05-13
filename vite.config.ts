import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs/promises";
import { componentTagger } from "lovable-tagger";
import { blogArticles } from "./src/data/blogArticles";
import { saasTools, BEST_OF_LISTS, TOOL_CATEGORIES } from "./src/data/saasTools";
import { HOMEPAGE_PRERENDER_HTML } from "./src/data/prerenderContent";
import { STATIC_PRODUCTS, HUB_SLUGS, HUB_FAQS } from "./src/data/staticProductData";

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
  "/guides",
  "/glossary",
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
  "/hub/intelligent-home",
  "/hub/hybrid-office",
  "/hub/ai-workflow",
  // spec v2.0 canonical routes
  "/compare",
  "/stack-builder",
  "/decision-studio",
  "/workflows",
  "/alternatives",
  "/stack-quiz",
  "/tools/stack-quiz",
  "/tco-calculator",
  "/tools/tco-calculator",
  "/vendor-risk-checker",
  "/tools/vendor-risk-checker",
  "/workflow-blueprint",
  "/tools/workflow-blueprint",
  "/trust-index",
  "/my-stack",
  "/widgets",
  "/report/state-of-saas-trust-2026",
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

const productRoutes = STATIC_PRODUCTS.map((p) => `/products/${p.productSlug}`);
const productAltRoutes = STATIC_PRODUCTS
  .filter((p) => p.alternativeSlugs.length > 0)
  .map((p) => `/products/${p.productSlug}/alternatives`);
const productCompareRoutes = STATIC_PRODUCTS
  .flatMap((p) => 
    p.alternativeSlugs.slice(0, 3).map((a) => `/products/${p.productSlug}-vs-${a}`)
  );
const hubRoutes = Object.keys(HUB_SLUGS).map((slug) => `/hub/${slug}`);

// MF-04: /vs/ comparison landing pages — all product pairs from same hub + alternatives
const comparePairs: [string, string][] = [
  ["clickup", "todoist"],
  ["clickup", "asana"],
  ["clickup", "notion"],
  ["todoist", "asana"],
  ["todoist", "notion"],
  ["asana", "notion"],
  ["notion", "confluence"],
  ["slack", "discord"],
  ["slack", "teams"],
  ["zapier", "make"],
  ["teams", "discord"],
  ["confluence", "clickup"],
  ["prowritingaid", "grammarly"],
  ["clickup", "zapier"],
  ["clickup", "make"],
  ["todoist", "canva"],
  ["todoist", "github"],
  ["todoist", "grammarly"],
  ["todoist", "confluence"],
  ["todoist", "prowritingaid"],
  ["asana", "canva"],
  ["asana", "github"],
  ["asana", "grammarly"],
  ["asana", "confluence"],
  ["asana", "prowritingaid"],
  ["notion", "canva"],
  ["notion", "github"],
  ["notion", "grammarly"],
  ["notion", "prowritingaid"],
  ["canva", "github"],
  ["canva", "grammarly"],
  ["canva", "confluence"],
  ["canva", "prowritingaid"],
  ["github", "grammarly"],
  ["github", "confluence"],
  ["github", "prowritingaid"],
  ["grammarly", "confluence"],
  ["confluence", "prowritingaid"],
];
const vsRoutes = comparePairs.map(([a, b]) => `/vs/${a}-vs-${b}`);

const dynamicRoutes = [
  ...blogArticles.map((article) => `/blog/${article.slug}`),
  ...saasTools.flatMap((tool) => [`/tool/${tool.slug}`, `/tool/${tool.slug}/alternatives`]),
  ...productRoutes,
  ...productAltRoutes,
  ...productCompareRoutes,
  ...vsRoutes,
  ...hubRoutes,
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
        route.startsWith("/blog/") || route.startsWith("/tool/") || route.startsWith("/products/") || route.startsWith("/vs/") ? "0.8" :
        route.startsWith("/hub/") || route.startsWith("/best/") ? "0.8" :
        route.startsWith("/report/") ? "0.9" :
        "0.7";
      const changefreq = route.startsWith("/blog/") || route.startsWith("/products/") || route.startsWith("/vs/") ? "weekly" : "monthly";
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
  "/guides": {
    title: "How-To Guides & Tutorials | TheSynLab",
    description: "Step-by-step guides and tutorials for SaaS tools, smart home setups, privacy evaluations, and workflow optimization.",
  },
  "/glossary": {
    title: "Tech Glossary & Definitions | TheSynLab",
    description: "Definitions and explanations of SaaS, smart home, privacy, and productivity terms from TheSynLab.",
  },
  "/widgets": {
    title: "Embeddable Scorecard Widgets | TheSynLab",
    description: "Copy and paste Trust Score and Integration Score widgets for any product. Embed independent ratings on your own website.",
  },
  "/report/state-of-saas-trust-2026": {
    title: "2026 State of SaaS Trust & Integrations | TheSynLab Research",
    description: "15+ pages of data — Trust Scores, integration cluster analysis, privacy policy tracker, and actionable vendor risk insights.",
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
  const year = new Date().getFullYear();
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

  // ── Blog / Guides index — ItemList of BlogPosting ──────────────────────
  const addBlogItemList = (pageRoute: string, filterFn?: (a: typeof blogArticles[0]) => boolean) => {
    const index = pages.find(p => p.route === pageRoute);
    if (!index) return;
    const items = [...blogArticles]
      .filter(filterFn ?? (() => true))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    index.jsonLd = [index.jsonLd, {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: items.slice(0, 20).map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: a.title,
        url: `${SITE_URL}/blog/${a.slug}`,
      })),
      numberOfItems: Math.min(items.length, 20),
    }];
  };
  addBlogItemList("/blog");
  addBlogItemList("/guides", a => a.category === "Guides");

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

  // Product detail pages (/products/:slug) from static product data — SoftwareApplication + BreadcrumbList + FAQPage
  for (const product of STATIC_PRODUCTS) {
    const productRoute = `/products/${product.productSlug}`;
    const year = new Date().getFullYear();
    // Map trust score (0-10) to 5-star rating for aggregateRating
    // Map trustScore (0-10) to 1-5 star scale
    const starRating = (Math.round(product.trustScore) / 2).toFixed(1); // e.g. 7.8 -> 3.9
    const schemas: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: product.productName,
        description: product.longDescription,
        applicationCategory: product.category,
        url: `${SITE_URL}${productRoute}`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: product.priceCurrency,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: starRating.toString(),
          bestRating: "5",
          worstRating: "1",
          ratingCount: "10",
        },
      },
      breadcrumbSchema([
        { name: "TheSynLab", item: `${SITE_URL}/` },
        { name: "Products", item: `${SITE_URL}/products` },
        { name: product.productName },
      ]),
    ];

    // MF-02: Inject FAQPage schema from product's faqs array
    if (product.faqs && product.faqs.length >= 1) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: product.faqs.slice(0, 6).map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    pages.push({
      route: productRoute,
      title: `${product.productName} Review ${year} — Trust Score ${product.trustScore}/10, Integrations & TCO | TheSynLab`,
      description: product.longDescription.slice(0, 155) + " Check Trust Score, Integration Score, and TCO analysis from TheSynLab.",
      jsonLd: schemas,
    });

    // Alternatives page — CollectionPage + BreadcrumbList
    if (product.alternativeSlugs.length > 0) {
      const altRoute = `/products/${product.productSlug}/alternatives`;
      pages.push({
        route: altRoute,
        title: `Best ${product.productName} Alternatives ${year} — Trust Scores & TCO | TheSynLab`,
        description: `Best alternatives to ${product.productName} with side-by-side trust score, integration score, and TCO analysis.`,
        jsonLd: [
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Best ${product.productName} Alternatives`,
            description: `Best alternatives to ${product.productName} with side-by-side trust score, integration score, and TCO analysis.`,
            url: `${SITE_URL}${altRoute}`,
          },
          breadcrumbSchema([
            { name: "TheSynLab", item: `${SITE_URL}/` },
            { name: "Products", item: `${SITE_URL}/products` },
            { name: product.productName, item: `${SITE_URL}/products/${product.productSlug}` },
            { name: `${product.productName} Alternatives` },
          ]),
        ],
      });
    }

    // Comparison pages — e.g. /products/slack-vs-teams
    // Generate from first 3 alternatives per product
    const compareTargets = product.alternativeSlugs.slice(0, 3);
    for (const altSlug of compareTargets) {
      const altProduct = STATIC_PRODUCTS.find(p => p.productSlug === altSlug);
      if (altProduct) {
        const compareRoute = `/products/${product.productSlug}-vs-${altSlug}`;
        const compareTitle = `${product.productName} vs ${altProduct.productName} ${year} — Trust Score & TCO Comparison | TheSynLab`;
        pages.push({
          route: compareRoute,
          title: compareTitle,
          description: `${product.productName} vs ${altProduct.productName}: compare Trust Scores, Integration Scores, features, and TCO to find the right tool for your team.`,
          jsonLd: [
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: compareTitle,
              description: `${product.productName} vs ${altProduct.productName}: side-by-side comparison of Trust Score (${product.trustScore}/10 vs ${altProduct.trustScore}/10), Integration Score (${product.integrationScore}/10 vs ${altProduct.integrationScore}/10), features, and TCO.`,
              url: `${SITE_URL}${compareRoute}`,
            },
            breadcrumbSchema([
              { name: "TheSynLab", item: `${SITE_URL}/` },
              { name: "Products", item: `${SITE_URL}/products` },
              { name: `${product.productName} vs ${altProduct.productName}` },
            ]),
          ],
        });
      }

    }
  }
  // ── /vs/ comparison landing pages (MF-04) ────────────────────────────
  // Add /vs/{slug-a}-vs-{slug-b} pages with Article + BreadcrumbList schema
  for (const [slugA, slugB] of comparePairs) {
    const prodA = STATIC_PRODUCTS.find(p => p.productSlug === slugA);
    const prodB = STATIC_PRODUCTS.find(p => p.productSlug === slugB);
    if (!prodA || !prodB) continue;

    const vsRoute = `/vs/${slugA}-vs-${slugB}`;
    const aName = prodA.productName;
    const bName = prodB.productName;
    const vsTitle = `${aName} vs ${bName} (${year}): Trust Score, TCO & Integration Depth Compared | TheSynLab`;
    const verdictA = prodA.bestFor.slice(0, 2).join(" and ");
    const verdictB = prodB.bestFor.slice(0, 2).join(" and ");
    const verdictWinner = prodA.trustScore > prodB.trustScore ? aName : bName;
    const winnerReason = prodA.trustScore > prodB.trustScore ? "trust and privacy" : "integration ecosystem";
    const verdictSentence = `${verdictWinner} is the stronger choice if you prioritize ${winnerReason}.`;

    pages.push({
      route: vsRoute,
      title: vsTitle,
      description: `Independent ${aName} vs ${bName} comparison — Trust Scores (${prodA.trustScore}/10 vs ${prodB.trustScore}/10), 3-year TCO ($${prodA.estimatedTco} vs $${prodB.estimatedTco}/yr), and integration depth side by side. ${verdictSentence}`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${aName} vs ${bName}: Side-by-Side Comparison`,
          description: `Independent comparison of ${aName} and ${bName} with Trust Scores, 3-year TCO, Integration Scores, and feature analysis.`,
          datePublished: "2026-01-01",
          dateModified: `${year}-05-13`,
          author: {
            "@type": "Organization",
            name: "TheSynLab",
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "TheSynLab",
            url: SITE_URL,
          },
          url: `${SITE_URL}${vsRoute}`,
          mainEntityOfPage: `${SITE_URL}${vsRoute}`,
        },
        breadcrumbSchema([
          { name: "TheSynLab", item: `${SITE_URL}/` },
          { name: "Comparisons", item: `${SITE_URL}/compare` },
          { name: `${aName} vs ${bName}` },
        ]),
      ],
    });
  }

  // Hub landing pages — CollectionPage + BreadcrumbList + ItemList + FAQPage
  for (const [hubSlug, hubInfo] of Object.entries(HUB_SLUGS)) {
    const hubRoute = `/hub/${hubSlug}`;
    const hubProducts = STATIC_PRODUCTS.filter((p) => p.hub === hubSlug);
    const schemas: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Best ${hubInfo.name}`,
        description: hubInfo.description,
        url: `${SITE_URL}${hubRoute}`,
      },
      breadcrumbSchema([
        { name: "TheSynLab", item: `${SITE_URL}/` },
        { name: hubInfo.name },
      ]),
    ];

    // MF-03: Inject ItemList schema for ranked products in this hub
    if (hubProducts.length >= 1) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `Best ${hubInfo.name} Tools ${new Date().getFullYear()}`,
        description: hubInfo.description,
        url: `${SITE_URL}${hubRoute}`,
        numberOfItems: hubProducts.length,
        itemListElement: hubProducts
          .sort((a, b) => b.trustScore - a.trustScore)
          .slice(0, 15)
          .map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/products/${p.productSlug}`,
            name: p.productName,
          })),
      });
    }

    // MF-02: Inject FAQPage schema on hub pages
    const hubFaqs = HUB_FAQS[hubSlug];
    if (hubFaqs && hubFaqs.length >= 1) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: hubFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    pages.push({
      route: hubRoute,
      title: `Best ${hubInfo.name} ${new Date().getFullYear()} — Trust Scores & Reviews | TheSynLab`,
      description: hubInfo.description,
      jsonLd: schemas,
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

  // ── Guides listing ───────────────────────────────────────────────────────
  if (route === "/guides") {
    const guideArticles = blogArticles
      .filter(a => a.category === "Guides")
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .map((a) =>
        `<li style="margin-bottom:.75rem"><a href="/blog/${a.slug}"><b>${escapeHtml(a.title)}</b></a> ` +
        `<span style="color:#666;font-size:.85rem">— ${escapeHtml(a.excerpt.slice(0, 120))}…</span></li>`
      )
      .join("");
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/blog">Blog</a> › Guides</nav>
<h1>How-To Guides &amp; Tutorials</h1>
<p>Step-by-step guides for evaluating, selecting, and optimizing your SaaS tools, smart home setup, and workflow stack. All independently researched.</p>
<ul style="list-style:none;padding:0">${guideArticles}</ul>
</main>`;
  }

  // ── Glossary listing ─────────────────────────────────────────────────────
  if (route === "/glossary") {
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Glossary</nav>
<h1>Tech Glossary</h1>
<p>Definitions and explanations of key terms in SaaS, smart home technology, privacy, and productivity — plain language, independently verified.</p>
<p style="color:#666">Glossary entries coming soon. In the meantime, browse our <a href="/blog">blog</a> and <a href="/guides">how-to guides</a>.</p>
</main>`;
  }

  // ── Widget gallery ─────────────────────────────────────────────────────
    // ── Widget gallery ─────────────────────────────────────────────────────
  if (route === "/widgets") {
    const allProducts = STATIC_PRODUCTS;
    const widgetCards = allProducts.slice(0, 10).map((p) => {
      const slug = p.productSlug;
      const pname = p.productName || p.name || slug;
      const tcoRaw = p.estimatedTCO || '';
      const tcoStr = tcoRaw.replace(/^\$/, '');
      return `<div style="border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;background:#fff">
<h3>${pname}</h3>
<div style="display:flex;gap:1rem;margin:.75rem 0;font-size:.8rem">
<span>Trust: <b>${p.trustScore}/10</b></span>
<span>Integration: <b>${p.integrationScore}/10</b></span>
${tcoStr ? '<span>TCO: <b>$${tcoStr}</b></span>' : ''}
</div>
<pre style="background:#f8fafc;padding:.5rem;border-radius:6px;font-size:.7rem;overflow:auto">&lt;iframe src="https://thesynlab.com/widget/product/${slug}"
width="360" height="220" loading="lazy"
referrerpolicy="strict-origin-when-cross-origin"&gt;&lt;/iframe&gt;</pre>
<p style="font-size:.75rem;color:#666;margin-top:.5rem">Click the product page to customize colors and options.</p>
</div>`;
    }).join('');

    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Widgets</nav>
<h1>Embeddable Trust Score Widgets</h1>
<p>Copy and paste these iframe embed codes to display TheSynLab Trust Scores, Integration Scores, and TCO data on your own website. Each widget includes a do-follow link back to the full review.</p>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1rem;margin-top:2rem">
${widgetCards}
</div>
<h2 style="margin-top:2rem">How to Embed</h2>
<ol>
<li>Choose a product widget above</li>
<li>Copy the iframe embed code</li>
<li>Paste into your website's HTML where you want the scorecard to appear</li>
<li>The widget will display live Trust Score, Integration Score, and TCO data</li>
</ol>
<p style="margin-top:1.5rem;padding:1rem;background:#f0f9ff;border-radius:8px"><strong>Want a custom widget for your site?</strong> TheSynLab offers partner badge programs for featured products. <a href="/contact">Contact us</a> for details.</p>
</main>`;
  }

  // ── Research Report (MF-09) ─────────────────────────────────────────
  if (route === "/report/state-of-saas-trust-2026") {
    return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Reports</nav>
<h1>2026 State of SaaS Trust &amp; Integrations</h1>
<p>15+ pages of data covering average Trust Scores by category, top 10 most-trusted tools, bottom 10 highest-risk vendors, integration cluster analysis, year-over-year score changes, and the privacy policy change tracker.</p>
<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.75rem 0">
<span style="background:#e2e8f0;padding:.15rem .5rem;border-radius:4px;font-size:.8rem">${STATIC_PRODUCTS.length} products</span>
<span style="background:#e2e8f0;padding:.15rem .5rem;border-radius:4px;font-size:.8rem">6 categories</span>
<span style="background:#e2e8f0;padding:.15rem .5rem;border-radius:4px;font-size:.8rem">100+ data points</span>
</div>
<p>This report is gated behind a free email signup. Sign up to access the full report including downloadable PDF, interactive charts, and embeddable data visualizations.</p>
<p style="margin-top:1rem;padding:1rem;background:#f0f9ff;border-radius:8px"><strong>Download the full report</strong> — enter your email on the <a href="/report/state-of-saas-trust-2026">report page</a> to unlock the complete analysis.</p>
</main>`;
  }

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
<p>All recipes are filterable by use-case, difficulty, and integrated tools. <a href="/hub/ai-workflow">Open AI Workflow Hub →</a> to build custom automation pipelines.</p>
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
<p>TheSynLab ("we", "our", "us") is committed to protecting your privacy and being transparent about how we collect, use, and share your information. This policy applies to the website thesynlab.com and all related services.</p>
<h2>Information We Collect</h2><p><b>Information you provide:</b> Email address when subscribing to newsletters, profile information if you create an account, product reviews and comments you submit, and correspondence you send us. <b>Automatically collected:</b> IP address, browser type and version, operating system, referring URLs, pages visited, time spent on pages, and interaction data through Google Analytics 4.</p>
<h2>Google AdSense and Cookies</h2><p>We use Google AdSense to display advertisements. Google uses cookies to serve personalised ads based on your browsing history and interests. Non-essential cookies (analytics, advertising, preferences) are only activated after you give explicit consent via our Cookie Consent Manager, which implements Google Consent Mode v2. You may opt out of personalised advertising at any time via Google Ads Settings (adssettings.google.com).</p>
<h2>Third-Party Services</h2><p>We use Google Analytics 4 for audience measurement and usage analysis. We use Clerk for authentication. Data collected by these services is governed by their respective privacy policies. We do not sell your personal data to any third party.</p>
<h2>Data Retention</h2><p>We retain your personal data only as long as necessary to provide our services or comply with legal obligations. Analytics data is retained for 26 months. Newsletter subscription data is retained until you unsubscribe.</p>
<h2>Your Rights (GDPR and CCPA)</h2><p>If you are in the EEA or UK, you have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data. California residents have the right to know what personal information we collect, request deletion, and opt out of the sale of personal information (we do not sell data). To exercise any of these rights, contact: privacy@thesynlab.com.</p>
<h2>Changes to This Policy</h2><p>We may update this policy from time to time. Material changes will be notified via a notice on our website.</p>
<h2>Contact</h2><p>Data Protection: privacy@thesynlab.com</p>
</main>`;

  if (route === "/terms") return `<main style="${MAIN_STYLE}">
<h1>Terms of Service</h1><p>Last Updated: January 12, 2026</p>
<p>By accessing or using TheSynLab website and services ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
<h2>Use of the Service</h2><p>You may use the Service for lawful purposes only. You agree not to: scrape, reproduce, or redistribute our content without written permission; attempt to manipulate our Trust Scores or rankings; submit false, misleading, or spam content; interfere with the operation of the website; or engage in any activity that violates applicable laws or regulations.</p>
<h2>User Accounts</h2><p>Creating an account is optional. If you register, you are responsible for maintaining the confidentiality of your credentials. You must provide accurate information. We reserve the right to suspend or terminate accounts that violate these terms.</p>
<h2>Intellectual Property</h2><p>All content on TheSynLab — including reviews, Trust Scores, Integration Scores, comparison data, methodology descriptions, editorial analysis, and visual assets — is owned by TheSynLab and protected by copyright, trademark, and intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our prior written consent.</p>
<h2>Reviews and User Content</h2><p>By submitting reviews or comments, you grant TheSynLab a non-exclusive, royalty-free license to display and distribute your content on our platform. You represent that your submissions are original and do not violate third-party rights. We reserve the right to moderate or remove user content at our discretion.</p>
<h2>Affiliate Links and Advertising</h2><p>TheSynLab participates in affiliate marketing programs operated by Impact, ShareASale, and individual vendor programs. We may earn commissions on purchases made through affiliate links at no additional cost to you. This does not affect our editorial independence or the integrity of our reviews and scores.</p>
<h2>Disclaimer of Warranties</h2><p>The Service is provided "as is" without warranties of any kind, express or implied. We do not guarantee the accuracy, completeness, or timeliness of reviews, scores, or pricing information. Product features, pricing, and availability may change without notice.</p>
<h2>Limitation of Liability</h2><p>TheSynLab shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, including reliance on reviews or scores in purchasing decisions.</p>
<h2>Changes to Terms</h2><p>We may modify these terms at any time. Continued use after changes constitutes acceptance of the new terms.</p>
<h2>Contact</h2><p>Legal inquiries: legal@thesynlab.com</p>
</main>`;

  if (route === "/disclosure") return `<main style="${MAIN_STYLE}">
<h1>Affiliate Disclosure</h1><p>Last Updated: January 12, 2026</p>
<p>TheSynLab participates in affiliate marketing programs operated by Impact, ShareASale, and individual vendor affiliate networks. When you click product links on our site and make a purchase, we may earn a commission at no additional cost to you. These commissions help fund our editorial operations and allow us to keep all content free for readers.</p>
<h2>Our Editorial Independence</h2><p>Affiliate relationships do not influence our reviews, Trust Scores, Integration Scores, rankings, or recommendations in any way. All products are evaluated independently by our editorial team through hands-on testing. We maintain a strict separation between our commercial partnerships and editorial decision-making. We never accept payment for positive reviews, and we always disclose affiliate links clearly.</p>
<h2>How We Choose Products to Review</h2><p>Products are selected based on reader interest, market relevance, and new technology trends — not affiliate commission rates. We aim to cover the most widely used tools in each category and frequently review open-source and free alternatives that generate no commission.</p>
<h2>FTC Compliance</h2><p>Per FTC 16 CFR Part 255 regarding endorsements and testimonials in advertising, we disclose that we may receive compensation for some of the links on this website. This disclosure is made in good faith and in compliance with applicable regulations.</p>
<h2>Contact</h2><p>Questions about our affiliate practices? Email: affiliates@thesynlab.com</p>
</main>`;

  if (route === "/about") return `<main style="${MAIN_STYLE}">
<h1>About TheSynLab</h1>
<p>TheSynLab is an independent technology review platform evaluating SaaS tools, smart home devices, and productivity software using our proprietary Trust Score and Integration Score methodology. Founded in 2025, we have reviewed over 300 software tools across 20 categories — every single one tested hands-on by our editorial team for a minimum of 14 days before receiving a score.</p>
<h2>Our Mission</h2><p>We help professionals, startups, and enterprise teams make confident technology decisions through honest, data-driven reviews. Unlike user-review platforms like G2 or Capterra, every review on TheSynLab is written by an editor who has personally deployed and used the tool in a real-world workflow. No paid placements. No sponsored ratings. No affiliate influence on scores.</p>
<h2>Our Scoring System</h2><p>Every tool on TheSynLab receives two scores. The <b>Trust Score</b> (0 to 100) measures reliability, data privacy practices, security certifications, vendor transparency, and customer support quality. The <b>Integration Score</b> (0 to 100) evaluates ecosystem compatibility, API quality and documentation, native integrations with popular platforms, import/export capabilities, and third-party marketplace presence. Together these scores give you a complete picture of both the tool and its fit within your existing stack.</p>
<h2>Total Cost of Ownership Analysis</h2><p>Beyond scores, we calculate a 3-year Total Cost of Ownership for every product. Our TCO model includes subscription fees, per-user pricing at scale, onboarding and migration costs, training time, API usage overages, and estimated annual price increases. We surface hidden costs that vendor comparison pages typically omit.</p>
<h2>Editorial Independence</h2><p>TheSynLab is funded through affiliate commissions and advertising. This funding model allows us to keep our content free for all readers. Our editorial independence is absolute — scores, rankings, and recommendations are determined by our testing team alone. Commercial relationships never influence a review outcome. See our <a href="/disclosure">Affiliate Disclosure</a> for full details.</p>
<h2>Who We Serve</h2><p>Our readers include SaaS founders evaluating their tool stack, IT managers making procurement decisions, startup operators looking for budget-friendly alternatives, and technology enthusiasts comparing the latest AI and smart home products. We publish new reviews weekly and update existing reviews quarterly to reflect pricing changes, feature updates, and vendor policy shifts.</p>
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
      const toolDesc = tool.description || tool.shortDescription;
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/hub/ai-tools">AI Tools</a> › ${escapeHtml(tool.name)}</nav>
<h1>${escapeHtml(tool.name)} Review (${year})</h1>
<p style="font-size:1.1rem">${escapeHtml(tool.tagline)}</p>
<p>${escapeHtml(tool.shortDescription)}</p>
<p>${escapeHtml(toolDesc)}</p>
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

    // ── Product detail pages (/products/:slug) ──────────────────────────────────
  const productMatch = route.match(/^\/products\/([^/]+)$/);
  if (productMatch) {
    const product = STATIC_PRODUCTS.find((p) => p.productSlug === productMatch[1]);
    if (product) {
      const featureItems = product.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("");
      const proItems = product.pros.map((p) => `<li>✅ ${escapeHtml(p)}</li>`).join("");
      const conItems = product.cons.map((c) => `<li>❌ ${escapeHtml(c)}</li>`).join("");
      const altLinks = product.alternativeSlugs.map((a) => {
        const alt = STATIC_PRODUCTS.find(p => p.productSlug === a);
        const name = alt ? alt.productName : a;
        return `<li><a href="/products/${a}">${escapeHtml(name)}</a></li>`;
      }).join("");
      const bestForTags = product.bestFor.map((b) => `<span style="background:#e0e7ff;padding:2px 8px;border-radius:12px;font-size:.85rem;margin-right:4px">${escapeHtml(b)}</span>`).join("");
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/products">Products</a> › ${escapeHtml(product.productName)}</nav>
<h1>${escapeHtml(product.productName)} Review ${year} — Trust Score ${product.trustScore}/10, Integrations &amp; TCO</h1>
<p>${escapeHtml(product.longDescription)}</p>
<div style="display:flex;gap:2rem;flex-wrap:wrap;margin:1.5rem 0">
<div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:1rem;border-radius:8px;flex:1;min-width:150px">
<p style="margin:0;font-size:1.25rem;font-weight:bold;color:#166534">Trust Score</p>
<p style="margin:0;font-size:2rem;font-weight:bold;color:#15803d">${product.trustScore}/10</p>
</div>
<div style="background:#f0f7ff;border:1px solid #bfdbfe;padding:1rem;border-radius:8px;flex:1;min-width:150px">
<p style="margin:0;font-size:1.25rem;font-weight:bold;color:#1e40af">Integration Score</p>
<p style="margin:0;font-size:2rem;font-weight:bold;color:#2563eb">${product.integrationScore}/10</p>
</div>
<div style="background:#fffbeb;border:1px solid #fde68a;padding:1rem;border-radius:8px;flex:1;min-width:150px">
<p style="margin:0;font-size:1.25rem;font-weight:bold;color:#92400e">Estimated TCO</p>
<p style="margin:0;font-size:1.5rem;font-weight:bold;color:#a16207">$${product.estimatedTco}/yr per seat</p>
</div>
</div>
<p>${bestForTags}</p>
<h2>Key Features</h2>
<ul>${featureItems}</ul>
<h2>Pros &amp; Cons</h2>
<div style="display:flex;gap:2rem;flex-wrap:wrap">
<div style="flex:1;min-width:200px"><h3>Pros</h3><ul>${proItems}</ul></div>
<div style="flex:1;min-width:200px"><h3>Cons</h3><ul>${conItems}</ul></div>
</div>
<h2>Alternatives to ${escapeHtml(product.productName)}</h2>
<p>Consider these alternatives to ${escapeHtml(product.productName)}:</p>
<ul>${altLinks}</ul>
<p><a href="/products/${product.productSlug}/alternatives">View all ${escapeHtml(product.productName)} alternatives →</a></p>
<h2>Trust Score &amp; Integration Methodology</h2>
<p>TheSynLab Trust Score evaluates privacy, security, vendor reputation, data practices, and ethical AI transparency. Our Integration Score measures API documentation quality, native integrations, automation platform support, cross-platform availability, and developer community strength. All scores are independently calculated and regularly reviewed.</p>
<p><a href="/tools/compare">Compare ${escapeHtml(product.productName)} with alternatives in TheSynLab Decision Studio →</a></p>
</main>`;
    }
  }

  // ── Alternatives pages (/products/:slug/alternatives) ───────────────────
  const prodAltMatch = route.match(/^\/products\/([^/]+)\/alternatives$/);
  if (prodAltMatch) {
    const product = STATIC_PRODUCTS.find((p) => p.productSlug === prodAltMatch[1]);
    if (product && product.alternativeSlugs.length > 0) {
      const prodAltItems = product.alternativeSlugs.map((a) => {
        const altProd = STATIC_PRODUCTS.find(p => p.productSlug === a);
        if (!altProd) return "";
        return `<li style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #e5e7eb">
<a href="/products/${altProd.productSlug}"><b>${escapeHtml(altProd.productName)}</b></a><br>
<span style="color:#666;font-size:.9rem">Trust ${altProd.trustScore}/10 · Integration ${altProd.integrationScore}/10 · $${altProd.estimatedTco}/yr · ${escapeHtml(altProd.description)}</span>
</li>`;
      }).filter(Boolean).join("");
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/products">Products</a> › <a href="/products/${product.productSlug}">${escapeHtml(product.productName)}</a> › Alternatives</nav>
<h1>Best ${escapeHtml(product.productName)} Alternatives ${year}</h1>
<p>Compare Trust Scores, Integration Scores, and TCO for top alternatives to ${escapeHtml(product.productName)}.</p>
<ul style="list-style:none;padding:0">${prodAltItems}</ul>
<p><a href="/tools/compare">Use the comparison tool →</a> to compare up to 4 products side-by-side.</p>
</main>`;
    }
  }

  // ── Comparison pages (/products/:slug-vs-:slug) ────────────────────────
  const compareMatch = route.match(/^\/products\/([^/]+)-vs-([^/]+)$/);
  if (compareMatch) {
    const productA = STATIC_PRODUCTS.find(p => p.productSlug === compareMatch[1]);
    const productB = STATIC_PRODUCTS.find(p => p.productSlug === compareMatch[2]);
    if (productA && productB) {
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/products">Products</a> › ${escapeHtml(productA.productName)} vs ${escapeHtml(productB.productName)}</nav>
<h1>${escapeHtml(productA.productName)} vs ${escapeHtml(productB.productName)} (${year})</h1>
<table style="width:100%;border-collapse:collapse;margin:1.5rem 0">
<tr style="background:#f9fafb"><th style="padding:.75rem;text-align:left;border:1px solid #e5e7eb">Metric</th><th style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${escapeHtml(productA.productName)}</th><th style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${escapeHtml(productB.productName)}</th></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Trust Score</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${productA.trustScore}/10</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${productB.trustScore}/10</td></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Integration Score</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${productA.integrationScore}/10</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${productB.integrationScore}/10</td></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Est. TCO / yr</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">$${productA.estimatedTco}</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">$${productB.estimatedTco}</td></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Price</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">$${productA.price}/${productA.priceModel}</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">$${productB.price}/${productB.priceModel}</td></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Category</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${escapeHtml(productA.category)}</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${escapeHtml(productB.category)}</td></tr>
</table>
<h2>Verdict</h2>
<p>If you prioritize ${productA.trustScore > productB.trustScore ? "trust and security" : "integrations and ecosystem"}, ${productA.trustScore > productB.trustScore ? escapeHtml(productA.productName) : escapeHtml(productB.productName)} is the stronger choice. For ${productA.integrationScore > productB.integrationScore ? "deep integration ecosystems" : "budget-conscious teams"}, ${productA.integrationScore > productB.integrationScore ? escapeHtml(productA.productName) : escapeHtml(productB.productName)} has the edge.</p>
<p><a href="/tools/compare">Compare these tools in TheSynLab Decision Studio →</a></p>
</main>`;
    }
  }
  // ── /vs/ comparison landing pages (MF-04) ───────────────────────────────
  const vsMatch = route.match(/^\/vs\/([^/]+)-vs-([^/]+)$/);
  if (vsMatch) {
    const prodA = STATIC_PRODUCTS.find(p => p.productSlug === vsMatch[1]);
    const prodB = STATIC_PRODUCTS.find(p => p.productSlug === vsMatch[2]);
    if (prodA && prodB) {
      const aName = prodA.productName;
      const bName = prodB.productName;
      const aFeatures = prodA.features.map(f => `<li>${escapeHtml(f)}</li>`).join("");
      const bFeatures = prodB.features.map(f => `<li>${escapeHtml(f)}</li>`).join("");
      const trustWinner = prodA.trustScore > prodB.trustScore ? aName : bName;
      const intWinner = prodA.integrationScore > prodB.integrationScore ? aName : bName;
      const tcoWinner = prodA.estimatedTco < prodB.estimatedTco ? aName : bName;
      const bestForAHtml = prodA.bestFor.map(b => `<span style="background:#e0e7ff;padding:2px 8px;border-radius:12px;font-size:.85rem;margin-right:4px">${escapeHtml(b)}</span>`).join("");
      const bestForBHtml = prodB.bestFor.map(b => `<span style="background:#e0e7ff;padding:2px 8px;border-radius:12px;font-size:.85rem;margin-right:4px">${escapeHtml(b)}</span>`).join("");
      const trustDiff = Math.abs(prodA.trustScore - prodB.trustScore).toFixed(1);
      const intDiff = Math.abs(prodA.integrationScore - prodB.integrationScore).toFixed(1);

      const narrative = `${escapeHtml(aName)} and ${escapeHtml(bName)} serve overlapping but distinct needs in the ${escapeHtml(prodA.category)} space. ` +
        `${escapeHtml(aName)} achieves a Trust Score of ${prodA.trustScore}/10, while ${escapeHtml(bName)} scores ${prodB.trustScore}/10 — a difference of ${trustDiff} points. ` +
        `On integration depth, ${escapeHtml(intWinner)} leads with ${prodA.integrationScore > prodB.integrationScore ? prodA.integrationScore : prodB.integrationScore}/10 vs ${prodA.integrationScore > prodB.integrationScore ? prodB.integrationScore : prodA.integrationScore}/10 (difference: ${intDiff} points). ` +
        `When it comes to total cost of ownership, ${escapeHtml(tcoWinner)} is more budget-friendly at $${Math.min(prodA.estimatedTco, prodB.estimatedTco)}/year vs $${Math.max(prodA.estimatedTco, prodB.estimatedTco)}/year per seat. ` +
        `${escapeHtml(trustWinner)} is the recommended choice if trust, security, and vendor reputation are your primary concerns. However, the right choice depends on your specific team size, existing tool ecosystem, and budget constraints.`;

      // Build related comparisons from alternatives
      const relatedHtml = [];
      for (const slug of [vsMatch[1], vsMatch[2]]) {
        const prod = slug === vsMatch[1] ? prodA : prodB;
        for (const altSlug of prod.alternativeSlugs.slice(0, 4)) {
          if (altSlug !== prodB.productSlug && altSlug !== prodA.productSlug) {
            const alt = STATIC_PRODUCTS.find(p => p.productSlug === altSlug);
            if (alt) {
              relatedHtml.push(`<li><a href="/vs/${slug}-vs-${altSlug}">${escapeHtml(prod.productName)} vs ${escapeHtml(alt.productName)}</a></li>`);
            }
          }
        }
      }

      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › <a href="/compare">Comparisons</a> › ${escapeHtml(aName)} vs ${escapeHtml(bName)}</nav>
<h1>${escapeHtml(aName)} vs ${escapeHtml(bName)} (${year}): Trust Score, TCO &amp; Integration Compared</h1>

<div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:1.25rem;border-radius:8px;margin:1.5rem 0">
<h2 style="margin:0 0 .5rem 0;font-size:1.1rem">⚡ Quick Verdict</h2>
<p style="margin:0"><b>${escapeHtml(trustWinner)}</b> is the stronger choice if you prioritize trust, security, and data privacy (Trust Score: ${prodA.trustScore > prodB.trustScore ? prodA.trustScore : prodB.trustScore}/10 vs ${prodA.trustScore > prodB.trustScore ? prodB.trustScore : prodA.trustScore}/10). For deeper integration ecosystems and API flexibility, <b>${escapeHtml(intWinner)}</b> has the edge (Integration Score: ${prodA.integrationScore > prodB.integrationScore ? prodA.integrationScore : prodB.integrationScore}/10).</p>
</div>

<div style="background:#faf5ff;border:1px solid #e9d5ff;padding:1.25rem;border-radius:8px;margin:1.5rem 0">
<h2 style="margin:0 0 .5rem 0;font-size:1.1rem">📊 Comparison Overview</h2>
<p style="margin:0;line-height:1.6">${narrative}</p>
</div>

<h2>Side-by-Side Score Comparison</h2>
<table style="width:100%;border-collapse:collapse;margin:1.5rem 0">
<tr style="background:#f9fafb"><th style="padding:.75rem;text-align:left;border:1px solid #e5e7eb">Metric</th><th style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${escapeHtml(aName)}</th><th style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${escapeHtml(bName)}</th></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Trust Score</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb${prodA.trustScore > prodB.trustScore ? ';font-weight:bold' : ''}">${prodA.trustScore}/10${prodA.trustScore > prodB.trustScore ? ' 🏆' : ''}</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb${prodB.trustScore > prodA.trustScore ? ';font-weight:bold' : ''}">${prodB.trustScore}/10${prodB.trustScore > prodA.trustScore ? ' 🏆' : ''}</td></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Integration Score</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb${prodA.integrationScore > prodB.integrationScore ? ';font-weight:bold' : ''}">${prodA.integrationScore}/10${prodA.integrationScore > prodB.integrationScore ? ' 🏆' : ''}</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb${prodB.integrationScore > prodA.integrationScore ? ';font-weight:bold' : ''}">${prodB.integrationScore}/10${prodB.integrationScore > prodA.integrationScore ? ' 🏆' : ''}</td></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Est. TCO / yr</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb${prodA.estimatedTco < prodB.estimatedTco ? ';font-weight:bold' : ''}">$${prodA.estimatedTco}${prodA.estimatedTco < prodB.estimatedTco ? ' 🏆' : ''}</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb${prodB.estimatedTco < prodA.estimatedTco ? ';font-weight:bold' : ''}">$${prodB.estimatedTco}${prodB.estimatedTco < prodA.estimatedTco ? ' 🏆' : ''}</td></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Price</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">$${prodA.price}/${prodA.priceModel}</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">$${prodB.price}/${prodB.priceModel}</td></tr>
<tr><td style="padding:.75rem;border:1px solid #e5e7eb">Category</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${escapeHtml(prodA.category)}</td><td style="padding:.75rem;text-align:center;border:1px solid #e5e7eb">${escapeHtml(prodB.category)}</td></tr>
</table>

<h2>Feature Comparison</h2>
<div style="display:flex;gap:2rem;flex-wrap:wrap">
<div style="flex:1;min-width:200px"><h3>${escapeHtml(aName)} Features</h3><ul>${aFeatures}</ul></div>
<div style="flex:1;min-width:200px"><h3>${escapeHtml(bName)} Features</h3><ul>${bFeatures}</ul></div>
</div>

<h2>Best For</h2>
<div style="display:flex;gap:2rem;flex-wrap:wrap;margin:1rem 0">
<div style="flex:1;min-width:200px"><h3 style="margin:0 0 .5rem 0">${escapeHtml(aName)}</h3><p>${bestForAHtml}</p><p>${escapeHtml(prodA.longDescription.slice(0, 200))}... <a href="/products/${prodA.productSlug}">Read full review →</a></p></div>
<div style="flex:1;min-width:200px"><h3 style="margin:0 0 .5rem 0">${escapeHtml(bName)}</h3><p>${bestForBHtml}</p><p>${escapeHtml(prodB.longDescription.slice(0, 200))}... <a href="/products/${prodB.productSlug}">Read full review →</a></p></div>
</div>

<h2>Verdict</h2>
<p><b>${escapeHtml(trustWinner)}</b> wins on trust, security, and data practices with a Trust Score of ${prodA.trustScore > prodB.trustScore ? prodA.trustScore : prodB.trustScore}/10. <b>${escapeHtml(intWinner)}</b> wins on integration depth and ecosystem connectivity. For budget-conscious teams, <b>${escapeHtml(tcoWinner)}</b> offers the lower total cost of ownership at $${Math.min(prodA.estimatedTco, prodB.estimatedTco)}/year vs $${Math.max(prodA.estimatedTco, prodB.estimatedTco)}/year.</p>
<p>The right choice depends on your team's priorities. If you value privacy, ethical AI, and vendor transparency, choose ${escapeHtml(trustWinner)}. If you need deep API integrations and a large app ecosystem, choose ${escapeHtml(intWinner)}.</p>

<h2>Related Comparisons</h2>
<ul>
<li><a href="/vs/${vsMatch[2]}-vs-${vsMatch[1]}">${escapeHtml(bName)} vs ${escapeHtml(aName)}</a></li>
${relatedHtml.slice(0, 6).join("\n")}
</ul>

<p><a href="/tools/compare">Model this comparison in TheSynLab Decision Studio →</a></p>
</main>`;
    }
  }

  // ── Hub pages (/hub/:slug) ─────────────────────────────────────────────────
  const hubMatch = route.match(/^\/hub\/([^/]+)$/);
  if (hubMatch) {
    const hub = HUB_SLUGS[hubMatch[1]];
    if (hub) {
      const hubProdcts = STATIC_PRODUCTS.filter((p) => p.hub === hubMatch[1]);
      const prodList = hubProdcts
        .map((p) => `<li><a href="/products/${p.productSlug}"><b>${escapeHtml(p.productName)}</b></a> — $${p.price}/${p.priceModel} · ${escapeHtml(p.description)}</li>`)
        .join("");
      return `<main style="${MAIN_STYLE}">
<nav style="${NAV_STYLE}"><a href="/">TheSynLab</a> › Hubs › ${escapeHtml(hub.name)}</nav>
<h1>Best ${escapeHtml(hub.name)} (${year}) — Trust Scores &amp; Reviews</h1>
<p>${escapeHtml(hub.description)}</p>
<h2>Reviewed Products</h2>
<ul>${prodList}</ul>
<p><a href="/products">Browse all products →</a> · <a href="/tools/compare">Compare products →</a></p>
</main>`;
    }
  }

  // ── Default fallback (homepage) ────────────────────────────────────────────
  // AdSense compliance: must return 400+ words of substantive content in prerender
  return `<main style="${MAIN_STYLE}">
<h1>TheSynLab — Independent Tech Reviews</h1>
${HOMEPAGE_PRERENDER_HTML}
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

const injectGa4Plugin = () => ({
  name: "inject-ga4-id",
  transformIndexHtml(html: string) {
    const id = process.env.VITE_GA4_MEASUREMENT_ID || "G-XMGRJBSN5Y";
    return html.replace(/%VITE_GA4_MEASUREMENT_ID%/g, id);
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
    injectGa4Plugin(),
    sitemapPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
