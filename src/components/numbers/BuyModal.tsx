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

  // Direct Channel URLs
  const aisUrl = `https://become-ais-family.ais.co.th/`;
  const trueUrl = `https://store.truecorp.co.th/online-store/postpaid`;
  const dtacUrl = `https://dtaconline.dtac.co.th/lucky-number/`;
  const berthongsukSearchUrl = `https://berthongsuk.in.th/?s=${rawNum}&post_type=product`;
  const shopeeSearchUrl = `https://shopee.co.th/search?keyword=${rawNum}`;

  const carrierUrl =
    numberData.provider === "AIS"
      ? aisUrl
      : numberData.provider === "TRUE"
      ? trueUrl
      : dtacUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
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

          {/* Quick Copy Number Pill */}
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
                  <span>กดคัดลอกเบอร์เพื่อนำไปค้นหาหรือแจ้งศูนย์</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Multi-Channel Buying Options */}
        <div className="space-y-3 mb-6">
          {/* Option 1: Official Carrier Store */}
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
                  <span>เว็บทางการค่าย {numberData.provider} Online Store</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  ค้นหาเบอร์และสั่งซื้อพร้อมเปิดแพ็กเกจส่งตรงถึงบ้าน
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-emerald-400 shrink-0" />
          </a>

          {/* Option 2: Berthongsuk Shop Search */}
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

          {/* Option 3: Shopee Online Direct Search */}
          <a
            href={shopeeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 to-slate-900 border border-orange-500/40 hover:border-orange-400 transition-all hover:scale-[1.01] group"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-xl border border-orange-500/30">
                🛍️
              </div>
              <div>
                <div className="font-bold text-sm text-white group-hover:text-orange-300 transition-colors flex items-center gap-1.5">
                  <span>ค้นหาเบอร์นี้ใน Shopee Mall & ร้านซิมมงคล</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-500 text-white">
                    Shopee Direct
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  ค้นหาเบอร์ <strong className="text-white font-mono">{formattedNum}</strong> หรือโปรซิมตรงบนแอป Shopee
                </div>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-orange-400 shrink-0" />
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
            <span className="font-bold block text-white mb-0.5">💡 เคล็ดลับการเป็นเจ้าของเบอร์:</span>
            เบอร์มงคลเกรด S มักมีผู้สนใจสูง หากตรวจพบว่ามีว่างในระบบ แนะนำให้รีบติดต่อจองหรือสั่งซื้อเพื่อไม่ให้พลาดความปังนะคะ 🌸
          </div>
        </div>
      </div>
    </div>
  );
}
