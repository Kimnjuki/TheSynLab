import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

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
      reviewedBy: undefined,
      reviewedAt: undefined,
      detectedAt: Date.now(),
    };
    const id = await ctx.db.insert("aiAnomalyFlags", payload);
    return { id, ...payload };
  },
});
