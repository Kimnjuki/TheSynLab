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

// Get product by ID
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

// Delete a product
export const remove = mutation({
  args: { id: v.id("novaProducts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
