import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const logToolSession = mutation({
  args: {
    toolType: v.string(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
    inputData: v.optional(v.any()),
    resultData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("toolUsageSessions", {
      ...args,
      emailCaptured: false,
      convertedToSignup: false,
      usedAt: Date.now(),
    });
  },
});

export const captureEmailFromTool = mutation({
  args: { email: v.string(), toolType: v.string(), resultData: v.optional(v.any()) },
  handler: async (ctx, args) => {
    await ctx.db.insert("novaNewsletterSubscribers", {
      email: args.email,
      source: "tool_capture",
      status: "active",
      subscribedAt: Date.now(),
      tags: [args.toolType],
    });
    return true;
  },
});

export const generateEmbedCode = mutation({
  args: { widgetType: v.string(), productId: v.optional(v.id("novaProducts")) },
  handler: async (ctx, args) => {
    const embedCode = `<iframe src="https://thesynlab.com/tools/embed/${args.widgetType}" width="360" height="260" loading="lazy"></iframe>`;
    const id = await ctx.db.insert("embeddableWidgets", {
      widgetType: args.widgetType,
      embedCode,
      isActive: true,
      impressionCount: 0,
      clickCount: 0,
      createdAt: Date.now(),
    });
    return { id, embedCode };
  },
});

export const getToolStats = query({
  args: { toolType: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const sessions = await ctx.db.query("toolUsageSessions").collect();
    const filtered = args.toolType ? sessions.filter((s) => s.toolType === args.toolType) : sessions;
    return {
      sessions: filtered.length,
      emailsCaptured: filtered.filter((s) => s.emailCaptured).length,
      conversions: filtered.filter((s) => s.convertedToSignup).length,
    };
  },
});

export const getEmbedWidget = query({
  args: { widgetType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("embeddableWidgets")
      .withIndex("by_type", (q) => q.eq("widgetType", args.widgetType))
      .first();
  },
});
