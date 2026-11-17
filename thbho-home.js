/* ThB.Ho "your website is your business's home" infographic, Creators & Venues edition.
   Concept from https://thbho.com/DigitalHome.html (Hybrid AI Agent Network core); only the examples change here.
   Markup: <div class="thome" data-home></div>  (renders the house + legend; 7 languages, follows <html lang>)
   Colours come from the page's own :root variables (--bg --s1 --s2 --line --ink --ink2 --ink3 --accent --accent2 --rose).
   Room states match the live site: lit = in daily use, dashed = built and waiting. Update ROOMS when a room opens. */
(function () {
  var LANGS = ['th', 'en', 'zh', 'ru', 'ko', 'ja', 'es'];
  function L(a) { var o = {}; LANGS.forEach(function (k, i) { o[k] = a[i]; }); return o; }
  var T = {
    aria: L(['ภาพตัดบ้าน ThB.Ho เทียบแต่ละส่วนกับเว็บไซต์', 'A ThB.Ho house in cross-section, each part matched to a part of the website', 'ThB.Ho 房屋剖面图：每个部分对应网站的一部分', 'Дом ThB.Ho в разрезе: каждая часть — это часть сайта', 'ThB.Ho 집 단면도: 각 부분이 웹사이트의 한 부분', 'ThB.Ho の家の断面図：各部分がサイトの一部', 'Casa ThB.Ho en corte: cada parte es una parte del sitio web']),
    roof: L(['ไฟ น้ำ อินเทอร์เน็ต', 'Power, water, internet', '水、电、网络', 'Свет, вода, интернет', '전기, 수도, 인터넷', '電気・水道・ネット', 'Luz, agua, internet']),
    roofEq: L(['= 7 ภาษา ตัวเล่นคลิป สถิติ และบอตอัปเดตยอดวิว', '= 7 languages, players, stats and the daily view bot', '= 7 种语言、播放器、统计和每日播放量更新', '= 7 языков, плееры, статистика и бот просмотров', '= 7개 언어, 플레이어, 통계, 조회수 봇', '= 7言語・プレーヤー・統計・再生数ボット', '= 7 idiomas, reproductores, estadísticas y bot de vistas']),
    found: L(['ฐานราก = ข้อมูลผลงานชุดเดียว ทุกหน้าใช้ร่วมกัน', 'Foundation = one set of work data that every page shares', '地基 = 所有页面共用的一套作品数据', 'Фундамент = один набор данных, общий для всех страниц', '기초 = 모든 페이지가 함께 쓰는 하나의 작품 데이터', '基礎 = すべてのページが共有する一つの作品データ', 'Cimientos = un solo conjunto de datos para todas las páginas']),
    land: L(['ที่ดินในชื่อเรา = โดเมน ผลงาน และรายชื่อแขกเป็นของเราเอง', 'Land in our name = our own domain, work and guest list', '我们名下的土地 = 自有域名、作品与访客名单', 'Земля на наше имя = свой домен, работы и список гостей', '우리 명의의 땅 = 자체 도메인, 작품, 손님 명단', '自分名義の土地 = 自前のドメイン・作品・ゲスト名簿', 'Terreno a nuestro nombre = dominio, obras y lista de invitados propios']),
    garden: L(['สวนและลาน', 'Garden and terrace', '花园与露台', 'Сад и терраса', '정원과 테라스', '庭とテラス', 'Jardín y terraza']),
    gardenEq: L(['= สถานที่พาร์ทเนอร์', '= partner venues', '= 合作场地', '= площадки-партнёры', '= 파트너 장소', '= パートナー会場', '= locales asociados']),
    gazebo: L(['ศาลา (รอไว้)', 'Pavilion (waiting)', '凉亭（预留）', 'Беседка (ждёт)', '정자 (대기)', 'あずまや（待機）', 'Pabellón (en espera)']),
    gazeboEq: L(['= อีเวนต์ O2O · VR', '= O2O · VR events', '= O2O · VR 活动', '= события O2O · VR', '= O2O · VR 이벤트', '= O2O・VR イベント', '= eventos O2O · VR']),
    host: L(['เจ้าบ้านที่ดี', 'The good host', '好主人', 'Хороший хозяин', '좋은 집주인', 'よいホスト', 'El buen anfitrión']),
    hostEq: L(['= AI และการตลาด', '= AI and marketing', '= AI 与营销', '= ИИ и маркетинг', '= AI와 마케팅', '= AI とマーケティング', '= IA y marketing']),
    host2: L(['ชวนครีเอเตอร์และสถานที่ที่ใช่', 'invites the right creators and venues', '邀请合适的创作者和场地', 'зовёт нужных авторов и площадки', '맞는 크리에이터와 장소를 초대', '合うクリエイターと会場を招く', 'invita a creadores y locales afines']),
    ask: L(['แขกถาม AI หาคู่ collab', 'Guests ask AI for a collab', '访客向 AI 寻找合作', 'Гости ищут коллаб через ИИ', '손님이 AI에게 collab 문의', 'ゲストが AI にコラボを相談', 'Piden a la IA una colaboración']),
    answer: L(['AI แนะนำบ้านเราเป็นคำตอบ', 'AI answers with our house', 'AI 推荐我们的家', 'ИИ отвечает нашим домом', 'AI가 우리 집을 추천', 'AI が私たちの家を答える', 'La IA responde con nuestra casa']),
    street: L(['ถนนตลาด', 'Market street', '市场街', 'Рыночная улица', '시장 거리', '市場通り', 'Calle del mercado']),
    lit: L(['ใช้ทุกวันแล้ว', 'In daily use', '每天在用', 'Используется каждый день', '매일 사용 중', '毎日使用中', 'En uso diario']),
    dim: L(['สร้างรอไว้ เปิดเมื่อพร้อม', 'Built and waiting; opens when ready', '已建好，准备好就开放', 'Построено и ждёт своего часа', '지어 두고 준비되면 오픈', '建てて待機中、準備ができたら開く', 'Construido y en espera; abre cuando esté listo']),
    wire: L(['ระบบหลังบ้านที่เดินไว้ถึงทุกห้อง', 'Back-office systems wired to every room', '通到每个房间的后台系统', 'Системы, проведённые в каждую комнату', '모든 방에 연결된 백오피스 시스템', '全部屋に配線済みのバックオフィス', 'Sistemas internos en cada cuarto']),
    hint: L(['เลื่อนซ้ายขวาเพื่อดูทั้งภาพ', 'Swipe sideways to see the whole picture', '左右滑动查看全图', 'Листайте вбок, чтобы увидеть всё', '좌우로 밀어 전체 보기', '左右にスワイプして全体を表示', 'Desliza de lado para ver todo'])
  };
  /* [x, y, w, h, lit, name, eq, icon] (house coordinates, before the 50px shift) */
  var ROOMS = [
    [258, 238, 200, 132, 1, L(['ห้องนอน', 'Bedroom', '卧室', 'Спальня', '침실', '寝室', 'Dormitorio']), L(['= คลังผลงานและยอดวิว', '= clip library and views', '= 作品库与播放量', '= клипы и просмотры', '= 작품 보관함과 조회수', '= 作品ライブラリと再生数', '= clips y vistas']), 'bed'],
    [462, 238, 130, 132, 1, L(['ห้องน้ำ', 'Bathroom', '浴室', 'Ванная', '욕실', '浴室', 'Baño']), L(['= ฟอร์มสมัคร', '= application forms', '= 申请表', '= формы заявок', '= 신청서', '= 応募フォーム', '= formularios']), 'bath'],
    [596, 238, 206, 132, 0, L(['ห้องว่าง', 'Spare room', '空房间', 'Свободная комната', '빈 방', '空き部屋', 'Cuarto libre']), L(['= คุยกับ persona ด้วย AI', '= chat with a persona (AI)', '= 与 persona 的 AI 聊天', '= чат с персоной (ИИ)', '= 페르소나 AI 채팅', '= ペルソナと AI チャット', '= chat con una persona (IA)']), 'box'],
    [258, 388, 180, 132, 1, L(['ห้องครัว', 'Kitchen', '厨房', 'Кухня', '주방', 'キッチン', 'Cocina']), L(['= หน้า Portfolio', '= the Portfolio page', '= 作品集页面', '= портфолио', '= 포트폴리오', '= ポートフォリオ', '= el Portfolio']), 'pot'],
    [442, 388, 190, 132, 1, L(['ห้องนั่งเล่น', 'Living room', '客厅', 'Гостиная', '거실', 'リビング', 'Sala']), L(['= แบบทดสอบจับคู่ persona', '= persona match quiz', '= persona 匹配测验', '= тест подбора персоны', '= 페르소나 매칭 퀴즈', '= ペルソナ診断', '= test de afinidad']), 'sofa'],
    [636, 388, 166, 132, 1, L(['ห้องรับแขก', 'Guest room', '客房', 'Для гостей', '손님방', '客間', 'Cuarto de huéspedes']), L(['= ทะเบียนแขก', '= guest registry', '= 访客名册', '= реестр гостей', '= 손님 명부', '= ゲスト名簿', '= registro de invitados']), 'table']
  ];
  var ICON = {
    bed: function (x, y) { return '<rect class="ic" x="' + (x - 34) + '" y="' + (y - 4) + '" width="68" height="16" rx="4"/><rect class="icf" x="' + (x - 30) + '" y="' + (y - 14) + '" width="22" height="10" rx="3"/><path class="ic" d="M' + (x - 34) + ' ' + (y + 12) + 'v8M' + (x + 34) + ' ' + (y + 12) + 'v8"/>'; },
    bath: function (x, y) { return '<path class="ic" d="M' + (x - 16) + ' ' + (y + 20) + 'V' + (y - 10) + 'a10 10 0 0 1 20 0M' + (x - 4) + ' ' + (y - 8) + 'h16M' + x + ' ' + y + 'v6M' + (x + 6) + ' ' + (y + 2) + 'v6M' + (x + 12) + ' ' + y + 'v6"/>'; },
    box: function (x, y) { return '<rect class="ic dash" x="' + (x - 30) + '" y="' + (y - 12) + '" width="60" height="30" rx="4"/><path class="ic" d="M' + (x - 8) + ' ' + (y + 3) + 'h16M' + x + ' ' + (y - 5) + 'v16"/>'; },
    pot: function (x, y) { return '<path class="ic" d="M' + (x - 40) + ' ' + (y + 20) + 'h80"/><rect class="ic" x="' + (x - 18) + '" y="' + (y - 2) + '" width="36" height="20" rx="4"/><path class="ic" d="M' + (x - 24) + ' ' + (y + 4) + 'h6M' + (x + 18) + ' ' + (y + 4) + 'h6M' + (x - 8) + ' ' + (y - 10) + 'q4 -5 0 -10M' + (x + 6) + ' ' + (y - 10) + 'q4 -5 0 -10"/>'; },
    sofa: function (x, y) { return '<rect class="ic" x="' + (x - 34) + '" y="' + (y - 6) + '" width="68" height="18" rx="5"/><rect class="ic" x="' + (x - 42) + '" y="' + (y + 2) + '" width="84" height="16" rx="5"/>'; },
    table: function (x, y) { return '<path class="ic" d="M' + (x - 18) + ' ' + y + 'h36M' + x + ' ' + y + 'v18M' + (x - 8) + ' ' + (y + 18) + 'h16M' + (x - 34) + ' ' + (y - 8) + 'v26M' + (x - 34) + ' ' + (y + 6) + 'h10v12M' + (x + 34) + ' ' + (y - 8) + 'v26M' + (x + 34) + ' ' + (y + 6) + 'h-10v12"/>'; }
  };
  var lang = 'th';
  function t(o) { return o[lang] || o.en; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  var WIDE = /[぀-ヿ㐀-鿿가-힯＀-￯]/, MARK = /[ัิ-ฺ็-๎]/;
  function width(s, fs) { var w = 0; for (var i = 0; i < s.length; i++) { var c = s[i]; w += WIDE.test(c) ? fs : MARK.test(c) ? 0 : fs * 0.56; } return w; }
  function wrap(s, max, fs) {
    var parts = / /.test(s) ? s.split(' ') : s.split(''), sep = / /.test(s) ? ' ' : '', lines = [], cur = '';
    parts.forEach(function (p) { var n = cur ? cur + sep + p : p; if (cur && width(n, fs) > max) { lines.push(cur); cur = p; } else cur = n; });
    if (cur) lines.push(cur); return lines;
  }
  function txt(x, y, s, cls, max, fs, lh) {
    var ls = max ? wrap(s, max, fs) : [s], h = '';
    ls.forEach(function (l, i) { h += '<text class="' + cls + '" x="' + x + '" y="' + (y + i * (lh || fs * 1.3)) + '" text-anchor="middle">' + esc(l) + '</text>'; });
    return h;
  }
  /* one line, shrunk to fit max (never below min) */
  function fit(x, y, s, cls, max, fs, min) {
    var f = fs; while (f > (min || 9) && width(s, f) > max) f -= 0.5;
    return '<text class="' + cls + '" x="' + x + '" y="' + y + '" text-anchor="middle" style="font-size:' + f + 'px">' + esc(s) + '</text>';
  }
  /* several wrapped blocks stacked downward from top (or upward so the last line sits at bottom) */
  function stack(x, y, blocks, up) {
    var lines = [];
    blocks.forEach(function (b) { wrap(b[0], b[2], b[3]).forEach(function (l) { lines.push([l, b[1], b[3]]); }); });
    var lh = function (fs) { return fs * 1.32; }, total = 0;
    lines.forEach(function (l) { total += lh(l[2]); });
    var cy = up ? y - total + lh(lines[0][2]) : y, h = '';
    lines.forEach(function (l, i) {
      if (i) cy += lh(l[2]);
      h += '<text class="' + l[1] + '" x="' + x + '" y="' + cy.toFixed(1) + '" text-anchor="middle" style="font-size:' + l[2] + 'px">' + esc(l[0]) + '</text>';
    });
    return h;
  }
  function person(x, cls, s) { var y = 520; return '<g class="' + cls + '"><circle cx="' + x + '" cy="' + (y - 58 * s) + '" r="' + (9 * s) + '"/><path d="M' + x + ' ' + (y - 48 * s) + 'V' + (y - 18 * s) + 'M' + x + ' ' + (y - 18 * s) + 'l' + (-8 * s) + ' ' + (18 * s) + 'M' + x + ' ' + (y - 18 * s) + 'l' + (8 * s) + ' ' + (18 * s) + 'M' + (x - 12 * s) + ' ' + (y - 36 * s) + 'h' + (24 * s) + '" stroke-width="' + (3.2 * s) + '"/></g>'; }

  var STYLE = '<style>' +
    '.hb-sky{fill:var(--s1,#111626)}.hb-land{fill:#1b1712}.hb-landtop{fill:#6b5338;opacity:.6}' +
    '.hb-found{fill:var(--line,#283250)}.hb-shell{fill:var(--bg,#0A0D16);stroke:var(--ink2,#AEB4C6);stroke-width:3}' +
    '.hb-roof{fill:rgba(224,185,107,.07);stroke:var(--accent,#E0B96B);stroke-width:3;stroke-linejoin:round}' +
    '.hb-lit{fill:rgba(224,185,107,.15);stroke:var(--accent,#E0B96B);stroke-width:2}' +
    '.hb-dim{fill:var(--s2,#1A2136);stroke:var(--ink3,#77809A);stroke-width:2;stroke-dasharray:6 5}' +
    '.hb-wire{fill:none;stroke:var(--accent2,#7FD6D0);stroke-width:3;stroke-dasharray:7 5;stroke-linecap:round}' +
    '.hb-tick{stroke:var(--accent2,#7FD6D0);stroke-width:3;stroke-linecap:round}' +
    '.hb-n{font:600 15px var(--body,system-ui),sans-serif;fill:var(--ink,#EEF0F6)}' +
    '.hb-s{font:400 12.5px var(--body,system-ui),sans-serif;fill:var(--ink2,#AEB4C6)}' +
    '.hb-sl{font:400 12.5px var(--body,system-ui),sans-serif;fill:var(--accent,#E0B96B)}' +
    '.hb-b{font:600 14px var(--body,system-ui),sans-serif;fill:var(--ink,#EEF0F6)}' +
    '.hb-land-t{font:600 14.5px var(--body,system-ui),sans-serif;fill:#d9c39f}' +
    '.lit .ic{fill:none;stroke:var(--accent,#E0B96B);stroke-width:2;stroke-linecap:round}.lit .icf{fill:var(--accent,#E0B96B)}' +
    '.dim .ic{fill:none;stroke:var(--ink3,#77809A);stroke-width:2;stroke-linecap:round}.dim .icf{fill:var(--ink3,#77809A)}.ic.dash{stroke-dasharray:5 4}' +
    '.hb-host{fill:var(--accent2,#7FD6D0);stroke:var(--accent2,#7FD6D0);fill-opacity:1}.hb-host path{fill:none;stroke-linecap:round}' +
    '.hb-guest{fill:var(--rose,#C8466F);stroke:var(--rose,#C8466F)}.hb-guest path{fill:none;stroke-linecap:round}' +
    '.hb-guest2{fill:var(--accent,#E0B96B);stroke:var(--accent,#E0B96B)}.hb-guest2 path{fill:none;stroke-linecap:round}' +
    '.hb-door{fill:var(--accent,#E0B96B)}.hb-path{stroke:#6b5338;stroke-width:10;stroke-linecap:round;opacity:.8}' +
    '.hb-bub{fill:var(--s2,#1A2136);stroke:var(--accent,#E0B96B);stroke-width:2;stroke-linejoin:round}' +
    '.hb-pill{fill:var(--accent,#E0B96B)}.hb-pill-t{font:700 11px var(--mono,monospace);fill:#16120A}' +
    '.hb-sign{fill:var(--s2,#1A2136);stroke:var(--ink2,#AEB4C6);stroke-width:2}.hb-post{stroke:var(--ink2,#AEB4C6);stroke-width:3}' +
    '.hb-lead{stroke:var(--ink3,#77809A);stroke-width:1.5;stroke-dasharray:3 4}' +
    '.hb-sun{fill:var(--accent,#E0B96B)}.hb-sunr{stroke:var(--accent,#E0B96B);stroke-width:2;stroke-linecap:round}' +
    '</style>';

  function svg() {
    var h = '<svg viewBox="0 64 1100 576" role="img" aria-label="' + esc(t(T.aria)) + '">' + STYLE;
    h += '<rect class="hb-sky" x="0" y="64" width="1100" height="576" rx="12"/>';
    h += '<rect class="hb-land" x="0" y="520" width="1100" height="120"/><rect class="hb-landtop" x="0" y="520" width="1100" height="5"/>';
    /* garden: lit terrace (partner venues) + dashed pavilion (O2O / VR events) */
    h += '<g class="lit"><rect class="hb-lit" x="22" y="452" width="108" height="68" rx="6"/>' +
      '<path class="ic" d="M76 466v40M52 466q24 -22 48 0zM60 506h32M64 506v10M88 506v10"/></g>';
    h += '<g class="dim"><path class="hb-dim" d="M140 456L196 420L252 456z"/><path class="ic dash" d="M150 456v64M242 456v64M150 492h92"/></g>';
    h += stack(76, 438, [[t(T.garden), 'hb-n', 116, 15], [t(T.gardenEq), 'hb-sl', 116, 12.5]], true);
    h += stack(196, 408, [[t(T.gazebo), 'hb-n', 116, 14.5], [t(T.gazeboEq), 'hb-s', 116, 12.5]], true);
    h += '<g transform="translate(50 0)">';
    h += '<rect class="hb-found" x="236" y="520" width="588" height="34"/>';
    h += fit(530, 543, t(T.found), 'hb-b', 570, 14, 10);
    h += fit(530, 594, t(T.land), 'hb-land-t', 760, 14.5, 10);
    h += '<rect class="hb-shell" x="250" y="230" width="560" height="290"/>';
    h += '<path class="hb-roof" d="M214 232L530 92l316 140z"/>';
    h += fit(530, 166, t(T.roof), 'hb-n', 380, 15, 11) + fit(530, 186, t(T.roofEq), 'hb-s', 400, 12.5, 9);
    ROOMS.forEach(function (r) {
      var x = r[0], y = r[1], w = r[2], hh = r[3], lit = r[4];
      h += '<g class="' + (lit ? 'lit' : 'dim') + '"><rect class="' + (lit ? 'hb-lit' : 'hb-dim') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" rx="6"/>';
      var eq = wrap(t(r[6]), w - 18, 12.5);
      h += fit(x + w / 2, y + 26, t(r[5]), 'hb-n', w - 30, 15, 11) + stack(x + w / 2, y + 45, [[t(r[6]), 'hb-s', w - 18, 12.5]]);
      h += ICON[r[7]](x + w / 2, y + 88 + (eq.length > 1 ? 8 : 0)) + '</g>';
      if (lit) h += '<circle class="hb-sun" cx="' + (x + w - 15) + '" cy="' + (y + 15) + '" r="5"/>';
    });
    h += '<path class="hb-wire" d="M530 196V230M254 379H806M254 232V518"/>';
    h += '<path class="hb-tick" d="M358 379v-8M527 379v-8M699 379v-8M348 379v8M537 379v8M719 379v8"/>';
    h += '<rect class="hb-door" x="806" y="446" width="8" height="74"/><path class="hb-path" d="M814 520h220"/>';
    h += person(850, 'hb-host', 1) + '<path d="M864 478q14 -8 26 0" fill="none" stroke="var(--accent2,#7FD6D0)" stroke-width="2.5" stroke-linecap="round"/>';
    h += person(928, 'hb-guest', 0.86) + person(966, 'hb-guest2', 0.86);
    h += '<path class="hb-post" d="M1012 520v-92"/><rect class="hb-sign" x="928" y="404" width="112" height="28" rx="5"/>' + fit(984, 423, t(T.street), 'hb-b', 102, 12.5, 9);
    h += stack(930, 296, [[t(T.host), 'hb-n', 196, 15], [t(T.hostEq), 'hb-s', 196, 12.5], [t(T.host2), 'hb-s', 196, 12.5]], true);
    h += '<path class="hb-lead" d="M858 314L852 448"/>';
    h += '<path class="hb-bub" d="M904 394l10 40 14-40z"/><rect class="hb-bub" x="862" y="320" width="176" height="76" rx="10"/><path d="M906 395h20" stroke="var(--s2,#1A2136)" stroke-width="3"/>';
    h += fit(950, 344, t(T.ask), 'hb-b', 164, 12.5, 9) + fit(950, 362, t(T.answer), 'hb-s', 164, 12, 9) + '<text class="hb-sl" x="950" y="384" text-anchor="middle" font-weight="600">= Personalized Marketing</text>';
    h += '<rect class="hb-pill" x="950" y="307" width="80" height="20" rx="10"/><text class="hb-pill-t" x="990" y="321" text-anchor="middle">GEO &amp; MCP</text>';
    h += '<text class="hb-sl" x="930" y="549" text-anchor="middle">= X · IG · TikTok · YouTube</text>';
    h += '</g></svg>';
    return h;
  }
  function legend() {
    return '<div class="thome-key"><span><i class="k-lit"></i>' + esc(t(T.lit)) + '</span><span><i class="k-dim"></i>' + esc(t(T.dim)) +
      '</span><span><i class="k-wire"></i>' + esc(t(T.wire)) + '</span></div>';
  }
  var CSS = '.thome{background:var(--s1);border:1px solid var(--line);border-radius:18px;padding:14px 14px 8px;margin-top:18px}' +
    '.thome-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}.thome svg{display:block;width:100%;min-width:780px;height:auto}' +
    '.thome-hint{display:none;font-size:13px;color:var(--ink3);margin:0 4px 8px}@media (max-width:820px){.thome-hint{display:block}}' +
    '.thome-key{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:13.5px;color:var(--ink2);padding:10px 4px 4px}' +
    '.thome-key i{display:inline-block;width:16px;height:16px;border-radius:4px;vertical-align:-3px;margin-right:7px}' +
    '.thome-key .k-lit{background:rgba(224,185,107,.18);border:1.5px solid var(--accent)}' +
    '.thome-key .k-dim{background:var(--s2);border:1.5px dashed var(--ink3)}' +
    '.thome-key .k-wire{border-top:3px dashed var(--accent2);height:0;width:22px;border-radius:0;vertical-align:4px}';
  function render() {
    var l = (document.documentElement.lang || 'th').slice(0, 2).toLowerCase(); lang = LANGS.indexOf(l) > -1 ? l : 'en';
    document.querySelectorAll('[data-home]').forEach(function (box) {
      var keep = box.querySelector('.thome-scroll'), left = keep ? keep.scrollLeft : null;
      box.innerHTML = '<p class="thome-hint">' + esc(t(T.hint)) + '</p><div class="thome-scroll">' + svg() + '</div>' + legend();
      var sc = box.querySelector('.thome-scroll');
      if (sc.scrollWidth > sc.clientWidth) sc.scrollLeft = left != null ? left : (sc.scrollWidth - sc.clientWidth) * 0.42;
    });
  }
  function init() {
    if (!document.querySelector('[data-home]')) return;
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    render();
    new MutationObserver(function () { render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
