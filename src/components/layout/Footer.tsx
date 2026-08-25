import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/90 text-slate-400 py-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-400 to-pink-400 text-lg">
                🐱
              </div>
              <span className="text-base font-black text-white">
                LUCKY SIM <span className="text-amber-400">AI</span>
              </span>
              <span className="text-xs text-pink-400 font-semibold bg-pink-500/10 px-2 py-0.5 rounded-full">
                น้องมูมูจัดให้ ✨
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              ให้น้อง AI ช่วยเลือกเบอร์โทรศัพท์ที่เข้ากับดวงและอาชีพของคุณที่สุด วิเคราะห์แม่นยำ 100% ตามศาสตร์ไทยประยุกต์ ปลอดภัย ไร้คู่เลขอัปมงคล สบายใจได้เลยน้า 🌸
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-amber-300">
                ✨ Gemini 2.5 AI
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-pink-300">
                💖 Thai Numerology
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-300">
                📱 AIS 5G Ready
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              🌸 เมนูแนะนำ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/wizard" className="hover:text-amber-300 transition-colors">
                  ✨ น้อง AI ช่วยหาเบอร์
                </Link>
              </li>
              <li>
                <Link href="/numbers" className="hover:text-amber-300 transition-colors">
                  📱 ส่องคลังเบอร์มงคล
                </Link>
              </li>
              <li>
                <Link href="/hunter" className="hover:text-amber-300 transition-colors">
                  🤖 ตั้งบอทช่วยล่าเบอร์
                </Link>
              </li>
              <li>
                <Link href="/encyclopedia" className="hover:text-amber-300 transition-colors">
                  📖 เปิดคัมภีร์คู่เลข 00–99
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              🍀 เคล็ดลับมงคล
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• ทักษาประจำวันเกิด 8 วัน</li>
              <li>• เลี่ยงเลขกาลกิณีดวงชะตา</li>
              <li>• พลังคู่เลข 7 ตัวท้าย</li>
              <li>• เบอร์มังกร 789 & หงส์ 289</li>
              <li>• ผลรวมรับทรัพย์สมบูรณ์</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p className="flex items-center gap-1.5">
            <span>สร้างด้วยความรักและพลังมงคล</span>
            <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500 inline" />
            <span>© 2026 LUCKY SIM AI</span>
          </p>
          <p className="text-[11px] text-slate-500">
            🐱 น้องมงคลพร้อมเสิร์ฟความปังตลอด 24 ชั่วโมง
          </p>
        </div>
      </div>
    </footer>
  );
}
