import { ActionCtx } from "../../_generated/server";
import { api } from "../../_generated/api";

export async function buildScoreContext(
  ctx: ActionCtx,
  productIds: any[]
): Promise<string> {
  const rows = await ctx.runQuery(api.aiData.getProductScoreRows, { productIds });
  return rows
    .map(
      (r) =>
        `${r.productName} | trust=${r.trustScore ?? "n/a"} | integration=${r.integrationScore ?? "n/a"} | price=${r.price ?? "n/a"}`
    )
    .join("\n");
}
