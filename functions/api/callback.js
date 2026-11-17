// Cloudflare Pages Function: rondt het inloggen via GitHub af en geeft
// het toegangstoken door aan Decap CMS (venster dat /admin heeft geopend).

function antwoord(origin, status, inhoud) {
  const bericht = `authorization:github:${status}:${JSON.stringify(inhoud)}`;
  // '<' escapen zodat de waarde het script-blok niet kan afsluiten
  const veilig = (waarde) => JSON.stringify(waarde).replace(/</g, '\\u003c');

  const html = `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><title>Inloggen…</title></head>
<body><p>Bezig met inloggen…</p>
<script>
  (function () {
    var origin = ${veilig(origin)};
    var bericht = ${veilig(bericht)};
    function ontvang(e) {
      if (e.origin !== origin) return;
      window.removeEventListener('message', ontvang);
      window.opener.postMessage(bericht, origin);
    }
    window.addEventListener('message', ontvang);
    window.opener.postMessage('authorizing:github', origin);
  })();
</script></body></html>`;

  return new Response(html, {
    status: status === 'success' ? 200 : 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': 'decap_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookie = request.headers.get('Cookie') || '';
  const opgeslagen = cookie.match(/(?:^|;\s*)decap_oauth_state=([^;]+)/)?.[1];

  if (!code || !state || !opgeslagen || state !== opgeslagen) {
    return antwoord(url.origin, 'error', { message: 'Ongeldige of verlopen inlogpoging. Probeer het opnieuw.' });
  }

  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'decap-cms-oauth',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });
    const data = await res.json();

    if (!data.access_token) {
      return antwoord(url.origin, 'error', { message: data.error_description || 'Inloggen bij GitHub mislukt.' });
    }

    return antwoord(url.origin, 'success', { token: data.access_token, provider: 'github' });
  } catch (err) {
    return antwoord(url.origin, 'error', { message: 'Kon geen verbinding maken met GitHub.' });
  }
}
