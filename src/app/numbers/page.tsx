"use client";

import { useState, useEffect } from "react";
import { ScoredNumber } from "@/types";
import { NumberCard } from "@/components/numbers/NumberCard";
import { Search, RefreshCw, Sparkles, Filter } from "lucide-react";

export default function NumbersCatalogPage() {
  const [numbers, setNumbers] = useState<ScoredNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [minScore, setMinScore] = useState<number>(0);
  const [topOnly, setTopOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"score_desc" | "price_asc" | "price_desc" | "sum_asc">("score_desc");

  const fetchNumbers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/numbers");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNumbers(data.data);
      }
    } catch (e) {
      console.error("Failed to load numbers:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  const filteredNumbers = numbers
    .filter((n) => {
      if (selectedProvider !== "ALL" && n.provider !== selectedProvider) return false;
      if (minScore > 0 && n.totalScore < minScore) return false;
      if (topOnly && !n.isTopCandidate) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.replace(/\D/g, "");
        if (q && !n.rawNumber.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "score_desc") return b.totalScore - a.totalScore;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "sum_asc") return a.totalSum - b.totalSum;
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
              <span>📱 คลังเบอร์สด อัปเดตตลอดเวลา</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              ส่องคลังเบอร์มงคล <span className="cute-gold-gradient">Live Feed 🌸</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
              เลือกดูเบอร์จาก AIS และเครือข่าย พร้อมคะแนนความปังแบบเรียลไทม์
            </p>
          </div>

          <button
            onClick={fetchNumbers}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all self-start md:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>รีเฟรชเบอร์ใหม่</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="cute-card p-5 sm:p-6 mb-8 border-slate-800/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search query */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                🔍 ค้นหาเลขที่ชอบในเบอร์
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="เช่น 789, 24, 65, 095..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Provider Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                🌿 ค่ายสัญญาณ
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
              >
                <option value="ALL">✨ ทุกค่าย (AIS, TRUE, DTAC)</option>
                <option value="AIS">🌿 AIS 5G</option>
                <option value="TRUE">🍒 TRUE 5G</option>
                <option value="DTAC">🌊 DTAC</option>
              </select>
            </div>

            {/* Min Score Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ⭐ คะแนนขั้นต่ำ: <strong className="text-amber-300">{minScore > 0 ? `${minScore}+` : "ทั้งหมด"}</strong>
              </label>
              <select
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
              >
                <option value={0}>ทั้งหมด (0–100 คะแนน)</option>
                <option value={80}>🌸 เกรดดีเยี่ยม (80+ คะแนน)</option>
                <option value={90}>🌟 เกรด S ปังสุดๆ (90+ คะแนน)</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                🔄 จัดเรียงลำดับ
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
              >
                <option value="score_desc">คะแนนความมงคล (มากไปน้อย)</option>
                <option value="price_asc">ราคาเบอร์ (ประหยัดก่อน)</option>
                <option value="price_desc">ราคาเบอร์ (พรีเมียมก่อน)</option>
                <option value="sum_asc">ผลรวมตัวเลข</option>
              </select>
            </div>
          </div>

          {/* Quick Toggle Checkbox */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <input
              type="checkbox"
              id="topOnlyCheckbox"
              checked={topOnly}
              onChange={(e) => setTopOnly(e.target.checked)}
              className="accent-pink-400 h-4 w-4 rounded-lg cursor-pointer"
            />
            <label htmlFor="topOnlyCheckbox" className="text-xs font-bold text-slate-300 cursor-pointer">
              แสดงเฉพาะเบอร์ <span className="text-amber-300 font-extrabold">🌟 TOP Candidates</span> (ไร้คู่อัปมงคล 100%)
            </label>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <span>
            เจอน้องเบอร์ทั้งหมด <strong className="text-white font-bold">{filteredNumbers.length}</strong> เบอร์ค่ะ ✨
          </span>
        </div>

        {/* Grid List */}
        {filteredNumbers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNumbers.map((num, i) => (
              <NumberCard key={num.id} numberData={num} rank={i + 1} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <div className="text-4xl mb-2">🥺</div>
            <h3 className="text-base font-bold text-white mb-1">ไม่พบน้องเบอร์ที่ตรงกับเงื่อนไขนี้เลยจ้า</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              ลองปรับลดตัวกรองคะแนน หรือขยายเกณฑ์การค้นหาเพื่อดูเบอร์น่ารักๆ เพิ่มเติมนะคะ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
