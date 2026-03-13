import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List tasks for a project or all tasks
export const list = query({
  args: {
    projectId: v.optional(v.id("projects")),
    status: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tasks;
    
    if (args.projectId) {
      tasks = await ctx.db
        .query("tasks")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId!))
        .collect();
    } else {
      tasks = await ctx.db.query("tasks").collect();
    }

    if (args.status) {
      tasks = tasks.filter((t) => t.status === args.status);
    }
    if (args.assignedTo) {
      tasks = tasks.filter((t) => t.assignedTo === args.assignedTo);
    }

    // Sort by sort order
    return tasks.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

// Get a single task
export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create a task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    parentTaskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    // Get max sort order
    const existingTasks = await ctx.db.query("tasks").collect();
    const maxSortOrder = Math.max(0, ...existingTasks.map((t) => t.sortOrder));

    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: args.status || "todo",
      priority: args.priority || "medium",
      projectId: args.projectId,
      assignedTo: args.assignedTo,
      createdBy: "system_admin",
      dueDate: args.dueDate,
      estimatedHours: args.estimatedHours,
      actualHours: 0,
      tags: args.tags,
      parentTaskId: args.parentTaskId,
      sortOrder: maxSortOrder + 1,
    });
  },
});

// Update a task
export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    actualHours: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Bulk update task status
export const bulkUpdateStatus = mutation({
  args: {
    ids: v.array(v.id("tasks")),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    for (const id of args.ids) {
      await ctx.db.patch(id, { status: args.status });
    }
  },
});

// List projects
export const listProjects = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let projects = await ctx.db.query("projects").collect();
    
    if (args.status) {
      projects = projects.filter((p) => p.status === args.status);
    }
    
    return projects;
  },
});

// Create a project
export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      color: args.color || "#3b82f6",
      status: "active",
      ownerId: "system_admin",
    });
  },
});

// Update a project
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});
