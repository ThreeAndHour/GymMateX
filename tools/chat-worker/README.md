# ff-chat · AI จริงสำหรับแชทใน FitFantasy.html

ตอนนี้แชทใน `FitFantasy.html` ตอบจากชุดคำตอบที่เขียนไว้ใน `fitfantasy-chat.js` (ใช้ได้เลย ไม่มีค่าใช้จ่าย)
ถ้าอยากให้ Three / B. / Hour ตอบด้วย AI จริง ให้ตั้ง Worker นี้ครั้งเดียว Gemini key จะเก็บอยู่ที่ Cloudflare
ไม่อยู่ในหน้าเว็บ คนอื่นจึงเอา key ไปใช้ไม่ได้

## สิ่งที่ต้องมี
1. Gemini API key จาก Google AI Studio (https://aistudio.google.com) ควรสร้าง key ใหม่สำหรับงานนี้โดยเฉพาะ
2. บัญชี Cloudflare (แพ็กเกจฟรีพอ)

## ตั้งค่าผ่านหน้าเว็บ Cloudflare (ไม่ต้องใช้คำสั่ง)
1. เข้า Cloudflare dashboard → Workers & Pages → สร้าง Worker ใหม่ (แบบ Hello World) ตั้งชื่อ `ff-chat`
2. เปิดแก้โค้ด ลบของเดิมออก วางเนื้อหาทั้งไฟล์ `worker.js` แล้ว Deploy
3. ไปที่ Settings ของ Worker → Variables and Secrets → เพิ่ม **Secret** ชื่อ `GEMINI_API_KEY` ใส่ key จากข้อ 1
   (ไม่บังคับ: เพิ่ม variable `MODEL` ถ้าอยากเปลี่ยนรุ่น ค่าเริ่มต้นคือ `gemini-3.8-flash`)
4. คัดลอก URL ของ Worker (รูปแบบ `https://ff-chat.<ชื่อบัญชี>.workers.dev`) ส่งให้ Claude
   Claude จะใส่ URL นี้ใน `FF_CHAT_API` บรรทัดบนสุดของ `fitfantasy-chat.js` แล้ว bump `?v=` ใน FitFantasy.html

ชื่อเมนูใน Cloudflare อาจเปลี่ยนไปบ้าง แต่ขั้นตอนเหมือนเดิม

## หรือใช้คำสั่ง (ถ้ามี Node.js)
```
cd tools/chat-worker
npx wrangler login
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY
```

## ความปลอดภัยและค่าใช้จ่าย
- Worker รับเฉพาะคำขอจาก `https://creators.thbho.com` และ `https://threeandhour.github.io`
- จำกัดข้อความละ 500 ตัวอักษร ส่งประวัติแชทไปไม่เกิน 10 ข้อความ และคำตอบสั้น (ไม่เกิน 400 token)
- แนะนำให้ตั้ง Rate limiting rule ใน Cloudflare (เช่น 20 ครั้งต่อนาทีต่อ IP) และตั้งงบหรือโควตาใน Google AI Studio
- ถ้า Worker ล่มหรือโควตาหมด หน้าเว็บจะกลับไปใช้คำตอบแบบสคริปต์เองโดยอัตโนมัติ ผู้ชมจะไม่เห็น error

## แก้บุคลิกหรือข้อมูลที่ AI รู้
แก้ข้อความ `BASE` (ข้อมูลโปรเจกต์และกติกา) และ `PERSONA` (บุคลิกแต่ละคน) ใน `worker.js` แล้ว Deploy ใหม่
