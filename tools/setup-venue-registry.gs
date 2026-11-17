/**
 * ThB.Ho Venues · Partner application form + "Venue Guests" tab (Nov 2026)
 *
 * Uses the SAME guest-registry spreadsheet as the creator collab form, so creators and
 * venues sit in one file ("ทะเบียนแขกชุดเดียวกัน"):
 *   https://docs.google.com/spreadsheets/d/1OPFoIURCKrcfU1Ulph0tXWtX7HM0KgtukgH14wQkux0/edit
 *
 * Safe to run again: the form is created once (its id is kept in Script Properties, or found by
 * VENUE_FORM_ID below) and later runs only refresh the "Venue Guests" tab. Never deletes answers.
 * The log prints the public form address and the prefill entry id for thbho-ref.js.
 */
var REGISTRY_SS = '1OPFoIURCKrcfU1Ulph0tXWtX7HM0KgtukgH14wQkux0';
var VENUE_FORM_ID = ''; // fill in after the first run if Script Properties are ever lost
var VENUE_KEYS = [
  ['Source · มาจาก', 'src'], ['First clip · คลิปแรก', 'clip'], ['Campaign', 'c'], ['Came back from', 'last'],
  ['Clips opened · คลิปที่เปิดดู', 'seen'], ['Language', 'lang'], ['Visits', 'visits'], ['First visit · มาครั้งแรก', 'first']
];

function setupVenueRegistry() {
  var props = PropertiesService.getScriptProperties();
  var id = VENUE_FORM_ID || props.getProperty('VENUE_FORM_ID');
  var form = id ? FormApp.openById(id) : buildVenueForm_();
  props.setProperty('VENUE_FORM_ID', form.getId());

  // responses go to the shared registry spreadsheet
  var dest = null; try { dest = form.getDestinationId(); } catch (e) {}
  if (dest !== REGISTRY_SS) form.setDestination(FormApp.DestinationType.SPREADSHEET, REGISTRY_SS);
  var ss = SpreadsheetApp.openById(REGISTRY_SS);

  var ref = form.getItems(FormApp.ItemType.TEXT).filter(function (it) { return /^รหัสอ้างอิง/.test(it.getTitle()); })[0];
  var pre = form.createResponse().withItemResponse(ref.asTextItem().createResponse('x')).toPrefilledUrl();
  var entry = (pre.match(/entry\.(\d+)=/) || [])[1];

  var resp = null;
  for (var t = 0; t < 10 && !resp; t++) {
    resp = ss.getSheets().filter(function (sh) { var u = sh.getFormUrl && sh.getFormUrl(); return u && u.indexOf(form.getId()) > -1; })[0] || null;
    if (!resp) { SpreadsheetApp.flush(); Utilities.sleep(2000); }
  }
  if (!resp) throw new Error('Venue responses tab not found yet. Wait a minute and run again.');
  if (!/^Venue/.test(resp.getName())) resp.setName('Venue Responses');
  var head = [];
  for (var u = 0; u < 10; u++) {
    head = resp.getRange(1, 1, 1, Math.max(resp.getLastColumn(), 1)).getValues()[0].map(String);
    if (head.some(function (h) { return /^รหัสอ้างอิง/.test(h); })) break;
    SpreadsheetApp.flush(); Utilities.sleep(2000);
  }
  var R = "'" + resp.getName().replace(/'/g, "''") + "'!";
  function col(i) { var s = ''; i++; while (i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = (i - m - 1) / 26; } return s; }
  function rng(c) { return 'INDIRECT("' + R.replace(/"/g, '""') + c + '2:' + c + '")'; }
  function find(re) { for (var i = 0; i < head.length; i++) if (re.test(head[i])) return col(i); return null; }
  var refCol = find(/^รหัสอ้างอิง/);
  if (!refCol) throw new Error('The reference column has not appeared yet. Wait a minute and run again.');

  var g = ss.getSheetByName('Venue Guests') || ss.insertSheet('Venue Guests', 1);
  var keep = {};
  if (g.getLastRow() > 1) {
    var old = g.getRange(1, 1, g.getLastRow(), g.getLastColumn()).getValues();
    var si = old[0].indexOf('Status · สถานะ'), ni = old[0].indexOf('Notes · บันทึก');
    for (var r = 1; r < old.length; r++) keep[r] = [si > -1 ? old[r][si] : '', ni > -1 ? old[r][ni] : ''];
  }
  g.clear();
  var cols = [['Date · วันที่', 'A'], ['Venue · สถานที่', find(/^ชื่อสถานที่/)], ['Type · ประเภท', find(/^ประเภทสถานที่/)],
    ['City · ที่ตั้ง', find(/^ที่ตั้ง/)], ['Contact person · ผู้ติดต่อ', find(/^ชื่อผู้ติดต่อ/)], ['Email', find(/^อีเมล/)],
    ['Phone / LINE / WhatsApp', find(/^โทร/)], ['Website / social', find(/^เว็บไซต์/)], ['Interested in · สนใจ', find(/^สนใจร่วมงาน/)],
    ['Levels OK · ระดับที่รับได้', find(/^ระดับเนื้อหา/)]];
  var headers = [], formulas = [];
  cols.forEach(function (c) { headers.push(c[0]); formulas.push(c[1] ? '=ARRAYFORMULA(IF(LEN(' + rng('A') + '),' + rng(c[1]) + ',))' : ''); });
  VENUE_KEYS.forEach(function (k) {
    headers.push(k[0]);
    formulas.push('=ARRAYFORMULA(IF(LEN(' + rng('A') + '),IFERROR(TRIM(REGEXEXTRACT(' + rng(refCol) + ',"(?:^|; )' + k[1] + ':([^;]*)")),),))');
  });
  headers.push('Status · สถานะ', 'Notes · บันทึก');
  g.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setBackground('#081211').setFontColor('#E0B96B');
  g.getRange(2, 1, 1, formulas.length).setFormulas([formulas]);
  var sc = headers.length - 1, rows = Object.keys(keep);
  if (rows.length) g.getRange(2, sc, rows.length, 2).setValues(rows.map(function (k) { return keep[k]; }));
  g.getRange(2, sc, 999, 1).setDataValidation(SpreadsheetApp.newDataValidation()
    .requireValueInList(['ใหม่ · New', 'ติดต่อแล้ว · Contacted', 'นัดดูสถานที่ · Site visit', 'คุยงาน · In talks', 'พาร์ทเนอร์แล้ว · Partner', 'ยังไม่ใช่ตอนนี้ · Not now'], true).build());
  g.setFrozenRows(1); g.setFrozenColumns(2);
  g.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');

  Logger.log('VENUE FORM (public) = ' + form.getPublishedUrl());
  Logger.log('VENUE PREFILL ENTRY ID = ' + entry);
  Logger.log('Venue Guests tab: ' + ss.getUrl() + '#gid=' + g.getSheetId());
}

function buildVenueForm_() {
  var form = FormApp.create('ThB.Ho Venues · สมัครเป็นพาร์ทเนอร์สถานที่ · Venue Partner Application');
  form.setDescription(
    'สำหรับฟิตเนส โรงแรม รีสอร์ท บาร์ คาเฟ่ สตูดิโอ และสถานที่ที่อยากได้ content และงานอีเวนต์จาก Hybrid AI Persona: Three · B. · Hour\n' +
    'For gyms, hotels, resorts, bars, cafés, studios and other venues that want content and events with the Hybrid AI Personas Three · B. · Hour.\n\n' +
    'ใช้เวลาราว 2 นาที · ทีมติดต่อกลับภายใน 3 วันทำการ · ไม่มีข้อผูกมัด · ไม่ต้องล็อกอิน Google\n' +
    'About 2 minutes · We reply within 3 working days · No commitment · No Google sign-in needed.\n\n' +
    'Venues: https://creators.thbho.com/ThBHoVenues.html\n' +
    'Hybrid AI by ThB.Ho: https://thbho.com/AIGymmateXFactory.html\n' +
    'WIDEROOMS: https://thbho.com/EngWiderooms.html');
  try { form.setEmailCollectionType(FormApp.EmailCollectionType.DO_NOT_COLLECT); } catch (e) { form.setCollectEmail(false); }
  try { form.setRequireLogin(false); } catch (e) {}
  form.setAllowResponseEdits(false);
  form.setConfirmationMessage('ขอบคุณครับ ทีม ThB.Ho จะติดต่อกลับภายใน 3 วันทำการ\nThank you! Our team will reach out within 3 working days.\n\nPortfolio: https://creators.thbho.com/ThBHoPortfolio.html');

  form.addTextItem().setTitle('ชื่อสถานที่ · Venue name').setRequired(true);
  form.addCheckboxItem().setTitle('ประเภทสถานที่ · Type of venue')
    .setChoiceValues(['ฟิตเนส / ยิม · Gym / fitness', 'สปา / เวลเนส · Spa / wellness', 'โรงแรม / รีสอร์ท · Hotel / resort',
      'บาร์ / lounge / ไนต์ไลฟ์ · Bar / lounge / nightlife', 'ร้านอาหาร / คาเฟ่ · Restaurant / café',
      'สตูดิโอ · Studio', 'เรือยอชต์ / ชายหาด · Yacht / beach'])
    .showOtherOption(true).setRequired(true);
  form.addTextItem().setTitle('ที่ตั้ง (เมือง / ย่าน) · Location (city / area)').setRequired(true);
  form.addTextItem().setTitle('ชื่อผู้ติดต่อ และตำแหน่ง · Contact person and role').setRequired(true);
  var email = form.addTextItem().setTitle('อีเมล · Email').setRequired(true);
  try { email.setValidation(FormApp.createTextValidation().requireTextIsEmail().build()); } catch (e) {}
  form.addTextItem().setTitle('โทร / LINE / WhatsApp · Phone / LINE / WhatsApp').setRequired(true);
  form.addTextItem().setTitle('เว็บไซต์หรือโซเชียลของสถานที่ · Venue website or social').setRequired(false);
  form.addCheckboxItem().setTitle('สนใจร่วมงานแบบไหน · What would you like to do with us?')
    .setChoiceValues(['หน้า Matching ของสถานที่ · A matching page for the venue', 'Content รายเดือน · Monthly content',
      'งานอีเวนต์ O2O / theme night · O2O event / theme night', 'MBTI Pairing Night', 'Wellness retreat',
      'โปรแกรมเทรนในสถานที่ · In-venue training', 'ให้ใช้เป็นสถานที่ถ่ายงาน · Use the venue as a shoot location'])
    .showOtherOption(true).setRequired(true);
  form.addCheckboxItem().setTitle('ระดับเนื้อหาที่สถานที่รับได้ · Content levels the venue is comfortable with')
    .setHelpText('เปลี่ยนได้ทุกงาน · You can change this for every project')
    .setChoiceValues(['Level 1 · ศิลปะ เผยแพร่ได้ทุก platform · Art, fine on every platform',
      'Level 2 · โชว์หุ่น ชุดว่ายน้ำ ลุค after-dark · Physique, swimwear, after-dark looks',
      'Level 3 · Private 20+ เฉพาะ platform ที่ตรวจอายุ · Private 20+, age-verified platforms only',
      'ยังไม่แน่ใจ · Not sure yet']).setRequired(false);
  form.addParagraphTextItem().setTitle('เล่าเพิ่มเติม (ไม่บังคับ) · Anything else (optional)')
    .setHelpText('เช่น จำนวนห้องหรือโปรแกรม ช่วงเวลาที่สะดวก งบประมาณคร่าว ๆ · e.g. rooms or programmes, good dates, rough budget').setRequired(false);
  form.addCheckboxItem().setTitle('ยืนยัน · Confirmation')
    .setChoiceValues(['ฉันเป็นเจ้าของหรือได้รับมอบหมายให้ติดต่อในนามสถานที่นี้ · I own or may speak for this venue'])
    .setRequired(true);
  form.addTextItem().setTitle('รหัสอ้างอิง (ระบบกรอกให้) · Reference (filled in automatically)')
    .setHelpText('ไม่ต้องแก้ไข ช่วยให้ทีมรู้ว่าคุณมาจากช่องทางไหน · Leave as is: it tells us how you found us.').setRequired(false);
  return form;
}
