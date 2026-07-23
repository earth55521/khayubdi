# ขยับดิ Exercise Tracker

แอป tracking exercise แบบ mobile-first สำหรับบันทึกการออกกำลังกาย ดูสรุปวันนี้ ประวัติ และ progress รายสัปดาห์ พร้อมฐาน PWA และ config สำหรับต่อยอดเป็น iOS/Android app

## วิธีเปิดแอป

```powershell
.\start.ps1
```

จากนั้นเปิด:

```text
http://localhost:3000
```

ถ้าพอร์ต 3000 ถูกใช้อยู่ ให้แก้ `PORT` ใน `.env` เป็นพอร์ตอื่น เช่น `3001`

## ฟีเจอร์ในแอป

- บันทึก exercise, sets, reps, weight, minutes, notes
- timer สำหรับ workout session
- quick add สำหรับ Walking, Running, Push up, Squat
- today summary: นาที, workout, calories
- history รายการ workout
- progress 7 วัน, streak, total sessions, total volume
- profile: goal, body weight, weekly target
- export ข้อมูลเป็น JSON
- offline cache ผ่าน service worker
- login / create account / logout
- เมื่อเปิดผ่าน localhost ข้อมูล user, profile, workout จะเก็บใน backend ที่ `data/store.json`
- เมื่อเปิดไฟล์ `khayubdi-exercise-app.html` โดยตรง แอปจะใช้ local mode และเก็บข้อมูลใน browser ของเครื่องนั้น
- Client ID อัตโนมัติรูปแบบ `KHD-YYYY-XXXXXX`
- เก็บข้อมูลลูกค้า: ชื่อ, เบอร์โทร, อีเมล, วันเกิด, note
- export account รวม client profile ไปด้วย

## รองรับ App Store และ Google Play

โปรเจกต์มีไฟล์ `capacitor.config.json` สำหรับใช้ Capacitor ห่อเว็บแอปเป็น native shell:

```text
appId: com.khayubdi.tracker
appName: ขยับดิ
webDir: public
```

ดูรายการก่อนส่งขึ้น store ได้ที่ `STORE_RELEASE_CHECKLIST.md`

## LINE OA

backend เดิมสำหรับ LINE OA ยังอยู่:

```text
POST /webhook/line
GET /api/status
POST /api/test-reply
```
