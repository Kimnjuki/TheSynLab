import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all active products with optional filters
export const list = query({
  args: {
    hub: v.optional(v.string()),
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    priceMin: v.optional(v.number()),
    priceMax: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("novaProducts")
      .filter((q) => q.eq(q.field("status"), args.status || "active"))
      .collect();

    if (args.hub) {
      products = products.filter((p) => p.hub === args.hub);
    }
    if (args.category) {
      products = products.filter((p) => p.category === args.category);
    }
    if (args.priceMin !== undefined) {
      products = products.filter((p) => (p.price || 0) >= args.priceMin!);
    }
    if (args.priceMax !== undefined) {
      products = products.filter((p) => (p.price || 0) <= args.priceMax!);
    }

    const productsWithScores = await Promise.all(
      products.map(async (product) => {
        const trustScore = await ctx.db
          .query("novaTrustScores")
          .withIndex("by_current", (q) =>
            q.eq("productId", product._id).eq("isCurrent", true)
          )
          .first();

        const integrationScore = await ctx.db
          .query("novaIntegrationScores")
          .withIndex("by_current", (q) =>
            q.eq("productId", product._id).eq("isCurrent", true)
          )
          .first();

        return {
          ...product,
          nova_trust_scores: trustScore ? [{ total_score: trustScore.totalScore }] : [],
          nova_integration_scores: integrationScore ? [{ total_score: integrationScore.totalScore }] : [],
        };
      })
    );

    return productsWithScores;
  },
});

// Get ecosystem compatibility for a product
export const getEcosystems = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("novaEcosystemCompatibility")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
  },
});

// Get a single product by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("novaProducts")
      .withIndex("by_slug", (q) => q.eq("productSlug", args.slug))
      .first();

    if (!product) return null;

    const trustScore = await ctx.db
      .query("novaTrustScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", product._id).eq("isCurrent", true)
      )
      .first();

    const integrationScore = await ctx.db
      .query("novaIntegrationScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", product._id).eq("isCurrent", true)
      )
      .first();

    const compatibility = await ctx.db
      .query("novaEcosystemCompatibility")
      .withIndex("by_product", (q) => q.eq("productId", product._id))
      .collect();

    return {
      ...product,
      trustScore,
      integrationScore,
      compatibility,
    };
  },
});

// Get product by ID (alias: get, used by ML/blockchain/matchScore)
export const get = query({
  args: { id: v.id("novaProducts") },
  handler: async (ctx, args) => await ctx.db.get(args.id),
});

// Get trust + integration scores for a product (used by ML feature extractor)
export const getScores = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const trust = await ctx.db
      .query("novaTrustScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();
    const integration = await ctx.db
      .query("novaIntegrationScores")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();
    return {
      trustScore: trust?.totalScore ?? 5,
      integrationScore: integration?.totalScore ?? 5,
    };
  },
});

export const getById = query({
  args: { id: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a product (no auth required for Git Bash deployment)
export const create = mutation({
  args: {
    productName: v.string(),
    productSlug: v.string(),
    hub: v.string(),
    manufacturer: v.optional(v.string()),
    category: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    productType: v.optional(v.string()),
    price: v.optional(v.number()),
    priceCurrency: v.optional(v.string()),
    priceModel: v.optional(v.string()),
    description: v.optional(v.string()),
    features: v.optional(v.any()),
    specifications: v.optional(v.any()),
    featuredImageUrl: v.optional(v.string()),
    officialWebsite: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("novaProducts", {
      ...args,
      productType: args.productType || "hardware",
      priceCurrency: args.priceCurrency || "USD",
      priceModel: args.priceModel || "one_time",
      status: "active",
      isSponsored: false,
      sponsorDisclosed: false,
    });
  },
});

// Update a product
export const update = mutation({
  args: {
    id: v.id("novaProducts"),
    productName: v.optional(v.string()),
    manufacturer: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    features: v.optional(v.any()),
    specifications: v.optional(v.any()),
    status: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Get hub/bridge product suggestions for a list of ecosystem names
export const getHubSuggestions = query({
  args: { ecosystems: v.array(v.string()) },
  handler: async (ctx, args) => {
    if (args.ecosystems.length === 0) return [];
    const hubs = await ctx.db
      .query("novaProducts")
      .filter((q) =>
        q.or(
          q.eq(q.field("category"), "hub"),
          q.eq(q.field("category"), "smart-hub"),
          q.eq(q.field("category"), "bridge")
        )
      )
      .take(20);
    const result = [];
    for (const hub of hubs) {
      const ecosystems = await ctx.db
        .query("novaEcosystemCompatibility")
        .withIndex("by_product", (q) => q.eq("productId", hub._id))
        .collect();
      const hubEcos = ecosystems.map((e) => e.ecosystem);
      const overlap = args.ecosystems.filter((e) => hubEcos.includes(e));
      if (overlap.length > 0) result.push({ ...hub, supportedEcosystems: hubEcos });
    }
    return result.slice(0, 3);
  },
});

// Get priceHistory for all affiliate links of a product
export const getPriceHistory = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const links = await ctx.db
      .query("novaAffiliateLinks")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();
    return links
      .filter((l) => l.priceHistory && Array.isArray(l.priceHistory))
      .flatMap((l) =>
        (l.priceHistory as { price: number; fetchedAt: number }[]).map((h) => ({
          price: h.price,
          fetchedAt: h.fetchedAt,
          linkId: l._id,
        }))
      )
      .sort((a, b) => a.fetchedAt - b.fetchedAt);
  },
});

// Get most-viewed comparisons for a product
export const getComparisons = query({
  args: { productId: v.id("novaProducts"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const all = await ctx.db.query("novaProductComparisons").collect();
    const relevant = all
      .filter(
        (c) =>
          c.productAId === args.productId || c.productBId === args.productId
      )
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
    const enriched = await Promise.all(
      relevant.map(async (c) => {
        const otherId =
          c.productAId === args.productId ? c.productBId : c.productAId;
        const other = await ctx.db.get(otherId);
        const otherScores = await ctx.db
          .query("novaTrustScores")
          .withIndex("by_current", (q) =>
            q.eq("productId", otherId).eq("isCurrent", true)
          )
          .first();
        const otherInt = await ctx.db
          .query("novaIntegrationScores")
          .withIndex("by_current", (q) =>
            q.eq("productId", otherId).eq("isCurrent", true)
          )
          .first();
        return {
          ...c,
          otherProduct: other
            ? {
                ...other,
                trustScore: otherScores?.totalScore,
                integrationScore: otherInt?.totalScore,
              }
            : null,
        };
      })
    );
    return enriched.filter((e) => e.otherProduct !== null);
  },
});

// Delete a product
export const remove = mutation({
  args: { id: v.id("novaProducts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
