(function () {
  var SUPABASE_URL =
    window.GYMLY_SUPABASE_URL || localStorage.getItem('gymly_supabase_url') || '';
  var SUPABASE_ANON_KEY =
    window.GYMLY_SUPABASE_ANON_KEY || localStorage.getItem('gymly_supabase_anon_key') || '';

  function hasConfig() {
    return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && !!(window.supabase && window.supabase.createClient);
  }

  function getClient() {
    if (!hasConfig()) return null;
    if (window.__gymlySupabaseClient) return window.__gymlySupabaseClient;
    window.__gymlySupabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
    return window.__gymlySupabaseClient;
  }

  async function getSession() {
    var client = getClient();
    if (!client) return null;
    try {
      var result = await client.auth.getSession();
      return result && result.data ? result.data.session : null;
    } catch (e) {
      return null;
    }
  }

  async function sendPasswordReset(email, redirectTo) {
    var client = getClient();
    if (!client || !email) return { ok: false };
    try {
      var result = await client.auth.resetPasswordForEmail(email, { redirectTo: redirectTo });
      return { ok: !result.error };
    } catch (e) {
      return { ok: false };
    }
  }

  async function updatePassword(password) {
    var client = getClient();
    if (!client || !password) return { ok: false };
    try {
      var result = await client.auth.updateUser({ password: password });
      return { ok: !result.error };
    } catch (e) {
      return { ok: false };
    }
  }

  window.gymlySupabase = {
    hasConfig: hasConfig,
    getClient: getClient,
    getSession: getSession,
    sendPasswordReset: sendPasswordReset,
    updatePassword: updatePassword
  };
})();
