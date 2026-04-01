import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

function severityRank(severity: string) {
  if (severity === "CRITICAL") return 4;
  if (severity === "HIGH") return 3;
  if (severity === "MEDIUM") return 2;
  return 1;
}

function nextSeverity(severity: string) {
  if (severity === "LOW") return "MEDIUM";
  if (severity === "MEDIUM") return "HIGH";
  if (severity === "HIGH") return "CRITICAL";
  return "CRITICAL";
}

export const moderateForumContent = action({
  args: {
    threadId: v.optional(v.id("forumThreads")),
    replyId: v.optional(v.id("forumReplies")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const rules = await ctx.runQuery(api.adCompliance.getPolicyRules, {});
    const activeRules = (rules || []).filter((r: any) => r.isActive && Array.isArray(r.keywords));
    const normalized = args.content.toLowerCase();

    const matched = activeRules.find((rule: any) =>
      (rule.keywords || []).some((kw: string) => normalized.includes(String(kw).toLowerCase()))
    );

    if (!matched) {
      return { flagged: false };
    }

    await ctx.runMutation(api.forumModeration.createViolation, {
      threadId: args.threadId,
      replyId: args.replyId,
      reportSource: args.replyId ? "forum_reply" : "forum_thread",
      reportedContent: args.content.slice(0, 8000),
      violationLevel: matched.levelId ?? severityRank(matched.severity),
      violationCategory: matched.category ?? "forum_policy",
      violationRule: matched.instruction ?? "Policy keyword match",
      matchedKeywords: matched.keywords,
      severity: matched.severity ?? "MEDIUM",
      description: "Automatically flagged by moderation rules",
      aiConfidence: 0.9,
    });

    if (args.threadId) {
      await ctx.runMutation(api.forumModeration.markThreadPendingReview, { threadId: args.threadId });
    }
    if (args.replyId) {
      await ctx.runMutation(api.forumModeration.markReplyPendingReview, { replyId: args.replyId });
    }

    return { flagged: true, severity: matched.severity ?? "MEDIUM" };
  },
});

export const createViolation = mutation({
  args: {
    threadId: v.optional(v.id("forumThreads")),
    replyId: v.optional(v.id("forumReplies")),
    reportSource: v.string(),
    reportedContent: v.string(),
    violationLevel: v.number(),
    violationCategory: v.string(),
    violationRule: v.string(),
    matchedKeywords: v.optional(v.array(v.string())),
    severity: v.string(),
    description: v.optional(v.string()),
    aiConfidence: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("adComplianceViolations", {
      ...args,
      resolved: false,
    });
  },
});

export const reportThread = mutation({
  args: {
    threadId: v.id("forumThreads"),
    reason: v.string(),
    reporterId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const thread = await ctx.db.get(args.threadId);
    if (!thread) throw new Error("Thread not found");
    const id = await ctx.db.insert("adComplianceViolations", {
      threadId: args.threadId,
      reportSource: "user_report",
      reportedContent: thread.content.slice(0, 8000),
      violationLevel: 2,
      violationCategory: "user_report",
      violationRule: args.reason,
      severity: "MEDIUM",
      description: "User submitted report for forum thread",
      resolved: false,
    });
    await ctx.db.patch(args.threadId, { moderationStatus: "pending_review" });
    return id;
  },
});

export const reportReply = mutation({
  args: {
    replyId: v.id("forumReplies"),
    reason: v.string(),
    reporterId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reply = await ctx.db.get(args.replyId);
    if (!reply) throw new Error("Reply not found");
    const id = await ctx.db.insert("adComplianceViolations", {
      replyId: args.replyId,
      threadId: reply.threadId,
      reportSource: "user_report",
      reportedContent: reply.content.slice(0, 8000),
      violationLevel: 2,
      violationCategory: "user_report",
      violationRule: args.reason,
      severity: "MEDIUM",
      description: "User submitted report for forum reply",
      resolved: false,
    });
    await ctx.db.patch(args.replyId, { moderationStatus: "pending_review" });
    return id;
  },
});

export const markThreadPendingReview = mutation({
  args: { threadId: v.id("forumThreads") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.threadId, { moderationStatus: "pending_review" });
  },
});

export const markReplyPendingReview = mutation({
  args: { replyId: v.id("forumReplies") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.replyId, { moderationStatus: "pending_review" });
  },
});

export const listModerationQueue = query({
  args: {},
  handler: async (ctx) => {
    const violations = await ctx.db
      .query("adComplianceViolations")
      .withIndex("by_resolved", (q) => q.eq("resolved", false))
      .collect();

    const enriched = await Promise.all(
      violations.map(async (vDoc) => {
        const thread = vDoc.threadId ? await ctx.db.get(vDoc.threadId) : null;
        const reply = vDoc.replyId ? await ctx.db.get(vDoc.replyId) : null;
        return { ...vDoc, thread, reply };
      })
    );

    return enriched.sort((a, b) => {
      const s = severityRank(b.severity) - severityRank(a.severity);
      if (s !== 0) return s;
      return b._creationTime - a._creationTime;
    });
  },
});

export const resolveViolation = mutation({
  args: {
    violationId: v.id("adComplianceViolations"),
    resolvedBy: v.optional(v.string()),
    resolutionNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const violation = await ctx.db.get(args.violationId);
    if (!violation) throw new Error("Violation not found");

    await ctx.db.patch(args.violationId, {
      resolved: true,
      resolvedAt: Date.now(),
      resolvedBy: args.resolvedBy,
      resolutionNotes: args.resolutionNotes,
    });

    if (violation.threadId) {
      await ctx.db.patch(violation.threadId, { moderationStatus: "approved" });
    }
    if (violation.replyId) {
      await ctx.db.patch(violation.replyId, { moderationStatus: "approved" });
    }
  },
});

export const dismissViolation = mutation({
  args: {
    violationId: v.id("adComplianceViolations"),
    dismissedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const violation = await ctx.db.get(args.violationId);
    if (!violation) throw new Error("Violation not found");

    await ctx.db.patch(args.violationId, {
      resolved: true,
      resolvedAt: Date.now(),
      resolvedBy: args.dismissedBy,
      resolutionNotes: args.notes ?? "Dismissed by moderator as non-violating.",
    });

    if (violation.threadId) {
      await ctx.db.patch(violation.threadId, { moderationStatus: "approved" });
    }
    if (violation.replyId) {
      await ctx.db.patch(violation.replyId, { moderationStatus: "approved" });
    }
  },
});

export const keepViolationPending = mutation({
  args: {
    violationId: v.id("adComplianceViolations"),
    reviewedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const violation = await ctx.db.get(args.violationId);
    if (!violation) throw new Error("Violation not found");

    await ctx.db.patch(args.violationId, {
      resolved: false,
      resolutionNotes:
        args.notes ??
        `Reviewed and kept pending by ${args.reviewedBy ?? "moderator"} at ${new Date().toISOString()}.`,
    });
  },
});

export const escalateViolation = mutation({
  args: {
    violationId: v.id("adComplianceViolations"),
    escalatedBy: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const violation = await ctx.db.get(args.violationId);
    if (!violation) throw new Error("Violation not found");

    const upgradedSeverity = nextSeverity(violation.severity);
    const upgradedLevel = Math.min((violation.violationLevel ?? 1) + 1, 4);

    await ctx.db.patch(args.violationId, {
      severity: upgradedSeverity,
      violationLevel: upgradedLevel,
      resolved: false,
      resolutionNotes:
        args.notes ??
        `Escalated by ${args.escalatedBy ?? "moderator"} at ${new Date().toISOString()}.`,
    });

    if (violation.threadId) {
      await ctx.db.patch(violation.threadId, { moderationStatus: "pending_review" });
    }
    if (violation.replyId) {
      await ctx.db.patch(violation.replyId, { moderationStatus: "pending_review" });
    }
  },
});
