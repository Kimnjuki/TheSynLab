import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

type StackTool = {
  productSlug: string;
  role: string;
  rationale: string;
  monthlyCost?: number;
  trustScore?: number;
  integrationScore?: number;
};

const MODEL = "claude-sonnet-4-20250514";

async function callAnthropic(system: string, user: string) {
  const apiKey = (globalThis as any)?.process?.env?.ANTHROPIC_API_KEY as string | undefined;
  if (!apiKey) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1400,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (!text || typeof text !== "string") return null;
  return text;
}

export const createAiStackSession = mutation({
  args: {
    intakeAnswers: v.any(),
    userId: v.optional(v.string()),
    userSegment: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const sessionId = crypto.randomUUID();
    const id = await ctx.db.insert("aiStackSessions", {
      sessionId,
      userId: args.userId,
      status: "active",
      userSegment: args.userSegment,
      intakeAnswers: args.intakeAnswers,
      startedAt: Date.now(),
      refinementHistory: [],
      aiModelVersion: MODEL,
    });
    return { id, sessionId };
  },
});

export const updateAiStackSession = mutation({
  args: {
    sessionId: v.string(),
    generatedStack: v.any(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("aiStackSessions")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();
    if (!session) throw new Error("Session not found");
    await ctx.db.patch(session._id, {
      generatedStack: args.generatedStack,
      status: args.status ?? "completed",
      completedAt: Date.now(),
    });
    return session._id;
  },
});

export const getAiStackSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiStackSessions")
      .filter((q) => q.eq(q.field("sessionId"), args.sessionId))
      .first();
  },
});

export const generateStack = action({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.runQuery(api.aiStackSessions.getAiStackSession, {
      sessionId: args.sessionId,
    });
    if (!session) throw new Error("Session not found");

    const products = await ctx.runQuery(api.products.list, { status: "active" });
    const simplified = products.slice(0, 25).map((p) => ({
      productSlug: p.productSlug,
      productName: p.productName,
      category: p.category,
      price: p.price ?? null,
      trustScore: p.nova_trust_scores?.[0]?.total_score ?? null,
      integrationScore: p.nova_integration_scores?.[0]?.total_score ?? null,
    }));

    const systemPrompt =
      "You are TheSynLab AI Stack Architect. Return only valid JSON matching requested schema.";
    const userPrompt = JSON.stringify({
      intakeAnswers: session.intakeAnswers,
      products: simplified,
      schema: {
        tools: [
          {
            productSlug: "string",
            role: "string",
            rationale: "string",
            monthlyCost: 0,
            trustScore: 0,
            integrationScore: 0,
          },
        ],
        totalCost: 0,
        overallTrustScore: 0,
        overallIntegrationScore: 0,
        migrationSteps: ["string"],
        warningFlags: ["string"],
      },
    });

    const aiRaw = await callAnthropic(systemPrompt, userPrompt);
    let parsed: any = null;
    if (aiRaw) {
      try {
        parsed = JSON.parse(aiRaw);
      } catch {
        parsed = null;
      }
    }

    if (!parsed) {
      const fallbackTools: StackTool[] = simplified.slice(0, 3).map((p) => ({
        productSlug: p.productSlug,
        role: p.category ?? "core_tool",
        rationale: "Selected via fallback ranking using trust/integration score.",
        monthlyCost: p.price ?? 0,
        trustScore: p.trustScore ?? 0,
        integrationScore: p.integrationScore ?? 0,
      }));
      parsed = {
        tools: fallbackTools,
        totalCost: fallbackTools.reduce((sum, t) => sum + (t.monthlyCost ?? 0), 0),
        overallTrustScore:
          fallbackTools.reduce((sum, t) => sum + (t.trustScore ?? 0), 0) /
            Math.max(fallbackTools.length, 1) || 0,
        overallIntegrationScore:
          fallbackTools.reduce((sum, t) => sum + (t.integrationScore ?? 0), 0) /
            Math.max(fallbackTools.length, 1) || 0,
        migrationSteps: ["Map data sources", "Run parallel trial", "Cut over and validate"],
        warningFlags: ["Fallback mode used because ANTHROPIC_API_KEY is missing or response invalid."],
      };
    }

    await ctx.runMutation(api.aiStackSessions.updateAiStackSession, {
      sessionId: args.sessionId,
      generatedStack: parsed,
      status: "completed",
    });

    return parsed;
  },
});
