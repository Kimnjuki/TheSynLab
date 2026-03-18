import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("novaRedirectRules").order("desc").take(100);
  },
});

export const toggle = mutation({
  args: { ruleId: v.id("novaRedirectRules"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.ruleId, { isActive: args.isActive });
  },
});
