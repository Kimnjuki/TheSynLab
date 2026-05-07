/**
 * Production-friendly seed mutation.
 * Seeds products, quiz data, and Trust Index snapshots.
 * Call from Convex dashboard: npx convex run seedProductionData:seedProductionData
 * Or via the dashboard Functions tab.
 */
import { v } from "convex/values";
import { mutation } from "./_generated/server";

async function getOrSeedProducts(ctx: any) {
  const existing = await ctx.db.query("novaProducts").first();
  if (existing) {
    return { seeded: false, count: 0 };
  }

  const productsData = [
    {
      productName: "ClickUp",
      productSlug: "clickup",
      manufacturer: "ClickUp",
      category: "Productivity Software",
      subcategory: "All-in-One Platform",
      productType: "saas",
      hub: "ai_workflow",
      price: 5.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "All-in-one productivity platform with high customization and extensive features designed to replace multiple apps",
      features: ["Custom Views", "Time Tracking", "Docs", "Goals", "Dashboards", "Automations"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "1000+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      officialWebsite: "https://clickup.com",
    },
    {
      productName: "Todoist",
      productSlug: "todoist",
      manufacturer: "Doist",
      category: "Productivity Software",
      subcategory: "Task Management",
      productType: "saas",
      hub: "productivity",
      price: 4.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Simple yet powerful task manager with natural language input and smart scheduling",
      features: ["Natural Language Input", "Project Templates", "Labels & Filters", "Reminders", "Karma Points", "Collaboration"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "60+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
      officialWebsite: "https://todoist.com",
    },
    {
      productName: "Asana",
      productSlug: "asana",
      manufacturer: "Asana",
      category: "Productivity Software",
      subcategory: "Project Management",
      productType: "saas",
      hub: "productivity",
      price: 10.99,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Work management platform for tracking projects, tasks, and team goals",
      features: ["Timeline", "Portfolios", "Workload", "Goals", "Forms", "Automations"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "200+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      officialWebsite: "https://asana.com",
    },
    {
      productName: "Notion",
      productSlug: "notion",
      manufacturer: "Notion Labs",
      category: "Productivity Software",
      subcategory: "All-in-One Workspace",
      productType: "saas",
      hub: "productivity",
      price: 10.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Unified workspace for notes, documents, wikis, databases, and project management",
      features: ["Block Editor", "Databases", "Templates", "Wiki", "Kanban", "Calendar"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "100+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=600&fit=crop",
      officialWebsite: "https://notion.so",
    },
    {
      productName: "Slack",
      productSlug: "slack",
      manufacturer: "Salesforce",
      category: "Collaboration",
      subcategory: "Messaging",
      productType: "saas",
      hub: "collaboration",
      price: 8.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Messaging and collaboration platform for team communication and file sharing",
      features: ["Channels", "Direct Messages", "Huddles", "Canvas", "Clips", "Workflow Builder"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "2400+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&h=600&fit=crop",
      officialWebsite: "https://slack.com",
    },
    {
      productName: "Canva",
      productSlug: "canva",
      manufacturer: "Canva",
      category: "Design",
      subcategory: "Graphic Design",
      productType: "saas",
      hub: "productivity",
      price: 12.99,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Online graphic design platform for creating presentations, social media, and marketing materials",
      features: ["Templates", "Drag & Drop Editor", "Brand Kit", "Magic Studio", "Collaboration", "Print"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "iOS", "Android"], mobile_app: true, integrations: "100+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop",
      officialWebsite: "https://canva.com",
    },
    {
      productName: "HubSpot",
      productSlug: "hubspot",
      manufacturer: "HubSpot",
      category: "Marketing",
      subcategory: "CRM",
      productType: "saas",
      hub: "martech",
      price: 45.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "All-in-one CRM and marketing platform for inbound marketing, sales, and customer service",
      features: ["CRM", "Email Marketing", "Social Media", "Analytics", "Live Chat", "Pipeline Management"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "iOS", "Android"], mobile_app: true, integrations: "500+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      officialWebsite: "https://hubspot.com",
    },
    {
      productName: "GitHub",
      productSlug: "github",
      manufacturer: "Microsoft",
      category: "Developer Tools",
      subcategory: "Version Control",
      productType: "saas",
      hub: "productivity",
      price: 4.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Code hosting and collaboration platform with version control, CI/CD, and project management",
      features: ["Git Repos", "Issues", "Pull Requests", "Actions", "Packages", "Projects"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "1000+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=600&fit=crop",
      officialWebsite: "https://github.com",
    },
    {
      productName: "Zapier",
      productSlug: "zapier",
      manufacturer: "Zapier",
      category: "Automation",
      subcategory: "Workflow Automation",
      productType: "saas",
      hub: "ai_workflow",
      price: 19.99,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Automation platform connecting apps and services with no-code workflows",
      features: ["Zaps", "Multi-step Workflows", "Filters", "Formatters", "Paths", "Webhooks"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web"], mobile_app: true, integrations: "5000+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
      officialWebsite: "https://zapier.com",
    },
    {
      productName: "Grammarly",
      productSlug: "grammarly",
      manufacturer: "Grammarly",
      category: "Writing",
      subcategory: "AI Writing Assistant",
      productType: "saas",
      hub: "productivity",
      price: 12.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "AI-powered writing assistant for grammar, tone, and clarity improvements",
      features: ["Grammar Check", "Tone Detection", "Plagiarism Check", "Generative AI", "Browser Extension"],
      specifications: { free_tier: true, max_users: "Individual", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "500k+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop",
      officialWebsite: "https://grammarly.com",
    },
    {
      productName: "Vercel",
      productSlug: "vercel",
      manufacturer: "Vercel Inc.",
      category: "Developer Tools",
      subcategory: "Hosting",
      productType: "saas",
      hub: "productivity",
      price: 20.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Cloud platform for static and serverless deployment, optimized for frontend frameworks",
      features: ["Serverless Functions", "Edge Functions", "Analytics", "Previews", "Automatic SSL"],
      specifications: { free_tier: true, platforms: ["Web"], mobile_app: false, integrations: "50+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
      officialWebsite: "https://vercel.com",
    },
    {
      productName: "Sentry",
      productSlug: "sentry",
      manufacturer: "Functional Software",
      category: "Developer Tools",
      subcategory: "Monitoring",
      productType: "saas",
      hub: "productivity",
      price: 26.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Application monitoring and error tracking platform for developers",
      features: ["Error Tracking", "Performance Monitoring", "Releases", "Session Replay", "Crons"],
      specifications: { free_tier: true, platforms: ["Web"], mobile_app: true, integrations: "100+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      officialWebsite: "https://sentry.io",
    },
    {
      productName: "Microsoft Teams",
      productSlug: "microsoft-teams",
      manufacturer: "Microsoft",
      category: "Collaboration",
      subcategory: "Unified Communications",
      productType: "saas",
      hub: "collaboration",
      price: 5.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Enterprise communication and collaboration platform with chat, meetings, and file storage",
      features: ["Chat", "Video Meetings", "File Sharing", "Teams & Channels", "Shifts", "Tasks"],
      specifications: { free_tier: true, max_users: 300, platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "700+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800&h=600&fit=crop",
      officialWebsite: "https://teams.microsoft.com",
    },
    {
      productName: "Mailchimp",
      productSlug: "mailchimp",
      manufacturer: "Intuit",
      category: "Marketing",
      subcategory: "Email Marketing",
      productType: "saas",
      hub: "martech",
      price: 13.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "All-in-one marketing platform for email campaigns, automation, and audience management",
      features: ["Email Campaigns", "Automation", "Audience Segmentation", "Landing Pages", "Reports"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "iOS", "Android"], mobile_app: true, integrations: "300+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&h=600&fit=crop",
      officialWebsite: "https://mailchimp.com",
    },
    {
      productName: "Buffer",
      productSlug: "buffer",
      manufacturer: "Buffer",
      category: "Marketing",
      subcategory: "Social Media",
      productType: "saas",
      hub: "martech",
      price: 6.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Social media management platform for scheduling, publishing, and analytics",
      features: ["Scheduling", "Analytics", "Engagement", "Collaboration", "Start Page"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "iOS", "Android"], mobile_app: true, integrations: "10+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=600&fit=crop",
      officialWebsite: "https://buffer.com",
    },
    {
      productName: "Make (formerly Integromat)",
      productSlug: "make",
      manufacturer: "Celonis",
      category: "Automation",
      subcategory: "Workflow Automation",
      productType: "saas",
      hub: "ai_workflow",
      price: 14.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Visual automation platform for connecting apps and automating workflows",
      features: ["Scenarios", "Data Store", "Webhooks", "Router", "Aggregator", "Repeater"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web"], mobile_app: false, integrations: "1000+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop",
      officialWebsite: "https://make.com",
    },
    {
      productName: "Linear",
      productSlug: "linear",
      manufacturer: "Linear",
      category: "Developer Tools",
      subcategory: "Issue Tracking",
      productType: "saas",
      hub: "productivity",
      price: 10.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Modern issue tracking tool designed for high-performance software teams",
      features: ["Issue Tracking", "Cycles", "Roadmaps", "Projects", "Documents", "Slash Commands"],
      specifications: { free_tier: true, platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "40+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
      officialWebsite: "https://linear.app",
    },
    {
      productName: "Figma",
      productSlug: "figma",
      manufacturer: "Figma",
      category: "Design",
      subcategory: "UI/UX Design",
      productType: "saas",
      hub: "productivity",
      price: 12.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Cloud-based design tool for collaborative interface and experience design",
      features: ["Vector Networks", "Auto Layout", "Components", "Variants", "Plugins", "Dev Mode"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "400+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
      officialWebsite: "https://figma.com",
    },
    {
      productName: "Loom",
      productSlug: "loom",
      manufacturer: "Atlassian",
      category: "Collaboration",
      subcategory: "Video Messaging",
      productType: "saas",
      hub: "collaboration",
      price: 12.50,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Video messaging platform for async communication and screen recording",
      features: ["Screen Recording", "Camera Recording", "Transcripts", "Comments", "Reactions"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "50+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop",
      officialWebsite: "https://loom.com",
    },
    {
      productName: "Calendly",
      productSlug: "calendly",
      manufacturer: "Calendly",
      category: "Productivity",
      subcategory: "Scheduling",
      productType: "saas",
      hub: "productivity",
      price: 10.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Automated scheduling platform that eliminates the back-and-forth of meeting coordination",
      features: ["Scheduling", "Team Scheduling", "Round Robin", "Workflows", "Routing Forms"],
      specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "iOS", "Android"], mobile_app: true, integrations: "200+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=600&fit=crop",
      officialWebsite: "https://calendly.com",
    },
    {
      productName: "OpenAI",
      productSlug: "openai",
      manufacturer: "OpenAI",
      category: "AI Software",
      subcategory: "Large Language Models",
      productType: "saas",
      hub: "ai_software",
      price: 20.00,
      priceCurrency: "USD",
      priceModel: "subscription",
      description: "Cutting-edge AI platform for text generation, reasoning, code, and multimodal tasks",
      features: ["ChatGPT", "GPT-4", "DALL-E", "Whisper", "Assistants API", "Fine-tuning"],
      specifications: { free_tier: true, platforms: ["Web", "iOS", "Android"], mobile_app: true, integrations: "1000+" },
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
      featuredImageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=600&fit=crop",
      officialWebsite: "https://openai.com",
    },
  ];

  let count = 0;
  for (const product of productsData) {
    await ctx.db.insert("novaProducts", product);
    count++;
  }
  return { seeded: true, count };
}

async function seedQuiz(ctx: any, productBySlug: Map<string, any>) {
  const getProductIds = (slugs: string[]) =>
    slugs.map((s) => productBySlug.get(s)).filter(Boolean);

  const existingQuestions = await ctx.db.query("quizQuestions").first();
  if (!existingQuestions) {
    const questions = [
      {
        questionText: "What's your primary role or focus?",
        questionType: "single",
        options: [
          { id: "content_creator", text: "Content Creator / Marketer", weight: 3 },
          { id: "developer", text: "Developer / Engineer", weight: 3 },
          { id: "ops", text: "Operations / Admin", weight: 3 },
          { id: "exec", text: "Executive / Founder", weight: 3 },
          { id: "support", text: "Customer Support", weight: 2 },
        ],
        orderIndex: 1,
        weightMultiplier: 1,
      },
      {
        questionText: "How big is your team?",
        questionType: "single",
        options: [
          { id: "solo", text: "Just me", weight: 1 },
          { id: "small", text: "2-10 people", weight: 2 },
          { id: "medium", text: "11-50 people", weight: 3 },
          { id: "large", text: "50+ people", weight: 4 },
        ],
        orderIndex: 2,
        weightMultiplier: 1,
      },
      {
        questionText: "What's your biggest workflow challenge?",
        questionType: "multi",
        options: [
          { id: "task_management", text: "Task & project management", weight: 3 },
          { id: "communication", text: "Team communication & meetings", weight: 3 },
          { id: "content", text: "Content creation & distribution", weight: 3 },
          { id: "automation", text: "Process automation & integrations", weight: 4 },
          { id: "analytics", text: "Reporting & data analysis", weight: 2 },
        ],
        orderIndex: 3,
        weightMultiplier: 1,
      },
      {
        questionText: "What's your monthly budget per seat?",
        questionType: "single",
        options: [
          { id: "free", text: "Free only", weight: 1 },
          { id: "low", text: "Under $10/mo", weight: 2 },
          { id: "mid", text: "$10-$30/mo", weight: 3 },
          { id: "high", text: "$30-$100/mo", weight: 4 },
          { id: "unlimited", text: "No limit", weight: 5 },
        ],
        orderIndex: 4,
        weightMultiplier: 1,
      },
      {
        questionText: "Which category matters most to you?",
        questionType: "single",
        options: [
          { id: "productivity", text: "Productivity & project management", weight: 3 },
          { id: "marketing", text: "Marketing & content", weight: 3 },
          { id: "dev", text: "Development & IT", weight: 3 },
          { id: "collab", text: "Team collaboration", weight: 3 },
          { id: "ai", text: "AI tools & automation", weight: 4 },
        ],
        orderIndex: 5,
        weightMultiplier: 1,
      },
      {
        questionText: "How important are integrations?",
        questionType: "single",
        options: [
          { id: "standalone", text: "I prefer standalone tools", weight: 1 },
          { id: "some", text: "Nice to have", weight: 2 },
          { id: "important", text: "Important — needs API access", weight: 3 },
          { id: "critical", text: "Critical — must connect everything", weight: 4 },
        ],
        orderIndex: 6,
        weightMultiplier: 1,
      },
    ];

    for (const q of questions) {
      await ctx.db.insert("quizQuestions", q);
    }
  }

  const existingRules = await ctx.db.query("quizResultRules").first();
  if (!existingRules) {
    const rules = [
      {
        ruleName: "Content Creator Stack",
        description: "Best tools for content creators and marketers",
        matchCriteria: { roles: ["content_creator"], budgetRange: ["low", "mid"], workflowAreas: ["content", "task_management"] },
        priority: 10,
        recommendedProductIds: getProductIds(["canva", "notion", "grammarly"]),
      },
      {
        ruleName: "Marketing Team Stack",
        description: "Full marketing toolkit for teams",
        matchCriteria: { roles: ["content_creator"], budgetRange: ["mid", "high"], workflowAreas: ["content", "analytics", "automation"] },
        priority: 9,
        recommendedProductIds: getProductIds(["canva", "notion", "mailchimp"]),
      },
      {
        ruleName: "Small Team Productivity",
        description: "Lightweight stack for growing teams",
        matchCriteria: { roles: ["ops", "exec"], teamSizes: ["solo", "small"], workflowAreas: ["task_management", "communication", "automation"] },
        priority: 8,
        recommendedProductIds: getProductIds(["asana", "notion", "slack"]),
      },
      {
        ruleName: "Sales & CRM Stack",
        description: "CRM and sales automation for B2B teams",
        matchCriteria: { roles: ["exec", "ops"], teamSizes: ["small", "medium"], workflowAreas: ["analytics", "automation", "communication"] },
        priority: 7,
        recommendedProductIds: getProductIds(["hubspot", "notion", "slack"]),
      },
      {
        ruleName: "Developer Power Stack",
        description: "Development collaboration and deployment tools",
        matchCriteria: { roles: ["developer"], workflowAreas: ["task_management"], budgetRange: ["free", "low", "mid"] },
        priority: 10,
        recommendedProductIds: getProductIds(["github", "vercel", "sentry"]),
      },
      {
        ruleName: "Enterprise Productivity",
        description: "Scalable stack for larger organizations",
        matchCriteria: { roles: ["ops", "exec"], teamSizes: ["medium", "large"], workflowAreas: ["task_management", "communication"] },
        priority: 6,
        recommendedProductIds: getProductIds(["asana", "clickup", "microsoft-teams"]),
      },
      {
        ruleName: "Solo Creator Stack",
        description: "Lightweight and affordable for solo operators",
        matchCriteria: { roles: ["content_creator", "exec"], teamSizes: ["solo"], budgetRange: ["free", "low"], workflowAreas: ["content", "task_management"] },
        priority: 8,
        recommendedProductIds: getProductIds(["canva", "notion", "buffer"]),
      },
      {
        ruleName: "Automation-First Stack",
        description: "Zap it all together — automation is the priority",
        matchCriteria: { workflowAreas: ["automation"], budgetRange: ["mid", "high"] },
        priority: 7,
        recommendedProductIds: getProductIds(["zapier", "make", "notion"]),
      },
      {
        ruleName: "General Best Stack",
        description: "Balanced recommendations for most teams",
        matchCriteria: {},
        priority: 1,
        recommendedProductIds: getProductIds(["notion", "clickup", "zapier"]),
      },
    ];

    for (const r of rules) {
      await ctx.db.insert("quizResultRules", r);
    }
  }
}

export const seedProductionData = mutation({
  args: {},
  handler: async (ctx) => {
    const results: Record<string, any> = {};

    // 1. Seed products (only if empty)
    const existingProducts = await ctx.db.query("novaProducts").first();
    if (!existingProducts) {
      const productResult = await getOrSeedProducts(ctx);
      results.products = productResult;
    } else {
      results.products = { seeded: false, message: "Already seeded", count: await ctx.db.query("novaProducts").collect().then((r: any[]) => r.length) };
    }

    // Build product slug -> ID map
    const products = await ctx.db.query("novaProducts").collect();
    const productBySlug = new Map(products.map((p: any) => [p.productSlug, p._id]));

    // 2. Seed quiz
    await seedQuiz(ctx, productBySlug);
    results.quizQuestions = { count: await ctx.db.query("quizQuestions").collect().then((r: any[]) => r.length) };
    results.quizResultRules = { count: await ctx.db.query("quizResultRules").collect().then((r: any[]) => r.length) };

    // 3. Seed Trust Index snapshots for all hubs
    const hubs = [
      { slug: "productivity", label: "Productivity", productSlugs: ["notion", "todoist", "clickup", "asana", "linear", "calendly"] },
      { slug: "ai_software", label: "AI Software", productSlugs: ["openai"] },
      { slug: "smart_home", label: "Smart Home", productSlugs: [] },
      { slug: "office_hardware", label: "Office Hardware", productSlugs: [] },
      { slug: "martech", label: "MarTech", productSlugs: ["hubspot", "mailchimp", "buffer"] },
      { slug: "collaboration", label: "Collaboration", productSlugs: ["slack", "microsoft-teams", "loom"] },
    ];

    const hubSlugToDbFormat: Record<string, string> = {
      productivity: "productivity",
      ai_software: "ai-software",
      smart_home: "smart-home",
      office_hardware: "office-hardware",
      martech: "martech",
      collaboration: "collaboration",
    };

    for (const hub of hubs) {
      const dbSlug = hubSlugToDbFormat[hub.slug] || hub.slug;
      const entries = hub.productSlugs
        .map((slug, i) => {
          const pid = productBySlug.get(slug);
          if (!pid) return null;
          return {
            rank: i + 1,
            productId: pid,
            trustScore: Math.round((8.5 - i * 0.5) * 10) / 10,
            integrationScore: Math.round((7.5 - i * 0.4) * 10) / 10,
            rankDelta: i === 0 ? 1 : i === 1 ? -1 : 0,
            badge: i === 0 ? "top_rated" : i === hub.productSlugs.length - 1 ? "rising" : undefined,
          };
        })
        .filter(Boolean);

      // Mark previous as not current
      const previous = await ctx.db
        .query("trustIndexSnapshots")
        .withIndex("by_hub_current", (q) => q.eq("hubSlug", dbSlug).eq("isCurrent", true))
        .take(1);
      for (const prev of previous) {
        await ctx.db.patch(prev._id, { isCurrent: false });
      }

      await ctx.db.insert("trustIndexSnapshots", {
        hubSlug: dbSlug,
        snapshotMonth: new Date().getMonth() + 1,
        snapshotYear: new Date().getFullYear(),
        isCurrent: true,
        rankedEntries: entries,
        publishedAt: Date.now(),
        editorialNotes: `Auto-seeded snapshot for ${hub.label}`,
      });
    }

    results.trustIndexSnapshots = { hubsSeeded: hubs.length, message: "All hubs seeded" };

    return results;
  },
});
