/**
 * Serve invite shell while keeping /invite/{code} in the URL (for client JS).
 * Static _redirects proxy to index.html can loop under Pages trailing-slash rules.
 * @see https://developers.cloudflare.com/pages/functions/api-reference/
 */

const NO_STORE = {
  'Cache-Control':
    'private, no-store, no-cache, max-age=0, must-revalidate',
  'CDN-Cache-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function onRequest(context) {
  const {request, env} = context;
  const url = new URL(request.url);
  const assetUrl = new URL('/invite/index.html', url.origin);
  const res = await env.ASSETS.fetch(assetUrl);
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(NO_STORE)) {
    headers.set(k, v);
  }
  headers.set('Content-Type', 'text/html; charset=utf-8');
  return new Response(res.body, {status: 200, headers});
}
