import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import {
  corsHeaders,
  getAdminUserByEmail,
  jsonResponse,
  sha256Hex,
} from '../_shared/accountDeletion.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESULT_BASE_URL =
  Deno.env.get('DELETE_ACCOUNT_RESULT_URL') ?? 'https://gymlyapp.com/delete-account/confirm/';

type ConfirmOutcome = 'success' | 'invalid' | 'expired' | 'server';

type ConfirmResult = {
  outcome: ConfirmOutcome;
  statusCode: number;
  already?: boolean;
};

function resultRedirect(outcome: ConfirmOutcome, extra?: Record<string, string>): Response {
  const url = new URL(RESULT_BASE_URL);
  if (outcome === 'success') {
    url.searchParams.set('result', 'success');
  } else {
    url.searchParams.set('result', 'error');
    url.searchParams.set('reason', outcome);
  }
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      url.searchParams.set(key, value);
    }
  }
  return Response.redirect(url.toString(), 302);
}

async function processConfirmation(rawToken: string): Promise<ConfirmResult> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return { outcome: 'server', statusCode: 500 };
  }

  if (rawToken.length < 32) {
    return { outcome: 'invalid', statusCode: 400 };
  }

  const tokenHash = await sha256Hex(rawToken);
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const now = new Date().toISOString();

  const { data: requestRow, error: fetchError } = await supabase
    .from('account_deletion_requests')
    .select('id, email_normalized, status, expires_at')
    .eq('token_hash', tokenHash)
    .maybeSingle();

  if (fetchError || !requestRow) {
    return { outcome: 'invalid', statusCode: 400 };
  }

  if (requestRow.status === 'completed') {
    return { outcome: 'success', statusCode: 200, already: true };
  }

  if (requestRow.status === 'expired' || requestRow.status === 'cancelled') {
    return { outcome: 'expired', statusCode: 410 };
  }

  const canProcess = requestRow.status === 'pending' || requestRow.status === 'confirmed';
  if (!canProcess) {
    return { outcome: 'invalid', statusCode: 400 };
  }

  if (requestRow.status === 'pending' && requestRow.expires_at < now) {
    await supabase
      .from('account_deletion_requests')
      .update({ status: 'expired' })
      .eq('id', requestRow.id)
      .eq('status', 'pending');
    return { outcome: 'expired', statusCode: 410 };
  }

  const emailNormalized = requestRow.email_normalized;
  const user = await getAdminUserByEmail(SUPABASE_URL, SERVICE_ROLE_KEY, emailNormalized);
  const confirmedAt = new Date().toISOString();

  if (requestRow.status === 'pending') {
    await supabase
      .from('account_deletion_requests')
      .update({ status: 'confirmed', confirmed_at: confirmedAt })
      .eq('id', requestRow.id);
  }

  if (!user) {
    await supabase
      .from('account_deletion_requests')
      .update({ status: 'completed', completed_at: confirmedAt })
      .eq('id', requestRow.id);
    return { outcome: 'success', statusCode: 200 };
  }

  try {
    await supabase.rpc('delete_gymly_user_data', { p_user_id: user.id });
  } catch (e) {
    console.error('delete_gymly_user_data', e);
  }

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error('deleteUser failed', deleteError.message);
    return { outcome: 'server', statusCode: 500 };
  }

  await supabase
    .from('account_deletion_requests')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', requestRow.id);

  return { outcome: 'success', statusCode: 200 };
}

function extractToken(req: Request): string | null {
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get('token');
  if (fromQuery) return fromQuery.trim();
  return null;
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' },
      });
    }

    let rawToken = extractToken(req);

    if (req.method === 'POST') {
      try {
        const body = await req.json();
        rawToken = String(body?.token ?? rawToken ?? '').trim();
      } catch {
        if (!rawToken) {
          return jsonResponse({ error: 'invalid_request' }, 400);
        }
      }
    } else if (req.method !== 'GET') {
      return jsonResponse({ error: 'method_not_allowed' }, 405);
    }

    if (!rawToken) {
      if (req.method === 'GET') return resultRedirect('invalid');
      return jsonResponse({ error: 'invalid_token' }, 400);
    }

    const result = await processConfirmation(rawToken);

    if (req.method === 'GET') {
      return resultRedirect(result.outcome);
    }

    if (result.outcome === 'success') {
      return jsonResponse({ ok: true, already: result.already ?? false }, result.statusCode);
    }

    return jsonResponse({ error: result.outcome }, result.statusCode);
  } catch (e) {
    console.error('confirm-account-deletion unhandled', e);
    if (req.method === 'GET') return resultRedirect('server');
    return jsonResponse({ error: 'server_error' }, 500);
  }
});
