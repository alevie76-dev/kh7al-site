import { computeHmac } from './_utils.js';

export default async function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    return res.status(500).send('OAUTH_CLIENT_ID is not configured');
  }

  const state = await generateState();

  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&scope=repo%2Cuser` +
    `&state=${encodeURIComponent(state)}`;
  res.redirect(302, authUrl);
}

async function generateState() {
  const nonce = crypto.randomUUID().replace(/-/g, '');
  const timestamp = Date.now().toString();
  const signature = await computeHmac(process.env.OAUTH_CLIENT_SECRET, `${nonce}.${timestamp}`);
  return `${nonce}.${timestamp}.${signature}`;
}
