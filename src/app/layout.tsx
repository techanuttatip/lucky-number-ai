import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUCKY SIM AI - ระบบ AI ค้นหา + วิเคราะห์เบอร์มงคลอัตโนมัติ",
  description:
    "ค้นหาและวิเคราะห์เบอร์มงคลเฉพาะบุคคลตามวันเกิด อาชีพ และเป้าหมาย ด้วย Deterministic Rule Engine และ OpenAI AI Judge พร้อมระบบดึงเบอร์อัตโนมัติจาก AIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
