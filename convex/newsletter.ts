/**
 * FEAT-006: Newsletter signup – Convex mutation for novaNewsletterSubscribers.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
    preferences: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email address");
    }

    const existing = await ctx.db
      .query("novaNewsletterSubscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      if (existing.isActive) {
        return { ok: true, message: "already_subscribed" as const };
      }
      await ctx.db.patch(existing._id, {
        isActive: true,
        unsubscribedAt: undefined,
        source: args.source ?? existing.source,
      });
      return { ok: true, message: "resubscribed" as const };
    }

    await ctx.db.insert("novaNewsletterSubscribers", {
      email,
      subscribedAt: Date.now() / 1000,
      source: args.source ?? "website",
      isVerified: false,
      isActive: true,
      preferences: args.preferences,
    });
    return { ok: true, message: "subscribed" as const };
  },
});
