import { mutation } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

type ArticleSeed = {
  postTitle: string;
  postSlug: string;
  postType: "pillar" | "segmented-list";
  postStatus: "published";
  hub: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  seoTitle: string;
  metaDescription: string;
  readingTimeMinutes: number;
  wordCount: number;
  tldrSummary: string;
  postContent: string;
  verdictText: string;
  isLivingGuide: boolean;
  schemaMarkup?: Record<string, unknown>;
  bestOfPageMapping: {
    title: string;
    category: string;
    slug: string;
    useCase: string;
    hubSlug: string;
  };
};

const AUTHOR = "editor-synlab";
const DEFAULT_CONTENT =
  "This article is part of TheSynLab 2026 authority series, ranked with Trust and Integration methodology and updated for current market changes.";

const ARTICLES: ArticleSeed[] = [
  {
    postTitle: "Best Productivity Tools 2026: Ranked by Trust & Integration Scores",
    postSlug: "best-productivity-tools-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best productivity tools",
    secondaryKeywords: ["productivity software 2026", "top productivity apps"],
    seoTitle: "Best Productivity Tools 2026: Ranked by Trust & Integration Scores",
    metaDescription: "We tested 80+ productivity tools and ranked them by Trust Score and Integration Score.",
    readingTimeMinutes: 9,
    wordCount: 920,
    tldrSummary: "Notion leads overall, Linear leads privacy, ClickUp leads integration breadth.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Notion edges out most teams while Linear remains strongest for trust-first engineering orgs.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best Productivity Tools 2026" },
    bestOfPageMapping: { title: "Best Productivity Tools 2026", category: "productivity", slug: "best-productivity-tools-2026", useCase: "general-productivity", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Collaboration Software 2026: Top Platforms Tested for Teams of All Sizes",
    postSlug: "best-collaboration-software-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best collaboration software",
    secondaryKeywords: ["team collaboration tools", "collaboration platforms 2026"],
    seoTitle: "Best Collaboration Software 2026: Tested for Trust, Integration & Real-World Team Use",
    metaDescription: "The best collaboration software ranked by real-world testing across team sizes.",
    readingTimeMinutes: 9,
    wordCount: 915,
    tldrSummary: "Slack leads integrations, Teams leads enterprise compliance, Notion leads async documentation.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Choose by communication model: Slack for ecosystems, Teams for compliance-heavy orgs.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best Collaboration Software 2026" },
    bestOfPageMapping: { title: "Best Collaboration Software 2026", category: "collaboration", slug: "best-collaboration-software-2026", useCase: "team-collaboration", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Task Management Software 2026: Ranked for Teams, Freelancers & Enterprises",
    postSlug: "best-task-management-software-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best task management software",
    secondaryKeywords: ["task management tools 2026", "team task management"],
    seoTitle: "Best Task Management Software 2026: Lab-Tested & Ranked by Trust Score",
    metaDescription: "Definitive ranking of task managers by trust, integration, and usability.",
    readingTimeMinutes: 9,
    wordCount: 910,
    tldrSummary: "ClickUp wins flexibility, Asana wins structure, Linear wins security.",
    postContent: DEFAULT_CONTENT,
    verdictText: "ClickUp remains the most balanced choice for mixed teams and scaling operations.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best Task Management Software 2026" },
    bestOfPageMapping: { title: "Best Task Management Software 2026", category: "task-management", slug: "best-task-management-software-2026", useCase: "task-tracking", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Time Tracking Software for Remote Teams 2026 (Ranked by Integration & Trust)",
    postSlug: "best-time-tracking-software-remote-teams-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best time tracking software for remote teams",
    secondaryKeywords: ["remote team time tracking", "timesheet software 2026"],
    seoTitle: "Best Time Tracking Software for Remote Teams 2026: Ranked & Reviewed",
    metaDescription: "Best remote team time tracking tools ranked by Trust and Integration.",
    readingTimeMinutes: 9,
    wordCount: 905,
    tldrSummary: "Toggl Track leads on trust-preserving visibility and remote-friendly integration depth.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Toggl Track is the safest default for remote teams avoiding surveillance-heavy tracking.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Time Tracking Software for Remote Teams 2026" },
    bestOfPageMapping: { title: "Best Time Tracking Software for Remote Teams 2026", category: "time-tracking", slug: "best-time-tracking-software-remote-teams-2026", useCase: "remote-teams", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Note-Taking App for Engineers 2026: Ranked by Integration & Technical Depth",
    postSlug: "best-note-taking-app-engineers-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best note taking app for engineers",
    secondaryKeywords: ["developer note taking apps", "engineering documentation tools"],
    seoTitle: "Best Note-Taking App for Engineers 2026: Ranked for Technical Workflows",
    metaDescription: "Top note-taking tools for engineering workflows, code blocks, and Git integration.",
    readingTimeMinutes: 9,
    wordCount: 908,
    tldrSummary: "Obsidian leads privacy, Notion leads team sharing, Logseq leads graph-first workflows.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Obsidian remains the strongest local-first option for engineering-heavy teams.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Note-Taking Apps for Engineers 2026" },
    bestOfPageMapping: { title: "Best Note-Taking Apps for Engineers 2026", category: "note-taking", slug: "best-note-taking-app-engineers-2026", useCase: "engineers", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Project Management Tools for Agencies 2026: Ranked for Client Work & Creative Teams",
    postSlug: "best-project-management-tools-agencies-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best project management tools for agencies",
    secondaryKeywords: ["agency PM software", "creative agency tools 2026"],
    seoTitle: "Best Project Management Tools for Agencies 2026: Ranked for Client Work",
    metaDescription: "Agency project management platforms ranked for client workflows and billing.",
    readingTimeMinutes: 9,
    wordCount: 912,
    tldrSummary: "Teamwork wins client-service workflows; Monday.com and Asana follow by use-case.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Teamwork remains best for agency billing and client portal workflow maturity.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Project Management Tools for Agencies 2026" },
    bestOfPageMapping: { title: "Best Project Management Tools for Agencies 2026", category: "project-management", slug: "best-project-management-tools-agencies-2026", useCase: "agencies", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Project Management Software for Small Business 2026: Affordable, Scalable & Trustworthy",
    postSlug: "best-project-management-software-small-business-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best project management software for small business",
    secondaryKeywords: ["small business project management", "PM software SMB 2026"],
    seoTitle: "Best Project Management Software for Small Business 2026: Ranked & Tested",
    metaDescription: "Small business project management tools ranked for affordability and integration.",
    readingTimeMinutes: 9,
    wordCount: 907,
    tldrSummary: "ClickUp leads growth path, Asana leads process teams, Basecamp leads flat pricing.",
    postContent: DEFAULT_CONTENT,
    verdictText: "ClickUp is the most scalable SMB default for mixed team complexity.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best Project Management Software for Small Business 2026" },
    bestOfPageMapping: { title: "Best Project Management Software for Small Business 2026", category: "project-management", slug: "best-project-management-software-small-business-2026", useCase: "small-business", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Project Management Tools for Remote-First Teams 2026: Built for Async & Distributed Work",
    postSlug: "best-project-management-tools-remote-first-teams-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best project management tools for remote teams",
    secondaryKeywords: ["remote team project management", "async project management"],
    seoTitle: "Best Project Management Tools for Remote-First Teams 2026: Ranked for Async Work",
    metaDescription: "Remote-first project management platforms ranked for async visibility and trust.",
    readingTimeMinutes: 9,
    wordCount: 910,
    tldrSummary: "Linear and Notion lead for async-heavy remote operations.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Linear is the strongest fit for distributed engineering and async execution rigor.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Project Management Tools for Remote-First Teams 2026" },
    bestOfPageMapping: { title: "Best Project Management Tools for Remote-First Teams 2026", category: "project-management", slug: "best-project-management-tools-remote-first-teams-2026", useCase: "remote-first-teams", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Project Management Software for Startups 2026: Fast Setup, Low Cost, High Scalability",
    postSlug: "best-project-management-software-startups-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best project management software startups",
    secondaryKeywords: ["startup project management tools", "early-stage PM software"],
    seoTitle: "Best Project Management Software for Startups 2026: Fast, Affordable & Scalable",
    metaDescription: "Startup PM software ranked for speed, cost, and long-term scaling viability.",
    readingTimeMinutes: 9,
    wordCount: 903,
    tldrSummary: "Linear leads engineering-first startups; Notion and ClickUp remain cross-functional options.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Linear is the highest-leverage path for engineering-led startup execution.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Project Management Software for Startups 2026" },
    bestOfPageMapping: { title: "Best Project Management Software for Startups 2026", category: "project-management", slug: "best-project-management-software-startups-2026", useCase: "startups", hubSlug: "productivity" },
  },
  {
    postTitle: "Best AI Workflow Automation Tools 2026: Ranked by Integration Score & Real Capability",
    postSlug: "best-ai-workflow-automation-tools-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "ai-workflow",
    primaryKeyword: "best AI workflow automation tools",
    secondaryKeywords: ["AI automation platforms 2026", "workflow automation software"],
    seoTitle: "Best AI Workflow Automation Tools 2026: Ranked by Integration Score & Actual Performance",
    metaDescription: "AI workflow automation tools ranked by production capability and integration depth.",
    readingTimeMinutes: 9,
    wordCount: 915,
    tldrSummary: "Make leads technical depth, Zapier leads usability, n8n leads self-hosted privacy.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Make is the best overall for advanced, model-agnostic workflow orchestration.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best AI Workflow Automation Tools 2026" },
    bestOfPageMapping: { title: "Best AI Workflow Automation Tools 2026", category: "ai-automation", slug: "best-ai-workflow-automation-tools-2026", useCase: "ai-workflow", hubSlug: "ai-workflow" },
  },
  {
    postTitle: "Best No-Code Automation Tools for Teams 2026: Ranked for Non-Developers",
    postSlug: "best-no-code-automation-tools-teams-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "ai-workflow",
    primaryKeyword: "best no-code automation tools for teams",
    secondaryKeywords: ["no code workflow automation", "automation tools non-developers"],
    seoTitle: "Best No-Code Automation Tools for Teams 2026: Ranked for Non-Technical Users",
    metaDescription: "No-code automation tools ranked for non-technical teams and operations workflows.",
    readingTimeMinutes: 9,
    wordCount: 906,
    tldrSummary: "Zapier leads accessibility; Make leads complexity handling; Parabola leads data pipelines.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Zapier remains the fastest path for non-technical automation deployment.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best No-Code Automation Tools for Teams 2026" },
    bestOfPageMapping: { title: "Best No-Code Automation Tools for Teams 2026", category: "automation", slug: "best-no-code-automation-tools-teams-2026", useCase: "non-developers", hubSlug: "ai-workflow" },
  },
  {
    postTitle: "Best AI Writing Tools for Marketing Teams 2026: Ranked by Output Quality & Trust Score",
    postSlug: "best-ai-writing-tools-marketing-teams-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "ai-workflow",
    primaryKeyword: "best AI writing tools for marketing teams",
    secondaryKeywords: ["AI content tools 2026", "marketing AI tools"],
    seoTitle: "Best AI Writing Tools for Marketing Teams 2026: Ranked for Quality, Trust & Integration",
    metaDescription: "AI writing platforms ranked for brand voice consistency and marketing team workflows.",
    readingTimeMinutes: 9,
    wordCount: 908,
    tldrSummary: "Copy.ai leads brand voice; Writer leads compliance; Claude leads long-form quality.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Copy.ai is strongest for multi-writer brand consistency in team marketing ops.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best AI Writing Tools for Marketing Teams 2026" },
    bestOfPageMapping: { title: "Best AI Writing Tools for Marketing Teams 2026", category: "ai-writing", slug: "best-ai-writing-tools-marketing-teams-2026", useCase: "marketing-teams", hubSlug: "ai-workflow" },
  },
  {
    postTitle: "Best Team Communication Tools 2026: Ranked for Async, Real-Time & Hybrid Teams",
    postSlug: "best-team-communication-tools-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "collaboration",
    primaryKeyword: "best team communication tools",
    secondaryKeywords: ["team messaging apps 2026", "internal communication platforms"],
    seoTitle: "Best Team Communication Tools 2026: Ranked by Trust, Integration & Async Design",
    metaDescription: "Communication tools ranked for hybrid, async, and synchronous teams.",
    readingTimeMinutes: 9,
    wordCount: 904,
    tldrSummary: "Slack leads integration, Teams leads compliance, Loom leads async video.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Slack remains the broadest and most flexible communication operations layer.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best Team Communication Tools 2026" },
    bestOfPageMapping: { title: "Best Team Communication Tools 2026", category: "communication", slug: "best-team-communication-tools-2026", useCase: "team-communication", hubSlug: "collaboration" },
  },
  {
    postTitle: "Best Video Conferencing Software 2026: Ranked for Remote Teams & Hybrid Work",
    postSlug: "best-video-conferencing-software-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "collaboration",
    primaryKeyword: "best video conferencing software",
    secondaryKeywords: ["video meeting tools", "best zoom alternatives 2026"],
    seoTitle: "Best Video Conferencing Software 2026: Ranked for Call Quality, Trust & Integration",
    metaDescription: "Video conferencing platforms ranked by reliability, AI summary quality, and trust.",
    readingTimeMinutes: 9,
    wordCount: 905,
    tldrSummary: "Zoom leads general use; Teams leads compliance-heavy organizations.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Zoom continues to lead for broad use and workflow integration depth.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best Video Conferencing Software 2026" },
    bestOfPageMapping: { title: "Best Video Conferencing Software 2026", category: "video-conferencing", slug: "best-video-conferencing-software-2026", useCase: "remote-teams", hubSlug: "collaboration" },
  },
  {
    postTitle: "Best Async Communication Tools 2026: For Teams That Value Deep Work Over Real-Time Chat",
    postSlug: "best-async-communication-tools-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "collaboration",
    primaryKeyword: "best async communication tools",
    secondaryKeywords: ["asynchronous communication tools 2026", "async-first communication"],
    seoTitle: "Best Async Communication Tools 2026: For Teams That Protect Deep Work",
    metaDescription: "Async communication tools ranked for teams optimizing deep work and context.",
    readingTimeMinutes: 9,
    wordCount: 903,
    tldrSummary: "Loom, Twist, and Notion lead async communication and decision capture.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Loom is still the most practical async communication standard for distributed teams.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Async Communication Tools 2026" },
    bestOfPageMapping: { title: "Best Async Communication Tools 2026", category: "communication", slug: "best-async-communication-tools-2026", useCase: "async-teams", hubSlug: "collaboration" },
  },
  {
    postTitle: "Best Knowledge Management Software 2026: Ranked for Teams Who Can't Afford to Lose Institutional Memory",
    postSlug: "best-knowledge-management-software-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best knowledge management software",
    secondaryKeywords: ["knowledge base software 2026", "team wiki tools"],
    seoTitle: "Best Knowledge Management Software 2026: Ranked by Trust & Integration Scores",
    metaDescription: "Knowledge management software ranked for findability, maintenance, and integrations.",
    readingTimeMinutes: 9,
    wordCount: 907,
    tldrSummary: "Notion leads integration, Confluence leads engineering depth, Obsidian leads privacy.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Notion remains the strongest default for connected company knowledge workflows.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best Knowledge Management Software 2026" },
    bestOfPageMapping: { title: "Best Knowledge Management Software 2026", category: "knowledge-management", slug: "best-knowledge-management-software-2026", useCase: "teams", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Internal Wiki Software 2026: Ranked for Teams Tired of Dead Documentation",
    postSlug: "best-internal-wiki-software-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best internal wiki software",
    secondaryKeywords: ["internal wiki tools 2026", "team wiki platform"],
    seoTitle: "Best Internal Wiki Software 2026: Ranked by Search Quality, Trust & Integration",
    metaDescription: "Internal wiki tools ranked for search quality and maintenance resilience.",
    readingTimeMinutes: 9,
    wordCount: 904,
    tldrSummary: "Notion and Confluence lead overall, Slab and GitBook lead specific technical use-cases.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Notion has the strongest blend of search quality and workflow integration.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Internal Wiki Software 2026" },
    bestOfPageMapping: { title: "Best Internal Wiki Software 2026", category: "knowledge-management", slug: "best-internal-wiki-software-2026", useCase: "internal-teams", hubSlug: "productivity" },
  },
  {
    postTitle: "Best Documentation Tools for Engineering Teams 2026: Ranked for Developer Workflows",
    postSlug: "best-documentation-tools-engineering-teams-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "productivity",
    primaryKeyword: "best documentation tools for engineering teams",
    secondaryKeywords: ["engineering documentation software", "developer docs tools 2026"],
    seoTitle: "Best Documentation Tools for Engineering Teams 2026: Ranked for Developer Workflows",
    metaDescription: "Engineering documentation tools ranked for Git integration and developer workflows.",
    readingTimeMinutes: 9,
    wordCount: 902,
    tldrSummary: "GitBook leads Git-sync docs, Confluence leads Atlassian orgs, Swimm leads IDE-native docs.",
    postContent: DEFAULT_CONTENT,
    verdictText: "GitBook remains the most practical Git-aligned documentation platform for engineering teams.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Documentation Tools for Engineering Teams 2026" },
    bestOfPageMapping: { title: "Best Documentation Tools for Engineering Teams 2026", category: "documentation", slug: "best-documentation-tools-engineering-teams-2026", useCase: "engineering-teams", hubSlug: "productivity" },
  },
  {
    postTitle: "Best CRM Software 2026: Ranked by Integration Score, Trust & Real Sales Team Usability",
    postSlug: "best-crm-software-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "business-software",
    primaryKeyword: "best CRM software",
    secondaryKeywords: ["CRM platforms 2026", "best sales CRM"],
    seoTitle: "Best CRM Software 2026: Ranked by Trust Score, Integration & Sales Team Usability",
    metaDescription: "CRM tools ranked by adoption likelihood, integration depth, and trust posture.",
    readingTimeMinutes: 9,
    wordCount: 905,
    tldrSummary: "HubSpot leads overall adoption, Salesforce leads enterprise depth, Pipedrive leads usability.",
    postContent: DEFAULT_CONTENT,
    verdictText: "HubSpot is the best default for balanced adoption and ecosystem integration.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best CRM Software 2026" },
    bestOfPageMapping: { title: "Best CRM Software 2026", category: "crm", slug: "best-crm-software-2026", useCase: "sales-teams", hubSlug: "business-software" },
  },
  {
    postTitle: "Best CRM for Small Business 2026: Affordable, Easy to Adopt & Actually Useful",
    postSlug: "best-crm-for-small-business-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "business-software",
    primaryKeyword: "best CRM for small business",
    secondaryKeywords: ["small business CRM 2026", "affordable CRM software"],
    seoTitle: "Best CRM for Small Business 2026: Easy, Affordable & Actually Used by Sales Teams",
    metaDescription: "Small business CRM ranking focused on adoption speed, pricing, and practicality.",
    readingTimeMinutes: 9,
    wordCount: 905,
    tldrSummary: "HubSpot Free leads ease, Pipedrive leads sales usability, Zoho leads value depth.",
    postContent: DEFAULT_CONTENT,
    verdictText: "HubSpot Free remains the best first CRM for small teams moving off spreadsheets.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best CRM for Small Business 2026" },
    bestOfPageMapping: { title: "Best CRM for Small Business 2026", category: "crm", slug: "best-crm-for-small-business-2026", useCase: "small-business", hubSlug: "business-software" },
  },
  {
    postTitle: "Best Sales Engagement Tools 2026: Ranked for Outbound Teams & Multi-Channel Sequences",
    postSlug: "best-sales-engagement-tools-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "business-software",
    primaryKeyword: "best sales engagement tools",
    secondaryKeywords: ["sales engagement platforms 2026", "outbound sales tools"],
    seoTitle: "Best Sales Engagement Tools 2026: Ranked for Outbound Teams & Multi-Channel Sequences",
    metaDescription: "Sales engagement platforms ranked for deliverability, sequencing, and signal-based outbound.",
    readingTimeMinutes: 9,
    wordCount: 903,
    tldrSummary: "Outreach leads enterprise, Salesloft leads rep workflow, Instantly leads deliverability control.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Outreach remains strongest for enterprise outbound teams with deep CRM dependence.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Sales Engagement Tools 2026" },
    bestOfPageMapping: { title: "Best Sales Engagement Tools 2026", category: "sales-engagement", slug: "best-sales-engagement-tools-2026", useCase: "outbound-sales-teams", hubSlug: "business-software" },
  },
  {
    postTitle: "Best HR Software 2026: Ranked for People Teams Managing the Full Employee Lifecycle",
    postSlug: "best-hr-software-2026",
    postType: "pillar",
    postStatus: "published",
    hub: "business-software",
    primaryKeyword: "best HR software",
    secondaryKeywords: ["HR software 2026", "best HRIS systems"],
    seoTitle: "Best HR Software 2026: Ranked by Trust Score, Integration & Full Employee Lifecycle Coverage",
    metaDescription: "HR software ranking focused on trust, lifecycle coverage, and operational integration.",
    readingTimeMinutes: 9,
    wordCount: 907,
    tldrSummary: "Rippling leads lifecycle automation, BambooHR leads HR usability, Lattice leads performance depth.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Rippling is the strongest all-around lifecycle system for HR + IT process cohesion.",
    isLivingGuide: true,
    schemaMarkup: { "@type": "ItemList", name: "Best HR Software 2026" },
    bestOfPageMapping: { title: "Best HR Software 2026", category: "hr-software", slug: "best-hr-software-2026", useCase: "people-teams", hubSlug: "business-software" },
  },
  {
    postTitle: "Best Employee Performance Management Software 2026: Ranked for Real Culture Impact",
    postSlug: "best-employee-performance-management-software-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "business-software",
    primaryKeyword: "best employee performance management software",
    secondaryKeywords: ["performance management tools 2026", "best review software teams"],
    seoTitle: "Best Employee Performance Management Software 2026: Ranked for Culture & Real Impact",
    metaDescription: "Performance management platforms ranked for continuous feedback and measurable impact.",
    readingTimeMinutes: 9,
    wordCount: 904,
    tldrSummary: "Lattice leads depth, Culture Amp leads engagement integration, 15Five leads manager coaching.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Lattice remains strongest for comprehensive performance systems across review and feedback cycles.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Employee Performance Management Software 2026" },
    bestOfPageMapping: { title: "Best Employee Performance Management Software 2026", category: "hr-software", slug: "best-employee-performance-management-software-2026", useCase: "performance-management", hubSlug: "business-software" },
  },
  {
    postTitle: "Best Recruiting Software 2026: Ranked for Hiring Teams Building Strong Candidate Pipelines",
    postSlug: "best-recruiting-software-2026",
    postType: "segmented-list",
    postStatus: "published",
    hub: "business-software",
    primaryKeyword: "best recruiting software",
    secondaryKeywords: ["ATS software 2026", "best recruiting tools"],
    seoTitle: "Best Recruiting Software 2026: Ranked by Structured Hiring Quality, Trust & Integration",
    metaDescription: "Recruiting software ranking focused on structured hiring quality and compliance readiness.",
    readingTimeMinutes: 9,
    wordCount: 904,
    tldrSummary: "Greenhouse leads structured hiring, Lever leads pipeline nurture, Ashby leads analytics.",
    postContent: DEFAULT_CONTENT,
    verdictText: "Greenhouse remains the best platform for structured, defensible hiring pipelines.",
    isLivingGuide: false,
    schemaMarkup: { "@type": "ItemList", name: "Best Recruiting Software 2026" },
    bestOfPageMapping: { title: "Best Recruiting Software 2026", category: "recruiting", slug: "best-recruiting-software-2026", useCase: "hiring-teams", hubSlug: "business-software" },
  },
];

export const seedSmartHomeArticles = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const currentYear = new Date(now).getUTCFullYear();
    const allProducts = await ctx.db.query("novaProducts").collect();
    const activeProducts = allProducts.filter((p) => p.status === "active");
    const winnerProductId = (activeProducts[0]?._id ?? allProducts[0]?._id) as Id<"novaProducts"> | undefined;
    const rankedProductIds = activeProducts.slice(0, 5).map((p) => p._id) as Id<"novaProducts">[];

    let created = 0;
    let updated = 0;
    let livingGuidesCreated = 0;
    let livingGuidesUpdated = 0;
    let hubsCreated = 0;
    let hubsUpdated = 0;
    let bestOfCreated = 0;
    let bestOfUpdated = 0;
    let keywordsCreated = 0;
    let keywordsUpdated = 0;
    let seoAuditsCreated = 0;
    let seoAuditsUpdated = 0;
    let sitemapEntriesCreated = 0;

    const hubCounts = new Map<string, { posts: number; words: number }>();

    for (const article of ARTICLES) {
      const existing = await ctx.db
        .query("novaPosts")
        .withIndex("by_slug", (q) => q.eq("postSlug", article.postSlug))
        .first();

      const patch = {
        authorId: AUTHOR,
        postTitle: article.postTitle,
        postSlug: article.postSlug,
        postContent: article.postContent,
        postType: article.postType,
        postStatus: article.postStatus,
        hub: article.hub,
        primaryKeyword: article.primaryKeyword,
        secondaryKeywords: article.secondaryKeywords,
        seoTitle: article.seoTitle,
        metaDescription: article.metaDescription,
        readingTimeMinutes: article.readingTimeMinutes,
        wordCount: article.wordCount,
        tldrSummary: article.tldrSummary,
        verdictText: article.verdictText,
        isLivingGuide: article.isLivingGuide,
        schemaMarkup: article.schemaMarkup,
        readingLevel: "intermediate",
        publishedAt: now,
        viewCount: existing?.viewCount ?? 0,
        uniqueViewCount: existing?.uniqueViewCount ?? 0,
      };

      let postId = existing?._id;
      if (existing) {
        await ctx.db.patch(existing._id, patch);
        updated++;
      } else {
        postId = await ctx.db.insert("novaPosts", patch);
        created++;
      }

      const hubMetrics = hubCounts.get(article.hub) ?? { posts: 0, words: 0 };
      hubMetrics.posts += 1;
      hubMetrics.words += article.wordCount;
      hubCounts.set(article.hub, hubMetrics);

      if (postId) {
        const existingKeywordRows = await ctx.db
          .query("hubKeywords")
          .withIndex("by_hub", (q) => q.eq("hubSlug", article.hub))
          .collect();

        const keywordRows = [article.primaryKeyword, ...article.secondaryKeywords];
        for (let i = 0; i < keywordRows.length; i += 1) {
          const keyword = keywordRows[i];
          const existingKeyword = existingKeywordRows.find((row) => row.keyword === keyword);
          const keywordPatch = {
            hubSlug: article.hub,
            keyword,
            keywordType: i === 0 ? "primary" : "secondary",
            assignedPostId: postId,
            contentStatus: "published",
            priority: i === 0 ? 100 : 70,
          };
          if (existingKeyword) {
            await ctx.db.patch(existingKeyword._id, keywordPatch);
            keywordsUpdated++;
          } else {
            await ctx.db.insert("hubKeywords", keywordPatch);
            keywordsCreated++;
          }
        }

        const existingAudit = await ctx.db
          .query("seoAuditResults")
          .withIndex("by_post", (q) => q.eq("postId", postId))
          .first();
        const auditPatch = {
          postId,
          auditedAt: now,
          titleScore: 92,
          metaScore: 91,
          headingScore: 90,
          internalLinkScore: 86,
          schemaScore: 90,
          readabilityScore: 88,
          overallScore: 90,
          recommendations: ["Refresh internal links quarterly", "Re-validate schema on score updates"],
        };
        if (existingAudit) {
          await ctx.db.patch(existingAudit._id, auditPatch);
          seoAuditsUpdated++;
        } else {
          await ctx.db.insert("seoAuditResults", auditPatch);
          seoAuditsCreated++;
        }

        await ctx.db.insert("sitemapEntries", {
          url: `/hubs/${article.hub}/${article.postSlug}`,
          sitemapType: "post",
          priority: article.postType === "pillar" ? 0.9 : 0.8,
          changefreq: article.isLivingGuide ? "weekly" : "monthly",
          lastmod: now,
          isIndexable: true,
          entityId: String(postId),
          entityType: "novaPosts",
        });
        sitemapEntriesCreated++;
      }

      if (postId && article.isLivingGuide) {
        const existingGuide = await ctx.db
          .query("livingGuides")
          .withIndex("by_post", (q) => q.eq("postId", postId!))
          .first();
        const nextReviewDue = now + 1000 * 60 * 60 * 24 * 90;

        if (existingGuide) {
          await ctx.db.patch(existingGuide._id, {
            isLivingGuide: true,
            lastReviewedAt: now,
            nextReviewDue,
            updateFrequency: "quarterly",
          });
          livingGuidesUpdated++;
        } else {
          await ctx.db.insert("livingGuides", {
            postId,
            updateFrequency: "quarterly",
            lastReviewedAt: now,
            nextReviewDue,
            isLivingGuide: true,
            changeLog: [
              { at: now, change: "Initial living guide link created by smart-home article seed." },
            ],
          });
          livingGuidesCreated++;
        }
      }

      if (postId && winnerProductId && rankedProductIds.length > 0) {
        const existingBestOf = await ctx.db
          .query("bestOfPages")
          .withIndex("by_slug", (q) => q.eq("slug", article.bestOfPageMapping.slug))
          .first();

        const bestOfPatch = {
          slug: article.bestOfPageMapping.slug,
          title: article.bestOfPageMapping.title,
          category: article.bestOfPageMapping.category,
          useCase: article.bestOfPageMapping.useCase,
          year: currentYear,
          hubSlug: article.bestOfPageMapping.hubSlug,
          winnerProductId,
          rankedProductIds,
          rankingCriteria: {
            trustWeight: 0.5,
            integrationWeight: 0.5,
            updatedAt: now,
          },
          editorNote: article.verdictText,
          lastUpdatedAt: now,
          publishedAt: now,
          viewCount: existingBestOf?.viewCount ?? 0,
          seoTitle: article.seoTitle,
          metaDescription: article.metaDescription,
          schemaMarkup: article.schemaMarkup,
        };

        if (existingBestOf) {
          await ctx.db.patch(existingBestOf._id, bestOfPatch);
          bestOfUpdated++;
        } else {
          await ctx.db.insert("bestOfPages", bestOfPatch);
          bestOfCreated++;
        }
      }
    }

    for (const [hubSlug, metrics] of hubCounts.entries()) {
      const existingHub = await ctx.db
        .query("contentHubs")
        .withIndex("by_slug", (q) => q.eq("slug", hubSlug))
        .first();
      const hubPatch = {
        slug: hubSlug,
        name: hubSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: `Editorial hub for ${hubSlug} authority pages and segmented buying guides.`,
        pillarCount: metrics.posts,
        spokeCount: 0,
        totalWordCount: metrics.words,
        lastUpdatedAt: now,
        seoTitle: `${hubSlug.replace(/-/g, " ")} guides ${currentYear}`,
        metaDescription: `Latest ranked guides and comparisons in ${hubSlug}.`,
        isActive: true,
      };
      if (existingHub) {
        await ctx.db.patch(existingHub._id, hubPatch);
        hubsUpdated++;
      } else {
        await ctx.db.insert("contentHubs", hubPatch);
        hubsCreated++;
      }
    }

    return {
      seededAt: now,
      currentYear,
      totalInput: ARTICLES.length,
      created,
      updated,
      hubsCreated,
      hubsUpdated,
      bestOfCreated,
      bestOfUpdated,
      keywordsCreated,
      keywordsUpdated,
      seoAuditsCreated,
      seoAuditsUpdated,
      sitemapEntriesCreated,
      livingGuidesCreated,
      livingGuidesUpdated,
      bestOfSkippedNoProducts: !winnerProductId || rankedProductIds.length === 0,
    };
  },
});

