# Deploypakke — coach/invite links (Cloudflare Pages)

**Projekt:** `gymlywebsite` · **Domæne:** `gymlyapp.com`  
**Git:** `Rasshole/GymlyWebsite` · **Production branch:** `patti` · Automatic deployments: on  
**Build:** tom kommando · output `.` · root tom · Build system v3  

**Hosting:** Cloudflare Pages (ikke FTP/Apache).

Lokal arbejdsbranch (ikke pushet): `website-links-cf-pages-20261027`.

## Filændringer

| Sti | Formål |
|---|---|
| `functions/w/[slug].js` | SSR `/w/{slug}` — HTML+OG, HTTP 404, no-store, anon RPC |
| `functions/w.js` | Bare `/w` → 404 |
| `functions/invite.js` + `functions/invite/[[path]].js` | Invite-shell med bevaret URL-path + no-store |
| `w/share-render.mjs` | Delt render/fetch (`cache: 'no-store'`, anon) |
| `w/fixtures/qa-push-studio.json` | Lokal Pages-QA fixture (kun når `GYMLY_ALLOW_SHARE_FIXTURES=1`) |
| `invite/index.html` | Invite UI; `center` / `gymId` → `gymly://invite/…?center=` |
| `_routes.json` | Functions kun på `/w`, `/w/*`, `/invite`, `/invite/*` |
| `_headers` | AASA/assetlinks Content-Type; invite no-store (statisk fallback) |
| `_redirects` | Auth callback + well-known + marketing redirects; **ingen** FTP/`200!` |
| `.well-known/apple-app-site-association` | + `/invite`, `/invite/*`, `/w/*`; exclude confirm/auth |
| `.well-known/assetlinks.json` | Play App Signing FP fra Play Console DAL-export (verificeret 2026-10-27) |
| `wrangler.toml` | Lokal `pages_build_output_dir` + compatibility_date |
| `.dev.vars.example` | Env-skabelon til lokal `wrangler pages dev` |
| `DEPLOY-LINKS.md` | Denne pakke |

**Genbrugt uændret:** `index.html`, `assets/`, `confirm/`, `auth/callback/`, `reset-password/`, øvrige marketing-sider.

## Env-navne

| Navn | Production | Formål |
|---|---|---|
| `GYMLY_SUPABASE_URL` | Anbefalet | Supabase URL (kode har hosted default) |
| `GYMLY_SUPABASE_ANON_KEY` | Anbefalet | **Anon** only — aldrig service_role |
| `GYMLY_ALLOW_SHARE_FIXTURES` | **Må ikke sættes** | Kun lokal Pages-QA (`w/fixtures/*.json`) |

Dashboard: Workers & Pages → `gymlywebsite` → Settings → Environment variables (Production).

## Build

Ingen ændring. Tom build command / output `.`. `/functions` kompileres af Pages.

## Deploy (efter eksplicit GO)

1. Review + merge lokal branch → `patti` (PR anbefales).  
2. Automatic deployment fra Git.  
3. Verificér live `/w/…`, `/invite/…`, AASA, assetlinks, `/confirm`.

**Ingen push fra agent uden GO.**

## Rollback

Cloudflare Dashboard → `gymlywebsite` → **Deployments** → tidligere successful production → **Rollback**.

## Lokal test

```bash
cp .dev.vars.example .dev.vars   # GYMLY_ALLOW_SHARE_FIXTURES=1 for fixture SSR
npx wrangler@3.112.0 pages dev . --port 8788 --ip 127.0.0.1
# Node 20: undgå wrangler@4.153+ (kræver Node ≥22)
```

## Play App Signing / assetlinks (2026-10-27)

**Kilde:** Digital Asset Links-JSON kopieret fra Gymly Play Console (`com.gymly`).

| Fingerprint | Rolle | I `assetlinks.json` |
|---|---|---|
| `E0:E3:6A:EC:…:DF:4C` | Play Console DAL-export (nuværende appsignatur) | **Ja** (eneste) |
| `52:5B:1C:D0:…:A3:30` | Tidligere repo-antagelse (“Play Console” i app-repo checkpoint-noter, aldrig re-verificeret) | **Nej** |
| Debug `BE:09:…` / upload `13:5E:…` | Ikke Play App Signing for end-user installs | **Nej** |

**Afklaring af `52:5B:…`:** Findes ikke i den leverede Console DAL-JSON. Ingen dokumentation i denne verifikation for at det er en *tidligere* Play-appsignaturnøgle, der stadig gælder installerede builds. Console-exporten indeholder kun `E0:E3:…`. Derfor fjernet — beholdes ikke “for en sikkerheds skyld”.

Hvis Console under «tidligere appsignaturnøgle» senere viser en anden SHA-256 end `E0:E3:…`, og den nøgle stadig signerer installerede builds, kan den tilføjes som ekstra FP i samme array (stadig uden debug/upload).

JSON valideret (`python3 -m json.tool`); matcher Console-payload 1:1.

## Accepterede gaps

- Hosted published `/w` fixture = 0 indtil rigtigt pilotpas.  
- Instagram crawler-preview først efter production deploy.  
- Play FP-blokering for GO er **løftet** ift. Console-export; øvrige GO-blokeringer (merge til `patti`) uændrede.
