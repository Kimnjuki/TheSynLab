import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get current user's profile (mock for Git Bash deployment)
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    // For mock auth, get admin profile
    const adminUser = await ctx.db
      .query("novaUsers")
      .withIndex("by_username", (q) => q.eq("username", "admin"))
      .first();
    
    if (!adminUser) return null;
    
    return await ctx.db
      .query("profiles")
      .withIndex("by_clerk", (q) => q.eq("clerkId", adminUser.clerkId))
      .first();
  },
});

// Get profile by user ID (Clerk ID or mock ID)
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_clerk", (q) => q.eq("clerkId", args.userId))
      .first();
  },
});

// Get profile by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Create or update profile (mock auth)
export const upsert = mutation({
  args: {
    clerkId: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    notificationPreferences: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const clerkId = args.clerkId || "system_admin";
    
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_clerk", (q) => q.eq("clerkId", clerkId))
      .first();

    const { clerkId: _, ...updates } = args;

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    }

    return await ctx.db.insert("profiles", {
      clerkId,
      ...updates,
    });
  },
});

// Update profile
export const update = mutation({
  args: {
    userId: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    notificationPreferences: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    // For mock auth, update admin profile
    const adminUser = await ctx.db
      .query("novaUsers")
      .withIndex("by_username", (q) => q.eq("username", "admin"))
      .first();
    
    if (!adminUser) throw new Error("Admin user not found");
    
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk", (q) => q.eq("clerkId", adminUser.clerkId))
      .first();

    if (!profile) {
      // Create profile if it doesn't exist
      return await ctx.db.insert("profiles", {
        clerkId: adminUser.clerkId,
        ...updates,
      });
    }

    await ctx.db.patch(profile._id, updates);
    return profile._id;
  },
});

// Create profile
export const create = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("profiles", args);
  },
});

// Check if user has a specific role (mock: always true for admin)
export const hasRole = query({
  args: { role: v.string() },
  handler: async (ctx, args) => {
    // For mock deployment, check if admin exists
    const adminUser = await ctx.db
      .query("novaUsers")
      .withIndex("by_username", (q) => q.eq("username", "admin"))
      .first();
    
    return args.role === "admin" ? !!adminUser : false;
  },
});

// Get user roles (mock: return admin if admin user exists)
export const getRoles = query({
  args: {},
  handler: async (ctx) => {
    const adminUser = await ctx.db
      .query("novaUsers")
      .withIndex("by_username", (q) => q.eq("username", "admin"))
      .first();
    
    return adminUser ? ["admin"] : [];
  },
});

// Assign role
export const assignRole = mutation({
  args: {
    userId: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if role already exists
    const existingRole = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingRole && existingRole.role === args.role) {
      return existingRole._id;
    }

    return await ctx.db.insert("userRoles", {
      userId: args.userId,
      role: args.role,
    });
  },
});
