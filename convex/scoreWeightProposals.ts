import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listOpen = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("scoreWeightProposals")
      .withIndex("by_status", (q) => q.eq("status", "open"))
      .order("desc")
      .take(20);
  },
});

export const vote = mutation({
  args: {
    proposalId: v.id("scoreWeightProposals"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) throw new Error("Proposal not found");
    const votes = (proposal.votes ?? []) as { userId: string; timestamp: number }[];
    if (votes.some((v) => v.userId === args.userId)) {
      throw new Error("Already voted");
    }
    await ctx.db.patch(args.proposalId, {
      votes: [...votes, { userId: args.userId, timestamp: Date.now() }],
      voteCount: proposal.voteCount + 1,
    });
  },
});
