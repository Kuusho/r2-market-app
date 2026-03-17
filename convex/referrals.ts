import { v } from "convex/values";
import { query } from "./_generated/server";

export const countByReferrer = query({
  args: { referrer_wallet: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) =>
        q.eq("referrer_wallet", args.referrer_wallet.toLowerCase())
      )
      .collect();
    return results.length;
  },
});
