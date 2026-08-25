"use client";

import { useState } from "react";
import { BIRTH_RULES } from "@/lib/numerology/birth-rules";
import { CAREER_RULES } from "@/lib/numerology/career-rules";
import { BirthDay, Career, EnergyGoal } from "@/types";
import { DualMatchResult } from "@/lib/numerology/dual-engine";
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
  ExternalLink,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function PersonalFortunePage() {
  // Form State
  const [firstName, setFirstName] = useState("ณภัทร");
  const [lastName, setLastName] = useState("มหาลาภ");
  const [birthDay, setBirthDay] = useState<BirthDay>("sunday");
  const [age, setAge] = useState<number>(28);
  const [career, setCareer] = useState<Career>("business_owner");
  const [selectedGoals, setSelectedGoals] = useState<EnergyGoal[]>([
    "wealth",
    "charm_love",
  ]);
  const [provider, setProvider] = useState<string>("ALL");
  const [source, setSource] = useState<string>("ALL");

  // Results State
  const [loading, setLoading] = useState(false);
  const [fortuneData, setFortuneData] = useState<{
    profile: any;
    nameAnalysis: any;
    aiDestinyAnalysis: any;
    totalPoolEvaluated: number;
    filteredCount: number;
    topMatches: DualMatchResult[];
    allMatches: DualMatchResult[];
  } | null>(null);

  const [copiedNum, setCopiedNum] = useState<string | null>(null);

  const toggleGoal = (g: EnergyGoal) => {
    if (selectedGoals.includes(g)) {
      setSelectedGoals(selectedGoals.filter((item) => item !== g));
    } else {
      setSelectedGoals([...selectedGoals, g]);
    }
  };

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNum(num);
    setTimeout(() => setCopiedNum(null), 3000);
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
          provider,
          source,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setFortuneData(json.data);
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

  const energyGoals = [
    { key: "wealth", label: "🪙 การเงิน & ทรัพย์สิน", color: "border-amber-500/50 bg-amber-500/10 text-amber-300" },
    { key: "charm_love", label: "💖 เสน่ห์ & เมตตามหานิยม", color: "border-pink-500/50 bg-pink-500/10 text-pink-300" },
    { key: "prestige_power", label: "👑 อำนาจ & บารมี", color: "border-purple-500/50 bg-purple-500/10 text-purple-300" },
    { key: "wisdom_peace", label: "💡 สติปัญญา & ความสุข", color: "border-sky-500/50 bg-sky-500/10 text-sky-300" },
    { key: "luck_miracle", label: "🍀 โชคลาภ & ราชาโชค", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" },
  ];

  const birthDays = [
    { key: "sunday", label: "วันอาทิตย์ (ห้ามเลข 6)", color: "border-red-500/40 text-red-300" },
    { key: "monday", label: "วันจันทร์ (ห้ามเลข 1)", color: "border-yellow-500/40 text-yellow-300" },
    { key: "tuesday", label: "วันอังคาร (ห้ามเลข 2)", color: "border-pink-500/40 text-pink-300" },
    { key: "wednesday_day", label: "วันพุธกลางวัน (ห้ามเลข 3)", color: "border-emerald-500/40 text-emerald-300" },
    { key: "wednesday_night", label: "วันพุธกลางคืน (ห้ามเลข 5)", color: "border-teal-500/40 text-teal-300" },
    { key: "thursday", label: "วันพฤหัสบดี (ห้ามเลข 7)", color: "border-orange-500/40 text-orange-300" },
    { key: "friday", label: "วันศุกร์ (ห้ามเลข 8)", color: "border-blue-500/40 text-blue-300" },
    { key: "saturday", label: "วันเสาร์ (ห้ามเลข 4)", color: "border-purple-500/40 text-purple-300" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-bold text-pink-300 animate-float">
            <span>🔮✨</span>
            <span>ระบบคำนวณ 2 ระบบ: ศาสตร์เลขศาสตร์ & โหราศาสตร์ทักษาชื่อ-สกุล</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            ผูกดวงชื่อ-สกุล & ค้นหาเบอร์ที่แมตช์ <span className="cute-gold-gradient">2 ระบบ 🌸</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 max-w-2xl mx-auto leading-relaxed">
            ระบบจะนำเบอร์โทรศัพท์ทั้งหมดที่คุณลงไว้ มาคำนวณเปรียบเทียบกับชื่อ-นามสกุล วันเกิด และสายงานของคุณ เพื่อค้นหาเบอร์ที่หนุนดวงชะตาสูงสุดค่ะ
          </p>
        </div>

        {/* Input Form Card */}
        <div className="cute-card p-6 sm:p-8 border-pink-500/30 bg-gradient-to-br from-pink-950/20 via-slate-900 to-slate-900 space-y-6">
          <form onSubmit={handleAnalyze} className="space-y-6">
            {/* Step 1: Name & Surname */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-pink-300 uppercase tracking-wider mb-3">
                <User className="h-4 w-4" />
                <span>1. ข้อมูลชื่อและนามสกุล (ถอดรหัสเลขศาสตร์พลังเงา)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">ชื่อจริง</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="เช่น ณภัทร, กิตติ, ฐิติมา..."
                    className="w-full rounded-2xl border border-pink-500/40 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">นามสกุล</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="เช่น มหาลาภ, เจริญกิจ, รวยทรัพย์..."
                    className="w-full rounded-2xl border border-pink-500/40 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Birthday & Age */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
                <Calendar className="h-4 w-4" />
                <span>2. วันเกิดและอายุ (ทักษาปกรณ์ & ตัดเลขกาลกิณี)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                {birthDays.map((bd) => (
                  <button
                    type="button"
                    key={bd.key}
                    onClick={() => setBirthDay(bd.key as BirthDay)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center ${
                      birthDay === bd.key
                        ? "bg-pink-500/25 border-pink-400 text-white shadow"
                        : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {bd.label}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-bold text-slate-200 mb-1.5">อายุปัจจุบัน (ปี)</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 18)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Step 3: Career Category */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">
                <Briefcase className="h-4 w-4" />
                <span>3. สายงานและอาชีพ (เสริมพลังเฉพาะด้าน)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: "business_owner", label: "👑 เจ้าของธุรกิจ & ค้าขาย", desc: "เสริมกำไร ทรัพย์สิน การเจรจา" },
                  { key: "trader_sales", label: "🛍️ งานขาย & แม่ค้าออนไลน์", desc: "เสริมเสน่ห์ ปิดจ็อบเร็ว ยอดขายพุ่ง" },
                  { key: "finance_investor", label: "🪙 การเงิน & นักลงทุน / หุ้น", desc: "เสริมสติปัญญา ตัดสินใจเฉียบคม" },
                  { key: "gov_officer", label: "🏛️ ข้าราชการ & รัฐวิสาหกิจ", desc: "เสริมบารมี เลื่อนขั้น ผู้ใหญ่เมตตา" },
                  { key: "management", label: "📊 ผู้บริหาร & หัวหน้างาน", desc: "เสริมอำนาจ การคุมบริวาร ความมั่นคง" },
                  { key: "tech_developer", label: "💻 ไอที / โปรแกรมเมอร์", desc: "เสริมสมาธิ ปัญญา ไหวพริบแก้ปัญหา" },
                  { key: "doctor_health", label: "🩺 หมอ / พยาบาล / สุขภาพ", desc: "เสริมความน่าเชื่อถือ เมตตา และพลังใจ" },
                  { key: "online_creator", label: "🎨 ครีเอเตอร์ / ดารา / ศิลปิน", desc: "เสริมชื่อเสียง มหาเสน่ห์ แฟนคลับ" },
                ].map((c) => (
                  <button
                    type="button"
                    key={c.key}
                    onClick={() => setCareer(c.key as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      career === c.key
                        ? "bg-purple-950/60 border-purple-400 text-white shadow"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{c.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Energy Goals */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
                <Target className="h-4 w-4" />
                <span>4. พลังงานและเป้าหมายที่ต้องการเน้นเป็นพิเศษ</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {energyGoals.map((g) => {
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

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="btn-cute-gold w-full py-4 text-base font-black text-slate-950 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>กำลังคำนวณและสแกนเบอร์ที่แมตช์ 2 ระบบ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 fill-slate-950" />
                    <span>🔮 คำนวณ 2 ระบบ & ค้นหาเบอร์ที่แมตช์กับดวงคุณที่สุด ✨</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Showcase Section */}
        {fortuneData && (
          <div id="fortune-results" className="space-y-8 animate-fadeIn">
            {/* Name Analysis Banner */}
            <div className="cute-card p-6 border-pink-500/40 bg-gradient-to-br from-pink-950/30 via-slate-900 to-slate-900 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-500/20 pb-3">
                <div>
                  <span className="text-xs font-bold text-pink-300 uppercase">🌟 ผลการถอดรหัสชื่อ-สกุลของคุณ</span>
                  <h3 className="text-2xl font-black text-white">
                    คุณ {fortuneData.profile.firstName} {fortuneData.profile.lastName}
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold self-start sm:self-auto">
                  {fortuneData.nameAnalysis.elementLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">ผลรวมชื่อจริง ({fortuneData.profile.firstName})</div>
                  <div className="text-2xl font-black text-amber-300 font-mono mt-1">
                    {fortuneData.nameAnalysis.firstNameSum}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{fortuneData.nameAnalysis.firstNameMeaning}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">ผลรวมนามสกุล ({fortuneData.profile.lastName})</div>
                  <div className="text-2xl font-black text-pink-300 font-mono mt-1">
                    {fortuneData.nameAnalysis.lastNameSum}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{fortuneData.nameAnalysis.lastNameMeaning}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-pink-500/40 text-center shadow-glow-gold">
                  <div className="text-xs text-pink-300 font-bold">ผลรวมชื่อ + สกุล (พลังชะตารวม)</div>
                  <div className="text-3xl font-black text-white font-mono mt-1">
                    {fortuneData.nameAnalysis.fullNameSum}
                  </div>
                  <div className="text-[11px] text-amber-300 font-bold mt-1">
                    {fortuneData.nameAnalysis.fullNameMeaning}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Destiny Overview Bubble */}
            {fortuneData.aiDestinyAnalysis && (
              <div className="cute-card p-6 border-purple-500/40 bg-gradient-to-br from-purple-950/25 via-slate-900 to-slate-900 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-black text-sm">
                  <span>🐱 คำทำนายดวงชะตาและคำแนะนำเบอร์มงคล (Gemini 2.5):</span>
                </div>
                <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                  {fortuneData.aiDestinyAnalysis.overview}
                </p>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-amber-200 leading-relaxed font-medium">
                  💡 {fortuneData.aiDestinyAnalysis.destinyAdvice}
                </div>
              </div>
            )}

            {/* Top Matched Numbers List */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <span>🏆 เบอร์ที่คุณลงไว้ที่แมตช์กับดวงคุณที่สุด (สแกน {fortuneData.totalPoolEvaluated} เบอร์)</span>
                </h3>
                <span className="text-xs text-slate-400">
                  คำนวณผ่าน 2 ระบบ: ศาสตร์เลขศาสตร์ + โหราศาสตร์ทักษาชื่อ-สกุล
                </span>
              </div>

              {fortuneData.topMatches.length > 0 ? (
                <div className="space-y-4">
                  {fortuneData.topMatches.map((m, idx) => (
                    <div
                      key={m.number.id}
                      className="cute-card p-5 sm:p-6 border-slate-800 hover:border-pink-500/50 bg-slate-900/90 transition-all space-y-4"
                    >
                      {/* Match Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 font-mono font-black text-slate-950 text-sm shadow">
                            #{idx + 1}
                          </span>
                          <div>
                            <div className="font-mono text-2xl font-black text-white tracking-wider">
                              {m.number.formattedNumber}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>ร้าน {m.number.source || "Shopee Store"}</span>
                              <span>•</span>
                              <span>ผลรวมเบอร์ <strong className="text-amber-300">{m.number.totalSum}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Overall Match Badge */}
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-sm shadow-glow-gold flex items-center gap-1.5">
                            <Sparkles className="h-4 w-4 fill-white" />
                            <span>แมตช์ดวง {m.overallMatchScore}%</span>
                          </div>
                        </div>
                      </div>

                      {/* 2 Systems Scores Comparison Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* System 1 */}
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-amber-300 flex items-center gap-1">
                              <span>🔢 ระบบที่ 1: พลังเลขศาสตร์</span>
                            </span>
                            <span className="font-mono font-black text-white px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {m.system1Score}/100 [เกรด {m.system1Grade}]
                            </span>
                          </div>
                          <ul className="text-[11px] text-slate-300 space-y-1">
                            {m.system1Highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* System 2 */}
                        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-pink-300 flex items-center gap-1">
                              <span>🔮 ระบบที่ 2: ทักษาชื่อ-สกุล</span>
                            </span>
                            <span className="font-mono font-black text-white px-2 py-0.5 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30">
                              {m.system2Score}/100 [เกรด {m.system2Grade}]
                            </span>
                          </div>
                          <ul className="text-[11px] text-slate-300 space-y-1">
                            {m.system2Highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <CheckCircle2 className="h-3 w-3 text-pink-400 shrink-0" />
                                <span>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Destiny Matching Reason */}
                      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-pink-300">💖 เหตุผลการหนุนดวง:</strong> {m.matchReason}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(m.number.rawNumber)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors"
                          >
                            {copiedNum === m.number.rawNumber ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-emerald-300">คัดลอกเบอร์แล้ว</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>คัดลอกเบอร์</span>
                              </>
                            )}
                          </button>

                          {m.number.priceDisplay || (m.number.price && m.number.price > 0) ? (
                            <span className="font-mono font-bold text-emerald-300 text-xs px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                              ฿{m.number.priceDisplay || m.number.price.toLocaleString()}
                            </span>
                          ) : null}
                        </div>

                        {m.number.buyUrl && (
                          <a
                            href={m.number.buyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-cute-gold px-4 py-2 rounded-xl text-xs font-black text-slate-950 shadow flex items-center gap-1.5 hover:scale-105"
                          >
                            <span>🛒 สั่งซื้อที่ Shopee</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/40">
                  <div className="text-4xl mb-2">🥺</div>
                  <h4 className="text-base font-bold text-white mb-1">ยังไม่มีเบอร์ในระบบที่ตรงเงื่อนไข</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    กรุณาไปที่หน้าสตูดิโอลงเบอร์ เพื่อเพิ่มเบอร์จาก Shopee เข้าสู่ระบบก่อนนะคะ
                  </p>
                  <Link
                    href="/import"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-orange-500 text-white font-bold text-xs shadow hover:bg-orange-400 transition-colors"
                  >
                    <span>📥 ไปเพิ่มเบอร์เข้าคลังทันที</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
