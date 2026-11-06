/* ThB.Ho page translations.
   Pages write every phrase twice: <span lang="th">…</span><span lang="en">…</span>.
   Thai shows the th spans; every other language shows the en spans, and for
   zh / ru / ko / ja / es this script swaps each en span's text for the entry
   in i18n/<lang>.js (keyed by the English HTML). Missing entries stay English. */
(function () {
  var LANGS = ['th', 'en', 'zh', 'ru', 'ko', 'ja', 'es'];
  var dicts = {}, cur = 'th', base = '';
  try { base = document.currentScript.src.replace(/[^\/]*$/, ''); } catch (e) {}

  window.THBHO_LANGS = LANGS;
  window.THBHO_I18N_ADD = function (l, d) { dicts[l] = d; };

  function load(l, cb) {
    if (l === 'th' || l === 'en' || dicts[l]) { cb(); return; }
    var s = document.createElement('script');
    s.src = base + 'i18n/' + l + '.js?v=17';
    s.onload = cb; s.onerror = cb;
    document.head.appendChild(s);
  }

  function tr(el) {
    var k = el.getAttribute('data-en');
    if (k === null) { k = el.innerHTML.trim(); el.setAttribute('data-en', k); }
    if (el.getAttribute('data-i18n') === cur) return;
    el.setAttribute('data-i18n', cur);
    var d = dicts[cur], v = (d && d[k]) || k;
    if (el.innerHTML !== v) el.innerHTML = v;
  }
  function applyIn(root) {
    if (cur === 'th') return;
    if (root.nodeType !== 1) return;
    if (root.matches && root.matches('span[lang="en"]')) tr(root);
    root.querySelectorAll && root.querySelectorAll('span[lang="en"]').forEach(tr);
  }

  var obs = new MutationObserver(function (ms) {
    if (cur === 'th') return;
    ms.forEach(function (m) { m.addedNodes.forEach(applyIn); });
  });

  window.THBHO_I18N = {
    set: function (l, cb) {
      if (LANGS.indexOf(l) < 0) l = 'en';
      cur = l;
      load(l, function () {
        if (document.body) {
          applyIn(document.body);
          obs.observe(document.body, { childList: true, subtree: true });
        }
        if (cb) cb();
      });
    },
    pick: function (q, saved) {
      if (LANGS.indexOf(q) >= 0) return q;
      if (LANGS.indexOf(saved) >= 0) return saved;
      var n = (navigator.language || 'th').slice(0, 2).toLowerCase();
      return LANGS.indexOf(n) >= 0 ? n : 'en';
    }
  };
})();
