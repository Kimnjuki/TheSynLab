import { ActionCtx } from "../../_generated/server";

export function withinTtl(generatedAt: number | undefined, ttlMs: number) {
  if (!generatedAt) return false;
  return Date.now() - generatedAt <= ttlMs;
}

export async function getRecentByIndex<T>(
  ctx: ActionCtx,
  queryRef: any,
  args: Record<string, unknown>,
  generatedAtField: keyof T & string,
  ttlMs: number
) {
  const rows = (await ctx.runQuery(queryRef, args)) as T[] | null;
  if (!rows || rows.length === 0) return null;
  const sorted = [...rows].sort((a: any, b: any) => (b[generatedAtField] ?? 0) - (a[generatedAtField] ?? 0));
  const latest = sorted[0] as any;
  if (!withinTtl(latest?.[generatedAtField], ttlMs)) return null;
  return latest as T;
}

export async function getRecentByProductAndType(
  ctx: ActionCtx,
  productId: any,
  scoreType: string
) {
  const rows = await ctx.runQuery("aiRead.getScoreExplanationsByProduct" as any, {
    productId,
  });
  return (rows || []).find((r: any) => r.scoreType === scoreType) ?? null;
}
