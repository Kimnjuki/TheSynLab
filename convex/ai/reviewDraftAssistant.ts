// @ts-nocheck
import { action, internalMutation, internalQuery } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

const getProduct = internalQuery({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});

const insertDraftPost = internalMutation({
  args: {
    authorId: v.string(),
    postTitle: v.string(),
    postSlug: v.string(),
    postContent: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("novaPosts", {
      ...args,
      postType: "review",
      postStatus: "draft",
      viewCount: 0,
      uniqueViewCount: 0,
    });
  },
});

const insertReviewDraft = internalMutation({
  args: {
    productId: v.id("novaProducts"),
    postId: v.id("novaPosts"),
    draftSections: v.any(),
    editorAssigned: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiReviewDrafts", {
      ...args,
      benchmarkDataUsed: null,
      editStatus: "draft",
      aiConfidence: 0.7,
      generatedAt: Date.now(),
      lastEditedAt: undefined,
    });
  },
});

export const generateReviewDraft = action({
  args: { productId: v.id("novaProducts"), assignedEditorId: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.runQuery(internal.ai.reviewDraftAssistant.getProduct, {
      productId: args.productId,
    });
    if (!product) throw new Error("Product not found");
    const ai = await callAnthropicJson<any>(
      `Generate first draft review sections for ${product.productName}. Return JSON {sections,starRating,editorNotes}.`,
      1000
    );
    const draftSections = ai?.sections ?? {};
    const postId = await ctx.runMutation(internal.ai.reviewDraftAssistant.insertDraftPost, {
      authorId: args.assignedEditorId,
      postTitle: `${product.productName} Review Draft`,
      postSlug: `${product.productSlug}-draft-${Date.now()}`,
      postContent: JSON.stringify(draftSections),
    });
    const id = await ctx.runMutation(internal.ai.reviewDraftAssistant.insertReviewDraft, {
      productId: args.productId,
      postId,
      draftSections,
      editorAssigned: args.assignedEditorId,
    });
    return { id, postId, editorNotes: ai?.editorNotes ?? [] };
  },
});