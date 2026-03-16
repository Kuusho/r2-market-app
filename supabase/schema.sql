-- R2 Markets Supabase Schema Fixes
-- Run this in your Supabase SQL Editor to resolve the Twitter Auth loop

-- 1. Create oauth_sessions table for PKCE flow
CREATE TABLE IF NOT EXISTS public.oauth_sessions (
  wallet_address text PRIMARY KEY,
  verifier text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Ensure the users table has the necessary columns
CREATE TABLE IF NOT EXISTS public.users (
  wallet_address text PRIMARY KEY,
  twitter_username text,
  twitter_avatar_url text,
  discord_username text,
  discord_id text,
  is_holder boolean DEFAULT false,
  referral_code text UNIQUE,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Ensure the referrals table exists
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_wallet text NOT NULL REFERENCES public.users(wallet_address) ON DELETE CASCADE,
  referred_wallet text NOT NULL UNIQUE REFERENCES public.users(wallet_address) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Note: Enable Row Level Security (RLS) if required for production,
-- but the Edge Functions use the SERVICE_ROLE_KEY to bypass RLS.

-- Migration: Farcaster Mini App columns
-- farcaster_fid is bigint (FIDs are large integers) with UNIQUE constraint
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS farcaster_fid      bigint UNIQUE,
  ADD COLUMN IF NOT EXISTS farcaster_username  text;
