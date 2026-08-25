"use client";

import Link from "next/link";
import { ScoredNumber } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, ArrowRight, ExternalLink, ShieldCheck, AlertCircle, Heart, Star } from "lucide-react";

interface NumberCardProps {
  numberData: ScoredNumber;
  rank?: number;
  showAiBadge?: boolean;
}

export function NumberCard({ numberData, rank, showAiBadge = true }: NumberCardProps) {
  const isS = numberData.totalScore >= 90;
  const isA = numberData.totalScore >= 80 && numberData.totalScore < 90;
  const isDangerous = numberData.dangerousPairsFound.length > 0;

  const providerBadge: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
    AIS: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30", emoji: "🌿" },
    TRUE: { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30", emoji: "🍒" },
    DTAC: { bg: "bg-sky-500/15", text: "text-sky-300", border: "border-sky-500/30", emoji: "🌊" },
  };

  const badgeInfo = providerBadge[numberData.provider] || {
    bg: "bg-slate-800",
    text: "text-slate-300",
    border: "border-slate-700",
    emoji: "📱",
  };

  return (
    <div
      className={`group relative rounded-3xl p-5 sm:p-6 transition-all duration-300 ${
        isS
          ? "cute-card-gold hover:border-amber-400 hover:shadow-glow-gold hover:-translate-y-1.5"
          : isA
          ? "cute-card-mint hover:border-emerald-400 hover:-translate-y-1"
          : "cute-card hover:border-slate-700 hover:-translate-y-1"
      }`}
    >
      {/* Top Rank Badge */}
      {rank && rank <= 3 && (
        <div className="absolute -top-3 -left-2 z-10 flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-yellow-300 text-slate-950 font-black text-xs shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
          <span>#{rank}</span>
        </div>
      )}

      {/* Header: Provider & Score */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}>
            <span>{badgeInfo.emoji}</span>
            <span>{numberData.provider}</span>
          </span>
          {numberData.source && (
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              numberData.source.includes("Mobilesphone")
                ? "bg-pink-500/20 text-pink-300 border-pink-500/30"
                : numberData.source.includes("MoranetShop")
                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                : numberData.source.includes("7SIMNET")
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : "bg-orange-500/20 text-orange-300 border-orange-500/30"
            }`}>
              {numberData.source.includes("Mobilesphone")
                ? "📱 Mobilesphone"
                : numberData.source.includes("MoranetShop")
                ? "💎 MoranetShop"
                : numberData.source.includes("7SIMNET")
                ? "⚡ 7SIMNET"
                : `🛍️ ${numberData.source}`}
            </span>
          )}
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            ผลรวม <strong className="text-amber-300">{numberData.totalSum}</strong> ({numberData.sumRule?.tier || "A"})
          </span>
        </div>

        {/* Cute Score Pill */}
        <div className="flex items-center gap-1">
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-2xl text-xs font-black shadow-sm ${
              isS
                ? "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950"
                : isA
                ? "bg-emerald-400 text-slate-950"
                : isDangerous
                ? "bg-rose-500 text-white"
                : "bg-slate-800 text-slate-200 border border-slate-700"
            }`}
          >
            {isS ? <Star className="h-3 w-3 fill-slate-950" /> : null}
            <span>{numberData.totalScore}</span>
            <span className="text-[10px] opacity-80">/100</span>
          </div>
        </div>
      </div>

      {/* Main Phone Number Display */}
      <div className="mb-3.5">
        <Link href={`/numbers/${numberData.id}`} className="group-hover:text-amber-300 transition-colors inline-block">
          <div className="text-2xl sm:text-3xl font-black tracking-wider text-white font-mono">
            {numberData.formattedNumber}
          </div>
        </Link>
        <p className="text-xs text-slate-300/80 mt-1 line-clamp-1">
          ✨ {numberData.sumRule?.title || "พลังงานดีรอบด้าน"}
        </p>
      </div>

      {/* Digit Pairs Cute Badges */}
      <div className="mb-3.5">
        <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center justify-between">
          <span>คู่เลข 7 ตัวท้าย:</span>
          {numberData.dangerousPairsFound.length === 0 ? (
            <span className="text-emerald-300 text-[10px] flex items-center gap-1 font-bold">
              <ShieldCheck className="h-3 w-3" /> ปลอดภัย ไร้คู่อัปมงคล 💖
            </span>
          ) : (
            <span className="text-rose-300 text-[10px] flex items-center gap-1 font-bold">
              <AlertCircle className="h-3 w-3" /> มีคู่ที่ต้องระวังงับ
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {numberData.decomposedPairs.map((p, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-0.5 rounded-xl text-xs font-mono font-black border transition-transform hover:scale-110 ${
                p.isDangerous
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                  : p.rule?.tier === "A+"
                  ? "bg-amber-400/20 text-amber-200 border-amber-400/40 shadow-sm"
                  : p.rule?.tier === "A"
                  ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/40"
                  : "bg-slate-800/80 text-slate-300 border-slate-700"
              }`}
              title={p.rule?.title || p.pair}
            >
              {p.pair}
            </span>
          ))}
        </div>
      </div>

      {/* AI Verdict Cute Chat Bubble Preview */}
      {numberData.aiVerdict && showAiBadge && (
        <div className="mb-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-pink-950/40 border border-pink-500/25 p-3 text-xs">
          <div className="flex items-center gap-1.5 text-pink-300 font-bold mb-1">
            <span>🐱 น้อง AI แอบกระซิบ:</span>
            <span className="text-white truncate">{numberData.aiVerdict.headline}</span>
          </div>
          <p className="text-slate-300 line-clamp-2 text-[11px] leading-relaxed">
            {numberData.aiVerdict.secondOpinion}
          </p>
        </div>
      )}

      {/* Energy Mini Profile with Cute Emojis */}
      <div className="grid grid-cols-5 gap-1 mb-4 text-[10px] text-center">
        <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800/60">
          <div className="text-slate-400">🪙 ทรัพย์</div>
          <div className="font-black text-amber-300 mt-0.5">{numberData.energyProfile.wealth}%</div>
        </div>
        <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800/60">
          <div className="text-slate-400">💖 เสน่ห์</div>
          <div className="font-black text-pink-300 mt-0.5">{numberData.energyProfile.charm}%</div>
        </div>
        <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800/60">
          <div className="text-slate-400">👑 บารมี</div>
          <div className="font-black text-purple-300 mt-0.5">{numberData.energyProfile.prestige}%</div>
        </div>
        <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800/60">
          <div className="text-slate-400">💡 ปัญญา</div>
          <div className="font-black text-sky-300 mt-0.5">{numberData.energyProfile.wisdom}%</div>
        </div>
        <div className="bg-slate-900/80 rounded-xl p-1.5 border border-slate-800/60">
          <div className="text-slate-400">🍀 โชคดี</div>
          <div className="font-black text-emerald-300 mt-0.5">{numberData.energyProfile.luck}%</div>
        </div>
      </div>

      {/* Card Footer: Store Link, Optional Price & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {numberData.buyUrl ? (
            <a
              href={numberData.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-300 border border-orange-500/30 text-xs font-bold transition-all"
            >
              <span>🛒 สั่งซื้อที่ Shopee</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">🛍️ Shopee Store</span>
          )}

          {numberData.priceDisplay || (numberData.price && numberData.price > 0) ? (
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-black text-xs font-mono">
              ฿{numberData.priceDisplay || numberData.price.toLocaleString()}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/numbers/${numberData.id}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs transition-all shadow hover:scale-105"
          >
            <span>ดูความปัง</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
