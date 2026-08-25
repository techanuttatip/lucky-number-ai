import { NextRequest, NextResponse } from "next/server";
import { scorePhoneNumber } from "@/lib/numerology/scorer";
import { evaluateNumberWithAIJudge } from "@/lib/ai/ai-judge";
import { BIRTH_RULES } from "@/lib/numerology/birth-rules";
import { CAREER_RULES } from "@/lib/numerology/career-rules";
import { db } from "@/lib/store/in-memory-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phoneNumber, birthDay, career, goals, provider, price, triggerAiJudge = true } = body;

    if (!phoneNumber || phoneNumber.trim().length < 9) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9-10 หลัก)" },
        { status: 400 }
      );
    }

    const scored = scorePhoneNumber(phoneNumber, {
      provider: provider || "AIS",
      price: price || 0,
      birthDay,
      career,
      goals,
    });

    if (triggerAiJudge) {
      const userBirthName = birthDay ? BIRTH_RULES[birthDay as keyof typeof BIRTH_RULES]?.nameTh : undefined;
      const userCareerName = career ? CAREER_RULES[career as keyof typeof CAREER_RULES]?.titleTh : undefined;
      
      const verdict = await evaluateNumberWithAIJudge(scored, {
        userBirthDayName: userBirthName,
        userCareerName: userCareerName,
        userGoals: goals,
      });
      scored.aiVerdict = verdict;
    }

    // Save/update in database store
    db.saveNumber(scored);

    return NextResponse.json({
      success: true,
      data: scored,
    });
  } catch (error: any) {
    console.error("Error in analyze API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to analyze number" },
      { status: 500 }
    );
  }
}
