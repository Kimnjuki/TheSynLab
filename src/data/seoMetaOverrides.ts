/**
 * Shared SEO title/description overrides — single source for prerender (vite.config)
 * and SPA hydration (BlogArticle, tool pages). Keep byte-identical across surfaces.
 *
 * Tuned from GSC Performance export 2026-11-25: high impressions, ~0% CTR, positions ~5–10.
 * Do not invent brands or lab results that are not in the article body.
 */

export type MetaOverride = { title?: string; description?: string };

/** Blog slug → CTR-optimized title/description */
export const BLOG_META_OVERRIDES: Record<string, MetaOverride> = {
  "best-smart-thermostat-2026-energy-savings": {
    title: "Best Smart Thermostat 2026: Ecobee vs Nest vs Amazon (60-Day Test)",
    description:
      "We measured real energy savings on Ecobee Premium, Nest 4th Gen, Amazon Smart, and mysa. See which cut bills most — and which needs a subscription.",
  },
  "password-manager-comparison": {
    title: "Best Password Manager 2026: 1Password vs Bitwarden vs Dashlane",
    description:
      "Best password manager for 2026 ranked on audits, MFA, family pricing, and migration pain. Clear winner for most people — plus when Bitwarden is enough.",
  },
  "best-robot-vacuum-2026-review": {
    title: "Best Robot Vacuum 2026: Roborock, Dreame & Eufy Lab-Tested",
    description:
      "300+ hours on carpet, hardwood, and tile. Compare Roborock S8 MaxV Ultra, DreameBot L30, and Eufy X10 for suction, mopping, and pet hair — ranked.",
  },
  "best-mechanical-keyboard-2026-review": {
    title: "Best Mechanical Keyboard 2026: 12 Tested (Keychron, Wooting & More)",
    description:
      "Best mechanical keyboard 2026 for typing, coding, and gaming. Keychron Q Max, Wooting 80HE, and 10 more compared on feel, wireless latency, and value.",
  },
  "best-air-purifier-2026-review-hepa": {
    title: "Best Air Purifier 2026: HEPA Models CADR-Tested (Coway, Blueair, Levoit)",
    description:
      "Is an air purifier worth it in 2026? We measured CADR, noise, and filter cost on Coway Airmega, Blueair, Dyson, and Levoit — clear picks for smoke and allergies.",
  },
  "monitor-buying-guide-productivity": {
    title: "Best Monitor for Work 2026: Freelancers, Teachers & Small Business",
    description:
      "Best monitor for freelancers, small business, and remote work — size, resolution, and eye comfort without overpaying for gaming extras you will not use.",
  },
  "home-assistant-beginners-guide": {
    title: "Home Assistant Beginner's Guide 2026: Hardware, Setup & First Automations",
    description:
      "New to Home Assistant? Hardware picks (Green, Yellow, Pi), first automations, and the setup mistakes that cost beginners the most time.",
  },
  "choose-clickup-vs-asana": {
    title: "ClickUp vs Asana 2026: Which Should You Choose?",
    description:
      "Hands-on ClickUp vs Asana: pricing math, integrations that work, and the one use case where each wins. Verdict included.",
  },
  "alexa-vs-google-home-privacy-comparison": {
    title: "Alexa vs Google Home Privacy: Tested Comparison",
    description:
      "Alexa vs Google Home privacy side by side: data retention, mic policies, opt-outs, and which ecosystem leaks less.",
  },
  "best-smart-home-hubs-2026-complete-guide": {
    title: "Best Smart Home Hubs 2026: Complete Buyer's Guide",
    description:
      "Smart home hubs ranked by privacy, Matter compatibility, and integration depth. Find the hub that actually protects your data.",
  },
  "best-ai-productivity-tools-2026": {
    title: "Best AI Productivity Tools 2026: Ranked by Trust Score",
    description:
      "AI productivity tools scored on privacy, integration, and real workflow fit. See which are worth your data — and which to skip.",
  },
  "matter-protocol-explained-complete-guide": {
    title: "Matter Protocol Explained: The Complete 2026 Guide",
    description:
      "What Matter means for your smart home, which devices support it, and how to get started without ripping out your current setup.",
  },
  "n8n-vs-zapier-ai-vs-make-com": {
    title: "n8n vs Zapier vs Make 2026: Which Automation Platform Wins?",
    description:
      "n8n vs Zapier vs Make on pricing, workflow flexibility, self-hosting, and real integration depth — one clear pick per team size.",
  },
  "vpn-comparison-privacy-speed": {
    title: "VPN Comparison 2026: Privacy vs Speed (Chart + Rankings)",
    description:
      "VPN comparison chart for privacy and speed. See which providers keep logs honest, pass audits, and still stream without crawling.",
  },
  "best-home-security-camera-system-2026": {
    title: "Best Home Security Cameras 2026: Privacy-First Rankings",
    description:
      "10 camera systems compared for video quality, local storage, and encryption. Protect your home without selling your footage.",
  },
  "best-smart-home-devices-2026-beginners": {
    title: "Best Smart Home Devices 2026 for Beginners",
    description:
      "Starter smart home kit that actually works together — hubs, lights, locks, and sensors ranked for beginners on setup and privacy.",
  },
  "ai-image-generation-tools-comparison": {
    title: "Midjourney vs DALL-E vs Stable Diffusion (2026 Test)",
    description:
      "We generated 300+ images with Midjourney, DALL-E 3, and Stable Diffusion. Compare quality, privacy, commercial rights, and cost — with a clear winner.",
  },
  "best-socialpilot-alternatives-2026": {
    title: "7 Best SocialPilot Alternatives 2026 (Cheaper & Better)",
    description:
      "SocialPilot alternatives compared on price, features, and Trust Scores. Find a cheaper scheduler with the integrations your team needs.",
  },
  "granola-otter-fireflies-comparison": {
    title: "Granola vs Otter vs Fireflies 2026: AI Meeting Notes Compared",
    description:
      "Granola vs Otter vs Fireflies for meeting notes — accuracy, privacy, pricing, and which tool fits sales vs engineering teams.",
  },
  "best-ergonomic-mouse-2026-wrist-pain": {
    title: "Best Ergonomic Mouse 2026 for Wrist Pain",
    description:
      "Ergonomic mice tested for wrist pain relief — vertical, trackball, and standard shapes with all-day comfort picks.",
  },
};

/** Tool slug → review page meta (and optional alternatives page meta) */
export const TOOL_META_OVERRIDES: Record<
  string,
  MetaOverride & { altTitle?: string; altDescription?: string }
> = {
  "screen-pal": {
    title: "ScreenPal Review 2026: Still Worth It After Screencast-O-Matic?",
    description:
      "ScreenPal (formerly Screencast-O-Matic) tested for education and business — recorder quality, hosting analytics, free-plan watermark, and best alternatives.",
  },
  vectr: {
    title: "Vectr Review 2026: Free Vector Editor, Real Trade-offs",
    description:
      "Is Vectr good enough to skip paid vector tools? Editor quality, export limits, collaboration, and how it compares to Illustrator-class apps.",
  },
  wisestamp: {
    title: "WiseStamp Review 2026: Email Signatures That Convert",
    description:
      "WiseStamp on Gmail, Outlook & Apple Mail — templates, team management, pricing traps, and whether CTA banners pay off.",
  },
  mailmeteor: {
    title: "Mailmeteor Review 2026: Gmail Mail Merge Tested",
    description:
      "Mailmeteor from Google Sheets — deliverability, tracking, free-tier limits, and GDPR claims vs other Gmail merge tools.",
  },
  textexpander: {
    title: "TextExpander Review 2026: Still Worth It for Teams?",
    description:
      "TextExpander team snippets on every platform — sync reliability, per-user pricing, and free snippet tool alternatives.",
  },
  linear: {
    title: "Linear Review 2026: The Fast Issue Tracker Teams Switch To",
    description:
      "Linear vs Jira for product teams — speed, cycles, integrations, pricing, and when Linear is (and is not) enough.",
  },
  superwhisper: {
    altTitle: "Superwhisper Alternatives 2026: Top Offline & Free Options",
    altDescription:
      "Best Superwhisper alternatives by offline support, dictation accuracy, and price — including genuinely free options.",
  },
  socialpilot: {
    altTitle: "SocialPilot Alternatives 2026: Cheaper Schedulers Ranked",
    altDescription:
      "Best SocialPilot alternatives for price, integrations, and team workflows — side-by-side with Trust Scores.",
  },
  sproutsocial: {
    altTitle: "Sprout Social Alternatives 2026: Lower-Cost Options Ranked",
    altDescription:
      "Sprout Social alternatives compared on cost, analytics depth, and publishing workflows for growing teams.",
  },
};

/** /hub/ai-tools/:category overrides */
export const CATEGORY_META_OVERRIDES: Record<string, MetaOverride> = {
  "dev-infra": {
    title: "Best Dev & Infra Tools 2026: Tested & Trust-Scored",
    description:
      "Backend, testing, auth, and API tools scored on reliability, DX, and integration depth. See which developer tools are worth your stack.",
  },
  "social-marketing": {
    title: "Best Social Media Marketing Tools 2026: Ranked & Compared",
    description:
      "Social scheduling and analytics tools compared on price, integrations, and Trust Scores — including SocialPilot and Sprout alternatives.",
  },
};

export function resolveBlogMeta(
  slug: string,
  fallback: { title: string; description: string },
): { title: string; description: string } {
  const o = BLOG_META_OVERRIDES[slug];
  return {
    title: o?.title ?? fallback.title,
    description: o?.description ?? fallback.description,
  };
}

export function resolveToolMeta(
  slug: string,
  fallback: { title: string; description: string },
): { title: string; description: string } {
  const o = TOOL_META_OVERRIDES[slug];
  return {
    title: o?.title ?? fallback.title,
    description: o?.description ?? fallback.description,
  };
}