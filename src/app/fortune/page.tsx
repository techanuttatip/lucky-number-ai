"use client";

import { useState } from "react";
import { BIRTH_RULES } from "@/lib/numerology/birth-rules";
import { CAREER_RULES } from "@/lib/numerology/career-rules";
import { BirthDay, CareerCategory, EnergyGoal, ScoredNumber } from "@/types";
import { NumberCard } from "@/components/numbers/NumberCard";
import {
  User,
  Sparkles,
  Calendar,
  Briefcase,
  Target,
  ShieldAlert,
  CheckCircle2,
  Star,
  Coins,
  Heart,
  Crown,
  Lightbulb,
  Clover,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export default function PersonalFortunePage() {
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDay, setBirthDay] = useState<BirthDay>("monday");
  const [age, setAge] = useState<number>(28);
  const [career, setCareer] = useState<CareerCategory>("management_exec");
  const [selectedGoals, setSelectedGoals] = useState<EnergyGoal[]>([
    "wealth",
    "charm_love",
  ]);
  const [budgetMax, setBudgetMax] = useState<number>(10000);
  const [provider, setProvider] = useState<string>("ALL");
  const [source, setSource] = useState<string>("ALL");

  // Results State
  const [loading, setLoading] = useState(false);
  const [fortuneData, setFortuneData] = useState<any>(null);

  const toggleGoal = (g: EnergyGoal) => {
    if (selectedGoals.includes(g)) {
      setSelectedGoals(selectedGoals.filter((item) => item !== g));
    } else {
      setSelectedGoals([...selectedGoals, g]);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/fortune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          birthDay,
          age,
          career,
          goals: selectedGoals,
          budgetMax,
          provider,
          source,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setFortuneData(json.data);
        // Scroll down to results smoothly
        setTimeout(() => {
          document.getElementById("fortune-results")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } catch (err) {
      console.error("Failed to analyze fortune:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-bold text-pink-300 animate-float">
            <span>🔮✨</span>
            <span>ระบบผูกดวงชะตา & เลขศาสตร์ชื่อ-สกุลเฉพาะบุคคล</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            วิเคราะห์ดวง & เสกเบอร์มงคล <span className="cute-gold-gradient">เฉพาะคุณ 🌸</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
            กรอกชื่อ-นามสกุล วันเกิด อายุ และอาชีพ เพื่อคำนวณกำลังเลขศาสตร์ไทยโบราณ และให้น้อง AI ค้นหาเบอร์โทรศัพท์ที่ส่งเสริมชะตาชีวิตคุณอย่างแม่นยำที่สุดค่ะ 💖
          </p>
        </div>

        {/* Profile Input Form Card */}
        <div className="cute-card p-6 sm:p-10 border-pink-500/20 shadow-2xl relative overflow-hidden">
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Step 1: Name & Surname */}
            <div className="space-y-2">
              <h2 className="text-sm font-black text-amber-300 flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>1. ข้อมูลชื่อ-นามสกุล (สำหรับถอดรหัสกำลังเลขศาสตร์)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    ชื่อจริง (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ศิริพร, ณภัทร, กานต์..."
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    นามสกุล (ภาษาไทย)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น มั่งมี, รัตนโชติ, สุขประเสริฐ..."
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Birthday & Age */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <h2 className="text-sm font-black text-pink-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>2. วันเกิด & อายุ (สำหรับเช็คทักษาปกรณ์และกาลกิณี)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    วันเกิดของคุณ
                  </label>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value as BirthDay)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none font-medium"
                  >
                    {Object.entries(BIRTH_RULES).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.nameTh} ({val.elementTh} • ห้ามเลข {val.forbiddenDigits.join(",")})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    อายุปัจจุบัน (ปี)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value, 10) || 25)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Career Category */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <h2 className="text-sm font-black text-purple-300 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>3. สายงานและอาชีพของคุณ</span>
              </h2>
              <select
                value={career}
                onChange={(e) => setCareer(e.target.value as CareerCategory)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none font-medium"
              >
                {Object.entries(CAREER_RULES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.titleTh}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 4: Goals to boost */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              <h2 className="text-sm font-black text-emerald-300 flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>4. ด้านที่อยากเสริมพลังเป็นพิเศษ (เลือกได้หลายข้อ)</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                {[
                  { key: "wealth", label: "🪙 การเงิน โภคทรัพย์", icon: Coins, color: "border-amber-400 text-amber-300 bg-amber-400/10" },
                  { key: "charm_love", label: "💖 ความรัก เสน่ห์", icon: Heart, color: "border-pink-400 text-pink-300 bg-pink-400/10" },
                  { key: "prestige_power", label: "👑 บารมี ผู้นำ", icon: Crown, color: "border-purple-400 text-purple-300 bg-purple-400/10" },
                  { key: "wisdom_study", label: "💡 สติปัญญา สมาธิ", icon: Lightbulb, color: "border-sky-400 text-sky-300 bg-sky-400/10" },
                  { key: "luck_protection", label: "🍀 โชคลาภ แคล้วคลาด", icon: Clover, color: "border-emerald-400 text-emerald-300 bg-emerald-400/10" },
                ].map((g) => {
                  const isSel = selectedGoals.includes(g.key as EnergyGoal);
                  return (
                    <button
                      type="button"
                      key={g.key}
                      onClick={() => toggleGoal(g.key as EnergyGoal)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center gap-1.5 ${
                        isSel ? g.color : "border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>{g.label}</span>
                      {isSel && <span className="text-[10px] text-pink-300">✓ เลือกแล้ว</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Budget, Provider, & Store Source */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  งบประมาณสูงสุด (บาท)
                </label>
                <select
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(parseInt(e.target.value, 10))}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                >
                  <option value={3000}>ไม่เกิน 3,000 บาท (เบอร์เริ่มต้น)</option>
                  <option value={10000}>ไม่เกิน 10,000 บาท (เบอร์สวยพรีเมียม)</option>
                  <option value={30000}>ไม่เกิน 30,000 บาท (เบอร์มังกร / เกรด VIP)</option>
                  <option value={100000}>ไม่จำกัดงบประมาณ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ค่ายสัญญาณที่ต้องการ
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                >
                  <option value="ALL">✨ ทุกค่าย (AIS, TRUE, DTAC)</option>
                  <option value="AIS">🌿 AIS 5G</option>
                  <option value="TRUE">🍒 TRUE 5G</option>
                  <option value="DTAC">🌊 DTAC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  🏪 เลือกร้านค้า / แหล่งที่มา
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full rounded-2xl border border-orange-500/40 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-orange-400 focus:outline-none font-medium"
                >
                  <option value="ALL">🏪 ทุกร้านค้า / แหล่งที่มา</option>
                  <option value="SHOPEE">🛍️ Shopee Mall & VIP</option>
                  <option value="AIS">🌿 AIS Online Store</option>
                  <option value="TRUE">🍒 True Official Store</option>
                  <option value="BERTHONGSUK">🔮 ร้านเบอร์ทองสุข</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-cute-gold w-full sm:w-auto px-10 py-4 text-sm font-black text-slate-950 shadow-xl inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>น้อง AI กำลังคำนวณกำลังเลขศาสตร์และเปิดตำราดวง...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>ผูกดวง & ค้นหาเบอร์มงคลเฉพาะตัวคุณ ✨</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RESULTS SECTION */}
        {fortuneData && (
          <div id="fortune-results" className="space-y-8 animate-fadeIn pt-4">
            {/* Top Banner: Name Numerology & Astrology Overview */}
            <div className="cute-card p-6 sm:p-8 border-pink-500/30 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
                    <span>🌸 ผลการวิเคราะห์ดวงชะตาเฉพาะบุคคล</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    คุณ {fortuneData.profile.firstName} {fortuneData.profile.lastName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    เกิดวัน{fortuneData.profile.birthRule?.nameTh} • อายุ {fortuneData.profile.age} ปี • {fortuneData.profile.careerRule?.titleTh}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">กำลังเลขศาสตร์ชื่อ</div>
                    <div className="text-2xl font-black text-amber-300 font-mono">
                      {fortuneData.nameAnalysis?.firstNameScore}
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-800" />
                  <div className="text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">กำลังรวมชื่อ-สกุล</div>
                    <div className="text-2xl font-black text-pink-300 font-mono">
                      {fortuneData.nameAnalysis?.totalNameScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Overview Matrix Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-bold">✨ ธาตุประจำตัว</div>
                  <div className="text-sm font-black text-white">{fortuneData.nameAnalysis?.element}</div>
                  <div className="text-[11px] text-slate-400">เกรดชื่อ: {fortuneData.nameAnalysis?.firstNameTier}</div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-bold">❌ กาลกิณีต้องห้าม (เด็ดขาด)</div>
                  <div className="text-sm font-black text-rose-400">
                    เลข {fortuneData.profile.birthRule?.forbiddenDigits.join(", ")}
                  </div>
                  <div className="text-[11px] text-slate-400">ห้ามมีใน 7 ตัวท้ายของเบอร์โทร</div>
                </div>

                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-bold">🌟 เลขมงคลส่งเสริมดวง</div>
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    {fortuneData.profile.birthRule?.auspiciousDigits.join(", ")}
                  </div>
                  <div className="text-[11px] text-slate-400">ช่วยเสริมบารมีและโชคลาภ</div>
                </div>
              </div>

              {/* AI Horoscope Advice Card */}
              {fortuneData.aiDestinyAnalysis && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-pink-950/40 border border-purple-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-pink-300 font-black text-sm">
                    <span>🐱 คำทำนายและคำแนะนำจากน้องมูมู AI:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {fortuneData.aiDestinyAnalysis.overview}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/20">
                      <div className="text-xs font-bold text-emerald-300 mb-1">🌟 จุดเด่นชะตาชีวิต:</div>
                      <ul className="text-[11px] text-slate-300 space-y-1">
                        {fortuneData.aiDestinyAnalysis.strengths?.map((s: string, i: number) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-500/20">
                      <div className="text-xs font-bold text-amber-300 mb-1">💡 คำแนะนำเลือกเบอร์:</div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {fortuneData.aiDestinyAnalysis.destinyAdvice}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Matched Lucky Numbers Recommendations */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <span>📱 เบอร์มงคลที่ตรงกับดวงคุณมากที่สุด (Top Matches)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    คัดสรรจากคลังเบอร์จริง ปลอดกาลกิณี 100% พร้อมคู่เลขหนุนสายงานของคุณ
                  </p>
                </div>
              </div>

              {fortuneData.topRecommendations && fortuneData.topRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fortuneData.topRecommendations.map((num: ScoredNumber, idx: number) => (
                    <NumberCard key={num.id} numberData={num} rank={idx + 1} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-center">
                  <div className="text-3xl mb-2">🥺</div>
                  <p className="text-xs text-slate-300">ไม่พบเบอร์ในงบประมาณที่เลือก ลองขยายงบประมาณดูนะคะ</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
