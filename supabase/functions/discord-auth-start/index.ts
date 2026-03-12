const DISCORD_CLIENT_ID = Deno.env.get('DISCORD_CLIENT_ID') || ''
const SUPABASE_URL      = Deno.env.get('SUPABASE_URL') || 'http://127.0.0.1:54321'
const APP_URL           = Deno.env.get('APP_URL') || 'http://localhost:8080'

const CALLBACK_URL = `${SUPABASE_URL}/functions/v1/discord-auth-callback`

Deno.serve(async (req) => {
  const url    = new URL(req.url)
  const wallet = url.searchParams.get('wallet')

  if (!wallet) {
    return Response.redirect(`${APP_URL}/directives?discord=error`, 302)
  }

  const params = new URLSearchParams({
    client_id:     DISCORD_CLIENT_ID,
    redirect_uri:  CALLBACK_URL,
    response_type: 'code',
    scope:         'identify',
    state:         wallet.toLowerCase(),
  })

  return Response.redirect(
    `https://discord.com/oauth2/authorize?${params}`,
    302,
  )
})
