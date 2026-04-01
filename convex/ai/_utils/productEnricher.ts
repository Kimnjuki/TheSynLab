import { ActionCtx } from "../../_generated/server";
import { api } from "../../_generated/api";

export async function enrichProducts(ctx: ActionCtx, productIds: any[]) {
  return await ctx.runQuery(api.aiData.getProductScoreRows, { productIds });
}
