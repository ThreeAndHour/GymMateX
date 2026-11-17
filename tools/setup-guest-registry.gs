/**
 * ThB.Ho Creators · Guest registry ("ทะเบียนแขก") for the collab form (Nov 2026)
 *
 * Safe to run more than once, and before or after update-collab-form.gs. It:
 *  1. adds ONE optional question at the end of the form: "รหัสอ้างอิง · Reference".
 *     The website (thbho-ref.js) pre-fills it with where the visitor came from, the clips they
 *     opened and their match-quiz result. Applicants can see it; nothing else is collected.
 *  2. makes sure the form saves its responses to a Google Sheet (creates one if there is none)
 *  3. adds a "Guests" tab to that Sheet that splits the reference into columns
 *     (source, first clip, quiz match, level, clips seen, language ...) next to name and contact,
 *     plus Status and Notes columns for the team.
 *  4. logs the prefill entry id: send it to Claude (or put it in ENTRY in thbho-ref.js).
 *
 * Run: script.google.com > New project > paste > choose setupGuestRegistry > Run.
 * It never deletes questions or responses.
 */
var FORM_ID = '1H0qL2E3TmePwci-rgiNAyc3WZBDWpoo7kXJE0oXMA2Y';
var REF_TITLE = 'รหัสอ้างอิง (ระบบกรอกให้) · Reference (filled in automatically)';
var ITEM = { name: 913524687, contact: 913104273, persona: 1999547833, level: 1220463928, social: 1634164386 };
var KEYS = [ // [column title, key in the reference line]
  ['Source · มาจาก', 'src'], ['First clip · คลิปแรก', 'clip'], ['Campaign', 'c'], ['Came back from', 'last'],
  ['Quiz match · ผลแบบทดสอบ', 'quiz'], ['Quiz level', 'lvl'], ['I am · สายงาน', 'type'], ['Goal · เป้าหมาย', 'goal'],
  ['Clips opened · คลิปที่เปิดดู', 'seen'], ['Language', 'lang'], ['Visits', 'visits'], ['First visit · มาครั้งแรก', 'first']
];

function setupGuestRegistry() {
  var form = FormApp.openById(FORM_ID);

  // 1. Reference question (once)
  var ref = form.getItems(FormApp.ItemType.TEXT).filter(function (it) { return /^รหัสอ้างอิง/.test(it.getTitle()); })[0];
  if (!ref) {
    ref = form.addTextItem();
    ref.setTitle(REF_TITLE)
      .setHelpText('ไม่ต้องแก้ไข ช่วยให้ทีมรู้ว่าคุณมาจากคลิปไหน และผลแบบทดสอบของคุณ · Leave as is: it tells us which clip brought you here and your quiz result.')
      .setRequired(false);
  }
  var pre = form.createResponse().withItemResponse((ref.asTextItem ? ref.asTextItem() : ref).createResponse('x')).toPrefilledUrl();
  var entry = (pre.match(/entry\.(\d+)=/) || [])[1];

  // 2. Responses Sheet
  var ssId = null;
  try { ssId = form.getDestinationId(); } catch (e) {}
  var ss;
  if (ssId) ss = SpreadsheetApp.openById(ssId);
  else {
    ss = SpreadsheetApp.create('ThB.Ho Creators · ทะเบียนแขก (Guest registry)');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
    ss = SpreadsheetApp.openById(ss.getId());
  }
  var resp = null;
  for (var t = 0; t < 10 && !resp; t++) {
    resp = ss.getSheets().filter(function (sh) { return sh.getFormUrl && sh.getFormUrl() && sh.getFormUrl().indexOf(FORM_ID) > -1; })[0] || null;
    if (!resp) { SpreadsheetApp.flush(); Utilities.sleep(2000); }
  }
  if (!resp) throw new Error('Could not find the form responses tab in ' + ss.getUrl());
  var head = [];
  for (var u = 0; u < 10; u++) {
    head = resp.getRange(1, 1, 1, Math.max(resp.getLastColumn(), 1)).getValues()[0].map(String);
    if (head.some(function (h) { return /^รหัสอ้างอิง/.test(h); })) break;
    SpreadsheetApp.flush(); Utilities.sleep(2000);
  }
  var R = "'" + resp.getName().replace(/'/g, "''") + "'!";
  // INDIRECT: Google inserts a row for every new response, which would shift a plain A2:A reference to A3:A
  function rng(c) { return 'INDIRECT("' + R.replace(/"/g, '""') + c + '2:' + c + '")'; }
  function col(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = (i - m - 1) / 26; } return s; }
  function byTitle(title) { var i = head.indexOf(title); return i < 0 ? null : col(i); }
  function byItem(id) { var it = form.getItemById(id); return it ? byTitle(it.getTitle()) : null; }
  var emailCol = null; head.forEach(function (h, i) { if (!emailCol && /^อีเมล|^Email Address$/.test(h)) emailCol = col(i); });
  var refCol = null; head.forEach(function (h, i) { if (!refCol && /^รหัสอ้างอิง/.test(h)) refCol = col(i); });
  if (!refCol) throw new Error('The reference column has not appeared in the responses tab yet. Wait a minute and run again.');

  // 3. Guests tab
  var g = ss.getSheetByName('Guests') || ss.insertSheet('Guests', 0);
  var keep = {}; // keep the team's Status / Notes typed so far
  if (g.getLastRow() > 1) {
    var old = g.getRange(1, 1, g.getLastRow(), g.getLastColumn()).getValues();
    var si = old[0].indexOf('Status · สถานะ'), ni = old[0].indexOf('Notes · บันทึก');
    for (var r = 1; r < old.length; r++) keep[r] = [si > -1 ? old[r][si] : '', ni > -1 ? old[r][ni] : ''];
  }
  g.clear();
  var cols = [['Date · วันที่', 'A'], ['Name · ชื่อ', byItem(ITEM.name)], ['Contact · ช่องทางติดต่อ', byItem(ITEM.contact)],
    ['Email', emailCol], ['Social', byItem(ITEM.social)], ['Persona wanted', byItem(ITEM.persona)], ['Level (form)', byItem(ITEM.level)]];
  var headers = [], formulas = [];
  cols.forEach(function (c) {
    headers.push(c[0]);
    formulas.push(c[1] ? '=ARRAYFORMULA(IF(LEN(' + rng('A') + '),' + rng(c[1]) + ',))' : '');
  });
  KEYS.forEach(function (k) {
    headers.push(k[0]);
    formulas.push('=ARRAYFORMULA(IF(LEN(' + rng('A') + '),IFERROR(TRIM(REGEXEXTRACT(' + rng(refCol) +
      ',"(?:^|; )' + k[1] + ':([^;]*)")),),))');
  });
  headers.push('Status · สถานะ', 'Notes · บันทึก');
  g.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#111626').setFontColor('#E0B96B');
  g.getRange(2, 1, 1, formulas.length).setFormulas([formulas]);
  var sc = headers.length - 1;
  var rows = Object.keys(keep);
  if (rows.length) g.getRange(2, sc, rows.length, 2).setValues(rows.map(function (k) { return keep[k]; }));
  g.getRange(2, sc, 999, 1).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['ใหม่ · New', 'ติดต่อแล้ว · Contacted', 'คุยงาน · In talks', 'Collab แล้ว · Done', 'ยังไม่ใช่ตอนนี้ · Not now'], true).build());
  g.setFrozenRows(1); g.setFrozenColumns(2);
  g.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');

  Logger.log('Guest registry ready: ' + ss.getUrl() + '#gid=' + g.getSheetId());
  Logger.log('PREFILL ENTRY ID = ' + entry + '   (send this number to Claude)');
}
