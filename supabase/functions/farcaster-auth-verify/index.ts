import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL     = Deno.env.get('SUPABASE_URL') || 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const NEYNAR_API_KEY   = Deno.env.get('NEYNAR_API_KEY') || ''
const APP_URL          = Deno.env.get('APP_URL') || 'http://localhost:3000'

const R2MARKETS_FID = 2864342

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

async function extractFidFromQuickAuth(token: string): Promise<number | null> {
  try {
    const { createClient: createQuickAuthClient } = await import('https://esm.sh/@farcaster/quick-auth')
    const client = createQuickAuthClient()
    const payload = await client.verifyJwt({
      token,
      domain: new URL(APP_URL).host,
    })
    return typeof payload.sub === 'number' ? payload.sub : Number(payload.sub)
  } catch (e) {
    console.error('Quick Auth JWT verification failed:', e)
    return null
  }
}

async function neynarGet(path: string) {
  const res = await fetch(`https://api.neynar.com/v2/farcaster${path}`, {
    headers: { 'accept': 'application/json', 'x-api-key': NEYNAR_API_KEY },
  })
  if (!res.ok) throw new Error(`Neynar ${path} → ${res.status}: ${await res.text()}`)
  return res.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS })
  if (req.method !== 'POST')   return json({ error: 'method not allowed' }, 405)

  let body: {
    type:          'quickauth' | 'siwf'
    token?:        string
    fid?:          number
    referralCode?: string
  }

  try { body = await req.json() }
  catch { return json({ error: 'invalid json' }, 400) }

  if (!body.type) return json({ error: 'missing type' }, 400)

  // --- Step 1: Extract FID ---
  let fid: number | null = null

  if (body.type === 'quickauth') {
    if (!body.token) return json({ error: 'missing token' }, 400)
    fid = await extractFidFromQuickAuth(body.token)
    if (fid === null) return json({ error: 'JWT verification failed' }, 401)
  } else if (body.type === 'siwf') {
    if (!body.fid) return json({ error: 'missing fid' }, 400)
    fid = body.fid
  } else {
    return json({ error: 'invalid type' }, 400)
  }

  // --- Step 2: Fetch profile + check follow in parallel ---
  let profile: { username: string; custody_address: string; verified_addresses?: { eth_addresses?: string[] } }
  let followsR2: boolean

  try {
    const [profileData, followData] = await Promise.all([
      neynarGet(`/user/bulk?fids=${fid}`),
      neynarGet(`/user/bulk?fids=${R2MARKETS_FID}&viewer_fid=${fid}`),
    ])
    profile   = profileData.users?.[0]
    followsR2 = followData.users?.[0]?.viewer_context?.following === true
  } catch (e) {
    console.error('Neynar error:', e)
    return json({ error: 'Neynar API error' }, 502)
  }

  if (!profile) return json({ error: 'Farcaster profile not found' }, 404)

  const username      = profile.username
  const walletAddress = (
    profile.verified_addresses?.eth_addresses?.[0] ?? profile.custody_address
  ).toLowerCase()

  if (!followsR2) {
    return json({ ok: false, unverified: true, fid, username, wallet: walletAddress })
  }

  // --- Step 3: Upsert user ---
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const { error: upsertError } = await supabase
    .from('users')
    .upsert(
      { wallet_address: walletAddress, farcaster_fid: fid, farcaster_username: username, referral_code: username.toLowerCase() },
      { onConflict: 'wallet_address' }
    )

  if (upsertError) {
    console.error('DB upsert failed:', upsertError.message)
    return json({ error: 'database error' }, 500)
  }

  // --- Step 4: Referral linkage ---
  if (body.referralCode) {
    const { data: referrer } = await supabase
      .from('users')
      .select('wallet_address')
      .eq('referral_code', body.referralCode)
      .neq('wallet_address', walletAddress)
      .single()
    if (referrer) {
      await supabase.from('referrals').upsert(
        { referrer_wallet: referrer.wallet_address, referred_wallet: walletAddress },
        { onConflict: 'referred_wallet', ignoreDuplicates: true }
      )
    }
  }

  return json({ ok: true, fid, username, wallet: walletAddress })
})
