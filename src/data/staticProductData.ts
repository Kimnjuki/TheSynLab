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
  /** FAQ Q&A pairs for FAQPage schema */
  faqs: { question: string; answer: string }[];
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

/** FAQ data per hub for hub page FAQPage schema */
export const HUB_FAQS: Record<string, { question: string; answer: string }[]> = {
  productivity: [
    { question: "What is the best productivity tool for small teams?", answer: "ClickUp is the best all-in-one productivity tool for small teams due to its free tier, custom views, and built-in docs. It combines task management, goals, and chat in one platform." },
    { question: "Which productivity tool has the lowest total cost of ownership?", answer: "Todoist has the lowest TCO at $48/year per seat, followed by Notion at $120/year. Both offer generous free tiers for individual use." },
    { question: "Is Notion better than Confluence for documentation?", answer: "Notion is better for startups and small teams due to its flexible block editor and lower price. Confluence is better for enterprise teams that need strict permissions and integrations with Jira." },
    { question: "Which project management tool is best for Agile teams?", answer: "Asana and ClickUp both support Agile workflows well. ClickUp offers Sprint Points and velocity tracking, while Asana's Timeline and custom fields work well for Agile planning." },
    { question: "What is the best free task management tool?", answer: "Todoist and ClickUp both offer robust free tiers. Todoist is best for personal task management, while ClickUp's free tier supports team collaboration with multiple views." },
  ],
  collaboration: [
    { question: "What is the best team collaboration platform for enterprise?", answer: "Microsoft Teams and Slack are the top enterprise collaboration platforms. Teams wins on Office 365 integration, while Slack excels at integrations with third-party apps via its app directory." },
    { question: "Is Discord better than Slack for community management?", answer: "Yes, Discord is better for community management with its server roles, voice channels, and moderation tools. Slack is better for workplace communication and has more enterprise features." },
    { question: "Which collaboration tool has the lowest TCO?", answer: "Discord has the lowest TCO at $0 for most use cases. Slack starts at $96/year for paid plans, while Microsoft Teams is included with Microsoft 365 subscriptions." },
    { question: "Can Microsoft Teams replace Slack for workplace communication?", answer: "Yes, Teams can replace Slack for organizations already using Microsoft 365. Teams offers similar channel-based communication plus native video calling, file storage, and Office app integration." },
  ],
  ai_workflow: [
    { question: "What is the best AI tool for workflow automation?", answer: "Zapier is the best AI-powered workflow automation tool with 6,000+ app integrations and AI-powered natural language step creation. Make (formerly Integromat) offers more complex scenarios for power users." },
    { question: "Which AI workflow tool has the best integration ecosystem?", answer: "Zapier leads with 6,000+ integrations. Make offers more flexible data transformation and routing. For code-heavy workflows, GitHub Actions offers full CI/CD integration." },
    { question: "Can Grammarly integrate with my existing workflow tools?", answer: "Yes, Grammarly integrates with most major browsers, Microsoft Office, Google Docs, Slack, and enterprise tools. Its API allows custom integrations for enterprise workflows." },
    { question: "What is the best no-code automation tool?", answer: "Zapier is the best no-code automation tool for beginners with its intuitive editor. Make offers more powerful scenarios for advanced users. Both support conditional logic and multi-step workflows." },
  ],
  martech: [
    { question: "What is the best marketing automation platform?", answer: "HubSpot is the best all-in-one marketing automation platform with CRM, email marketing, landing pages, and analytics. It offers the most complete solution but at a premium price." },
    { question: "Can Canva replace professional design tools?", answer: "Canva is excellent for social media graphics, presentations, and marketing collateral. For professional print design, photo editing, or vector illustration, Adobe Creative Cloud offers superior tools." },
    { question: "Which martech tool offers the best ROI?", answer: "HubSpot offers the best ROI for businesses that use multiple marketing channels. Canva offers the best ROI for design needs at $119/year vs Adobe Creative Cloud at $660/year." },
  ],
  intelligent_home: [
    { question: "What is the best smart home hub?", answer: "Home Assistant is the best smart home hub for privacy-focused users with 100% local processing. Amazon Echo Plus has built-in Zigbee but limited local control. Apple HomePod offers good privacy with HomeKit integration." },
    { question: "Which smart home platform is most secure?", answer: "Home Assistant with 100% local processing is the most secure. Apple HomeKit is second with end-to-end encryption. Amazon and Google platforms process data in the cloud, which adds privacy risks." },
    { question: "Do I need a smart home hub or can I use app-only?", answer: "You can start app-only with WiFi devices from Amazon, Google, or Apple. A dedicated hub (like Hubitat, Home Assistant, or SmartThings) becomes necessary for Zigbee, Z-Wave, and Thread devices." },
  ],
  hybrid_office: [
    { question: "What is the best video conferencing tool for hybrid teams?", answer: "Microsoft Teams offers the best hybrid meeting experience with Teams Rooms integration, together mode, and breakout rooms. Zoom is the most reliable and feature-rich for video-first communication." },
    { question: "Which office hardware is essential for hybrid work?", answer: "Essential hybrid office hardware includes a quality webcam (Logitech Brio 4K), noise-canceling headphones, a good microphone, and proper lighting. Ergonomic peripherals prevent long-term strain." },
    { question: "What is the most secure remote work setup?", answer: "Zero-trust architecture with VPN, password manager (Bitwarden), encrypted communication, and 2FA. A VLAN separates work and personal devices. Regular security audits are essential." },
  ],
};

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
    faqs: [
      { question: "Is ClickUp free?", answer: "Yes, ClickUp has a robust free tier with unlimited tasks, 100MB storage, and access to 11+ views. Paid plans start at $5/user/month." },
      { question: "Does ClickUp have time tracking?", answer: "Yes, ClickUp has built-in time tracking with a timer, manual entry, and time estimates. The free tier includes time tracking." },
      { question: "Can ClickUp replace Jira for development teams?", answer: "Yes, ClickUp offers Sprint Points, velocity tracking, and a developer-focused view. Many teams use it as a Jira alternative." },
    ],
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
    faqs: [
      { question: "Is Todoist good for team collaboration?", answer: "Todoist supports basic team collaboration with shared projects and task assignments. For complex project management, ClickUp or Asana offer more features." },
      { question: "Does Todoist work offline?", answer: "Yes, Todoist works fully offline on all platforms. Tasks sync automatically when connectivity is restored." },
    ],
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
    faqs: [
      { question: "Is Asana free for small teams?", answer: "Asana's free tier supports up to 15 members with basic task management and list/board views. Premium starts at $10.99/user/month." },
      { question: "Does Asana have Gantt charts?", answer: "Yes, Asana's Timeline feature provides a Gantt-style view for project scheduling and dependencies. It's available on Premium plans." },
    ],
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
    faqs: [
      { question: "Is Notion free?", answer: "Notion offers a generous free tier for personal use with unlimited pages and blocks. Team plans start at $10/user/month with unlimited file uploads." },
      { question: "Does Notion work offline?", answer: "Notion is primarily web-dependent. Limited offline caching exists on mobile, but there is no full offline mode for desktop." },
      { question: "What are the main differences between Notion and Confluence?", answer: "Notion is more flexible with its block editor and better for startups. Confluence is better for enterprise documentation with Jira integration and page hierarchy." },
    ],
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
    faqs: [
      { question: "Is Slack free?", answer: "Slack offers a free tier with 90-day message history, 10 apps, and one-to-one video calls. Paid plans start at $8.25/user/month." },
      { question: "Can I use Slack for external communication?", answer: "Yes, Slack Connect allows direct messaging with people outside your organization. Free tier includes one Slack Connect channel." },
      { question: "What integrations does Slack support?", answer: "Slack supports over 2,400 integrations including Google Drive, Salesforce, Zoom, Jira, GitHub, and custom apps via their API." },
    ],
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
    faqs: [
      { question: "Is Canva free to use?", answer: "Yes, Canva has a free tier with thousands of templates and 5GB storage. Pro plan is $119/year with AI features, brand kits, and transparent backgrounds." },
      { question: "Can Canva replace Photoshop?", answer: "Canva can replace Photoshop for social media graphics, presentations, and marketing materials. For professional photo editing, print design, or complex composites, Photoshop is still superior." },
    ],
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
    faqs: [
      { question: "Is HubSpot free?", answer: "HubSpot offers a free CRM with contact management, deals, tasks, and email tracking. Paid plans start at $45/month for Marketing Hub Starter." },
      { question: "What is the difference between HubSpot and Salesforce?", answer: "HubSpot is easier to set up and use, focused on inbound marketing and SMBs. Salesforce is more customizable and scales to enterprise, but requires significant setup." },
    ],
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
    faqs: [
      { question: "Is GitHub free for private repositories?", answer: "Yes, GitHub offers unlimited private repositories for free, with up to 3 collaborators per repo. Team plans start at $4/user/month." },
      { question: "What is GitHub Copilot?", answer: "GitHub Copilot is an AI pair programmer that suggests code completions in real-time. It integrates with VS Code, JetBrains, and other major IDEs." },
    ],
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
    faqs: [
      { question: "Is Zapier free?", answer: "Zapier offers a free tier with 100 tasks/month and 5 single-step Zaps. Paid plans start at $19.99/month with multi-step Zaps and filters." },
      { question: "What is the difference between Zapier and Make?", answer: "Zapier is easier to use with 5,000+ integrations. Make offers more powerful data transformation and is cheaper at scale, but has a steeper learning curve." },
    ],
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
    faqs: [
      { question: "Is Grammarly free?", answer: "Grammarly offers a free tier with basic grammar and spelling checks. Premium ($12/month) adds full-sentence rewrites, tone suggestions, and plagiarism detection." },
      { question: "Does Grammarly work with Google Docs?", answer: "Yes, Grammarly integrates with Google Docs through its browser extension. Premium features like tone detection and full-sentence rewrites work within Google Docs." },
    ],
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
    faqs: [
      { question: "Is Microsoft Teams free?", answer: "Microsoft Teams offers a free tier with unlimited chat, file sharing, and 60-minute group calls. Paid plans start at $4/user/month and include full meeting features." },
      { question: "Can Microsoft Teams replace Zoom?", answer: "Teams can replace Zoom for organizations already using Microsoft 365. Teams offers similar meeting features plus persistent chat, file collaboration, and app integrations." },
    ],
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
    faqs: [
      { question: "Is Discord free?", answer: "Yes, Discord is free to use with unlimited messaging, voice channels, and server creation. Nitro ($9.99/month) adds custom emoji, larger file uploads, and HD streaming." },
      { question: "Is Discord secure for business communication?", answer: "Discord does not offer end-to-end encryption. For business communication, Slack or Microsoft Teams offer better security, compliance, and audit features." },
    ],
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
    faqs: [
      { question: "Is Make free?", answer: "Make offers a free tier with 1,000 operations/month. Paid plans start at $9/month and include more operations and premium apps." },
      { question: "Can Make replace Zapier?", answer: "Yes, Make can replace Zapier for most automation needs. Make offers more powerful data transformation at a lower price point, but has a steeper learning curve." },
    ],
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
    faqs: [
      { question: "Is Confluence free for small teams?", answer: "Confluence offers a free tier for up to 10 users with 2GB storage. Paid plans start at $6/user/month with unlimited storage and advanced permissions." },
      { question: "Can Confluence replace Notion?", answer: "Confluence is better for enterprise documentation with Jira integration and page hierarchy. Notion is better for startups and small teams with its flexible block editor." },
    ],
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
    faqs: [
      { question: "Is ProWritingAid free?", answer: "ProWritingAid offers a free tier with limited analysis. Premium ($10/month) unlocks all 20+ reports including style, readability, and overused words." },
      { question: "What is the difference between ProWritingAid and Grammarly?", answer: "ProWritingAid offers deeper analysis with 20+ reports focused on writing improvement. Grammarly is better for day-to-day grammar checking and works across more apps." },
    ],
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
