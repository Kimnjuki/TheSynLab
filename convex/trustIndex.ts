import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { api } from "./_generated/api";

// Get current Trust Index for a hub
export const getCurrentTrustIndex = query({
  args: { hubSlug: v.string() },
  handler: async (ctx, args) => {
    const snapshots = await ctx.db
      .query("trustIndexSnapshots")
      .withIndex("by_hub_current", (q) =>
        q.eq("hubSlug", args.hubSlug).eq("isCurrent", true)
      )
      .order("desc")
      .take(1);

    return snapshots[0] || null;
  },
});

// Get Trust Index history for a specific product
export const getTrustIndexHistory = query({
  args: {
    hubSlug: v.string(),
    productId: v.id("novaProducts"),
    months: v.float64(),
  },
  handler: async (ctx, args) => {
    const snapshots = await ctx.db
      .query("trustIndexSnapshots")
      .withIndex("by_hub", (q) => q.eq("hubSlug", args.hubSlug))
      .order("desc")
      .take(args.months);

    return snapshots
      .filter((s) =>
        s.rankedEntries.some((e) => e.productId === args.productId)
      )
      .map((s) => {
        const entry = s.rankedEntries.find(
          (e) => e.productId === args.productId
        );
        return {
          month: s.snapshotMonth,
          year: s.snapshotYear,
          rank: entry?.rank || 0,
          trustScore: entry?.trustScore || 0,
          integrationScore: entry?.integrationScore || 0,
          badge: entry?.badge || null,
        };
      });
  },
});

// Publish a new Trust Index snapshot
export const publishTrustIndexSnapshot = mutation({
  args: {
    hubSlug: v.string(),
    rankedEntries: v.array(
      v.object({
        rank: v.float64(),
        productId: v.id("novaProducts"),
        trustScore: v.float64(),
        integrationScore: v.float64(),
        rankDelta: v.float64(),
        badge: v.optional(v.string()),
      })
    ),
    editorialNotes: v.optional(v.string()),
    month: v.float64(),
    year: v.float64(),
  },
  handler: async (ctx, args) => {
    // Mark previous snapshot as not current
    const previous = await ctx.db
      .query("trustIndexSnapshots")
      .withIndex("by_hub_current", (q) =>
        q.eq("hubSlug", args.hubSlug).eq("isCurrent", true)
      )
      .take(1);

    for (const prev of previous) {
      await ctx.db.patch(prev._id, { isCurrent: false });
    }

    // Insert new snapshot
    return await ctx.db.insert("trustIndexSnapshots", {
      hubSlug: args.hubSlug,
      snapshotMonth: args.month,
      snapshotYear: args.year,
      isCurrent: true,
      rankedEntries: args.rankedEntries,
      publishedAt: Date.now(),
      editorialNotes: args.editorialNotes,
    });
  },
});

// Get Trust Index overview across all hubs
export const getAllCurrentSnapshots = query({
  args: {},
  handler: async (ctx) => {
    const snapshots = await ctx.db
      .query("trustIndexSnapshots")
      .withIndex("by_hub_current")
      .collect();

    // Filter to only current per hub
    const hubMap = new Map<string, typeof snapshots[0]>();
    for (const s of snapshots) {
      if (s.isCurrent && !hubMap.has(s.hubSlug)) {
        hubMap.set(s.hubSlug, s);
      }
    }

    return Array.from(hubMap.values());
  },
});
