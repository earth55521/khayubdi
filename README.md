# Khayubdi OS LINE OA Connector

แอปนี้เป็นตัวอย่างสำหรับเชื่อม **LINE Official Account** เข้ากับ Khayubdi OS โดยมีหน้า dashboard, endpoint สำหรับ webhook, การตรวจ LINE signature และ logic ตอบกลับข้อความสุขภาพเบื้องต้น

## วิธีเริ่มใช้งาน

1. คัดลอกไฟล์ `.env.example` เป็น `.env`
2. ใส่ค่าจาก LINE Developers:
   - `LINE_CHANNEL_SECRET`
   - `LINE_CHANNEL_ACCESS_TOKEN`
3. รันแอป:

```powershell
.\start.ps1
```

4. เปิดหน้า dashboard:

```text
http://localhost:3000
```

## LINE Webhook

ตั้งค่า Webhook URL ใน LINE Developers เป็น:

```text
https://your-domain.com/webhook/line
```

ถ้าทดสอบบนเครื่อง local ให้ใช้ tunnel เช่น ngrok หรือ Cloudflare Tunnel แล้วนำ URL ที่ได้มาเติม path `/webhook/line`

## สิ่งที่แอปทำได้ตอนนี้

- ตรวจว่าใส่ LINE credentials แล้วหรือยัง
- รับ webhook ที่ `/webhook/line`
- ตรวจ `x-line-signature` ด้วย Channel secret
- ตอบกลับข้อความ LINE ด้วย Messaging API
- มีหน้าเว็บสำหรับคัดลอก webhook URL และทดสอบข้อความตอบกลับ

## ต่อยอดกับ Khayubdi OS

จุดถัดไปที่ควรเชื่อม:

- Food Log: แยกข้อความอาหารแล้วบันทึกมื้ออาหาร
- Weight Check-in: อ่านค่าน้ำหนักจากข้อความ
- Water: อ่านปริมาณน้ำ เช่น `ดื่มน้ำ 500 ml`
- Workout: สร้าง workout plan จากเป้าหมายของผู้ใช้
- Weekly AI Review: สรุปข้อมูลรายสัปดาห์กลับทาง LINE
