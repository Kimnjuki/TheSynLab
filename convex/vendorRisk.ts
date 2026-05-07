import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Get current vendor risk profile for a product
export const getVendorRiskProfile = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, { productId }) => {
    return await ctx.db
      .query("vendorRiskAssessments")
      .withIndex("by_current", (q) =>
        q.eq("productId", productId).eq("isCurrent", true)
      )
      .first();
  },
});

// Get lock-in meter data for a product (dimension breakdown)
export const getLockInMeterData = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, { productId }) => {
    const assessment = await ctx.db
      .query("vendorRiskAssessments")
      .withIndex("by_current", (q) =>
        q.eq("productId", productId).eq("isCurrent", true)
      )
      .first();

    if (!assessment) return null;

    return {
      overallRiskScore: assessment.overallRiskScore,
      riskLabel: assessment.riskLabel,
      dimensions: {
        dataPortability: assessment.dataPortabilityScore,
        proprietaryFormats: assessment.proprietaryFormatsScore,
        contractLockIn: assessment.contractLockInScore,
        integrationDependency: assessment.integrationDependencyScore,
        apiStability: assessment.apiStabilityScore,
      },
      dataExportFormats: assessment.dataExportFormats,
      contractTerms: assessment.contractTerms,
      apiBreakingChanges12m: assessment.apiBreakingChanges12m,
    };
  },
});

// Get all high-risk products (for leaderboard / admin view)
export const getHighRiskProducts = query({
  args: {
    riskLabel: v.optional(
      v.union(
        v.literal("Low"),
        v.literal("Medium"),
        v.literal("High"),
        v.literal("Critical")
      )
    ),
  },
  handler: async (ctx, { riskLabel }) => {
    if (riskLabel) {
      return await ctx.db
        .query("vendorRiskAssessments")
        .withIndex("by_risk", (q) => q.eq("riskLabel", riskLabel))
        .filter((q) => q.eq(q.field("isCurrent"), true))
        .collect();
    }
    return await ctx.db
      .query("vendorRiskAssessments")
      .filter((q) => q.eq(q.field("isCurrent"), true))
      .collect();
  },
});

// Save a vendor risk session
export const saveVendorRiskSession = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    productId: v.id("novaProducts"),
    userAnswers: v.any(),
    riskProfileSnapshot: v.optional(v.any()),
    alternativesShown: v.optional(v.array(v.id("novaProducts"))),
    emailCaptured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vendorRiskSessions", {
      ...args,
      checkedAt: Date.now(),
    });
  },
});

// Capture email from vendor risk check
export const captureRiskEmail = mutation({
  args: {
    sessionId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { sessionId, email }) => {
    const session = await ctx.db
      .query("vendorRiskSessions")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (session) {
      await ctx.db.patch(session._id, { emailCaptured: true });
    }

    const existing = await ctx.db
      .query("novaNewsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existing) {
      await ctx.db.insert("novaNewsletterSubscribers", {
        email,
        subscribedAt: Date.now(),
        source: "vendor_risk_checker",
        isVerified: false,
        isActive: true,
      });
    }

    return { success: true };
  },
});

// Run a full vendor risk check combining stored data with user's contextual answers
export const runVendorRiskCheck = action({
  args: {
    productId: v.id("novaProducts"),
    userAnswers: v.any(),
    sessionId: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { productId, userAnswers, sessionId, userId }) => {
    // Fetch stored risk assessment
    const assessment = await ctx.runQuery(api.vendorRisk.getVendorRiskProfile, {
      productId,
    });

    const answers = userAnswers as {
      isCentral?: boolean;
      exportRegularly?: boolean;
      onAnnualContract?: boolean;
      deeplyIntegrated?: boolean;
    };

    // Adjust risk score based on user's context
    let adjustedScore = assessment?.overallRiskScore ?? 5;

    if (answers.isCentral) adjustedScore = Math.min(10, adjustedScore + 1.5);
    if (!answers.exportRegularly)
      adjustedScore = Math.min(10, adjustedScore + 0.5);
    if (answers.onAnnualContract)
      adjustedScore = Math.min(10, adjustedScore + 1);
    if (answers.deeplyIntegrated)
      adjustedScore = Math.min(10, adjustedScore + 1.5);

    const getRiskLabel = (
      score: number
    ): "Low" | "Medium" | "High" | "Critical" => {
      if (score < 3) return "Low";
      if (score < 5.5) return "Medium";
      if (score < 7.5) return "High";
      return "Critical";
    };

    const adjustedRiskLabel = getRiskLabel(adjustedScore);

    // Fetch suggested alternatives
    const alternatives = assessment?.suggestedAlternativeIds
      ? await Promise.all(
          assessment.suggestedAlternativeIds.slice(0, 3).map(async (altId: string) => {
            const alt = await ctx.runQuery(api.vendorRisk.getVendorRiskProfile, {
              productId: altId,
            });
            return { productId: altId, riskProfile: alt };
          })
        )
      : [];

    // Mitigation tips based on score
    const mitigationTips: string[] = [];
    if (adjustedScore > 5) {
      mitigationTips.push("Export your data to a neutral format monthly");
      mitigationTips.push(
        "Document all custom integrations and API dependencies"
      );
      mitigationTips.push(
        "Negotiate shorter contract terms (monthly vs annual)"
      );
    }
    if (adjustedScore > 7) {
      mitigationTips.push(
        "Begin evaluating lower-risk alternatives immediately"
      );
      mitigationTips.push(
        "Implement data portability workflows before you need them"
      );
    }

    // Save session
    await ctx.runMutation(api.vendorRisk.saveVendorRiskSession, {
      sessionId,
      userId,
      productId,
      userAnswers,
      riskProfileSnapshot: { ...assessment, adjustedScore, adjustedRiskLabel },
      alternativesShown: assessment?.suggestedAlternativeIds?.slice(0, 3),
      emailCaptured: false,
    });

    return {
      riskProfile: {
        ...assessment,
        adjustedScore,
        adjustedRiskLabel,
      },
      alternatives,
      mitigationTips,
    };
  },
});

// Upsert a vendor risk assessment (admin)
export const upsertVendorRiskAssessment = mutation({
  args: {
    productId: v.id("novaProducts"),
    dataPortabilityScore: v.float64(),
    proprietaryFormatsScore: v.float64(),
    contractLockInScore: v.float64(),
    integrationDependencyScore: v.float64(),
    apiStabilityScore: v.float64(),
    vendorFinancialHealthScore: v.optional(v.float64()),
    overallRiskScore: v.float64(),
    riskLabel: v.union(
      v.literal("Low"),
      v.literal("Medium"),
      v.literal("High"),
      v.literal("Critical")
    ),
    dataExportFormats: v.array(v.string()),
    contractTerms: v.optional(v.string()),
    apiBreakingChanges12m: v.optional(v.float64()),
    suggestedAlternativeIds: v.optional(v.array(v.id("novaProducts"))),
    assessedBy: v.string(),
    evidenceUrls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Mark existing as not current
    const existing = await ctx.db
      .query("vendorRiskAssessments")
      .withIndex("by_current", (q) =>
        q.eq("productId", args.productId).eq("isCurrent", true)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { isCurrent: false });
    }

    return await ctx.db.insert("vendorRiskAssessments", {
      ...args,
      isCurrent: true,
      assessedAt: Date.now(),
    });
  },
});
