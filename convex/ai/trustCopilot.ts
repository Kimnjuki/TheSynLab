// AI Trust & Risk Copilot
// AF-03: Interactive legalese translator that scores privacy policies, ToS, and DPAs

import { action, query } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { callAnthropicJson } from "./_utils/anthropic";
import { checkAiRateLimit } from "./_utils/aiRateLimiter";

interface DarkPattern {
  type: string;
  quote: string;
  severity: "critical" | "high" | "medium" | "low";
  mitigation: string;
}

interface ComplianceFrameworkStatus {
  status: "pass" | "fail" | "partial";
  score: number;
  evidence: string;
  gaps: string[];
}

interface TrustAnalysisResult {
  privacyRiskScore: number;
  tosAmbiguityScore: number;
  dataResidencyFlags: string[];
  securityPostureScore: number;
  complianceFrameworks: {
    GDPR: ComplianceFrameworkStatus;
    SOC2: ComplianceFrameworkStatus;
    HIPAA?: ComplianceFrameworkStatus;
    PCI_DSS?: ComplianceFrameworkStatus;
  };
  darkPatterns: DarkPattern[];
  categoryPercentile: number;
  aiTrainingClauses: boolean;
  dataRetentionDays: number;
  thirdPartyDataSharing: boolean;
  riskSummary: string;
  detailedFindings: Record<string, any>;
  recommendations: string[];
}

// Analyze a product's trust & risk profile
export const analyzeProductTrust = action({
  args: {
    productId: v.id("novaProducts"),
    documentUrl: v.optional(v.string()),
    documentContent: v.optional(v.string()),
    forceRefresh: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const limiter = await checkAiRateLimit(ctx, `trust_copilot:${args.productId}`);
    if (!limiter.allowed) {
      throw new Error(limiter.reason ?? "Rate limit exceeded");
    }

    // Check for existing analysis if not forcing refresh
    if (!args.forceRefresh) {
      const existing = await ctx.runQuery(api.ai.trustCopilot.getCurrentAnalysis, {
        productId: args.productId,
      });
      if (existing) {
        return existing;
      }
    }

    const product = await ctx.runQuery(api.products.getById, { id: args.productId });
    if (!product) {
      throw new Error("Product not found");
    }

    // Get existing trust scores for context
    const trustScore = await ctx.runQuery(api.novaTrustScores.getCurrent, { productId: args.productId });

    // Build the analysis prompt
    const prompt = `You are TheSynLab's AI Trust & Risk Copilot. Analyze the privacy policy, Terms of Service, and data practices for this product:

Product Name: ${product.productName}
Category: ${product.category ?? "Unknown"}
Official Website: ${product.officialWebsite ?? "N/A"}
Current Trust Score: ${trustScore?.totalScore ?? "Not yet scored"}

${args.documentContent ? `Document Content to Analyze:\n${args.documentContent}` : `Please analyze based on the product's publicly available privacy policy and ToS from ${product.officialWebsite}`}

Provide a comprehensive trust and risk analysis with the following JSON structure:
{
  "privacyRiskScore": 0.0-1.0 (lower is better),
  "tosAmbiguityScore": 0.0-1.0 (lower is better),
  "dataResidencyFlags": ["flag1", "flag2"],
  "securityPostureScore": 0.0-1.0 (higher is better),
  "complianceFrameworks": {
    "GDPR": { "status": "pass|fail|partial", "score": 0.0-1.0, "evidence": "string", "gaps": ["string"] },
    "SOC2": { "status": "pass|fail|partial", "score": 0.0-1.0, "evidence": "string", "gaps": ["string"] },
    "HIPAA": { "status": "pass|fail|partial", "score": 0.0-1.0, "evidence": "string", "gaps": ["string"] },
    "PCI_DSS": { "status": "pass|fail|partial", "score": 0.0-1.0, "evidence": "string", "gaps": ["string"] }
  },
  "darkPatterns": [
    { "type": "string", "quote": "exact quote from document", "severity": "critical|high|medium|low", "mitigation": "string" }
  ],
  "categoryPercentile": 0-100 (where this product ranks in category for privacy),
  "aiTrainingClauses": boolean (whether they use your data to train AI),
  "dataRetentionDays": number,
  "thirdPartyDataSharing": boolean,
  "riskSummary": "2-3 sentence summary",
  "detailedFindings": { "dataPrivacyPractices": {...}, "encryptionStandards": {...}, "termsTransparency": {...}, "ethicalAiTransparency": {...}, "thirdPartyAudits": {...} },
  "recommendations": ["actionable recommendation 1", "recommendation 2"]
}`;

    const aiResult = await callAnthropicJson<TrustAnalysisResult>(prompt, 2000);

    if (!aiResult) {
      throw new Error("Failed to analyze trust & risk profile");
    }

    // Store the analysis
    const analysisId = await ctx.runMutation(api.aiWrite.createRiskAnalysis, {
      productId: args.productId,
      privacyRiskScore: aiResult.privacyRiskScore,
      tosAmbiguityScore: aiResult.tosAmbiguityScore,
      dataResidencyFlags: aiResult.dataResidencyFlags,
      securityPostureScore: aiResult.securityPostureScore,
      riskSummary: aiResult.riskSummary,
      detailedFindings: aiResult.detailedFindings,
      analyzedDocUrls: args.documentUrl ? [args.documentUrl] : [],
      generatedAt: Date.now(),
      isCurrent: true,
    });

    // Mark old analyses as not current
    await ctx.runMutation(api.aiWrite.markRiskAnalysesAsOld, {
      productId: args.productId,
      excludeId: analysisId,
    });

    return { id: analysisId, ...aiResult };
  },
});

// Get category benchmark for a product
export const getCategoryBenchmark = query({
  args: {
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    // Get the product's category
    const product = await ctx.db.get(args.productId);
    if (!product) return null;

    const category = product.category;

    // Get all products in the same category
    const productsInCategory = await ctx.db
      .query("novaProducts")
      .withIndex("by_category", (q) => q.eq("category", category))
      .collect();

    const benchmarks: Array<{ productId: string; productName: string; privacyRiskScore: number }> = [];

    for (const p of productsInCategory) {
      const riskAnalysis = await ctx.db
        .query("aiRiskAnalyses")
        .withIndex("by_current", (q) => q.eq("productId", p._id).eq("isCurrent", true))
        .first();

      if (riskAnalysis) {
        benchmarks.push({
          productId: p._id,
          productName: p.productName,
          privacyRiskScore: riskAnalysis.privacyRiskScore,
        });
      }
    }

    // Sort by privacy risk score (lower is better)
    benchmarks.sort((a, b) => a.privacyRiskScore - b.privacyRiskScore);

    // Find this product's position
    const thisProductIndex = benchmarks.findIndex((b) => b.productId === args.productId);
    const percentile = thisProductIndex >= 0 ? ((thisProductIndex + 1) / benchmarks.length) * 100 : 50;

    return {
      category,
      totalProducts: benchmarks.length,
      percentile,
      topPerformers: benchmarks.slice(0, 5),
      thisProductRank: thisProductIndex + 1,
    };
  },
});

// Get current analysis for a product
export const getCurrentAnalysis = query({
  args: {
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db
      .query("aiRiskAnalyses")
      .withIndex("by_current", (q) => q.eq("productId", args.productId).eq("isCurrent", true))
      .first();

    if (!analysis) return null;

    return analysis;
  },
});

// Get analysis with benchmark
export const getAnalysisWithBenchmark = query({
  args: {
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.runQuery(api.ai.trustCopilot.getCurrentAnalysis, {
      productId: args.productId,
    });

    if (!analysis) return null;

    const benchmark = await ctx.runQuery(api.ai.trustCopilot.getCategoryBenchmark, {
      productId: args.productId,
    });

    return {
      ...analysis,
      categoryBenchmark: benchmark,
    };
  },
});

// Generate compliance memo for a stack
export const generateComplianceMemo = action({
  args: {
    productIds: v.array(v.id("novaProducts")),
    userRegion: v.string(),
    userIndustry: v.optional(v.string()),
    requestedFrameworks: v.array(v.string()),
    userId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limiter = await checkAiRateLimit(ctx, `compliance_memo:${args.userId ?? "anon"}`);
    if (!limiter.allowed) {
      throw new Error(limiter.reason ?? "Rate limit exceeded");
    }

    // Get products and risk analyses for all products
    const productsResult = await ctx.runQuery(api.ai.trustCopilot.getProductsAndRisks, {
      productIds: args.productIds,
    });

    const products = productsResult?.products ?? [];
    const riskAnalyses = productsResult?.riskAnalyses ?? [];

    // Build compliance analysis prompt
    const prompt = `You are TheSynLab's AI Compliance Advisor. Analyze the compliance posture of this tech stack:

User Region: ${args.userRegion}
User Industry: ${args.userIndustry ?? "Not specified"}
Requested Frameworks: ${args.requestedFrameworks.join(", ")}

Products in Stack:
${products.map((p: any, i: number) => `${i + 1}. ${p.productName} (${p.category ?? "Unknown"})`).join("\n")}

Risk Analyses Available:
${riskAnalyses.map((r: any, i: number) => `${i + 1}. ${products.find((p: any) => p._id === r.productId)?.productName ?? "Unknown"}: Privacy Risk: ${r.privacyRiskScore}, Security: ${r.securityPostureScore}`).join("\n")}

Provide a compliance memo with the following JSON structure:
{
  "overallPosture": "compliant|partial|non_compliant",
  "complianceMatrix": {
    "[productId]": {
      "GDPR": { "status": "pass|fail|partial", "score": 0.0-1.0, "notes": "string" },
      "SOC2": { "status": "pass|fail|partial", "score": 0.0-1.0, "notes": "string" },
      "HIPAA": { "status": "pass|fail|partial", "score": 0.0-1.0, "notes": "string" },
      "PCI_DSS": { "status": "pass|fail|partial", "score": 0.0-1.0, "notes": "string" }
    }
  },
  "criticalGaps": [
    { "productId": "string", "framework": "string", "gap": "string", "severity": "critical|high|medium|low", "recommendation": "string" }
  ],
  "recommendations": ["actionable recommendation 1", "recommendation 2"],
  "memoContent": "# Compliance Posture Summary\n\n[Markdown formatted compliance memo]"
}`;

    const aiResult = await callAnthropicJson<{
      overallPosture: "compliant" | "partial" | "non_compliant";
      complianceMatrix: Record<string, any>;
      criticalGaps: Array<any>;
      recommendations: string[];
      memoContent: string;
    }>(prompt, 2500);

    if (!aiResult) {
      throw new Error("Failed to generate compliance memo");
    }

    // Store the compliance memo using mutation
    const memoId = await ctx.runMutation(api.aiWrite.createComplianceMemo, {
      userId: args.userId,
      sessionId: args.sessionId,
      productIds: args.productIds,
      userRegion: args.userRegion,
      userIndustry: args.userIndustry,
      requestedFrameworks: args.requestedFrameworks,
      memoContent: aiResult.memoContent,
      complianceMatrix: aiResult.complianceMatrix,
      overallPosture: aiResult.overallPosture,
      criticalGaps: aiResult.criticalGaps,
      recommendations: aiResult.recommendations,
      generatedAt: Date.now(),
      modelVersion: "claude-sonnet-4-20250514",
    });

    return { id: memoId, ...aiResult };
  },
});

// Helper query to get products and their risk analyses
export const getProductsAndRisks = query({
  args: {
    productIds: v.array(v.id("novaProducts")),
  },
  handler: async (ctx, args) => {
    const products: any[] = [];
    const riskAnalyses: any[] = [];

    for (const productId of args.productIds) {
      const product = await ctx.db.get(productId);
      const riskAnalysis = await ctx.db
        .query("aiRiskAnalyses")
        .withIndex("by_current", (q) => q.eq("productId", productId).eq("isCurrent", true))
        .first();

      if (product) products.push(product);
      if (riskAnalysis) {
        // Create a new object without spreading productId twice
        riskAnalyses.push({
          productId,
          _id: riskAnalysis._id,
          privacyRiskScore: riskAnalysis.privacyRiskScore,
          tosAmbiguityScore: riskAnalysis.tosAmbiguityScore,
          securityPostureScore: riskAnalysis.securityPostureScore,
          riskSummary: riskAnalysis.riskSummary,
          detailedFindings: riskAnalysis.detailedFindings,
        });
      }
    }

    return { products, riskAnalyses };
  },
});

// Get compliance memo by ID
export const getComplianceMemo = query({
  args: {
    memoId: v.id("complianceMemos"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.memoId);
  },
});

// Get user's compliance memos
export const getUserComplianceMemos = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const memos = await ctx.db
      .query("complianceMemos")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(20);

    return memos;
  },
});