import { ActionCtx } from "../../_generated/server";
import { api } from "../../_generated/api";
import { Id } from "../../_generated/dataModel";

export async function enrichProducts(
  ctx: ActionCtx,
  productIds: Id<"novaProducts">[]
) {
  return await ctx.runQuery(api.aiData.getProductScoreRows, { productIds });
}
