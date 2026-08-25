"use client";

import { useState } from "react";
import { ScoredNumber, Provider } from "@/types";
import { NumberCard } from "@/components/numbers/NumberCard";
import {
  ClipboardPaste,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShoppingBag,
  Store,
  Link as LinkIcon,
  ShieldCheck,
  Star,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function BulkImportPage() {
  const [storeName, setStoreName] = useState("Mobilesphone (Shopee)");
  const [storeUrl, setStoreUrl] = useState("https://shopee.co.th/");
  const [inputText, setInputText] = useState("");
  const [provider, setProvider] = useState<Provider>("AIS");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    storeName: string;
    storeUrl: string;
    importedCount: number;
    numbers: ScoredNumber[];
    gradeSCount: number;
    gradeACount: number;
    dangerousCount: number;
  } | null>(null);

  const presetStores = [
    { name: "Mobilesphone (Shopee)", url: "https://shopee.co.th/search?keyword=Mobilesphone" },
    { name: "MoranetShop (Shopee)", url: "https://shopee.co.th/search?keyword=MoranetShop" },
    { name: "7SIMNET (Shopee)", url: "https://shopee.co.th/search?keyword=7SIMNET" },
  ];

  const handleSelectPreset = (preset: { name: string; url: string }) => {
    setStoreName(preset.name);
    setStoreUrl(preset.url);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMsg("กรุณาวางข้อความหรือเบอร์โทรศัพท์ที่ต้องการนำเข้า");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/numbers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          storeName,
          storeUrl,
          provider,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.error || "เกิดข้อผิดพลาดในการนำเข้าเบอร์");
      } else {
        setImportResult(json.data);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <span>🛍️ นำเข้าเบอร์ & ลิงก์ร้านค้า Shopee</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              เพิ่มเบอร์ & ผูกลิงก์ร้าน Shopee <span className="cute-gold-gradient">Store Importer 🌸</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
              ใส่ชื่อร้านค้า ลิงก์ Shopee และวางรายการเบอร์ ระบบจะคำนวณคะแนน 0–100 และผูกลิงก์สั่งซื้อให้อัตโนมัติค่า
            </p>
          </div>

          <Link
            href="/stores"
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all self-start sm:self-auto"
          >
            <span>ดูหน้ารวมร้านค้า Shopee</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Input Form Card */}
        <div className="cute-card p-6 sm:p-8 border-orange-500/30 bg-gradient-to-br from-orange-950/20 via-slate-900 to-slate-900 space-y-6">
          {/* Quick Preset Buttons */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <span>🏪 เลือกร้านค้าที่มีอยู่ หรือพิมพ์ชื่อร้านใหม่:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presetStores.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handleSelectPreset(p)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    storeName === p.name
                      ? "bg-orange-500 text-white border-orange-400 shadow-md"
                      : "bg-slate-950 text-slate-300 border-slate-700 hover:border-orange-400"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleImport} className="space-y-5">
            {/* Store Name & Store URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Store className="h-4 w-4 text-orange-400" />
                  <span>ชื่อร้านค้าใน Shopee</span>
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="เช่น Mobilesphone, MoranetShop, ร้านเบอร์มงคล 888..."
                  className="w-full rounded-2xl border border-orange-500/40 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-orange-400 focus:outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="h-4 w-4 text-orange-400" />
                  <span>ลิงก์ร้านค้า / ลิงก์สินค้าบน Shopee</span>
                </label>
                <input
                  type="url"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  placeholder="https://shopee.co.th/shop_name..."
                  className="w-full rounded-2xl border border-orange-500/40 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-orange-400 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* Numbers Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                <ClipboardPaste className="h-4 w-4 text-orange-400" />
                <span>วางรายการเบอร์โทรศัพท์ (วางได้หลายเบอร์พร้อมกัน หรือวางทั้งแคปชั่น):</span>
              </label>

              <textarea
                rows={7}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="วางข้อความที่นี่ เช่น:&#10;097-4294441, 097-8249442, 063-9269441&#10;098-789-5665 ซิมมังกร 4,990 บาท&#10;0966959235 ผลรวม 54 ราชาโชค..."
                className="w-full rounded-2xl border border-orange-500/40 bg-slate-950 p-4 text-xs sm:text-sm text-white focus:border-orange-400 focus:outline-none font-mono leading-relaxed"
                required
              />
            </div>

            {/* Provider Option */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                🌿 ค่ายสัญญาณ (ค่าเริ่มต้นสำหรับเบอร์ที่ระบุค่ายไม่ได้)
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as Provider)}
                className="w-full sm:w-1/2 rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
              >
                <option value="AIS">🌿 AIS 5G</option>
                <option value="TRUE">🍒 TRUE 5G</option>
                <option value="DTAC">🌊 DTAC</option>
              </select>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-cute-gold w-full py-4 text-sm font-black text-slate-950 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>กำลังวิเคราะห์เลขศาสตร์และผูกลิงก์ร้าน...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>✨ วิเคราะห์คะแนน & บันทึกเข้าคลังร้านค้าทันที 🚀</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {importResult && (
          <section className="space-y-6 animate-fadeIn">
            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="cute-card p-4 border-slate-800/80 text-center">
                <div className="text-2xl font-black text-white">{importResult.importedCount}</div>
                <div className="text-xs text-slate-400 font-bold mt-0.5">📱 เพิ่มเข้าร้าน {importResult.storeName}</div>
              </div>

              <div className="cute-card p-4 border-amber-500/40 bg-amber-950/20 text-center">
                <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                  <Star className="h-5 w-5 fill-amber-300" />
                  <span>{importResult.gradeSCount}</span>
                </div>
                <div className="text-xs text-amber-200/80 font-bold mt-0.5">🌟 เกรด S (90+ ปังสุดๆ)</div>
              </div>

              <div className="cute-card p-4 border-emerald-500/40 bg-emerald-950/20 text-center">
                <div className="text-2xl font-black text-emerald-300">{importResult.gradeACount}</div>
                <div className="text-xs text-emerald-200/80 font-bold mt-0.5">🌸 เกรด A (80+ ดีเยี่ยม)</div>
              </div>

              <div className="cute-card p-4 border-rose-500/40 bg-rose-950/20 text-center">
                <div className="text-2xl font-black text-rose-300">{importResult.dangerousCount}</div>
                <div className="text-xs text-rose-200/80 font-bold mt-0.5">⚠️ มีคู่เลขอัปมงคล</div>
              </div>
            </div>

            {/* Imported Numbers List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>ผลการวิเคราะห์เบอร์ร้าน {importResult.storeName} ({importResult.numbers.length} เบอร์)</span>
                </h2>
                <Link
                  href="/stores"
                  className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <span>ไปดูในหน้ารวมร้านค้า Shopee</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {importResult.numbers.map((num, i) => (
                  <NumberCard key={num.id} numberData={num} rank={i + 1} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
