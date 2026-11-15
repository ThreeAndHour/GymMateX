/**
 * ThB.Ho Creators · Collab Application — in-place update (Nov 2026)
 *
 * Unlike rebuild-collab-form.gs this keeps the live 4-section form, its images and video.
 * It:
 *  - writes the title, description, every question, help text and choice in Thai + English
 *  - stops collecting emails through Google sign-in and adds a plain Email question instead
 *  - keeps only name, email, contact, social links, persona, content level and the
 *    confirmation required (the confirmation needs all 3 boxes); everything else optional
 *  - points links to https://thbho.com/ and https://creators.thbho.com/
 *
 * Run once: script.google.com > New project > paste > run updateCollabForm.
 * Form: https://docs.google.com/forms/d/1H0qL2E3TmePwci-rgiNAyc3WZBDWpoo7kXJE0oXMA2Y/edit
 */
var FORM_ID = '1H0qL2E3TmePwci-rgiNAyc3WZBDWpoo7kXJE0oXMA2Y';

// Item ids from the live form (read 15 Nov 2026)
var ID = {
  heroImage: 858726064, about: 881736576, name: 913524687, social: 1634164386, followers: 876901090,
  where: 394526907, contact: 913104273, mbti: 845839440, content: 721477994, kind: 1074621127,
  level: 1220463928, vibe: 633312107, ai: 1957276509, collab: 960201727, want: 107066606,
  imgPersona: 445233413, imgShoot: 2049638350, imgMovies: 517625440, formats: 581491213,
  imgThree: 1468867617, imgB: 874779495, imgHour: 1202001848, persona: 1999547833,
  footage: 1836299769, video: 1765203872, portfolio: 98237726, confirm: 559692135
};

function fixLinks(s) {
  return String(s || '')
    .replace(/https?:\/\/threeandhour\.github\.io\/GymMateX\/?/g, 'https://creators.thbho.com/')
    .replace(/https?:\/\/thbho\.github\.io\/?/g, 'https://thbho.com/');
}

function updateCollabForm() {
  var form = FormApp.openById(FORM_ID);
  var get = function (k) { return form.getItemById(ID[k]); };

  // ---- form title, description, sign-in ----
  form.setTitle('ThB.Ho Creators · สมัคร Collab · Collab Application');
  form.setDescription(
    'Collab กับ Hybrid AI Persona: Three · B. · Hour — content มากขึ้น ถ่ายจริงน้อยลง\n' +
    'Collab with Hybrid AI Personas Three · B. · Hour — more content, less real shooting.\n\n' +
    'สำหรับครีเอเตอร์สายฟิตเนส ครีเอเตอร์บน platform สมาชิก influencer นายแบบ และคนรักศิลปะ · คุณกำหนดระดับเนื้อหาเอง และผลงานเป็นของคุณ\n' +
    'For fitness and physique creators, subscription creators, influencers, models and art lovers. You choose your content level and you own your work.\n\n' +
    'ใช้เวลาราว 3 นาที · ตอบกลับภายใน 3 วันทำการ · ข้อมูลใช้เพื่อพิจารณางาน collab เท่านั้น · ไม่ต้องล็อกอิน Google\n' +
    'About 3 minutes · We reply within 3 working days · Your info is only used to review collabs · No Google sign-in needed.\n\n' +
    'ThB.Ho Creators: https://creators.thbho.com/ThBHoCreators.html\n' +
    'Portfolio: https://creators.thbho.com/ThBHoPortfolio.html\n' +
    'Hybrid AI by ThB.Ho: https://thbho.com/AIGymmateXFactory.html\n' +
    'WIDEROOMS: https://thbho.com/EngWiderooms.html'
  );
  try { form.setEmailCollectionType(FormApp.EmailCollectionType.DO_NOT_COLLECT); } catch (e) { form.setCollectEmail(false); }
  try { form.setRequireLogin(false); } catch (e) {}
  try { form.setLimitOneResponsePerUser(false); } catch (e) {}

  // ---- plain Email question at the top of "About You" (added once) ----
  var hasEmail = form.getItems(FormApp.ItemType.TEXT).some(function (it) { return /^อีเมล/.test(it.getTitle()); });
  if (!hasEmail) {
    var em = form.addTextItem()
      .setTitle('อีเมล · Email')
      .setHelpText('ใช้ติดต่อกลับเรื่อง collab เท่านั้น · Only used to reply about your collab')
      .setRequired(true)
      .setValidation(FormApp.createTextValidation().requireTextIsEmail().setHelpText('กรุณาใส่อีเมลให้ถูกต้อง · Please enter a valid email').build());
    var nameIndex = get('name').getIndex();
    form.moveItem(em.getIndex(), nameIndex + 1);
  }

  // ---- sections, images, video ----
  get('heroImage').setTitle('หนึ่งต้นแบบ สาม persona · One archetype, three personas: Three · B. · Hour');
  get('about').asPageBreakItem().setTitle('เกี่ยวกับคุณ · About You')
    .setHelpText('บอกเราว่าคุณเป็นใคร และดูผลงานของคุณได้ที่ไหน · Tell us who you are and where to find your work.');
  get('content').asPageBreakItem().setTitle('ผลงานของคุณ · Your Content')
    .setHelpText('ช่วยให้เราจับคู่ persona และรูปแบบงานที่เหมาะกับคุณ · Helps us match you with the right persona and format.');
  get('collab').asPageBreakItem().setTitle('Collab กับ Three · B. · Hour')
    .setHelpText('Hybrid AI ไม่ได้มาแทนความคิดสร้างสรรค์ของคุณ แต่ช่วยข้ามข้อจำกัดเรื่องคน เวลา และอุปกรณ์ · Hybrid AI does not replace your creativity — it removes limits of people, time and equipment.');
  get('imgPersona').setTitle('Persona Collab — ลุคนีออนพรีเมียมสำหรับแบรนด์และงาน theme · premium neon looks for brands and themed work');
  get('imgShoot').setTitle('Hybrid Shoot — ถ่ายจริงเป็นฐาน AI เติมแสงและฉาก · real shoot as the base, AI adds light and sets');
  get('imgMovies').setTitle('Hybrid AI Movies — storyboard 9 ช็อตก่อนถ่ายหนังสั้นทุกเรื่อง · 9-shot storyboard before every short film');
  get('imgThree').setTitle('Three · INFP — นักเล่าเรื่อง · the storyteller · ไทย-อิตาเลียน · Thai-Italian');
  get('imgB').setTitle('B. · INFJ — นักวางกลยุทธ์ · the strategist · ไทย-สเปน-เกาหลี · Thai-Spanish-Korean');
  get('imgHour').setTitle('Hour · ESTP — สายลุย · the go-getter · ไทย-เกาหลี · Thai-Korean');
  get('video').setTitle('ดูผลงาน · Watch: ThB.Ho Portfolio — Three · B. · Hour')
    .setHelpText('Hybrid AI by ThB.Ho · MV และหนังสั้นเพิ่มเติม · More MVs and short films: https://creators.thbho.com/ThBHoPortfolio.html');

  // ---- questions: [key, type, title, help, required, choices, other] ----
  var Q = [
    ['name', 'text', 'ชื่อ creator หรือชื่อ persona · Creator or persona name', null, true],
    ['social', 'para', 'ลิงก์โซเชียลหลัก · Main social links', 'IG, TikTok, YouTube, X หรือ platform สมาชิก บรรทัดละลิงก์ · IG, TikTok, YouTube, X or subscription platform — one per line', true],
    ['followers', 'mc', 'ผู้ติดตามรวมทุก platform · Total followers (all platforms)', null, false,
      ['เพิ่งเริ่ม · ต่ำกว่า 1K · Just starting · under 1K', '1K–10K', '10K–100K', '100K+']],
    ['where', 'cb', 'ถ่ายงานได้ที่ไหน? · Where can you shoot?', null, false,
      ['กรุงเทพฯ — ถ่ายในเมือง · Bangkok — city shoots', 'พัทยา–EEC — ทะเล เรือยอชต์ วิลล่า · Pattaya–EEC — sea, yacht, villa',
       'ทางไกล — ส่ง footage มา · Remote — I send footage', 'ไปทริป 3 วัน 2 คืนได้ · Can join a 3D2N trip']],
    ['contact', 'mc', 'ช่องทางติดต่อที่สะดวก · Preferred contact', 'ถ้าเลือก LINE, X หรือ Instagram ใส่ ID ในช่องลิงก์โซเชียลด้วย · If you pick LINE, X or Instagram, add your ID with your social links', true,
      ['อีเมล · Email', 'DM ทาง X · X DM', 'DM ทาง Instagram · Instagram DM', 'LINE'], true],
    ['mbti', 'text', 'MBTI ของคุณ (ไม่บังคับ) · Your MBTI (optional)', 'ทำแบบทดสอบฟรี · Free test: https://www.16personalities.com', false],
    ['kind', 'cb', 'คุณเป็นครีเอเตอร์สายไหน? · What kind of creator are you?', null, false,
      ['ฟิตเนสและสายกล้าม · Fitness & physique', 'Platform สมาชิก · Subscription platform', 'Influencer ไลฟ์สไตล์และท่องเที่ยว · Lifestyle & travel influencer',
       'ครีเอเตอร์คู่หรือ duo · Couple or duo creator', 'นายแบบ · Model', 'ช่างภาพ ผู้กำกับ หรือศิลปิน · Photographer, director or artist',
       'เพิ่งเริ่ม หรือคนรักศิลปะ · Just starting or art lover'], true],
    ['level', 'mc', 'ระดับเนื้อหาที่คุณทำเป็นปกติ · Content level you usually make',
      'คุณเลือกระดับเองทุกชิ้น เปลี่ยนได้ตลอด และไม่มีผลต่อการจับคู่ · You choose the level of every piece, can change it anytime, and it does not affect matching.', true,
      ['Level 1 · ปกติ — ฟิตเนส ไลฟ์สไตล์ influencer · ทุก platform · Standard — fitness, lifestyle, influencer · all platforms',
       'Level 2 · Bold — โชว์หุ่น ชุดว่ายน้ำ ลุค after-dark · physique, swimwear, after-dark looks',
       'Level 3 · Private 20+ — เฉพาะ platform สมาชิกที่ตรวจอายุ · age-verified subscription platforms only',
       'ยังไม่แน่ใจ · Not sure yet']],
    ['vibe', 'mc', 'สไตล์ของคุณหน้ากล้อง · Your on-camera vibe', null, false,
      ['นิ่ง ลึก เล่าเรื่อง · Calm, deep storyteller', 'มั่นใจ พรีเมียม มีแผน · Confident, premium, has a plan',
       'พลังเยอะ กล้า สนุก · High-energy, bold, playful', 'ปรับได้ตามงาน · Adapts to the job']],
    ['ai', 'mc', 'เคยใช้เครื่องมือ AI ไหม? · Experience with AI tools', null, false,
      ['ยังไม่เคย · Never tried', 'ลองมาบ้าง · Tried a few', 'ใช้เป็นประจำ · Use them regularly']],
    ['want', 'cb', 'อยากได้อะไรจาก collab มากที่สุด? · What do you want most from a collab?', null, false,
      ['ฐานแฟนใหม่ — เข้าถึงแฟนของ persona · New fan base — reach the personas’ fans', 'Content มากขึ้น ถ่ายจริงน้อยลง · More content, less real shooting',
       'ประหยัดเวลาและค่าโปรดักชัน · Save time and production cost', 'MV หรือหนังสั้นแบบ cinematic · Cinematic MV or short film',
       'ผลงานเด่นไว้โชว์ · A standout showcase piece', 'รายได้ตอนไม่ได้ถ่าย — AI twin · Income while not shooting — AI twin']],
    ['formats', 'cb', 'รูปแบบ collab ที่สนใจ · Collab formats you are interested in',
      'Remaster และ Digital Twin ใช้เฉพาะงานที่คุณเป็นเจ้าของ และทุกคนในงานยินยอม · Remaster and Digital Twin use only content you own, with consent from everyone involved.', false,
      ['Persona Collab — ถ่ายหรือเล่าเรื่องกับ Three, B. หรือ Hour · shoot or tell a story with Three, B. or Hour',
       'Remaster — ยกระดับ footage เก่าด้วย AI · upgrade your old footage with AI',
       'Hybrid Shoot — ถ่ายจริงเป็นฐาน AI เติมฉากและชุด · real shoot as base, AI adds sets & outfits',
       'Hybrid AI Movies — หนังสั้นและ MV แบบ cinematic · cinematic short films & MVs',
       'Digital Twin — AI persona ของคุณเอง แบ่งรายได้ (VR เฟส 3) · your own AI persona, revenue share (VR phase 3)',
       '48 Hours — คู่ที่จับด้วย MBTI ถ่าย series 2 วัน · MBTI-matched pair, 2-day series',
       'Creator & Art Lab — workshop รุ่นละ 6–10 คน · workshop, 6–10 per batch']],
    ['persona', 'mc', 'อยาก collab กับ persona ไหน? · Which persona would you like to collab with?', null, true,
      ['Three · INFP — นักเล่าเรื่อง · the storyteller', 'B. · INFJ — นักวางกลยุทธ์ · the strategist',
       'Hour · ESTP — สายลุย · the go-getter', 'ยังไม่แน่ใจ — ช่วยจับคู่ให้ · Not sure — match me']],
    ['footage', 'mc', 'มีรูปหรือ footage จริงแบบ HD เป็นฐานไหม? · Can you provide real HD photos or footage as a base?',
      'Hybrid AI ผสมใบหน้าและร่างกายจริงกับ AI · ใช้เฉพาะงานที่คุณเป็นเจ้าของ และทุกคนในภาพยินยอม · Hybrid AI blends real faces and bodies with AI. Only content you own, with consent from everyone in frame.', false,
      ['มี — มีงานเดิมอยู่แล้ว · Yes — I have existing content', 'มี — ถ่ายใหม่ได้ · Yes — I can shoot new',
       'อยากถ่ายจริงให้น้อยที่สุด · I prefer minimal real shooting', 'ยังไม่แน่ใจ · Not sure yet']],
    ['portfolio', 'para', 'ลิงก์ผลงาน และสิ่งที่อยากบอกเรา · Portfolio link and anything else we should know',
      'เล่าไอเดียและความฝันของคุณได้เลย · Feel free to share your ideas and dreams.', false],
    ['confirm', 'cb', 'ยืนยัน · Confirmation', 'ต้องเลือกครบทั้ง 3 ข้อ · Please tick all 3', true,
      ['ฉันอายุ 20 ปีขึ้นไป และจะแสดงบัตรก่อนถ่ายทุกครั้ง · I am 20 or older and will show ID before every shoot',
       'ทุกคนในงานของฉันให้ความยินยอมเป็นลายลักษณ์อักษร · Everyone in my content gives written consent',
       'ฉันเข้าใจว่าปฏิเสธการจับคู่หรือถอนตัวได้ตลอด โดยไม่ต้องอธิบาย · I understand I can decline a match or withdraw anytime, no explanation needed']]
  ];

  Q.forEach(function (q) {
    var item = get(q[0]), type = q[1], it;
    if (type === 'text') it = item.asTextItem();
    else if (type === 'para') it = item.asParagraphTextItem();
    else if (type === 'mc') it = item.asMultipleChoiceItem();
    else it = item.asCheckboxItem();
    it.setTitle(q[2]);
    it.setHelpText(q[3] || '');
    it.setRequired(!!q[4]);
    if (q[5]) {
      it.setChoiceValues(q[5]);
      if (q[6]) it.showOtherOption(true);
    }
  });

  // the confirmation needs all three boxes
  get('confirm').asCheckboxItem().setValidation(
    FormApp.createCheckboxValidation().requireSelectExactly(3)
      .setHelpText('กรุณาเลือกครบทั้ง 3 ข้อ · Please tick all 3').build());

  // ---- thank-you message ----
  var msg = fixLinks(form.getConfirmationMessage());
  if (!/[฀-๿]/.test(msg)) {
    msg = 'ขอบคุณครับ ทีม ThB.Ho จะติดต่อกลับภายใน 3 วันทำการ\n' +
      'ดูผลงานระหว่างรอ: https://creators.thbho.com/ThBHoPortfolio.html · https://thbho.com/\n\n' + msg;
  }
  form.setConfirmationMessage(msg);

  Logger.log('Done. Required: ' + form.getItems().filter(function (i) {
    var t = i.getType(), F = FormApp.ItemType;
    var m = { TEXT: 'asTextItem', PARAGRAPH_TEXT: 'asParagraphTextItem', MULTIPLE_CHOICE: 'asMultipleChoiceItem', CHECKBOX: 'asCheckboxItem' }[String(t)];
    return m ? i[m]().isRequired() : false;
  }).map(function (i) { return i.getTitle(); }).join(' | '));
  Logger.log(form.getConfirmationMessage());
  Logger.log('Live form: ' + form.getPublishedUrl());
}
