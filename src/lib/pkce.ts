// PKCE (Proof Key for Code Exchange) helpers for OAuth 2.0 browser flows.
// The verifier stays in the browser (passed via state param); the challenge goes to Twitter.

export function generateVerifier(): string {
  const array = new Uint8Array(40)
  crypto.getRandomValues(array)
  // base64url-encode, unreserved chars only
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export async function generateChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
