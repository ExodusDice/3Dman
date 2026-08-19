# 3DMan Thailand - AI 3D Sculpting & Physical Print Fulfillment Platform

แพลตฟอร์มสร้างสรรค์งานประติมากรรม 3D ด้วยพลัง Meshy AI และบริการพิมพ์ชิ้นงานจริงด้วยเรซินความละเอียดสูง คาร์บอนไฟเบอร์ และทองสัมฤทธิ์หล่อแท้ พร้อมจัดส่งทั่วประเทศไทย

---

## 🌟 Key Features

- **Meshy AI 3D Studio**: สร้างโมเดล 3D จากคำสั่งภาษาไทย/อังกฤษ พร้อมสิทธิ์แก้ไขปรับแต่งได้ 3 ครั้ง
- **Interactive 360° Three.js Viewer**: หมุนดูโมเดล 3D แบบเรียลไทม์ 360 องศา พร้อมระบบวัดขนาดมิติ ($W \times D \times H$) และแสง Studio Light
- **Profit-Engine Live Pricing**: ระบบคำนวณราคาโปร่งใสตามจริง (AI Meshing, ปริมาตรและน้ำหนักกรัม, ชั่วโมงเครื่องพิมพ์, ค่าขัดแต่ง UV, และกองทุนประกัน SLA)
- **14-Day Delivery SLA & 100% Refund Guarantee**: การันตีจัดส่งถึงบ้านใน 14 วันทำการ หรือคืนเงินเต็มจำนวน 100% (สามารถขอยกเลิกและรับเงินคืนได้ตลอดเวลาก่อนเริ่มพิมพ์)
- **3-Phase Fulfillment Tracking**: ระบบติดตามสถานะ 3 ขั้นตอน พร้อมตัวนับถอยหลัง SLA แบบเรียลไทม์
  1. *ขั้นที่ 1*: แอดมินตรวจแบบ & กำหนดราคา/SLA จริง
  2. *ขั้นที่ 2*: กำลังพิมพ์ ➔ แพ็กเกจ ➔ จัดส่งพัสดุ
  3. *ขั้นที่ 3*: ลูกค้ายืนยันรับสินค้า [เสร็จสมบูรณ์]
- **Public Customer Trust Gallery**: คลังแสดงผลงาน 3D สั่งพิมพ์จริงของลูกค้า หมุนดูได้ 360 องศา พร้อมป้ายยืนยันและรีวิว
- **Admin Command Console**: ระบบจัดการแอดมิน (ผู้ใช้ `sadminwa` / `sadminwa`), แดชบอร์ดวิเคราะห์กำไรสุทธิ (Profit Analytics), อนุมัติราคาจริง, และระบบพิจารณาคืนเงิน
- **Direct Real-Time Chat**: ช่องทางแชทสดระหว่างลูกค้าและช่างพิมพ์ 3D
- **Enterprise Integrations**:
  - 🔐 **Clerk**: Authentication & Social Login (Google, Apple, GitHub)
  - ✉️ **Resend**: Transactional Emails (Order confirmation, SLA approval, Courier tracking)
  - 💳 **Stripe**: Pay-per-service Checkout Gateway
  - 🛡️ **Sentry**: APM Performance Monitoring & Error Tracking

---

## 🚀 Quick Start

### 1. ติดตั้ง Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` ไปเป็น `.env.local` และใส่ API Keys ที่ต้องการ:
```bash
cp .env.example .env.local
```

### 3. รัน Dev Server
```bash
npm run dev
```
เปิดบราวเซอร์ที่ [http://localhost:3000](http://localhost:3000)

### 4. Build Production
```bash
npm run build
npm run start
```

---

## 🔐 ข้อมูลเข้าสู่ระบบเริ่มต้น
- **แอดมินคอนโซล**: `/admin`
- **Username**: `sadminwa`
- **Password**: `sadminwa`

---

© 3DMan Thailand Co., Ltd. สงวนลิขสิทธิ์
