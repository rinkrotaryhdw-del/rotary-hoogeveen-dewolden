// Cloudflare Pages Function: start het inloggen via GitHub voor Decap CMS.
// Nodig (Cloudflare Pages > Settings > Variables and Secrets):
//   GITHUB_CLIENT_ID     – van de GitHub OAuth App
//   GITHUB_CLIENT_SECRET – van de GitHub OAuth App (als "Secret")

export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID) {
    return new Response('GITHUB_CLIENT_ID ontbreekt in de Cloudflare-instellingen.', { status: 500 });
  }

  const url = new URL(request.url);
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  authorize.searchParams.set('scope', 'repo,user');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `decap_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'Cache-Control': 'no-store',
    },
  });
}
