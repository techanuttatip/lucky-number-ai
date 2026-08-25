"use client";

import { useState } from "react";
import { ScoredNumber } from "@/types";
import {
  ExternalLink,
  Copy,
  Check,
  X,
  Store,
  Sparkles,
  Search,
} from "lucide-react";

interface BuyModalProps {
  numberData: ScoredNumber;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyModal({ numberData, isOpen, onClose }: BuyModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const rawNum = numberData.rawNumber;
  const formattedNum = numberData.formattedNumber;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawNum);
    setCopied(true);
    setActiveStep(2);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleOpenChannel = (url: string) => {
    navigator.clipboard.writeText(rawNum);
    setCopied(true);
    setActiveStep(3);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shopeeExactSearchUrl = `https://shopee.co.th/search?keyword=${encodeURIComponent(`ซิมเบอร์มงคล ${rawNum}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl border border-pink-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 text-xs font-bold border border-orange-500/20 mb-2">
            <span>🛒 วิธีการสั่งซื้อจากร้านค้า Shopee</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">
            {formattedNum}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            ร้าน {numberData.source || "Shopee Store"} • ผลรวม {numberData.totalSum} ({numberData.sumRule?.tier}) • คะแนน {numberData.totalScore}/100
          </p>

          {/* Quick Copy Number Button */}
          <div className="mt-3 flex justify-center">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 hover:border-pink-400 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all shadow-inner hover:scale-[1.02]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-300 font-sans font-bold">คัดลอกเบอร์ {formattedNum} แล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-pink-400" />
                  <span className="font-sans">1. กดตรงนี้เพื่อคัดลอกเบอร์ (Copy Number)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step-by-Step Interactive Guide */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/90 border border-pink-500/20 space-y-2">
          <div className="text-xs font-bold text-pink-300 flex items-center gap-1.5 mb-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>ขั้นตอนการสั่งซื้อ 3 สเต็ปง่ายๆ:</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div
              className={`p-2.5 rounded-xl border transition-all text-center ${
                activeStep === 1
                  ? "bg-pink-500/20 border-pink-400 text-white font-bold"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <div className="font-bold mb-0.5">1. คัดลอกเบอร์</div>
              <div className="text-[10px] text-slate-400">{copied ? "✓ คัดลอกแล้ว" : "กดปุ่มด้านบน"}</div>
            </div>

            <div
              className={`p-2.5 rounded-xl border transition-all text-center ${
                activeStep === 2
                  ? "bg-pink-500/20 border-pink-400 text-white font-bold"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <div className="font-bold mb-0.5">2. เลือกร้านค้า</div>
              <div className="text-[10px] text-slate-400">กดปุ่มร้านค้าด้านล่าง</div>
            </div>

            <div
              className={`p-2.5 rounded-xl border transition-all text-center ${
                activeStep === 3
                  ? "bg-pink-500/20 border-pink-400 text-white font-bold"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <div className="font-bold mb-0.5">3. วาง & สั่งซื้อ</div>
              <div className="text-[10px] text-slate-400">ในหน้า Shopee</div>
            </div>
          </div>
        </div>

        {/* Multi-Channel Buying Options */}
        <div className="space-y-3 mb-6">
          {/* Option 1: Direct Linked Shopee Store */}
          {numberData.buyUrl && (
            <button
              type="button"
              onClick={() => handleOpenChannel(numberData.buyUrl!)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-950/60 to-slate-900 border border-orange-500/50 hover:border-orange-400 transition-all hover:scale-[1.01] text-left group shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-xl border border-orange-500/30">
                  🛍️
                </div>
                <div>
                  <div className="font-bold text-sm text-white group-hover:text-orange-300 transition-colors flex items-center gap-1.5">
                    <span>เปิดลิงก์ร้าน {numberData.source || "Shopee Store"}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    เปิดหน้าร้าน / สินค้าบน Shopee ที่ผูกไว้ทันที
                  </div>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-orange-400 shrink-0" />
            </button>
          )}

          {/* Option 2: Search Exact SIM on Shopee */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/30 to-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-xl border border-orange-500/30">
                  🔍
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>ค้นหาซิมเบอร์นี้บน Shopee</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ค้นหาคำว่า &quot;ซิมเบอร์มงคล {rawNum}&quot; บน Shopee
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleOpenChannel(shopeeExactSearchUrl)}
                className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold transition-all shadow"
              >
                <Search className="h-3.5 w-3.5" />
                <span>ค้นหา &quot;ซิมเบอร์มงคล {rawNum}&quot; บน Shopee</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Option 3: Physical Store / Shop Counter */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Store className="h-4 w-4 text-sky-400" />
              <span>🏢 แจ้งพนักงานหรือแชทคุยกับร้านค้า</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              เพียงกดคัดลอกเบอร์ <strong className="text-white font-mono">{formattedNum}</strong> แล้วส่งให้ร้านค้าในแชท Shopee เพื่อเช็คสต็อกหรือสั่งซื้อได้ทันทีค่ะ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
