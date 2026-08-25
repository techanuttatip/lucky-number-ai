import { NextRequest, NextResponse } from "next/server";
import { calculateNameNumerology } from "@/lib/numerology/name-numerology";
import { BIRTH_RULES } from "@/lib/numerology/birth-rules";
import { CAREER_RULES } from "@/lib/numerology/career-rules";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/store/in-memory-db";
import { supabase } from "@/lib/supabase/client";
import { scorePhoneNumber } from "@/lib/numerology/scorer";
import { BirthDay, CareerCategory, EnergyGoal, ScoredNumber } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName = "",
      lastName = "",
      birthDay = "sunday",
      age = 30,
      career = "management_exec",
      goals = ["wealth"],
      budgetMax = 50000,
      provider = "ALL",
      source = "ALL",
    } = body;

    // 1. Calculate Name Numerology
    const nameAnalysis = calculateNameNumerology(firstName, lastName);

    // 2. Birthday & Career Rules
    const birthRule = BIRTH_RULES[birthDay as BirthDay] || BIRTH_RULES["sunday"];
    const careerRule = CAREER_RULES[career as CareerCategory] || CAREER_RULES["management_exec"];

    // 3. AI Gemini Personal Fortune Analysis
    const geminiKey = process.env.GEMINI_API_KEY;
    let aiDestinyAnalysis = {
      overview: `คุณ ${firstName || "เจ้าชะตา"} เกิดวัน${birthRule.nameTh} ธาตุประจำชื่อคือ ${nameAnalysis.element} ในวัย ${age} ปี อยู่ในเกณฑ์ที่พลังงานตัวเลขจะช่วยผลักดันความสำเร็จในสายงาน ${careerRule.titleTh} ได้อย่างก้าวกระโดด`,
      strengths: [
        `กำลังชื่อ ${nameAnalysis.firstNameScore} หนุนนำความคิดสร้างสรรค์และไหวพริบ`,
        `ทักษาวันเกิดเด่นเรื่อง${birthRule.elementTh} มีพลังความมุ่งมั่นสูง`,
        `สายงานตรงกับพลังคู่เลขเสริมอำนาจบารมีและการเจรจา`,
      ],
      cautions: [
        `ควรหลีกเลี่ยงเลขกาลกิณี (${birthRule.forbiddenDigits.join(", ")}) ในเบอร์โทรศัพท์อย่างเด็ดขาด`,
        `ไม่ควรมีคู่เลขอารมณ์ร้อนหรือคู่ขัดแย้งในตำแหน่ง 7 ตัวท้าย`,
      ],
      recommendedLuckyDigits: birthRule.auspiciousDigits,
      recommendedPairs: [...careerRule.essentialPairs, ...birthRule.goodPairsRecommended].slice(0, 6),
      destinyAdvice: `แนะนำให้ใช้เบอร์ที่เสริมพลัง ${goals.join(" และ ")} เพื่อปรับสมดุลธาตุให้ชะตาชีวิตราบรื่น มั่งคั่ง และมีความสุขครับ`,
    };

    if (geminiKey) {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const prompt = `
คุณเป็นผู้เชี่ยวชาญเลขศาสตร์และโหราศาสตร์ไทยชั้นสูง กรุณาวิเคราะห์ดวงชะตาและตัวเลขมงคลเฉพาะบุคคลสำหรับ:
- ชื่อ-นามสกุล: ${firstName} ${lastName} (กำลังชื่อ: ${nameAnalysis.firstNameScore}, กำลังรวม: ${nameAnalysis.totalNameScore})
- วันเกิด: วัน${birthRule.nameTh} (เลขกาลกิณีต้องห้าม: ${birthRule.forbiddenDigits.join(",")})
- อายุ: ${age} ปี
- สายอาชีพ: ${careerRule.titleTh}
- เป้าหมายที่ต้องการเสริม: ${goals.join(", ")}

ให้ตอบกลับเป็น JSON ภาษาไทยล้วนตามโครงสร้างนี้:
{
  "overview": "สรุปภาพรวมดวงชะตาและพลังงานชื่อ-วันเกิดแบบอบอุ่น เป็นมิตร",
  "strengths": ["จุดเด่นข้อที่ 1", "จุดเด่นข้อที่ 2", "จุดเด่นข้อที่ 3"],
  "cautions": ["ข้อควรระวัง/ตัวเลขต้องห้ามข้อที่ 1", "ข้อควรระวังข้อที่ 2"],
  "recommendedLuckyDigits": [เลขเดี่ยวที่เหมาะ 3-4 ตัว เช่น 5, 9, 6],
  "recommendedPairs": ["คู่เลขแนะนำ เช่น 65", "45", "78", "24"],
  "destinyAdvice": "คำแนะนำพิเศษเฉพาะบุคคลเพื่อความปัง"
}
`;
        const res = await model.generateContent(prompt);
        const text = res.response.text();
        if (text) {
          const parsed = JSON.parse(text);
          if (parsed.overview) {
            aiDestinyAnalysis = parsed;
          }
        }
      } catch (aiErr) {
        console.warn("Gemini destiny analysis error, using fallback:", aiErr);
      }
    }

    // 4. Match top candidate numbers from Pool & Score them specifically for this profile
    const allCandidatePool = db.getAllNumbers();
    const personalizedNumbers: ScoredNumber[] = allCandidatePool.map((c) => {
      return scorePhoneNumber(c.rawNumber, {
        birthDay: birthDay as BirthDay,
        career: career as CareerCategory,
        goals: goals as EnergyGoal[],
        provider: c.provider,
        price: c.price,
        packageDetail: c.packageDetail,
        buyUrl: c.buyUrl,
      });
    });

    // Filter and Sort by personalized total score
    let matchedNumbers = personalizedNumbers.filter((n) => {
      if (provider !== "ALL" && n.provider !== provider) return false;
      if (source !== "ALL") {
        const src = (n.source || "").toLowerCase();
        if (source === "SHOPEE" && !src.includes("shopee")) return false;
        if (source === "AIS" && !src.includes("ais")) return false;
        if (source === "TRUE" && !src.includes("true")) return false;
        if (source === "BERTHONGSUK" && !src.includes("berthongsuk")) return false;
      }
      if (budgetMax > 0 && n.price > budgetMax) return false;
      return true;
    });

    matchedNumbers.sort((a, b) => b.totalScore - a.totalScore);
    const topRecommendations = matchedNumbers.slice(0, 6);

    // 5. Save to Supabase profiles if possible
    try {
      if (firstName.trim()) {
        await supabase.from("profiles").insert([
          {
            full_name: `${firstName} ${lastName}`.trim(),
            birth_day: birthDay,
            career: career,
            budget_max: budgetMax,
            priority_goals: goals,
          },
        ]);
      }
    } catch (supaErr) {
      console.warn("Could not persist to Supabase profiles:", supaErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        profile: {
          firstName,
          lastName,
          birthDay,
          birthRule,
          age,
          career,
          careerRule,
          goals,
          budgetMax,
        },
        nameAnalysis,
        aiDestinyAnalysis,
        topRecommendations,
      },
    });
  } catch (error: any) {
    console.error("Error in fortune API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze fortune" },
      { status: 500 }
    );
  }
}
