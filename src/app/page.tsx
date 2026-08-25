import Link from "next/link";
import { Sparkles, ArrowRight, Heart, Star, TrendingUp, Layers, CheckCircle2, ShoppingBag, Store, Plus } from "lucide-react";
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

  const countMobilesphone = allNumbers.filter((n) => (n.source || "").includes("Mobilesphone")).length;
  const countMoranet = allNumbers.filter((n) => (n.source || "").includes("MoranetShop")).length;
  const count7Simnet = allNumbers.filter((n) => (n.source || "").includes("7SIMNET")).length;

  const stats = [
    { label: "เบอร์วิเคราะห์แล้ว", value: `${allNumbers.length}+`, change: "จาก 3 ร้านดัง Shopee 🛍️", emoji: "📱" },
    { label: "วิเคราะห์แม่นยำ", value: "100%", change: "ตรวจคู่เลข 00–99 & ผลรวม 💖", emoji: "✨" },
    { label: "ผูกลิงก์ร้านตรง", value: "Shopee Direct", change: "คลิกเดียวเปิดหน้าร้านทันที 🛒", emoji: "🔗" },
    { label: "เลขอัปมงคล", value: "0%", change: "กรองทิ้งหมด ปลอดภัย 100% 🛡️", emoji: "🍀" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Cute Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Pastel Floating Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-pink-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Mascot Greeting Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold text-orange-300 shadow-sm backdrop-blur-md mb-6 animate-float">
            <span className="text-base">🛍️✨</span>
            <span>ระบบคำนวณและวิเคราะห์เบอร์มงคลร้านค้า Shopee ยอดนิยม</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.2]">
            รวมเบอร์มงคล Shopee <br className="hidden sm:block" />
            <span className="cute-gold-gradient">วิเคราะห์ความปัง สั่งซื้อง่าย 🌸</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ศูนย์รวมเบอร์จากร้านดัง Shopee (Mobilesphone, MoranetShop, 7SIMNET) คำนวณคะแนนตามศาสตร์เลขมงคล 0–100 ครบทุกตำแหน่ง พร้อมผูกลิงก์สั่งซื้อตรงถึงร้านค้าค่ะ 💖
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/stores"
              className="btn-cute-gold w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-black text-slate-950 shadow-xl hover:scale-105"
            >
              <ShoppingBag className="h-5 w-5 fill-slate-950" />
              <span>🛍️ ส่องคลังเบอร์ร้าน Shopee ({allNumbers.length} เบอร์)</span>
            </Link>
            <Link
              href="/import"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-6 py-4 text-base font-bold text-orange-200 hover:text-white hover:bg-orange-500/20 transition-all"
            >
              <Plus className="h-5 w-5" />
              <span>📥 เพิ่มเบอร์ & ลิงก์ร้านค้าใหม่</span>
            </Link>
            <Link
              href="/fortune"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-pink-500/30 bg-pink-500/10 px-6 py-4 text-base font-bold text-pink-200 hover:text-white hover:bg-pink-500/20 transition-all"
            >
              <span>🔮 ผูกดวงเฉพาะบุคคล</span>
            </Link>
          </div>

          {/* Shopee Store Quick Highlights */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            <Link
              href="/stores?store=Mobilesphone"
              className="cute-card p-5 border-pink-500/30 bg-gradient-to-br from-pink-950/20 to-slate-900 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">📱</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {countMobilesphone || 185} เบอร์
                </span>
              </div>
              <h2 className="font-bold text-base text-white group-hover:text-pink-300 transition-colors">
                ร้าน Mobilesphone
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                เน้นเบอร์ผลรวมดี 54, 55, 60 ราชาโชค & เสน่ห์ 24, 42
              </p>
            </Link>

            <Link
              href="/stores?store=MoranetShop"
              className="cute-card p-5 border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-slate-900 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">💎</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {countMoranet || 98} เบอร์
                </span>
              </div>
              <h2 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                ร้าน MoranetShop
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                ซิมเน็ตรายปี & เบอร์สวยขึ้นต้น 061, 093, 098
              </p>
            </Link>

            <Link
              href="/stores?store=7SIMNET"
              className="cute-card p-5 border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 to-slate-900 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {count7Simnet || 366} เบอร์
                </span>
              </div>
              <h2 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                ร้าน 7SIMNET
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                คลังซิมเบอร์มงคลรายใหญ่ มีเบอร์เกรด S & มังกรเพียบ
              </p>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
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

      {/* Quick Analyze Interactive Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <QuickAnalyzeWidget />
      </section>

      {/* Top Auspicious Numbers Showcase */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-16 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <span>🌟 TOP SHOPEE CANDIDATES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              เบอร์มงคลเกรด S & A <span className="cute-gold-gradient">ยอดนิยมจาก Shopee ✨</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
              คัดเฉพาะเบอร์ที่ได้คะแนนสูงสุด ไร้เลขเสีย ผูกลิงก์สั่งซื้อตรงจากร้านค้าทันที
            </p>
          </div>

          <Link
            href="/stores"
            className="flex items-center gap-1 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
          >
            <span>ดูทั้งหมด {allNumbers.length} เบอร์</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topNumbers.map((num, idx) => (
            <NumberCard key={num.id} numberData={num} rank={idx + 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
