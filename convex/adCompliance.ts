import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List ad submissions
export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let submissions = await ctx.db.query("adSubmissions").collect();

    if (args.status) {
      submissions = submissions.filter((s) => s.status === args.status);
    }

    return submissions;
  },
});

// Get a single submission
export const get = query({
  args: { id: v.id("adSubmissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.id);
    if (!submission) return null;

    // Get violations
    const violations = await ctx.db
      .query("adComplianceViolations")
      .withIndex("by_ad", (q) => q.eq("adId", args.id))
      .collect();

    return { ...submission, violations };
  },
});

// Create ad submission
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    destinationUrl: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    targetAudience: v.optional(v.any()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...data } = args;
    
    return await ctx.db.insert("adSubmissions", {
      ...data,
      userId: userId || "system_admin",
      status: "pending",
    });
  },
});

// Update submission status
export const updateStatus = mutation({
  args: {
    id: v.id("adSubmissions"),
    status: v.string(),
    complianceScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.id);
    if (!submission) throw new Error("Submission not found");

    // Log the action
    await ctx.db.insert("adComplianceAuditLog", {
      adId: args.id,
      action: "status_change",
      actorId: "system_admin",
      actorType: "admin",
      previousStatus: submission.status,
      newStatus: args.status,
    });

    await ctx.db.patch(args.id, {
      status: args.status,
      complianceScore: args.complianceScore,
      reviewedAt: Date.now(),
      reviewedBy: "system_admin",
    });

    return args.id;
  },
});

// Get policy rules
export const getPolicyRules = query({
  args: { levelId: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let rules = await ctx.db
      .query("adPolicyRules")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    if (args.levelId !== undefined) {
      rules = rules.filter((r) => r.levelId === args.levelId);
    }

    return rules;
  },
});

// Add violation
export const addViolation = mutation({
  args: {
    adId: v.id("adSubmissions"),
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

// Resolve violation
export const resolveViolation = mutation({
  args: {
    id: v.id("adComplianceViolations"),
    resolutionNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      resolved: true,
      resolvedAt: Date.now(),
      resolvedBy: "system_admin",
      resolutionNotes: args.resolutionNotes,
    });

    return args.id;
  },
});

// Get compliance statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const submissions = await ctx.db.query("adSubmissions").collect();
    const violations = await ctx.db.query("adComplianceViolations").collect();

    const statusCounts = submissions.reduce(
      (acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const severityCounts = violations.reduce(
      (acc, v) => {
        acc[v.severity] = (acc[v.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalSubmissions: submissions.length,
      statusCounts,
      totalViolations: violations.length,
      unresolvedViolations: violations.filter((v) => !v.resolved).length,
      severityCounts,
      approvalRate:
        submissions.length > 0
          ? ((statusCounts["approved"] || 0) / submissions.length) * 100
          : 0,
    };
  },
});
