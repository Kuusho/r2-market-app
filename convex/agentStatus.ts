import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("agentStatus")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .first();
  },
});

export const listRunning = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("agentStatus")
      .withIndex("by_status", (q) => q.eq("status", "running"))
      .collect();
  },
});

export const set = mutation({
  args: {
    agentId: v.string(),
    status: v.string(),
    elizaAgentId: v.optional(v.string()),
    sequentialId: v.optional(v.number()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agentStatus", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("agentStatus"),
    status: v.string(),
    elizaAgentId: v.optional(v.string()),
    sequentialId: v.optional(v.number()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});
