import { ActionCtx } from "../../_generated/server";
import { api } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";

export async function buildScoreContext(
  ctx: ActionCtx,
  productIds: Id<"novaProducts">[]
): Promise<string> {
  const rows = await ctx.runQuery(api.aiData.getProductScoreRows, { productIds });
  return rows
    .map(
      (r) =>
        `${r.productName} | trust=${r.trustScore ?? "n/a"} | integration=${r.integrationScore ?? "n/a"} | price=${r.price ?? "n/a"}`
    )
    .join("\n");
}
