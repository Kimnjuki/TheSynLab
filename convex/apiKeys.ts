import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

function generateKey() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "syn_";
  for (let i = 0; i < 32; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

export const listByUser = query({
  args: { userId: v.id("novaUsers") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("novaApiKeys")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const create = mutation({
  args: { userId: v.id("novaUsers"), keyName: v.string() },
  handler: async (ctx, args) => {
    const key = generateKey();
    const prefix = key.slice(0, 10);
    // In production, store hashed key; for simplicity store hash = full key here
    await ctx.db.insert("novaApiKeys", {
      userId: args.userId,
      keyName: args.keyName,
      apiKeyHash: key,
      apiKeyPrefix: prefix,
      permissions: { read: true },
      rateLimit: 1000,
      isActive: true,
    });
    return { key };
  },
});

export const revoke = mutation({
  args: { keyId: v.id("novaApiKeys") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.keyId, { isActive: false });
  },
});
