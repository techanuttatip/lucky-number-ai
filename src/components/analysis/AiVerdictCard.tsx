import { ScoredNumber } from "@/types";
import { Sparkles, Heart, CheckCircle2, AlertCircle, Lightbulb, UserCheck, Shield, Star } from "lucide-react";

interface AiVerdictCardProps {
  verdict: NonNullable<ScoredNumber["aiVerdict"]>;
  totalScore: number;
}

export function AiVerdictCard({ verdict, totalScore }: AiVerdictCardProps) {
  const isS = verdict.tierBadge === "S-Tier";
  const isA = verdict.tierBadge === "A-Tier";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-pink-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-400 to-yellow-300 text-3xl shadow-lg animate-float">
            <span>🐱</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                น้อง AI วิเคราะห์ความปัง 💖
              </span>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-black shadow ${
                  isS
                    ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950"
                    : isA
                    ? "bg-emerald-400 text-slate-950"
                    : "bg-sky-400 text-slate-950"
                }`}
              >
                {verdict.tierBadge} 🌟
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              {verdict.headline}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">คะแนนความเข้ากันได้</div>
            <div className="text-xl font-black text-amber-300 font-mono">
              {totalScore} <span className="text-xs text-slate-400 font-sans">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="relative z-10 py-6 border-b border-slate-800/80 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300 flex items-center gap-1.5">
          <Lightbulb className="h-4 w-4 text-amber-300" />
          <span>บทวิเคราะห์พลังงานจากน้อง AI</span>
        </h4>
        <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
          {verdict.secondOpinion}
        </div>
      </div>

      {/* Pros & Cons Section */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-800/80">
        {/* Pros */}
        <div className="space-y-3">
          <h5 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> <span>จุดเด่นความปังของเบอร์นี้ (Strengths) 🌸</span>
          </h5>
          <ul className="space-y-2">
            {verdict.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  ✓
                </span>
                <span className="pt-0.5 leading-relaxed">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons / Cautions */}
        <div className="space-y-3">
          <h5 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" /> <span>สิ่งที่ต้องรู้ไว้ก่อนน้า (Cautions) 🍀</span>
          </h5>
          <ul className="space-y-2">
            {verdict.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                  !
                </span>
                <span className="pt-0.5 leading-relaxed">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations & Target Profile */}
      <div className="relative z-10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <span className="text-pink-300 font-bold flex items-center gap-1.5 mb-1">
            <UserCheck className="h-4 w-4 text-pink-400" /> เหมาะกับใครบ้าง
          </span>
          <p className="text-slate-200 leading-relaxed">{verdict.suitableUsers}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <span className="text-amber-300 font-bold flex items-center gap-1.5 mb-1">
            <Shield className="h-4 w-4 text-amber-400" /> วิธีนำไปใช้ให้เกิดผลสูงสุด
          </span>
          <p className="text-slate-200 leading-relaxed">{verdict.recommendedActions}</p>
        </div>
      </div>
    </div>
  );
}
