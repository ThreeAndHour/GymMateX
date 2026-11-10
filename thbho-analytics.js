/* ThB.Ho visitor analytics (Google Analytics 4).
   Set GA_ID to your Measurement ID (G-XXXXXXXXXX). While it is empty, this file does nothing.
   - Consent first: cookies stay off until the visitor taps "Accept" (Google Consent Mode v2).
     Before that, GA only receives cookieless, anonymous pings, so totals are still counted.
   - Never runs inside an embedded demo (?embed=1), so a page view is not counted twice.
   - Extra events: video_play, persona_open, apply_click, language.
   Used by the ThB.Ho pages, O2OEventsVR, Fit & Fantasy (FitFantasy.html) and thbho.com/AIGymmateXFactory.html. */
(function () {
  var GA_ID = 'G-9Y2YDL6KT9';
  if (!GA_ID || /[?&]embed=1/.test(location.search)) return;

  var KEY = 'thbho-consent', saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', {
    analytics_storage: saved === 'yes' ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied'
  });
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  function ev(name, params) { try { gtag('event', name, params || {}); } catch (e) {} }
  function title(el) {
    var c = el.closest('article,figure,.card,.xh-card,section');
    var b = c && c.querySelector('b, h3, h2');
    return (el.getAttribute('aria-label') || (b && b.textContent) || '').trim().slice(0, 90);
  }

  // Video plays (X clips, hero video, background clips are muted autoplay and are skipped)
  var played = new WeakSet();
  document.addEventListener('play', function (e) {
    var v = e.target;
    if (!(v instanceof HTMLVideoElement) || v.muted || played.has(v)) return;   // muted = background / hover loops
    played.add(v);
    ev('video_play', { video_title: title(v), page: location.pathname.split('/').pop() });
  }, true);

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-pv],[data-p].popen,.pv-open,a[href*="docs.google.com/forms"],a[href="#apply"],.ytp,.usp article');
    if (!el) return;
    if (el.matches('[data-pv],.pv-open,.popen')) ev('persona_open', { persona: el.dataset.pv || el.dataset.p || '' });
    else if (el.matches('a[href*="docs.google.com/forms"],a[href="#apply"]')) ev('apply_click', { where: el.closest('section,header,nav') ? (el.closest('section,header,nav').id || el.closest('section,header,nav').tagName) : '' });
    else ev('video_play', { video_title: title(el), page: location.pathname.split('/').pop() });
  }, true);

  var lang = document.getElementById('lang');
  if (lang) lang.addEventListener('change', function () { ev('language', { language: lang.value }); });
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-lang]'); if (b) ev('language', { language: b.getAttribute('data-lang') }); }, true);

  // Small consent bar, shown once until the visitor chooses
  if (saved === 'yes' || saved === 'no') return;
  function bar() {
    var d = document.createElement('div');
    d.className = 'thbho-consent';
    d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Cookies');
    d.innerHTML =
      '<p><span lang="th">เราใช้คุกกี้เพื่อนับจำนวนผู้เข้าชมแบบไม่ระบุตัวตน ช่วยให้เราปรับปรุงหน้าเว็บ</span>' +
      '<span lang="en">We use cookies to count visitors anonymously and improve this page.</span></p>' +
      '<div><button type="button" data-c="yes"><span lang="th">ยอมรับ</span><span lang="en">Accept</span></button>' +
      '<button type="button" data-c="no"><span lang="th">ไม่ยอมรับ</span><span lang="en">Decline</span></button></div>';
    var css = document.createElement('style');
    css.textContent = '.thbho-consent{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:720px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:12px;background:rgba(22,19,27,.96);border:1px solid rgba(255,255,255,.12);color:#e9e6ee;font:14px/1.5 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.5)}' +
      '.thbho-consent span[lang]{display:none}html[lang^=th] .thbho-consent span[lang=th],html:not([lang^=th]) .thbho-consent span[lang=en]{display:inline}' +
      '.thbho-consent p{margin:0;flex:1 1 280px}.thbho-consent div{display:flex;gap:8px}' +
      '.thbho-consent button{cursor:pointer;font:600 13px system-ui,sans-serif;border-radius:8px;padding:8px 14px;border:1px solid rgba(255,255,255,.2);background:transparent;color:#e9e6ee}' +
      '.thbho-consent button[data-c=yes]{background:#66FCF1;border-color:#66FCF1;color:#06201E}';
    document.head.appendChild(css);
    d.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var yes = b.dataset.c === 'yes';
      try { localStorage.setItem(KEY, yes ? 'yes' : 'no'); } catch (e2) {}
      gtag('consent', 'update', { analytics_storage: yes ? 'granted' : 'denied' });
      d.remove();
    });
    document.body.appendChild(d);
  }
  if (document.body) bar(); else document.addEventListener('DOMContentLoaded', bar);
})();
