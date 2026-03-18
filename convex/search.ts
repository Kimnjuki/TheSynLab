import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const log = mutation({
  args: {
    query: v.string(),
    resultsCount: v.number(),
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("novaSearchQueries", {
      query: args.query,
      userId: args.userId,
      resultsCount: args.resultsCount,
      searchedAt: Date.now(),
      sessionId: args.sessionId,
    });
  },
});
