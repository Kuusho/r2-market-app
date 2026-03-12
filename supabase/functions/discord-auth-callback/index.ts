import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const DISCORD_CLIENT_ID     = Deno.env.get('DISCORD_CLIENT_ID') || ''
const DISCORD_CLIENT_SECRET = Deno.env.get('DISCORD_CLIENT_SECRET') || ''
const SUPABASE_URL          = Deno.env.get('SUPABASE_URL') || 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY      = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const APP_URL               = Deno.env.get('APP_URL') || 'http://localhost:8080'

const CALLBACK_URL = `${SUPABASE_URL}/functions/v1/discord-auth-callback`

function redirect(path: string) {
  return Response.redirect(`${APP_URL}${path}`, 302)
}

Deno.serve(async (req) => {
  const url    = new URL(req.url)
  const code   = url.searchParams.get('code')
  const wallet = url.searchParams.get('state') // state = wallet address
  const dError = url.searchParams.get('error')

  if (dError || !code || !wallet) {
    return redirect('/directives?discord=error')
  }

  // Exchange code for access token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type:    'authorization_code',
      code,
      redirect_uri:  CALLBACK_URL,
    }),
  })

  if (!tokenRes.ok) {
    console.error('discord token exchange failed:', await tokenRes.text())
    return redirect('/directives?discord=error')
  }

  const { access_token: userToken } = await tokenRes.json()

  // Fetch Discord profile
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { 'Authorization': `Bearer ${userToken}` },
  })

  if (!userRes.ok) {
    console.error('discord /users/@me failed:', userRes.status)
    return redirect('/directives?discord=error')
  }

  const discordUser = await userRes.json()
  // global_name is the display name (newer Discord); username is the unique handle
  const displayName = discordUser.global_name || discordUser.username

  // Save to Supabase
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
  const { error: dbError } = await supabase
    .from('users')
    .update({ discord_username: displayName })
    .eq('wallet_address', wallet.toLowerCase())

  if (dbError) {
    console.error('db update failed:', dbError.message)
    return redirect('/directives?discord=error')
  }

  return redirect(
    `/directives?discord=ok&dc_user=${encodeURIComponent(displayName)}`
  )
})
