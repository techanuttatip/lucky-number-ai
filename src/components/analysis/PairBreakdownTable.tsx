import { DecomposedPair } from "@/types";
import { ShieldCheck, AlertOctagon, Sparkles } from "lucide-react";

interface PairBreakdownTableProps {
  pairs: DecomposedPair[];
}

export function PairBreakdownTable({ pairs }: PairBreakdownTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            <th className="px-4 py-3.5">ตำแหน่ง</th>
            <th className="px-4 py-3.5">คู่เลข</th>
            <th className="px-4 py-3.5">เกรด / พลังงาน</th>
            <th className="px-4 py-3.5">ความหมายทางเลขศาสตร์</th>
            <th className="px-4 py-3.5 text-right">คะแนน</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {pairs.map((item, idx) => {
            const rule = item.rule;
            const isDangerous = item.isDangerous;

            return (
              <tr
                key={idx}
                className={`transition-colors hover:bg-slate-800/40 ${
                  isDangerous ? "bg-rose-950/20" : ""
                }`}
              >
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                  หลักที่ {item.position} (คู่ {idx + 1})
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg font-mono text-base font-black border ${
                      isDangerous
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                        : rule?.tier === "A+"
                        ? "bg-amber-400/20 text-amber-300 border-amber-400/40"
                        : rule?.tier === "A"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : "bg-slate-800 text-slate-200 border-slate-700"
                    }`}
                  >
                    {item.pair}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {isDangerous ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                        <AlertOctagon className="h-3.5 w-3.5" /> อัปมงคล / ดาวบาปเคราะห์
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-bold ${
                          rule?.tier === "A+"
                            ? "text-amber-400"
                            : rule?.tier === "A"
                            ? "text-emerald-400"
                            : "text-slate-400"
                        }`}
                      >
                        {rule?.tier || "มาตรฐาน"} • {rule?.category || "ทั่วไป"}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-white text-xs mb-0.5">
                    {rule?.title || `คู่เลข ${item.pair}`}
                  </div>
                  <div className="text-xs text-slate-400 max-w-md leading-relaxed">
                    {rule?.meaning}
                  </div>
                  {rule?.caution && (
                    <div className="text-[11px] text-amber-400/90 mt-1">
                      ⚠️ {rule.caution}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold">
                  <span
                    className={
                      item.scoreContribution > 0
                        ? "text-emerald-400"
                        : item.scoreContribution < 0
                        ? "text-rose-400"
                        : "text-slate-400"
                    }
                  >
                    {item.scoreContribution > 0 ? `+${item.scoreContribution}` : item.scoreContribution}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
