import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Waitlist users (replaces Supabase users table)
  users: defineTable({
    wallet_address: v.string(),
    farcaster_fid: v.optional(v.number()),
    farcaster_username: v.optional(v.string()),
    twitter_username: v.optional(v.string()),
    twitter_id: v.optional(v.string()),
    twitter_following: v.optional(v.boolean()),
    discord_id: v.optional(v.string()),
    discord_username: v.optional(v.string()),
    display_name: v.optional(v.string()),
    archetype: v.optional(v.string()),
    is_holder: v.boolean(),
    referral_code: v.string(),
    referred_by: v.optional(v.string()),
    status: v.string(), // waitlisted | queued | upgraded
  })
    .index("by_wallet", ["wallet_address"])
    .index("by_referral_code", ["referral_code"])
    .index("by_status", ["status"]),

  // Referral tracking (replaces Supabase referrals table)
  referrals: defineTable({
    referrer_wallet: v.string(),
    referred_wallet: v.string(),
  }).index("by_referrer", ["referrer_wallet"]),

  // Agent trading data (from web/ convex)
  messages: defineTable({
    agentId: v.string(),
    role: v.union(v.literal("user"), v.literal("agent")),
    content: v.string(),
  }).index("by_agent", ["agentId"]),

  trades: defineTable({
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
  }).index("by_agent", ["agentId"]),

  reasoning: defineTable({
    agentId: v.string(),
    cycle: v.number(),
    strategiesEvaluated: v.number(),
    decision: v.union(v.literal("buy"), v.literal("sell"), v.literal("hold")),
    confidence: v.union(
      v.literal("high"),
      v.literal("low"),
      v.literal("none")
    ),
    source: v.union(v.literal("rules"), v.literal("llm"), v.literal("skip")),
    reason: v.string(),
    snapshotSummary: v.string(),
  }).index("by_agent", ["agentId"]),

  agentStatus: defineTable({
    agentId: v.string(),
    status: v.string(),
    elizaAgentId: v.optional(v.string()),
    sequentialId: v.optional(v.number()),
    name: v.optional(v.string()),
  })
    .index("by_agent", ["agentId"])
    .index("by_status", ["status"]),

  agentConfig: defineTable({
    walletAddress: v.string(),
    vaultId: v.string(),
    displayName: v.string(),
    riskTier: v.string(),
    activeProtocols: v.array(v.string()),
  }).index("by_wallet", ["walletAddress"]),
});
