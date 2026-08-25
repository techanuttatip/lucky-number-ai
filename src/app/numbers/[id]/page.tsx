"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ScoredNumber, BirthDay, CareerCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { BIRTH_RULES } from "@/lib/numerology/birth-rules";
import { CAREER_RULES } from "@/lib/numerology/career-rules";
import { PairBreakdownTable } from "@/components/analysis/PairBreakdownTable";
import { AiVerdictCard } from "@/components/analysis/AiVerdictCard";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Zap,
  CheckCircle2,
  Share2,
  Heart,
  Star,
} from "lucide-react";

export default function NumberDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const numberId = params.id as string;

  const [numberData, setNumberData] = useState<ScoredNumber | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Interactive profile simulator
  const [simBirthDay, setSimBirthDay] = useState<BirthDay>("sunday");
  const [simCareer, setSimCareer] = useState<CareerCategory>("tech_developer");

  const loadNumber = async (birth?: BirthDay, car?: CareerCategory) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/numbers?id=${numberId}`);
      const data = await res.json();
      if (data.success && data.data) {
        let scored = data.data;
        if (birth || car) {
          const reScoreRes = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: scored.rawNumber,
              birthDay: birth || simBirthDay,
              career: car || simCareer,
              provider: scored.provider,
              price: scored.price,
            }),
          });
          const reData = await reScoreRes.json();
          if (reData.success) {
            scored = reData.data;
          }
        }
        setNumberData(scored);
      }
    } catch (e) {
      console.error("Failed to load number detail:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNumber();
  }, [numberId]);

  const handleSimulateChange = (b: BirthDay, c: CareerCategory) => {
    setSimBirthDay(b);
    setSimCareer(c);
    loadNumber(b, c);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading && !numberData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">🐱✨</div>
          <p className="text-xs text-pink-300">น้อง AI กำลังเปิดคัมภีร์วิเคราะห์เบอร์ให้น้า...</p>
        </div>
      </div>
    );
  }

  if (!numberData) {
    return (
      <div className="min-h-screen bg-slate-950 py-20 text-center">
        <h2 className="text-lg font-bold text-white mb-2">ไม่พบน้องเบอร์นี้ในคลังจ้า 🥺</h2>
        <Link href="/numbers" className="text-xs text-amber-300 hover:underline">
          กลับไปเลือกเบอร์อื่นที่คลัง
        </Link>
      </div>
    );
  }

  const birthInfo = BIRTH_RULES[simBirthDay];
  const careerInfo = CAREER_RULES[simCareer];
  const isS = numberData.totalScore >= 90;

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/numbers"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>กลับไปเลือกเบอร์อื่น</span>
          </Link>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copied ? "คัดลอกลิงก์แล้วน้า!" : "แชร์ความปัง 💖"}</span>
          </button>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-pink-500/25 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30">
                  🌿 {numberData.provider} 5G
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  ผลรวม <strong className="text-amber-300 font-mono text-sm">{numberData.totalSum}</strong> ({numberData.sumRule?.tier})
                </span>
                {numberData.isTopCandidate && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950">
                    <Star className="h-3 w-3 fill-slate-950" /> เกรด S ปังมาก ✨
                  </span>
                )}
              </div>

              {/* Phone Number Display */}
              <h1 className="text-4xl sm:text-6xl font-black text-white font-mono tracking-wider">
                {numberData.formattedNumber}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300/90 max-w-xl">
                ✨ {numberData.sumRule?.title} — {numberData.sumRule?.meaning}
              </p>
            </div>

            {/* Score & Buy Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3.5">
              <div className="flex items-center gap-3 bg-slate-950/90 px-5 py-3.5 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">คะแนนความมงคล</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                    {numberData.totalScore} <span className="text-xs text-slate-400 font-sans">/100</span>
                  </div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 font-black text-base border border-amber-400/30">
                  {numberData.totalScore >= 90 ? "A+" : numberData.totalScore >= 80 ? "A" : "B"}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {numberData.buyUrl && (
                  <a
                    href={numberData.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cute-gold flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-black text-slate-950"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>ไปรับเบอร์นี้ที่ค่าย ({formatCurrency(numberData.price)})</span>
                  </a>
                )}
                <a
                  href={`https://berthongsuk.in.th/%e0%b8%a7%e0%b8%b4%e0%b9%80%e0%b8%84%e0%b8%a3%e0%b8%b2%e0%b8%b0%e0%b8%ab%e0%b9%8c%e0%b9%80%e0%b8%9a%e0%b8%ad%e0%b8%a3%e0%b9%8c%e0%b8%a1%e0%b8%87%e0%b8%84%e0%b8%a5/?num=${numberData.rawNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold transition-all"
                  title="เปิดดูผลวิเคราะห์จากเว็บเบอร์ทองสุข"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>ตรวจเทียบกับเว็บเบอร์ทองสุข 🔮</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Score Breakdown Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="cute-card p-4 border-slate-800">
            <div className="text-slate-400 text-xs font-bold mb-1">1. คุณภาพคู่เลข</div>
            <div className="text-2xl font-black text-white font-mono">{numberData.pairScore}%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {numberData.dangerousPairsFound.length === 0 ? "ไร้คู่อัปมงคล 💖" : `พบคู่ ${numberData.dangerousPairsFound.join(",")}`}
            </div>
          </div>

          <div className="cute-card p-4 border-slate-800">
            <div className="text-slate-400 text-xs font-bold mb-1">2. ผลรวมเบอร์</div>
            <div className="text-2xl font-black text-amber-300 font-mono">{numberData.sumScore}%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              ผลรวม {numberData.totalSum} เกรด {numberData.sumRule?.tier}
            </div>
          </div>

          <div className="cute-card p-4 border-slate-800">
            <div className="text-slate-400 text-xs font-bold mb-1">3. ทักษาวันเกิด</div>
            <div className="text-2xl font-black text-emerald-300 font-mono">{numberData.birthScore}%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {numberData.hasKalaKinee ? `มีเลขกาลกิณี (${numberData.kalaKineeDigitsFound.join(",")})` : "ปลอดกาลกิณี 100% 🛡️"}
            </div>
          </div>

          <div className="cute-card p-4 border-slate-800">
            <div className="text-slate-400 text-xs font-bold mb-1">4. ความเข้ากันได้อาชีพ</div>
            <div className="text-2xl font-black text-pink-300 font-mono">{numberData.careerScore}%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              ตรงกับสาย {careerInfo?.titleTh.split("/")[0]}
            </div>
          </div>
        </div>

        {/* AI Judge Second Opinion Card */}
        {numberData.aiVerdict && (
          <section>
            <AiVerdictCard verdict={numberData.aiVerdict} totalScore={numberData.totalScore} />
          </section>
        )}

        {/* 7-digit Decomposed Pairs Breakdown */}
        <section className="space-y-3.5">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <span>📖 ถอดรหัสคู่เลข 7 ตัวท้าย</span>
            </h2>
            <p className="text-xs text-slate-400">
              วิเคราะห์พลังงานทีละคู่ตามหลักเลขศาสตร์ไทยประยุกต์
            </p>
          </div>

          <PairBreakdownTable pairs={numberData.decomposedPairs} />
        </section>

        {/* Energy Distribution Matrix */}
        <section className="cute-card p-6 sm:p-8 border-slate-800/80">
          <h3 className="text-base font-black text-white mb-4 flex items-center gap-2">
            <span>⚡ โปรไฟล์พลังงาน 5 มิติ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
            {[
              { label: "🪙 การเงิน & โภคทรัพย์", val: numberData.energyProfile.wealth, color: "text-amber-300", bar: "bg-amber-300" },
              { label: "💖 มหาเสน่ห์ & เมตตา", val: numberData.energyProfile.charm, color: "text-pink-300", bar: "bg-pink-300" },
              { label: "👑 อำนาจบารมี & ผู้นำ", val: numberData.energyProfile.prestige, color: "text-purple-300", bar: "bg-purple-300" },
              { label: "💡 สติปัญญา & สมาธิ", val: numberData.energyProfile.wisdom, color: "text-sky-300", bar: "bg-sky-300" },
              { label: "🍀 โชคลาภ & แคล้วคลาด", val: numberData.energyProfile.luck, color: "text-emerald-300", bar: "bg-emerald-300" },
            ].map((e, idx) => (
              <div key={idx} className="bg-slate-950/70 rounded-2xl p-3.5 border border-slate-800/70">
                <div className="text-xs text-slate-400 mb-1">{e.label}</div>
                <div className={`text-2xl font-black font-mono ${e.color}`}>{e.val}%</div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                  <div className={`${e.bar} h-1.5 rounded-full`} style={{ width: `${e.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Profile Simulator */}
        <section className="cute-card p-6 border-slate-800/80">
          <div className="mb-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>🔮 ลองสลับวันเกิดหรืออาชีพดูความเข้ากันได้</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ดูว่าถ้าเปลี่ยนไปใช้กับคนเกิดวันอื่นหรืออาชีพอื่น เบอร์นี้จะยังเหมาะอยู่ไหม
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                เลือกวันเกิดเพื่อทดสอบ
              </label>
              <select
                value={simBirthDay}
                onChange={(e) => handleSimulateChange(e.target.value as BirthDay, simCareer)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm font-medium text-white focus:border-pink-400 focus:outline-none"
              >
                {Object.entries(BIRTH_RULES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.nameTh} (กาลกิณี: {val.forbiddenDigits.join(",")})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                เลือกสายอาชีพเพื่อทดสอบ
              </label>
              <select
                value={simCareer}
                onChange={(e) => handleSimulateChange(simBirthDay, e.target.value as CareerCategory)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm font-medium text-white focus:border-pink-400 focus:outline-none"
              >
                {Object.entries(CAREER_RULES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.titleTh}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
