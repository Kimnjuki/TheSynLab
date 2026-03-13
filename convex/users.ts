import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get current user (mock for Git Bash deployment)
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    // Return first admin user for mock auth
    return await ctx.db
      .query("novaUsers")
      .withIndex("by_username", (q) => q.eq("username", "admin"))
      .first();
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.id("novaUsers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get user by Clerk ID (or mock ID)
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("novaUsers")
      .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Create or update user
export const upsert = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("novaUsers")
      .withIndex("by_clerk", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        displayName: args.displayName,
        lastLoginAt: Date.now(),
        loginCount: existingUser.loginCount + 1,
      });
      return existingUser._id;
    }

    // Create new user
    const userId = await ctx.db.insert("novaUsers", {
      clerkId: args.clerkId,
      username: args.username || args.email.split("@")[0],
      email: args.email,
      displayName: args.displayName,
      userStatus: "active",
      emailVerified: true,
      loginCount: 1,
      lastLoginAt: Date.now(),
      twoFactorEnabled: false,
    });

    // Also create a profile
    await ctx.db.insert("profiles", {
      clerkId: args.clerkId,
      email: args.email,
      displayName: args.displayName,
    });

    return userId;
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    userId: v.optional(v.string()),
    displayName: v.optional(v.string()),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // For mock auth, get the admin user
    const user = await ctx.db
      .query("novaUsers")
      .withIndex("by_username", (q) => q.eq("username", "admin"))
      .first();

    if (!user) return null;

    const { userId, ...updates } = args;
    await ctx.db.patch(user._id, updates);

    // Also update profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_clerk", (q) => q.eq("clerkId", user.clerkId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, updates);
    }

    return user._id;
  },
});

// Check if user is admin (always true for mock deployment)
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    // For Git Bash deployment, check if admin user exists
    const adminUser = await ctx.db
      .query("novaUsers")
      .withIndex("by_username", (q) => q.eq("username", "admin"))
      .first();
    
    return !!adminUser;
  },
});

// Get user's roles
export const getUserRoles = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const roles = await ctx.db.query("userRoles").collect();
    
    if (args.userId) {
      const userRoles = roles.filter((r) => r.userId === args.userId);
      return userRoles.map((r) => r.role);
    }
    
    // Return admin role for mock deployment
    return ["admin"];
  },
});

// Create admin role for a user
export const createAdminRole = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("userRoles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("userRoles", {
      userId: args.userId,
      role: "admin",
    });
  },
});
