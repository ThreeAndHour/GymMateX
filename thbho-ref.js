/* ThB.Ho guest registry, site side ("จำแขกได้").
   Remembers in this browser only (localStorage, nothing is sent anywhere by itself):
     - where the visitor first came from: ?src= / utm_source, ?clip= / utm_content, ?c= / utm_campaign,
       or the referring site (x.com, youtube, instagram, tiktok, facebook, line, google ...)
     - which clips they opened (any element with data-x, up to 6)
     - their match-quiz result (THBHO_REF.quiz({...}) from ThBHoCreatorMatch.html)
   When they apply, the collab form opens with one optional question pre-filled with a short
   reference line, so the reply lands in the responses Sheet next to their answers.
   The "Guests" tab made by tools/update-collab-form.gs splits that line into columns.

   Tracked link to post on X / IG / TikTok:
     https://creators.thbho.com/ThBHoCreators.html?src=x&clip=<x post id>
     https://creators.thbho.com/ThBHoPortfolio.html?src=ig&c=nov-launch
*/
(function () {
  var FORM = 'https://docs.google.com/forms/d/1H0qL2E3TmePwci-rgiNAyc3WZBDWpoo7kXJE0oXMA2Y/viewform';
  // Prefill id of the form question "รหัสอ้างอิง · Reference". Empty = do not prefill.
  var ENTRY = '';
  var K = 'thbho-ref';

  function load() { try { return JSON.parse(localStorage.getItem(K)) || {}; } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} }
  function clean(v, n) { return String(v || '').replace(/[^\w.\-\/@]/g, '').slice(0, n || 40); }
  function day() { return new Date().toISOString().slice(0, 10); }
  function page() { return (location.pathname.split('/').pop() || 'index').replace(/^ThBHo|\.html$/g, '').toLowerCase() || 'creators'; }

  var HOSTS = [[/(^|\.)(x|twitter)\.com$|^t\.co$/, 'x'], [/youtube\.com$|youtu\.be$/, 'youtube'], [/instagram\.com$/, 'ig'],
    [/tiktok\.com$/, 'tiktok'], [/facebook\.com$|fb\.me$|messenger\.com$/, 'facebook'], [/line\.me$|line\.naver/, 'line'],
    [/google\./, 'google'], [/bing\.com$|duckduckgo\.com$|yahoo\./, 'search'], [/thbho\.com$/, 'thbho']];
  function fromReferrer() {
    var h = ''; try { h = new URL(document.referrer).hostname.replace(/^www\.|^m\./, ''); } catch (e) { return ''; }
    if (!h || h === location.hostname) return '';
    for (var i = 0; i < HOSTS.length; i++) if (HOSTS[i][0].test(h)) return HOSTS[i][1];
    return clean(h, 30);
  }

  var d = load(), q = new URLSearchParams(location.search);
  var src = clean(q.get('src') || q.get('utm_source'), 20).toLowerCase() || fromReferrer();
  var clip = clean(q.get('clip') || q.get('utm_content'), 30);
  var camp = clean(q.get('c') || q.get('utm_campaign'), 30);
  var inEmbed = q.get('embed') === '1';
  if (!inEmbed) {
    if (!d.first) d.first = { src: src || 'direct', clip: clip, c: camp, page: page(), day: day() };
    if (src || clip || camp) d.last = { src: src || (d.last && d.last.src) || '', clip: clip, c: camp, day: day() };
    var seenSession = false; try { seenSession = !!sessionStorage.getItem(K + '-s'); sessionStorage.setItem(K + '-s', '1'); } catch (e) {}
    d.visits = (d.visits || 0) + (seenSession ? 0 : 1);
    save(d);
  }

  // Clips they opened: any [data-x] button / card that gets clicked
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-x]'); if (!el) return;
    var id = clean(el.getAttribute('data-x'), 30); if (!id) return;
    var r = load(); r.seen = (r.seen || []).filter(function (x) { return x !== id; });
    r.seen.unshift(id); r.seen = r.seen.slice(0, 6); save(r);
  }, true);

  function line() {
    var r = load(), f = r.first || {}, l = r.last || {}, z = r.quiz, out = [];
    out.push('src:' + (f.src || 'direct'));
    if (f.clip) out.push('clip:' + f.clip);
    if (f.c) out.push('c:' + f.c);
    if (l.src && (l.src !== f.src || l.clip !== f.clip)) out.push('last:' + l.src + (l.clip ? '/' + l.clip : ''));
    if (z) out.push('quiz:' + z.top + (z.second ? '>' + z.second : '') + '; lvl:' + (z.level || '-') + (z.type ? '; type:' + z.type : '') + (z.goal ? '; goal:' + z.goal : ''));
    if (r.seen && r.seen.length) out.push('seen:' + r.seen.join(','));
    out.push('lang:' + (document.documentElement.lang || ''));
    out.push('visits:' + (r.visits || 1));
    out.push('first:' + (f.day || '') + ' ' + (f.page || ''));
    return out.join('; ');
  }
  function formUrl(embedded) {
    var u = FORM + '?' + (embedded ? 'embedded=true&' : '') + 'usp=pp_url';
    return ENTRY ? u + '&entry.' + ENTRY + '=' + encodeURIComponent(line()) : (embedded ? FORM + '?embedded=true' : FORM);
  }
  // The collab-form iframe is written as <iframe data-form ...> without src: it loads when the
  // visitor gets near it, so the reference line already includes the quiz they just took.
  function wire() {
    document.querySelectorAll('iframe[data-form]').forEach(function (f) {
      var go = function () { f.src = formUrl(true); };
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { go(); io.disconnect(); } }, { rootMargin: '800px' });
        io.observe(f);
      } else go();
    });
    if (!ENTRY) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="docs.google.com/forms/d/1H0qL2E3TmePwci"]');
      if (a) a.href = formUrl(false);
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();

  // Let GA4 group visitors by where they first came from (only if analytics was accepted and loaded)
  try { if (window.gtag && d.first) gtag('set', 'user_properties', { first_src: d.first.src }); } catch (e) {}

  window.THBHO_REF = {
    line: line,
    formUrl: formUrl,
    quiz: function (z) { var r = load(); r.quiz = z; save(r); },
    data: load
  };
})();
