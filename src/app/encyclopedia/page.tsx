"use client";

import { useState } from "react";
import { PAIR_RULES_MAP } from "@/lib/numerology/pairs-data";
import { BIRTH_RULES } from "@/lib/numerology/birth-rules";
import { SUM_RULES_MAP } from "@/lib/numerology/sum-data";
import { Search, BookOpen, AlertOctagon, Sparkles, Shield, Calendar, Heart } from "lucide-react";

export default function EncyclopediaPage() {
  const [activeTab, setActiveTab] = useState<"pairs" | "birthdays" | "sums">("pairs");
  const [searchPair, setSearchPair] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const allPairs = Object.values(PAIR_RULES_MAP);
  const categories = Array.from(new Set(allPairs.map((p) => p.category)));

  const filteredPairs = allPairs.filter((p) => {
    if (selectedCategory !== "ALL" && p.category !== selectedCategory) return false;
    if (searchPair.trim()) {
      const q = searchPair.toLowerCase();
      return (
        p.pair.includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.meaning.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1 text-xs font-bold text-pink-300 mb-3 animate-float">
            <span>📖✨</span>
            <span>คัมภีร์คู่ตัวเลข & ทักษาปกรณ์</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            พจนานุกรมคู่เลขมงคล <span className="cute-gold-gradient">00–99 🌸</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-2">
            เปิดดูความหมายคู่ตัวเลข ผลรวมมงคล และเคล็ดลับทักษา 8 วันเกิด เข้าใจง่าย ไม่ซับซ้อนค่า 💖
          </p>

          {/* Tab navigation */}
          <div className="mt-7 inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold shadow-inner">
            <button
              onClick={() => setActiveTab("pairs")}
              className={`px-5 py-2 rounded-xl transition-all ${
                activeTab === "pairs" ? "bg-amber-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              ✨ คู่ตัวเลข 00–99 ({allPairs.length})
            </button>
            <button
              onClick={() => setActiveTab("birthdays")}
              className={`px-5 py-2 rounded-xl transition-all ${
                activeTab === "birthdays" ? "bg-pink-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              🎂 ทักษา 8 วันเกิด
            </button>
            <button
              onClick={() => setActiveTab("sums")}
              className={`px-5 py-2 rounded-xl transition-all ${
                activeTab === "sums" ? "bg-emerald-400 text-slate-950 shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              🍀 ผลรวมเบอร์มงคล
            </button>
          </div>
        </div>

        {/* TAB 1: PAIRS 00-99 */}
        {activeTab === "pairs" && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center cute-card p-4 border-slate-800/80">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="ค้นหาคู่เลข เช่น 24, 78, 18, 59..."
                  value={searchPair}
                  onChange={(e) => setSearchPair(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                    selectedCategory === "ALL" ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  ทั้งหมด
                </button>
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap ${
                      selectedCategory === cat ? "bg-pink-400 text-slate-950" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Pairs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPairs.map((p) => {
                const isDangerous = p.isDangerous;
                return (
                  <div
                    key={p.pair}
                    className={`rounded-3xl p-5 border transition-all duration-200 ${
                      isDangerous
                        ? "bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60"
                        : p.tier === "A+"
                        ? "cute-card-gold hover:border-amber-400 hover:-translate-y-1"
                        : "cute-card hover:border-slate-700 hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-2xl font-mono text-2xl font-black border ${
                          isDangerous
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            : p.tier === "A+"
                            ? "bg-amber-400/20 text-amber-200 border-amber-400/40 shadow-sm"
                            : "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
                        }`}
                      >
                        {p.pair}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isDangerous
                            ? "bg-rose-500 text-white"
                            : p.tier === "A+"
                            ? "bg-amber-400 text-slate-950 font-black"
                            : "bg-emerald-400 text-slate-950 font-bold"
                        }`}
                      >
                        {isDangerous ? "❌ ต้องห้าม" : `เกรด ${p.tier}`}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                    <p className="text-xs text-slate-300/90 leading-relaxed mb-2">{p.meaning}</p>
                    {p.caution && (
                      <div className="text-[11px] text-amber-300 font-medium">⚠️ {p.caution}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BIRTHDAYS */}
        {activeTab === "birthdays" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(BIRTH_RULES).map((b) => (
              <div key={b.day} className="cute-card p-6 border-slate-800/80 space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-base font-black text-white">{b.nameTh}</h3>
                    <span className="text-xs text-slate-400 font-medium">{b.elementTh}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black">
                    ❌ ห้ามเลข {b.forbiddenDigits.join(", ")}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{b.description}</p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <span>✨ เลขมงคลส่งเสริม:</span>
                    <span className="font-mono text-sm">{b.auspiciousDigits.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">💖 คู่เลขแนะนำพิเศษ:</span>
                    <div className="flex flex-wrap gap-1">
                      {b.goodPairsRecommended.map((p) => (
                        <span key={p} className="px-2.5 py-0.5 rounded-lg bg-slate-800 font-mono text-amber-300 font-bold">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SUMS */}
        {activeTab === "sums" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(SUM_RULES_MAP).map((s) => (
              <div
                key={s.sum}
                className={`rounded-3xl p-5 border ${
                  s.isAuspicious ? "cute-card border-slate-800/80" : "bg-rose-950/20 border-rose-500/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-black font-mono text-white">ผลรวม {s.sum}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      s.isAuspicious ? "bg-amber-400 text-slate-950" : "bg-rose-500 text-white"
                    }`}
                  >
                    เกรด {s.tier}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 mb-1">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
