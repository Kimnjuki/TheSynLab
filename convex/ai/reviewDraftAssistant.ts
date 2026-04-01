import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

export const generateReviewDraft = action({
  args: { productId: v.id("novaProducts"), assignedEditorId: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");
    const ai = await callAnthropicJson<any>(
      `Generate first draft review sections for ${product.productName}. Return JSON {sections,starRating,editorNotes}.`,
      1000
    );
    const draftSections = ai?.sections ?? {};
    const postId = await ctx.db.insert("novaPosts", {
      authorId: args.assignedEditorId,
      postTitle: `${product.productName} Review Draft`,
      postSlug: `${product.productSlug}-draft-${Date.now()}`,
      postContent: JSON.stringify(draftSections),
      postType: "review",
      postStatus: "draft",
      viewCount: 0,
      uniqueViewCount: 0,
    } as any);
    const payload = {
      productId: args.productId,
      postId,
      draftSections,
      benchmarkDataUsed: null,
      editorAssigned: args.assignedEditorId,
      editStatus: "draft",
      aiConfidence: 0.7,
      generatedAt: Date.now(),
      lastEditedAt: undefined,
    };
    const id = await ctx.db.insert("aiReviewDrafts", payload);
    return { id, postId, editorNotes: ai?.editorNotes ?? [] };
  },
});
