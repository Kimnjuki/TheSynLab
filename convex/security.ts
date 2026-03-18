import { query } from "./_generated/server";

export const getAuditLogs = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("novaSecurityAuditLog").order("desc").take(100);
  },
});

export const getBlockedIps = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("novaBlockedIps").take(50);
  },
});

export const getRecentFailedLogins = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db
      .query("novaFailedLoginAttempts")
      .withIndex("by_time", (q) =>
        q.gt("attemptTime", Date.now() - 24 * 60 * 60 * 1000)
      )
      .order("desc")
      .take(50);
  },
});
