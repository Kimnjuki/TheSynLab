/**
 * S3: Syn token ledger – award tokens for verified reviews, etc.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.string(),
    eventType: v.string(),
    amount: v.number(),
    referenceId: v.optional(v.string()),
    referenceType: v.optional(v.string()),
    txHash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("synTokenLedger", {
      userId: args.userId,
      eventType: args.eventType,
      amount: args.amount,
      referenceId: args.referenceId,
      referenceType: args.referenceType,
      txHash: args.txHash,
      createdAt: Date.now(),
    });
  },
});
