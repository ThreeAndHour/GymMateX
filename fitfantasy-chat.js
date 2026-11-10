/* GymMateX Fit & Fantasy · persona chat (FitFantasy.html only)
 *
 * Two modes:
 *  1. Scripted (default): replies come from the REPLIES table below, in th / en / ru / zh.
 *  2. Real AI: set FF_CHAT_API to the Cloudflare Worker URL (tools/chat-worker/).
 *     Every message goes to the Worker first; if it fails, the scripted reply is used,
 *     so the chat never shows an error to visitors.
 *
 * Messages are rendered with textContent only (never innerHTML).
 */
(function () {
  'use strict';

  var FF_CHAT_API = ''; // e.g. 'https://ff-chat.<your-name>.workers.dev'

  var LANGS = ['th', 'en', 'ru', 'zh'];
  var lang = 'th';

  var PERSONAS = {
    three: { name: 'Tarig', color: '#fb923c' },
    b:     { name: 'Zafar', color: '#f97316' },
    hour:  { name: 'Harun', color: '#fdba74' }
  };

  var UI = {
    talking:  { th: 'คุยกับ {n}...', en: 'Talking with {n}...', ru: 'Разговор с {n}...', zh: '正在与 {n} 聊天...' },
    pick:     { th: 'เลือกนักเดินทางด้านบนก่อนนะ', en: 'Pick a traveler above to start.', ru: 'Сначала выберите путешественника выше.', zh: '请先在上方选择一位旅行者。' },
    typing:   { th: 'กำลังพิมพ์', en: 'typing', ru: 'печатает', zh: '正在输入' }
  };

  // Suggested questions under the chat. Each one is sent as a message.
  var CHIPS = [
    { th: 'แนะนำตัวหน่อย', en: 'Who are you?', ru: 'Кто ты?', zh: '你是谁？' },
    { th: 'AI Persona คืออะไร', en: 'What is an AI Persona?', ru: 'Что такое AI-персона?', zh: '什么是 AI 分身？' },
    { th: 'อยากเรียนคอร์ส', en: 'Tell me about the program', ru: 'Хочу на курс', zh: '我想参加课程' },
    { th: 'ทิปออกกำลังกาย', en: 'Fitness tips', ru: 'Советы по тренировкам', zh: '健身建议' },
    { th: 'อยากร่วมงานด้วย', en: 'I want to collab', ru: 'Хочу сотрудничать', zh: '我想合作' }
  ];

  var LINKS = {
    program: { href: 'https://creators.thbho.com/ThInfoG.html', ext: true,
      t: { th: 'ดูตารางเรียน ↗', en: 'See the schedule ↗', ru: 'Расписание ↗', zh: '查看课程表 ↗' } },
    contact: { href: '#ff-contact', ext: false,
      t: { th: 'ไปที่ฟอร์มติดต่อ ↓', en: 'Go to the contact form ↓', ru: 'К форме связи ↓', zh: '前往联系表单 ↓' } },
    quiz:    { href: 'https://creators.thbho.com/ThBHoCreators.html#match', ext: true,
      t: { th: 'ทำแบบทดสอบจับคู่ persona ↗', en: 'Take the persona match quiz ↗', ru: 'Тест на совпадение с персоной ↗', zh: '分身匹配测试 ↗' } },
    youtube: { href: 'https://youtube.com/playlist?list=PLXigNrjSidjvZtGKhEPsZRRL_nEPSVgoy', ext: true,
      t: { th: 'ดูวิดีโอบน YouTube ↗', en: 'Watch on YouTube ↗', ru: 'Смотреть на YouTube ↗', zh: '在 YouTube 观看 ↗' } },
    vr:      { href: 'https://creators.thbho.com/O2OEventsVR.html', ext: true,
      t: { th: 'ดูแผน O2O · VR ↗', en: 'See the O2O · VR plan ↗', ru: 'План O2O · VR ↗', zh: '查看 O2O · VR 计划 ↗' } },
    team:    { href: 'https://creators.thbho.com/Th3Trainers.html', ext: true,
      t: { th: 'ดูโปรไฟล์ทั้งสามคน ↗', en: 'Meet all three ↗', ru: 'Профили всех троих ↗', zh: '查看三位的资料 ↗' } }
  };

  // Intent detection. Latin words use word starts; Thai, Chinese and Russian use substrings.
  var INTENTS = [
    { id: 'thanks',  link: null,      re: /\bthank|\bthx\b|ขอบคุณ|ขอบใจ|спасиб|谢谢|感谢|多谢/ },
    { id: 'bye',     link: null,      re: /\bbye\b|\bsee you|\bgood ?night|ลาก่อน|บาย|ไปก่อน|пока|до свидан|再见|拜拜/ },
    { id: 'join',    link: 'contact', re: /\bjoin|\bcollab|\bprice|\bcost|how much|\bcontact|\bapply|\bhire|\bwork with|\bline\b|ร่วมงาน|สมัคร|ราคา|เท่าไหร่|เท่าไร|ติดต่อ|จ้าง|คอลแลป|ร่วมด้วย|сотруд|(?:^|[^а-яё])цен[аы]|стоим|сколько|связ|работ|合作|价格|多少钱|费用|联系|加入|报名/ },
    { id: 'program', link: 'program', re: /\bprogram|\bcourse|\bclass|\bschedule|\blearn|\bworkshop|\bstudy|คอร์ส|เรียน|ตาราง|โปรแกรม|อบรม|курс|расписан|обучен|урок|课程|学习|时间表|培训|课/ },
    { id: 'vr',      link: 'vr',      re: /\bvr\b|\bapp\b|\bo2o|\bevent|\bmetaverse|แอป|อีเวนต์|งานอีเว้นท์|приложен|событ|мероприят|应用|活动|虚拟现实/ },
    { id: 'persona', link: 'quiz',    re: /\bpersona|\btwin|\bai\b|\bavatar|\bdigital|50\/70\/90|\bclone|\bmbti|เพอร์โซนา|ตัวตน|แฝด|อวตาร|ดิจิทัล|персон|аватар|двойник|цифров|分身|数字|人设|化身|双胞胎/ },
    { id: 'fantasy', link: 'youtube', re: /\bfantasy|\bwarrior|\bdesert|\bgladiator|\bera\b|\btime ?travel|\bhero|\bcostume|\bstory|แฟนตาซี|นักรบ|ทะเลทราย|ข้ามเวลา|ข้ามมิติ|ยุค|ฮีโร่|กลาดิเอเตอร์|เรื่องราว|фэнтез|воин|пустын|гладиатор|эпох|путешеств|герой|истори|奇幻|战士|沙漠|穿越|时代|英雄|故事|角斗士/ },
    { id: 'video',   link: 'youtube', re: /\bvideo|\bmv\b|\byoutube|\bmusic|\bsong|\bfilm|\bclip|คลิป|วิดีโอ|วีดีโอ|เพลง|หนัง|видео|музык|песн|клип|фильм|视频|音乐|歌|电影/ },
    { id: 'diet',    link: null,      re: /\bdiet|\bfood|\beat|\bprotein|\bnutrition|\bmeal|อาหาร|กิน|โปรตีน|ไดเอท|ลดน้ำหนัก|диет|питан|еда|белок|похуд|饮食|吃|蛋白|营养|减肥/ },
    { id: 'workout', link: null,      re: /\bwork ?out|\bgym|\btrain|\bexercise|\bmuscle|\bfitness|\babs\b|\bcardio|\bphysique|\bstrong|ออกกำลัง|ยิม|กล้าม|เวท|ฟิต|หุ่น|ซิกแพ็ก|คาร์ดิโอ|трениров|спорт|мышц|фитнес|пресс|качат|健身|锻炼|训练|肌肉|身材|腹肌/ },
    { id: 'who',     link: 'team',    re: /who are you|\babout you|\bintroduce|\byour name|tell me about yourself|ใคร|แนะนำตัว|ชื่ออะไร|เป็นใคร|кто ты|кто вы|расскажи о себе|представ|你是谁|介绍|你叫什么/ },
    { id: 'greet',   link: null,      re: /^\s*(hi|hello|hey|yo|hola|sup)\b|สวัสดี|หวัดดี|ดีครับ|ดีค่ะ|ดีจ้า|привет|здравств|добрый|你好|您好|嗨|哈喽/ }
  ];

  // REPLIES[intent][persona][lang]. Keep the voices: Tarig = poetic storyteller (INFP),
  // Zafar = calm strategist in steps (INFJ), Harun = short, energetic, action first (ESTP).
  var REPLIES = {
    welcome: {
      three: { th: 'ยินดีต้อนรับสู่โอเอซิส ข้าคือ Tarig นักเล่าเรื่องแห่งทะเลทราย อยากให้ข้าเล่าเรื่องไหนก่อนดี?',
               en: 'Welcome to the oasis. I am Tarig, the storyteller of the desert. Which story shall I tell you first?',
               ru: 'Добро пожаловать в оазис. Я Тариг, рассказчик пустыни. С какой истории начнём?',
               zh: '欢迎来到绿洲。我是 Tarig，沙漠的讲故事人。想先听哪个故事？' },
      b:     { th: 'สวัสดี ผมคือ Zafar นักเดินทางข้ามเวลา บอกเป้าหมายของคุณมา แล้วเราจะวางแผนไปด้วยกัน',
               en: 'Greetings. I am Zafar, the time traveler. Tell me your goal and we will plan the route together.',
               ru: 'Приветствую. Я Зафар, путешественник во времени. Назовите цель, и мы вместе проложим путь.',
               zh: '你好，我是 Zafar，时空旅行者。告诉我你的目标，我们一起规划路线。' },
      hour:  { th: 'เฮ้! Harun มาแล้ว พร้อมลุยรึยัง? ถามมาเลย ไม่ต้องเกรงใจ!',
               en: "Hey! Harun here. Ready to move? Ask me anything, don't hold back!",
               ru: 'Эй! Это Харун. Готов действовать? Спрашивай что угодно!',
               zh: '嘿！我是 Harun。准备好了吗？尽管问，别客气！' }
    },
    greet: {
      three: { th: 'สวัสดีเช่นกัน ผู้เดินทาง สายลมทะเลทรายพาคุณมาถึงที่นี่พอดี วันนี้อยากรู้เรื่องอะไร?',
               en: 'Greetings, traveler. The desert wind brought you here at the right moment. What would you like to know?',
               ru: 'Здравствуй, путник. Ветер пустыни привёл тебя вовремя. Что хочешь узнать?',
               zh: '你好，旅人。沙漠的风把你带到了这里。今天想了解什么？' },
      b:     { th: 'สวัสดีครับ ยินดีที่ได้พบ คุณสนใจเรื่อง AI Persona คอร์สเรียน หรือการร่วมงานครับ?',
               en: 'Hello, good to meet you. Are you here for the AI Persona, the program, or a collab?',
               ru: 'Здравствуйте, рад встрече. Вас интересует AI-персона, курс или сотрудничество?',
               zh: '你好，很高兴认识你。你对 AI 分身、课程还是合作感兴趣？' },
      hour:  { th: 'หวัดดี! วันนี้จะปั้นอะไรกันดี? บอกมาเลย!',
               en: "Hi! So what are we building today? Tell me!",
               ru: 'Привет! Что сегодня создаём? Говори!',
               zh: '嗨！今天我们要打造什么？快说！' }
    },
    who: {
      three: { th: 'ข้าคือ Three ในบทของ Tarig นักรบทะเลทรายและนักเล่าเรื่อง (INFP) ข้าเชื่อว่า AI คือคู่หูที่ปลดปล่อยจินตนาการของคุณ',
               en: 'I am Three, in the role of Tarig, desert warrior and storyteller (INFP). I believe AI is the partner that sets your imagination free.',
               ru: 'Я Три в роли Тарига, воина пустыни и рассказчика (INFP). Я верю, что ИИ освобождает воображение.',
               zh: '我是 Three，扮演 Tarig——沙漠战士与讲故事的人（INFP）。我相信 AI 是释放想象力的伙伴。' },
      b:     { th: 'ผมคือ B. ในบทของ Zafar นักเดินทางข้ามเวลาและนักวางกลยุทธ์ (INFJ) หน้าที่ของผมคือพาคุณจากจุดเริ่มต้นไปถึงเป้าหมายแบบเป็นขั้นตอน',
               en: 'I am B., in the role of Zafar, time traveler and strategist (INFJ). My job is to take you from start to goal, step by step.',
               ru: 'Я Би в роли Зафара, путешественника во времени и стратега (INFJ). Моя задача — провести вас к цели шаг за шагом.',
               zh: '我是 B.，扮演 Zafar——时空旅行者与策略家（INFJ）。我的任务是一步步带你实现目标。' },
      hour:  { th: 'Hour ในบท Harun ตัวจี๊ดสายแอ็กชัน (ESTP)! ทฤษฎีคืออดีต ผมชอบลงมือทำเลย',
               en: "Hour, playing Harun, the showstopper and action master (ESTP)! Theory is the past. I'd rather just do it.",
               ru: 'Хоур в роли Харуна, мастера действия (ESTP)! Теория в прошлом — я сразу делаю.',
               zh: '我是 Hour，扮演 Harun——动作派明星（ESTP）！理论是过去式，我更喜欢直接行动。' }
    },
    persona: {
      three: { th: 'AI Persona คือแฝดดิจิทัลที่ยังเป็นตัวคุณ เราใช้กฎ 50/70/90 คือใบหน้า 50% ร่างกาย 70% และเสียง 90% แล้วพาตัวตนนั้นไปเดินทางในโลกแฟนตาซี',
               en: 'An AI Persona is a digital twin that is still you. We follow the 50/70/90 rule: 50% face, 70% body, 90% voice, then send that self on a fantasy journey.',
               ru: 'AI-персона — цифровой двойник, который остаётся вами. Правило 50/70/90: лицо 50%, тело 70%, голос 90%, а дальше — путешествие в фэнтези.',
               zh: 'AI 分身是依然属于你的数字双胞胎。我们遵循 50/70/90 法则：脸 50%、身体 70%、声音 90%，然后让它踏上奇幻旅程。' },
      b:     { th: 'สร้าง AI Persona มี 3 ขั้น: 1) ถ่ายใบหน้า ร่างกาย และเสียงจริงของคุณ 2) ผสมกับ AI ตามกฎ 50/70/90 3) วางเรื่องราวและช่องทางเผยแพร่ ลองทำแบบทดสอบว่าคุณเข้ากับ persona ไหนก่อนก็ได้ครับ',
               en: 'Building an AI Persona takes three steps: 1) capture your real face, body and voice, 2) blend them with AI by the 50/70/90 rule, 3) plan the story and channels. You can start with the persona match quiz.',
               ru: 'Три шага: 1) снимаем ваше лицо, тело и голос, 2) смешиваем с ИИ по правилу 50/70/90, 3) планируем историю и каналы. Можно начать с теста на совпадение.',
               zh: '打造 AI 分身分三步：1）采集你真实的脸、身体和声音；2）按 50/70/90 法则与 AI 融合；3）规划故事和发布渠道。可以先做分身匹配测试。' },
      hour:  { th: 'ง่ายๆ คือมีอีกตัวคุณเวอร์ชันหนังฮอลลีวูด! ถ่ายจริงน้อยลง ได้งานเท่ขึ้น ไปลองแบบทดสอบจับคู่เลย!',
               en: "Simple: another you, Hollywood edition! Fewer real shoot days, way cooler results. Go try the match quiz!",
               ru: 'Проще говоря: ещё один ты, голливудская версия! Меньше съёмок, круче результат. Пройди тест!',
               zh: '简单说：好莱坞版的另一个你！实拍更少，效果更酷。去做匹配测试吧！' }
    },
    fantasy: {
      three: { th: 'ในโลกของเรา คุณเป็นได้ทั้งกลาดิเอเตอร์ นักรบทะเลทราย หรือฮีโร่แห่งอนาคต ทุกยุคมีเรื่องรอให้เล่า ดูตัวอย่างการเดินทางของเราในวิดีโอได้เลย',
               en: 'In our world you can be a gladiator, a desert warrior or a hero of the future. Every era has a story waiting. See our journeys in the videos.',
               ru: 'В нашем мире вы можете стать гладиатором, воином пустыни или героем будущего. У каждой эпохи есть своя история.',
               zh: '在我们的世界里，你可以是角斗士、沙漠战士或未来英雄。每个时代都有等待讲述的故事。看看我们的视频吧。' },
      b:     { th: 'การข้ามเวลาใช้แค่ 3 วินาทีในโลก AI เลือกยุคที่สะท้อนตัวตนของคุณ แล้วเราจะสร้างเรื่องราวต่อเนื่องหลายตอน',
               en: 'Time travel takes three seconds in the AI world. Choose the era that reflects who you are, and we build a continuing story across episodes.',
               ru: 'В мире ИИ путешествие во времени занимает три секунды. Выберите эпоху, отражающую вас, и мы построим историю из нескольких эпизодов.',
               zh: '在 AI 世界里，穿越时空只需三秒。选择最能体现你的时代，我们会打造连续多集的故事。' },
      hour:  { th: 'ชุดเกราะ ทะเลทราย ฉากระเบิดตูม! เลือกมาเลยว่าอยากเป็นฮีโร่ยุคไหน แล้วไปดูคลิปเราก่อน!',
               en: "Armor, desert, big action scenes! Pick the era you want to be a hero in, then check out our clips!",
               ru: 'Доспехи, пустыня, эпичные сцены! Выбирай эпоху и посмотри наши клипы!',
               zh: '盔甲、沙漠、大场面！选好你想当英雄的时代，先去看看我们的视频！' }
    },
    program: {
      three: { th: 'โปรแกรมปั้น AI Persona & Fantasy สอนการผสานร่างกายจริงของคุณเข้ากับเรื่องเล่าแบบภาพยนตร์ ตารางเรียนทั้งหมดอยู่ในลิงก์นี้',
               en: 'The AI Persona & Fantasy Sculpting program teaches you to blend your real physique with cinematic storytelling. The full schedule is here.',
               ru: 'Программа AI Persona & Fantasy учит соединять реальную форму с кинематографичной историей. Полное расписание по ссылке.',
               zh: 'AI 分身与奇幻塑造课程教你把真实身材与电影级故事结合。完整课程表在这里。' },
      b:     { th: 'แนะนำลำดับนี้ครับ: ดูตารางเรียน เลือกรอบที่สะดวก แล้วฝากข้อมูลในฟอร์มติดต่อท้ายหน้า ทีมจะติดต่อกลับ',
               en: 'I suggest this order: check the schedule, pick a session that fits, then leave your details in the contact form at the bottom. The team will get back to you.',
               ru: 'Порядок такой: посмотрите расписание, выберите удобную сессию и оставьте данные в форме внизу страницы.',
               zh: '建议顺序：查看课程表，选择合适的场次，然后在页面底部的联系表单留下信息，团队会联系你。' },
      hour:  { th: 'อยากเรียนใช่มั้ย? ไปดูตารางเลย เลือกรอบแล้วจัดไป!',
               en: 'Want in? Check the schedule, pick a session, let\'s go!',
               ru: 'Хочешь учиться? Смотри расписание, выбирай дату — и вперёд!',
               zh: '想学？去看课程表，选个场次，冲！' }
    },
    join: {
      three: { th: 'ทุกการร่วมงานเริ่มจากบทสนทนา เล่าความฝันของคุณผ่านฟอร์มติดต่อท้ายหน้านี้ แล้วเราจะเขียนบทต่อไปด้วยกัน',
               en: 'Every collaboration begins with a conversation. Share your dream through the contact form at the bottom of this page, and we will write the next chapter together.',
               ru: 'Любое сотрудничество начинается с разговора. Расскажите о мечте в форме внизу страницы.',
               zh: '每一次合作都从一次对话开始。通过页面底部的联系表单分享你的梦想，我们一起写下一章。' },
      b:     { th: 'เรื่องราคาและรูปแบบงานขึ้นกับโปรเจกต์ครับ ฝาก Line หรือเบอร์โทรในฟอร์มติดต่อท้ายหน้า แล้วทีมจะส่งรายละเอียดให้ หรืออีเมล threeandhour@gmail.com',
               en: 'Pricing and format depend on the project. Leave your Line or phone in the contact form at the bottom and the team will send details, or email threeandhour@gmail.com.',
               ru: 'Цена и формат зависят от проекта. Оставьте Line или телефон в форме внизу, или напишите на threeandhour@gmail.com.',
               zh: '价格和合作方式视项目而定。在页面底部表单留下 Line 或电话，团队会发送详情，也可发邮件至 threeandhour@gmail.com。' },
      hour:  { th: 'จัดไป! กรอกฟอร์มท้ายหน้าเลย แล้วมาปั้นตำนานด้วยกัน!',
               en: "Let's do it! Fill in the form at the bottom and let's build a legend together!",
               ru: 'Погнали! Заполни форму внизу — и создадим легенду вместе!',
               zh: '来吧！填写页面底部的表单，我们一起打造传奇！' }
    },
    vr: {
      three: { th: 'เรากำลังสร้างโลกที่คุณก้าวเข้าไปได้จริง ทั้งงานอีเวนต์ออนไลน์และออฟไลน์ และแอป VR ดูแผนทั้งหมดได้ที่นี่',
               en: 'We are building a world you can step into: online and offline events and a VR app. The whole plan is here.',
               ru: 'Мы строим мир, в который можно войти: онлайн- и офлайн-события и VR-приложение. Весь план здесь.',
               zh: '我们正在打造一个你可以走进去的世界：线上线下活动和 VR 应用。完整计划在这里。' },
      b:     { th: 'แผน O2O · VR เชื่อมงานอีเวนต์จริงเข้ากับโลกออนไลน์ เป็นขั้นต่อไปหลังจาก AI Persona ครับ รายละเอียดอยู่ในลิงก์นี้',
               en: 'The O2O · VR plan connects real events with the online world. It is the next stage after the AI Persona. Details are here.',
               ru: 'План O2O · VR соединяет реальные события с онлайн-миром — следующий этап после AI-персоны.',
               zh: 'O2O · VR 计划把线下活动与线上世界连接起来，是 AI 分身之后的下一步。详情在这里。' },
      hour:  { th: 'VR มาแน่! ไปดูแผนก่อน แล้วเจอกันในโลกเสมือน!',
               en: 'VR is coming! Check the plan and see you in the virtual world!',
               ru: 'VR уже скоро! Смотри план — увидимся в виртуальном мире!',
               zh: 'VR 就要来了！先看看计划，虚拟世界见！' }
    },
    video: {
      three: { th: 'ทุกคลิปคือบันทึกการเดินทางของพวกเรา ดูทั้งหมดได้ใน YouTube playlist นี้',
               en: 'Every clip is a page from our travel journal. Watch them all in this YouTube playlist.',
               ru: 'Каждый клип — страница нашего дневника путешествий. Все они в этом плейлисте.',
               zh: '每个视频都是我们旅程日记的一页。在这个 YouTube 播放列表里观看全部。' },
      b:     { th: 'แนะนำเริ่มจากคลิปในแกลเลอรีบนหน้านี้ แล้วค่อยดู playlist เต็มบน YouTube ครับ',
               en: 'Start with the gallery on this page, then watch the full playlist on YouTube.',
               ru: 'Начните с галереи на этой странице, потом смотрите полный плейлист на YouTube.',
               zh: '建议先看本页的视频画廊，再去 YouTube 看完整播放列表。' },
      hour:  { th: 'คลิปเพียบ! เปิด YouTube เลย แล้วเปิดเสียงดังๆ!',
               en: 'Tons of clips! Open YouTube and turn the volume up!',
               ru: 'Куча клипов! Открывай YouTube и делай погромче!',
               zh: '视频超多！打开 YouTube，把音量调大！' }
    },
    workout: {
      three: { th: 'ร่างกายคือผืนผ้าใบของเรื่องราว ฝึกสม่ำเสมอ พักให้พอ และฟังร่างกายตัวเอง ถ้าอยากได้แผนเฉพาะตัว ปรึกษาเทรนเนอร์ตัวจริงจะดีที่สุด',
               en: 'Your body is the canvas of your story. Train consistently, rest well and listen to your body. For a personal plan, a real trainer is your best guide.',
               ru: 'Тело — холст вашей истории. Тренируйтесь регулярно, отдыхайте и слушайте себя. Для личного плана лучше обратиться к живому тренеру.',
               zh: '身体是你故事的画布。坚持训练、好好休息、倾听身体。想要个人计划，最好咨询真正的教练。' },
      b:     { th: 'หลักง่ายๆ ครับ: ฝึกให้ครบทุกส่วนในแต่ละสัปดาห์ เพิ่มความหนักทีละน้อย และนอนให้พอ ส่วนตารางเฉพาะตัว ควรให้เทรนเนอร์ที่เห็นร่างกายคุณจริงเป็นคนวางครับ',
               en: 'Simple principles: train every muscle group across the week, increase the load gradually and sleep enough. A personal routine should come from a trainer who can see you in person.',
               ru: 'Принципы простые: прорабатывайте все группы мышц за неделю, постепенно увеличивайте нагрузку и высыпайтесь. Личный план — у тренера, который видит вас вживую.',
               zh: '原则很简单：每周练到所有肌群，逐步增加强度，保证睡眠。个人训练计划应由能亲眼看到你的教练来定。' },
      hour:  { th: 'ลุกขึ้นมาขยับ! ทำท่าพื้นฐานให้ถูก ค่อยๆ เพิ่มน้ำหนัก วอร์มก่อนทุกครั้ง แล้วหุ่นจะตามมาเอง!',
               en: 'Get up and move! Nail the basic lifts, add weight slowly, always warm up, and the physique will follow!',
               ru: 'Вставай и двигайся! Освой базу, добавляй вес постепенно, всегда разминайся — и форма придёт!',
               zh: '动起来！练好基础动作，慢慢加重量，每次都要热身，身材自然会来！' }
    },
    diet: {
      three: { th: 'อาหารคือเชื้อเพลิงของการเดินทาง กินอาหารจริงหลากหลาย ดื่มน้ำให้พอ และอย่าลงโทษตัวเอง ถ้าอยากได้แผนเฉพาะตัว ปรึกษานักโภชนาการนะ',
               en: 'Food is the fuel of the journey. Eat a variety of real food, drink enough water, and be kind to yourself. For a personal plan, talk to a nutritionist.',
               ru: 'Еда — топливо путешествия. Ешьте разнообразно, пейте воду и будьте добры к себе. Личный план — у диетолога.',
               zh: '食物是旅程的燃料。吃多样的天然食物，多喝水，善待自己。想要个人计划，请咨询营养师。' },
      b:     { th: 'แนวทางทั่วไปครับ: มีโปรตีนในทุกมื้อ ผักเยอะๆ ลดของหวานและอาหารแปรรูป ส่วนปริมาณที่เหมาะกับคุณ ควรให้นักโภชนาการหรือแพทย์ช่วยดูครับ',
               en: 'General guidance: some protein at every meal, plenty of vegetables, less sugar and processed food. The right amounts for you are best set with a nutritionist or doctor.',
               ru: 'В общем: белок в каждом приёме пищи, много овощей, меньше сладкого и переработанного. Точные объёмы — с диетологом или врачом.',
               zh: '一般建议：每餐都有蛋白质，多吃蔬菜，少糖少加工食品。适合你的份量最好请营养师或医生来定。' },
      hour:  { th: 'กินให้ดี ไม่ต้องอด! โปรตีน ผัก น้ำเปล่า จบ! รายละเอียดเฉพาะตัวถามโค้ชหรือหมอนะ',
               en: "Eat well, don't starve! Protein, veggies, water, done! For details that fit you, ask a coach or doctor.",
               ru: 'Ешь хорошо, не голодай! Белок, овощи, вода — всё! Детали — у тренера или врача.',
               zh: '好好吃，别挨饿！蛋白质、蔬菜、水，搞定！具体方案问教练或医生。' }
    },
    thanks: {
      three: { th: 'ด้วยความยินดี ขอให้โอเอซิสนำทางคุณเสมอ',
               en: 'With pleasure. May the oasis always guide you.',
               ru: 'С удовольствием. Пусть оазис всегда ведёт тебя.',
               zh: '不客气。愿绿洲永远为你指引方向。' },
      b:     { th: 'ยินดีครับ มีอะไรถามต่อได้เสมอ',
               en: 'You are welcome. Ask me anything else anytime.',
               ru: 'Пожалуйста. Спрашивайте в любое время.',
               zh: '不客气，随时可以继续问我。' },
      hour:  { th: 'สบายมาก! ไปลุยกันต่อ!',
               en: 'No problem! Keep going!',
               ru: 'Без проблем! Вперёд!',
               zh: '小事一桩！继续冲！' }
    },
    bye: {
      three: { th: 'ลาก่อน ผู้เดินทาง แล้วพบกันใหม่ใต้ดวงดาวแห่งทะเลทราย',
               en: 'Farewell, traveler. Until we meet again under the desert stars.',
               ru: 'Прощай, путник. До встречи под звёздами пустыни.',
               zh: '再见，旅人。愿我们在沙漠星空下再会。' },
      b:     { th: 'แล้วพบกันใหม่ครับ ขอให้แผนของคุณสำเร็จ',
               en: 'See you again. Good luck with your plan.',
               ru: 'До встречи. Удачи с вашим планом.',
               zh: '下次见，祝你的计划顺利。' },
      hour:  { th: 'บาย! เจอกันในคลิปหน้า!',
               en: 'Bye! See you in the next clip!',
               ru: 'Пока! Увидимся в следующем клипе!',
               zh: '拜！下个视频见！' }
    },
    fallback: {
      three: { th: 'คำถามของคุณเหมือนผืนทรายที่ยังไม่มีรอยเท้า ข้ายังตอบเรื่องนี้ไม่ได้ ลองถามเรื่อง AI Persona การเดินทางข้ามยุค คอร์สเรียน หรือการร่วมงานดูนะ',
               en: 'Your question is like sand without footprints yet; I cannot answer that one. Try asking about the AI Persona, time travel, the program or a collab.',
               ru: 'Твой вопрос как песок без следов — на него я пока не отвечу. Спроси об AI-персоне, путешествиях во времени, курсе или сотрудничестве.',
               zh: '你的问题像还没有脚印的沙地，我暂时回答不了。可以问问 AI 分身、穿越时代、课程或合作。' },
      b:     { th: 'เรื่องนี้ผมยังไม่มีข้อมูลครับ ผมช่วยได้เรื่อง AI Persona คอร์สเรียน การออกกำลังกาย และการร่วมงาน หรือฝากคำถามในฟอร์มท้ายหน้าได้เลย',
               en: 'I do not have information on that yet. I can help with the AI Persona, the program, training and collabs, or you can leave your question in the form below.',
               ru: 'Пока у меня нет информации об этом. Могу помочь с AI-персоной, курсом, тренировками и сотрудничеством.',
               zh: '这方面我暂时没有资料。我可以帮你了解 AI 分身、课程、训练和合作，也可以在下方表单留言。' },
      hour:  { th: 'อันนี้ผมไม่รู้แฮะ! ลองกดคำถามด้านล่างดู หรือถามเรื่องหุ่น คอร์ส หรือร่วมงานมาเลย!',
               en: "That one's beyond me! Tap a question below, or ask about training, the program or collabs!",
               ru: 'Тут я не в теме! Нажми вопрос ниже или спроси про тренировки, курс или сотрудничество!',
               zh: '这个我不懂！点下面的问题，或者问问训练、课程、合作吧！' }
    }
  };

  // ── DOM ──
  var btns = document.querySelectorAll('.persona-btn');
  var win = document.getElementById('chat-window');
  var input = document.getElementById('chat-input');
  var send = document.getElementById('send-chat-btn');
  var chipsBox = document.getElementById('chat-chips');
  if (!win || !input || !send) return;

  var active = null;
  var history = [];
  var busy = false;

  function pick(table) { return (table && (table[lang] || table.en)) || ''; }

  function scrollDown() { win.scrollTop = win.scrollHeight; }

  function bubble(type) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + type;
    win.appendChild(div);
    return div;
  }

  function addUser(text) {
    bubble('user').textContent = text;
    scrollDown();
  }

  function addPersona(text, linkKey) {
    var p = PERSONAS[active];
    var div = bubble('persona');
    var name = document.createElement('span');
    name.className = 'font-bold block mb-1 text-xs';
    name.style.color = p.color;
    name.textContent = p.name;
    div.appendChild(name);
    var body = document.createElement('span');
    body.className = 'chat-text';
    body.textContent = text;
    div.appendChild(body);
    var l = linkKey && LINKS[linkKey];
    if (l) {
      var a = document.createElement('a');
      a.className = 'chat-link';
      a.href = l.href;
      a.textContent = pick(l.t);
      if (l.ext) { a.target = '_blank'; a.rel = 'noopener'; }
      div.appendChild(a);
    }
    scrollDown();
  }

  function typingOn() {
    var div = bubble('persona chat-typing');
    div.setAttribute('aria-label', pick(UI.typing));
    for (var i = 0; i < 3; i++) div.appendChild(document.createElement('i'));
    scrollDown();
    return div;
  }

  function detect(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i].re.test(t)) return INTENTS[i];
    }
    return { id: 'fallback', link: null };
  }

  function scripted(text) {
    var it = detect(text);
    return { text: pick(REPLIES[it.id][active]), link: it.link };
  }

  function askWorker(text) {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 20000) : null;
    return fetch(FF_CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona: active, lang: lang, history: history.slice(-10), message: text }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('status ' + r.status);
      return r.json();
    }).then(function (d) {
      if (!d || typeof d.reply !== 'string' || !d.reply.trim()) throw new Error('empty');
      return { text: d.reply.trim(), link: detect(text).link };
    }).finally(function () { if (timer) clearTimeout(timer); });
  }

  function setBusy(on) {
    busy = on;
    send.disabled = on || !active;
  }

  function handleSend(textArg) {
    var text = (typeof textArg === 'string' ? textArg : input.value).trim().slice(0, 500);
    if (!text || busy) return;
    if (!active) { input.placeholder = pick(UI.pick); return; }
    input.value = '';
    addUser(text);
    setBusy(true);
    var dots = typingOn();
    var started = Date.now();
    var job = FF_CHAT_API
      ? askWorker(text).catch(function () { return scripted(text); })
      : Promise.resolve(scripted(text));
    job.then(function (res) {
      var wait = Math.max(0, (FF_CHAT_API ? 0 : 700) - (Date.now() - started));
      setTimeout(function () {
        dots.remove();
        addPersona(res.text, res.link);
        history.push({ role: 'user', text: text }, { role: 'model', text: res.text });
        setBusy(false);
        input.focus({ preventScroll: true });
      }, wait);
    });
    try { if (window.gtag) window.gtag('event', 'chat_message', { persona: active, mode: FF_CHAT_API ? 'ai' : 'scripted' }); } catch (e) {}
  }

  function renderChips() {
    if (!chipsBox) return;
    chipsBox.textContent = '';
    chipsBox.hidden = !active;
    CHIPS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat-chip';
      b.textContent = pick(c);
      b.addEventListener('click', function () { handleSend(pick(c)); });
      chipsBox.appendChild(b);
    });
  }

  function start(key) {
    active = key;
    history = [];
    btns.forEach(function (b) {
      var on = b.dataset.persona === key;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    input.disabled = false;
    setBusy(false);
    win.textContent = '';
    input.placeholder = pick(UI.talking).replace('{n}', PERSONAS[key].name);
    addPersona(pick(REPLIES.welcome[key]), null);
    renderChips();
    input.focus({ preventScroll: true });
    try { if (window.gtag) window.gtag('event', 'persona_open', { persona: key, where: 'fitfantasy_chat' }); } catch (e) {}
  }

  btns.forEach(function (b) {
    b.addEventListener('click', function () { if (!busy) start(b.dataset.persona); });
  });
  send.addEventListener('click', function () { handleSend(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); handleSend(); }
  });

  // Follow the page's language buttons.
  var orig = window.setLanguage;
  if (typeof orig === 'function') {
    window.setLanguage = function (l) {
      orig.apply(this, arguments);
      if (LANGS.indexOf(l) > -1) lang = l;
      if (active) {
        input.placeholder = pick(UI.talking).replace('{n}', PERSONAS[active].name);
        renderChips();
      }
    };
  }
  var cur = document.querySelector('.lang-btn.active');
  if (cur && cur.id) { var l0 = cur.id.replace('lang-', ''); if (LANGS.indexOf(l0) > -1) lang = l0; }
})();
