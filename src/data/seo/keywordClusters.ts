/**
 * Top 10 "Best Of" SEO keyword clusters for TheSynLab.com
 *
 * Each cluster targets high-volume SaaS comparison/review queries
 * linked to existing tools on the platform and competitors (G2, Product Hunt).
 *
 * Search intents: "best [category] tools [year]" | "[tool] vs [tool]" | "[tool] alternatives"
 * Clusters align with TheSynLab's 7 categories + Trust Score differentiator.
 */

export interface KeywordCluster {
  /** The pillar question / primary keyword */
  pillar: string;
  /** Estimated search competition (G2/pro reviews) */
  competition: "high" | "medium" | "low";
  /** Existing tools on TheSynLab that map here */
  mappedTools: string[];
  /** Related long-tail queries to include as sub-articles */
  longTail: string[];
  /** Suggested article format */
  format: "listicle" | "comparison" | "alternatives" | "hub";
  /** Why TheSynLab can win this */
  angle: string;
}

export const top10Clusters: KeywordCluster[] = [
  // ── 1. SOCIAL MEDIA MANAGEMENT ──────────────────────────────────────
  {
    pillar: "best social media management tools 2026",
    competition: "high",
    mappedTools: ["SocialPilot", "Publer", "Sprout Social", "HypeAuditor"],
    longTail: [
      "best social media scheduling tools for agencies 2026",
      "SocialPilot vs Sprout Social vs Buffer 2026",
      "best social media analytics tools 2026",
      "SocialPilot review 2026 pricing features",
      "best SocialPilot alternatives 2026",
      "social media management tools for small business 2026",
    ],
    format: "listicle",
    angle: "Trust Score rankings give us credibility G2/Buffer lack — own the 'honest review' angle",
  },

  // ── 2. AI VIDEO GENERATORS ──────────────────────────────────────────
  {
    pillar: "best AI video generators 2026",
    competition: "high",
    mappedTools: ["Opus Clip", "Murf AI", "Play.ht", "ScreenRec", "Topview AI"],
    longTail: [
      "AI video generators for content repurposing 2026",
      "Opus Clip vs Descript vs Kapwing 2026",
      "AI video tools for social media marketing",
      "best text to video AI tools 2026",
      "free AI video generator 2026",
      "how to repurpose long form content into short form video",
    ],
    format: "listicle",
    angle: "TheSynLab has Opus Clip, ScreenRec, Topview — pitch against Synthesia, Runway. Integration scores matter here",
  },

  // ── 3. SYLLABY ALTERNATIVES & AI CONTENT ────────────────────────────
  {
    pillar: "best Syllaby alternatives 2026",
    competition: "medium",
    mappedTools: ["Syllaby", "Writesonic", "Blaze AI", "AirOps"],
    longTail: [
      "Syllaby vs Writesonic vs Blaze AI 2026",
      "AI video scripting tools alternatives to Syllaby",
      "best AI content tools for social media 2026",
      "Syllaby pricing vs competitors 2026",
      "free alternatives to Syllaby",
      "best AI video script writers 2026",
    ],
    format: "alternatives",
    angle: "Syllaby is a named tool on the platform — 'Syllaby alternatives 2026' is a high-intent commercial query",
  },

  // ── 4. SOCIALPILOT ALTERNATIVES ─────────────────────────────────────
  {
    pillar: "best SocialPilot alternatives 2026",
    competition: "high",
    mappedTools: ["SocialPilot", "Publer", "Sprout Social", "Radaar"],
    longTail: [
      "SocialPilot vs Publer vs Buffer 2026",
      "cheapest SocialPilot alternatives",
      "SocialPilot alternatives for freelancers",
      "best social media schedulers like SocialPilot",
      "SocialPilot pricing vs Hootsuite vs Buffer",
    ],
    format: "alternatives",
    angle: "Commercial intent buy-signal keyword. Price-sensitive audience — TheSynLab's pricing comparison is the differentiator",
  },

  // ── 5. AI DESIGN TOOLS ──────────────────────────────────────────────
  {
    pillar: "best AI design tools 2026",
    competition: "high",
    mappedTools: ["Writesonic", "Play.ht", "Murf AI", "Videvo"],
    longTail: [
      "AI design tools for non designers 2026",
      "best AI design tools for social media graphics",
      "AI image generation tools 2026",
      "Canva AI features vs dedicated AI design tools",
      "best AI tools for branding 2026",
    ],
    format: "listicle",
    angle: "Hub page /hub/ai-tools/design already exists — expand with Trust Scores targeting Canva/ChatGPT users",
  },

  // ── 6. PRODUCTIVITY TOOLS ───────────────────────────────────────────
  {
    pillar: "best productivity tools 2026",
    competition: "high",
    mappedTools: ["Mailmeteor", "GMass", "Productboard", "Help Scout"],
    longTail: [
      "best email productivity tools 2026",
      "best project management tools 2026",
      "GMass vs Mailmeteor vs Mail Merge 2026",
      "tools to reduce email overload 2026",
      "best Chrome extensions for productivity 2026",
      "productivity tools for remote teams 2026",
    ],
    format: "hub",
    angle: "Broad competition but TheSynLab's workflow-centric scoring fills a gap between Notion-style blogs and G2 review grids",
  },

  // ── 7. EMAIL OUTREACH TOOLS ─────────────────────────────────────────
  {
    pillar: "best cold email outreach tools 2026",
    competition: "medium",
    mappedTools: ["GMass", "Mailmeteor", "PhantomBuster", "Outscraper"],
    longTail: [
      "GMass vs Mailmeteor 2026 comparison",
      "best LinkedIn outreach tools 2026",
      "PhantomBuster vs Lemlist vs Outreach 2026",
      "Outscraper alternative for lead generation",
      "best tools for scraping LinkedIn leads 2026",
      "cold email tools that actually deliver 2026",
    ],
    format: "alternatives",
    angle: "Low competition, high commercial intent. TheSynLab has direct tool reviews for GMass, Mailmeteor, PhantomBuster — ready-made cluster",
  },

  // ── 8. DEV/INFRA TOOLS ──────────────────────────────────────────────
  {
    pillar: "best dev tools 2026",
    competition: "high",
    mappedTools: ["PhantomBuster", "Outscraper", "Productboard", "AirOps"],
    longTail: [
      "best developer productivity tools 2026",
      "best API testing tools 2026",
      "best no code tools for developers 2026",
      "web scraping tools 2026 compared",
      "Outscraper vs ScrapingBee vs Apify",
    ],
    format: "listicle",
    angle: "dev-infra category has 9 tools — strong cluster potential. 'Web scraping tools 2026' is a high-SERP volume query",
  },

  // ── 9. SCREEN RECORDING / DEMO TOOLS ────────────────────────────────
  {
    pillar: "best screen recording tools 2026",
    competition: "medium",
    mappedTools: ["ScreenRec", "Screen Pal", "Focusee", "BigVU"],
    longTail: [
      "best screen recorder for tutorials 2026",
      "screen recorder for Mac with editing 2026",
      "free screen recorder no watermark 2026",
      "ScreenRec vs Loom vs ScreenPal 2026",
      "Focusee alternative for software demos",
      "best screen recorder for remote work 2026",
    ],
    format: "comparison",
    angle: "TheSynLab has 4+ screen recording tools — already a category cluster. Loom comparison = high volume",
  },

  // ── 10. AI VOICE OVERS / TEXT TO SPEECH ─────────────────────────────
  {
    pillar: "best AI voice generators 2026",
    competition: "high",
    mappedTools: ["Murf AI", "Play.ht", "Mubert", "LALAL.AI"],
    longTail: [
      "best text to speech AI voices 2026",
      "Murf AI vs Play.ht vs ElevenLabs 2026",
      "AI voice over tools for YouTube 2026",
      "best AI voice generator for commercial use",
      "AI music generators for content creators 2026",
      "Mubert vs Epidemic Sound vs Uppbeat",
    ],
    format: "comparison",
    angle: "4 tools in video-audio category mapped. 'AI voice generators' is a top-growth query with good monetization potential (creator audience)",
  },
];

/**
 * G2 & Product Hunt competitor keywords to target
 *
 * These pages rank well on G2/PH but TheSynLab can compete on freshness and depth.
 */
export const g2KeywordOverlaps: { query: string; g2Page: string; angle: string }[] = [
  {
    query: "SocialPilot reviews",
    g2Page: "SocialPilot - G2 Reviews & Ratings",
    angle: "Our Trust Scores include integration depth + real pricing — G2 hides pricing",
  },
  {
    query: "best social media management software",
    g2Page: "Best Social Media Management - G2 Grid",
    angle: "TheSynLab's Integration Score fills the gap G2 ignores",
  },
  {
    query: "Syllaby pricing",
    g2Page: "Syllaby - Pricing & Reviews",
    angle: "Fresh 2026 pricing comparison + alternatives — G2 is static",
  },
  {
    query: "free screen recording software",
    g2Page: "Free Screen Recording - G2 Category",
    angle: "Listicle format with free tiers explicitly compared",
  },
  {
    query: "AI video generator comparison",
    g2Page: "AI Video - G2 Category",
    angle: "Video demos + Integration Scores beat G2's text-only reviews",
  },
  {
    query: "cold email software alternatives",
    g2Page: "Cold Email Software - G2",
    angle: "TheSynLab covers GMass, Mailmeteor, PhantomBuster — create 'vs' pages",
  },
];
