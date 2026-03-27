/**
 * S4: Integration simulations – save and retrieve simulation results.
 */

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const save = mutation({
  args: {
    userId: v.optional(v.string()),
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    simulationConfig: v.any(),
    resultScore: v.number(),
    resultDetails: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("integrationSimulations", {
      userId: args.userId,
      productAId: args.productAId,
      productBId: args.productBId,
      simulationConfig: args.simulationConfig,
      resultScore: args.resultScore,
      resultDetails: args.resultDetails,
      status: "completed",
      runAt: Date.now(),
      completedAt: Date.now(),
    });
  },
});

export const listByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("integrationSimulations")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(20);
  },
});

export const listByProducts = query({
  args: {
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("integrationSimulations")
      .withIndex("by_products", (q) =>
        q.eq("productAId", args.productAId).eq("productBId", args.productBId)
      )
      .order("desc")
      .take(5);
  },
});

/** Heuristic compatibility simulation (no external API). */
export const runHeuristic = mutation({
  args: {
    userId: v.optional(v.string()),
    productAId: v.id("novaProducts"),
    productBId: v.id("novaProducts"),
    useCase: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const a = await ctx.db
      .query("novaEcosystemCompatibility")
      .withIndex("by_product", (q) => q.eq("productId", args.productAId))
      .collect();
    const b = await ctx.db
      .query("novaEcosystemCompatibility")
      .withIndex("by_product", (q) => q.eq("productId", args.productBId))
      .collect();

    const mapA = new Map(a.map((e) => [e.ecosystem, e]));
    const shared: string[] = [];
    let score = 0;
    const steps: { label: string; status: "pass" | "warn" | "fail"; detail: string }[] = [];

    for (const eb of b) {
      const ea = mapA.get(eb.ecosystem);
      if (!ea) continue;
      shared.push(eb.ecosystem);
      const ok =
        ea.compatibilityLevel === "full" && eb.compatibilityLevel === "full";
      const partial =
        ea.compatibilityLevel === "partial" || eb.compatibilityLevel === "partial";
      if (ok) score += 15;
      else if (partial) score += 8;
      else score += 3;
    }

    if (shared.length === 0) {
      steps.push({
        label: "Ecosystem overlap",
        status: "fail",
        detail: "No shared ecosystems between products — bridge hub likely required.",
      });
    } else {
      steps.push({
        label: "Ecosystem overlap",
        status: "pass",
        detail: `Shared: ${shared.slice(0, 6).join(", ")}${shared.length > 6 ? "…" : ""}`,
      });
    }

    const hubNeeded = a.some((x) => x.requiresHub) || b.some((x) => x.requiresHub);
    steps.push({
      label: "Hub pathway",
      status: hubNeeded ? "warn" : "pass",
      detail: hubNeeded
        ? "At least one device may need a hub for full automation."
        : "No hub requirement flagged on recorded compatibility rows.",
    });

    steps.push({
      label: "Voice / routine path",
      status: shared.some((s) =>
        ["Amazon Alexa", "Google Home", "Apple HomeKit"].includes(s)
      )
        ? "pass"
        : "warn",
      detail: "Alexa / Google / HomeKit overlap improves routine triggers.",
    });

    const resultScore = Math.min(100, Math.max(0, score + shared.length * 5));
    const resultDetails = {
      useCase: args.useCase ?? "general",
      sharedEcosystems: shared,
      steps,
    };

    const id = await ctx.db.insert("integrationSimulations", {
      userId: args.userId,
      productAId: args.productAId,
      productBId: args.productBId,
      simulationConfig: { mode: "heuristic", useCase: args.useCase },
      resultScore,
      resultDetails,
      status: "completed",
      runAt: Date.now(),
      completedAt: Date.now(),
    });
    return { simulationId: id, resultScore, resultDetails };
  },
});
