import { internalAction, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const getLivingGuide = query({
  args: { postId: v.id("novaPosts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("livingGuides")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .first();
  },
});

export const getLivingGuidesNeedingReview = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const all = await ctx.db.query("livingGuides").collect();
    return all.filter((g) => g.nextReviewDue <= now);
  },
});

export const recordGuideUpdate = mutation({
  args: {
    postId: v.id("novaPosts"),
    changeEntry: v.any(),
  },
  handler: async (ctx, args) => {
    const guide = await ctx.db
      .query("livingGuides")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .first();
    if (!guide) return null;
    const changeLog = [...(guide.changeLog ?? []), args.changeEntry];
    await ctx.db.patch(guide._id, {
      changeLog,
      lastReviewedAt: Date.now(),
    });
    return guide._id;
  },
});

export const scheduleNextReview = mutation({
  args: {
    postId: v.id("novaPosts"),
    nextReviewDue: v.float64(),
  },
  handler: async (ctx, args) => {
    const guide = await ctx.db
      .query("livingGuides")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .first();
    if (!guide) return null;
    await ctx.db.patch(guide._id, { nextReviewDue: args.nextReviewDue });
    return guide._id;
  },
});

export const checkReviewDates = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const guides = await ctx.runQuery(api.livingGuides.getLivingGuidesNeedingReview);

    const overdue = (guides ?? []).filter((g) => g.nextReviewDue <= now);
    if (overdue.length > 0) {
      console.log(
        `Living guide alerts: ${overdue.length} guides need review. Trigger Slack/Email integration here.`
      );
    }

    return {
      checkedAt: now,
      overdueCount: overdue.length,
      overdueIds: overdue.map((g) => g._id),
    };
  },
});
