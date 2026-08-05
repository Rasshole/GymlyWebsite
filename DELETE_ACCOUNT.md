# Kontosletning (Google Play) – opsætningsguide

Offentlig side: **https://gymlyapp.com/delete-account/**

Websiden og formularen er klar. For at gøre e-mail-bekræftelse og faktisk sletning fuldt funktionelle skal Supabase-migration og Edge Functions deployes (se nedenfor).

---

## Flow

1. Bruger udfylder formularen på `/delete-account/` (ingen login).
2. **Edge Function** `request-account-deletion` opretter en pending-anmodning med **hash af token** (rå token sendes kun i mail).
3. Hvis e-mail findes i Supabase Auth, sendes bekræftelsesmail med link til `/delete-account/confirm?token=…`.
4. Bekræftelsessiden kalder **Edge Function** `confirm-account-deletion`, som sletter brugerdata og auth-bruger.
5. UI viser **altid** neutral besked ved indsendelse (afslører ikke om e-mail findes).

---

## Filer i dette repo

| Fil | Formål |
|-----|--------|
| `delete-account/index.html` | Offentlig anmodningsside + formular |
| `delete-account/confirm/index.html` | Token-bekræftelse (noindex) |
| `supabase/migrations/20250622000000_account_deletion_requests.sql` | Database-tabel + `delete_gymly_user_data()` |
| `supabase/functions/request-account-deletion/` | Opret anmodning + send mail |
| `supabase/functions/confirm-account-deletion/` | Bekræft token + slet konto |
| `sitemap.xml` | Indeholder `/delete-account/` |
| `robots.txt` | Tillader crawling (ingen blokering) |

---

## Miljøvariabler (Supabase Edge Functions)

Sæt i **Supabase Dashboard → Edge Functions → Secrets** (eller `supabase secrets set`):

| Variabel | Påkrævet | Beskrivelse |
|----------|----------|-------------|
| `SUPABASE_URL` | Ja (auto) | `https://ykantlsuszpauddasqvz.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Ja (auto) | Service role – **kun server-side** |
| `RESEND_API_KEY` | Ja* | API-nøgle til at sende bekræftelsesmail |
| `DELETE_ACCOUNT_MAIL_FROM` | Nej | Afsender, fx `Gymly <noreply@gymlyapp.com>` |
| `DELETE_ACCOUNT_CONFIRM_URL` | Nej | Standard: `https://gymlyapp.com/delete-account/confirm` |
| `DELETE_ACCOUNT_TOKEN_TTL_HOURS` | Nej | Standard: `24` |
| `DELETE_ACCOUNT_IP_RATE_LIMIT` | Nej | Max anmodninger pr. IP/time. Standard: `5` |
| `DELETE_ACCOUNT_EMAIL_COOLDOWN_HOURS` | Nej | Cooldown pr. e-mail. Standard: `24` |

\* Uden `RESEND_API_KEY` oprettes anmodninger stadig, men mail sendes ikke (tjek logs).

Alternativ til Resend: erstat `sendVerificationEmail()` i `request-account-deletion/index.ts` med jeres SMTP/Supabase mail-udbyder.

---

## Deploy (Supabase CLI)

```bash
# 1. Migration (SQL editor eller CLI)
supabase db push

# 2. Edge Functions (offentlige endpoints – ingen JWT)
supabase functions deploy request-account-deletion --no-verify-jwt
supabase functions deploy confirm-account-deletion --no-verify-jwt

# 3. Secrets
supabase secrets set RESEND_API_KEY=re_xxxx
supabase secrets set DELETE_ACCOUNT_MAIL_FROM="Gymly <noreply@gymlyapp.com>"
```

---

## Udvid sletning af app-data

Rediger `delete_gymly_user_data(p_user_id uuid)` i migrationen med jeres rigtige tabeller (profiler, check-ins, posts osv.), fx:

```sql
delete from public.profiles where id = p_user_id;
delete from public.check_ins where user_id = p_user_id;
-- ...
```

Kør derefter migrationen igen eller opdater funktionen i SQL Editor.

---

## Sikkerhed

- Token gemmes kun som **SHA-256 hash** i databasen.
- Rate limiting på IP og e-mail cooldown.
- Honeypot-felt i formularen (`website`).
- Client-side debounce (1 min) – supplement, ikke erstatning for server rate limit.
- RLS på `account_deletion_requests` uden public policies.
- Neutral API-respons uanset om bruger findes.

---

## Testguide

1. Deploy migration + functions + `RESEND_API_KEY`.
2. Åbn **https://gymlyapp.com/delete-account/** (efter merge til `main`).
3. Indsend med test-e-mail → neutral success-besked.
4. Tjek mail → klik bekræftelseslink → success på `/delete-account/confirm/`.
5. Verificér i Supabase: `account_deletion_requests.status = completed`, bruger fjernet fra Auth.
6. Indsend igen med samme e-mail inden for 24 t → stadig neutral besked, ingen ny mail.
7. Google Play: angiv URL **https://gymlyapp.com/delete-account/** som kontosletnings-URL.
