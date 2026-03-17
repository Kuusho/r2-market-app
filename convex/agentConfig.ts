import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByWallet = query({
  args: { walletAddress: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentConfig")
      .withIndex("by_wallet", (q) =>
        q.eq("walletAddress", args.walletAddress.toLowerCase())
      )
      .unique();
  },
});

export const save = mutation({
  args: {
    walletAddress: v.string(),
    vaultId: v.string(),
    displayName: v.string(),
    riskTier: v.string(),
    activeProtocols: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const wallet = args.walletAddress.toLowerCase();
    const existing = await ctx.db
      .query("agentConfig")
      .withIndex("by_wallet", (q) => q.eq("walletAddress", wallet))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        displayName: args.displayName,
        riskTier: args.riskTier,
        activeProtocols: args.activeProtocols,
      });
      return existing._id;
    }

    return await ctx.db.insert("agentConfig", {
      walletAddress: wallet,
      vaultId: args.vaultId,
      displayName: args.displayName,
      riskTier: args.riskTier,
      activeProtocols: args.activeProtocols,
    });
  },
});
