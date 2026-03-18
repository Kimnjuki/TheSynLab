/**
 * S10: Affiliate price refresh – fetches prices from APIs or mock.
 * Env: AFFILIATE_PRICE_API_URL (optional). When set, POST linkId; else mock.
 */

import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const listActiveLinks = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("novaAffiliateLinks")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .take(200);
  },
});

export const updateLinkPrice = mutation({
  args: {
    linkId: v.id("novaAffiliateLinks"),
    currentPrice: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    priceHistory: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);
    if (!link) return null;

    const updates: Record<string, unknown> = {
      priceLastFetched: Date.now(),
    };
    if (args.currentPrice !== undefined) updates.currentPrice = args.currentPrice;
    if (args.originalPrice !== undefined) updates.originalPrice = args.originalPrice;
    if (args.priceHistory !== undefined) {
      updates.priceHistory = args.priceHistory;
    } else if (args.currentPrice !== undefined) {
      const hist = (link.priceHistory as { price: number; fetchedAt: number }[]) || [];
      updates.priceHistory = [
        ...hist.slice(-19),
        { price: args.currentPrice, fetchedAt: Date.now() },
      ];
    }

    await ctx.db.patch(args.linkId, updates);
    return args.linkId;
  },
});

/** Action: refresh all active affiliate link prices (mock or external API). */
export const refreshAllPrices = action({
  args: {},
  handler: async (ctx) => {
    const links = await ctx.runQuery(api.affiliatePrices.listActiveLinks, {});
    const apiUrl = process.env.AFFILIATE_PRICE_API_URL;
    let updated = 0;
    for (const link of links) {
      try {
        let price: number | undefined;
        if (apiUrl) {
          const res = await fetch(`${apiUrl}/price`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ linkId: link._id, productId: link.productId }),
          });
          if (res.ok) {
            const j = (await res.json()) as { price?: number };
            price = j.price;
          }
        }
        if (price === undefined) {
          const product = await ctx.runQuery(api.products.get, { id: link.productId });
          price = product?.price ?? 99;
          const variance = 0.9 + Math.random() * 0.2;
          price = Math.round(price * variance);
        }
        await ctx.runMutation(api.affiliatePrices.updateLinkPrice, {
          linkId: link._id,
          currentPrice: price,
          originalPrice: price * 1.1,
        });
        updated++;
      } catch {
        // skip failed
      }
    }
    return { updated, total: links.length };
  },
});

