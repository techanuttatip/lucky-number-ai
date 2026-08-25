import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { ScoredNumber } from "@/types";

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function evaluateNumberWithAIJudge(
  scoredNumber: ScoredNumber,
  context?: {
    userCareerName?: string;
    userBirthDayName?: string;
    userGoals?: string[];
  }
): Promise<ScoredNumber["aiVerdict"]> {
  const pairsSummary = scoredNumber.decomposedPairs
    .map((p) => `${p.pair} (${p.rule?.title || "ทั่วไป"})`)
    .join(", ");

  const dangerousText =
    scoredNumber.dangerousPairsFound.length > 0
      ? `พบคู่อันตราย: ${scoredNumber.dangerousPairsFound.join(", ")}`
      : "ไม่มีคู่เลขอัปมงคล";

  const kalaKineeText = scoredNumber.hasKalaKinee
    ? `พบเลขกาลกิณีประจำวันเกิด: ${scoredNumber.kalaKineeDigitsFound.join(", ")}`
    : "ไม่มีเลขกาลกิณี";

  const prompt = `คุณคือ "AI Judge - ปรมาจารย์ผู้เชี่ยวชาญศาสตร์ตัวเลขมงคลและพลังงานสากล"
หน้าที่ของคุณคือให้ความเห็นที่สอง (Second Opinion) และสังเคราะห์พลังงานรวมของเบอร์โทรศัพท์นี้อย่างลึกซึ้ง

ข้อมูลเบอร์:
- เบอร์โทร: ${scoredNumber.formattedNumber}
- ผลรวม 10 หลัก: ${scoredNumber.totalSum} (${scoredNumber.sumRule?.title || ""})
- คู่เลข 7 หลักท้าย: ${pairsSummary}
- คะแนนจาก Rule Engine: ${scoredNumber.totalScore} / 100
- การตรวจคู่อัปมงคล: ${dangerousText}
- การตรวจเลขกาลกิณี: ${kalaKineeText}
- โปรไฟล์พลังงาน: การเงิน ${scoredNumber.energyProfile.wealth}%, เสน่ห์ ${scoredNumber.energyProfile.charm}%, บารมี ${scoredNumber.energyProfile.prestige}%, สติปัญญา ${scoredNumber.energyProfile.wisdom}%, โชคลาภ ${scoredNumber.energyProfile.luck}%
- ข้อมูลผู้ใช้: อาชีพ ${context?.userCareerName || "ทั่วไป"}, วันเกิด ${context?.userBirthDayName || "ไม่ได้ระบุ"}, เป้าหมาย ${context?.userGoals?.join(", ") || "ความสำเร็จรอบด้าน"}

จงส่งคืนผลลัพธ์เป็น JSON Object เท่านั้น ห้ามใส่ markdown code block หรือข้อความอื่น:
{
  "tierBadge": "S-Tier" หรือ "A-Tier" หรือ "B-Tier" หรือ "C-Tier",
  "headline": "ชื่อฉายาเบอร์ที่ทรงพลัง (ไม่เกิน 15 คำ)",
  "secondOpinion": "บทวิเคราะห์เชิงลึกสังเคราะห์พลังงานทั้งเบอร์ ความลื่นไหลของตัวเลข และผลลัพธ์ที่จะเกิดขึ้นกับผู้ใช้ (2-3 ย่อหน้า ภาษาไทยไพเราะ เข้าใจง่าย ชัดเจน)",
  "pros": ["จุดเด่นข้อที่ 1", "จุดเด่นข้อที่ 2", "จุดเด่นข้อที่ 3"],
  "cons": ["ข้อควรระวังหรือสิ่งที่ต้องตระหนัก 1-2 ข้อ"],
  "suitableUsers": "เหมาะกับใครบ้าง เช่น อาชีพ หรือสไตล์ชีวิต",
  "recommendedActions": "คำแนะนำการนำไปใช้งาน เช่น ใช้เป็นเบอร์ติดต่อธุรกิจหลัก หรือเบอร์รับเงิน"
}`;

  // 1. Try Google Gemini API
  if (genAI && geminiApiKey) {
    try {
      const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();
      if (rawText) {
        const cleanJson = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        return {
          tierBadge: parsed.tierBadge || (scoredNumber.totalScore >= 90 ? "S-Tier" : "A-Tier"),
          headline: parsed.headline || "เบอร์มงคลพลังงานสูง",
          secondOpinion: parsed.secondOpinion || "",
          pros: parsed.pros || [],
          cons: parsed.cons || [],
          suitableUsers: parsed.suitableUsers || "ผู้ที่ต้องการเสริมความเป็นสิริมงคล",
          recommendedActions: parsed.recommendedActions || "เปิดใช้งานเป็นเบอร์ติดต่อหลัก",
          evaluatedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("Gemini API call error in AI Judge, attempting fallback:", err);
    }
  }

  // 2. Try OpenAI API (Fallback)
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert Thai Numerology Master and AI Judge. Output strictly valid JSON.",
          },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const rawContent = response.choices[0]?.message?.content;
      if (rawContent) {
        const parsed = JSON.parse(rawContent);
        return {
          tierBadge: parsed.tierBadge || (scoredNumber.totalScore >= 90 ? "S-Tier" : "A-Tier"),
          headline: parsed.headline || "เบอร์มงคลพลังงานสูง",
          secondOpinion: parsed.secondOpinion || "",
          pros: parsed.pros || [],
          cons: parsed.cons || [],
          suitableUsers: parsed.suitableUsers || "ผู้ที่ต้องการเสริมความเป็นสิริมงคล",
          recommendedActions: parsed.recommendedActions || "เปิดใช้งานเป็นเบอร์ติดต่อหลัก",
          evaluatedAt: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn("OpenAI API call failed in AI Judge:", err);
    }
  }

  // 3. Deterministic AI Synthesis Fallback (Offline Mode)
  return generateDeterministicVerdict(scoredNumber, context);
}

function generateDeterministicVerdict(
  scoredNumber: ScoredNumber,
  context?: {
    userCareerName?: string;
    userBirthDayName?: string;
    userGoals?: string[];
  }
): ScoredNumber["aiVerdict"] {
  const score = scoredNumber.totalScore;
  let tierBadge: "S-Tier" | "A-Tier" | "B-Tier" | "C-Tier" = "C-Tier";
  if (score >= 90 && scoredNumber.dangerousPairsFound.length === 0 && !scoredNumber.hasKalaKinee) {
    tierBadge = "S-Tier";
  } else if (score >= 80 && scoredNumber.dangerousPairsFound.length === 0) {
    tierBadge = "A-Tier";
  } else if (score >= 65) {
    tierBadge = "B-Tier";
  }

  const primaryCategory = scoredNumber.decomposedPairs[0]?.rule?.category || "มงคลทั่วไป";
  const dominantEnergy = Object.entries(scoredNumber.energyProfile).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const energyMap: Record<string, string> = {
    wealth: "พลังดึงดูดทรัพย์และโภคทรัพย์มหาศาล",
    charm: "พลังมหาเสน่ห์ เมตตามหานิยม ผู้คนรักใคร่",
    prestige: "พลังอำนาจบารมี ผู้นำที่น่าเกรงขาม",
    wisdom: "พลังสติปัญญา สมาธิและการตัดสินใจเฉียบแหลม",
    luck: "พลังสิ่งศักดิ์สิทธิ์คุ้มครองและโชคลาภปาฏิหาริย์",
  };

  const headline =
    tierBadge === "S-Tier"
      ? `สุดยอดเบอร์มหาจักรพรรดิ ${energyMap[dominantEnergy[0]] || "พลังบารมีสมบูรณ์แบบ"}`
      : tierBadge === "A-Tier"
      ? `เบอร์มงคลระดับพรีเมียม เสริม${primaryCategory}และการเงินมั่นคง`
      : `เบอร์พลังงานปานกลาง เหมาะกับการใช้งานทั่วไป`;

  const secondOpinion = `จากการวิเคราะห์เชิงลึกของ AI Judge พบว่าเบอร์ ${scoredNumber.formattedNumber} มีการเรียงตัวของพลังงานคู่เลขที่น่าสนใจเป็นพิเศษ โดยมีผลรวม ${scoredNumber.totalSum} (${scoredNumber.sumRule?.title}) ซึ่งส่งแรงส่งเสริมในระดับ ${scoredNumber.sumRule?.tier}

${
  scoredNumber.dangerousPairsFound.length > 0
    ? `⚠️ ข้อสังเกตสำคัญ: พบการปรากฏของคู่เลขอันตราย (${scoredNumber.dangerousPairsFound.join(", ")}) ซึ่งอาจนำพาความเหน็ดเหนื่อยหรือความขัดแย้ง แนะนำให้พิจารณาเบอร์อื่นที่ปราศจากคู่เลขกลุ่มนี้เพื่อความราบรื่นสูงสุด`
    : `✨ จุดเด่นที่ไร้ที่ติคือ ไม่พบคู่เลขอัปมงคลหรือดาวบาปเคราะห์แม้แต่คู่เดียว ทำให้กระแสพลังงานไหลเวียนได้อย่างบริสุทธิ์ ส่งผลให้ผู้ใช้รู้สึกใจสงบ มีสมาธิ และดึงดูดโอกาสดีๆ เข้ามาอย่างต่อเนื่อง`
}

${
  scoredNumber.hasKalaKinee
    ? `สำหรับผู้เกิด${context?.userBirthDayName || "วันนี้"} พบว่ามีตัวเลขกาลกิณี (${scoredNumber.kalaKineeDigitsFound.join(", ")}) ใน 7 หลักท้าย ซึ่งอาจสร้างแรงต้านในบางจังหวะชีวิต`
    : `ความสอดคล้องกับดวงชะตา: เบอร์นี้ผ่านเกณฑ์ทักษาอย่างหมดจด ไม่มีเลขกาลกิณีขัดขวาง ส่งเสริมพลัง${context?.userCareerName ? `ในสายงาน ${context.userCareerName}` : "ความก้าวหน้า"} ได้เต็มศักยภาพ 100%`
}`;

  const pros: string[] = [];
  if (scoredNumber.dangerousPairsFound.length === 0) pros.push("ไม่มีคู่เลขอัปมงคลหรือดาวบาปเคราะห์ 100%");
  if (!scoredNumber.hasKalaKinee) pros.push("ปลอดเลขกาลกิณีประจำวันเกิด ดวงชะตาราบรื่น");
  if (scoredNumber.sumRule?.isAuspicious) pros.push(`ผลรวม ${scoredNumber.totalSum} ส่งเสริมโชคลาภและความสำเร็จ`);
  if (dominantEnergy[1] >= 80) pros.push(`พลังด้าน${dominantEnergy[0] === 'wealth' ? 'การเงิน' : dominantEnergy[0] === 'charm' ? 'มหาเสน่ห์' : dominantEnergy[0] === 'wisdom' ? 'สติปัญญา' : 'ความสำเร็จ'} โดดเด่นเป็นพิเศษ (${dominantEnergy[1]}%)`);

  const cons: string[] = [];
  if (scoredNumber.dangerousPairsFound.length > 0) {
    cons.push(`มีคู่อันตราย ${scoredNumber.dangerousPairsFound.join(", ")} ควรระวังเรื่องอารมณ์และอุปสรรค`);
  }
  if (scoredNumber.hasKalaKinee) {
    cons.push(`มีเลขกาลกิณี ${scoredNumber.kalaKineeDigitsFound.join(", ")} สำหรับวันเกิดนี้`);
  }
  if (cons.length === 0) {
    cons.push("พลังงานสมดุลสูง ไม่มีข้อบกพร่องร้ายแรง ควรหมั่นทำบุญเสริมบารมีควบคู่");
  }

  return {
    tierBadge,
    headline,
    secondOpinion,
    pros,
    cons,
    suitableUsers: context?.userCareerName
      ? `เหมาะอย่างยิ่งสำหรับสายอาชีพ ${context.userCareerName} และผู้ที่ต้องการพัฒนาตนเอง`
      : "เหมาะกับผู้บริหาร เจ้าของธุรกิจ นักลงทุน และผู้ที่ต้องการความก้าวหน้า",
    recommendedActions:
      tierBadge === "S-Tier" || tierBadge === "A-Tier"
        ? "แนะนำให้เปิดใช้เป็นเบอร์หลักประจำตัว หรือใช้เป็นเบอร์ติดต่อทำธุรกิจรับเงิน"
        : "สามารถใช้เป็นเบอร์สำรอง หรือใช้ในงานที่ไม่เกี่ยวข้องกับการตัดสินใจสำคัญ",
    evaluatedAt: new Date().toISOString(),
  };
}
