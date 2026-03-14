import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * S7: Contributor leaderboard – top contributors by reviews, votes, proposals.
 */
export const getContributorLeaderboard = query({
  args: {
    limit: v.optional(v.number()),
    period: v.optional(v.union(v.literal("week"), v.literal("month"), v.literal("all"))),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const cutoff =
      args.period === "week"
        ? Date.now() - 7 * 24 * 60 * 60 * 1000
        : args.period === "month"
        ? Date.now() - 30 * 24 * 60 * 60 * 1000
        : 0;

    const reviews = await ctx.db.query("productReviews").collect();
    const votes = await ctx.db.query("reviewHelpfulVotes").collect();
    const proposals = await ctx.db.query("scoreWeightProposals").collect();

    const byUser = new Map<
      string,
      { userId: string; reviewCount: number; voteCount: number; proposalCount: number }
    >();

    for (const r of reviews) {
      if (cutoff && r._creationTime < cutoff) continue;
      const prev = byUser.get(r.userId) || { userId: r.userId, reviewCount: 0, voteCount: 0, proposalCount: 0 };
      prev.reviewCount++;
      byUser.set(r.userId, prev);
    }

    for (const v of votes) {
      if (cutoff && v._creationTime < cutoff) continue;
      const prev = byUser.get(v.userId) || { userId: v.userId, reviewCount: 0, voteCount: 0, proposalCount: 0 };
      prev.voteCount++;
      byUser.set(v.userId, prev);
    }

    for (const p of proposals) {
      if (cutoff && p.createdAt < cutoff) continue;
      const prev = byUser.get(p.proposedBy) || { userId: p.proposedBy, reviewCount: 0, voteCount: 0, proposalCount: 0 };
      prev.proposalCount++;
      byUser.set(p.proposedBy, prev);
    }

    const scored = Array.from(byUser.values()).map((u) => ({
      ...u,
      totalScore: u.reviewCount * 3 + u.voteCount + u.proposalCount * 5,
    }));
    scored.sort((a, b) => b.totalScore - a.totalScore);
    const top = scored.slice(0, limit);
    const withProfiles = await Promise.all(
      top.map(async (u, i) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_clerk", (q) => q.eq("clerkId", u.userId))
          .first();
        return {
          clerkId: u.userId,
          displayName: profile?.displayName ?? "Anonymous",
          totalScore: u.totalScore,
          rank: i + 1,
        };
      })
    );
    return withProfiles;
  },
});
