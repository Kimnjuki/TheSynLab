import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

// Get a published blueprint by slug
export const getBlueprintBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blueprints = await ctx.db
      .query("workflowBlueprints")
      .withIndex("by_slug", (q) => q.eq("blueprintSlug", args.slug))
      .take(1);
    return blueprints[0] || null;
  },
});

// Get blueprints by role, optionally filtered by use case
export const getBlueprintsByRole = query({
  args: {
    roleTag: v.string(),
    useCaseTag: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let blueprints = await ctx.db
      .query("workflowBlueprints")
      .withIndex("by_role", (q) => q.eq("roleTag", args.roleTag))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    if (args.useCaseTag) {
      blueprints = blueprints.filter((b) => b.useCaseTag === args.useCaseTag);
    }

    return blueprints;
  },
});

// Generate a custom blueprint based on selection
export const generateCustomBlueprint = action({
  args: {
    selectedRole: v.string(),
    selectedUseCase: v.string(),
    selectedStack: v.optional(v.array(v.id("novaProducts"))),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find matching blueprints
    const blueprints = await ctx.runQuery(api.workflowBlueprint.getBlueprintsByRole, {
      roleTag: args.selectedRole,
      useCaseTag: args.selectedUseCase,
    });

    let blueprint = blueprints[0] || null;

    // If user provided stack, re-rank to prioritize those products
    if (blueprint && args.selectedStack && args.selectedStack.length > 0) {
      const stackSet = new Set(args.selectedStack.map((id) => id.toString()));
      const reorderedSteps = blueprint.steps
        .slice()
        .sort((a: any, b: any) => {
          const aInStack = a.toolProductId && stackSet.has(a.toolProductId.toString()) ? -1 : 0;
          const bInStack = b.toolProductId && stackSet.has(b.toolProductId.toString()) ? -1 : 0;
          return aInStack - bInStack;
        });

      blueprint = { ...blueprint, steps: reorderedSteps };
    }

    // Estimate cost from pricing
    let estimatedCost = 0;
    if (blueprint) {
      const stackIds = blueprint.stackProductIds || [];
      const prices = await Promise.all(
        stackIds.map(async (id: any) => {
          const pricing = await ctx.runQuery(api.tco.getProductPricing, { productId: id });
          return pricing;
        })
      );
      estimatedCost = prices.reduce((sum: number, p: any) => {
        return sum + (p?.basePriceMonthly || 0);
      }, 0);
    }

    // Save session
    await ctx.runMutation(api.workflowBlueprint.saveBlueprintSession, {
      sessionId: args.sessionId,
      selectedRole: args.selectedRole,
      selectedUseCase: args.selectedUseCase,
      selectedStack: args.selectedStack,
      generatedBlueprintId: blueprint?._id,
    });

    return {
      blueprint,
      stackProducts: [],
      estimatedMonthlyCost: estimatedCost,
      diagramData: blueprint?.diagramData || null,
    };
  },
});

export const saveBlueprintSession = mutation({
  args: {
    sessionId: v.string(),
    selectedRole: v.string(),
    selectedUseCase: v.string(),
    selectedStack: v.optional(v.array(v.id("novaProducts"))),
    generatedBlueprintId: v.optional(v.id("workflowBlueprints")),
    customBlueprintData: v.optional(v.any()),
    emailCaptured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workflowBlueprintSessions", {
      sessionId: args.sessionId,
      selectedRole: args.selectedRole,
      selectedUseCase: args.selectedUseCase,
      selectedStack: args.selectedStack,
      generatedBlueprintId: args.generatedBlueprintId,
      customBlueprintData: args.customBlueprintData,
      emailCaptured: args.emailCaptured || false,
      generatedAt: Date.now(),
    });
  },
});

export const incrementViewCount = mutation({
  args: { blueprintId: v.id("workflowBlueprints") },
  handler: async (ctx, args) => {
    const bp = await ctx.db.get(args.blueprintId);
    if (bp) {
      await ctx.db.patch(args.blueprintId, { viewCount: (bp.viewCount || 0) + 1 });
    }
  },
});

export const getPublishedBlueprints = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("workflowBlueprints")
      .withIndex("by_published", (q) => q.eq("isPublished", true))
      .order("desc")
      .collect();
  },
});
