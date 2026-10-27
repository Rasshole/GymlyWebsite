/**
 * Shared HTML helpers for /w/{slug} (Node SSR + browser client).
 * Only published payload from get_published_coach_share — never drafts.
 */

export const GYMLY_APP_STORE_URL =
  'https://apps.apple.com/dk/app/gymly-staerkere-sammen/id6757790972';

/** Unverified Play listing — do not invent a URL. */
export const GYMLY_PLAY_STORE_URL = null;

export const GYMLY_WEB_ORIGIN = 'https://gymlyapp.com';
export const GYMLY_OG_IMAGE_PATH = '/assets/logo.png';

const SLUG_RE = /^[a-z0-9][a-z0-9-]{2,63}$/;

export function normalizeSlug(raw) {
  if (!raw) return null;
  const slug = String(raw).trim().toLowerCase().replace(/^\/+/, '');
  return SLUG_RE.test(slug) ? slug : null;
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function pickLocale(langHint) {
  const raw = String(langHint || '').toLowerCase();
  return raw.startsWith('da') ? 'da' : 'en';
}

const I18N = {
  da: {
    brandEyebrow: 'Delt på Gymly',
    openApp: 'Åbn i Gymly',
    installHint:
      'Hvis appen ikke er installeret, bliver du på denne side. Hent Gymly, opret konto, og åbn derefter dette link igen.',
    noDeferred:
      'Installationen fører dig ikke automatisk tilbage hertil — brug linket igen efter installation.',
    appStore: 'App Store',
    sessionKind: 'Træningspas',
    programKind: 'Program',
    weeks: weeks => `${weeks} uger`,
    daysCount: n => `${n} træningsdage`,
    exercises: 'Øvelser',
    setLine: (n, w, r) => {
      const parts = [`Sæt ${n}`];
      if (w != null && w !== '') parts.push(`${w} kg`);
      if (r) parts.push(r);
      return parts.join(' · ');
    },
    repsRange: (min, max) => {
      if (min != null && max != null && min !== max) return `${min}–${max} reps`;
      if (max != null) return `${max} reps`;
      if (min != null) return `${min} reps`;
      return null;
    },
    unavailableTitle: 'Ikke tilgængelig',
    unavailableBody:
      'Linket er ugyldigt, slettet eller afpubliceret. Bed coachen om et nyt link.',
    loading: 'Henter træning…',
    byCoach: name => `af ${name}`,
    dayLabel: (week, day, title) =>
      title
        ? `Uge ${week} · Dag ${day + 1}: ${title}`
        : `Uge ${week} · Dag ${day + 1}`,
    metaUnavailableTitle: 'Gymly',
    metaUnavailableDesc: 'Dette indhold er ikke tilgængeligt.',
  },
  en: {
    brandEyebrow: 'Shared on Gymly',
    openApp: 'Open in Gymly',
    installHint:
      'If the app is not installed, this page stays in the browser. Install Gymly, create an account, then open this link again.',
    noDeferred:
      'Install does not automatically continue here — reopen the link after installing.',
    appStore: 'App Store',
    sessionKind: 'Workout',
    programKind: 'Program',
    weeks: weeks => `${weeks} weeks`,
    daysCount: n => `${n} training days`,
    exercises: 'Exercises',
    setLine: (n, w, r) => {
      const parts = [`Set ${n}`];
      if (w != null && w !== '') parts.push(`${w} kg`);
      if (r) parts.push(r);
      return parts.join(' · ');
    },
    repsRange: (min, max) => {
      if (min != null && max != null && min !== max) return `${min}–${max} reps`;
      if (max != null) return `${max} reps`;
      if (min != null) return `${min} reps`;
      return null;
    },
    unavailableTitle: 'Unavailable',
    unavailableBody:
      'This link is invalid, deleted, or unpublished. Ask the coach for a new link.',
    loading: 'Loading workout…',
    byCoach: name => `by ${name}`,
    dayLabel: (week, day, title) =>
      title
        ? `Week ${week} · Day ${day + 1}: ${title}`
        : `Week ${week} · Day ${day + 1}`,
    metaUnavailableTitle: 'Gymly',
    metaUnavailableDesc: 'This content is not available.',
  },
};

export function t(locale) {
  return I18N[locale] || I18N.en;
}

export function coachDisplayName(coach) {
  if (!coach || typeof coach !== 'object') return 'Coach';
  const name = String(coach.displayName || '').trim();
  if (name) return name;
  const user = String(coach.username || '').trim();
  return user || 'Coach';
}

export function summarizePayload(data, locale) {
  const L = t(locale);
  if (!data || data.ok !== true) {
    return {
      available: false,
      title: L.unavailableTitle,
      description: L.unavailableBody,
      coachName: null,
      kind: null,
    };
  }
  if (data.kind === 'session') {
    const session = data.session || {};
    const title = String(session.title || 'Gymly').trim() || 'Gymly';
    const desc =
      String(session.description || '').trim() ||
      String((data.coach && data.coach.description) || '').trim() ||
      title;
    return {
      available: true,
      title,
      description: desc.slice(0, 200),
      coachName: coachDisplayName(data.coach),
      kind: 'session',
    };
  }
  if (data.kind === 'program') {
    const program = data.program || {};
    const title = String(program.title || 'Gymly').trim() || 'Gymly';
    const desc =
      String(program.description || '').trim() ||
      String((data.coach && data.coach.description) || '').trim() ||
      title;
    return {
      available: true,
      title,
      description: desc.slice(0, 200),
      coachName: coachDisplayName(data.coach),
      kind: 'program',
    };
  }
  return {
    available: false,
    title: L.unavailableTitle,
    description: L.unavailableBody,
    coachName: null,
    kind: null,
  };
}

function formatSetsHtml(sets, L) {
  if (!Array.isArray(sets) || !sets.length) return '';
  const items = sets
    .map(s => {
      const n = s.setNumber ?? '';
      const w = s.targetWeightKg;
      const r = L.repsRange(s.targetRepsMin, s.targetRepsMax);
      return `<li>${escapeHtml(L.setLine(n, w, r))}</li>`;
    })
    .join('');
  return `<ul class="share-sets">${items}</ul>`;
}

function formatExercisesHtml(exercises, L) {
  if (!Array.isArray(exercises) || !exercises.length) {
    return `<p class="share-muted">${escapeHtml(L.exercises)} —</p>`;
  }
  return exercises
    .map(ex => {
      const name = escapeHtml(ex.exerciseName || '—');
      return `<div class="share-ex"><h3>${name}</h3>${formatSetsHtml(
        ex.sets,
        L,
      )}</div>`;
    })
    .join('');
}

export function buildBodyInnerHtml(data, locale, slug) {
  const L = t(locale);
  const deepLink = `gymly://w/${slug}`;

  if (!data || data.ok !== true) {
    return `
      <p class="share-eyebrow">${escapeHtml(L.brandEyebrow)}</p>
      <h1 class="share-title">${escapeHtml(L.unavailableTitle)}</h1>
      <p class="share-lead">${escapeHtml(L.unavailableBody)}</p>
      <a class="share-btn" id="open-app" href="${escapeHtml(deepLink)}">${escapeHtml(
        L.openApp,
      )}</a>
      <p class="share-hint">${escapeHtml(L.installHint)}</p>
      <p class="share-hint">${escapeHtml(L.noDeferred)}</p>
      ${storeLinksHtml(L)}
    `;
  }

  const summary = summarizePayload(data, locale);
  const coachLine = summary.coachName
    ? `<p class="share-coach">${escapeHtml(L.byCoach(summary.coachName))}</p>`
    : '';
  const coachBio =
    data.coach && data.coach.description
      ? `<p class="share-bio">${escapeHtml(data.coach.description)}</p>`
      : '';

  let kindBadge = '';
  let detailHtml = '';

  if (data.kind === 'session') {
    kindBadge = `<p class="share-eyebrow">${escapeHtml(L.sessionKind)}</p>`;
    const exercises = (data.snapshot && data.snapshot.exercises) || [];
    detailHtml = `<section class="share-block"><h2>${escapeHtml(
      L.exercises,
    )}</h2>${formatExercisesHtml(exercises, L)}</section>`;
  } else if (data.kind === 'program') {
    const program = data.program || {};
    const days = Array.isArray(data.days) ? data.days : [];
    const weeks = program.weeks_count ?? '—';
    kindBadge = `<p class="share-eyebrow">${escapeHtml(L.programKind)}</p>`;
    detailHtml = `
      <p class="share-meta">${escapeHtml(L.weeks(weeks))} · ${escapeHtml(
        L.daysCount(days.length),
      )}</p>
      <section class="share-block"><h2>${escapeHtml(L.daysCount(days.length))}</h2>
      ${days
        .map(d => {
          const label = L.dayLabel(
            d.weekNumber ?? 1,
            d.dayIndex ?? 0,
            d.title || d.sessionTitle || '',
          );
          const snapEx =
            d.snapshot && Array.isArray(d.snapshot.exercises)
              ? d.snapshot.exercises
              : [];
          return `<div class="share-day"><h3>${escapeHtml(
            label,
          )}</h3>${formatExercisesHtml(snapEx, L)}</div>`;
        })
        .join('')}
      </section>`;
  }

  const desc = String(
    (data.session && data.session.description) ||
      (data.program && data.program.description) ||
      '',
  ).trim();

  return `
    ${kindBadge}
    <h1 class="share-title">${escapeHtml(summary.title)}</h1>
    ${coachLine}
    ${desc ? `<p class="share-lead">${escapeHtml(desc)}</p>` : ''}
    ${coachBio}
    ${detailHtml}
    <a class="share-btn" id="open-app" href="${escapeHtml(deepLink)}">${escapeHtml(
      L.openApp,
    )}</a>
    <p class="share-hint">${escapeHtml(L.installHint)}</p>
    <p class="share-hint">${escapeHtml(L.noDeferred)}</p>
    ${storeLinksHtml(L)}
  `;
}

function storeLinksHtml(L) {
  const links = [];
  links.push(
    `<a class="share-store" href="${escapeHtml(
      GYMLY_APP_STORE_URL,
    )}" rel="noopener noreferrer">${escapeHtml(L.appStore)}</a>`,
  );
  // GYMLY_PLAY_STORE_URL intentionally omitted until verified.
  return `<div class="share-stores">${links.join('')}</div>`;
}

export function sharedCss() {
  return `
    *,*::before,*::after{box-sizing:border-box}
    :root{
      --gymly-purple:#976fff;--gymly-purple-deep:#7b4bff;
      --gymly-gradient:linear-gradient(135deg,#9b73ff 0%,#976fff 40%,#7b4bff 100%);
      --text-strong:#0c0c10;--text-body:rgba(18,18,24,.62);--text-soft:rgba(18,18,24,.45);
      --font:-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text',system-ui,'Segoe UI',sans-serif;
      --radius:clamp(26px,5vw,32px);--ease:cubic-bezier(.22,1,.36,1);
    }
    html{-webkit-text-size-adjust:100%}
    html,body{margin:0;padding:0;min-height:100%;min-height:100dvh}
    body{
      font-family:var(--font);color:var(--text-strong);
      -webkit-font-smoothing:antialiased;
      padding:max(20px,env(safe-area-inset-top)) 20px max(24px,env(safe-area-inset-bottom));
      background:linear-gradient(180deg,#fffeff 0%,#f3f1fd 42%,#ece8fb 78%,#e8e4fa 100%);
    }
    .share-shell{position:relative;z-index:1;display:flex;justify-content:center;min-height:calc(100dvh - 48px)}
    .share-card{
      width:min(100%,520px);margin:auto;padding:clamp(1.5rem,4vw,2.25rem);
      border-radius:var(--radius);background:rgba(255,255,255,.82);
      backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
      box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 24px 48px -20px rgba(80,40,160,.28);
    }
    .share-logo{display:block;margin:0 auto 1rem;width:72px;height:72px;object-fit:contain}
    .share-eyebrow{margin:0 0 .35rem;font-size:.75rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--gymly-purple-deep);text-align:center}
    .share-title{margin:0 0 .5rem;font-size:clamp(1.5rem,5vw,1.85rem);font-weight:700;letter-spacing:-.03em;line-height:1.15;text-align:center}
    .share-coach,.share-lead,.share-bio,.share-meta,.share-hint,.share-muted{color:var(--text-body);line-height:1.5}
    .share-coach{margin:0 0 .75rem;text-align:center;font-weight:600;color:var(--gymly-purple-deep)}
    .share-lead,.share-bio{margin:0 0 1rem;text-align:center}
    .share-meta{margin:0 0 1rem;text-align:center;font-size:.9rem}
    .share-block{margin:1.25rem 0;text-align:left}
    .share-block h2{margin:0 0 .75rem;font-size:1rem}
    .share-ex,.share-day{margin:0 0 1rem;padding:.75rem .9rem;border-radius:14px;background:rgba(151,111,255,.08)}
    .share-ex h3,.share-day h3{margin:0 0 .4rem;font-size:.95rem}
    .share-sets{margin:0;padding-left:1.1rem;color:var(--text-body);font-size:.875rem}
    .share-btn{
      display:flex;align-items:center;justify-content:center;width:100%;min-height:52px;margin-top:1.25rem;
      border:none;border-radius:16px;background:var(--gymly-gradient);color:#fff;font:inherit;font-size:1.05rem;font-weight:600;
      text-decoration:none;cursor:pointer;
      box-shadow:0 1px 0 rgba(255,255,255,.25) inset,0 12px 28px -6px rgba(123,75,255,.45);
      transition:transform .2s var(--ease);
    }
    .share-btn:active{transform:scale(.98)}
    .share-hint{margin:1rem 0 0;font-size:.8rem;color:var(--text-soft);text-align:center}
    .share-stores{margin-top:1.1rem;display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center}
    .share-store{font-size:.8125rem;color:var(--gymly-purple-deep);text-decoration:underline;text-underline-offset:3px}
  `;
}

/**
 * Full document for SSR. When unavailable, metadata must not echo private titles.
 */
export function renderDocument({
  data,
  slug,
  locale,
  canonicalUrl,
  origin = GYMLY_WEB_ORIGIN,
}) {
  const L = t(locale);
  const summary = summarizePayload(data, locale);
  const available = summary.available === true;
  const pageTitle = available
    ? `${summary.title} · Gymly`
    : `${L.metaUnavailableTitle}`;
  const pageDesc = available ? summary.description : L.metaUnavailableDesc;
  const ogImage = `${origin}${GYMLY_OG_IMAGE_PATH}`;
  const robots = available ? 'index,follow' : 'noindex,nofollow';
  const lang = locale === 'da' ? 'da' : 'en';
  const bodyInner = buildBodyInnerHtml(data, locale, slug);

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="robots" content="${robots}" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDesc)}" />
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Gymly" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(pageDesc)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:locale" content="${locale === 'da' ? 'da_DK' : 'en_US'}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <style>${sharedCss()}</style>
</head>
<body>
  <main class="share-shell">
    <article class="share-card" id="share-root">
      <img class="share-logo" src="/assets/logo.png" alt="Gymly" width="72" height="72" decoding="async" />
      ${bodyInner}
    </article>
  </main>
  <script>
    (function () {
      var btn = document.getElementById('open-app');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = btn.getAttribute('href');
      });
    })();
  </script>
</body>
</html>`;
}

export async function fetchPublishedShare(supabaseUrl, anonKey, slug) {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/get_published_coach_share`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({p_slug: slug}),
  });
  if (!res.ok) {
    return {ok: false, error: 'not_found_or_unpublished'};
  }
  const data = await res.json();
  if (!data || typeof data !== 'object' || data.ok !== true) {
    return {ok: false, error: 'not_found_or_unpublished'};
  }
  return data;
}
