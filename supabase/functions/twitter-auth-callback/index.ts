import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID') || ''
const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CLIENT_SECRET') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:8080'

const CALLBACK_URL = `${SUPABASE_URL}/functions/v1/twitter-auth-callback`
const BASIC_AUTH = btoa(`${encodeURIComponent(TWITTER_CLIENT_ID)}:${encodeURIComponent(TWITTER_CLIENT_SECRET)}`)

const FOLLOW_TARGETS = ['r2markets', 'korewapandesu']

function redirect(path: string) {
  const fullUrl = `${APP_URL}${path}`
  console.log(`[REDIRECTING TO]: ${fullUrl}`)
  return Response.redirect(fullUrl, 302)
}

async function getAppBearerToken(): Promise<string | null> {
  const res = await fetch('https://api.twitter.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${BASIC_AUTH}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) return null
  const { access_token } = await res.json()
  return access_token
}

async function resolveUserIds(usernames: string[], appToken: string): Promise<string[]> {
  const res = await fetch(
    `https://api.twitter.com/2/users/by?usernames=${usernames.join(',')}`,
    { headers: { 'Authorization': `Bearer ${appToken}` } },
  )
  if (!res.ok) return []
  const { data } = await res.json()
  return (data ?? []).map((u: { id: string }) => u.id)
}

async function verifyFollows(
  authedUserId: string,
  targetIds: string[],
  userToken: string,
): Promise<boolean> {
  const remaining = new Set(targetIds)
  let paginationToken: string | null = null
  let pages = 0

  while (remaining.size > 0 && pages < 3) {
    const qs = new URLSearchParams({ max_results: '1000' })
    if (paginationToken) qs.set('pagination_token', paginationToken)

    const res = await fetch(
      `https://api.twitter.com/2/users/${authedUserId}/following?${qs}`,
      { headers: { 'Authorization': `Bearer ${userToken}` } },
    )
    if (!res.ok) {
      console.error('follows check failed:', res.status, await res.text())
      return false
    }

    const { data, meta } = await res.json()
    for (const u of (data ?? [])) remaining.delete(u.id)

    paginationToken = meta?.next_token ?? null
    if (!paginationToken) break
    pages++
  }

  return remaining.size === 0
}

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const wallet = url.searchParams.get('state') // state = wallet address
  const tError = url.searchParams.get('error')

  if (tError || !code || !wallet) {
    return redirect('/directives?twitter=error')
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  // Retrieve verifier from DB
  const { data: session, error: sessionError } = await supabase
    .from('oauth_sessions')
    .select('verifier')
    .eq('wallet_address', wallet.toLowerCase())
    .single()

  if (sessionError || !session?.verifier) {
    console.error('session lookup failed:', sessionError?.message)
    return redirect('/directives?twitter=error')
  }

  // Clean up session
  await supabase.from('oauth_sessions').delete().eq('wallet_address', wallet.toLowerCase())

  // Exchange code for user access token (public client / PKCE)
  // Twitter rejects any Authorization header for public client apps —
  // client_id goes in the body, no secret.
  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: CALLBACK_URL,
      code_verifier: session.verifier,
      client_id: TWITTER_CLIENT_ID,
    }),
  })

  if (!tokenRes.ok) {
    console.error('token exchange failed:', await tokenRes.text())
    return redirect('/directives?twitter=error')
  }

  const { access_token: userToken } = await tokenRes.json()

  // Fetch Twitter profile
  const meRes = await fetch(
    'https://api.twitter.com/2/users/me?user.fields=username,name,profile_image_url',
    { headers: { 'Authorization': `Bearer ${userToken}` } },
  )
  if (!meRes.ok) return redirect('/directives?twitter=error')

  const { data: twitterUser } = await meRes.json()
  const avatarUrl = twitterUser.profile_image_url?.replace('_normal', '_400x400') ?? null

  // Verify follows
  let followsVerified = false
  try {
    const appToken = await getAppBearerToken()
    if (appToken) {
      const targetIds = await resolveUserIds(FOLLOW_TARGETS, appToken)
      if (targetIds.length === FOLLOW_TARGETS.length) {
        followsVerified = await verifyFollows(twitterUser.id, targetIds, userToken)
      }
    }
  } catch (e) {
    console.error('follow verification error:', e)
  }

  if (!followsVerified) {
    return redirect(
      `/directives?twitter=unverified&tw_user=${encodeURIComponent(twitterUser.username)}`
    )
  }

  // Save to Supabase
  const { error: dbError } = await supabase
    .from('users')
    .update({
      twitter_username: twitterUser.username,
      twitter_avatar_url: avatarUrl,
      referral_code: twitterUser.username.toLowerCase(),
    })
    .eq('wallet_address', wallet.toLowerCase())

  if (dbError) {
    console.error('db update failed:', dbError.message)
    return redirect('/directives?twitter=error')
  }

  return redirect(
    `/directives?twitter=ok&tw_user=${encodeURIComponent(twitterUser.username)}`
  )
})
