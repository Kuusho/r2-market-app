import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const log = mutation({
  args: {
    agentId: v.string(),
    nftId: v.string(),
    action: v.union(v.literal("buy"), v.literal("sell")),
    collection: v.string(),
    tokenId: v.string(),
    price: v.string(),
    confidence: v.union(v.literal("high"), v.literal("low")),
    reason: v.string(),
    strategySlot: v.number(),
    source: v.union(v.literal("rules"), v.literal("llm")),
    txHash: v.optional(v.string()),
    success: v.boolean(),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trades", args);
  },
});

export const listByAgent = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    return await ctx.db
      .query("trades")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .order("desc")
      .take(100);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("trades").order("desc").take(1000);
  },
});

export const stats = query({
  args: { agentId: v.string() },
  handler: async (ctx, { agentId }) => {
    const trades = await ctx.db
      .query("trades")
      .withIndex("by_agent", (q) => q.eq("agentId", agentId))
      .collect();

    const total = trades.length;
    const successful = trades.filter((t) => t.success).length;
    const buys = trades.filter((t) => t.action === "buy").length;
    const sells = trades.filter((t) => t.action === "sell").length;
    const winRate = total > 0 ? successful / total : 0;

    return { total, successful, buys, sells, winRate };
  },
});
