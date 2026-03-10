/**
 * Gymly – simpel login-beskyttelse (sessionStorage).
 * Kræver log ind før adgang til Hjem, Online, Tjek ind, Beskeder, Profil m.m.
 */
(function () {
  var KEY = 'gymly_logged_in';

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
})();
