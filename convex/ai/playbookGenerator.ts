// @ts-nocheck
import { action, internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

const insertPlaybook = internalMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    stackProductIds: v.array(v.id("novaProducts")),
    targetSegment: v.string(),
    sections: v.array(v.any()),
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiPlaybooks", {
      ...args,
      playbookType: "ai_generated",
      authorType: "ai",
      accessLevel: "premium",
      downloadCount: 0,
      rating: undefined,
      isPublished: true,
      publishedAt: Date.now(),
      lastUpdatedAt: Date.now(),
    });
  },
});

export const generatePlaybook = action({
  args: {
    userId: v.string(),
    stackProductIds: v.array(v.id("novaProducts")),
    teamSize: v.number(),
    industry: v.string(),
    companyName: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const ai = await callAnthropicJson<any>(
      `Generate playbook for user ${args.userId}, teamSize ${args.teamSize}, industry ${args.industry}. Return JSON {onboardingChecklist,sopSections,securityGuide,privacySetupGuide,title}.`,
      1000
    );
    const id = await ctx.runMutation(internal.ai.playbookGenerator.insertPlaybook, {
      title: ai?.title ?? `${args.industry} Team Playbook`,
      slug: `playbook-${Date.now()}`,
      stackProductIds: args.stackProductIds,
      targetSegment: `${args.industry}_${args.teamSize}`,
      sections: Array.isArray(ai?.sopSections) ? ai.sopSections : [],
      authorId: args.userId,
    });
    return {
      id,
      onboardingChecklist: ai?.onboardingChecklist ?? [],
      sopSections: ai?.sopSections ?? [],
      securityGuide: ai?.securityGuide ?? "",
      privacySetupGuide: ai?.privacySetupGuide ?? "",
    };
  },
});