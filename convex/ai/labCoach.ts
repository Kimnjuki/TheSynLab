// @ts-nocheck
import { action, internalMutation } from "../_generated/server";
import { labCoachRef } from "./_utils/aiRateLimitRefs";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

const insertCoachAlert = internalMutation({
  args: {
    userId: v.string(),
    alertType: v.string(),
    title: v.string(),
    message: v.string(),
    relatedProductId: v.optional(v.id("novaProducts")),
    suggestedActions: v.array(v.string()),
    triggerReason: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiCoachAlerts", {
      ...args,
      isRead: false,
      isDismissed: false,
      createdAt: Date.now(),
    });
  },
});

export const runCoachAnalysis = action({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const ai = await callAnthropicJson<any[]>(
      `Generate 1-3 alerts for user ${args.userId}. Return JSON array [{alertType,title,message,relatedProductId,suggestedActions,triggerReason}]`,
      1000
    );
    const alerts = Array.isArray(ai) ? ai.slice(0, 3) : [];
    let created = 0;
    for (const a of alerts) {
      await ctx.runMutation(labCoachRef, {
        userId: args.userId,
        alertType: a?.alertType ?? "insight",
        title: a?.title ?? "AI Coach update",
        message: a?.message ?? "We found a possible improvement in your saved stack.",
        relatedProductId: typeof a?.relatedProductId === "string" ? (a.relatedProductId as any) : undefined,
        suggestedActions: Array.isArray(a?.suggestedActions) ? a.suggestedActions.map(String) : [],
        triggerReason: a?.triggerReason ?? "scheduled_analysis",
      });
      created++;
    }
    return { created };
  },
});