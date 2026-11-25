// Prerendered HTML content blocks for Google AdSense "low value content" compliance.
// These are injected into the SPA shell during Vite build so Googlebot sees
// substantial content before React hydrates. Must be 400+ words each.
// Keep claims aligned with Phase 0 integrity freezes (docs/T01_T02_DISCOVERY_REPORT.md).

import { STATIC_PRODUCTS } from "./staticProductData";

const catalogCount = STATIC_PRODUCTS.length;

export const HOMEPAGE_PRERENDER_HTML = `
<p>TheSynLab is your independent guide to choosing the right software, smart home devices, and productivity tools. Founded in 2025, we evaluate products using a published Trust Score methodology — measuring data privacy practices, security evidence, terms transparency, and vendor governance — alongside Integration Scores that assess API quality, workflow compatibility, automation support, and developer experience where those criteria apply.</p>

<p>Unlike review directories that rely only on star ratings, TheSynLab combines structured editorial analysis with an evidence-first scoring model across five dimensions: Trust Score (0–10 on product pages), Integration Score (0–10), typed ownership-cost quotes with optional 36-month TCO scenarios, Vendor Risk Profile (lock-in and portability), and Ecosystem Fit. We follow a documented 14+ day testing protocol for qualifying lab-tested reviews; researched-only entries are labeled separately and do not inherit lab-tested badges.</p>

<h2>Our Categories</h2>
<p>We currently publish a catalog of ${catalogCount} products across AI and SaaS tools, AI workflow platforms, intelligent home devices, hybrid office collaboration software, and developer tooling. Coverage grows as qualifying reviews and catalog snapshots are approved — we do not invent social-proof counters. Browse hubs for AI tools, AI workflow, intelligent home, and hybrid office, then open product pages for criterion-level scores and annual seat quotes where available.</p>

<h2>How scores and costs are shown</h2>
<p>Homepage featured cards pull Trust Scores from the same published catalog snapshot used on product pages, so branded sample numbers never disagree with the review. Annual subscription quotes are labeled as seat quotes, not as 36-month TCO. Full ownership scenarios — seats, labor, exit cost, and effective monthly equivalents — live in Decision Studio and the TCO calculator. Scores are re-verified on a published cadence (typically 6–12 months, sooner after material product, pricing, or security changes).</p>

<h2>Latest on TheSynLab</h2>
<p>Our editorial team publishes reviews, comparisons, and workflow guides. Use Compare for side-by-side Trust and Integration scores, Stack Builder for compatibility notes, Stack Quiz for a short constrained recommendation flow, and Decision Studio for ROI and 36-month TCO previews. Popular starting points include productivity software, automation platforms, and collaboration tools in the products hub.</p>

<h2>How We Make Money</h2>
<p>TheSynLab is funded through affiliate commissions and advertising. When you click product links on our site and make a purchase, we may earn a commission at no additional cost to you. Affiliate status never enters ranking features or score calculations. Our editorial independence policy is documented in the Affiliate Disclosure and About pages. Named testimonials are published only with verified consent and experience attestation on file.</p>

<p><em>Public Trust and Integration Scores use a 0–10 scale on product pages. Ownership cost displays separate annual seat quotes from modeled 36-month TCO. Catalog size reflects ${catalogCount} published products in the current static snapshot. Qualifying lab-tested reviews follow a 14+ day protocol with dated re-verification.</em></p>
`;