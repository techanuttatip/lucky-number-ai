"use client";

import { useState, useEffect } from "react";
import { ScoredNumber } from "@/types";
import { NumberCard } from "@/components/numbers/NumberCard";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Star,
  Sparkles,
  Store,
  Filter,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

type StoreTab = "ALL" | "Mobilesphone" | "MoranetShop" | "7SIMNET";

export default function ShopeeStoresPage() {
  const [numbers, setNumbers] = useState<ScoredNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<StoreTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState<number>(0);
  const [topOnly, setTopOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"score_desc" | "sum_asc">("score_desc");

  const fetchNumbers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/numbers");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setNumbers(data.data);
      }
    } catch (e) {
      console.error("Failed to load store numbers:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers();
  }, []);

  // Filter only Shopee stores
  const shopeeStoreNumbers = numbers.filter((n) => {
    const src = (n.source || "").toLowerCase();
    return src.includes("shopee") || src.includes("mobilesphone") || src.includes("moranet") || src.includes("7simnet");
  });

  // Tab Filtering
  const filteredNumbers = shopeeStoreNumbers
    .filter((n) => {
      const src = n.source || "";
      if (activeTab === "Mobilesphone" && !src.includes("Mobilesphone")) return false;
      if (activeTab === "MoranetShop" && !src.includes("MoranetShop")) return false;
      if (activeTab === "7SIMNET" && !src.includes("7SIMNET")) return false;

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
      if (sortBy === "sum_asc") return a.totalSum - b.totalSum;
      return 0;
    });

  // Store counts
  const countMobilesphone = shopeeStoreNumbers.filter((n) => (n.source || "").includes("Mobilesphone")).length;
  const countMoranet = shopeeStoreNumbers.filter((n) => (n.source || "").includes("MoranetShop")).length;
  const count7Simnet = shopeeStoreNumbers.filter((n) => (n.source || "").includes("7SIMNET")).length;

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <span>🛍️ เจาะลึกร้านค้าซิมมงคล Shopee</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              รวมร้านซิมมงคล Shopee <span className="cute-gold-gradient">Stores Directory 🌸</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
              วิเคราะห์คะแนนเลขศาสตร์ 0–100 ครบทุกเบอร์จากร้าน Mobilesphone, MoranetShop และ 7SIMNET
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/import"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-black transition-all shadow"
            >
              <span>📥 วางเบอร์เพิ่ม</span>
            </Link>
            <button
              onClick={fetchNumbers}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Store Tabs Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden ${
              activeTab === "ALL"
                ? "bg-gradient-to-br from-orange-950/60 to-slate-900 border-orange-500 shadow-glow-gold scale-[1.02]"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">🏪</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-orange-300">
                {shopeeStoreNumbers.length}
              </span>
            </div>
            <div className="font-bold text-sm text-white">รวมทุกร้านค้า</div>
            <div className="text-[11px] text-slate-400">สแกนครบ 3 ร้านดัง</div>
          </button>

          <button
            onClick={() => setActiveTab("Mobilesphone")}
            className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden ${
              activeTab === "Mobilesphone"
                ? "bg-gradient-to-br from-pink-950/60 to-slate-900 border-pink-500 shadow-glow-gold scale-[1.02]"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">📱</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-pink-300">
                {countMobilesphone}
              </span>
            </div>
            <div className="font-bold text-sm text-white">Mobilesphone</div>
            <div className="text-[11px] text-slate-400">เน้นเบอร์ผลรวมดี 54, 55, 60</div>
          </button>

          <button
            onClick={() => setActiveTab("MoranetShop")}
            className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden ${
              activeTab === "MoranetShop"
                ? "bg-gradient-to-br from-purple-950/60 to-slate-900 border-purple-500 shadow-glow-gold scale-[1.02]"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">💎</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-purple-300">
                {countMoranet}
              </span>
            </div>
            <div className="font-bold text-sm text-white">MoranetShop</div>
            <div className="text-[11px] text-slate-400">ซิมเบอร์สวย & เบอร์ 061, 093</div>
          </button>

          <button
            onClick={() => setActiveTab("7SIMNET")}
            className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden ${
              activeTab === "7SIMNET"
                ? "bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500 shadow-glow-gold scale-[1.02]"
                : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">⚡</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300">
                {count7Simnet}
              </span>
            </div>
            <div className="font-bold text-sm text-white">7SIMNET</div>
            <div className="text-[11px] text-slate-400">คลังซิมเน็ตรายปี & เบอร์มงคล</div>
          </button>
        </div>

        {/* Filters Controls Bar */}
        <div className="cute-card p-5 sm:p-6 border-slate-800/80 space-y-4">
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
                  placeholder="เช่น 789, 24, 65, 54, 097..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                />
              </div>
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
                <option value="sum_asc">ผลรวมตัวเลข (น้อยไปมาก)</option>
              </select>
            </div>

            {/* Top Only Toggle */}
            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2.5 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer w-full hover:border-amber-400 transition-colors">
                <input
                  type="checkbox"
                  checked={topOnly}
                  onChange={(e) => setTopOnly(e.target.checked)}
                  className="accent-amber-400 h-4 w-4 rounded cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-200">
                  🌟 เฉพาะเบอร์ไร้เลขเสีย 100%
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            พบเบอร์ในร้าน <strong className="text-white font-bold">{activeTab}</strong> ทั้งหมด{" "}
            <strong className="text-amber-300 font-bold">{filteredNumbers.length}</strong> เบอร์ค่ะ ✨
          </span>
        </div>

        {/* Grid of Number Cards */}
        {filteredNumbers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNumbers.map((num, i) => (
              <NumberCard key={num.id} numberData={num} rank={i + 1} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <div className="text-4xl mb-2">🥺</div>
            <h3 className="text-base font-bold text-white mb-1">ไม่พบเบอร์ในร้านที่ตรงกับเงื่อนไข</h3>
            <p className="text-xs text-slate-400">
              ลองเลือกแท็บร้านค้าอื่น หรือปรับลดตัวกรองคะแนนดูนะคะ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
