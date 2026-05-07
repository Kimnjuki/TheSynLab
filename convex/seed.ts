import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Seed data from CSV exports
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
    priceModel: "one_time",
    description: "All-in-one productivity platform with high customization and extensive features designed to replace multiple apps",
    features: ["Custom Views", "Time Tracking", "Docs", "Goals", "Dashboards", "Automations"],
    specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "1000+" },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
    galleryImages: ["https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"],
    officialWebsite: "https://clickup.com",
  },
  {
    productName: "Todoist",
    productSlug: "todoist",
    manufacturer: "Doist",
    category: "Productivity Software",
    subcategory: "Task Tracking",
    productType: "saas",
    hub: "ai_workflow",
    price: 4.00,
    priceCurrency: "USD",
    priceModel: "one_time",
    description: "Simple and powerful task management with excellent natural language processing",
    features: ["Natural Language", "Projects", "Labels", "Filters", "Productivity Trends", "Reminders"],
    specifications: { free_tier: true, max_users: "5", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "60+" },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop",
    galleryImages: ["https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop", "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"],
    officialWebsite: "https://todoist.com",
  },
  {
    productName: "Notion",
    productSlug: "notion",
    manufacturer: "Notion Labs",
    category: "Productivity Software",
    subcategory: "All-in-One Platform",
    productType: "saas",
    hub: "ai_workflow",
    price: 8.00,
    priceCurrency: "USD",
    priceModel: "subscription",
    description: "All-in-one workspace for notes, docs, wikis, and project management with AI-powered features",
    features: ["AI Writing", "Databases", "Wikis", "Projects", "Templates", "API"],
    specifications: { free_tier: true, max_users: "Unlimited", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "100+" },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://notion.so",
  },
  {
    productName: "Asana",
    productSlug: "asana",
    manufacturer: "Asana Inc",
    category: "Productivity Software",
    subcategory: "Project Management",
    productType: "saas",
    hub: "ai_workflow",
    price: 10.99,
    priceCurrency: "USD",
    priceModel: "subscription",
    description: "Enterprise-grade project management with workflows, automation, and team collaboration",
    features: ["Timeline View", "Workload", "Goals", "Portfolios", "Forms", "Automations"],
    specifications: { free_tier: true, max_users: "15", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "200+" },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://asana.com",
  },
  {
    productName: "Monday.com",
    productSlug: "monday-com",
    manufacturer: "Monday.com",
    category: "Productivity Software",
    subcategory: "Work OS",
    productType: "saas",
    hub: "ai_workflow",
    price: 9.00,
    priceCurrency: "USD",
    priceModel: "subscription",
    description: "Work operating system that powers teams to run projects and workflows with confidence",
    features: ["Custom Workflows", "Dashboards", "Time Tracking", "Docs", "Integrations", "Automations"],
    specifications: { free_tier: true, max_users: "2", platforms: ["Web", "Windows", "Mac", "iOS", "Android"], mobile_app: true, integrations: "200+" },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://monday.com",
  },
  {
    productName: "Linear",
    productSlug: "linear",
    manufacturer: "Linear",
    category: "Productivity Software",
    subcategory: "Issue Tracking",
    productType: "saas",
    hub: "ai_workflow",
    price: 8.00,
    priceCurrency: "USD",
    priceModel: "subscription",
    description: "Modern issue tracking and project management for high-performance software teams",
    features: ["Cycles", "Roadmaps", "Git Integration", "Workflows", "API", "Keyboard First"],
    specifications: { free_tier: true, max_users: "250", platforms: ["Web", "Mac", "iOS", "Android"], mobile_app: true, integrations: "50+" },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://linear.app",
  },
  {
    productName: "Philips Hue",
    productSlug: "philips-hue",
    manufacturer: "Signify",
    category: "Smart Lighting",
    subcategory: "Color Bulbs",
    productType: "hardware",
    hub: "intelligent_home",
    price: 49.99,
    priceCurrency: "USD",
    priceModel: "one_time",
    description: "Premium smart lighting ecosystem with extensive color options and smart home integrations",
    features: ["16M Colors", "Voice Control", "Scenes", "Automations", "Entertainment Sync", "Outdoor Options"],
    specifications: { connectivity: ["Zigbee", "Bluetooth"], hub_required: true, ecosystems: ["HomeKit", "Google Home", "Alexa", "SmartThings"] },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://www.philips-hue.com",
  },
  {
    productName: "Ecobee Smart Thermostat",
    productSlug: "ecobee-smart-thermostat",
    manufacturer: "Ecobee",
    category: "Climate Control",
    subcategory: "Thermostats",
    productType: "hardware",
    hub: "intelligent_home",
    price: 219.99,
    priceCurrency: "USD",
    priceModel: "one_time",
    description: "Smart thermostat with room sensors and voice control for optimal comfort and energy savings",
    features: ["Room Sensors", "Voice Control", "Smart Recovery", "Energy Reports", "HomeKit Enabled"],
    specifications: { connectivity: ["WiFi"], ecosystems: ["HomeKit", "Google Home", "Alexa", "SmartThings"] },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://www.ecobee.com",
  },
  {
    productName: "Ring Video Doorbell",
    productSlug: "ring-video-doorbell",
    manufacturer: "Ring (Amazon)",
    category: "Security",
    subcategory: "Video Doorbells",
    productType: "hardware",
    hub: "intelligent_home",
    price: 99.99,
    priceCurrency: "USD",
    priceModel: "one_time",
    description: "HD video doorbell with motion detection, two-way talk, and cloud recording",
    features: ["HD Video", "Motion Detection", "Two-Way Talk", "Night Vision", "Cloud Recording"],
    specifications: { connectivity: ["WiFi"], ecosystems: ["Alexa"], subscription_required: false },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://ring.com",
  },
  {
    productName: "Logitech MX Master 3S",
    productSlug: "logitech-mx-master-3s",
    manufacturer: "Logitech",
    category: "Peripherals",
    subcategory: "Mice",
    productType: "hardware",
    hub: "hybrid_office",
    price: 99.99,
    priceCurrency: "USD",
    priceModel: "one_time",
    description: "Premium wireless mouse with MagSpeed scrolling, ergonomic design, and multi-device support",
    features: ["MagSpeed Scrolling", "Quiet Clicks", "8K DPI", "Multi-Device", "USB-C Charging", "Customizable Buttons"],
    specifications: { connectivity: ["Bluetooth", "Logi Bolt"], battery_life: "70 days", platforms: ["Windows", "Mac", "Linux", "ChromeOS"] },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://www.logitech.com",
  },
  {
    productName: "Herman Miller Aeron",
    productSlug: "herman-miller-aeron",
    manufacturer: "Herman Miller",
    category: "Furniture",
    subcategory: "Office Chairs",
    productType: "hardware",
    hub: "hybrid_office",
    price: 1395.00,
    priceCurrency: "USD",
    priceModel: "one_time",
    description: "Iconic ergonomic office chair with adjustable support and breathable mesh design",
    features: ["PostureFit SL", "8Z Pellicle", "Adjustable Arms", "Tilt Limiter", "Forward Tilt"],
    specifications: { warranty: "12 years", weight_capacity: "350 lbs", sizes: ["A", "B", "C"] },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://www.hermanmiller.com",
  },
  {
    productName: "CalDigit TS4",
    productSlug: "caldigit-ts4",
    manufacturer: "CalDigit",
    category: "Docking Stations",
    subcategory: "Thunderbolt Docks",
    productType: "hardware",
    hub: "hybrid_office",
    price: 399.99,
    priceCurrency: "USD",
    priceModel: "one_time",
    description: "Thunderbolt 4 dock with 18 ports and 98W charging for ultimate desktop connectivity",
    features: ["98W Charging", "18 Ports", "2.5GbE", "SD Card Reader", "DisplayPort 1.4", "Thunderbolt 4"],
    specifications: { connectivity: ["Thunderbolt 4", "USB-C", "USB-A", "DisplayPort", "Ethernet"], platforms: ["Mac", "Windows"] },
    status: "active",
    isSponsored: false,
    sponsorDisclosed: false,
    featuredImageUrl: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&h=600&fit=crop",
    galleryImages: [],
    officialWebsite: "https://www.caldigit.com",
  },
];

const automationTemplatesData = [
  {
    name: "Welcome New Member",
    description: "Send welcome message to new team members",
    category: "onboarding",
    icon: "UserCheck",
    triggerType: "member_joined",
    triggerConfig: {},
    actions: [{ type: "send_notification", config: { message: "Welcome to the team! Check out the getting started guide." } }],
    conditions: [],
    isFeatured: false,
    useCount: 0,
  },
  {
    name: "Deadline Reminder",
    description: "Send reminder 24h before task deadline",
    category: "reminders",
    icon: "Clock",
    triggerType: "time_based",
    triggerConfig: { hours_before: 24 },
    actions: [{ type: "send_notification", config: { message: "Task {{task.name}} is due in 24 hours" } }],
    conditions: [],
    isFeatured: true,
    useCount: 0,
  },
  {
    name: "Weekly Progress Report",
    description: "Generate weekly progress summary",
    category: "reports",
    icon: "FileText",
    triggerType: "schedule",
    triggerConfig: { day: "monday", time: "09:00", frequency: "weekly" },
    actions: [{ type: "generate_report", config: { type: "weekly_summary" } }],
    conditions: [],
    isFeatured: true,
    useCount: 0,
  },
  {
    name: "Notify on High Priority",
    description: "Send notification when a high-priority task is created",
    category: "notifications",
    icon: "Bell",
    triggerType: "task_created",
    triggerConfig: { priority: "high" },
    actions: [{ type: "send_notification", config: { message: "New high-priority task: {{task.name}}" } }],
    conditions: [],
    isFeatured: true,
    useCount: 0,
  },
  {
    name: "Escalate Overdue Tasks",
    description: "Escalate tasks that are overdue",
    category: "escalation",
    icon: "AlertTriangle",
    triggerType: "task_overdue",
    triggerConfig: {},
    actions: [
      { type: "update_priority", config: { priority: "urgent" } },
      { type: "send_notification", config: { message: "Task {{task.name}} is overdue and has been escalated" } }
    ],
    conditions: [],
    isFeatured: true,
    useCount: 0,
  },
  {
    name: "Auto-assign by Category",
    description: "Automatically assign tasks based on category",
    category: "assignment",
    icon: "UserPlus",
    triggerType: "task_created",
    triggerConfig: {},
    actions: [{ type: "assign_task", config: { method: "by_category" } }],
    conditions: [],
    isFeatured: true,
    useCount: 0,
  },
];

const adPolicyRulesData = [
  {
    levelId: 1,
    levelName: "Prohibited Content",
    severity: "CRITICAL",
    category: "Misinformation & Deception",
    keywords: ["fake news", "deepfake", "guaranteed cure", "get rich quick", "pyramid scheme", "conspiracy theory"],
    instruction: "Reject false claims, doctored media, unrealistic health/financial promises, and multilevel marketing schemes.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 1,
    levelName: "Prohibited Content",
    severity: "CRITICAL",
    category: "Adult Content & Nudity",
    keywords: ["pornography", "sex toys", "escort services", "strip clubs", "genitalia", "excessive skin"],
    instruction: "Reject content showing explicit nudity, sexual acts, or excessive skin.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 2,
    levelName: "Restricted Content",
    severity: "HIGH",
    category: "Alcohol",
    keywords: ["beer", "wine", "spirits", "liquor", "cocktail"],
    instruction: "Ensure target audience is of legal drinking age (18+/21+) and complies with local laws.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: 18,
    geoRestrictions: undefined,
  },
  {
    levelId: 3,
    levelName: "Editorial & Technical Standards",
    severity: "MEDIUM",
    category: "Clickbait & Sensationalism",
    keywords: ["you wont believe", "shocking", "one weird trick", "graphic violence"],
    instruction: "Flag sensationalist language or shocking imagery used to drive clicks.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 4,
    levelName: "Destination & Landing Page",
    severity: "MEDIUM",
    category: "Transparency & Privacy",
    keywords: ["privacy policy", "terms of service", "cookie notice"],
    instruction: "Verify the landing page has a visible Privacy Policy link.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 3,
    levelName: "Editorial & Technical Standards",
    severity: "MEDIUM",
    category: "Personal Attributes",
    keywords: ["are you", "do you suffer from", "meet other"],
    instruction: "Flag text that directly asserts or implies a users personal attributes.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 2,
    levelName: "Restricted Content",
    severity: "HIGH",
    category: "Gambling & Gaming",
    keywords: ["casino", "betting", "sportsbook", "poker", "lottery", "social casino"],
    instruction: "Require proof of license/certification. Flag for age-gating (18+).",
    isActive: true,
    requiresCertification: true,
    ageRestriction: 18,
    geoRestrictions: undefined,
  },
  {
    levelId: 2,
    levelName: "Restricted Content",
    severity: "HIGH",
    category: "Dating Services",
    keywords: ["dating app", "singles", "meet people"],
    instruction: "Flag for Adult audience targeting only.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: 18,
    geoRestrictions: undefined,
  },
  {
    levelId: 1,
    levelName: "Prohibited Content",
    severity: "CRITICAL",
    category: "Illegal Drugs & Substances",
    keywords: ["recreational drugs", "drug paraphernalia", "synthetic marijuana", "cocaine", "heroin"],
    instruction: "Reject all ads promoting illegal substances or drug paraphernalia.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 1,
    levelName: "Prohibited Content",
    severity: "CRITICAL",
    category: "Weapons & Violence",
    keywords: ["guns for sale", "ammunition", "explosives", "knives for sale", "tactical weapons"],
    instruction: "Reject ads for weapons, ammunition, or content promoting violence.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 2,
    levelName: "Restricted Content",
    severity: "HIGH",
    category: "Financial Services",
    keywords: ["loan", "credit card", "investment", "cryptocurrency", "forex", "trading"],
    instruction: "Require proper licensing disclosures. Flag for regulatory compliance.",
    isActive: true,
    requiresCertification: true,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 2,
    levelName: "Restricted Content",
    severity: "HIGH",
    category: "Healthcare & Pharmaceuticals",
    keywords: ["prescription", "medication", "treatment", "therapy", "medical device"],
    instruction: "Require proper certifications and disclaimers. No miracle cure claims.",
    isActive: true,
    requiresCertification: true,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 3,
    levelName: "Editorial & Technical Standards",
    severity: "MEDIUM",
    category: "Grammar & Spelling",
    keywords: [],
    instruction: "Flag ads with excessive grammar errors, ALL CAPS, or excessive punctuation.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 3,
    levelName: "Editorial & Technical Standards",
    severity: "MEDIUM",
    category: "Image Quality",
    keywords: [],
    instruction: "Flag low-resolution, blurry, or misleading images.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 4,
    levelName: "Destination & Landing Page",
    severity: "MEDIUM",
    category: "Page Functionality",
    keywords: [],
    instruction: "Verify the landing page loads correctly, has SSL, and no broken links.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 4,
    levelName: "Destination & Landing Page",
    severity: "MEDIUM",
    category: "Content Consistency",
    keywords: [],
    instruction: "Ensure ad content matches landing page content and offers.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 2,
    levelName: "Restricted Content",
    severity: "HIGH",
    category: "Political Ads",
    keywords: ["vote", "election", "candidate", "political party", "campaign"],
    instruction: "Require advertiser identity verification and proper disclosures.",
    isActive: true,
    requiresCertification: true,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
  {
    levelId: 1,
    levelName: "Prohibited Content",
    severity: "CRITICAL",
    category: "Hate Speech & Discrimination",
    keywords: ["hate", "racist", "discriminate", "slur", "offensive"],
    instruction: "Reject content promoting hate, discrimination, or targeting protected groups.",
    isActive: true,
    requiresCertification: false,
    ageRestriction: undefined,
    geoRestrictions: undefined,
  },
];

const usersData = [
  {
    clerkId: "system_admin",
    username: "admin",
    email: "admin@projectnova.com",
    displayName: "System Administrator",
    userStatus: "active",
    emailVerified: true,
    loginCount: 0,
    twoFactorEnabled: false,
  },
];

// Seed Products
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("novaProducts").first();
    if (existing) {
      return { message: "Products already seeded", count: 0 };
    }

    let count = 0;
    for (const product of productsData) {
      await ctx.db.insert("novaProducts", product);
      count++;
    }
    return { message: "Products seeded successfully", count };
  },
});

// Seed Automation Templates
export const seedAutomationTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("automationTemplates").first();
    if (existing) {
      return { message: "Automation templates already seeded", count: 0 };
    }

    let count = 0;
    for (const template of automationTemplatesData) {
      await ctx.db.insert("automationTemplates", template);
      count++;
    }
    return { message: "Automation templates seeded successfully", count };
  },
});

// Seed Ad Policy Rules
export const seedAdPolicyRules = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("adPolicyRules").first();
    if (existing) {
      return { message: "Ad policy rules already seeded", count: 0 };
    }

    let count = 0;
    for (const rule of adPolicyRulesData) {
      await ctx.db.insert("adPolicyRules", rule);
      count++;
    }
    return { message: "Ad policy rules seeded successfully", count };
  },
});

// Seed Users
export const seedUsers = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("novaUsers").first();
    if (existing) {
      return { message: "Users already seeded", count: 0 };
    }

    let count = 0;
    for (const user of usersData) {
      await ctx.db.insert("novaUsers", user);
      count++;
    }
    return { message: "Users seeded successfully", count };
  },
});

// Seed All Data (does NOT include competitive products - use seedCompetitiveProducts for those)
export const seedQuiz = mutation({
  args: {},
  handler: async (ctx) => {
    const results: Record<string, any> = {};

    const existingQuestions = await ctx.db.query("quizQuestions").first();
    if (!existingQuestions) {
      let count = 0;
      for (const q of quizQuestionsData) {
        await ctx.db.insert("quizQuestions", q);
        count++;
      }
      results.quizQuestions = { seeded: true, count };
    } else {
      results.quizQuestions = { seeded: false, message: "Already exists" };
    }

    // Get existing products for rule recommendations
    const products = await ctx.db.query("novaProducts").collect();
    const productBySlug = new Map(products.map((p: any) => [p.productSlug, p._id]));

    const getProductIds = (slugs: string[]) =>
      slugs.map((s) => productBySlug.get(s)).filter(Boolean) as any[];

    const rulesWithProducts = [
      {
        ...quizResultRulesData[0],
        recommendedProductIds: getProductIds(["canva", "notion", "grammarly"]),
      },
      {
        ...quizResultRulesData[1],
        recommendedProductIds: getProductIds(["canva", "notion", "mailchimp"]),
      },
      {
        ...quizResultRulesData[2],
        recommendedProductIds: getProductIds(["asana", "notion", "slack"]),
      },
      {
        ...quizResultRulesData[3],
        recommendedProductIds: getProductIds(["hubspot", "notion", "slack"]),
      },
      {
        ...quizResultRulesData[4],
        recommendedProductIds: getProductIds(["github", "vercel", "sentry"]),
      },
      {
        ...quizResultRulesData[5],
        recommendedProductIds: getProductIds(["asana", "clickup", "microsoft-teams"]),
      },
      {
        ...quizResultRulesData[6],
        recommendedProductIds: getProductIds(["canva", "notion", "buffer"]),
      },
      {
        ...quizResultRulesData[7],
        recommendedProductIds: getProductIds(["zapier", "make", "notion"]),
      },
      {
        ...quizResultRulesData[8],
        recommendedProductIds: getProductIds(["notion", "clickup", "zapier"]),
      },
    ];

    const existingRules = await ctx.db.query("quizResultRules").first();
    if (!existingRules) {
      let count = 0;
      for (const r of rulesWithProducts) {
        await ctx.db.insert("quizResultRules", r);
        count++;
      }
      results.quizResultRules = { seeded: true, count };
    } else {
      results.quizResultRules = { seeded: false, message: "Already exists" };
    }

    return results;
  },
});

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const results: Record<string, any> = {};

    // Seed products
    const existingProducts = await ctx.db.query("novaProducts").first();
    if (!existingProducts) {
      let count = 0;
      for (const product of productsData) {
        await ctx.db.insert("novaProducts", product);
        count++;
      }
      results.products = { seeded: true, count };
    } else {
      results.products = { seeded: false, message: "Already exists" };
    }

    // Seed automation templates
    const existingTemplates = await ctx.db.query("automationTemplates").first();
    if (!existingTemplates) {
      let count = 0;
      for (const template of automationTemplatesData) {
        await ctx.db.insert("automationTemplates", template);
        count++;
      }
      results.automationTemplates = { seeded: true, count };
    } else {
      results.automationTemplates = { seeded: false, message: "Already exists" };
    }

    // Seed ad policy rules
    const existingAdPolicyRules = await ctx.db.query("adPolicyRules").first();
    if (!existingAdPolicyRules) {
      let count = 0;
      for (const rule of adPolicyRulesData) {
        await ctx.db.insert("adPolicyRules", rule);
        count++;
      }
      results.adPolicyRules = { seeded: true, count };
    } else {
      results.adPolicyRules = { seeded: false, message: "Already exists" };
    }

    // Seed users
    const existingUsers = await ctx.db.query("novaUsers").first();
    if (!existingUsers) {
      let count = 0;
      for (const user of usersData) {
        await ctx.db.insert("novaUsers", user);
        count++;
      }
      results.users = { seeded: true, count };
    } else {
      results.users = { seeded: false, message: "Already exists" };
    }

    // Seed quiz questions
    const existingQuestions = await ctx.db.query("quizQuestions").first();
    if (!existingQuestions) {
      let count = 0;
      for (const q of quizQuestionsData) {
        await ctx.db.insert("quizQuestions", q);
        count++;
      }
      results.quizQuestions = { seeded: true, count };
    } else {
      results.quizQuestions = { seeded: false, message: "Already exists" };
    }

    // Seed quiz result rules
    const existingQuizRules = await ctx.db.query("quizResultRules").first();
    if (!existingQuizRules) {
      let count = 0;
      for (const r of quizResultRulesData) {
        await ctx.db.insert("quizResultRules", r);
        count++;
      }
      results.quizResultRules = { seeded: true, count };
    } else {
      results.quizResultRules = { seeded: false, message: "Already exists" };
    }

    return results;
  },
});

const quizQuestionsData = [
  {
    questionText: "What best describes your role?",
    questionKey: "role",
    questionType: "single_choice",
    options: [
      { id: "solopreneur", label: "Solopreneur / Freelancer", valueTag: "solo", icon: "user" },
      { id: "smb_team", label: "SMB Team (2-50)", valueTag: "smb", icon: "users" },
      { id: "enterprise", label: "Enterprise (50+)", valueTag: "enterprise", icon: "building" },
      { id: "developer", label: "Developer / Engineer", valueTag: "dev", icon: "code" },
      { id: "creator", label: "Content Creator / Marketer", valueTag: "creator", icon: "pen" },
    ],
    category: "profile",
    sortOrder: 1,
    isActive: true,
    helpText: "This helps us understand your context and tool needs.",
  },
  {
    questionText: "What's your primary focus area?",
    questionKey: "useCase",
    questionType: "single_choice",
    options: [
      { id: "content_creation", label: "Content Creation & Marketing", valueTag: "content", icon: "pen-tool" },
      { id: "crm_sales", label: "CRM & Sales Pipeline", valueTag: "sales", icon: "trending-up" },
      { id: "project_mgmt", label: "Project Management & Collaboration", valueTag: "pm", icon: "layout" },
      { id: "dev_tools", label: "Developer Tools & Infrastructure", valueTag: "devtools", icon: "terminal" },
      { id: "automation", label: "Automation & Workflow", valueTag: "automation", icon: "zap" },
      { id: "ai_workflow", label: "AI Workflow & Analytics", valueTag: "ai", icon: "brain" },
    ],
    category: "focus",
    sortOrder: 2,
    isActive: true,
  },
  {
    questionText: "How big is your team?",
    questionKey: "teamSize",
    questionType: "single_choice",
    options: [
      { id: "just_me", label: "Just me (1)", valueTag: "1", icon: "user" },
      { id: "small", label: "Small team (2-10)", valueTag: "2-10", icon: "users" },
      { id: "growing", label: "Growing team (11-50)", valueTag: "11-50", icon: "briefcase" },
      { id: "large", label: "Large team (50+)", valueTag: "50+", icon: "building-2" },
    ],
    category: "scale",
    sortOrder: 3,
    isActive: true,
  },
  {
    questionText: "What's your monthly budget for tools?",
    questionKey: "budget",
    questionType: "single_choice",
    options: [
      { id: "free", label: "Free / Mostly free tools", valueTag: "free", icon: "smile" },
      { id: "low", label: "Under $50/month total", valueTag: "under50", icon: "dollar-sign" },
      { id: "medium", label: "$50-$200/month", valueTag: "50-200", icon: "credit-card" },
      { id: "high", label: "$200+/month — invest in quality", valueTag: "200plus", icon: "star" },
    ],
    category: "budget",
    sortOrder: 4,
    isActive: true,
  },
  {
    questionText: "Which features are must-haves?",
    questionKey: "features",
    questionType: "multi_choice",
    options: [
      { id: "api_access", label: "API access & integrations", valueTag: "api" },
      { id: "privacy", label: "Privacy-first / GDPR compliant", valueTag: "privacy" },
      { id: "no_lockin", label: "No vendor lock-in / data export", valueTag: "portable" },
      { id: "offline", label: "Offline mode", valueTag: "offline" },
      { id: "whitelabel", label: "White-label / custom branding", valueTag: "whitelabel" },
      { id: "collaboration", label: "Real-time collaboration", valueTag: "collab" },
      { id: "mobile", label: "Mobile app", valueTag: "mobile" },
      { id: "analytics", label: "Built-in analytics & reporting", valueTag: "analytics" },
    ],
    category: "features",
    sortOrder: 5,
    isActive: true,
    helpText: "Select all that apply to you.",
  },
  {
    questionText: "What tools are you already using?",
    questionKey: "currentStack",
    questionType: "multi_choice",
    options: [
      { id: "notion", label: "Notion", valueTag: "notion" },
      { id: "asana", label: "Asana / Monday.com", valueTag: "asana" },
      { id: "slack", label: "Slack", valueTag: "slack" },
      { id: "gmail", label: "Google Workspace", valueTag: "google" },
      { id: "hubspot", label: "HubSpot", valueTag: "hubspot" },
      { id: "figma", label: "Figma / Design tools", valueTag: "figma" },
      { id: "github", label: "GitHub / GitLab", valueTag: "github" },
      { id: "jira", label: "Jira", valueTag: "jira" },
      { id: "none", label: "None — starting fresh", valueTag: "fresh" },
    ],
    category: "current",
    sortOrder: 6,
    isActive: true,
    helpText: "Optional — helps us avoid recommending what you already have.",
  },
];

const quizResultRulesData = [
  {
    ruleName: "Solopreneur Content Creator — Budget-Conscious",
    conditions: { role: "solopreneur", useCase: "content_creation", budget: "free" },
    recommendedProductIds: [], // will be filled by seed with actual product IDs
    primaryUseCase: "content_creation",
    confidenceScore: 0.9,
    segmentTag: "Solo Creator (Free)",
    isActive: true,
  },
  {
    ruleName: "Solopreneur Content Creator — Mid Budget",
    conditions: { role: "solopreneur", useCase: "content_creation", budget: "low" },
    recommendedProductIds: [],
    primaryUseCase: "content_creation",
    confidenceScore: 0.85,
    segmentTag: "Solo Creator (Budget)",
    isActive: true,
  },
  {
    ruleName: "SMB Team — Project Management",
    conditions: { role: "smb_team", useCase: "project_mgmt", teamSize: "small" },
    recommendedProductIds: [],
    primaryUseCase: "project_mgmt",
    confidenceScore: 0.9,
    segmentTag: "Small Team — PM Focused",
    isActive: true,
  },
  {
    ruleName: "SMB Team — CRM & Sales",
    conditions: { role: "smb_team", useCase: "crm_sales" },
    recommendedProductIds: [],
    primaryUseCase: "crm_sales",
    confidenceScore: 0.85,
    segmentTag: "SMB — Sales Stack",
    isActive: true,
  },
  {
    ruleName: "Developer — Dev Tools",
    conditions: { role: "developer", useCase: "dev_tools" },
    recommendedProductIds: [],
    primaryUseCase: "dev_tools",
    confidenceScore: 0.9,
    segmentTag: "Developer Stack",
    isActive: true,
  },
  {
    ruleName: "Enterprise Team — PM & Collaboration",
    conditions: { role: "enterprise", useCase: "project_mgmt" },
    recommendedProductIds: [],
    primaryUseCase: "project_mgmt",
    confidenceScore: 0.8,
    segmentTag: "Enterprise — PM & Collaboration",
    isActive: true,
  },
  {
    ruleName: "Content Creator — Marketing Stack",
    conditions: { role: "creator", useCase: "content_creation" },
    recommendedProductIds: [],
    primaryUseCase: "content_creation",
    confidenceScore: 0.85,
    segmentTag: "Content Creator Stack",
    isActive: true,
  },
  {
    ruleName: "Automation Enthusiast",
    conditions: { useCase: "automation" },
    recommendedProductIds: [],
    primaryUseCase: "automation",
    confidenceScore: 0.75,
    segmentTag: "Automation-Focused Stack",
    isActive: true,
  },
  {
    ruleName: "AI Workflow & Analytics",
    conditions: { useCase: "ai_workflow" },
    recommendedProductIds: [],
    primaryUseCase: "ai_workflow",
    confidenceScore: 0.8,
    segmentTag: "AI Workflow Stack",
    isActive: true,
  },
];
