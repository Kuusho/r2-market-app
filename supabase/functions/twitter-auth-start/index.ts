import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID') || ''
const SUPABASE_URL      = Deno.env.get('SUPABASE_URL') || 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const APP_URL           = Deno.env.get('APP_URL') || 'http://localhost:8080'

const CALLBACK_URL = `${SUPABASE_URL}/functions/v1/twitter-auth-callback`

function base64url(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

Deno.serve(async (req) => {
  const url    = new URL(req.url)
  const wallet = url.searchParams.get('wallet')

  if (!wallet) {
    return Response.redirect(`${APP_URL}/directives?twitter=error`, 302)
  }

  // Generate PKCE verifier + challenge server-side
  const verifierBytes = crypto.getRandomValues(new Uint8Array(40))
  const verifier      = base64url(verifierBytes.buffer)
  const challengeHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  const challenge     = base64url(challengeHash)

  // Persist verifier keyed to wallet
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  const { error } = await supabase
    .from('oauth_sessions')
    .upsert({ wallet_address: wallet.toLowerCase(), verifier }, { onConflict: 'wallet_address' })

  if (error) {
    console.error('session store failed:', error.message)
    return Response.redirect(`${APP_URL}/directives?twitter=error`, 302)
  }

  // State is just the wallet address — simple, no encoding needed
  const params = new URLSearchParams({
    response_type:         'code',
    client_id:             TWITTER_CLIENT_ID,
    redirect_uri:          CALLBACK_URL,
    scope:                 'tweet.read users.read',
    state:                 wallet.toLowerCase(),
    code_challenge:        challenge,
    code_challenge_method: 'S256',
  })

  return Response.redirect(
    `https://twitter.com/i/oauth2/authorize?${params}`,
    302
  )
})
