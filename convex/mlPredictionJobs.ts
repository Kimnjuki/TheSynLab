/**
 * S1: ML Prediction Jobs
 * Tracks background prediction job status.
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    productId: v.id("novaProducts"),
    inputFeatures: v.optional(v.any()),
    modelVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mlPredictionJobs", {
      productId: args.productId,
      jobStatus: "pending",
      inputFeatures: args.inputFeatures,
      modelVersion: args.modelVersion,
      startedAt: Date.now(),
    });
  },
});

export const complete = mutation({
  args: {
    jobId: v.id("mlPredictionJobs"),
    outputScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      jobStatus: "completed",
      outputScore: args.outputScore,
      completedAt: Date.now(),
    });
    return args.jobId;
  },
});

export const fail = mutation({
  args: {
    jobId: v.id("mlPredictionJobs"),
    errorLog: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      jobStatus: "failed",
      errorLog: args.errorLog,
      completedAt: Date.now(),
    });
    return args.jobId;
  },
});

export const getByProduct = query({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mlPredictionJobs")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .take(10);
  },
});
