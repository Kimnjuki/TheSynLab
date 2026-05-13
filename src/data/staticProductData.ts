/**
 * Static product data for build-time use (sitemap generation, SEO injection).
 * Mirrors the seed data in convex/seedProductionData.ts.
 * When more products are added via Convex, update this list.
 */
export interface StaticProduct {
  productName: string;
  productSlug: string;
  manufacturer: string;
  category: string;
  subcategory: string;
  productType: string;
  description: string;
  price: number;
  priceCurrency: string;
  priceModel: string;
  hub: string;
  features: string[];
}

export const STATIC_PRODUCTS: StaticProduct[] = [
  {
    productName: "ClickUp",
    productSlug: "clickup",
    manufacturer: "ClickUp",
    category: "Productivity Software",
    subcategory: "All-in-One Platform",
    productType: "saas",
    description: "All-in-one productivity platform with custom views, time tracking, docs, and goals.",
    price: 5,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "ai_workflow",
    features: ["Custom Views", "Time Tracking", "Docs", "Goals"],
  },
  {
    productName: "Todoist",
    productSlug: "todoist",
    manufacturer: "Doist",
    category: "Productivity Software",
    subcategory: "Task Management",
    productType: "saas",
    description: "Simple task manager with natural language input, project templates, labels, and reminders.",
    price: 4,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "productivity",
    features: ["Natural Language Input", "Project Templates", "Labels", "Reminders"],
  },
  {
    productName: "Asana",
    productSlug: "asana",
    manufacturer: "Asana",
    category: "Productivity Software",
    subcategory: "Project Management",
    productType: "saas",
    description: "Work management platform with timeline, portfolios, workload, and goals.",
    price: 10.99,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "productivity",
    features: ["Timeline", "Portfolios", "Workload", "Goals"],
  },
  {
    productName: "Notion",
    productSlug: "notion",
    manufacturer: "Notion Labs",
    category: "Productivity Software",
    subcategory: "All-in-One Workspace",
    productType: "saas",
    description: "Unified workspace with block editor, databases, templates, and wiki.",
    price: 10,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "productivity",
    features: ["Block Editor", "Databases", "Templates", "Wiki"],
  },
  {
    productName: "Slack",
    productSlug: "slack",
    manufacturer: "Salesforce",
    category: "Collaboration",
    subcategory: "Messaging",
    productType: "saas",
    description: "Team messaging platform with channels, direct messages, huddles, and canvas.",
    price: 8,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "collaboration",
    features: ["Channels", "Direct Messages", "Huddles", "Canvas"],
  },
  {
    productName: "Canva",
    productSlug: "canva",
    manufacturer: "Canva",
    category: "Design",
    subcategory: "Graphic Design",
    productType: "saas",
    description: "Online graphic design platform with templates, drag and drop editor, brand kit, and AI tools.",
    price: 12.99,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "productivity",
    features: ["Templates", "Drag & Drop Editor", "Brand Kit", "Magic Studio"],
  },
  {
    productName: "HubSpot",
    productSlug: "hubspot",
    manufacturer: "HubSpot",
    category: "Marketing",
    subcategory: "CRM",
    productType: "saas",
    description: "All-in-one CRM platform with marketing, sales, and service hubs.",
    price: 45,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "martech",
    features: ["CRM", "Email Marketing", "Social Media", "Analytics"],
  },
  {
    productName: "GitHub",
    productSlug: "github",
    manufacturer: "Microsoft",
    category: "Developer Tools",
    subcategory: "Version Control",
    productType: "saas",
    description: "Code hosting and collaboration platform with Git repos, issues, pull requests, and Actions.",
    price: 4,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "productivity",
    features: ["Git Repos", "Issues", "Pull Requests", "Actions"],
  },
  {
    productName: "Zapier",
    productSlug: "zapier",
    manufacturer: "Zapier",
    category: "Automation",
    subcategory: "Workflow Automation",
    productType: "saas",
    description: "No-code automation platform with zaps, multi-step workflows, filters, and formatters.",
    price: 19.99,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "ai_workflow",
    features: ["Zaps", "Multi-step Workflows", "Filters", "Formatters"],
  },
  {
    productName: "Grammarly",
    productSlug: "grammarly",
    manufacturer: "Grammarly",
    category: "Writing",
    subcategory: "AI Writing Assistant",
    productType: "saas",
    description: "AI writing assistant for grammar checking, tone detection, plagiarism checking, and generative AI.",
    price: 12,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "productivity",
    features: ["Grammar Check", "Tone Detection", "Plagiarism Check", "Generative AI"],
  },
];

/** Map of hub slugs to their display names */
export const HUB_SLUGS: Record<string, { name: string; description: string }> = {
  productivity: {
    name: "Productivity Software",
    description: "Best productivity tools, task managers, and workflow software reviewed with Trust Scores.",
  },
  ai_workflow: {
    name: "AI Workflow Automation",
    description: "AI-powered workflow tools and automation platforms compared by integration depth and trust.",
  },
  collaboration: {
    name: "Collaboration Tools",
    description: "Team communication and collaboration platforms scored for privacy, security, and integrations.",
  },
  martech: {
    name: "Marketing Technology",
    description: "CRM and marketing automation tools analyzed for trust, TCO, and ecosystem fit.",
  },
  intelligent_home: {
    name: "Smart Home Devices",
    description: "Smart home hubs, security cameras, and IoT devices tested for privacy and Matter protocol support.",
  },
  hybrid_office: {
    name: "Hybrid Office",
    description: "Remote work tools, video conferencing, and office productivity solutions reviewed.",
  },
};
