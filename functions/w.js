/**
 * Bare /w (no slug) → same unavailable document as invalid slug.
 */
import {
  pickLocale,
  renderDocument,
  GYMLY_WEB_ORIGIN,
} from '../w/share-render.mjs';

const NO_STORE = {
  'Cache-Control':
    'private, no-store, no-cache, max-age=0, must-revalidate',
  'CDN-Cache-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
};

export async function onRequest(context) {
  const acceptLang = context.request.headers.get('Accept-Language') || '';
  const locale = pickLocale(String(acceptLang).split(',')[0] || 'en');
  const html = renderDocument({
    data: {ok: false, error: 'not_found_or_unpublished'},
    slug: 'invalid',
    locale,
    canonicalUrl: `${GYMLY_WEB_ORIGIN}/w/invalid`,
    origin: GYMLY_WEB_ORIGIN,
  });
  return new Response(html, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...NO_STORE,
    },
  });
}
