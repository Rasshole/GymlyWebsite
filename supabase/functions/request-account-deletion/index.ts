import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import {
  corsHeaders,
  getAdminUserByEmail,
  isValidEmail,
  jsonResponse,
  neutralOk,
  normalizeEmail,
  sha256Hex,
  tokenFromRequest,
} from '../_shared/accountDeletion.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
const MAIL_FROM = Deno.env.get('DELETE_ACCOUNT_MAIL_FROM') ?? 'Gymly <noreply@gymlyapp.com>';
const CONFIRM_BASE_URL =
  Deno.env.get('DELETE_ACCOUNT_CONFIRM_URL') ??
  `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/confirm-account-deletion`;
const TOKEN_TTL_HOURS = Number(Deno.env.get('DELETE_ACCOUNT_TOKEN_TTL_HOURS') ?? '24');
const IP_RATE_LIMIT = Number(Deno.env.get('DELETE_ACCOUNT_IP_RATE_LIMIT') ?? '5');
const EMAIL_COOLDOWN_HOURS = Number(Deno.env.get('DELETE_ACCOUNT_EMAIL_COOLDOWN_HOURS') ?? '24');

type RequestBody = {
  email?: string;
  message?: string | null;
  locale?: string;
};

function clientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

async function exceededRateLimits(
  supabase: ReturnType<typeof createClient>,
  emailNormalized: string,
  ipHash: string,
): Promise<boolean> {
  const ipSince = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: ipCount } = await supabase
    .from('account_deletion_requests')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', ipSince);

  if ((ipCount ?? 0) >= IP_RATE_LIMIT) {
    return true;
  }

  const emailSince = new Date(Date.now() - EMAIL_COOLDOWN_HOURS * 60 * 60 * 1000).toISOString();
  const { count: emailCount } = await supabase
    .from('account_deletion_requests')
    .select('id', { count: 'exact', head: true })
    .eq('email_normalized', emailNormalized)
    .gte('created_at', emailSince)
    .in('status', ['pending', 'confirmed']);

  return (emailCount ?? 0) >= 1;
}

async function sendVerificationEmail(
  to: string,
  confirmUrl: string,
  locale: string,
): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY missing — verification email not sent');
    return false;
  }

  const isDa = locale.startsWith('da');
  const subject = isDa
    ? 'Bekræft sletning af din Gymly-konto'
    : 'Confirm deletion of your Gymly account';
  const html = isDa
    ? `<p>Du har anmodet om at slette din Gymly-konto.</p>
       <p><a href="${confirmUrl}">Bekræft sletning</a></p>
       <p>Linket udløber om ${TOKEN_TTL_HOURS} timer. Hvis du ikke har anmodet om dette, kan du ignorere denne mail.</p>`
    : `<p>You requested deletion of your Gymly account.</p>
       <p><a href="${confirmUrl}">Confirm deletion</a></p>
       <p>This link expires in ${TOKEN_TTL_HOURS} hours. If you did not request this, you can ignore this email.</p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', await res.text());
    return false;
  }

  return true;
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return jsonResponse({ error: 'method_not_allowed' }, 405);
    }

    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return neutralOk();
    }

    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return neutralOk();
    }

    const emailRaw = String(body.email ?? '').trim();
    const message = body.message ? String(body.message).slice(0, 2000) : null;
    const locale = String(body.locale ?? 'da').slice(0, 10);

    if (!isValidEmail(emailRaw)) {
      return neutralOk();
    }

    const emailNormalized = normalizeEmail(emailRaw);
    const ipHash = await sha256Hex(clientIp(req));
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    if (await exceededRateLimits(supabase, emailNormalized, ipHash)) {
      return neutralOk();
    }

    const user = await getAdminUserByEmail(SUPABASE_URL, SERVICE_ROLE_KEY, emailNormalized);
    if (!user) {
      return neutralOk();
    }

    const rawToken = tokenFromRequest();
    const tokenHash = await sha256Hex(rawToken);
    const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase.from('account_deletion_requests').insert({
      email: emailRaw,
      email_normalized: emailNormalized,
      message,
      token_hash: tokenHash,
      status: 'pending',
      locale,
      ip_hash: ipHash,
      user_agent: req.headers.get('user-agent')?.slice(0, 512) ?? null,
      expires_at: expiresAt,
    });

    if (insertError) {
      console.error('insert failed', insertError.message);
      return neutralOk();
    }

    const confirmUrl = `${CONFIRM_BASE_URL}?token=${encodeURIComponent(rawToken)}`;
    await sendVerificationEmail(emailRaw, confirmUrl, locale);

    return neutralOk();
  } catch (e) {
    console.error('request-account-deletion unhandled', e);
    return neutralOk();
  }
});
