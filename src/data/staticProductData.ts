/**
 * Static product data for build-time use (sitemap generation, SEO injection).
 * Mirrors the seed data in convex/seedProductionData.ts.
 * When more products are added via Convex, update this list.
 *
 * trustScore and integrationScore are estimated from public data.
 * These are overridden by Convex runtime data when the SPA hydrates.
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
  /** Estimated Trust Score out of 10 (overridden by Convex at runtime) */
  trustScore: number;
  /** Estimated Integration Score out of 10 */
  integrationScore: number;
  /** Estimated annual TCO per seat in USD */
  estimatedTco: number;
  /** Alternative product slugs for internal linking */
  alternativeSlugs: string[];
  /** Key pros (3-5) */
  pros: string[];
  /** Key cons (3-5) */
  cons: string[];
  /** Best-for tags */
  bestFor: string[];
  /** Structured description paragraphs for SEO */
  longDescription: string;
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
    features: ["Custom Views", "Time Tracking", "Docs", "Goals", "Whiteboards", "Dashboards"],
    trustScore: 7.8,
    integrationScore: 8.2,
    estimatedTco: 120,
    alternativeSlugs: ["asana", "notion", "todoist", "monday-com"],
    pros: ["Highly customizable with 15+ view types", "All-in-one: tasks, docs, chat, goals", "Robust free tier for small teams", "Strong automation engine"],
    cons: ["Can be overwhelming for simple task management", "Mobile app lags behind desktop", "Performance degrades with very large projects"],
    bestFor: ["Project management", "Cross-functional teams", "Agile development"],
    longDescription: "ClickUp is an all-in-one productivity platform that combines task management, document collaboration, goal tracking, and real-time chat. It is designed for teams that want to consolidate their tool stack. ClickUp offers over 15 different views including List, Board, Calendar, Gantt, and Mind Map. Its custom automation engine allows teams to eliminate repetitive work without code."
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
    features: ["Natural Language Input", "Project Templates", "Labels", "Reminders", "Karma Gamification"],
    trustScore: 8.5,
    integrationScore: 6.5,
    estimatedTco: 48,
    alternativeSlugs: ["notion", "asana", "clickup", "things-3"],
    pros: ["Best-in-class natural language date parsing", "Lightning fast and minimal", "Works offline reliably", "Platform coverage: every OS"], 
    cons: ["Limited project management features", "No Gantt or timeline view", "Integrations are basic compared to competitors"],
    bestFor: ["Personal task management", "GTD methodology", "Simple team task lists"],
    longDescription: "Todoist is a task management application known for its speed, simplicity, and natural language input. Powered by Doist, it focuses on getting tasks captured quickly. It uses a Karma system to gamify productivity. Todoist's simplicity is its strength, but it lacks advanced project management features like Gantt charts, dependencies, and native time tracking."
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
    features: ["Timeline", "Portfolios", "Workload", "Goals", "Custom Fields", "Forms"],
    trustScore: 7.2,
    integrationScore: 7.8,
    estimatedTco: 264,
    alternativeSlugs: ["clickup", "monday-com", "notion", "jira"],
    pros: ["Beautiful, intuitive interface", "Strong portfolio and goal tracking", "Excellent for cross-team coordination", "Powerful automation builder"],
    cons: ["No native time tracking (add-on required)", "Limited free tier (15 team max)", "Export options are restricted"],
    bestFor: ["Marketing teams", "Creative workflows", "Cross-department projects"],
    longDescription: "Asana is a work management platform that helps teams organize, track, and manage their work. It offers Timeline (Gantt-style), Portfolios for program-level tracking, and Workload for resource management. Asana excels at coordinating work across departments, especially for marketing and creative teams."
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
    features: ["Block Editor", "Databases", "Templates", "Wiki", "AI Assistant", "Connected Docs"],
    trustScore: 6.8,
    integrationScore: 5.5,
    estimatedTco: 120,
    alternativeSlugs: ["clickup", "confluence", "obsidian", "asana"],
    pros: ["Extremely flexible block-based editor", "Powerful database with multiple views", "Great for internal wikis and documentation", "AI assistant built-in"],
    cons: ["No offline mode (web-dependent)", "Slow performance with large databases", "Limited native integrations", "Export/portability is poor"],
    bestFor: ["Internal knowledge bases", "Startup documentation", "Personal dashboards"],
    longDescription: "Notion is an all-in-one workspace that blends note-taking, project management, databases, and collaboration into a single platform. Its block-based editor allows unprecedented flexibility, letting you build anything from task lists to full CRM dashboards. Notion's database feature is particularly powerful, supporting Table, Board, Calendar, Gallery, List, and Timeline views."
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
    features: ["Channels", "Direct Messages", "Huddles", "Canvas", "Workflow Builder", "Slack Connect"],
    trustScore: 7.0,
    integrationScore: 9.5,
    estimatedTco: 192,
    alternativeSlugs: ["teams", "discord", "mattermost"],
    pros: ["Largest app directory with 2,400+ integrations", "Excellent search across messages and files", "Huddles for quick audio conversations", "Slack Connect for cross-org collaboration"],
    cons: ["Can be noisy and distracting", "Message history limited on free tier", "High cost at scale ($8+/user/month)", "Video calls less polished than Zoom"],
    bestFor: ["Team communication", "Remote/hybrid teams", "Integration-heavy workflows"],
    longDescription: "Slack is a team messaging and collaboration platform owned by Salesforce. It organizes conversations into channels for different topics, projects, or teams. Slack's key differentiator is its massive integration ecosystem — over 2,400 apps and tools connect directly to Slack, making it the central hub for many organizations. Slack Connect allows messaging with people outside your organization."
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
    features: ["Templates", "Drag & Drop Editor", "Brand Kit", "Magic Studio", "Background Remover", "Team Collaboration"],
    trustScore: 7.5,
    integrationScore: 6.0,
    estimatedTco: 156,
    alternativeSlugs: ["figma", "adobe-express", "photopea", "pixlr"],
    pros: ["Massive template library (250,000+)", "Extremely beginner-friendly", "AI features in Magic Studio", "Excellent brand kit and team features"],
    cons: ["Limited vector editing compared to Illustrator", "No true print-ready export", "Some templates require Pro subscription"],
    bestFor: ["Social media graphics", "Marketing materials", "Non-designers creating content"],
    longDescription: "Canva is an online graphic design platform that democratizes design by making it accessible to non-designers. It offers hundreds of thousands of templates for social media, presentations, posters, videos, and more. Canva's Magic Studio adds AI-powered features including text-to-image, Magic Eraser, and AI-powered copywriting."
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
    features: ["CRM", "Email Marketing", "Social Media", "Analytics", "Live Chat", "Pipeline Management"],
    trustScore: 7.8,
    integrationScore: 8.5,
    estimatedTco: 1080,
    alternativeSlugs: ["salesforce", "pipedrive", "zoho", "freshworks"],
    pros: ["Unified platform: marketing, sales, service, CMS", "Free CRM is genuinely useful", "Excellent onboarding and academy resources", "Powerful automation and workflows"],
    cons: ["Expensive at scale (hub tiers escalate quickly)", "Complex setup for advanced features", "Some features require high-tier subscriptions"],
    bestFor: ["Growing SMBs", "Inbound marketing", "Sales pipeline management"],
    longDescription: "HubSpot is an all-in-one CRM platform that brings together marketing, sales, content management, and customer service. Its 'flywheel' model focuses on customer delight rather than just conversion. HubSpot offers a free tier of its CRM that includes contact management, deal tracking, and meeting scheduling."
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
    features: ["Git Repos", "Issues", "Pull Requests", "Actions", "Copilot", "Pages"],
    trustScore: 8.2,
    integrationScore: 9.2,
    estimatedTco: 96,
    alternativeSlugs: ["gitlab", "bitbucket", "sourcehut"],
    pros: ["Largest code hosting platform (100M+ repos)", "GitHub Actions for CI/CD", "Copilot AI pair programming", "Excellent community features (forks, stars, discussions)"],
    cons: ["Free tier limits private repo collaborators", "Actions minutes cap on free plan", "Advanced features require Team/Enterprise plans"],
    bestFor: ["Open source projects", "Software development teams", "CI/CD pipelines"],
    longDescription: "GitHub is the world's largest code hosting platform, acquired by Microsoft in 2018. It hosts over 100 million repositories and is the de facto standard for open source development. GitHub provides Git repository hosting with features including pull requests, code review, issue tracking, GitHub Actions for CI/CD, and GitHub Copilot for AI-assisted coding."
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
    features: ["Zaps", "Multi-step Workflows", "Filters", "Formatters", "Paths", "Webhooks"],
    trustScore: 8.0,
    integrationScore: 9.8,
    estimatedTco: 480,
    alternativeSlugs: ["make", "n8n", "ifttt"],
    pros: ["5,000+ app integrations", "Easiest no-code automation builder", "Multi-step Zaps with paths and filters", "Excellent documentation and templates"],
    cons: ["Expensive at scale (task limits on every plan)", "Complex logic requires paid tiers", "No real-time triggers on most apps"],
    bestFor: ["Marketing automation", "Sales workflows", "Small team process automation"],
    longDescription: "Zapier is the leading no-code automation platform that connects 5,000+ apps to automate workflows. Zaps can be simple single-step automations or complex multi-step workflows with conditional logic (Paths), data formatting, and webhook triggers. Zapier handles authentication and API differences between apps so users can focus on the workflow logic."
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
    features: ["Grammar Check", "Tone Detection", "Plagiarism Check", "Generative AI", "Full-Width Rewrites"],
    trustScore: 6.5,
    integrationScore: 7.0,
    estimatedTco: 144,
    alternativeSlugs: ["proWritingAid", "hemingway", "languagetool"],
    pros: ["Works everywhere: browser, desktop, mobile", "Tone detection helps adjust writing", "Generative AI for full sentence rewrites", "Plagiarism checker included in Premium"],
    cons: ["Privacy concerns (all text sent to Grammarly servers)", "Premium is expensive at $12/month", "Sometimes incorrect grammar suggestions"],
    bestFor: ["Professional communication", "Academic writing", "Non-native English speakers"],
    longDescription: "Grammarly is an AI-powered writing assistant that checks grammar, spelling, punctuation, clarity, engagement, and delivery. It offers a browser extension that works across websites, a desktop app, and mobile keyboard. Grammarly Premium adds full-sentence rewrites, tone suggestions, plagiarism detection, and genre-specific writing style recommendations."
  },

  {
    productName: "Microsoft Teams",
    productSlug: "teams",
    manufacturer: "Microsoft",
    category: "Collaboration",
    subcategory: "Team Messaging",
    productType: "saas",
    description: "Microsoft 365 team collaboration platform with chat, video meetings, and Office integration.",
    price: 4,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "collaboration",
    features: ["Channels", "Video Meetings", "Office Integration", "SharePoint", "Tasks by Planner", "Apps"],
    trustScore: 6.2,
    integrationScore: 7.8,
    estimatedTco: 96,
    alternativeSlugs: ["slack", "discord", "mattermost"],
    pros: ["Deep Office 365 integration", "Teams Premium adds AI meeting recaps", "Excellent enterprise compliance", "Guest access for external partners"],
    cons: ["Complex admin interface", "Performance can be sluggish on older hardware", "Channel threading is confusing"],
    bestFor: ["Enterprise organizations", "Office 365 shops", "Large team collaboration"],
    longDescription: "Microsoft Teams is a collaboration platform that combines chat, video calls, file storage, and Office 365 integration. It is widely adopted by enterprises using Microsoft 365. Teams offers channels organized by project or topic, integrated Office apps including Word, Excel, and PowerPoint co-editing, and advanced meeting features like background effects and breakout rooms."
  },
  {
    productName: "Discord",
    productSlug: "discord",
    manufacturer: "Discord",
    category: "Collaboration",
    subcategory: "Voice/Text Chat",
    productType: "saas",
    description: "Voice, video, and text communication platform designed for communities and teams.",
    price: 0,
    priceCurrency: "USD",
    priceModel: "freemium",
    hub: "collaboration",
    features: ["Voice Channels", "Text Channels", "Video Calls", "Server Organization", "Integrations", "Stage Events"],
    trustScore: 5.5,
    integrationScore: 5.8,
    estimatedTco: 0,
    alternativeSlugs: ["slack", "teams", "guilded"],
    pros: ["Free voice chat with low latency", "Excellent server organization with roles", "Large community and game developer base", "Good moderation tools"],
    cons: ["Privacy concerns (data collection)", "No end-to-end encryption", "Limited enterprise features", "Video quality lower than Zoom/Meet"],
    bestFor: ["Gaming communities", "Open source communities", "Social groups and clubs"],
    longDescription: "Discord is a voice, video, and text communication platform originally built for gaming that has expanded to general communities. It organizes conversations into servers containing text and voice channels. Discord offers role-based permissions, server moderation bots, and integrations with services like YouTube, Twitch, and Twitter."
  },
  {
    productName: "Make",
    productSlug: "make",
    manufacturer: "Celonis",
    category: "Automation",
    subcategory: "Visual Workflow Automation",
    productType: "saas",
    description: "Visual automation platform (formerly Integromat) with scenario builder, filters, and router logic.",
    price: 9,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "ai_workflow",
    features: ["Scenario Builder", "Filters", "Routers", "Webhooks", "Connectors", "Error Handling"],
    trustScore: 7.8,
    integrationScore: 8.5,
    estimatedTco: 216,
    alternativeSlugs: ["zapier", "n8n", "ifttt"],
    pros: ["More affordable than Zapier at scale", "Powerful visual scenario builder", "Advanced data transformation tools", "Real-time triggers available"],
    cons: ["Steeper learning curve than Zapier", "Fewer total connectors (~1,500 vs Zapier's 5,000+)", "Free tier has limited operations"],
    bestFor: ["Complex multi-step automations", "Data transformation pipelines", "Cost-conscious teams"],
    longDescription: "Make (formerly Integromat) is a visual automation platform acquired by Celonis. It lets users create complex multi-branch automations using a visual scenario builder. Make excels at data transformation, allowing mapping, filtering, aggregating, and transforming data between apps without code."
  },
  {
    productName: "Confluence",
    productSlug: "confluence",
    manufacturer: "Atlassian",
    category: "Productivity Software",
    subcategory: "Wiki and Knowledge Base",
    productType: "saas",
    description: "Team knowledge base and collaboration wiki with whiteboards, databases, and templates.",
    price: 6,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "productivity",
    features: ["Pages", "Whiteboards", "Databases", "Templates", "Gliffy Diagrams", "Jira Integration"],
    trustScore: 7.0,
    integrationScore: 7.5,
    estimatedTco: 144,
    alternativeSlugs: ["notion", "obsidian", "clickup"],
    pros: ["Excellent enterprise wiki features", "Deep Jira integration", "Whiteboards for real-time collaboration", "Page tree organization scales well"],
    cons: ["Expensive at scale ($6+/user)", "Editor feels dated compared to Notion", "Search can be slow on large instances"],
    bestFor: ["Enterprise documentation", "Technical documentation", "Agile teams using Jira"],
    longDescription: "Confluence is Atlassian's team collaboration and knowledge base platform. It provides pages organized in a hierarchy, team whiteboards, and a new database feature for structured information. Confluence integrates deeply with Jira and offers templates for meeting notes and project plans."
  },
  {
    productName: "ProWritingAid",
    productSlug: "prowritingaid",
    manufacturer: "ProWritingAid",
    category: "Writing",
    subcategory: "AI Writing Assistant",
    productType: "saas",
    description: "In-depth writing analysis with style suggestions, grammar checking, and readability scores.",
    price: 10,
    priceCurrency: "USD",
    priceModel: "subscription",
    hub: "productivity",
    features: ["Grammar Check", "Style Guide", "Readability", "Plagiarism Check", "Contextual Thesaurus", "Reports"],
    trustScore: 7.2,
    integrationScore: 5.0,
    estimatedTco: 120,
    alternativeSlugs: ["grammarly", "hemingway", "languagetool"],
    pros: ["Deepest analysis of any writing tool (20+ reports)", "Style guide customization for brand voice", "Excellent for long-form writing", "Desktop app for offline use"],
    cons: ["Fewer native integrations than Grammarly", "UI is more technical", "No generative AI features"],
    bestFor: ["Creative writing", "Academic papers", "Authors and professional writers"],
    longDescription: "ProWritingAid is a comprehensive writing assistant that provides detailed analysis across 20+ reports including grammar, style, readability, pacing, and overused words. It focuses on in-depth writing improvement for long-form content and integrates with Word, Google Docs, and Scrivener."
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
