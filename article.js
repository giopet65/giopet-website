/* giopet.eu — pagine degli articoli: levetta del tema e lingua preferita.
   Senza JavaScript l'articolo resta completo; la levetta della lingua è un normale link. */
(function () {
  'use strict';

  var root = document.documentElement;

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  /* ricorda la lingua dell'ultima pagina letta: la home la userà alla prossima visita */
  var lang = root.getAttribute('lang');
  if (lang === 'it' || lang === 'en') store('giopet-lang', lang);

  var themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  function currentTheme() {
    return root.getAttribute('data-theme') || (darkQuery.matches ? 'dark' : 'light');
  }
  function syncTheme() {
    themeToggle.setAttribute('aria-checked', currentTheme() === 'dark' ? 'true' : 'false');
  }
  syncTheme();
  themeToggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('giopet-theme', next);
    syncTheme();
  });
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', syncTheme);

  themeToggle.hidden = false;
})();
