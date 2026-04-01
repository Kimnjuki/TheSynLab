import { ActionCtx } from "../../_generated/server";
import { api } from "../../_generated/api";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 50;

export async function checkAiRateLimit(
  ctx: ActionCtx,
  identifier: string
): Promise<{ allowed: boolean; reason?: string }> {
  const now = Date.now();
  const current = await ctx.runQuery(api.aiRateLimit.getRateLimitForIdentifier, {
    identifier,
  });

  if (!current) {
    await ctx.runMutation(api.aiRateLimit.upsertRateLimit, {
      identifier,
      identifierType: "user",
      endpoint: "ai_features",
      requestCount: 1,
      firstRequestAt: now,
      lastRequestAt: now,
      blockedUntil: undefined,
      isBlocked: false,
    });
    return { allowed: true };
  }

  if (current.isBlocked && (current.blockedUntil ?? 0) > now) {
    return { allowed: false, reason: "Rate limit exceeded. Try again later." };
  }

  const resetWindow = now - current.firstRequestAt > WINDOW_MS;
  const nextCount = resetWindow ? 1 : (current.requestCount ?? 0) + 1;
  const block = nextCount > MAX_REQUESTS;

  await ctx.runMutation(api.aiRateLimit.upsertRateLimit, {
    identifier,
    identifierType: current.identifierType ?? "user",
    endpoint: current.endpoint ?? "ai_features",
    requestCount: nextCount,
    firstRequestAt: resetWindow ? now : current.firstRequestAt,
    lastRequestAt: now,
    blockedUntil: block ? now + 10 * 60 * 1000 : undefined,
    isBlocked: block,
  });

  if (block) {
    return { allowed: false, reason: "Rate limit exceeded. Try again later." };
  }
  return { allowed: true };
}
