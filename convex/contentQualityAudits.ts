import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

function scoreToFlags(input: {
  hasNamedAuthor: boolean;
  hasPublishDate: boolean;
  hasAffiliateDisclosure: boolean;
  hasAdDisclosure: boolean;
  hasSchemaMarkup: boolean;
  internalLinkCount: number;
  wordCount: number;
}) {
  const flags: Array<{ type: string; severity: string; description: string }> = [];
  if (!input.hasNamedAuthor) flags.push({ type: "author", severity: "high", description: "Missing named author" });
  if (!input.hasPublishDate) flags.push({ type: "publishedAt", severity: "high", description: "Missing publish date" });
  if (input.wordCount < 800) flags.push({ type: "wordCount", severity: "medium", description: "Word count below 800" });
  if (!input.hasAffiliateDisclosure)
    flags.push({ type: "affiliate", severity: "high", description: "Missing affiliate disclosure" });
  if (!input.hasAdDisclosure) flags.push({ type: "ads", severity: "medium", description: "Missing ad disclosure" });
  if (!input.hasSchemaMarkup) flags.push({ type: "schema", severity: "medium", description: "Missing schema markup" });
  if (input.internalLinkCount < 2)
    flags.push({ type: "internalLinks", severity: "medium", description: "Fewer than 2 internal links" });
  return flags;
}

export const getPostAuditInputs = query({
  args: { postId: v.id("novaPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;
    const author = await ctx.db
      .query("authorProfiles")
      .withIndex("by_user", (q) => q.eq("userId", post.authorId))
      .first();
    const postMeta = await ctx.db.query("novaPostMeta").withIndex("by_post", (q) => q.eq("postId", args.postId)).collect();
    const links = await ctx.db
      .query("internalLinks")
      .withIndex("by_source", (q) => q.eq("sourcePostId", args.postId))
      .collect();
    return { post, author, postMeta, links };
  },
});

export const upsertAudit = mutation({
  args: {
    postId: v.id("novaPosts"),
    adSenseReadinessScore: v.float64(),
    hasNamedAuthor: v.boolean(),
    hasPublishDate: v.boolean(),
    hasAffiliateDisclosure: v.boolean(),
    hasAdDisclosure: v.boolean(),
    wordCount: v.float64(),
    structureScore: v.float64(),
    passesAdPolicyCheck: v.boolean(),
    flags: v.array(v.any()),
    recommendations: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("contentQualityAudits", {
      ...args,
      auditedAt: Date.now(),
    });
  },
});

export const auditPostForAdReadiness = action({
  args: { postId: v.id("novaPosts") },
  handler: async (ctx, args) => {
    const inputs = await ctx.runQuery(api.contentQualityAudits.getPostAuditInputs, { postId: args.postId });
    if (!inputs) throw new Error("Post not found");

    const metaMap = new Map(inputs.postMeta.map((m) => [m.metaKey, m.metaValue ?? ""]));
    const hasAffiliateDisclosure = inputs.post.hasAffiliateDisclosure ?? Boolean(metaMap.get("affiliate_disclosure"));
    const hasAdDisclosure = Boolean(metaMap.get("ad_disclosure"));
    const hasNamedAuthor = Boolean(inputs.author);
    const hasPublishDate = Boolean(inputs.post.publishedAt);
    const hasSchemaMarkup = Boolean(inputs.post.schemaMarkup);
    const internalLinkCount = inputs.links.length;
    const wordCount = inputs.post.wordCount ?? 0;

    const checks = [hasNamedAuthor, hasPublishDate, wordCount >= 800, hasAffiliateDisclosure, hasAdDisclosure, hasSchemaMarkup, internalLinkCount >= 2];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    const flags = scoreToFlags({
      hasNamedAuthor,
      hasPublishDate,
      hasAffiliateDisclosure,
      hasAdDisclosure,
      hasSchemaMarkup,
      internalLinkCount,
      wordCount,
    });
    const recommendations = flags.map((f) => f.description);

    await ctx.runMutation(api.contentQualityAudits.upsertAudit, {
      postId: args.postId,
      adSenseReadinessScore: score,
      hasNamedAuthor,
      hasPublishDate,
      hasAffiliateDisclosure,
      hasAdDisclosure,
      wordCount,
      structureScore: hasSchemaMarkup && internalLinkCount >= 2 ? 85 : 55,
      passesAdPolicyCheck: score >= 60,
      flags,
      recommendations,
    });

    if (score < 60) {
      await ctx.runMutation(api.tasks.create, {
        title: `Improve ad readiness for post ${inputs.post.postTitle}`,
        description: `Auto-generated from content quality audit. Score: ${score}`,
        priority: "high",
        status: "todo",
      });
    }

    return { score, flags };
  },
});

export const listRecentAudits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contentQualityAudits").order("desc").take(100);
  },
});
