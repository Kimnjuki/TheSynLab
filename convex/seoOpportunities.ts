import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type Opportunity = {
  id: string;
  category: "content" | "links" | "technical";
  type: string;
  title: string;
  summary: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  references: string[];
  implementationSteps: string[];
};

function asId(value: string) {
  return value.replaceAll(" ", "-").toLowerCase();
}

export const getOpportunitiesDashboard = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    const [keywords, posts, links, crawlIssues, seoAudits, redirects] = await Promise.all([
      ctx.db.query("hubKeywords").collect(),
      ctx.db.query("novaPosts").collect(),
      ctx.db.query("internalLinks").collect(),
      ctx.db.query("crawlIssues").collect(),
      ctx.db.query("seoAuditResults").collect(),
      ctx.db.query("novaRedirectRules").collect(),
    ]);

    const opportunities: Opportunity[] = [];

    const lowHanging = keywords.filter(
      (k) => (k.currentRank ?? 999) >= 4 && (k.currentRank ?? 999) <= 15
    );
    if (lowHanging.length) {
      opportunities.push({
        id: asId("low-hanging-fruit-keywords"),
        category: "content",
        type: "low_hanging_keywords",
        title: "Low-hanging fruit keywords (positions 4-15)",
        summary: `${lowHanging.length} tracked keywords are in striking distance and can be pushed into top 3.`,
        impact: "high",
        effort: "medium",
        references: lowHanging.slice(0, 10).map((k) => k.keyword),
        implementationSteps: [
          "Refresh matching pages with stronger intent alignment and updated data points.",
          "Improve title/H1/intro alignment around the target keyword and user intent.",
          "Add 2-4 internal links from relevant high-authority pages with descriptive anchors.",
          "Update on-page schema and republish to trigger re-crawl.",
        ],
      });
    }

    const snippetTerms = keywords.filter((k) =>
      ["ai_overview", "featured_snippet"].includes((k.keywordType ?? "").toLowerCase())
    );
    if (snippetTerms.length) {
      opportunities.push({
        id: asId("ai-overviews-and-featured-snippets"),
        category: "content",
        type: "snippets_ai_overview",
        title: "AI Overviews and featured snippets",
        summary: `${snippetTerms.length} snippet-oriented keywords found. Optimize concise answer blocks and structured sections.`,
        impact: "high",
        effort: "medium",
        references: snippetTerms.slice(0, 10).map((k) => k.keyword),
        implementationSteps: [
          "Add direct answer blocks (40-70 words) near top of page.",
          "Use FAQ and HowTo-like sectioning where relevant.",
          "Add comparison tables and short definition blocks for extractability.",
          "Ensure target keyword appears naturally in answer heading.",
        ],
      });
    }

    const contentGapCandidates = keywords.filter(
      (k) => (k.contentStatus ?? "").toLowerCase() === "pending"
    );
    if (contentGapCandidates.length) {
      opportunities.push({
        id: asId("top-suggestions-from-content-gap"),
        category: "content",
        type: "content_gap",
        title: "Top suggestions from content gap",
        summary: `${contentGapCandidates.length} pending keyword opportunities can be turned into new pages.`,
        impact: "high",
        effort: "high",
        references: contentGapCandidates.slice(0, 10).map((k) => k.keyword),
        implementationSteps: [
          "Cluster pending keywords by intent and assign one primary URL per cluster.",
          "Create 3-5 high-priority pages first (highest volume and lower difficulty).",
          "Interlink new pages to existing hub and pillar pages.",
          "Track publication in hubKeywords.contentStatus and monitor indexation.",
        ],
      });
    }

    const decliningTraffic = posts.filter(
      (p) => (p.publishedAt ?? 0) < sixMonthsAgo && (p.lastViewedAt ?? 0) < sixMonthsAgo
    );
    if (decliningTraffic.length) {
      opportunities.push({
        id: asId("content-with-declining-traffic"),
        category: "content",
        type: "declining_traffic",
        title: "Content with declining traffic (6+ months)",
        summary: `${decliningTraffic.length} pages look stale and should be refreshed.`,
        impact: "high",
        effort: "medium",
        references: decliningTraffic.slice(0, 10).map((p) => p.postSlug),
        implementationSteps: [
          "Refresh old data points, screenshots, and examples.",
          "Add new internal links and update linked opportunities/alternatives.",
          "Rework intros and conclusions for current SERP intent.",
          "Republish with updated timestamps and submit sitemap.",
        ],
      });
    }

    const publishedOnceLowTraffic = posts.filter(
      (p) => (p.publishedAt ?? 0) < oneYearAgo && (p.viewCount ?? 0) < 100
    );
    if (publishedOnceLowTraffic.length) {
      opportunities.push({
        id: asId("pages-only-published-once"),
        category: "content",
        type: "published_once",
        title: "Pages only published once with low traffic",
        summary: `${publishedOnceLowTraffic.length} old pages have low visibility and need consolidation or refresh.`,
        impact: "medium",
        effort: "medium",
        references: publishedOnceLowTraffic.slice(0, 10).map((p) => p.postSlug),
        implementationSteps: [
          "Classify each URL: refresh, merge into stronger URL, or noindex/prune.",
          "For merges, 301 old URL to canonical destination and update internal links.",
          "For refreshes, improve depth, examples, and SERP match.",
        ],
      });
    }

    const byKeyword = new Map<string, number>();
    for (const p of posts) {
      const key = (p.primaryKeyword ?? "").trim().toLowerCase();
      if (!key) continue;
      byKeyword.set(key, (byKeyword.get(key) ?? 0) + 1);
    }
    const cannibalized = [...byKeyword.entries()].filter(([, count]) => count > 1);
    if (cannibalized.length) {
      opportunities.push({
        id: asId("potential-cannibalization"),
        category: "content",
        type: "cannibalization",
        title: "Potential keyword cannibalization",
        summary: `${cannibalized.length} primary keywords are targeted by multiple pages.`,
        impact: "high",
        effort: "medium",
        references: cannibalized.slice(0, 10).map(([k, c]) => `${k} (${c} pages)`),
        implementationSteps: [
          "Map one canonical URL per search intent cluster.",
          "Merge or de-optimize overlapping pages that target identical intent.",
          "Update internal anchors to point to canonical page.",
        ],
      });
    }

    const unresolved404 = crawlIssues.filter(
      (i) => !i.isResolved && i.issueType.toLowerCase().includes("404")
    );
    if (unresolved404.length) {
      opportunities.push({
        id: asId("redirects-to-implement"),
        category: "links",
        type: "redirects_404",
        title: "Redirects to implement (404 reclamation)",
        summary: `${unresolved404.length} unresolved 404 issues can reclaim link equity with redirects.`,
        impact: "high",
        effort: "low",
        references: unresolved404.slice(0, 10).map((i) => i.url),
        implementationSteps: [
          "Create 301 redirects from obsolete URLs to closest topical equivalents.",
          "Update sitemap entries and internal references after redirect creation.",
          "Track reclaimed URLs in redirect rules and verify in crawl report.",
        ],
      });
    }

    const lowLinkPosts = posts.filter((p) => {
      const out = links.filter((l) => l.sourcePostId === p._id).length;
      return out < 2 && p.postStatus === "published";
    });
    if (lowLinkPosts.length) {
      opportunities.push({
        id: asId("internal-link-opportunities"),
        category: "links",
        type: "internal_linking",
        title: "Internal link opportunities",
        summary: `${lowLinkPosts.length} published posts have weak internal link distribution (<2 outgoing links).`,
        impact: "high",
        effort: "low",
        references: lowLinkPosts.slice(0, 10).map((p) => p.postSlug),
        implementationSteps: [
          "Add contextual links to related product, comparison, and hub pages.",
          "Use descriptive anchors tied to destination intent.",
          "Prioritize links from high-traffic pages to underperforming strategic pages.",
        ],
      });
    }

    const genericAnchors = links.filter((l) =>
      ["click here", "read more", "learn more", "here"].includes(l.anchorText.toLowerCase())
    );
    if (genericAnchors.length) {
      opportunities.push({
        id: asId("descriptive-anchors"),
        category: "links",
        type: "anchor_quality",
        title: "Descriptive anchors",
        summary: `${genericAnchors.length} internal links use generic anchors.`,
        impact: "medium",
        effort: "low",
        references: genericAnchors.slice(0, 10).map((l) => l.anchorText),
        implementationSteps: [
          "Replace generic anchors with destination-descriptive phrase anchors.",
          "Keep anchor language natural and aligned with page topic.",
          "Avoid over-optimization and exact-match overuse.",
        ],
      });
    }

    const criticalTech = crawlIssues.filter(
      (i) => !i.isResolved && ["critical", "high"].includes(i.severity.toLowerCase())
    );
    const lowSeoScore = seoAudits.filter((a) => (a.overallScore ?? 100) < 70);
    if (criticalTech.length || lowSeoScore.length) {
      opportunities.push({
        id: asId("technical-critical-issues"),
        category: "technical",
        type: "critical_issues",
        title: "Critical technical issues",
        summary: `${criticalTech.length} critical/high crawl issues and ${lowSeoScore.length} low-scoring SEO audits need remediation.`,
        impact: "high",
        effort: "high",
        references: [
          ...criticalTech.slice(0, 5).map((i) => `${i.issueType}: ${i.url}`),
          ...lowSeoScore.slice(0, 5).map((a) => `post:${String(a.postId)} score:${a.overallScore}`),
        ],
        implementationSteps: [
          "Resolve indexing, sitemap, and broken-link issues first.",
          "Fix page-level metadata/schema/content-structure problems flagged by audits.",
          "Re-crawl after fixes and close resolved issues in tracking.",
        ],
      });
    }

    const unresolvedRedirectBacklog = redirects.filter((r) => !r.isActive).length;

    return {
      generatedAt: now,
      totals: {
        opportunities: opportunities.length,
        content: opportunities.filter((o) => o.category === "content").length,
        links: opportunities.filter((o) => o.category === "links").length,
        technical: opportunities.filter((o) => o.category === "technical").length,
        unresolved404: unresolved404.length,
        inactiveRedirectRules: unresolvedRedirectBacklog,
      },
      opportunities,
    };
  },
});

export const createExecutionTask = mutation({
  args: {
    opportunityId: v.string(),
    title: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    createdBy: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: "todo",
      priority: args.priority,
      assignedTo: undefined,
      createdBy: args.createdBy,
      projectId: undefined,
      dueDate: undefined,
      estimatedHours: undefined,
      actualHours: 0,
      tags: ["seo", "ahrefs-opportunity", args.opportunityId],
      dependencies: undefined,
      parentTaskId: undefined,
      sortOrder: 0,
    });
  },
});
