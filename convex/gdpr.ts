import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByUser = query({
  args: { userId: v.id("novaUsers") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("novaGdprRequests")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const submit = mutation({
  args: {
    userId: v.id("novaUsers"),
    requestType: v.string(),
    requestDetails: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("novaGdprRequests", {
      userId: args.userId,
      requestType: args.requestType,
      requestDetails: args.requestDetails,
      status: "pending",
      requestedAt: Date.now(),
      verified: false,
    });
  },
});
