"use client";

import { useState } from "react";
import { BirthDay, CareerCategory, ScoredNumber } from "@/types";
import { Sparkles, ArrowRight, Loader2, RefreshCw, Heart } from "lucide-react";
import { NumberCard } from "../numbers/NumberCard";

export function QuickAnalyzeWidget() {
  const [phoneNumber, setPhoneNumber] = useState("0954951545");
  const [birthDay, setBirthDay] = useState<BirthDay>("sunday");
  const [career, setCareer] = useState<CareerCategory>("tech_developer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoredNumber | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 9) return;

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber,
          birthDay,
          career,
          triggerAiJudge: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error("Quick analyze failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950/95 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Decorative Pastel Glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-yellow-300 text-2xl shadow-md animate-float">
            <span>🔮</span>
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5 fill-pink-400" />
              <span>ตรวจดวงเบอร์ปัจจุบันของคุณ</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              ป้อนเบอร์โทรของคุณมาสิคะ <span className="cute-gold-gradient">เดี๋ยวหนูตรวจให้ ✨</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-0.5">
              เช็คว่ามีคู่เลขอัปมงคลไหม ตรงกับดวงวันเกิดและสายงานหรือเปล่า รู้ผลทันทีใน 1 วินาที!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              const samples = ["0954951545", "0812424656", "0987895665", "0811813107", "0866665665", "0962456542"];
              const randomNum = samples[Math.floor(Math.random() * samples.length)];
              setPhoneNumber(randomNum);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>สุ่มเบอร์ตัวอย่าง</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Phone Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <span>📱 เบอร์ที่อยากเช็ค</span>
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="เช่น 0954951545"
            maxLength={12}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-base font-mono font-bold text-white placeholder-slate-500 focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400"
          />
        </div>

        {/* Birthday Select */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <span>🎂 คุณเกิดวันไหนเอ่ย?</span>
          </label>
          <select
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value as BirthDay)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-white focus:border-pink-400 focus:outline-none"
          >
            <option value="sunday">วันอาทิตย์ (ห้ามเลข 6)</option>
            <option value="monday">วันจันทร์ (ห้ามเลข 1)</option>
            <option value="tuesday">วันอังคาร (ห้ามเลข 2)</option>
            <option value="wednesday_day">วันพุธกลางวัน (ห้ามเลข 3)</option>
            <option value="wednesday_night">วันพุธกลางคืน (ห้ามเลข 5)</option>
            <option value="thursday">วันพฤหัสบดี (ห้ามเลข 7)</option>
            <option value="friday">วันศุกร์ (ห้ามเลข 7, 8)</option>
            <option value="saturday">วันเสาร์ (ห้ามเลข 4)</option>
          </select>
        </div>

        {/* Career Select */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <span>💼 ทำงานสายไหนอยู่คะ?</span>
          </label>
          <select
            value={career}
            onChange={(e) => setCareer(e.target.value as CareerCategory)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-white focus:border-pink-400 focus:outline-none"
          >
            <option value="tech_developer">💻 โปรแกรมเมอร์ / ไอที / AI</option>
            <option value="sales_trading">🛍️ ค้าขาย / เซลล์ / นายหน้า</option>
            <option value="management_exec">👑 ผู้บริหาร / เจ้าของธุรกิจ</option>
            <option value="finance_invest">📈 การเงิน / หุ้น / บัญชี</option>
            <option value="creative_media">🎨 อินฟลู / ดารา / ศิลปะ</option>
            <option value="civil_service">🛡️ ข้าราชการ / รัฐวิสาหกิจ</option>
            <option value="medical_health">🩺 หมอ / พยาบาล / สุขภาพ</option>
            <option value="foreign_travel">✈️ งานต่างประเทศ / นำเข้า</option>
            <option value="spiritual_occult">🔮 สายมู / โหราศาสตร์</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-400 to-yellow-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg hover:shadow-pink-500/30 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>กำลังดูดวงเบอร์ให้น้า...</span>
              </>
            ) : (
              <>
                <span>วิเคราะห์ดวงเบอร์นี้</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Result Display */}
      {result && (
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
            <span>🎉 ผลวิเคราะห์จากน้องมูมู AI เรียบร้อยแล้วค่ะ:</span>
          </div>
          <NumberCard numberData={result} showAiBadge={true} />
        </div>
      )}
    </div>
  );
}
