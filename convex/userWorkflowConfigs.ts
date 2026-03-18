import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("userWorkflowConfigs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const save = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    workflowNodes: v.array(v.any()),
    workflowConnections: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userWorkflowConfigs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        workflowNodes: args.workflowNodes,
        workflowConnections: args.workflowConnections,
        description: args.description,
      });
      return existing._id;
    }

    return ctx.db.insert("userWorkflowConfigs", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      workflowNodes: args.workflowNodes,
      workflowConnections: args.workflowConnections,
      isActive: true,
      runCount: 0,
    });
  },
});
