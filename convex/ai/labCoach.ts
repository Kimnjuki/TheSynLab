import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

export const runCoachAnalysis = action({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const ai = await callAnthropicJson<any[]>(
      `Generate 1-3 alerts for user ${args.userId}. Return JSON array [{alertType,title,message,relatedProductId,suggestedActions,triggerReason}]`,
      1000
    );
    const alerts = Array.isArray(ai) ? ai.slice(0, 3) : [];
    const ids = await Promise.all(
      alerts.map((a: any) =>
        ctx.db.insert("aiCoachAlerts", {
          userId: args.userId,
          alertType: a?.alertType ?? "insight",
          title: a?.title ?? "AI Coach update",
          message: a?.message ?? "We found a possible improvement in your saved stack.",
          relatedProductId: a?.relatedProductId,
          suggestedActions: Array.isArray(a?.suggestedActions) ? a.suggestedActions : [],
          isRead: false,
          isDismissed: false,
          triggerReason: a?.triggerReason ?? "scheduled_analysis",
          createdAt: Date.now(),
        } as any)
      )
    );
    return { created: ids.length };
  },
});
