// @ts-nocheck
import { action, internalMutation } from "../_generated/server";
import { anomalyDetectorRef } from "./_utils/aiRateLimitRefs";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

const persistAnomalyFlag = internalMutation({
  args: {
    targetType: v.string(),
    targetId: v.string(),
    flagType: v.string(),
    description: v.string(),
    confidenceScore: v.number(),
    severity: v.string(),
    reviewStatus: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiAnomalyFlags", {
      ...args,
      reviewedBy: undefined,
      reviewedAt: undefined,
      detectedAt: Date.now(),
    });
  },
});

export const detectAnomalies = action({
  args: {
    targetType: v.union(v.literal("product_score"), v.literal("review"), v.literal("post"), v.literal("benchmark")),
    targetId: v.string(),
  },
  handler: async (ctx, args) => {
    const ai = await callAnthropicJson<any>(
      `Detect anomaly for ${args.targetType}:${args.targetId}. Return JSON {flagType,description,confidenceScore,severity}.`,
      1000
    );
    const payload = {
      targetType: args.targetType,
      targetId: args.targetId,
      flagType: ai?.flagType ?? "potential_bias",
      description: ai?.description ?? "Automated anomaly review suggested manual verification.",
      confidenceScore: typeof ai?.confidenceScore === "number" ? ai.confidenceScore : 0.5,
      severity: ai?.severity ?? "medium",
      reviewStatus: "pending",
    };
    const id = await ctx.runMutation(anomalyDetectorRef, payload);
    return { id, ...payload };
  },
});