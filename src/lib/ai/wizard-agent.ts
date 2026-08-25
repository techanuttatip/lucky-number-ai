import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { SearchCriteria } from "@/types";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function parseUserPromptWithMasterAI(prompt: string): Promise<SearchCriteria> {
  const systemInstruction = `You are "Master AI" for an Auspicious Thai Phone Number Hunter application.
Extract the user's intent into a structured JSON SearchCriteria.

Available birthDay options:
- "sunday", "monday", "tuesday", "wednesday_day", "wednesday_night", "thursday", "friday", "saturday"

Available career options:
- "sales_trading" (ค้าขาย, เซลล์, นายหน้า)
- "management_exec" (ผู้บริหาร, เจ้าของธุรกิจ, CEO)
- "tech_developer" (โปรแกรมเมอร์, ไอที, วิศวกร, AI)
- "finance_invest" (การเงิน, หุ้น, บัญชี, คริปโต)
- "creative_media" (อินฟลู, ดารา, ศิลปิน, การตลาด)
- "civil_service" (ข้าราชการ, ทหาร, ตำรวจ)
- "medical_health" (หมอ, พยาบาล, เภสัช, สุขภาพ)
- "foreign_travel" (งานต่างประเทศ, โลจิสติกส์, นำเข้า)
- "spiritual_occult" (สายมู, โหราศาสตร์, สมาธิ)
- "student_academic" (นักเรียน, นักศึกษา, ครู, นักวิจัย)

Available goals options:
- "wealth" (การเงิน, ร่ำรวย, เงินก้อน)
- "charm_love" (เสน่ห์, ความรัก, เมตตา)
- "prestige_power" (บารมี, อำนาจ, เลื่อนขั้น)
- "wisdom_peace" (สติ, สมาธิ, อารมณ์เย็น)
- "health_safety" (สุขภาพ, แคล้วคลาด)
- "luck_windfall" (โชคลาภ, เสี่ยงดวง)

Output JSON only with keys:
{
  "birthDay": string or null,
  "career": string or null,
  "goals": string[],
  "budgetMax": number or null,
  "mustHavePairs": string[],
  "keywordSearch": string or null
}`;

  // 1. Try Google Gemini API
  if (genAI && geminiApiKey) {
    try {
      const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      if (rawText) {
        const cleanJson = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        return {
          birthDay: parsed.birthDay || undefined,
          career: parsed.career || undefined,
          goals: parsed.goals || [],
          budgetMax: parsed.budgetMax || undefined,
          mustHavePairs: parsed.mustHavePairs || [],
          keywordSearch: parsed.keywordSearch || undefined,
        };
      }
    } catch (err) {
      console.warn("Gemini API call failed in Master AI, trying fallback:", err);
    }
  }

  // 2. Try OpenAI API (Fallback)
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
      return {
        birthDay: parsed.birthDay || undefined,
        career: parsed.career || undefined,
        goals: parsed.goals || [],
        budgetMax: parsed.budgetMax || undefined,
        mustHavePairs: parsed.mustHavePairs || [],
        keywordSearch: parsed.keywordSearch || undefined,
      };
    } catch (e) {
      console.warn("Master AI OpenAI parse failed, using heuristic regex parser:", e);
    }
  }

  // 3. Heuristic rule-based natural language parser (Fallback)
  return parseHeuristically(prompt);
}

function parseHeuristically(text: string): SearchCriteria {
  const lower = text.toLowerCase();
  const criteria: SearchCriteria = {
    goals: [],
  };

  // 1. Birth day detection
  if (lower.includes("อาทิตย์")) criteria.birthDay = "sunday";
  else if (lower.includes("จันทร์")) criteria.birthDay = "monday";
  else if (lower.includes("อังคาร")) criteria.birthDay = "tuesday";
  else if (lower.includes("พุธกลางคืน") || lower.includes("ราหู")) criteria.birthDay = "wednesday_night";
  else if (lower.includes("พุธ")) criteria.birthDay = "wednesday_day";
  else if (lower.includes("พฤหัส")) criteria.birthDay = "thursday";
  else if (lower.includes("ศุกร์")) criteria.birthDay = "friday";
  else if (lower.includes("เสาร์")) criteria.birthDay = "saturday";

  // 2. Career detection
  if (lower.includes("โปรแกรม") || lower.includes("ไอที") || lower.includes("โค้ด") || lower.includes("tech") || lower.includes("dev")) {
    criteria.career = "tech_developer";
  } else if (lower.includes("ค้าขาย") || lower.includes("เซลล์") || lower.includes("ขายของ") || lower.includes("นายหน้า")) {
    criteria.career = "sales_trading";
  } else if (lower.includes("ผู้บริหาร") || lower.includes("ceo") || lower.includes("เจ้าของ") || lower.includes("หัวหน้า")) {
    criteria.career = "management_exec";
  } else if (lower.includes("หุ้น") || lower.includes("การเงิน") || lower.includes("ลงทุน") || lower.includes("บัญชี")) {
    criteria.career = "finance_invest";
  } else if (lower.includes("อินฟลู") || lower.includes("ดารา") || lower.includes("ครีเอเตอร์") || lower.includes("บันเทิง")) {
    criteria.career = "creative_media";
  } else if (lower.includes("ข้าราชการ") || lower.includes("ทหาร") || lower.includes("ตำรวจ") || lower.includes("รัฐวิสาหกิจ")) {
    criteria.career = "civil_service";
  } else if (lower.includes("หมอ") || lower.includes("แพทย์") || lower.includes("พยาบาล") || lower.includes("เภสัช")) {
    criteria.career = "medical_health";
  } else if (lower.includes("ต่างประเทศ") || lower.includes("โลจิสติกส์") || lower.includes("ไกด์") || lower.includes("นำเข้า")) {
    criteria.career = "foreign_travel";
  } else if (lower.includes("สายมู") || lower.includes("หมอดู") || lower.includes("โหราศาสตร์")) {
    criteria.career = "spiritual_occult";
  }

  // 3. Goals detection
  if (lower.includes("เงิน") || lower.includes("รวย") || lower.includes("ทรัพย์") || lower.includes("โภคทรัพย์")) {
    criteria.goals?.push("wealth");
  }
  if (lower.includes("เสน่ห์") || lower.includes("ความรัก") || lower.includes("เมตตา") || lower.includes("คนรัก")) {
    criteria.goals?.push("charm_love");
  }
  if (lower.includes("อำนาจ") || lower.includes("บารมี") || lower.includes("ลูกน้อง") || lower.includes("เลื่อนขั้น")) {
    criteria.goals?.push("prestige_power");
  }
  if (lower.includes("ปัญญา") || lower.includes("สมาธิ") || lower.includes("ใจเย็น") || lower.includes("สงบ") || lower.includes("คิดมาก")) {
    criteria.goals?.push("wisdom_peace");
  }
  if (lower.includes("โชค") || lower.includes("ลาภ") || lower.includes("เสี่ยงดวง") || lower.includes("หวย")) {
    criteria.goals?.push("luck_windfall");
  }

  // 4. Budget detection
  const budgetMatch = text.match(/(?:งบ|ไม่เกิน|ราคา)\s*([0-9,]+)/i);
  if (budgetMatch) {
    const rawVal = budgetMatch[1].replace(/,/g, "");
    const num = parseInt(rawVal, 10);
    if (!isNaN(num)) {
      criteria.budgetMax = num;
    }
  }

  // 5. Must have pairs detection
  const pairMatches = text.match(/\b([0-9]{2,3})\b/g);
  if (pairMatches) {
    criteria.mustHavePairs = pairMatches.filter((p) => p.length === 2 || p.length === 3);
  }

  return criteria;
}
