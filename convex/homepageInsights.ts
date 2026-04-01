/**
 * Homepage widgets: live score activity, ecosystem health, trending topics, deal highlights.
 */
import { query } from "./_generated/server";
import { v } from "convex/values";

export const liveScoreFeed = query({
  args: { hoursBack: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const ms = (args.hoursBack ?? 24) * 60 * 60 * 1000;
    const cutoff = Date.now() - ms;
    const products = await ctx.db
      .query("novaProducts")
      .filter((q) => q.eq(q.field("status"), "active"))
      .take(400);

    const items: {
      productId: string;
      slug: string;
      name: string;
      kind: "trust" | "integration";
      score: number;
      testedDate: number;
    }[] = [];

    for (const p of products) {
      const t = await ctx.db
        .query("novaTrustScores")
        .withIndex("by_current", (q) =>
          q.eq("productId", p._id).eq("isCurrent", true)
        )
        .first();
      const i = await ctx.db
        .query("novaIntegrationScores")
        .withIndex("by_current", (q) =>
          q.eq("productId", p._id).eq("isCurrent", true)
        )
        .first();
      if (t && t.testedDate >= cutoff) {
        items.push({
          productId: p._id,
          slug: p.productSlug,
          name: p.productName,
          kind: "trust",
          score: t.totalScore,
          testedDate: t.testedDate,
        });
      }
      if (i && i.testedDate >= cutoff) {
        items.push({
          productId: p._id,
          slug: p.productSlug,
          name: p.productName,
          kind: "integration",
          score: i.totalScore,
          testedDate: i.testedDate,
        });
      }
    }

    return items.sort((a, b) => b.testedDate - a.testedDate).slice(0, 20);
  },
});

export const ecosystemHealthSummary = query({
  args: {},
  handler: async (ctx) => {
    const protocols = [
      "Matter",
      "Zigbee",
      "Z-Wave",
      "Thread",
      "Apple HomeKit",
      "Google Home",
      "Amazon Alexa",
    ];
    const rows = await ctx.db.query("novaEcosystemCompatibility").collect();
    const filtered = rows.filter((r) => protocols.includes(r.ecosystem));

    const byLevel = {
      full: 0,
      partial: 0,
      limited: 0,
      none: 0,
      unknown: 0,
    };
    for (const r of filtered) {
      const k = r.compatibilityLevel as keyof typeof byLevel;
      if (k in byLevel) byLevel[k]++;
      else byLevel.unknown++;
    }
    const total = filtered.length || 1;
    return {
      byLevel,
      totalRows: filtered.length,
      pct: {
        native: Math.round((byLevel.full / total) * 100),
        partial: Math.round((byLevel.partial / total) * 100),
        limited: Math.round(((byLevel.limited + byLevel.none) / total) * 100),
      },
    };
  },
});

export const trendingTopicsForHome = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const lim = args.limit ?? 8;
    // Avoid hard dependency on by_status index so this query keeps working
    // even while local/dev schema is in transition.
    const topics = (await ctx.db.query("trendingTopics").collect()).filter(
      (topic) => topic.status === "active"
    );
    const sorted = topics
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, lim);

    const out = [];
    for (const t of sorted) {
      let postSlug: string | undefined;
      let postTitle: string | undefined;
      if (t.assignedPostId) {
        const post = await ctx.db.get(t.assignedPostId);
        if (post) {
          postSlug = post.postSlug;
          postTitle = post.postTitle;
        }
      }
      out.push({
        _id: t._id,
        topic: t.topic,
        hubSlug: t.hubSlug,
        opportunityScore: t.opportunityScore,
        assignedPostId: t.assignedPostId,
        postSlug,
        postTitle,
      });
    }
    return out;
  },
});

export const dealHighlights = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const lim = args.limit ?? 6;
    const links = await ctx.db
      .query("novaAffiliateLinks")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .take(200);

    const deals: {
      productId: string;
      slug: string;
      name: string;
      currentPrice?: number;
      originalPrice?: number;
      pctOff: number;
    }[] = [];

    for (const link of links) {
      const cur = link.currentPrice;
      const orig = link.originalPrice;
      if (cur == null || orig == null || orig <= 0) continue;
      const pct = Math.round(((orig - cur) / orig) * 100);
      if (pct < 10) continue;
      const product = await ctx.db.get(link.productId);
      if (!product || product.status !== "active") continue;
      deals.push({
        productId: product._id,
        slug: product.productSlug,
        name: product.productName,
        currentPrice: cur,
        originalPrice: orig,
        pctOff: pct,
      });
    }

    return deals.sort((a, b) => b.pctOff - a.pctOff).slice(0, lim);
  },
});
