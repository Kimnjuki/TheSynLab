import { ActionCtx } from "../../_generated/server";
import type { Id } from "../../_generated/dataModel";
import type { FunctionReference } from "convex/server";

export function withinTtl(generatedAt: number | undefined, ttlMs: number) {
  if (!generatedAt) return false;
  return Date.now() - generatedAt <= ttlMs;
}

export async function getRecentByIndex<T extends Record<string, unknown>>(
  ctx: ActionCtx,
  queryRef: FunctionReference<"query">,
  args: Record<string, unknown>,
  generatedAtField: keyof T & string,
  ttlMs: number
) {
  const rows = (await ctx.runQuery(queryRef, args)) as T[] | null;
  if (!rows || rows.length === 0) return null;
  const latest = [...rows].sort(
    (a, b) =>
      Number(b[generatedAtField] ?? 0) - Number(a[generatedAtField] ?? 0)
  )[0];
  if (!latest || !withinTtl(Number(latest[generatedAtField] ?? 0), ttlMs)) {
    return null;
  }
  return latest;
}

export async function getRecentByProductAndType(
  ctx: ActionCtx,
  productId: Id<"novaProducts">,
  scoreType: string
) {
  const rows = (await ctx.runQuery(
    "aiRead.getScoreExplanationsByProduct" as unknown as FunctionReference<"query">,
    { productId }
  )) as { scoreType: string }[] | null;
  return rows?.find((r) => r.scoreType === scoreType) ?? null;
}
