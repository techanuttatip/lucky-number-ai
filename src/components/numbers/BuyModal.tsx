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
  ArrowRight,
  ClipboardCheck,
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

  // Top pairs for intelligent keyword search
  const keyPairs = numberData.decomposedPairs
    .filter((p) => !p.isDangerous)
    .slice(0, 2)
    .map((p) => p.pair)
    .join(" ");

  // Direct Channel URLs
  const aisUrl = `https://become-ais-family.ais.co.th/lucky-number`;
  const trueUrl = `https://store.truecorp.co.th/online-store/postpaid`;
  const dtacUrl = `https://dtaconline.dtac.co.th/lucky-number/`;
  const berthongsukSearchUrl = `https://berthongsuk.in.th/?s=${encodeURIComponent(rawNum)}&post_type=product`;

  // Accurate Marketplaces URLs with Thai SIM Card Keywords
  const shopeeExactSearchUrl = `https://shopee.co.th/search?keyword=${encodeURIComponent(`ซิมเบอร์มงคล ${rawNum}`)}`;
  const lazadaSearchUrl = `https://www.lazada.co.th/catalog/?q=${encodeURIComponent(`ซิมเบอร์มงคล ${rawNum}`)}`;

  const carrierUrl =
    numberData.provider === "AIS"
      ? aisUrl
      : numberData.provider === "TRUE"
      ? trueUrl
      : dtacUrl;

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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold border border-amber-400/20 mb-2">
            <span>🛒 วิธีการสั่งซื้อและเป็นเจ้าของเบอร์</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-wider">
            {formattedNum}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            ค่าย {numberData.provider} • ผลรวม {numberData.totalSum} ({numberData.sumRule?.tier}) • คะแนน {numberData.totalScore}/100
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
                  <span className="text-emerald-300 font-sans font-bold">คัดลอกเบอร์ {formattedNum} แล้ว! (พร้อมกดวางในเว็บค่าย)</span>
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
            <span>ขั้นตอนการสั่งซื้อ 3 สเต็ปง่ายๆ (ทำตามได้ทันที):</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className={`p-2.5 rounded-xl border text-center transition-all ${
              copied ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300" : "bg-slate-900 border-slate-800 text-slate-300"
            }`}>
              <div className="font-bold mb-0.5">1. คัดลอกเบอร์</div>
              <div className="text-[10px] text-slate-400">ระบบ Copy ให้อัตโนมัติ</div>
            </div>

            <div className="p-2.5 rounded-xl border bg-slate-900 border-slate-800 text-slate-300 text-center">
              <div className="font-bold mb-0.5">2. เลือกช่องทาง</div>
              <div className="text-[10px] text-slate-400">กดปุ่มร้านค้าด้านล่าง</div>
            </div>

            <div className="p-2.5 rounded-xl border bg-slate-900 border-slate-800 text-slate-300 text-center">
              <div className="font-bold mb-0.5">3. กดวาง (Paste)</div>
              <div className="text-[10px] text-slate-400">ในช่องค้นหาแล้วกดซื้อ</div>
            </div>
          </div>
        </div>

        {/* Multi-Channel Buying Options */}
        <div className="space-y-3 mb-6">
          {/* Option 1: Official Carrier Store (AIS / True / Dtac) */}
          <button
            type="button"
            onClick={() => handleOpenChannel(carrierUrl)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 transition-all hover:scale-[1.01] text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-xl border border-emerald-500/30">
                🌿
              </div>
              <div>
                <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>เว็บทางการ {numberData.provider} (Become Family / Online Store)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  กดเปิดเว็บ แล้ววางเบอร์ <strong className="text-emerald-300 font-mono">{formattedNum}</strong> ในช่องค้นหาเบอร์ได้ทันที
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-emerald-400 shrink-0" />
          </button>

          {/* Option 2: Shopee Direct Search (Exact SIM Keyword) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-lg border border-orange-500/30">
                  🛍️
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>Shopee Mall & ร้านซิมมงคล</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ค้นหาซิมเบอร์นี้ หรือคู่เลข {keyPairs} บน Shopee
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleOpenChannel(shopeeExactSearchUrl)}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold transition-all shadow"
              >
                <Search className="h-3.5 w-3.5" />
                <span>ค้นหา &quot;ซิมเบอร์มงคล {rawNum}&quot;</span>
                <ExternalLink className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenChannel(lazadaSearchUrl)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-bold border border-blue-500/30 transition-all"
              >
                <span>ค้นหาใน Lazada</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Option 3: Berthongsuk Shop Search */}
          <button
            type="button"
            onClick={() => handleOpenChannel(berthongsukSearchUrl)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 hover:border-amber-400 transition-all hover:scale-[1.01] text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-xl border border-amber-500/30">
                🔮
              </div>
              <div>
                <div className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                  <span>ค้นหาในร้านเบอร์ทองสุข (Berthongsuk)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  เช็คสต็อกเบอร์มงคลในร้านเบอร์ทองสุขโดยตรง
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-amber-400 shrink-0" />
          </button>

          {/* Option 4: Physical Store / Shop Counter */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Store className="h-4 w-4 text-sky-400" />
              <span>🏢 ซื้อที่ศูนย์บริการใกล้บ้าน ({numberData.provider} Shop / Telewiz)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              เพียงกดคัดลอกเบอร์ <strong className="text-white font-mono">{formattedNum}</strong> แล้วแจ้งพนักงานที่เคาน์เตอร์ เพื่อเปิดเบอร์หรือย้ายค่ายได้ทันทีค่ะ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
