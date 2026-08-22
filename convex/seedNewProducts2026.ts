/**
 * 2026 Product Catalog Expansion — new products categorized by FUNCTIONALITY.
 *
 * Every product carries:
 *   - primaryFunctionality: the single functional role it plays in a stack
 *   - functionalityTags:    supporting functional tags for filtering/recommendations
 *   - category/subcategory: human-readable taxonomy (existing schema fields)
 *   - hub:                  one of the site's content hubs
 *   - featuredImageUrl + galleryImages: curated free Unsplash imagery so every
 *     product detail page renders a full visual story out of the box.
 *
 * Idempotent — safe to run repeatedly with:
 *   npx convex run seedNewProducts2026:seedNewProducts
 */
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { PRODUCT_IMAGE_MAP, resolveProductGallery } from "./productImageMap";

type NewProduct = {
  productName: string;
  productSlug: string;
  manufacturer: string;
  hub: string;
  category: string;
  subcategory: string;
  productType: "software" | "hardware" | "service";
  price: number;
  priceCurrency: string;
  priceModel: "subscription" | "one_time" | "freemium";
  description: string;
  features: string[];
  officialWebsite: string;
  primaryFunctionality: string;
  functionalityTags: string[];
  verdictSummary: string;
  pricingTier: "$" | "$$" | "$$$";
};

const NEW_PRODUCTS: NewProduct[] = [
  // ================= E-COMMERCE & PAYMENTS =================
  {
    productName: "Shopify",
    productSlug: "shopify",
    manufacturer: "Shopify Inc.",
    hub: "martech",
    category: "E-commerce",
    subcategory: "Online Store Platform",
    productType: "software",
    price: 29,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "All-in-one e-commerce platform for building online stores, managing inventory, payments, shipping, and multichannel sales.",
    features: ["Online Store Builder", "Shopify Payments", "Inventory Management", "POS", "App Store (8,000+ apps)", "Multichannel Sales"],
    officialWebsite: "https://www.shopify.com",
    primaryFunctionality: "ecommerce-platform",
    functionalityTags: ["ecommerce-platform", "payments-finance", "inventory-management"],
    verdictSummary:
      "The default choice for launching a serious online store — unmatched app ecosystem and checkout reliability, but transaction fees add up off-platform.",
    pricingTier: "$$",
  },
  {
    productName: "Stripe",
    productSlug: "stripe",
    manufacturer: "Stripe Inc.",
    hub: "martech",
    category: "Finance",
    subcategory: "Payment Processing",
    productType: "software",
    price: 0,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Developer-first payment processing platform with APIs for cards, wallets, subscriptions, invoicing, and fraud prevention.",
    features: ["Payment APIs", "Subscriptions & Billing", "Checkout Sessions", "Radar Fraud Detection", "Invoicing", "Connect Marketplace"],
    officialWebsite: "https://stripe.com",
    primaryFunctionality: "payments-finance",
    functionalityTags: ["payments-finance", "developer-tools", "billing-invoicing"],
    verdictSummary:
      "Best-in-class payments infrastructure for SaaS and marketplaces. Pay-per-transaction pricing is transparent; deep customization requires engineering time.",
    pricingTier: "$$",
  },
  {
    productName: "Square",
    productSlug: "square",
    manufacturer: "Block, Inc.",
    hub: "martech",
    category: "Finance",
    subcategory: "Point of Sale",
    productType: "software",
    price: 0,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Point-of-sale and payment platform for retail and food service with hardware, invoicing, and online store options.",
    features: ["POS Software", "Card Readers", "Invoices", "Online Store", "Payroll Add-on", "Loyalty Programs"],
    officialWebsite: "https://squareup.com",
    primaryFunctionality: "payments-finance",
    functionalityTags: ["payments-finance", "point-of-sale", "retail-operations"],
    verdictSummary:
      "The simplest way for small physical businesses to take payments — flat transparent fees and free software, though advanced retail needs add-ons.",
    pricingTier: "$",
  },
  {
    productName: "QuickBooks Online",
    productSlug: "quickbooks",
    manufacturer: "Intuit",
    hub: "hybrid_office",
    category: "Finance",
    subcategory: "Accounting Software",
    productType: "software",
    price: 30,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Small-business accounting platform with invoicing, expense tracking, bank reconciliation, payroll integration, and tax preparation.",
    features: ["Invoicing", "Expense Tracking", "Bank Reconciliation", "Reports & Cash Flow", "Mileage Tracking", "Payroll Integration"],
    officialWebsite: "https://quickbooks.intuit.com",
    primaryFunctionality: "payments-finance",
    functionalityTags: ["payments-finance", "accounting-bookkeeping", "invoicing"],
    verdictSummary:
      "The accounting standard for small businesses — accountants know it, banks integrate with it, but the subscription tiers escalate quickly.",
    pricingTier: "$$",
  },

  // ================= DESIGN & CREATIVE =================
  {
    productName: "Figma",
    productSlug: "figma",
    manufacturer: "Figma, Inc.",
    hub: "productivity",
    category: "Design",
    subcategory: "UI/UX Design",
    productType: "software",
    price: 12,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Collaborative interface design tool with real-time multiplayer editing, prototyping, design systems, and developer handoff.",
    features: ["Multiplayer Editing", "Prototyping", "Design Systems", "Dev Mode Handoff", "FigJam Whiteboards", "Plugins"],
    officialWebsite: "https://www.figma.com",
    primaryFunctionality: "design-creative",
    functionalityTags: ["design-creative", "prototyping", "team-communication"],
    verdictSummary:
      "The industry-standard UI design tool — real-time collaboration is unmatched, and Dev Mode makes handoff painless. Vector editing trails Illustrator.",
    pricingTier: "$$",
  },
  {
    productName: "Adobe Express",
    productSlug: "adobe-express",
    manufacturer: "Adobe",
    hub: "productivity",
    category: "Design",
    subcategory: "Quick Design",
    productType: "software",
    price: 9.99,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Adobe's quick-design tool for social graphics, flyers, and short videos with Firefly AI generation and brand kits.",
    features: ["Templates", "Firefly AI Generation", "Brand Kits", "Video Editing", "PDF Tools", "Content Scheduler"],
    officialWebsite: "https://www.adobe.com/express",
    primaryFunctionality: "design-creative",
    functionalityTags: ["design-creative", "social-media-content"],
    verdictSummary:
      "A strong Canva alternative for teams already in the Adobe ecosystem — Firefly AI is excellent, but the template library is smaller than Canva's.",
    pricingTier: "$",
  },

  // ================= DEVELOPER TOOLS =================
  {
    productName: "Jira",
    productSlug: "jira",
    manufacturer: "Atlassian",
    hub: "productivity",
    category: "Developer Tools",
    subcategory: "Issue Tracking",
    productType: "software",
    price: 7.75,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Agile issue tracking and project management for software teams with Scrum/Kanban boards, roadmaps, and deep dev-tool integrations.",
    features: ["Scrum & Kanban Boards", "Backlogs & Sprints", "Roadmaps", "Automation Rules", "JQL Search", "DevOps Integrations"],
    officialWebsite: "https://www.atlassian.com/software/jira",
    primaryFunctionality: "project-management",
    functionalityTags: ["project-management", "issue-tracking", "agile-scrum", "developer-tools"],
    verdictSummary:
      "Still the enterprise standard for Agile software delivery — powerful but heavy. Small teams will find ClickUp or Linear faster to live in.",
    pricingTier: "$$",
  },
  {
    productName: "GitLab",
    productSlug: "gitlab",
    manufacturer: "GitLab Inc.",
    hub: "productivity",
    category: "Developer Tools",
    subcategory: "DevOps Platform",
    productType: "software",
    price: 29,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Complete DevOps platform combining Git repositories, CI/CD pipelines, security scanning, and release management in one application.",
    features: ["Git Repositories", "CI/CD Pipelines", "Built-in Container Registry", "Security Scanning", "Issue Boards", "Self-Managed Option"],
    officialWebsite: "https://about.gitlab.com",
    primaryFunctionality: "developer-tools",
    functionalityTags: ["developer-tools", "version-control", "cicd-pipelines"],
    verdictSummary:
      "The best single-application DevOps platform — CI/CD is built in rather than bolted on. The trade-off is a heavier footprint than GitHub for simple repos.",
    pricingTier: "$$$",
  },
  {
    productName: "Bitbucket",
    productSlug: "bitbucket",
    manufacturer: "Atlassian",
    hub: "productivity",
    category: "Developer Tools",
    subcategory: "Code Hosting",
    productType: "software",
    price: 3,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Git code hosting with built-in CI/CD (Pipelines) and native Jira integration for Atlassian-centric teams.",
    features: ["Git Repositories", "Bitbucket Pipelines", "Jira Integration", "Pull Requests", "Snippets", "IP Allowlisting"],
    officialWebsite: "https://bitbucket.org",
    primaryFunctionality: "developer-tools",
    functionalityTags: ["developer-tools", "version-control", "cicd-pipelines"],
    verdictSummary:
      "A pragmatic code host for Jira shops — Pipelines are convenient, but the ecosystem and community are far smaller than GitHub's.",
    pricingTier: "$",
  },
  {
    productName: "Visual Studio Code",
    productSlug: "vs-code",
    manufacturer: "Microsoft",
    hub: "productivity",
    category: "Developer Tools",
    subcategory: "Code Editor",
    productType: "software",
    price: 0,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Free, extensible source-code editor with IntelliSense, integrated terminal, debugging, Copilot AI, and a massive extension marketplace.",
    features: ["IntelliSense", "Integrated Terminal & Debugger", "GitHub Copilot", "Extension Marketplace", "Remote Development", "Settings Sync"],
    officialWebsite: "https://code.visualstudio.com",
    primaryFunctionality: "developer-tools",
    functionalityTags: ["developer-tools", "code-editing", "ai-assistant"],
    verdictSummary:
      "The default editor for most developers — free, fast, endlessly extensible. Telemetry and Microsoft account prompts are the main privacy gripes.",
    pricingTier: "$",
  },

  // ================= COMMUNICATION & MEETINGS =================
  {
    productName: "Zoom",
    productSlug: "zoom",
    manufacturer: "Zoom Communications",
    hub: "collaboration",
    category: "Collaboration",
    subcategory: "Video Conferencing",
    productType: "software",
    price: 13.33,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Video-first communication platform with HD meetings, webinars, AI Companion summaries, and phone add-ons.",
    features: ["HD Video Meetings", "Webinars & Events", "AI Companion Summaries", "Breakout Rooms", "Zoom Phone", "Whiteboards"],
    officialWebsite: "https://zoom.us",
    primaryFunctionality: "video-conferencing",
    functionalityTags: ["video-conferencing", "webinars", "meeting-notes"],
    verdictSummary:
      "The most reliable video conferencing experience at scale — 40-minute free-tier cap pushes teams to Pro, where AI Companion adds real meeting value.",
    pricingTier: "$$",
  },
  {
    productName: "Google Meet",
    productSlug: "google-meet",
    manufacturer: "Google",
    hub: "collaboration",
    category: "Collaboration",
    subcategory: "Video Conferencing",
    productType: "software",
    price: 6,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Browser-based video meetings bundled with Google Workspace, featuring noise cancellation, captions, and Gemini note-taking.",
    features: ["Browser-Based Meetings", "Live Captions", "Gemini Note-Taking", "Noise Cancellation", "Calendar Integration", "Recording"],
    officialWebsite: "https://meet.google.com",
    primaryFunctionality: "video-conferencing",
    functionalityTags: ["video-conferencing", "calendar-integration"],
    verdictSummary:
      "Zero-install video calls that shine inside Google Workspace — Gemini meeting notes are genuinely useful, but webinar tooling lags Zoom.",
    pricingTier: "$",
  },
  {
    productName: "Calendly",
    productSlug: "calendly",
    manufacturer: "Calendly LLC",
    hub: "productivity",
    category: "Productivity Software",
    subcategory: "Scheduling Automation",
    productType: "software",
    price: 10,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Automated scheduling tool that eliminates back-and-forth emails with shareable booking links, round-robin routing, and calendar sync.",
    features: ["Booking Links", "Round-Robin & Collective Events", "Calendar Sync", "Workflow Automations", "Routing Forms", "Payments via Stripe"],
    officialWebsite: "https://calendly.com",
    primaryFunctionality: "scheduling",
    functionalityTags: ["scheduling", "calendar-integration", "workflow-automation"],
    verdictSummary:
      "The easiest way to kill scheduling ping-pong — set up in minutes. Advanced routing requires the higher tiers, which get pricey per seat.",
    pricingTier: "$$",
  },
  {
    productName: "Loom",
    productSlug: "loom",
    manufacturer: "Atlassian",
    hub: "collaboration",
    category: "Collaboration",
    subcategory: "Async Video Messaging",
    productType: "software",
    price: 12.5,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Async video messaging for work — record your screen and camera, share instantly with a link, and let viewers reply on their own time.",
    features: ["Screen & Camera Recording", "Instant Share Links", "AI Titles & Summaries", "Viewer Insights", "Emoji Reactions", "Transcriptions"],
    officialWebsite: "https://www.loom.com",
    primaryFunctionality: "async-video",
    functionalityTags: ["async-video", "team-communication", "meeting-notes"],
    verdictSummary:
      "The fastest way to replace a status meeting — record once, share anywhere. Free tier caps videos at 5 minutes; AI summaries need paid plans.",
    pricingTier: "$$",
  },

  // ================= AI ASSISTANTS =================
  {
    productName: "ChatGPT Plus",
    productSlug: "chatgpt-plus",
    manufacturer: "OpenAI",
    hub: "ai_workflow",
    category: "AI Assistants",
    subcategory: "General AI Assistant",
    productType: "software",
    price: 20,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "OpenAI's flagship AI assistant with GPT-class models, custom GPTs, data analysis, image generation, and voice mode.",
    features: ["Advanced Models", "Custom GPTs", "Data Analysis", "Image Generation", "Voice Mode", "File Uploads"],
    officialWebsite: "https://chatgpt.com",
    primaryFunctionality: "ai-assistant",
    functionalityTags: ["ai-assistant", "content-generation", "data-analysis"],
    verdictSummary:
      "The most capable general-purpose AI assistant for most workflows — Plus unlocks the strongest models, but verify facts; hallucinations persist.",
    pricingTier: "$$",
  },
  {
    productName: "Claude Pro",
    productSlug: "claude-pro",
    manufacturer: "Anthropic",
    hub: "ai_workflow",
    category: "AI Assistants",
    subcategory: "General AI Assistant",
    productType: "software",
    price: 20,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Anthropic's AI assistant known for long-context reasoning, careful writing, Projects for persistent context, and artifact rendering.",
    features: ["Long Context Window", "Projects", "Artifacts", "Document Analysis", "Priority Access", "Style Presets"],
    officialWebsite: "https://claude.ai",
    primaryFunctionality: "ai-assistant",
    functionalityTags: ["ai-assistant", "writing-assistant", "document-analysis"],
    verdictSummary:
      "The best AI assistant for long documents and nuanced writing — Projects keep context organized across sessions. Image generation is absent.",
    pricingTier: "$$",
  },
  {
    productName: "Perplexity Pro",
    productSlug: "perplexity-pro",
    manufacturer: "Perplexity AI",
    hub: "ai_workflow",
    category: "AI Assistants",
    subcategory: "AI Research Engine",
    productType: "software",
    price: 20,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Answer engine that combines LLMs with live web search, providing cited sources for every claim — built for research workflows.",
    features: ["Cited Answers", "Pro Search", "Model Selection", "Spaces (Collections)", "File Analysis", "API Access Credits"],
    officialWebsite: "https://www.perplexity.ai",
    primaryFunctionality: "ai-assistant",
    functionalityTags: ["ai-assistant", "research-search", "cited-sources"],
    verdictSummary:
      "The go-to research assistant when sources matter — inline citations make verification trivial. Depth of analysis trails ChatGPT/Claude on complex reasoning.",
    pricingTier: "$$",
  },
  {
    productName: "Notion AI",
    productSlug: "notion-ai",
    manufacturer: "Notion Labs",
    hub: "productivity",
    category: "AI Assistants",
    subcategory: "Workspace AI Add-on",
    productType: "software",
    price: 10,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "AI add-on for Notion that drafts documents, summarizes pages, answers questions across your workspace, and autofills databases.",
    features: ["Q&A Across Workspace", "Page Summaries", "Database Autofill", "Writing Assistance", "Translation", "Meeting Notes"],
    officialWebsite: "https://www.notion.so/product/ai",
    primaryFunctionality: "knowledge-management",
    functionalityTags: ["knowledge-management", "ai-assistant", "writing-assistant"],
    verdictSummary:
      "The most useful AI add-on if your team already lives in Notion — workspace-wide Q&A beats generic chatbots for internal knowledge retrieval.",
    pricingTier: "$",
  },

  // ================= SECURITY =================
  {
    productName: "1Password",
    productSlug: "1password",
    manufacturer: "AgileBits",
    hub: "hybrid_office",
    category: "Security",
    subcategory: "Password Manager",
    productType: "software",
    price: 3.99,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Password manager for individuals and teams with secure sharing, passkeys, Watchtower breach alerts, and developer secrets management.",
    features: ["Password Vault", "Secure Sharing", "Passkeys Support", "Watchtower Alerts", "1Password CLI & Secrets", "Travel Mode"],
    officialWebsite: "https://1password.com",
    primaryFunctionality: "security-passwords",
    functionalityTags: ["security-passwords", "credential-management", "team-security"],
    verdictSummary:
      "The most polished password manager for teams — secure sharing and developer secrets tooling justify the premium over free alternatives.",
    pricingTier: "$",
  },
  {
    productName: "Bitwarden",
    productSlug: "bitwarden",
    manufacturer: "Bitwarden Inc.",
    hub: "hybrid_office",
    category: "Security",
    subcategory: "Password Manager",
    productType: "software",
    price: 0,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Open-source password manager with unlimited passwords on all devices, self-hosting option, and affordable team plans.",
    features: ["Unlimited Passwords (Free)", "Open Source & Audited", "Self-Hosting Option", "Secure Sharing (Paid)", "Passkeys", "CLI"],
    officialWebsite: "https://bitwarden.com",
    primaryFunctionality: "security-passwords",
    functionalityTags: ["security-passwords", "credential-management", "self-hosted"],
    verdictSummary:
      "The best-value password manager — genuinely usable free tier and open-source transparency. UI polish trails 1Password slightly.",
    pricingTier: "$",
  },

  // ================= KNOWLEDGE, DATA & STORAGE =================
  {
    productName: "Airtable",
    productSlug: "airtable",
    manufacturer: "Airtable",
    hub: "productivity",
    category: "Productivity Software",
    subcategory: "No-Code Database",
    productType: "software",
    price: 20,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Spreadsheet-database hybrid with relational records, multiple views, automations, and interfaces for building lightweight internal apps.",
    features: ["Relational Databases", "Grid/Kanban/Gallery Views", "Automations", "Interfaces Designer", "Forms", "Extensions"],
    officialWebsite: "https://airtable.com",
    primaryFunctionality: "database-spreadsheet",
    functionalityTags: ["database-spreadsheet", "no-code-apps", "workflow-automation"],
    verdictSummary:
      "The sweet spot between spreadsheet familiarity and database power — great for content calendars and CRMs, but record limits bite at scale.",
    pricingTier: "$$",
  },
  {
    productName: "Obsidian",
    productSlug: "obsidian",
    manufacturer: "Dynalist Inc.",
    hub: "productivity",
    category: "Productivity Software",
    subcategory: "Personal Knowledge Management",
    productType: "software",
    price: 0,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Local-first markdown knowledge base with bidirectional linking, graph view, canvas, and 2,000+ community plugins. Your notes stay yours.",
    features: ["Markdown Files", "Bidirectional Linking", "Graph View", "Canvas", "Community Plugins", "Local-First Storage"],
    officialWebsite: "https://obsidian.md",
    primaryFunctionality: "knowledge-management",
    functionalityTags: ["knowledge-management", "note-taking", "local-first"],
    verdictSummary:
      "The privacy champion of knowledge tools — plain markdown files you own forever. Real-time collaboration requires third-party workarounds.",
    pricingTier: "$",
  },
  {
    productName: "Dropbox",
    productSlug: "dropbox",
    manufacturer: "Dropbox, Inc.",
    hub: "collaboration",
    category: "Collaboration",
    subcategory: "Cloud File Storage",
    productType: "software",
    price: 11.99,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Cloud storage and file synchronization with smart sync, version history, Dropbox Paper docs, and transfer of large files.",
    features: ["File Sync & Smart Sync", "Version History", "Dropbox Transfer", "Paper Docs", "Team Spaces", "E-signatures"],
    officialWebsite: "https://www.dropbox.com",
    primaryFunctionality: "file-storage",
    functionalityTags: ["file-storage", "file-syncing", "team-collaboration"],
    verdictSummary:
      "Rock-solid file syncing that still sets the standard for reliability — but per-TB pricing is now uncompetitive against Google Drive bundles.",
    pricingTier: "$$",
  },
  {
    productName: "Trello",
    productSlug: "trello",
    manufacturer: "Atlassian",
    hub: "productivity",
    category: "Productivity Software",
    subcategory: "Kanban Boards",
    productType: "software",
    price: 5,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Visual kanban project management with cards, lists, Power-Ups, automation via Butler, and simple team collaboration.",
    features: ["Kanban Boards", "Butler Automation", "Power-Ups", "Timeline View", "Checklists & Due Dates", "Templates"],
    officialWebsite: "https://trello.com",
    primaryFunctionality: "task-management",
    functionalityTags: ["task-management", "kanban-boards", "visual-planning"],
    verdictSummary:
      "The friendliest kanban board for small projects and personal workflows — simplicity is the feature. Complex project needs outgrow it quickly.",
    pricingTier: "$",
  },

  // ================= CRM & CUSTOMER SUPPORT =================
  {
    productName: "Salesforce Sales Cloud",
    productSlug: "salesforce",
    manufacturer: "Salesforce, Inc.",
    hub: "martech",
    category: "Marketing",
    subcategory: "Enterprise CRM",
    productType: "software",
    price: 25,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "The enterprise CRM standard with customizable objects, Einstein AI forecasting, flow automation, and an enormous AppExchange ecosystem.",
    features: ["Contact & Opportunity Management", "Einstein AI Forecasting", "Flow Automation", "AppExchange (7,000+ apps)", "Reports & Dashboards", "Sales Engagement"],
    officialWebsite: "https://www.salesforce.com",
    primaryFunctionality: "crm-sales",
    functionalityTags: ["crm-sales", "sales-forecasting", "workflow-automation"],
    verdictSummary:
      "Infinitely customizable CRM for complex sales orgs — budget for admin expertise, because setup and per-seat costs compound fast.",
    pricingTier: "$$$",
  },
  {
    productName: "Zoho CRM",
    productSlug: "zoho-crm",
    manufacturer: "Zoho Corporation",
    hub: "martech",
    category: "Marketing",
    subcategory: "CRM",
    productType: "software",
    price: 14,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Affordable, highly customizable CRM with Zia AI assistant, omnichannel engagement, and tight integration with the Zoho suite.",
    features: ["Zia AI Assistant", "Omnichannel Engagement", "Blueprint Process Management", "Canvas Design Studio", "Zoho Suite Integration", "Territory Management"],
    officialWebsite: "https://www.zoho.com/crm/",
    primaryFunctionality: "crm-sales",
    functionalityTags: ["crm-sales", "omnichannel-engagement", "workflow-automation"],
    verdictSummary:
      "The best value-for-money CRM for growing teams — 80% of Salesforce capability at a fraction of the cost, with a steeper initial learning curve.",
    pricingTier: "$$",
  },
  {
    productName: "Freshsales",
    productSlug: "freshsales",
    manufacturer: "Freshworks",
    hub: "martech",
    category: "Marketing",
    subcategory: "CRM",
    productType: "software",
    price: 9,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Modern sales CRM with built-in phone and email, AI-powered lead scoring, visual deal pipelines, and a generous free plan.",
    features: ["Built-in Phone & Email", "Freddy AI Lead Scoring", "Visual Pipelines", "Free Plan Available", "Auto Profile Enrichment", "Sales Sequences"],
    officialWebsite: "https://www.freshworks.com/crm/sales/",
    primaryFunctionality: "crm-sales",
    functionalityTags: ["crm-sales", "lead-scoring", "email-outreach"],
    verdictSummary:
      "The easiest CRM to start selling with — built-in calling/email means zero setup friction. Reporting depth trails HubSpot and Zoho.",
    pricingTier: "$",
  },
  {
    productName: "Intercom",
    productSlug: "intercom",
    manufacturer: "Intercom, Inc.",
    hub: "martech",
    category: "Customer Support",
    subcategory: "Customer Messaging",
    productType: "software",
    price: 39,
    priceCurrency: "USD",
    priceModel: "subscription",
    description:
      "Customer messaging platform combining live chat, Fin AI agent, help center, outbound messaging, and product tours.",
    features: ["Fin AI Agent", "Live Chat & Messenger", "Help Center", "Outbound Messages", "Product Tours", "Ticketing"],
    officialWebsite: "https://www.intercom.com",
    primaryFunctionality: "customer-support",
    functionalityTags: ["customer-support", "live-chat", "ai-assistant"],
    verdictSummary:
      "The most modern support desk — Fin resolves a large share of tickets autonomously. Per-resolution pricing rewards volume but complicates budgeting.",
    pricingTier: "$$$",
  },
  {
    productName: "Freshdesk",
    productSlug: "freshdesk",
    manufacturer: "Freshworks",
    hub: "martech",
    category: "Customer Support",
    subcategory: "Helpdesk Ticketing",
    productType: "software",
    price: 15,
    priceCurrency: "USD",
    priceModel: "freemium",
    description:
      "Helpdesk ticketing system with omnichannel support, Freddy AI copilot, SLA management, and self-service portals.",
    features: ["Omnichannel Ticketing", "Freddy AI Copilot", "SLA Management", "Self-Service Portal", "Collision Detection", "CSAT Surveys"],
    officialWebsite: "https://www.freshworks.com/freshdesk/",
    primaryFunctionality: "customer-support",
    functionalityTags: ["customer-support", "ticketing-helpdesk", "sla-management"],
    verdictSummary:
      "The best-value traditional helpdesk — solid ticketing and SLAs at mid-market prices. Chat UX feels dated next to Intercom.",
    pricingTier: "$$",
  },
];

export const seedNewProducts = mutation({
  args: {},
  returns: v.object({
    inserted: v.number(),
    skipped: v.number(),
    total: v.number(),
  }),
  handler: async (ctx) => {
    let inserted = 0;
    let skipped = 0;

    for (const p of NEW_PRODUCTS) {
      const existing = await ctx.db
        .query("novaProducts")
        .withIndex("by_slug", (q) => q.eq("productSlug", p.productSlug))
        .first();
      if (existing) {
        skipped++;
        continue;
      }

      const heroImage =
        PRODUCT_IMAGE_MAP[p.productSlug] ?? undefined;
      const galleryImages = resolveProductGallery({
        ...p,
        featuredImageUrl: heroImage,
      });

      await ctx.db.insert("novaProducts", {
        productName: p.productName,
        productSlug: p.productSlug,
        manufacturer: p.manufacturer,
        category: p.category,
        subcategory: p.subcategory,
        productType: p.productType,
        productTypeExtended: "saas",
        hub: p.hub,
        price: p.price,
        priceCurrency: p.priceCurrency,
        priceModel: p.priceModel,
        description: p.description,
        features: p.features,
        status: "active",
        isSponsored: false,
        sponsorDisclosed: false,
        featuredImageUrl: heroImage,
        galleryImages,
        officialWebsite: p.officialWebsite,
        seoTitle: `${p.productName} Review ${new Date().getFullYear()} — Trust Score, Integrations & Verdict | TheSynLab`,
        metaDescription: `Independent TheSynLab review of ${p.productName}: trust score, integration depth, TCO, and who should (and shouldn't) use it.`,
        verdictSummary: p.verdictSummary,
        pricingTier: p.pricingTier,
        primaryFunctionality: p.primaryFunctionality,
        functionalityTags: p.functionalityTags,
        createdBy: "seedNewProducts2026",
      });
      inserted++;
    }

    return { inserted, skipped, total: NEW_PRODUCTS.length };
  },
});