import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveConfig = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    devices: v.array(v.any()),
    scenes: v.optional(v.array(v.any())),
    ecosystem: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("userSmartHomeConfigs", {
      userId: args.userId,
      name: args.name,
      devices: args.devices,
      scenes: args.scenes ?? [],
      ecosystem: args.ecosystem,
    });
  },
});

export const listConfigs = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userSmartHomeConfigs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);
  },
});
