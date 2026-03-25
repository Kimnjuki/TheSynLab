import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getHubBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contentHubs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const listHubPillarPosts = query({
  args: { hubSlug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("novaPosts")
      .withIndex("by_hub", (q) => q.eq("hub", args.hubSlug))
      .filter((q) => q.eq(q.field("postType"), "guide"))
      .take(20);
  },
});

export const listHubSpokeArticles = query({
  args: { hubSlug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("novaPosts")
      .withIndex("by_hub", (q) => q.eq("hub", args.hubSlug))
      .filter((q) => q.neq(q.field("postType"), "guide"))
      .take(40);
  },
});

export const getHubKeywords = query({
  args: { hubSlug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("hubKeywords")
      .withIndex("by_hub", (q) => q.eq("hubSlug", args.hubSlug))
      .collect();
  },
});

export const updateHubStats = mutation({
  args: { hubSlug: v.string() },
  handler: async (ctx, args) => {
    const hub = await ctx.db
      .query("contentHubs")
      .withIndex("by_slug", (q) => q.eq("slug", args.hubSlug))
      .first();
    if (!hub) return null;

    const posts = await ctx.db
      .query("novaPosts")
      .withIndex("by_hub", (q) => q.eq("hub", args.hubSlug))
      .collect();
    const products = await ctx.db
      .query("novaProducts")
      .withIndex("by_hub", (q) => q.eq("hub", args.hubSlug))
      .collect();

    const trustScores = await Promise.all(
      products.map((p) =>
        ctx.db
          .query("novaTrustScores")
          .withIndex("by_current", (q) => q.eq("productId", p._id).eq("isCurrent", true))
          .first()
      )
    );
    const integrationScores = await Promise.all(
      products.map((p) =>
        ctx.db
          .query("novaIntegrationScores")
          .withIndex("by_current", (q) => q.eq("productId", p._id).eq("isCurrent", true))
          .first()
      )
    );

    const avg = (values: number[]) =>
      values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;

    await ctx.db.patch(hub._id, {
      pillarCount: posts.filter((p) => p.postType === "guide").length,
      spokeCount: posts.filter((p) => p.postType !== "guide").length,
      totalWordCount: posts.reduce((sum, p) => sum + (p.wordCount ?? 0), 0),
      avgTrustScore: avg(trustScores.map((s) => s?.totalScore ?? 0)),
      avgIntegrationScore: avg(integrationScores.map((s) => s?.totalScore ?? 0)),
      topProductIds: products.slice(0, 5).map((p) => p._id),
      lastUpdatedAt: Date.now(),
    });
    return hub._id;
  },
});
