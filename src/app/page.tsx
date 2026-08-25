import Link from "next/link";
import { Sparkles, ArrowRight, Heart, Star, TrendingUp, Layers, CheckCircle2 } from "lucide-react";
import { QuickAnalyzeWidget } from "@/components/dashboard/QuickAnalyzeWidget";
import { NumberCard } from "@/components/numbers/NumberCard";
import { db } from "@/lib/store/in-memory-db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const allNumbers = db.getAllNumbers();
  const topNumbers = allNumbers
    .filter((n) => n.totalScore >= 85)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 6);

  const stats = [
    { label: "เบอร์สดในคลัง", value: `${allNumbers.length}+`, change: "สแกนจาก AIS & Telco 🌿", emoji: "📱" },
    { label: "วิเคราะห์แม่นยำ", value: "100%", change: "ตรวจทักษา & ศาสตร์ไทย 💖", emoji: "✨" },
    { label: "ผู้ช่วย AI ฉลาด", value: "Gemini 2.5", change: "มี Second Opinion คอยแนะ 🐱", emoji: "🔮" },
    { label: "เลขอัปมงคล", value: "0%", change: "กรองทิ้งหมด ปลอดภัย 100% 🛡️", emoji: "🍀" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Cute Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Pastel Floating Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-pink-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Mascot Greeting Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-bold text-pink-300 shadow-sm backdrop-blur-md mb-6 animate-float">
            <span className="text-base">🐱✨</span>
            <span>น้องมูมู AI พร้อมเสกเบอร์มงคลให้คุณแล้วน้า!</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.2]">
            หาเบอร์มงคลคู่ใจ <br className="hidden sm:block" />
            <span className="cute-gold-gradient">ปังทุกวัน รับทรัพย์รัวๆ 🌸</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ระบบอัจฉริยะที่ช่วยวิเคราะห์คู่เลขตามวันเกิดและสายงานของคุณแบบตรงจุด ปลอดภัย ไร้คู่อัปมงคล สบายใจ หายห่วงแน่นอนค่า 💖
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/wizard"
              className="btn-cute-gold w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-black text-slate-950"
            >
              <Sparkles className="h-5 w-5 fill-slate-950" />
              <span>เริ่มให้น้อง AI ช่วยเลือกเบอร์ ✨</span>
            </Link>
            <Link
              href="/numbers"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-4 text-base font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <span>📱 ส่องเบอร์ทั้งหมดในคลัง</span>
            </Link>
          </div>

          {/* Cute Stats Cards */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((st, i) => (
              <div key={i} className="cute-card p-4 text-center border-slate-800/80 transition-all hover:scale-105">
                <div className="text-2xl mb-1">{st.emoji}</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">{st.value}</div>
                <div className="text-xs font-bold text-white mt-0.5">{st.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{st.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Quick Test Widget */}
        <QuickAnalyzeWidget />

        {/* Top 6 Featured Auspicious Numbers */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
                <span>🌟 TOP LUCKY NUMBERS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                เบอร์มงคลระดับซุปเปอร์พรีเมียม <span className="cute-gold-gradient">(เกรด S & A)</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
                คัดมาแล้วว่าดีจริง ไม่มีเลขเสีย ผลรวมมงคล และมีน้อง AI ให้ความเห็นเรียบร้อย 🌸
              </p>
            </div>

            <Link
              href="/numbers"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <span>ดูเบอร์ทั้งหมดในคลัง ({allNumbers.length})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topNumbers.map((num, index) => (
              <NumberCard key={num.id} numberData={num} rank={index + 1} />
            ))}
          </div>
        </section>

        {/* 3 Step Simple Guide */}
        <section className="rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950 p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
            หาน้องเบอร์มงคลใน <span className="cute-gold-gradient">3 ขั้นตอนง่ายๆ 🐱</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-10">
            ไม่ต้องคำนวณเองให้ปวดหัว ให้น้อง AI และระบบคำนวณศาสตร์ไทยช่วยจัดการให้ครบ
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="cute-card p-6 border-slate-800 space-y-3 text-left">
              <div className="text-3xl">🎂</div>
              <h4 className="text-base font-bold text-white">1. บอกวันเกิด & อาชีพ</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ระบบจะคำนวณทักษา ตัดเลขกาลกิณี (เลขต้องห้าม) ออกอัตโนมัติ 100%
              </p>
            </div>

            <div className="cute-card p-6 border-slate-800 space-y-3 text-left">
              <div className="text-3xl">🤖</div>
              <h4 className="text-base font-bold text-white">2. AI ช่วยคัดเบอร์ปัง</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                บอทจะไปสแกนเบอร์จาก AIS Store และให้ Gemini AI ช่วยวิเคราะห์พลังงานอย่างละเอียด
              </p>
            </div>

            <div className="cute-card p-6 border-slate-800 space-y-3 text-left">
              <div className="text-3xl">🎁</div>
              <h4 className="text-base font-bold text-white">3. รับเบอร์มงคลพร้อมใช้</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ได้เบอร์ที่ส่งเสริมการงาน การเงิน และความรัก พร้อมลิงก์กดสั่งซื้อจากค่ายได้ทันที
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
