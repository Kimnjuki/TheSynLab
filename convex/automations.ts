import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all automations (no auth required for Git Bash)
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("automations").collect();
  },
});

// Get a single automation
export const get = query({
  args: { id: v.id("automations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List templates
export const listTemplates = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let templates = await ctx.db.query("automationTemplates").collect();

    if (args.category) {
      templates = templates.filter((t) => t.category === args.category);
    }

    return templates;
  },
});

// Get featured templates
export const getFeaturedTemplates = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("automationTemplates")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .collect();
  },
});

// Create an automation
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    triggerType: v.string(),
    triggerConfig: v.optional(v.any()),
    actions: v.optional(v.array(v.any())),
    conditions: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("automations", {
      ...args,
      isActive: false,
      createdBy: "system_admin",
      runCount: 0,
    });
  },
});

// Create from template
export const createFromTemplate = mutation({
  args: { templateId: v.id("automationTemplates") },
  handler: async (ctx, args) => {
    const template = await ctx.db.get(args.templateId);
    if (!template) throw new Error("Template not found");

    // Increment template use count
    await ctx.db.patch(args.templateId, {
      useCount: template.useCount + 1,
    });

    return await ctx.db.insert("automations", {
      name: template.name,
      description: template.description,
      triggerType: template.triggerType,
      triggerConfig: template.triggerConfig,
      actions: template.actions,
      conditions: template.conditions,
      isActive: false,
      createdBy: "system_admin",
      runCount: 0,
    });
  },
});

// Update an automation
export const update = mutation({
  args: {
    id: v.id("automations"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    triggerType: v.optional(v.string()),
    triggerConfig: v.optional(v.any()),
    actions: v.optional(v.array(v.any())),
    conditions: v.optional(v.array(v.any())),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Toggle automation active status
export const toggleActive = mutation({
  args: { id: v.id("automations") },
  handler: async (ctx, args) => {
    const automation = await ctx.db.get(args.id);
    if (!automation) throw new Error("Automation not found");

    await ctx.db.patch(args.id, { isActive: !automation.isActive });
    return !automation.isActive;
  },
});

// Delete an automation
export const remove = mutation({
  args: { id: v.id("automations") },
  handler: async (ctx, args) => {
    // Delete runs first
    const runs = await ctx.db
      .query("automationRuns")
      .withIndex("by_automation", (q) => q.eq("automationId", args.id))
      .collect();

    for (const run of runs) {
      await ctx.db.delete(run._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Get automation runs
export const getRuns = query({
  args: { automationId: v.id("automations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("automationRuns")
      .withIndex("by_automation", (q) => q.eq("automationId", args.automationId))
      .order("desc")
      .take(50);
  },
});
