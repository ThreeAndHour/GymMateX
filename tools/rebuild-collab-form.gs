/**
 * ThB.Ho Creators · Collab Application
 * Rebuilds the copied form (NOT the old questionnaire) with a short question set
 * that matches the Creators page. Run once from script.google.com.
 *
 * Form: https://docs.google.com/forms/d/1H0qL2E3TmePwci-rgiNAyc3WZBDWpoo7kXJE0oXMA2Y/edit
 * The old form "Personalized AI Hybrid Creation Questionnaire" is not touched.
 */
function rebuildCollabForm() {
  var form = FormApp.openById('1H0qL2E3TmePwci-rgiNAyc3WZBDWpoo7kXJE0oXMA2Y');

  // 1) Remove every existing question, image and section
  form.getItems().forEach(function (item) { form.deleteItem(item); });

  // 2) Title, description and settings
  form.setTitle('ThB.Ho Creators · Collab Application');
  form.setDescription(
    'สมัคร collab กับ Hybrid AI Persona: Three · B. · Hour\n' +
    'Apply to collab with the Hybrid AI personas Three · B. · Hour.\n\n' +
    'ใช้เวลาราว 3 นาที · ทีมจะติดต่อกลับภายใน 3 วันทำการ · ข้อมูลใช้เพื่อพิจารณางาน collab เท่านั้น\n' +
    'About 3 minutes. We reply within 3 working days. Your answers are only used to plan a collab.'
  );
  form.setCollectEmail(false);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(false);
  form.setConfirmationMessage(
    'ขอบคุณครับ ทีม ThB.Ho จะติดต่อกลับภายใน 3 วันทำการ\n' +
    'Thank you. The ThB.Ho team will get back to you within 3 working days.'
  );

  // 3) Questions
  form.addTextItem()
    .setTitle('ชื่อ / ชื่อที่ใช้ในโซเชียล · Name or display name')
    .setRequired(true);

  form.addTextItem()
    .setTitle('ช่องทางติดต่อ · Contact (LINE, email or X)')
    .setHelpText('เช่น LINE ID, อีเมล หรือ @ บน X · e.g. LINE ID, email or @handle on X')
    .setRequired(true);

  form.addTextItem()
    .setTitle('ลิงก์ผลงานหรือบัญชีหลัก · Link to your main work or account')
    .setHelpText('x.com/yourname · instagram.com/…')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('คุณเป็น creator สายไหนเป็นหลัก? · What kind of creator are you mostly?')
    .setChoiceValues([
      'ฟิตเนส / สายกล้าม · Fitness / physique',
      'Platform สมาชิก · Subscription platforms',
      'Influencer สาย lifestyle / ท่องเที่ยว · Lifestyle / travel influencer',
      'Creator คู่รักหรือ duo · Couple or duo creator',
      'ช่างภาพ / ผู้กำกับ / ศิลปิน · Photographer / filmmaker / artist'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('อยาก collab กับ persona ไหน? · Which persona would you like to work with?')
    .setChoiceValues([
      'Three · INFP · Storyteller',
      'B. · INFJ · Strategist',
      'Hour · ESTP · Entrepreneur',
      'ยังไม่แน่ใจ · Not sure yet'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('อยากได้อะไรจาก collab มากที่สุด? · What do you want most from a collab?')
    .setHelpText('เลือกได้ไม่เกิน 3 ข้อ · Pick up to 3')
    .setChoiceValues([
      'ฐานแฟนใหม่ · New audience',
      'Content มากขึ้น ถ่ายจริงน้อยลง · More content, fewer shoot days',
      'ผลงานแบบหนังหรือ MV · A film or music video',
      'รายได้ตอนที่ไม่ได้ถ่าย (Digital Twin) · Income while offline (Digital Twin)',
      'อยากทำ Hybrid AI เป็นเอง · Learn to do Hybrid AI myself'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('ระดับเนื้อหาที่คุณทำ · Your content level')
    .setHelpText('ไม่มีผลต่อการจับคู่ · It does not affect the match')
    .setChoiceValues([
      '1 · ศิลปะ · Art (fine on every platform)',
      '2 · เปิดเผยบางส่วน · Partial (only where platforms allow it)',
      '3 · Private 20+ (age-verified platforms only)'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('ถ่ายงานได้ที่ไหน? · Where can you shoot?')
    .setChoiceValues([
      'กรุงเทพฯ · Bangkok',
      'พัทยา / EEC · Pattaya / EEC',
      'ส่งงานจากที่ไหนก็ได้ · Remote only',
      'ไปทริปด้วยกันได้ · Happy to travel together'
    ])
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('ผู้ติดตามรวมประมาณเท่าไร? · Roughly how big is your following?')
    .setChoiceValues([
      'กำลังเริ่ม (ต่ำกว่า 1K) · Just starting (under 1K)',
      '1K–10K',
      '10K–100K',
      '100K+'
    ])
    .setRequired(false);

  form.addTextItem()
    .setTitle('MBTI ของคุณ (ถ้ารู้) · Your MBTI (if you know it)')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('อยากบอกอะไรเพิ่มเติม? · Anything else you would like us to know?')
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('ยืนยัน · Confirmation')
    .setChoiceValues([
      'ฉันอายุ 20 ปีขึ้นไป และยินดีให้ทีม ThB.Ho ติดต่อเรื่อง collab · I am 20 or older and agree to be contacted about a collab'
    ])
    .setRequired(true);

  Logger.log('Done: ' + form.getItems().length + ' questions. Live form: ' + form.getPublishedUrl());
}
