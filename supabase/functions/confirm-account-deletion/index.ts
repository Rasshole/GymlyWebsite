import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import {
  corsHeaders,
  getAdminUserByEmail,
  jsonResponse,
  sha256Hex,
} from '../_shared/accountDeletion.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

type RequestBody = {
  token?: string;
};

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
      return jsonResponse({ error: 'server_error' }, 500);
    }

    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: 'invalid_request' }, 400);
    }

    const rawToken = String(body.token ?? '').trim();
    if (rawToken.length < 32) {
      return jsonResponse({ error: 'invalid_token' }, 400);
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
      return jsonResponse({ error: 'invalid_token' }, 400);
    }

    if (requestRow.status === 'completed') {
      return jsonResponse({ ok: true, already: true });
    }

    if (requestRow.status !== 'pending' || requestRow.expires_at < now) {
      await supabase
        .from('account_deletion_requests')
        .update({ status: 'expired' })
        .eq('id', requestRow.id)
        .eq('status', 'pending');
      return jsonResponse({ error: 'expired' }, 410);
    }

    const emailNormalized = requestRow.email_normalized;
    const user = await getAdminUserByEmail(SUPABASE_URL, SERVICE_ROLE_KEY, emailNormalized);
    const confirmedAt = new Date().toISOString();

    await supabase
      .from('account_deletion_requests')
      .update({ status: 'confirmed', confirmed_at: confirmedAt })
      .eq('id', requestRow.id);

    if (!user) {
      await supabase
        .from('account_deletion_requests')
        .update({ status: 'completed', completed_at: confirmedAt })
        .eq('id', requestRow.id);
      return jsonResponse({ ok: true });
    }

    try {
      await supabase.rpc('delete_gymly_user_data', { p_user_id: user.id });
    } catch (e) {
      console.error('delete_gymly_user_data', e);
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error('deleteUser failed', deleteError.message);
      return jsonResponse({ error: 'server_error' }, 500);
    }

    await supabase
      .from('account_deletion_requests')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', requestRow.id);

    return jsonResponse({ ok: true });
  } catch (e) {
    console.error('confirm-account-deletion unhandled', e);
    return jsonResponse({ error: 'server_error' }, 500);
  }
});
