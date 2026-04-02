import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByTemplate = query({
  args: { pageTemplate: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adSlotConfigs")
      .withIndex("by_template", (q) => q.eq("pageTemplate", args.pageTemplate))
      .collect();
  },
});

export const upsertSlot = mutation({
  args: {
    slotName: v.string(),
    pageTemplate: v.string(),
    iabFormat: v.string(),
    position: v.string(),
    isActive: v.boolean(),
    isAffiliateSlot: v.boolean(),
    adNetworkTag: v.optional(v.string()),
    minContentLength: v.optional(v.float64()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("adSlotConfigs")
      .withIndex("by_template", (q) => q.eq("pageTemplate", args.pageTemplate))
      .filter((q) => q.eq(q.field("slotName"), args.slotName))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("adSlotConfigs", args);
  },
});

export const logAdSlotImpression = mutation({
  args: {
    slotName: v.string(),
    pageTemplate: v.string(),
    userId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("adComplianceAuditLog", {
      action: "ad_slot_impression",
      actorId: args.userId,
      actorType: "system",
      details: {
        slotName: args.slotName,
        pageTemplate: args.pageTemplate,
        metadata: args.metadata,
      },
    });
  },
});
