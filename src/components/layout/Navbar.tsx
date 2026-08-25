"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Search, Bot, BookOpen, Heart, Flame, ClipboardPaste } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "หน้าแรก", emoji: "🏠", icon: Flame },
    { href: "/fortune", label: "ผูกดวงเฉพาะบุคคล", emoji: "🔮", icon: Sparkles, highlight: true },
    { href: "/import", label: "วางเบอร์ Shopee", emoji: "📥", icon: ClipboardPaste },
    { href: "/wizard", label: "น้อง AI เสกเบอร์", emoji: "✨", icon: Sparkles },
    { href: "/numbers", label: "ส่องคลังเบอร์", emoji: "📱", icon: Search },
    { href: "/hunter", label: "บอทล่าเบอร์", emoji: "🤖", icon: Bot },
    { href: "/encyclopedia", label: "คัมภีร์คู่เลข", emoji: "📖", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mascot Brand & Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-yellow-300 text-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <span className="select-none">🐱</span>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-slate-950 shadow">
              ✨
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                LUCKY SIM <span className="cute-gold-gradient">AI</span>
              </span>
              <span className="rounded-full bg-pink-500/15 px-2 py-0.5 text-[10px] font-bold text-pink-300 border border-pink-500/25">
                น้องมงคล 💖
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              ผู้ช่วย AI เสกเบอร์มงคลเฉพาะตัวคุณ 🌸
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-2xl border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md scale-105"
                    : item.highlight
                    ? "text-pink-300 hover:text-white hover:bg-pink-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/wizard"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-400 to-yellow-400 px-4 py-2 text-xs sm:text-sm font-extrabold text-slate-950 shadow-lg hover:shadow-pink-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="h-4 w-4 fill-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
            <span>เริ่มเสกเบอร์เลย!</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
