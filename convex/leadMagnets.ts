/**
 * Convex mutations and queries for leadMagnets and leadMagnetDownloads.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Log a lead magnet download (or gate submission with email).
 * Also optionally subscribe the user to the newsletter.
 */
export const download = mutation({
  args: {
    magnetSlug: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    companySize: v.optional(v.string()),
    subscribeToNewsletter: v.optional(v.boolean()),
    utmSource: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const magnet = await ctx.db
      .query("leadMagnets")
      .withIndex("by_slug", (q) => q.eq("slug", args.magnetSlug))
      .first();

    if (!magnet) {
      throw new Error(`Lead magnet not found: ${args.magnetSlug}`);
    }

    // Record download
    await ctx.db.insert("leadMagnetDownloads", {
      magnetId: magnet._id,
      email: args.email.trim().toLowerCase(),
      utmSource: args.utmSource,
      downloadedAt: Date.now() / 1000,
    });

    // Update download counter
    await ctx.db.patch(magnet._id, {
      downloadCount: (magnet.downloadCount || 0) + 1,
      emailsCollected: (magnet.emailsCollected || 0) + 1,
    });

    // Optionally subscribe to newsletter
    if (args.subscribeToNewsletter !== false) {
      const existing = await ctx.db
        .query("novaNewsletterSubscribers")
        .withIndex("by_email", (q) => q.eq("email", args.email.trim().toLowerCase()))
        .first();

      if (!existing || !existing.isActive) {
        await ctx.db.insert("novaNewsletterSubscribers", {
          email: args.email.trim().toLowerCase(),
          subscribedAt: Date.now() / 1000,
          source: "lead_magnet",
          isVerified: false,
          isActive: true,
          preferences: { leadMagnetSlug: args.magnetSlug, name: args.name },
        });
      }
    }

    return {
      ok: true,
      downloadUrl: magnet.fileUrl || `/report/${args.magnetSlug}`,
    };
  },
});

/**
 * Get a single lead magnet details.
 */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leadMagnets")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

/**
 * List all active lead magnets.
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("leadMagnets")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});
