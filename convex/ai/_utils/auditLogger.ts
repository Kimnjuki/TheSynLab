import { ActionCtx } from "../../_generated/server";
import { api } from "../../_generated/api";

export async function logAiFeatureCall(
  ctx: ActionCtx,
  {
    userId,
    action,
    tableName,
    recordId,
    description,
    status = "success",
    severity = "low",
  }: {
    userId?: string | null;
    action: string;
    tableName?: string;
    recordId?: string;
    description: string;
    status?: "success" | "failure";
    severity?: "low" | "medium" | "high" | "critical";
  }
) {
  await ctx.runMutation(api.aiAudit.logAiEvent, {
    eventType: "ai_feature_call",
    userId: userId ?? undefined,
    tableName,
    recordId,
    action,
    status,
    severity,
    description,
  });
}
