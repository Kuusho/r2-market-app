import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByWallet = query({
  args: { wallet_address: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) =>
        q.eq("wallet_address", args.wallet_address.toLowerCase())
      )
      .unique();
  },
});

export const register = mutation({
  args: {
    wallet_address: v.string(),
    referral_code: v.string(),
    referred_by: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const wallet = args.wallet_address.toLowerCase();

    // Check if already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("wallet_address", wallet))
      .unique();

    if (existing) {
      return { user: existing, alreadyExisted: true };
    }

    // Resolve referrer
    let referredBy: string | undefined;
    if (args.referred_by) {
      const referrer = await ctx.db
        .query("users")
        .withIndex("by_referral_code", (q) =>
          q.eq("referral_code", args.referred_by!)
        )
        .unique();
      if (referrer) {
        referredBy = referrer.wallet_address;
      }
    }

    const id = await ctx.db.insert("users", {
      wallet_address: wallet,
      referral_code: args.referral_code,
      referred_by: referredBy,
      is_holder: false,
      status: "waitlisted",
    });

    // Track referral
    if (referredBy) {
      await ctx.db.insert("referrals", {
        referrer_wallet: referredBy,
        referred_wallet: wallet,
      });
    }

    const user = await ctx.db.get(id);
    return { user, alreadyExisted: false };
  },
});

export const countByStatus = query({
  args: { statuses: v.array(v.string()) },
  handler: async (ctx, args) => {
    let count = 0;
    for (const status of args.statuses) {
      const results = await ctx.db
        .query("users")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
      count += results.length;
    }
    return count;
  },
});

export const countAll = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("users").collect();
    return all.length;
  },
});

export const updateStatus = mutation({
  args: { wallet_address: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) =>
        q.eq("wallet_address", args.wallet_address.toLowerCase())
      )
      .unique();
    if (user) {
      await ctx.db.patch(user._id, { status: args.status });
    }
  },
});

export const updateTwitter = mutation({
  args: {
    wallet_address: v.string(),
    twitter_id: v.string(),
    twitter_username: v.string(),
    twitter_following: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) =>
        q.eq("wallet_address", args.wallet_address.toLowerCase())
      )
      .unique();
    if (user) {
      await ctx.db.patch(user._id, {
        twitter_id: args.twitter_id,
        twitter_username: args.twitter_username,
        twitter_following: args.twitter_following ?? false,
      });
    }
  },
});

export const updateDiscord = mutation({
  args: {
    wallet_address: v.string(),
    discord_id: v.string(),
    discord_username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) =>
        q.eq("wallet_address", args.wallet_address.toLowerCase())
      )
      .unique();
    if (user) {
      await ctx.db.patch(user._id, {
        discord_id: args.discord_id,
        discord_username: args.discord_username,
      });
    }
  },
});

export const upsertFarcaster = mutation({
  args: {
    wallet_address: v.string(),
    farcaster_fid: v.number(),
    farcaster_username: v.string(),
    referral_code: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const wallet = args.wallet_address.toLowerCase();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) => q.eq("wallet_address", wallet))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        farcaster_fid: args.farcaster_fid,
        farcaster_username: args.farcaster_username,
      });
      return { wallet, alreadyExisted: true };
    }

    // Create new user
    const referralCode = args.farcaster_username.toLowerCase();
    let referredBy: string | undefined;
    if (args.referral_code) {
      const referrer = await ctx.db
        .query("users")
        .withIndex("by_referral_code", (q) =>
          q.eq("referral_code", args.referral_code!)
        )
        .unique();
      if (referrer) referredBy = referrer.wallet_address;
    }

    await ctx.db.insert("users", {
      wallet_address: wallet,
      farcaster_fid: args.farcaster_fid,
      farcaster_username: args.farcaster_username,
      referral_code: referralCode,
      referred_by: referredBy,
      is_holder: false,
      status: "waitlisted",
    });

    if (referredBy) {
      await ctx.db.insert("referrals", {
        referrer_wallet: referredBy,
        referred_wallet: wallet,
      });
    }

    return { wallet, alreadyExisted: false };
  },
});

export const updateProfile = mutation({
  args: {
    wallet_address: v.string(),
    display_name: v.optional(v.string()),
    archetype: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_wallet", (q) =>
        q.eq("wallet_address", args.wallet_address.toLowerCase())
      )
      .unique();
    if (user) {
      const patch: Record<string, string | undefined> = {};
      if (args.display_name !== undefined) patch.display_name = args.display_name;
      if (args.archetype !== undefined) patch.archetype = args.archetype;
      await ctx.db.patch(user._id, patch);
    }
  },
});
