import { computeHmac, timingSafeEqual } from './_utils.js';

const ADMIN_ORIGIN = 'https://kh7al.site';

export default async function handler(req, res) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).send(buildPage('error', { message: 'Missing OAuth code' }));
  }

  if (!state || !(await verifyState(state))) {
    return res.status(400).send(buildPage('error', { message: 'Invalid or expired OAuth state' }));
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      return res.send(buildPage('error', { message: data.error_description || 'GitHub OAuth failed' }));
    }

    res.send(buildPage('success', { token: data.access_token, provider: 'github' }));
  } catch {
    res.send(buildPage('error', { message: 'Token exchange failed' }));
  }
}

async function verifyState(state) {
  const secret = process.env.OAUTH_CLIENT_SECRET;
  if (!secret) return false;

  const parts = state.split('.');
  if (parts.length !== 3) return false;

  const [nonce, timestamp, signature] = parts;

  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Date.now() - ts > 10 * 60 * 1000) return false;

  const expected = await computeHmac(secret, `${nonce}.${timestamp}`);
  return timingSafeEqual(expected, signature);
}

function buildPage(status, content) {
  const payload = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  const origin = JSON.stringify(ADMIN_ORIGIN);
  return `<!DOCTYPE html><html><body><script>
(function () {
  var adminOrigin = ${origin};
  function receiveMessage(e) {
    if (e.origin !== adminOrigin) return;
    window.opener.postMessage(${payload}, adminOrigin);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', adminOrigin);
})();
</script></body></html>`;
}
