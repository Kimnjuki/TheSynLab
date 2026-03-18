/**
 * S1: ML prediction action – calls ML_API_URL or uses heuristic.
 * Env: ML_API_URL (optional). When set, POST features; else heuristic.
 */

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

export const runMlPredictionForProduct = action({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const features = await ctx.runAction(api["ml/featureExtractor"].extractProductFeatures, {
      productId: args.productId,
    });

    const mlApiUrl = process.env.ML_API_URL;
    let predictedScore: number;
    let confidence: number;
    let modelVersion: string;

    if (mlApiUrl) {
      try {
        const res = await fetch(`${mlApiUrl}/predict-reliability`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            features,
            productId: args.productId,
          }),
        });

        if (!res.ok) throw new Error(`ML API ${res.status}`);
        const json = (await res.json()) as {
          predictedScore?: number;
          confidence?: number;
          modelVersion?: string;
        };
        predictedScore = json.predictedScore ?? 6;
        confidence = json.confidence ?? 0.7;
        modelVersion = json.modelVersion ?? "external-v1";
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        return { ok: false, error: `ML API error: ${msg}`, usedHeuristic: true };
      }
    } else {
      modelVersion = "heuristic-v1";
      const base =
        (features.avgRating / 5) * 3 +
        Math.min(3, features.reviewCount * 0.5) +
        (features.integrationScore / 10) * 2 +
        (features.trustScore / 10) * 2;
      predictedScore = Math.max(1, Math.min(10, base));
      confidence = 0.65 + (features.reviewCount > 5 ? 0.1 : 0);
    }

    await ctx.runMutation(api.integrationScores.updateMlPrediction, {
      productId: args.productId,
      mlPredictedScore: predictedScore,
      mlConfidence: confidence,
      predictionModel: modelVersion,
      predictionFeatures: features,
    });

    return {
      ok: true,
      predictedScore,
      confidence,
      modelVersion,
      usedHeuristic: !mlApiUrl,
    };
  },
});
