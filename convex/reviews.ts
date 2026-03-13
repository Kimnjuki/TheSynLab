import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List reviews for a product
export const listByProduct = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("productReviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    // Get profiles for each review
    const reviewsWithProfiles = await Promise.all(
      reviews.map(async (review) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_clerk", (q) => q.eq("clerkId", review.userId))
          .first();

        return {
          ...review,
          profile,
        };
      })
    );

    return reviewsWithProfiles;
  },
});

// Get user's review for a product
export const getUserReview = query({
  args: { 
    productId: v.id("novaProducts"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "system_admin";
    
    return await ctx.db
      .query("productReviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
  },
});

// Create a review
export const create = mutation({
  args: {
    productId: v.id("novaProducts"),
    userId: v.optional(v.string()),
    rating: v.number(),
    reviewTitle: v.string(),
    reviewContent: v.string(),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "system_admin";

    // Check if user already reviewed this product
    const existingReview = await ctx.db
      .query("productReviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    const { userId: _, ...reviewData } = args;

    return await ctx.db.insert("productReviews", {
      ...reviewData,
      userId,
      verifiedPurchase: false,
      helpfulCount: 0,
    });
  },
});

// Update a review
export const update = mutation({
  args: {
    id: v.id("productReviews"),
    rating: v.optional(v.number()),
    reviewTitle: v.optional(v.string()),
    reviewContent: v.optional(v.string()),
    pros: v.optional(v.array(v.string())),
    cons: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a review
export const remove = mutation({
  args: { id: v.id("productReviews") },
  handler: async (ctx, args) => {
    // Delete helpful votes first
    const votes = await ctx.db
      .query("reviewHelpfulVotes")
      .withIndex("by_review", (q) => q.eq("reviewId", args.id))
      .collect();

    for (const vote of votes) {
      await ctx.db.delete(vote._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Vote helpful on a review
export const voteHelpful = mutation({
  args: { 
    reviewId: v.id("productReviews"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "system_admin";

    // Check if already voted
    const existingVote = await ctx.db
      .query("reviewHelpfulVotes")
      .withIndex("by_review", (q) => q.eq("reviewId", args.reviewId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existingVote) {
      // Remove vote
      await ctx.db.delete(existingVote._id);
      const review = await ctx.db.get(args.reviewId);
      if (review) {
        await ctx.db.patch(args.reviewId, {
          helpfulCount: Math.max(0, review.helpfulCount - 1),
        });
      }
      return { action: "removed" };
    }

    // Add vote
    await ctx.db.insert("reviewHelpfulVotes", {
      reviewId: args.reviewId,
      userId,
    });

    const review = await ctx.db.get(args.reviewId);
    if (review) {
      await ctx.db.patch(args.reviewId, {
        helpfulCount: review.helpfulCount + 1,
      });
    }

    return { action: "added" };
  },
});

// Check if user has voted helpful
export const hasVotedHelpful = query({
  args: { 
    reviewId: v.id("productReviews"),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "system_admin";

    const vote = await ctx.db
      .query("reviewHelpfulVotes")
      .withIndex("by_review", (q) => q.eq("reviewId", args.reviewId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    return !!vote;
  },
});
