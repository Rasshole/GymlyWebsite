/**
 * Gymly – simpel login-beskyttelse (sessionStorage).
 * Kræver log ind før adgang til Hjem, Online, Tjek ind, Beskeder, Profil m.m.
 */
(function () {
  var KEY = 'gymly_logged_in';
  var SUPABASE_LOGIN_KEY = 'gymly_supabase_session_seen';

  window.isLoggedIn = function () {
    return !!sessionStorage.getItem(KEY);
  };

  window.setLoggedIn = function () {
    sessionStorage.setItem(KEY, '1');
  };

  window.logout = function () {
    sessionStorage.removeItem(KEY);
    window.location.replace('login.html');
  };

  /** Kaldes på beskyttede sider – omdirigerer til login hvis ikke logget ind */
  window.requireAuth = function () {
    if (!window.isLoggedIn()) {
      window.location.replace('login.html');
      return false;
    }
    return true;
  };

  /** Nuværende bruger (til demo – kan udvides med rigtig auth) */
  window.getCurrentUserId = function () {
    return localStorage.getItem('gymly_user') || 'patrick';
  };

  // Sync lightweight app-login with active Supabase reset/auth session.
  window.syncAuthFromSupabase = async function () {
    if (!window.gymlySupabase || !window.gymlySupabase.getSession) return;
    var session = await window.gymlySupabase.getSession();
    if (session && session.user) {
      sessionStorage.setItem(KEY, '1');
      sessionStorage.setItem(SUPABASE_LOGIN_KEY, '1');
      if (session.user.email) localStorage.setItem('gymly_user_email', session.user.email);
      return;
    }
    if (sessionStorage.getItem(SUPABASE_LOGIN_KEY)) {
      sessionStorage.removeItem(KEY);
      sessionStorage.removeItem(SUPABASE_LOGIN_KEY);
    }
  };

  if (document && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () {
      if (window.syncAuthFromSupabase) window.syncAuthFromSupabase();
    });
  }
})();
