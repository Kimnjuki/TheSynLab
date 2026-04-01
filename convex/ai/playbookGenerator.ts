import { action } from "../_generated/server";
import { v } from "convex/values";
import { callAnthropicJson } from "./_utils/anthropic";

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
    const payload = {
      title: ai?.title ?? `${args.industry} Team Playbook`,
      slug: `playbook-${Date.now()}`,
      stackProductIds: args.stackProductIds,
      targetSegment: `${args.industry}_${args.teamSize}`,
      playbookType: "ai_generated",
      sections: Array.isArray(ai?.sopSections) ? ai.sopSections : [],
      authorType: "ai",
      authorId: args.userId,
      accessLevel: "premium",
      downloadCount: 0,
      rating: undefined,
      isPublished: true,
      publishedAt: Date.now(),
      lastUpdatedAt: Date.now(),
    };
    const id = await ctx.db.insert("aiPlaybooks", payload as any);
    return {
      id,
      onboardingChecklist: ai?.onboardingChecklist ?? [],
      sopSections: ai?.sopSections ?? [],
      securityGuide: ai?.securityGuide ?? "",
      privacySetupGuide: ai?.privacySetupGuide ?? "",
    };
  },
});
