import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { api } from "./_generated/api";

// Get a user's saved stack by session or userId
export const getMyStack = query({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let stacks;
    if (args.userId) {
      stacks = await ctx.db
        .query("userMyStack")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
    } else {
      stacks = await ctx.db
        .query("userMyStack")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    }

    // Fetch products for each stack
    const enriched = await Promise.all(
      stacks.map(async (stack) => {
        const products = await Promise.all(
          stack.productIds.map(async (pid) => {
            const product = await ctx.db
              .query("novaProducts")
              .withIndex("by_id")
              .filter((q) => q.eq(q.field("_id"), pid))
              .take(1);
            return product[0] || null;
          })
        );

        return {
          ...stack,
          products: products.filter(Boolean),
        };
      })
    );

    return enriched;
  },
});

// Add a product to user's stack
export const addToMyStack = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    // Find existing stack
    let stack: any = null;
    if (args.userId) {
      const stacks = await ctx.db
        .query("userMyStack")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .take(1);
      stack = stacks[0];
    }

    if (!stack) {
      const stacks = await ctx.db
        .query("userMyStack")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .take(1);
      stack = stacks[0];
    }

    const now = Date.now();

    if (stack) {
      const alreadyInStack = stack.productIds.some(
        (id) => id.toString() === args.productId.toString()
      );

      if (!alreadyInStack) {
        await ctx.db.patch(stack._id, {
          productIds: [...stack.productIds, args.productId],
          updatedAt: now,
        });
      }
    } else {
      await ctx.db.insert("userMyStack", {
        userId: args.userId,
        sessionId: args.sessionId,
        productIds: [args.productId],
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Remove a product from user's stack
export const removeFromMyStack = mutation({
  args: {
    sessionId: v.string(),
    userId: v.optional(v.string()),
    productId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    let stacks;
    if (args.userId) {
      stacks = await ctx.db
        .query("userMyStack")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .collect();
    } else {
      stacks = await ctx.db
        .query("userMyStack")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .collect();
    }

    for (const stack of stacks) {
      const updatedIds = stack.productIds.filter(
        (id) => id.toString() !== args.productId.toString()
      );
      await ctx.db.patch(stack._id, {
        productIds: updatedIds,
        updatedAt: Date.now(),
      });
    }
  },
});

// Compute risk warnings for a stack
export const computeStackRiskWarnings = mutation({
  args: {
    stackId: v.id("userMyStack"),
  },
  handler: async (ctx, args) => {
    const stack = await ctx.db.get(args.stackId);
    if (!stack) return [];

    const warnings: any[] = [];

    for (const productId of stack.productIds) {
      // Fetch vendor risk assessment
      const risk = await ctx.runQuery(api.vendorRisk.getVendorRiskProfile, {
        productId,
      });

      if (risk) {
        if (risk.overallRiskScore >= 7) {
          warnings.push({
            productId,
            warningType: "high_lock_in",
            warningMessage: "High vendor lock-in risk detected",
            severity: "high",
          });
        }

        if (risk.dataPortabilityScore < 3) {
          warnings.push({
            productId,
            warningType: "low_data_portability",
            warningMessage: "Limited data portability — consider export options",
            severity: "medium",
          });
        }
      }

      // Check TCO vs category average
      const pricing = await ctx.db
        .query("productPricingParams")
        .withIndex("by_product", (q) => q.eq("productId", productId))
        .first();
      if (pricing && pricing.basePriceMonthly > 200) {
        warnings.push({
          productId,
          warningType: "high_tco",
          warningMessage: `High monthly cost ($${pricing.basePriceMonthly}/mo)`,
          severity: "low",
        });
      }
    }

    // Check integration compatibility between products
    if (stack.productIds.length >= 2) {
      for (let i = 0; i < stack.productIds.length; i++) {
        for (let j = i + 1; j < stack.productIds.length; j++) {
          const aId = stack.productIds[i];
          const bId = stack.productIds[j];
          // Query aiCompatibilityEdges in both directions
          const edgeA = await ctx.db
            .query("aiCompatibilityEdges")
            .withIndex("by_pair", (q) =>
              q.eq("productAId", aId).eq("productBId", bId)
            )
            .first();
          const edgeB = await ctx.db
            .query("aiCompatibilityEdges")
            .withIndex("by_pair", (q) =>
              q.eq("productAId", bId).eq("productBId", aId)
            )
            .first();
          const edges = edgeA ?? edgeB;
          if (edges && !edges.isFeasible) {
            warnings.push({
              productId: aId,
              warningType: "integration_gap",
              warningMessage: `No native integration with another tool in your stack`,
              severity: "medium",
            });
            break;
          }
        }
      }
    }

    // Update stack with warnings
    await ctx.db.patch(args.stackId, {
      riskWarnings: warnings,
      lastComputedAt: Date.now(),
    });

    return warnings;
  },
});
