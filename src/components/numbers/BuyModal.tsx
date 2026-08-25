"use client";

import { useState } from "react";
import { ScoredNumber } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  ExternalLink,
  Copy,
  Check,
  X,
  ShoppingBag,
  Store,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  Search,
} from "lucide-react";

interface BuyModalProps {
  numberData: ScoredNumber;
  isOpen: boolean;
  onClose: () => void;
}

export function BuyModal({ numberData, isOpen, onClose }: BuyModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawNum = numberData.rawNumber;
  const formattedNum = numberData.formattedNumber;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Top pairs for intelligent keyword search
  const keyPairs = numberData.decomposedPairs
    .filter((p) => !p.isDangerous)
    .slice(0, 2)
    .map((p) => p.pair)
    .join(" ");

  // Direct Channel URLs with precise Thai keywords for Shopee & Marketplaces
  const aisUrl = `https://become-ais-family.ais.co.th/lucky-number`;
  const trueUrl = `https://store.truecorp.co.th/online-store/postpaid`;
  const dtacUrl = `https://dtaconline.dtac.co.th/lucky-number/`;
  const berthongsukSearchUrl = `https://berthongsuk.in.th/?s=${encodeURIComponent(rawNum)}&post_type=product`;

  // Accurate Shopee URLs with Thai SIM Card Keywords
  const shopeeExactSearchUrl = `https://shopee.co.th/search?keyword=${encodeURIComponent(`ซิมเบอร์มงคล ${rawNum}`)}`;
  const shopeePairSearchUrl = `https://shopee.co.th/search?keyword=${encodeURIComponent(`ซิมเบอร์มงคล ${numberData.provider} ${keyPairs}`)}`;
  const shopeeMallStoreUrl =
    numberData.provider === "AIS"
      ? "https://shopee.co.th/ais_official"
      : "https://shopee.co.th/truemove_h_official";

  const carrierUrl =
    numberData.provider === "AIS"
      ? aisUrl
      : numberData.provider === "TRUE"
      ? trueUrl
      : dtacUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl border border-pink-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
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
            <span>🛒 ช่องทางการเป็นเจ้าของเบอร์นี้</span>
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
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-950 border border-slate-700 hover:border-pink-400 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all shadow-inner"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300">คัดลอกเบอร์ {formattedNum} แล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-pink-400" />
                  <span>กดคัดลอกเบอร์เพื่อนำไปแจ้งศูนย์หรือค้นหา</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Multi-Channel Buying Options */}
        <div className="space-y-3 mb-6">
          {/* Option 1: Shopee Direct Search (Exact SIM Keyword) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-lg border border-orange-500/30">
                  🛍️
                </div>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-1.5">
                    <span>ค้นหาใน Shopee (ร้านซิมมงคล & Shopee Mall)</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ค้นหาซิมเบอร์นี้ หรือคู่เลข {keyPairs} บน Shopee
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={shopeeExactSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold transition-all shadow"
              >
                <Search className="h-3.5 w-3.5" />
                <span>ค้นหา &quot;ซิมเบอร์มงคล {rawNum}&quot;</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <a
                href={shopeePairSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-200 text-xs font-bold border border-orange-500/30 transition-all"
              >
                <span>ค้นหาคู่เลข {keyPairs} บน Shopee</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Option 2: Official Carrier Store */}
          <a
            href={carrierUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-xl">
                🌿
              </div>
              <div>
                <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                  <span>เว็บทางการค่าย {numberData.provider} (Become Family / Online Store)</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  เลือกเบอร์มงคลตรงจากค่าย สั่งซื้อพร้อมเปิดแพ็กเกจส่งถึงบ้าน
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-emerald-400 shrink-0" />
          </a>

          {/* Option 3: Berthongsuk Shop Search */}
          <a
            href={berthongsukSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-400 transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-xl">
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
          </a>

          {/* Option 4: Physical Store / Shop Counter */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Store className="h-4 w-4 text-sky-400" />
              <span>🏢 ไปติดต่อที่ศูนย์บริการ ({numberData.provider} Shop / Telewiz)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              เพียงกดคัดลอกเบอร์ <strong className="text-white font-mono">{formattedNum}</strong> แล้วนำไปแจ้งเจ้าหน้าที่ที่ศูนย์บริการใกล้บ้าน เพื่อตรวจสอบสถานะและเปิดเบอร์ได้ทันทีค่ะ
            </p>
          </div>
        </div>

        {/* Tip Box */}
        <div className="rounded-2xl bg-purple-950/30 border border-purple-500/20 p-3.5 text-xs text-purple-200 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-white mb-0.5">💡 เคล็ดลับการค้นหาใน Shopee:</span>
            บน Shopee จะต้องพิมพ์คำว่า <strong>&quot;ซิมเบอร์มงคล&quot;</strong> นำหน้าตัวเลขเสมอ เพื่อให้ Shopee กรองเฉพาะสินค้าหมวดหมู่ซิมการ์ด และไม่แสดงสินค้าประเภทอื่นค่ะ 🌸
          </div>
        </div>
      </div>
    </div>
  );
}
