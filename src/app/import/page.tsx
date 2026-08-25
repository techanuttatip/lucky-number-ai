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
  ListPlus,
  ShieldCheck,
  Star,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function BulkImportPage() {
  const [inputText, setInputText] = useState("");
  const [provider, setProvider] = useState<Provider>("AIS");
  const [source, setSource] = useState("Shopee");
  const [defaultPrice, setDefaultPrice] = useState(2990);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    importedCount: number;
    numbers: ScoredNumber[];
    gradeSCount: number;
    gradeACount: number;
    dangerousCount: number;
  } | null>(null);

  const sampleShopeeText = `รายการเบอร์มงคลจาก Shopee:
- 098-789-5665 ซิมมังกร 789 พลังมหาเศรษฐี 4,990.-
- 096-695-9235 ผลรวม 54 ราชาโชค 69 95 92 35
- 081-242-4656 ซิมมหาเสน่ห์ เมตตามหานิยม
- 063-936-5459 เบอร์กวนอู โกยทรัพย์
- 095-896-5415 ผลรวม 45 เทพประทาน`;

  const handleSetSample = () => {
    setInputText(sampleShopeeText);
    setErrorMsg(null);
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
          provider,
          source,
          price: defaultPrice,
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
              <span>🛍️ นำเข้าเบอร์จาก Shopee & ข้อความ</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              วางข้อความนำเข้าเบอร์ <span className="cute-gold-gradient">Bulk Importer 🌸</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
              ก๊อปปี้ข้อความหรือรายการเบอร์จาก Shopee มาวาง ระบบจะสกัดตัวเลข คำนวณคะแนน 0–100 และเซฟลงฐานข้อมูลให้อัตโนมัติค่า
            </p>
          </div>

          <Link
            href="/numbers"
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-all self-start sm:self-auto"
          >
            <span>ดูคลังเบอร์ทั้งหมด</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Input Form Card */}
        <div className="cute-card p-6 sm:p-8 border-orange-500/30 bg-gradient-to-br from-orange-950/20 via-slate-900 to-slate-900 space-y-6">
          <form onSubmit={handleImport} className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <ClipboardPaste className="h-4 w-4 text-orange-400" />
                  <span>วางข้อความหรือรายการเบอร์ที่คัดลอกมา (วางได้หลายเบอร์พร้อมกัน):</span>
                </label>
                <button
                  type="button"
                  onClick={handleSetSample}
                  className="text-[11px] font-bold text-orange-300 hover:text-orange-200 underline"
                >
                  ลองใส่ตัวอย่างข้อความ Shopee ✨
                </button>
              </div>

              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="วางข้อความที่นี่ เช่น:&#10;098-789-5665 ซิมเบอร์มงคล 4,990 บาท&#10;0966959235 ผลรวม 54&#10;0812424656, 0639365459, 0958965415..."
                className="w-full rounded-2xl border border-orange-500/40 bg-slate-950 p-4 text-xs sm:text-sm text-white focus:border-orange-400 focus:outline-none font-mono leading-relaxed"
                required
              />
            </div>

            {/* Config Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  🏪 แหล่งที่มาของเบอร์
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                >
                  <option value="Shopee">🛍️ Shopee Mall & ร้านซิม</option>
                  <option value="AIS Online Store">🌿 AIS Online Store</option>
                  <option value="True Official Store">🍒 True Official Store</option>
                  <option value="Berthongsuk">🔮 ร้านเบอร์ทองสุข</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  🌿 ค่ายสัญญาณ (ค่าเริ่มต้น)
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as Provider)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                >
                  <option value="AIS">🌿 AIS 5G</option>
                  <option value="TRUE">🍒 TRUE 5G</option>
                  <option value="DTAC">🌊 DTAC</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  💰 ราคาโดยประมาณ (บาท)
                </label>
                <input
                  type="number"
                  value={defaultPrice}
                  onChange={(e) => setDefaultPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                />
              </div>
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
                    <span>กำลังสกัดตัวเลขและคำนวณความมงคล...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>✨ สกัดเบอร์ & คำนวณความมงคลเข้าคลังทันที 🚀</span>
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
                <div className="text-xs text-slate-400 font-bold mt-0.5">📱 สกัดพบทั้งหมด</div>
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
                  <span>ผลการวิเคราะห์เบอร์ที่นำเข้า ({importResult.numbers.length} เบอร์)</span>
                </h2>
                <Link
                  href="/numbers"
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
                >
                  <span>ไปดูในคลังเบอร์สด</span>
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
