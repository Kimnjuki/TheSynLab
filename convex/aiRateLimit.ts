import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getRateLimitForIdentifier = query({
  args: { identifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("novaRateLimits")
      .withIndex("by_identifier", (q) => q.eq("identifier", args.identifier))
      .first();
  },
});

export const upsertRateLimit = mutation({
  args: {
    identifier: v.string(),
    identifierType: v.string(),
    endpoint: v.optional(v.string()),
    requestCount: v.number(),
    firstRequestAt: v.number(),
    lastRequestAt: v.number(),
    blockedUntil: v.optional(v.number()),
    isBlocked: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("novaRateLimits")
      .withIndex("by_identifier", (q) => q.eq("identifier", args.identifier))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        identifierType: args.identifierType,
        endpoint: args.endpoint,
        requestCount: args.requestCount,
        firstRequestAt: args.firstRequestAt,
        lastRequestAt: args.lastRequestAt,
        blockedUntil: args.blockedUntil,
        isBlocked: args.isBlocked,
      });
      return existing._id;
    }
    return await ctx.db.insert("novaRateLimits", args);
  },
});
