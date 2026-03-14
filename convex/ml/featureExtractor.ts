/**
 * S1: Feature extraction for ML predictions
 * Extracts product features for model input. Stub – real implementation would call FastAPI.
 */

import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

export const extractProductFeatures = action({
  args: { productId: v.id("novaProducts") },
  handler: async (ctx, args) => {
    const product = await ctx.runQuery(api.products.get, {
      id: args.productId,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Stub: In production, POST to FastAPI /extract and return features.
    // const res = await fetch(`${FASTAPI_URL}/extract`, { body: JSON.stringify(product) });
    const stubFeatures = {
      category: product.category || "",
      subcategory: product.subcategory || "",
      price: product.price ?? 0,
      productType: product.productType || "",
      hub: product.hub || "",
      featureCount: Array.isArray(product.features) ? product.features.length : 0,
      specKeys: product.specifications
        ? Object.keys(product.specifications).length
        : 0,
    };

    return stubFeatures;
  },
});
