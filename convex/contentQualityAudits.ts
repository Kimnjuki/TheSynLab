import { v } from "convex/values";
import { query } from "./_generated/server";

export const listRecentAudits = query({
  args: {},
  handler: async (ctx) => {
    const audits = await ctx.db
      .query("contentQualityAudits")
      .withIndex("by_date")
      .order("desc")
      .take(50);
    return audits;
  },
});

export const getAuditsByPost = query({
  args: { postId: v.id("novaPosts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("contentQualityAudits")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .take(10);
  },
});

export const getFailedAudits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("contentQualityAudits")
      .withIndex("by_pass", (q) => q.eq("passesAdPolicyCheck", false))
      .order("desc")
      .take(50);
  },
});
