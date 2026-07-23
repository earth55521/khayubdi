# ขยับดิ Store Release Checklist

ฐานแอปนี้พร้อมเป็น PWA และเตรียม config สำหรับแพ็กเป็น iOS/Android ด้วย Capacitor

## App identity

- App name: ขยับดิ
- Bundle ID / Package name: `com.khayubdi.tracker`
- Category: Health & Fitness
- Age rating: 4+ / Everyone

## ก่อนส่งขึ้น App Store และ Google Play

1. สร้าง production icon เป็น PNG ตามขนาดของ iOS/Android
2. เพิ่ม privacy policy URL
3. ระบุว่าแอปเก็บข้อมูล exercise ในเครื่องผู้ใช้ ถ้ายังไม่มี backend
4. ถ้าจะ sync cloud ต้องเพิ่ม login, database, และ data deletion flow
5. ตั้งค่า OAuth redirect URL สำหรับ Google, Apple, Facebook ให้ตรงกับ production domain
6. เปิด HTTPS ทุก environment ที่ใช้ OAuth จริง
7. เพิ่ม privacy controls, export data, delete account ใน store listing / privacy policy
8. แพ็ก native app ด้วย Capacitor:

```powershell
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "ขยับดิ" com.khayubdi.tracker --web-dir public
npx cap add ios
npx cap add android
npx cap sync
```

9. iOS ใช้ Xcode Archive แล้วส่งผ่าน App Store Connect
10. Android ใช้ Android Studio สร้าง AAB แล้วอัปโหลดผ่าน Play Console

## ฟีเจอร์ปัจจุบัน

- บันทึก exercise, sets, reps, weight, minutes, notes
- quick add สำหรับ movement หลัก
- timer ระหว่าง workout
- today summary
- workout history
- 7-day progress
- streak, total sessions, total volume
- export JSON
- offline cache ผ่าน service worker
- Google / Apple ID / Facebook OAuth scaffold
- privacy settings
- account export
- account deletion
