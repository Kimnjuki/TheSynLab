import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const sortByValidator = v.union(
  v.literal("trustScore"),
  v.literal("integrationDepth"),
  v.literal("lockInRisk"),
  v.literal("trending"),
  v.literal("newest")
);

const lockInRiskOrder: Record<string, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function parseTeamSizeFit(value?: string) {
  if (!value) return null;
  if (value === "solo" || value === "1") return { min: 1, max: 1 };
  if (value === "small" || value === "2-10") return { min: 2, max: 10 };
  if (value === "mid" || value === "11-50") return { min: 11, max: 50 };
  if (value === "large" || value === "50+") return { min: 50, max: Number.POSITIVE_INFINITY };
  return null;
}

function getDecisionTraits(card: any): string[] {
  if (!card) return [];
  const traits: string[] = [];
  if (card.selfHostOption) traits.push("Self-hosted", "Open Source");
  if (card.soc2Ready) traits.push("SOC 2");
  if (card.gdprReady) traits.push("EU Data Residency");
  return traits;
}

export const getProductsHubData = query({
  args: {
    hubSlug: v.optional(v.string()),
    category: v.optional(v.string()),
    useCaseTags: v.optional(v.array(v.string())),
    technicalTraits: v.optional(v.array(v.string())),
    sortBy: v.optional(sortByValidator),
    lockInRisk: v.optional(v.string()),
    teamSizeFit: v.optional(v.string()),
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const page = Math.max(0, args.page ?? 0);
    const limit = Math.min(100, Math.max(1, args.limit ?? 24));
    const sortBy = args.sortBy ?? "trustScore";

    let products = args.hubSlug
      ? await ctx.db.query("novaProducts").withIndex("by_hub", (q) => q.eq("hub", args.hubSlug!)).collect()
      : await ctx.db.query("novaProducts").collect();

    products = products.filter((p) => p.status === "active");
    if (args.category) {
      products = products.filter((p) => p.category === args.category);
    }

    const enriched = await Promise.all(
      products.map(async (product) => {
        const [decisionCard, trustScore, integrationScore, follows] = await Promise.all([
          ctx.db
            .query("productDecisionCards")
            .withIndex("by_current", (q) => q.eq("productId", product._id).eq("isCurrent", true))
            .first(),
          ctx.db
            .query("novaTrustScores")
            .withIndex("by_current", (q) => q.eq("productId", product._id).eq("isCurrent", true))
            .first(),
          ctx.db
            .query("novaIntegrationScores")
            .withIndex("by_current", (q) => q.eq("productId", product._id).eq("isCurrent", true))
            .first(),
          ctx.db
            .query("productFollows")
            .withIndex("by_product", (q) => q.eq("productId", product._id))
            .collect(),
        ]);
        return {
          product,
          decisionCard,
          trustScore,
          integrationScore,
          followCount: follows.length,
        };
      })
    );

    const teamRange = parseTeamSizeFit(args.teamSizeFit);
    let filtered = enriched.filter((item) => {
      const card = item.decisionCard;

      if (args.lockInRisk && card && card.lockInRisk !== args.lockInRisk) return false;

      if ((args.useCaseTags?.length ?? 0) > 0) {
        const tags = new Set([...(card?.bestForTags ?? [])]);
        const matchesAny = args.useCaseTags!.some((tag) => tags.has(tag));
        if (!matchesAny) return false;
      }

      if ((args.technicalTraits?.length ?? 0) > 0) {
        const traits = new Set(getDecisionTraits(card));
        const matchesAll = args.technicalTraits!.every((trait) => traits.has(trait));
        if (!matchesAll) return false;
      }

      if (teamRange && card) {
        const min = card.teamSizeMin ?? 1;
        const max = card.teamSizeMax ?? Number.POSITIVE_INFINITY;
        const overlaps = min <= teamRange.max && max >= teamRange.min;
        if (!overlaps) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      if (sortBy === "integrationDepth") {
        return (b.integrationScore?.totalScore ?? 0) - (a.integrationScore?.totalScore ?? 0);
      }
      if (sortBy === "lockInRisk") {
        return (
          (lockInRiskOrder[a.decisionCard?.lockInRisk ?? "medium"] ?? 1) -
          (lockInRiskOrder[b.decisionCard?.lockInRisk ?? "medium"] ?? 1)
        );
      }
      if (sortBy === "trending") {
        return (a.product.trendingRank ?? Number.MAX_SAFE_INTEGER) - (b.product.trendingRank ?? Number.MAX_SAFE_INTEGER);
      }
      if (sortBy === "newest") {
        return (b.product.releaseDate ?? 0) - (a.product.releaseDate ?? 0);
      }
      return (b.trustScore?.totalScore ?? 0) - (a.trustScore?.totalScore ?? 0);
    });

    const totalCount = filtered.length;
    const paginated = filtered.slice(page * limit, page * limit + limit);

    const sections = (await ctx.db.query("productHubSections").withIndex("by_order").collect()).filter((s) => {
      if (!s.isActive) return false;
      return args.hubSlug ? s.hubSlug === args.hubSlug : true;
    });

    return {
      products: paginated,
      totalCount,
      sections,
    };
  },
});

export const getTrendingProducts = query({
  args: {
    periodYear: v.number(),
    periodMonth: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(20, Math.max(1, args.limit ?? 6));
    const rows = await ctx.db
      .query("productTrendingScores")
      .withIndex("by_period", (q) => q.eq("periodYear", args.periodYear).eq("periodMonth", args.periodMonth))
      .collect();

    const current = rows.filter((r) => r.isCurrent);
    const sortedByRank = [...current].sort((a, b) => a.trendingRank - b.trendingRank);
    const sortedByVelocity = [...current].sort((a, b) => b.velocityScore - a.velocityScore);
    const sortedByTrustDelta = [...current].sort((a, b) => b.trustScoreDelta - a.trustScoreDelta);

    const hydrate = async (row: (typeof current)[number]) => {
      const product = await ctx.db.get(row.productId);
      if (!product) return null;
      const trust = await ctx.db
        .query("novaTrustScores")
        .withIndex("by_current", (q) => q.eq("productId", row.productId).eq("isCurrent", true))
        .first();
      return { ...row, product, trustScore: trust?.totalScore ?? null };
    };

    const [bestOfMonth, fastestRising, allTimeLeaders] = await Promise.all([
      Promise.all(sortedByRank.slice(0, limit).map(hydrate)),
      Promise.all(sortedByVelocity.slice(0, limit).map(hydrate)),
      Promise.all(sortedByTrustDelta.slice(0, limit).map(hydrate)),
    ]);

    return {
      bestOfMonth: bestOfMonth.filter(Boolean),
      fastestRising: fastestRising.filter(Boolean),
      allTimeLeaders: allTimeLeaders.filter(Boolean),
    };
  },
});

export const getProductDecisionCard = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const [card, follows, meta] = await Promise.all([
      ctx.db
        .query("productDecisionCards")
        .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
        .first(),
      ctx.db.query("productFollows").withIndex("by_product", (q) => q.eq("productId", args.productId)).collect(),
      ctx.db.query("productPageMeta").withIndex("by_product", (q) => q.eq("productId", args.productId)).first(),
    ]);
    return {
      ...(card ?? {}),
      followCount: follows.length,
      alternativeIds: meta?.alternativeProductIds ?? [],
      communityStackCount: card?.communityStackCount ?? 0,
    };
  },
});

export const getProductMiniGraph = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const graph = await ctx.db
      .query("productIntegrationMiniGraph")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .first();
    if (!graph) return { connectedProducts: [] };

    const connectedProducts = await Promise.all(
      graph.connectedProductIds.slice(0, 5).map(async (id) => {
        const product = await ctx.db.get(id);
        if (!product) return null;
        const key = String(id);
        return {
          id,
          name: product.productName,
          logoUrl: product.featuredImageUrl ?? null,
          connectionMethod: graph.connectionMethods?.[key] ?? "api",
          strength: graph.connectionStrengths?.[key] ?? 0,
        };
      })
    );
    return { connectedProducts: connectedProducts.filter(Boolean) };
  },
});

export const getBuyerJourneyPaths = query({
  args: { segment: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let paths = args.segment
      ? await ctx.db
          .query("buyerJourneyPaths")
          .withIndex("by_segment", (q) => q.eq("targetSegment", args.segment!))
          .collect()
      : await ctx.db.query("buyerJourneyPaths").collect();
    paths = paths.filter((p) => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
    return paths;
  },
});

export const getHubActivityFeed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(50, Math.max(1, args.limit ?? 8));
    const rows = await ctx.db.query("hubActivityFeed").withIndex("by_date").order("desc").take(limit * 2);
    return rows.filter((r) => r.isPublished).slice(0, limit);
  },
});

export const getUserStackCompatibility = query({
  args: {
    userId: v.string(),
    productIds: v.array(v.id("novaProducts")),
  },
  handler: async (ctx, args) => {
    const stacks = await ctx.db.query("userProductStack").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect();
    const activeStack = stacks.find((s) => s.isDefault) ?? stacks[0];
    const userProductIds = new Set((activeStack?.productIds ?? []).map((id) => String(id)));

    const entries = await Promise.all(
      args.productIds.map(async (productId) => {
        const graph = await ctx.db
          .query("productIntegrationMiniGraph")
          .withIndex("by_product", (q) => q.eq("productId", productId))
          .first();
        if (!graph) {
          return [String(productId), { compatibilityScore: 0, matchedTools: [] }] as const;
        }
        const matched = graph.connectedProductIds.filter((id) => userProductIds.has(String(id)));
        const score = graph.connectedProductIds.length
          ? Math.round((matched.length / graph.connectedProductIds.length) * 100)
          : 0;
        const matchedTools = await Promise.all(
          matched.map(async (id) => {
            const doc = await ctx.db.get(id);
            return doc?.productName ?? null;
          })
        );
        return [
          String(productId),
          { compatibilityScore: score, matchedTools: matchedTools.filter(Boolean) as string[] },
        ] as const;
      })
    );

    return Object.fromEntries(entries);
  },
});

export const getProductFollowStatus = query({
  args: {
    productId: v.id("novaProducts"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const allFollows = await ctx.db
      .query("productFollows")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    let isFollowing = false;
    if (args.userId) {
      const existing = await ctx.db
        .query("productFollows")
        .withIndex("by_user_product", (q) => q.eq("userId", args.userId!).eq("productId", args.productId))
        .first();
      isFollowing = Boolean(existing);
    }
    return { count: allFollows.length, isFollowing };
  },
});

export const getHubFilterOptions = query({
  args: { hubSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let products = args.hubSlug
      ? await ctx.db.query("novaProducts").withIndex("by_hub", (q) => q.eq("hub", args.hubSlug!)).collect()
      : await ctx.db.query("novaProducts").collect();
    products = products.filter((p) => p.status === "active");

    const productIds = new Set(products.map((p) => String(p._id)));
    const cards = await ctx.db.query("productDecisionCards").collect();
    const currentCards = cards.filter((c) => c.isCurrent && productIds.has(String(c.productId)));

    const categories = new Map<string, number>();
    const useCaseTags = new Map<string, number>();
    const technicalTraits = new Map<string, number>();
    const teamSizeFits = new Map<string, number>();
    const lockInRisks = new Map<string, number>();

    for (const product of products) {
      const category = product.category ?? "Uncategorized";
      categories.set(category, (categories.get(category) ?? 0) + 1);
    }

    for (const card of currentCards) {
      for (const tag of card.bestForTags ?? []) {
        useCaseTags.set(tag, (useCaseTags.get(tag) ?? 0) + 1);
      }
      for (const trait of getDecisionTraits(card)) {
        technicalTraits.set(trait, (technicalTraits.get(trait) ?? 0) + 1);
      }
      if (card.teamSizeMax === 1) {
        teamSizeFits.set("Solo (1)", (teamSizeFits.get("Solo (1)") ?? 0) + 1);
      } else if ((card.teamSizeMin ?? 0) <= 10) {
        teamSizeFits.set("Small (2-10)", (teamSizeFits.get("Small (2-10)") ?? 0) + 1);
      } else if ((card.teamSizeMax ?? 0) <= 50) {
        teamSizeFits.set("Mid (11-50)", (teamSizeFits.get("Mid (11-50)") ?? 0) + 1);
      } else {
        teamSizeFits.set("Large (50+)", (teamSizeFits.get("Large (50+)") ?? 0) + 1);
      }
      lockInRisks.set(card.lockInRisk, (lockInRisks.get(card.lockInRisk) ?? 0) + 1);
    }

    const toList = (map: Map<string, number>) =>
      Array.from(map.entries()).map(([label, count]) => ({ label, count }));

    return {
      categories: toList(categories),
      useCaseTags: toList(useCaseTags),
      technicalTraits: toList(technicalTraits),
      teamSizeFits: toList(teamSizeFits),
      lockInRisks: toList(lockInRisks),
    };
  },
});

export const getSavedFilterPresets = query({
  args: { userId: v.string() },
  handler: async (ctx, args) =>
    await ctx.db.query("productHubFilters").withIndex("by_user", (q) => q.eq("userId", args.userId)).collect(),
});

export const followProduct = mutation({
  args: {
    productId: v.id("novaProducts"),
    userId: v.string(),
    notifyOnTrustChange: v.boolean(),
    notifyOnNewReview: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("productFollows")
      .withIndex("by_user_product", (q) => q.eq("userId", args.userId).eq("productId", args.productId))
      .first();
    if (!existing) {
      await ctx.db.insert("productFollows", {
        userId: args.userId,
        productId: args.productId,
        followedAt: Date.now(),
        notifyOnTrustChange: args.notifyOnTrustChange,
        notifyOnNewReview: args.notifyOnNewReview,
        notifyOnNewTemplate: true,
      });
    }
    return { success: true };
  },
});

export const unfollowProduct = mutation({
  args: {
    productId: v.id("novaProducts"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("productFollows")
      .withIndex("by_user_product", (q) => q.eq("userId", args.userId).eq("productId", args.productId))
      .first();
    if (existing) await ctx.db.delete(existing._id);
    return { success: true };
  },
});

export const saveFilterPreset = mutation({
  args: {
    userId: v.string(),
    filterName: v.string(),
    filterConfig: v.any(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("productHubFilters", {
      userId: args.userId,
      filterName: args.filterName,
      categories: args.filterConfig?.categories,
      useCaseTags: args.filterConfig?.useCaseTags,
      technicalTraits: args.filterConfig?.technicalTraits,
      teamSizeFit: args.filterConfig?.teamSizeFit,
      minTrustScore: args.filterConfig?.minTrustScore,
      minIntegrationScore: args.filterConfig?.minIntegrationScore,
      lockInRisk: args.filterConfig?.lockInRisk,
      pricingComplexity: args.filterConfig?.pricingComplexity,
      sortBy: args.filterConfig?.sortBy ?? "trustScore",
      createdAt: Date.now(),
    });
    return { id };
  },
});

export const saveUserStack = mutation({
  args: {
    userId: v.string(),
    productIds: v.array(v.id("novaProducts")),
    stackName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("userProductStack").withIndex("by_user", (q) => q.eq("userId", args.userId)).first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        productIds: args.productIds,
        stackName: args.stackName,
        updatedAt: Date.now(),
      });
      return { id: existing._id };
    }
    const id = await ctx.db.insert("userProductStack", {
      userId: args.userId,
      productIds: args.productIds,
      stackName: args.stackName,
      isDefault: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return { id };
  },
});

export const upsertProductDecisionCard = mutation({
  args: {
    productId: v.id("novaProducts"),
    cardData: v.any(),
  },
  handler: async (ctx, args) => {
    const current = await ctx.db
      .query("productDecisionCards")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();

    if (current) {
      await ctx.db.patch(current._id, { isCurrent: false });
    }

    const id = await ctx.db.insert("productDecisionCards", {
      productId: args.productId,
      topPros: (args.cardData?.topPros ?? []).slice(0, 3),
      topWatchOuts: (args.cardData?.topWatchOuts ?? []).slice(0, 2),
      bestForTags: args.cardData?.bestForTags ?? [],
      keyIntegrations: (args.cardData?.keyIntegrations ?? []).slice(0, 5),
      selfHostOption: Boolean(args.cardData?.selfHostOption),
      soc2Ready: Boolean(args.cardData?.soc2Ready),
      gdprReady: Boolean(args.cardData?.gdprReady),
      lockInRisk: args.cardData?.lockInRisk ?? "medium",
      exportQuality: args.cardData?.exportQuality ?? "good",
      dataResidency: args.cardData?.dataResidency ?? "global",
      pricingComplexity: args.cardData?.pricingComplexity ?? "tiered",
      typicalCostTier: args.cardData?.typicalCostTier ?? "$$",
      teamSizeMin: args.cardData?.teamSizeMin,
      teamSizeMax: args.cardData?.teamSizeMax,
      overflowsAt: args.cardData?.overflowsAt,
      stackFitRole: args.cardData?.stackFitRole,
      alternativeCount: args.cardData?.alternativeCount ?? 0,
      workflowTemplateCount: args.cardData?.workflowTemplateCount ?? 0,
      communityStackCount: args.cardData?.communityStackCount ?? 0,
      generatedAt: Date.now(),
      isCurrent: true,
    });
    return { id };
  },
});

export const computeTrendingScores = mutation({
  args: {
    periodYear: v.number(),
    periodMonth: v.number(),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("novaProducts").collect();
    let processed = 0;

    for (const product of products) {
      const [trust, integration, follows, reviews] = await Promise.all([
        ctx.db
          .query("novaTrustScores")
          .withIndex("by_current", (q) => q.eq("productId", product._id).eq("isCurrent", true))
          .first(),
        ctx.db
          .query("novaIntegrationScores")
          .withIndex("by_current", (q) => q.eq("productId", product._id).eq("isCurrent", true))
          .first(),
        ctx.db.query("productFollows").withIndex("by_product", (q) => q.eq("productId", product._id)).collect(),
        ctx.db.query("productReviews").withIndex("by_product", (q) => q.eq("productId", product._id)).collect(),
      ]);

      const velocity = (trust?.totalScore ?? 0) * 0.4 + (integration?.totalScore ?? 0) * 0.3 + follows.length * 1.5 + reviews.length;
      const id = await ctx.db.insert("productTrendingScores", {
        productId: product._id,
        periodLabel: `${args.periodYear}-${String(args.periodMonth).padStart(2, "0")}`,
        periodYear: args.periodYear,
        periodMonth: args.periodMonth,
        trustScoreDelta: 0,
        integrationScoreDelta: 0,
        bookmarkCountDelta: follows.length,
        reviewCountDelta: reviews.length,
        trendingRank: 9999,
        velocityScore: velocity,
        computedAt: Date.now(),
        isCurrent: true,
      });
      void id;
      processed += 1;
    }

    const periodRows = await ctx.db
      .query("productTrendingScores")
      .withIndex("by_period", (q) => q.eq("periodYear", args.periodYear).eq("periodMonth", args.periodMonth))
      .collect();
    const ranked = [...periodRows].sort((a, b) => b.velocityScore - a.velocityScore);
    await Promise.all(
      ranked.map((row, i) =>
        ctx.db.patch(row._id, {
          trendingRank: i + 1,
        })
      )
    );

    return { processed };
  },
});

export const emitActivityFeedEvent = mutation({
  args: {
    activityType: v.string(),
    productId: v.id("novaProducts"),
    title: v.string(),
    scoreDelta: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("hubActivityFeed", {
      activityType: args.activityType,
      productId: args.productId,
      activityTitle: args.title,
      scoreDelta: args.scoreDelta,
      createdAt: Date.now(),
      isPublished: true,
    });
    return { id: id as Id<"hubActivityFeed"> };
  },
});
