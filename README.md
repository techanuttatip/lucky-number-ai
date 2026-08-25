# 🔮 LUCKY SIM AI — ระบบ AI ค้นหา + วิเคราะห์เบอร์มงคลอัตโนมัติ

> ระบบเว็บแอปพลิเคชันค้นหา วิเคราะห์ และจัดอันดับเบอร์โทรศัพท์มงคลตามหลักเลขศาสตร์ไทยประยุกต์แบบ **Deterministic Rule Engine (0–100 คะแนน)** ผสานพลัง **OpenAI AI Judge (Second Opinion)** และระบบดึงข้อมูลเบอร์อัตโนมัติจาก AIS Online Store และพันธมิตรเครือข่าย

---

## 🧱 Core Tech Stack

| Layer | Technology | หน้าที่ |
|---|---|---|
| **Frontend & UI** | **Next.js 14 (App Router) + TypeScript + Tailwind CSS** | ระบบเว็บแอปพลิเคชัน Responsive ธีม Dark/Gold/Emerald |
| **Backend & APIs** | **Next.js API Routes** | ประมวลผล Endpoint `/api/hunt`, `/api/analyze`, `/api/wizard-ai`, `/api/numbers` |
| **Database & Realtime**| **Supabase PostgreSQL & Realtime** | จัดเก็บเบอร์, Rules 00-99, Search Jobs, และอัปเดตผล Live |
| **AI Layer** | **OpenAI API (GPT-4o / GPT-4o-mini)** | สังเคราะห์ Second Opinion, สรุปจุดเด่นและข้อควรระวัง |
| **Scoring Engine** | **TypeScript Deterministic Engine** | คำนวณคะแนนแม่นยำ 100% ตรวจคู่เลขอัปมงคล และเลขกาลกิณีประจำวันเกิด |
| **Automation** | **Playwright + AIS Store Scraper** | ระบบบอทออกไปสแกนเบอร์จาก AIS Store และแหล่งข้อมูลออนไลน์ |

---

## 🤖 สถาปัตยกรรมการทำงาน (Pipeline Architecture)

```
                       USER / Search Wizard
                                ↓
                        ┌─────────────┐
                        │  MASTER AI  │ (Natural Language / Wizard)
                        └──────┬──────┘
                               ↓
         ┌─────────────────────┼─────────────────────┐
         ↓                     ↓                     ↓
   Number Hunter        Number Analyzer        Source Agent
         ↓                     ↓                     ↓
    AIS 5G Store        Pair / Rule Engine      Web Sources
                               ↓
                         Career / Birth
                               ↓
                          Score Engine (0–100)
                               ↓
                            AI Judge (Second Opinion)
                               ↓
                          TOP NUMBERS (S-Tier / A-Tier)
```

---

## 📐 กฎและการคำนวณคะแนน (Deterministic Scoring Engine)

1. **คุณภาพคู่เลข 7 หลักท้าย (35%):**
   - วิเคราะห์คู่ตัวเลข 6 คู่ เช่น `08x-ABC-DEFG` -> `AB, BC, CD, DE, EF, FG`
   - คู่อัปมงคลร้ายแรง (13, 31, 18, 81, 07, 70, 08, 80, 03, 30, 37, 73, 27, 72) จะถูกตัดคะแนนหนักและจำกัดสิทธิ์จาก TOP Tier ทันที
2. **ผลรวมเบอร์ 10 หลัก (20%):**
   - คำนวณผลรวมทั้ง 10 หลัก (เช่น 36, 41, 42, 45, 51, 54, 56, 59, 63, 65 = เกรด A+/A)
3. **ทักษาประจำวันเกิด 8 วัน (20%):**
   - ตรวจเลขเดช ศรี มูละ มนตรี และ **เลขกาลกิณีประจำวันเกิด**
   - อาทิตย์ (ห้าม 6), จันทร์ (ห้าม 1), อังคาร (ห้าม 2), พุธกลางวัน (ห้าม 3), พุธกลางคืน (ห้าม 5), พฤหัส (ห้าม 7), ศุกร์ (ห้าม 7, 8), เสาร์ (ห้าม 4)
4. **ความสอดคล้องกับอาชีพและเป้าหมาย (25%):**
   - 10 กลุ่มสายอาชีพ (ค้าขาย/เซลล์, ผู้บริหาร, โปรแกรมเมอร์/ไอที, การเงิน/หุ้น, อินฟลู/บันเทิง, ข้าราชการ, หมอ/พยาบาล ฯลฯ)

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. เข้าสู่โฟลเดอร์โปรเจกต์
cd lucky-number-ai

# 2. ติดตั้ง Dependencies
npm install

# 3. ตั้งค่าตัวแปรในไฟล์ .env.local
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 4. รัน Development Server
npm run dev
```

เปิดบราวเซอร์ที่: `http://localhost:3000`

---

## 🗄️ Supabase Database Migration

นำไฟล์ `supabase/migrations/20260825_init_schema.sql` ไป Execute ใน **Supabase SQL Editor** เพื่อสร้างตารางทั้ง 12 ตาราง พร้อม RLS Policies และ Realtime Publication

---

## 📋 แผนผังหน้าจอของระบบ

- **`/` (หน้าแรก):** ภาพรวมสถิติ, Quick Analyzer ทดสอบเบอร์ใดๆ ทันที, และเบอร์เด่นประจำวัน
- **`/wizard` (AI Wizard):** ระบบผู้ช่วยค้นหาเบอร์ 4 ขั้นตอน พร้อมโหมดพิมพ์สั่ง Master AI
- **`/numbers` (คลังเบอร์ Live):** ตารางและแคตตาล็อกเบอร์สดจาก AIS พร้อมตัวกรองหลายมิติ
- **`/numbers/[id]` (เจาะลึกเบอร์):** หน้า Inspector ถอดรหัสคู่เลขทีละตำแหน่ง พร้อม AI Judge Second Opinion
- **`/hunter` (ระบบบอท):** หน้าควบคุม Scheduled Hunter Jobs และ Realtime Execution Logs
- **`/encyclopedia` (พจนานุกรม):** ฐานข้อมูลคู่เลข 00–99 และทักษา 8 วันเกิด
"# lucky-number-ai"  "# lucky-number-ai" 
