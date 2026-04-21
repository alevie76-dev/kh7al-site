export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send(buildPage('error', { message: 'Missing OAuth code' }));
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

function buildPage(status, content) {
  const payload = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`);
  return `<!DOCTYPE html><html><body><script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${payload}, e.origin);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`;
}
