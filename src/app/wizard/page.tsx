"use client";

import { useState } from "react";
import { BirthDay, CareerCategory, LifeGoal, Provider, ScoredNumber, SearchCriteria } from "@/types";
import { BIRTH_RULES, calculateBirthDayFromDate } from "@/lib/numerology/birth-rules";
import { CAREER_RULES } from "@/lib/numerology/career-rules";
import { NumberCard } from "@/components/numbers/NumberCard";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Briefcase,
  Target,
  Wallet,
  Loader2,
  Bot,
  Heart,
  Star,
  Send,
} from "lucide-react";

export default function WizardPage() {
  // Mode: 'guided' or 'prompt'
  const [mode, setMode] = useState<"guided" | "prompt">("guided");
  const [promptText, setPromptText] = useState("");

  // Guided Form States
  const [currentStep, setCurrentStep] = useState(1);
  const [birthDate, setBirthDate] = useState("1996-08-12");
  const [birthTimeHour, setBirthTimeHour] = useState(10);
  const [birthDay, setBirthDay] = useState<BirthDay>("monday");
  const [career, setCareer] = useState<CareerCategory>("tech_developer");
  const [goals, setGoals] = useState<LifeGoal[]>(["wealth", "wisdom_peace"]);
  const [provider, setProvider] = useState<Provider>("AIS");
  const [budgetMax, setBudgetMax] = useState<number>(5000);

  // Pipeline Execution States
  const [isHunting, setIsHunting] = useState(false);
  const [huntLogs, setHuntLogs] = useState<string[]>([]);
  const [results, setResults] = useState<ScoredNumber[] | null>(null);

  // Update birthday when date changes
  const handleDateChange = (dateVal: string, hourVal: number) => {
    setBirthDate(dateVal);
    setBirthTimeHour(hourVal);
    const calculated = calculateBirthDayFromDate(dateVal, hourVal);
    setBirthDay(calculated);
  };

  const toggleGoal = (goal: LifeGoal) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  // Run Master AI Natural Language Extractor
  const handleMasterAiParse = async () => {
    if (!promptText.trim()) return;
    setIsHunting(true);
    setHuntLogs(["🐱 [น้องมูมู AI] กำลังอ่านข้อความและวิเคราะห์ความต้องการของคุณอยู่น้า..."]);

    try {
      const res = await fetch("/api/wizard-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        const c: SearchCriteria = data.data;
        if (c.birthDay) setBirthDay(c.birthDay);
        if (c.career) setCareer(c.career);
        if (c.goals && c.goals.length > 0) setGoals(c.goals);
        if (c.budgetMax) setBudgetMax(c.budgetMax);

        setHuntLogs((prev) => [
          ...prev,
          `✨ สกัดเงื่อนไขสำเร็จ: เกิดวัน ${c.birthDay || "-"}, อาชีพ ${c.career || "-"}, งบ ${c.budgetMax || "-"} บ.`,
        ]);

        await executeHuntWithCriteria(c);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsHunting(false);
    }
  };

  // Execute Hunt Pipeline
  const executeHuntWithCriteria = async (criteria: SearchCriteria) => {
    setIsHunting(true);
    setHuntLogs((prev) => [...prev, "🤖 บอทกำลังออกไปสแกนเบอร์จาก AIS Store และคำนวณคะแนน..."]);

    try {
      const res = await fetch("/api/hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setHuntLogs(data.data.logs || []);
        setResults(data.data.topCandidates || data.data.allCandidates || []);
      }
    } catch (err) {
      console.error("Hunt failed:", err);
    } finally {
      setIsHunting(false);
    }
  };

  const handleRunGuidedHunt = () => {
    const criteria: SearchCriteria = {
      birthDay,
      career,
      goals,
      providers: [provider],
      budgetMax,
    };
    executeHuntWithCriteria(criteria);
  };

  const currentBirthRule = BIRTH_RULES[birthDay];
  const currentCareerRule = CAREER_RULES[career];

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1 text-xs font-bold text-pink-300 mb-3 animate-float">
            <span>🐱✨</span>
            <span>น้องมูมู AI ผู้ช่วยเสกเบอร์มงคล</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            ค้นหาเบอร์มงคลเฉพาะ <span className="cute-gold-gradient">ดวงชะตาคุณ 🌸</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-2 max-w-lg mx-auto">
            ตอบคำถามสั้นๆ 4 ข้อ หรือพิมพ์คุยกับน้อง AI เพื่อให้ระบบจับคู่เบอร์ที่ส่งเสริมดวงชะตาคุณมากที่สุด
          </p>

          {/* Mode Switcher */}
          <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold shadow-inner">
            <button
              onClick={() => setMode("guided")}
              className={`px-5 py-2 rounded-xl transition-all ${
                mode === "guided" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              📝 ตอบคำถาม 4 ข้อ (ง่ายสุดๆ)
            </button>
            <button
              onClick={() => setMode("prompt")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl transition-all ${
                mode === "prompt" ? "bg-gradient-to-r from-pink-400 to-amber-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>💬 พิมพ์คุยกับน้อง AI</span>
            </button>
          </div>
        </div>

        {/* PROMPT CHAT MODE */}
        {mode === "prompt" && (
          <div className="cute-card-pink p-6 sm:p-8 mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐱</span>
              <div>
                <h3 className="text-base font-bold text-white">
                  บอกความต้องการกับน้องมูมู AI ได้เลยค่า
                </h3>
                <p className="text-xs text-pink-300/90">
                  พิมพ์ภาษาพูดปกติได้เลยน้า เช่น วันเกิด อาชีพ และสิ่งที่อยากเสริม
                </p>
              </div>
            </div>

            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="ตัวอย่าง: &quot;หนูเกิดวันจันทร์ ทำงานขายของออนไลน์ อยากได้เบอร์เน้นเจรจา มหาเสน่ห์ งบไม่เกิน 3,000 บ. ค่าย AIS ค่ะ&quot;"
              rows={4}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-white focus:border-pink-400 focus:outline-none focus:ring-1 focus:ring-pink-400 leading-relaxed"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleMasterAiParse}
                disabled={isHunting || !promptText.trim()}
                className="btn-cute-gold flex items-center gap-2 px-6 py-3 text-sm font-black text-slate-950 shadow-lg disabled:opacity-50"
              >
                {isHunting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>น้อง AI กำลังเสกเบอร์ให้...</span>
                  </>
                ) : (
                  <>
                    <span>ส่งให้น้อง AI หาเบอร์ทันที</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* GUIDED WIZARD MODE */}
        {mode === "guided" && (
          <div className="cute-card p-6 sm:p-10 border-slate-800/80 mb-10">
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2 mb-8 border-b border-slate-800/80 pb-6">
              {[
                { step: 1, title: "วันเกิดของคุณ", emoji: "🎂" },
                { step: 2, title: "สายอาชีพ", emoji: "💼" },
                { step: 3, title: "พลังที่อยากเสริม", emoji: "💖" },
                { step: 4, title: "ค่าย & งบ", emoji: "📱" },
              ].map((s) => {
                const isActive = currentStep === s.step;
                const isPassed = currentStep > s.step;
                return (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className={`cursor-pointer text-center p-2 rounded-2xl transition-all ${
                      isActive
                        ? "bg-amber-400/20 border border-amber-400/40 text-amber-300 shadow-sm scale-105"
                        : isPassed
                        ? "text-emerald-400"
                        : "text-slate-500 hover:text-slate-400"
                    }`}
                  >
                    <div className="text-lg mb-0.5">{s.emoji}</div>
                    <div className="text-[11px] font-bold hidden sm:block">{s.title}</div>
                    <div className="text-[10px] sm:hidden">ขั้น {s.step}</div>
                  </div>
                );
              })}
            </div>

            {/* STEP 1: Birthday */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                    <span>🎂 ขั้นตอนที่ 1: วันเกิดของคุณ</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    น้อง AI จะคำนวณวันเกิดและตัดเลขกาลกิณี (เลขต้องห้าม) ออกให้แบบ 100% เลยค่ะ
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      วันเดือนปีเกิด (ค.ศ.)
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => handleDateChange(e.target.value, birthTimeHour)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      เวลาเกิดโดยประมาณ
                    </label>
                    <select
                      value={birthTimeHour}
                      onChange={(e) => handleDateChange(birthDate, parseInt(e.target.value, 10))}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value={10}>06:00 - 17:59 น. (กลางวัน)</option>
                      <option value={20}>18:00 - 05:59 น. (กลางคืน/ราหู)</option>
                    </select>
                  </div>
                </div>

                {/* Birth Rule Summary */}
                {currentBirthRule && (
                  <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/80 border border-slate-800 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">
                          คุณเกิด: <span className="text-amber-300 font-extrabold">{currentBirthRule.nameTh}</span>
                        </span>
                        <span className="text-xs text-slate-400">({currentBirthRule.elementTh})</span>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-black">
                        ❌ เลี่ยงเลข {currentBirthRule.forbiddenDigits.join(", ")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {currentBirthRule.description}
                    </p>
                    <div className="text-xs text-emerald-300 flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>เลขมงคลเสริมดวงคุณ: {currentBirthRule.auspiciousDigits.join(", ")} ✨</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: Career */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                    <span>💼 ขั้นตอนที่ 2: คุณทำงานสายไหนอยู่เอ่ย?</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    เลือกหมวดหมู่งานเพื่อจับคู่ตัวเลขที่เสริมการงานและพลังเงินหมุนเวียน
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(CAREER_RULES).map(([key, c]) => {
                    const isSelected = career === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setCareer(key as CareerCategory)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-400/20 to-pink-400/20 border-amber-400 text-white shadow-md scale-[1.02]"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900"
                        }`}
                      >
                        <div className="font-bold text-sm mb-1">{c.titleTh}</div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {c.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {c.essentialPairs.slice(0, 4).map((p) => (
                            <span
                              key={p}
                              className="px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] font-mono font-bold text-amber-300"
                            >
                              คู่ {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                    <span>💖 ขั้นตอนที่ 3: อยากเสริมด้านไหนเป็นพิเศษคะ?</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    เลือกได้หลายข้อเลยน้า เพื่อให้น้อง AI จัดสัดส่วนพลังงานให้ตรงใจคุณที่สุด
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "wealth", emoji: "🪙", title: "รับทรัพย์ / ดึงดูดเงิน", desc: "เงินทองคล่องตัว เงินก้อนใหญ่" },
                    { id: "charm_love", emoji: "💖", title: "มหาเสน่ห์ / เมตตา", desc: "คนรักใคร่เอ็นดู ความรักหวานชื่น" },
                    { id: "prestige_power", emoji: "👑", title: "บารมี / เลื่อนขั้น", desc: "ลูกน้องยำเกรง ผู้นำที่น่าเชื่อถือ" },
                    { id: "wisdom_peace", emoji: "💡", title: "สติปัญญา / สมาธิ", desc: "ใจเย็น สงบ แก้ปัญหาเฉียบขาด" },
                    { id: "health_safety", emoji: "🛡️", title: "แคล้วคลาด / ปลอดภัย", desc: "สุขภาพแข็งแรง ปลอดภัยไร้อุปสรรค" },
                    { id: "luck_windfall", emoji: "🍀", title: "โชคลาภ / ลาภลอย", desc: "เสี่ยงดวง โชคลาภเข้ามาบ่อยๆ" },
                  ].map((g) => {
                    const isSelected = goals.includes(g.id as LifeGoal);
                    return (
                      <div
                        key={g.id}
                        onClick={() => toggleGoal(g.id as LifeGoal)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                          isSelected
                            ? "bg-pink-500/15 border-pink-400 text-white shadow-pink-500/10 scale-105"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg">{g.emoji}</span>
                            <span className="font-bold text-sm">{g.title}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-pink-400" />}
                        </div>
                        <p className="text-xs text-slate-400">{g.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Provider & Budget */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                    <span>📱 ขั้นตอนที่ 4: เครือข่าย & งบประมาณ</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    เลือกค่ายเบอร์ที่ชอบและตั้งงบประมาณสูงสุดที่สะดวก
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      ค่ายสัญญาณที่ต้องการ
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["AIS", "TRUE", "DTAC"] as Provider[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setProvider(p)}
                          className={`py-3.5 rounded-2xl font-black text-sm border transition-all ${
                            provider === p
                              ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md scale-105"
                              : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          {p === "AIS" ? "🌿 AIS" : p === "TRUE" ? "🍒 TRUE" : "🌊 DTAC"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      งบค่าเบอร์สูงสุด: <span className="text-amber-300 font-extrabold">{budgetMax.toLocaleString()} บาท</span>
                    </label>
                    <input
                      type="range"
                      min={1000}
                      max={50000}
                      step={500}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                      <span>1,000 บ.</span>
                      <span>15,000 บ.</span>
                      <span>50,000 บ.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>ย้อนกลับ</span>
                </button>
              ) : <div />}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="btn-cute-gold flex items-center gap-2 px-6 py-2.5 text-xs font-black text-slate-950"
                >
                  <span>ถัดไป</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRunGuidedHunt}
                  disabled={isHunting}
                  className="btn-cute-gold flex items-center gap-2 px-8 py-3.5 text-sm font-black text-slate-950 disabled:opacity-50"
                >
                  {isHunting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>น้อง AI กำลังเสกเบอร์ให้...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 fill-slate-950" />
                      <span>เริ่มค้นหาเบอร์มงคลเลย! ✨</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Live Execution Logs */}
        {huntLogs.length > 0 && (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-950 p-5 mb-8 font-mono text-xs text-slate-400">
            <div className="flex items-center gap-2 text-pink-300 font-bold mb-2 pb-2 border-b border-slate-800">
              <span>🐱 Hunter Logs</span>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {huntLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-amber-300">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <section className="space-y-6">
            <div className="text-center sm:text-left border-b border-slate-800 pb-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-2 justify-center sm:justify-start">
                <span>🎉 เจอน้องเบอร์ที่เหมาะกับคุณ</span>
                <span className="cute-gold-gradient">{results.length} เบอร์ค่ะ!</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                เรียงตามคะแนนความเข้ากันได้กับวันเกิดและอาชีพของคุณแบบตรงจุด 🌸
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((num, idx) => (
                <NumberCard key={num.id} numberData={num} rank={idx + 1} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
