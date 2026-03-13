import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List comments for an entity
export const listByEntity = query({
  args: {
    entityType: v.string(),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_entity", (q) =>
        q.eq("entityType", args.entityType).eq("entityId", args.entityId)
      )
      .collect();

    // Get profiles for each comment
    const commentsWithProfiles = await Promise.all(
      comments.map(async (comment) => {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_clerk", (q) => q.eq("clerkId", comment.userId))
          .first();

        return {
          ...comment,
          profile,
        };
      })
    );

    // Build thread structure
    const topLevelComments = commentsWithProfiles.filter((c) => !c.parentId);
    const replies = commentsWithProfiles.filter((c) => c.parentId);

    return topLevelComments.map((comment) => ({
      ...comment,
      replies: replies.filter((r) => r.parentId === comment._id),
    }));
  },
});

// Create a comment
export const create = mutation({
  args: {
    content: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    parentId: v.optional(v.id("comments")),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "system_admin";

    return await ctx.db.insert("comments", {
      content: args.content,
      userId,
      entityType: args.entityType,
      entityId: args.entityId,
      parentId: args.parentId,
      isEdited: false,
      reactions: {},
    });
  },
});

// Update a comment
export const update = mutation({
  args: {
    id: v.id("comments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      content: args.content,
      isEdited: true,
    });

    return args.id;
  },
});

// Delete a comment
export const remove = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx, args) => {
    // Delete replies first
    const replies = await ctx.db
      .query("comments")
      .withIndex("by_parent", (q) => q.eq("parentId", args.id))
      .collect();

    for (const reply of replies) {
      await ctx.db.delete(reply._id);
    }

    await ctx.db.delete(args.id);
  },
});

// Add reaction to a comment
export const addReaction = mutation({
  args: {
    id: v.id("comments"),
    emoji: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "system_admin";

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");

    const reactions = (comment.reactions as Record<string, string[]>) || {};
    const emojiReactions = reactions[args.emoji] || [];

    if (!emojiReactions.includes(userId)) {
      reactions[args.emoji] = [...emojiReactions, userId];
      await ctx.db.patch(args.id, { reactions });
    }

    return reactions;
  },
});

// Remove reaction from a comment
export const removeReaction = mutation({
  args: {
    id: v.id("comments"),
    emoji: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "system_admin";

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");

    const reactions = (comment.reactions as Record<string, string[]>) || {};
    const emojiReactions = reactions[args.emoji] || [];

    reactions[args.emoji] = emojiReactions.filter((id) => id !== userId);

    if (reactions[args.emoji].length === 0) {
      delete reactions[args.emoji];
    }

    await ctx.db.patch(args.id, { reactions });
    return reactions;
  },
});
