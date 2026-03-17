import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const log = mutation({
  args: {
    agentId: v.string(),
    cycle: v.number(),
    strategiesEvaluated: v.number(),
    decision: v.union(v.literal("buy"), v.literal("sell"), v.literal("hold")),
    confidence: v.union(v.literal("high"), v.literal("low"), v.literal("none")),
    source: v.union(v.literal("rules"), v.literal("llm"), v.literal("skip")),
    reason: v.string(),
    snapshotSummary: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reasoning", args);
  },
});

export const listByAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("reasoning")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .order("desc")
      .take(50);
  },
});
