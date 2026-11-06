/* giopet.eu — animazione della pista, log di avvio, levette tema/lingua, oggetto email per lingua.
   Senza JavaScript la pagina resta completa: testo visibile, pista disegnata, LED acceso. */
(function () {
  'use strict';

  var root = document.documentElement;
  var site = document.getElementById('site');
  var term = document.getElementById('term');
  var pill = document.getElementById('pill');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Testi IT / EN ---------- */

  var MAIL = 'giopet@giopet.eu';
  var GH_PRIVACY = 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement';

  var T = {
    it: {
      title: 'giopet — sito in costruzione',
      light: 'Chiaro', dark: 'Scuro',
      pillLong: 'Sito ', pillShort: 'in costruzione',
      tagline: 'Sito personale di un consulente informatico che lavora come <strong>Solution Architect</strong> e, per passione, si diverte con elettronica e programmazione. Qui trovi il curriculum, le note tecniche e i progetti hobby su ESP32.',
      write: 'Scrivimi',
      subject: '[giopet.eu] Contatto dal sito',
      updated: 'ultimo aggiornamento', date: '06/11/2026',
      themeAria: 'Tema scuro', termAria: 'Log di avvio del sito',
      privacy: 'Nessun cookie di profilazione, nessuna statistica, nessun modulo: tema e lingua restano nel tuo browser. GitHub Pages, che ospita il sito, può registrare gli indirizzi IP per sicurezza (<a href="' + GH_PRIVACY + '" target="_blank" rel="noopener">informativa</a>). Le email ricevute servono solo a rispondere. Titolare: giopet@giopet.eu.',
      log: [
        ['l', '<span class="dim">[0.012]</span> profilo ........... <span class="ok">[ OK ]</span>'],
        ['d', 'chi sono, in breve'],
        ['l', '<span class="dim">[0.230]</span> curriculum ........ <span class="wip">[ WIP ]</span>'],
        ['d', 'esperienze, competenze, formazione'],
        ['l', '<span class="dim">[0.481]</span> progetti/esp32 .... <span class="wip">[ WIP ]</span>'],
        ['d', 'hobby: elettronica e IoT su ESP32'],
        ['l', '<span class="dim">[0.702]</span> note tecniche ..... <span class="wip">[ WIP ]</span>'],
        ['d', 'strumenti, architetture, diagrammi'],
        ['l', '<span class="dim">[0.903]</span> contatti .......... <span class="ok">[ OK ]</span>']
      ]
    },
    en: {
      title: 'giopet — site under construction',
      light: 'Light', dark: 'Dark',
      pillLong: 'Site ', pillShort: 'under construction',
      tagline: "Personal site of an IT consultant who works as a <strong>Solution Architect</strong> and, as a hobby, tinkers with electronics and programming. Here you'll find my résumé, tech notes and ESP32 hobby projects.",
      write: 'Email me',
      subject: '[giopet.eu] Contact from the website',
      updated: 'last updated', date: '2026-11-06',
      themeAria: 'Dark theme', termAria: 'Site boot log',
      privacy: 'No profiling cookies, no analytics, no forms: theme and language stay in your browser. GitHub Pages, which hosts the site, may log IP addresses for security (<a href="' + GH_PRIVACY + '" target="_blank" rel="noopener">privacy statement</a>). Emails I receive are used only to reply. Controller: giopet@giopet.eu.',
      log: [
        ['l', '<span class="dim">[0.012]</span> profile ........... <span class="ok">[ OK ]</span>'],
        ['d', 'who I am, in short'],
        ['l', '<span class="dim">[0.230]</span> resume ............ <span class="wip">[ WIP ]</span>'],
        ['d', 'experience, skills, education'],
        ['l', '<span class="dim">[0.481]</span> projects/esp32 .... <span class="wip">[ WIP ]</span>'],
        ['d', 'hobby: electronics and IoT on ESP32'],
        ['l', '<span class="dim">[0.702]</span> tech notes ........ <span class="wip">[ WIP ]</span>'],
        ['d', 'tools, architectures, diagrams'],
        ['l', '<span class="dim">[0.903]</span> contact ........... <span class="ok">[ OK ]</span>']
      ]
    }
  };

  var lang = 'it';

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function recall(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function renderTerm() {
    var h = '<span class="head"><span>/dev/ttyUSB0 · 115200 baud</span><span>giopet.eu</span></span>';
    h += '<span class="row"><span class="prompt">giopet@esp32:~$</span> ./boot giopet.eu</span>\n';
    T[lang].log.forEach(function (r) {
      h += '<span class="row ' + r[0] + '">' + r[1] + '</span>\n';
    });
    h += '<span class="row"><span class="prompt">giopet@esp32:~$</span> <span class="cursor"></span></span>';
    term.innerHTML = h;
    term.setAttribute('aria-label', T[lang].termAria);
  }

  function applyLang() {
    var t = T[lang];
    root.setAttribute('lang', lang);
    document.title = t.title;
    [].forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      el.textContent = t[el.getAttribute('data-i18n')];
    });
    [].forEach.call(document.querySelectorAll('[data-i18n-html]'), function (el) {
      el.innerHTML = t[el.getAttribute('data-i18n-html')];
    });
    document.getElementById('updDate').textContent = t.date;
    document.getElementById('mailBtn').setAttribute('href',
      'mailto:' + MAIL + '?subject=' + encodeURIComponent(t.subject));
    document.getElementById('themeToggle').setAttribute('aria-label', t.themeAria);
    document.getElementById('langToggle').setAttribute('aria-checked', lang === 'en' ? 'true' : 'false');
    renderTerm();
  }

  /* ---------- Animazione: pista → LED → log di avvio ---------- */

  var timers = [];
  function play() {
    timers.forEach(clearTimeout);
    timers = [];
    var rows = [].slice.call(term.querySelectorAll('.row'));
    site.classList.remove('run');
    pill.classList.remove('on');
    rows.forEach(function (r) { r.classList.remove('shown'); });

    if (reduce) {
      pill.classList.add('on');
      rows.forEach(function (r) { r.classList.add('shown'); });
      return;
    }
    void site.offsetWidth; // riavvia le animazioni CSS
    site.classList.add('run');
    var drawMs = 1750;
    timers.push(setTimeout(function () { pill.classList.add('on'); }, drawMs));
    rows.forEach(function (r, i) {
      timers.push(setTimeout(function () { r.classList.add('shown'); }, drawMs + 350 + i * 170));
    });
  }

  /* ---------- Lingua ---------- */

  var savedLang = recall('giopet-lang');
  if (savedLang === 'it' || savedLang === 'en') lang = savedLang;
  applyLang();
  play();

  document.getElementById('langToggle').addEventListener('click', function () {
    lang = lang === 'it' ? 'en' : 'it';
    store('giopet-lang', lang);
    applyLang();
    play();
  });

  /* ---------- Tema ---------- */

  var themeToggle = document.getElementById('themeToggle');
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

  document.getElementById('topbar').hidden = false;
})();
