import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .collect();
  },
});

export const send = mutation({
  args: {
    agentId: v.string(),
    role: v.union(v.literal("user"), v.literal("agent")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", args);
  },
});

export const clear = mutation({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .collect();
    for (const msg of msgs) {
      await ctx.db.delete(msg._id);
    }
  },
});
