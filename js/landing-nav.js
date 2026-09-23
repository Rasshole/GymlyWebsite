(function () {
  var header = document.getElementById('landingHeader');
  if (!header) return;

  var toggle = header.querySelector('.lp-nav-toggle');
  var nav = header.querySelector('.lp-nav');
  if (!toggle || !nav) return;

  function closeNav() {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 900px)').matches) closeNav();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 16);
  }, { passive: true });
  header.classList.toggle('scrolled', window.scrollY > 16);
})();
