import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createCmpConsentRecord = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.id("novaUsers")),
    consentVersion: v.string(),
    necessaryCookies: v.boolean(),
    analyticsCookies: v.boolean(),
    advertisingCookies: v.boolean(),
    functionalCookies: v.boolean(),
    consentMethod: v.string(),
    ipCountry: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cmpConsentRecords", {
      ...args,
      consentTimestamp: Date.now(),
    });
  },
});

export const updateCmpConsentRecord = mutation({
  args: {
    sessionId: v.string(),
    updatedFlags: v.object({
      analyticsCookies: v.boolean(),
      advertisingCookies: v.boolean(),
      functionalCookies: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cmpConsentRecords")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .first();
    if (!existing) throw new Error("Consent record not found");
    await ctx.db.patch(existing._id, {
      ...args.updatedFlags,
      updatedAt: Date.now(),
      consentMethod: "granular",
    });
    return existing._id;
  },
});

export const getCmpConsent = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("cmpConsentRecords")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .first();
  },
});
