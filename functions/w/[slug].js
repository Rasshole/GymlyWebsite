/**
 * Cloudflare Pages Function: https://gymlyapp.com/w/{slug}
 * SSR HTML + OG in first response. Anon RPC only — never service_role.
 * Headers set here (_headers does not apply to Functions responses).
 * @see https://developers.cloudflare.com/pages/functions/routing/
 */

import {
  normalizeSlug,
  pickLocale,
  fetchPublishedShare,
  renderDocument,
  GYMLY_WEB_ORIGIN,
} from '../../w/share-render.mjs';

const PROD_SUPABASE_URL = 'https://ykantlsuszpauddasqvz.supabase.co';
/** Public anon key only (same role as browser clients). */
const PROD_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrYW50bHN1c3pwYXVkZGFzcXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzI4MzEsImV4cCI6MjA4ODQ0ODgzMX0.vungVzubJCR68aSSusjtmoGNQgLaIOkdQN8ipo9bt-I';

const NO_STORE = {
  'Cache-Control':
    'private, no-store, no-cache, max-age=0, must-revalidate',
  'CDN-Cache-Control': 'no-store',
  Pragma: 'no-cache',
  Expires: '0',
};

function htmlResponse(html, status) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      ...NO_STORE,
    },
  });
}

async function loadFixture(env, request, slug) {
  if (!env || env.GYMLY_ALLOW_SHARE_FIXTURES !== '1' || !env.ASSETS) {
    return null;
  }
  try {
    const origin = new URL(request.url).origin;
    const res = await env.ASSETS.fetch(
      new URL(`/w/fixtures/${slug}.json`, origin),
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data && data.ok === true) return data;
  } catch {
    /* fall through to RPC */
  }
  return null;
}

export async function onRequest(context) {
  const {request, env, params} = context;
  const slug = normalizeSlug(params.slug);
  const acceptLang = request.headers.get('Accept-Language') || '';
  const locale = pickLocale(String(acceptLang).split(',')[0] || 'en');

  if (!slug) {
    const html = renderDocument({
      data: {ok: false, error: 'not_found_or_unpublished'},
      slug: 'invalid',
      locale,
      canonicalUrl: `${GYMLY_WEB_ORIGIN}/w/invalid`,
      origin: GYMLY_WEB_ORIGIN,
    });
    return htmlResponse(html, 404);
  }

  let data = await loadFixture(env, request, slug);

  if (!data) {
    const supabaseUrl =
      (env && env.GYMLY_SUPABASE_URL) || PROD_SUPABASE_URL;
    const anonKey =
      (env && env.GYMLY_SUPABASE_ANON_KEY) || PROD_ANON_KEY;
    try {
      data = await fetchPublishedShare(supabaseUrl, anonKey, slug);
    } catch {
      data = {ok: false, error: 'not_found_or_unpublished'};
    }
  }

  const available = data && data.ok === true;
  const html = renderDocument({
    data,
    slug,
    locale,
    canonicalUrl: `${GYMLY_WEB_ORIGIN}/w/${slug}`,
    origin: GYMLY_WEB_ORIGIN,
  });

  return htmlResponse(html, available ? 200 : 404);
}
