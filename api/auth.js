export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send('OAUTH_CLIENT_ID is not configured');
  }
  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&scope=repo%2Cuser`;
  res.redirect(302, authUrl);
}
