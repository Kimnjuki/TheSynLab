import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logAiEvent = mutation({
  args: {
    eventType: v.string(),
    userId: v.optional(v.string()),
    tableName: v.optional(v.string()),
    recordId: v.optional(v.string()),
    action: v.optional(v.string()),
    status: v.string(),
    severity: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("novaSecurityAuditLog", {
      eventType: args.eventType,
      userId: args.userId,
      tableName: args.tableName,
      recordId: args.recordId,
      action: args.action,
      status: args.status,
      severity: args.severity,
      description: args.description,
    });
  },
});
