"use client";

import { useState, useEffect } from "react";
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
  Trash2,
  PlusCircle,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function NumberManagerPage() {
  const [mode, setMode] = useState<"BULK" | "SINGLE">("BULK");

  // Single mode state
  const [singleNumber, setSingleNumber] = useState("");
  const [singleStoreName, setSingleStoreName] = useState("Mobilesphone");
  const [singleStoreUrl, setSingleStoreUrl] = useState("https://shopee.co.th/");
  const [singlePrice, setSinglePrice] = useState("");

  // Bulk mode state
  const [bulkStoreName, setBulkStoreName] = useState("Mobilesphone");
  const [bulkStoreUrl, setBulkStoreUrl] = useState("https://shopee.co.th/");
  const [bulkText, setBulkText] = useState("");
  const [bulkProvider, setBulkProvider] = useState<Provider>("AIS");
  const [bulkPrice, setBulkPrice] = useState("");

  // Common state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [allInventory, setAllInventory] = useState<ScoredNumber[]>([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

  const presetStores = [
    { name: "Mobilesphone", url: "https://shopee.co.th/search?keyword=Mobilesphone" },
    { name: "MoranetShop", url: "https://shopee.co.th/search?keyword=MoranetShop" },
    { name: "7SIMNET", url: "https://shopee.co.th/search?keyword=7SIMNET" },
  ];

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const res = await fetch("/api/numbers");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setAllInventory(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInventory(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleSelectPreset = (preset: { name: string; url: string }) => {
    if (mode === "BULK") {
      setBulkStoreName(preset.name);
      setBulkStoreUrl(preset.url);
    } else {
      setSingleStoreName(preset.name);
      setSingleStoreUrl(preset.url);
    }
  };

  // Submit Single or Bulk
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const textToSubmit = mode === "SINGLE" ? singleNumber : bulkText;
      const storeNameToSubmit = mode === "SINGLE" ? singleStoreName : bulkStoreName;
      const storeUrlToSubmit = mode === "SINGLE" ? singleStoreUrl : bulkStoreUrl;
      const priceToSubmit = mode === "SINGLE" ? singlePrice : bulkPrice;

      if (!textToSubmit.trim()) {
        setErrorMsg("กรุณากรอกเบอร์โทรศัพท์");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/numbers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSubmit,
          storeName: storeNameToSubmit,
          storeUrl: storeUrlToSubmit,
          provider: bulkProvider,
          price: priceToSubmit ? parseInt(priceToSubmit.replace(/\D/g, ""), 10) : undefined,
        }),
      });

      const json = await res.json();
      if (!json.success) {
        setErrorMsg(json.error || "เกิดข้อผิดพลาดในการบันทึกเบอร์");
      } else {
        setSuccessMsg(`✨ บันทึกและคำนวณคะแนนเบอร์ ${json.data.importedCount} เบอร์ เรียบร้อยแล้ว!`);
        if (mode === "SINGLE") {
          setSingleNumber("");
          setSinglePrice("");
        } else {
          setBulkText("");
          setBulkPrice("");
        }
        await fetchInventory();
      }
    } catch (err: any) {
      setErrorMsg("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  // Delete Single Number
  const handleDeleteNumber = async (rawNumber: string) => {
    if (!confirm(`คุณต้องการลบเบอร์ ${rawNumber} ออกจากระบบใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`/api/numbers?rawNumber=${rawNumber}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg(`ลบเบอร์ ${rawNumber} สำเร็จ`);
        await fetchInventory();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Clear Entire Pool
  const handleClearAll = async () => {
    if (!confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบเบอร์ทั้งหมดออกจากระบบ? (ไม่สามารถกู้คืนได้)")) return;

    try {
      const res = await fetch("/api/numbers?clearAll=true", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setSuccessMsg("ล้างคลังเบอร์ทั้งหมดเรียบร้อยแล้ว");
        setAllInventory([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <span>🛍️ สตูดิโอจัดการเบอร์ & ลิงก์ร้าน Shopee</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              ลงเบอร์ & ลิงก์ร้านค้า <span className="cute-gold-gradient">Inventory Studio 🌸</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
              คุณใส่เบอร์ ราคา และลิงก์ร้านค้าเองได้ 100% ระบบจะนำไปคำนวณคะแนน 2 ระบบและนำไปจับคู่ผูกดวงกับชื่อ-สกุลค่ะ
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleClearAll}
              disabled={allInventory.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>ล้างเบอร์ทั้งหมด ({allInventory.length})</span>
            </button>
            <Link
              href="/fortune"
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white text-xs font-bold transition-all shadow"
            >
              <span>🔮 ไปหน้าผูกดวงชื่อ-สกุล</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-2xl bg-slate-900/80 p-1.5 border border-slate-800 max-w-md">
          <button
            type="button"
            onClick={() => setMode("BULK")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === "BULK"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ClipboardPaste className="h-4 w-4" />
            <span>📋 วางเป็นชุดหลายๆ เบอร์ (Bulk)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("SINGLE")}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              mode === "SINGLE"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PlusCircle className="h-4 w-4" />
            <span>⚡ ใส่ทีละเบอร์ (Single Form)</span>
          </button>
        </div>

        {/* Input Form Card */}
        <div className="cute-card p-6 sm:p-8 border-orange-500/30 bg-gradient-to-br from-orange-950/20 via-slate-900 to-slate-900 space-y-6">
          {/* Quick Preset Buttons */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <span>🏪 เลือกร้านค้า Shopee ยอดนิยม หรือพิมพ์ชื่อร้านใหม่:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presetStores.map((p) => {
                const isSelected = (mode === "BULK" ? bulkStoreName : singleStoreName) === p.name;
                return (
                  <button
                    type="button"
                    key={p.name}
                    onClick={() => handleSelectPreset(p)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-orange-500 text-white border-orange-400 shadow-md"
                        : "bg-slate-950 text-slate-300 border-slate-700 hover:border-orange-400"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Store Name & Store URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <Store className="h-4 w-4 text-orange-400" />
                  <span>ชื่อร้านค้าใน Shopee</span>
                </label>
                <input
                  type="text"
                  value={mode === "BULK" ? bulkStoreName : singleStoreName}
                  onChange={(e) =>
                    mode === "BULK" ? setBulkStoreName(e.target.value) : setSingleStoreName(e.target.value)
                  }
                  placeholder="เช่น Mobilesphone, MoranetShop, 7SIMNET..."
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
                  value={mode === "BULK" ? bulkStoreUrl : singleStoreUrl}
                  onChange={(e) =>
                    mode === "BULK" ? setBulkStoreUrl(e.target.value) : setSingleStoreUrl(e.target.value)
                  }
                  placeholder="https://shopee.co.th/..."
                  className="w-full rounded-2xl border border-orange-500/40 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-orange-400 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* Mode-Specific Input Fields */}
            {mode === "BULK" ? (
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <ClipboardPaste className="h-4 w-4 text-orange-400" />
                  <span>วางรายการเบอร์โทรศัพท์ (วางได้หลายเบอร์ หรือก๊อปปี้มาทั้งแคปชั่น):</span>
                </label>

                <textarea
                  rows={6}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="วางข้อความที่นี่ เช่น:&#10;097-4294441, 097-8249442, 063-9269441&#10;098-789-5665 ซิมมังกร 4,990 บาท&#10;0966959235 ผลรวม 54 ราชาโชค..."
                  className="w-full rounded-2xl border border-orange-500/40 bg-slate-950 p-4 text-xs sm:text-sm text-white focus:border-orange-400 focus:outline-none font-mono leading-relaxed"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    📱 เบอร์โทรศัพท์ 10 หลัก
                  </label>
                  <input
                    type="text"
                    value={singleNumber}
                    onChange={(e) => setSingleNumber(e.target.value)}
                    placeholder="เช่น 098-789-5665 หรือ 0987895665"
                    className="w-full rounded-2xl border border-orange-500/40 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-orange-400 focus:outline-none font-mono font-bold text-lg text-amber-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    💰 ราคาเบอร์ (บาท) <span className="text-slate-400 font-normal">- ไม่ใส่ก็ได้</span>
                  </label>
                  <input
                    type="text"
                    value={singlePrice}
                    onChange={(e) => setSinglePrice(e.target.value)}
                    placeholder="เช่น 1990 หรือ 4,900"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Provider & Price for Bulk Mode */}
            {mode === "BULK" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    🌿 ค่ายสัญญาณ (ค่าเริ่มต้น)
                  </label>
                  <select
                    value={bulkProvider}
                    onChange={(e) => setBulkProvider(e.target.value as Provider)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                  >
                    <option value="AIS">🌿 AIS 5G</option>
                    <option value="TRUE">🍒 TRUE 5G</option>
                    <option value="DTAC">🌊 DTAC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    💰 ราคาเบอร์ (บาท) <span className="text-slate-400 font-normal">- สำหรับทุกเบอร์ในชุดนี้ (ไม่ใส่ก็ได้)</span>
                  </label>
                  <input
                    type="text"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    placeholder="เช่น 1990 หรือ 2,490"
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Messages */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
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
                    <span>กำลังวิเคราะห์เลขศาสตร์และบันทึกลงระบบ...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>✨ วิเคราะห์คะแนน 2 ระบบ & บันทึกเข้าคลังทันที 🚀</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Current Real Inventory List Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>📋 คลังเบอร์ในระบบที่คุณลงไว้ ({allInventory.length} เบอร์)</span>
            </h2>
            <span className="text-xs text-slate-400">
              ทุกเบอร์จะถูกนำไปวิเคราะห์และจับคู่ผูกดวงกับชื่อ-สกุลอัตโนมัติค่ะ
            </span>
          </div>

          {loadingInventory ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>กำลังโหลดข้อมูลคลังเบอร์...</span>
            </div>
          ) : allInventory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allInventory.map((num) => (
                <div
                  key={num.id}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      🛍️ {num.source || "Shopee"}
                    </span>
                    <button
                      onClick={() => handleDeleteNumber(num.rawNumber)}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors"
                      title="ลบเบอร์นี้"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="font-mono text-lg font-black text-white">{num.formattedNumber}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span>ผลรวม <strong className="text-amber-300">{num.totalSum}</strong></span>
                      <span>•</span>
                      <span>คะแนนเลขศาสตร์ <strong className="text-emerald-300">{num.totalScore}/100</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    {num.price && num.price > 0 ? (
                      <span className="font-mono font-bold text-emerald-300">฿{num.price.toLocaleString()}</span>
                    ) : (
                      <span className="text-[11px] text-slate-500">-</span>
                    )}

                    {num.buyUrl && (
                      <a
                        href={num.buyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300"
                      >
                        <span>เปิดใน Shopee</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center bg-slate-900/30">
              <div className="text-4xl mb-2">📥</div>
              <h3 className="text-base font-bold text-white mb-1">ยังไม่มีเบอร์ในระบบ</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                เริ่มต้นโดยการใส่เบอร์จาก Shopee ด้านบนได้เลยค่ะ เมื่อคุณลงเบอร์แล้ว ระบบจะนำไปคำนวณและแมตช์กับดวงชื่อ-สกุลให้ทันที
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
