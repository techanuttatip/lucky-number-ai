"use client";

import { useState, useEffect } from "react";
import { HunterJob, SearchCriteria, Provider } from "@/types";
import { Bot, Play, Plus, Clock, CheckCircle2, Terminal, AlertCircle, RefreshCw, Sparkles, Heart } from "lucide-react";

export default function HunterControlPage() {
  const [jobs, setJobs] = useState<HunterJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningJobId, setRunningJobId] = useState<string | null>(null);

  // New Job Modal Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("น้องบอทล่าเบอร์เศรษฐี AIS ประจำวัน ✨");
  const [provider, setProvider] = useState<Provider>("AIS");
  const [budgetMax, setBudgetMax] = useState(10000);
  const [frequency, setFrequency] = useState<"once" | "hourly" | "daily">("hourly");

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/hunt");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setJobs(data.data);
      }
    } catch (e) {
      console.error("Failed to load hunter jobs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleTriggerJob = async (jobId: string, criteria: SearchCriteria) => {
    setRunningJobId(jobId);
    try {
      await fetch("/api/hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, criteria }),
      });
      await fetchJobs();
    } catch (e) {
      console.error(e);
    } finally {
      setRunningJobId(null);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCriteria: SearchCriteria = {
      providers: [provider],
      budgetMax,
    };
    const newJobId = `job_${Date.now()}`;
    await handleTriggerJob(newJobId, newCriteria);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider mb-1">
              <span>🤖 น้องบอทอัตโนมัติ 24 ชม.</span>
            </div>
            <h1 className="text-3xl font-black text-white">
              ระบบบอทล่าเบอร์ <span className="cute-gold-gradient">Hunter Jobs 🌸</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 mt-1">
              ตั้งเวลาให้น้องบอทออกไปสแกนเบอร์ใหม่จาก AIS Store และอัปเดตเข้าคลังให้อัตโนมัติค่า
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-cute-gold flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-950 shadow"
            >
              <Plus className="h-4 w-4" />
              <span>สั่งบอทตัวใหม่ ✨</span>
            </button>
            <button
              onClick={fetchJobs}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Source Scrapers Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="cute-card p-4 border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-bold">🌿 AIS Store Scraper</div>
              <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>พร้อมสแกนตลอดเวลา</span>
              </div>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-xl text-slate-300">Playwright</span>
          </div>

          <div className="cute-card p-4 border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-bold">💖 Rule Engine (ไทย)</div>
              <div className="text-xs font-bold text-pink-300 flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-pink-400" />
                <span>ตรวจคู่เลข 00–99 ครบ</span>
              </div>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-xl text-slate-300">TypeScript</span>
          </div>

          <div className="cute-card p-4 border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-bold">🔮 Google Gemini 2.5</div>
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mt-1">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>น้อง AI ให้ความเห็นสด</span>
              </div>
            </div>
            <span className="text-xs font-mono bg-slate-800 px-2.5 py-1 rounded-xl text-slate-300">Gemini AI</span>
          </div>
        </div>

        {/* Hunter Jobs List */}
        <section className="space-y-4">
          <h2 className="text-base font-black text-white">รายการบอทที่ทำงานอยู่ ({jobs.length})</h2>

          <div className="space-y-4">
            {jobs.map((job) => {
              const isRunning = runningJobId === job.id;
              return (
                <div
                  key={job.id}
                  className="cute-card p-5 sm:p-6 border-slate-800/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{job.title}</h3>
                        <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-pink-500/15 text-pink-300 border border-pink-500/25">
                          {job.frequency === "hourly" ? "ทุก 1 ชม. ⏰" : job.frequency === "daily" ? "ทุกวัน ☀️" : "ครั้งเดียว"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        ค่าย: {job.criteria.providers?.join(", ") || "ทั้งหมด"} | งบไม่เกิน {job.criteria.budgetMax?.toLocaleString() || "ไม่จำกัด"} บ. | สแกนเจอ {job.totalFound} เบอร์ (เกรดดี {job.topCandidatesCount} เบอร์)
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleTriggerJob(job.id, job.criteria)}
                        disabled={isRunning}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <Play className={`h-3.5 w-3.5 text-amber-300 ${isRunning ? "animate-spin" : ""}`} />
                        <span>{isRunning ? "น้องบอทกำลังวิ่ง..." : "สั่งให้บอทเริ่มวิ่ง"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Logs */}
                  {job.logs && job.logs.length > 0 && (
                    <div className="rounded-2xl bg-slate-950 p-3.5 font-mono text-[11px] text-slate-400 space-y-0.5 border border-slate-800/80">
                      {job.logs.slice(-3).map((l, idx) => (
                        <div key={idx}>
                          <span className="text-pink-400">&gt;</span> {l}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
            <div className="w-full max-w-lg rounded-3xl border border-pink-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🤖</span>
                <h3 className="text-xl font-black text-white">สร้างบอทค้นหาเบอร์ตัวใหม่</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                ตั้งเป้าหมายให้น้องบอทออกไปสแกนหาเบอร์มงคลใหม่ๆ เข้าคลังให้อัตโนมัติ
              </p>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">ชื่องานค้นหา</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-pink-400 focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ค่ายสัญญาณ</label>
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
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">ความถี่ในการสแกน</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as any)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-pink-400 focus:outline-none"
                    >
                      <option value="hourly">⏰ ทุก 1 ชั่วโมง</option>
                      <option value="daily">☀️ วันละ 1 ครั้ง</option>
                      <option value="once">ครั้งเดียว</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">งบประมาณสูงสุด (บาท)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(parseInt(e.target.value, 10))}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-pink-400 focus:outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-400 hover:text-white"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="btn-cute-gold px-6 py-2.5 text-xs font-black text-slate-950 shadow"
                  >
                    บันทึกและปล่อยบอท 🚀
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
