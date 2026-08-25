import { NextRequest, NextResponse } from "next/server";
import { calculateDualSystemMatch, UserPersonalProfile } from "@/lib/numerology/dual-engine";
import { decodeThaiName } from "@/lib/numerology/name-decoder";
import { BIRTH_RULES } from "@/lib/numerology/birth-rules";
import { CAREER_RULES } from "@/lib/numerology/career-rules";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/store/in-memory-db";
import { supabase } from "@/lib/supabase/client";
import { scorePhoneNumber } from "@/lib/numerology/scorer";
import { BirthDay, Career, EnergyGoal, ScoredNumber } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName = "",
      lastName = "",
      birthDay = "sunday",
      age = 30,
      career = "business_owner",
      goals = ["wealth"],
      provider = "ALL",
      source = "ALL",
    } = body;

    // 1. Calculate Name Numerology
    const nameAnalysis = decodeThaiName(firstName, lastName);

    // 2. Birthday & Career Rules
    const birthRule = BIRTH_RULES[birthDay as BirthDay] || BIRTH_RULES["sunday"];
    const careerRule = (CAREER_RULES as Record<string, any>)[career] || CAREER_RULES["management_exec"];

    const profile: UserPersonalProfile = {
      firstName,
      lastName,
      birthDay: birthDay as BirthDay,
      career: career as Career,
      goals: goals as EnergyGoal[],
      sourceFilter: source,
    };

    // 3. AI Gemini Personal Fortune Analysis
    const geminiKey = process.env.GEMINI_API_KEY;
    let aiDestinyAnalysis = {
      overview: `คุณ ${firstName || "เจ้าชะตา"} ${lastName} เกิดวัน${birthRule.nameTh} ผลรวมชื่อ-สกุลได้ ${nameAnalysis.fullNameSum} (${nameAnalysis.elementLabel}) ในวัย ${age} ปี อยู่ในเกณฑ์ที่ตัวเลขมงคลจะช่วยผลักดันความสำเร็จได้อย่างก้าวกระโดด`,
      strengths: [
        `กำลังชื่อ ${nameAnalysis.firstNameSum} หนุนนำความคิดสร้างสรรค์และไหวพริบ`,
        `ทักษาวันเกิดเด่นเรื่อง${birthRule.elementTh} มีพลังความมุ่งมั่นสูง`,
        `ผลรวมชื่อ-สกุล ${nameAnalysis.fullNameSum} หนุนนำ: ${nameAnalysis.fullNameMeaning}`,
      ],
      cautions: [
        `ควรหลีกเลี่ยงเลขกาลกิณี (${birthRule.forbiddenDigits.join(", ")}) ในเบอร์โทรศัพท์อย่างเด็ดขาด`,
        `ไม่ควรมีคู่เลขอารมณ์ร้อนหรือคู่ขัดแย้งในตำแหน่ง 7 ตัวท้าย`,
      ],
      recommendedLuckyDigits: birthRule.auspiciousDigits,
      recommendedPairs: [...(careerRule?.essentialPairs || ["78", "89", "24"]), ...birthRule.goodPairsRecommended].slice(0, 6),
      destinyAdvice: `แนะนำให้เลือกเบอร์ที่มีผลรวมมงคล ${nameAnalysis.compatibleSumTargets.slice(0, 5).join(", ")} เพื่อปรับสมดุลธาตุให้ชะตาชีวิตราบรื่น มั่งคั่ง และมีความสุขครับ`,
    };

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
          },
        });

        const prompt = `
คุณคือปรมาจารย์ด้านศาสตร์ตัวเลขและโหราศาสตร์ไทยโบราณ
วิเคราะห์ดวงชะตาของบุคคลนี้อย่างละเอียด:
- ชื่อ: ${firstName} นามสกุล: ${lastName} (ผลรวมชื่อ: ${nameAnalysis.firstNameSum}, ผลรวมนามสกุล: ${nameAnalysis.lastNameSum}, ผลรวมทั้งชื่อและสกุล: ${nameAnalysis.fullNameSum})
- เกิดวัน: ${birthRule.nameTh} (กาลกิณี: ${birthRule.forbiddenDigits.join(", ")})
- อายุ: ${age} ปี
- สายงาน/อาชีพ: ${career}
- เป้าหมายเสริมพลัง: ${goals.join(", ")}

ให้ตอบกลับเป็น JSON Format ตามโครงสร้างนี้เท่านั้น:
{
  "overview": "คำทำนายภาพรวมชะตาชีวิตและพลังชื่อ-สกุล 2-3 ประโยค",
  "strengths": ["จุดเด่นและพลังหนุนนำ 3 ข้อ"],
  "cautions": ["สิ่งที่ควรระวังและเลขกาลกิณีที่ต้องห้าม 2 ข้อ"],
  "recommendedLuckyDigits": [ตัวเลขมงคลเด่นที่ควรมี 3-4 ตัวเลข],
  "recommendedPairs": ["คู่เลขมงคล 4-6 คู่ที่ส่งเสริมอาชีพและวันเกิด"],
  "destinyAdvice": "คำแนะนำในการเลือกเบอร์โทรศัพท์ที่หนุนดวงชะตาสูงสุด"
}
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) {
          const parsed = JSON.parse(text);
          aiDestinyAnalysis = { ...aiDestinyAnalysis, ...parsed };
        }
      } catch (aiErr) {
        console.warn("Gemini AI destiny analysis fallback used:", aiErr);
      }
    }

    // 4. Fetch Candidate Numbers from Memory DB & Supabase
    let pool: ScoredNumber[] = db.getAllNumbers();

    if (pool.length === 0) {
      try {
        const { data } = await supabase.from("numbers").select("*").limit(200);
        if (data && data.length > 0) {
          pool = data.map((r: any) =>
            scorePhoneNumber(r.raw_number, {
              id: `supa_${r.raw_number}`,
              provider: r.provider,
              price: r.price,
              source: r.package_detail || r.source || "Shopee Store",
              buyUrl: r.buy_url,
            })
          );
        }
      } catch (supaErr) {
        console.warn("Supabase fetch warning:", supaErr);
      }
    }

    // Filter by provider and store if specified
    const filteredPool = pool.filter((n) => {
      if (provider !== "ALL" && n.provider !== provider) return false;
      if (source !== "ALL") {
        const src = (n.source || "").toLowerCase();
        if (source === "Mobilesphone" && !src.includes("mobilesphone")) return false;
        if (source === "MoranetShop" && !src.includes("moranet")) return false;
        if (source === "7SIMNET" && !src.includes("7simnet")) return false;
      }
      return true;
    });

    // 5. Run Dual-System Matching for every number in the pool
    const dualMatches = filteredPool.map((num) => calculateDualSystemMatch(num, profile));

    // Sort by Overall Match Score descending
    dualMatches.sort((a, b) => b.overallMatchScore - a.overallMatchScore);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        nameAnalysis,
        aiDestinyAnalysis,
        totalPoolEvaluated: pool.length,
        filteredCount: filteredPool.length,
        topMatches: dualMatches.slice(0, 15),
        allMatches: dualMatches,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/fortune:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze fortune" },
      { status: 500 }
    );
  }
}
