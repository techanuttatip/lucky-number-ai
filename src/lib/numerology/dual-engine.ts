import { ScoredNumber, BirthDay, Career, EnergyGoal } from "@/types";
import { decodeThaiName, NameNumerologyResult } from "./name-decoder";
import { BIRTH_RULES } from "./birth-rules";

export interface UserPersonalProfile {
  firstName: string;
  lastName: string;
  birthDay: BirthDay;
  career: Career;
  goals: EnergyGoal[];
  sourceFilter?: string;
}

export interface DualMatchResult {
  number: ScoredNumber;
  profile: UserPersonalProfile;
  nameAnalysis: NameNumerologyResult;

  // System 1: ศาสตร์พลังคู่เลข & ผลรวมสากล
  system1Score: number;
  system1Grade: "S" | "A" | "B" | "C";
  system1Highlights: string[];

  // System 2: ศาสตร์ทักษาปกรณ์ & เลขศาสตร์ชื่อ-นามสกุล
  system2Score: number;
  system2Grade: "S" | "A" | "B" | "C";
  system2Highlights: string[];
  hasKalakini: boolean;
  kalakiniDigit?: number;

  // ผลลัพธ์การแมตช์รวม
  overallMatchScore: number; // 0 - 100%
  matchTier: "PERFECT" | "EXCELLENT" | "GOOD" | "MODERATE";
  matchReason: string;
  careerBonusReason: string;
}

/**
 * คำนวณการแมตช์ 2 ระบบระหว่าง "ข้อมูลส่วนบุคคล (ชื่อ-สกุล, วันเกิด, อาชีพ)" กับ "เบอร์โทรศัพท์"
 */
export function calculateDualSystemMatch(
  num: ScoredNumber,
  profile: UserPersonalProfile
): DualMatchResult {
  // 1. ถอดรหัสชื่อและนามสกุล
  const nameAnalysis = decodeThaiName(profile.firstName, profile.lastName);

  // ==========================================
  // ระบบที่ 1: ศาสตร์พลังคู่เลข & ผลรวมเบอร์โทร (System 1)
  // ==========================================
  let sys1Score = num.totalScore;
  const sys1Highlights: string[] = [];

  if (num.sumRule?.isAuspicious) {
    sys1Highlights.push(`ผลรวม ${num.totalSum} (${num.sumRule.title})`);
  }

  const auspiciousPairs = num.decomposedPairs
    .filter((p) => !p.isDangerous && p.rule && p.rule.scoreDelta > 0)
    .map((p) => p.pair);

  if (auspiciousPairs.length > 0) {
    sys1Highlights.push(`คู่มงคลเด่น: ${Array.from(new Set(auspiciousPairs)).slice(0, 3).join(", ")}`);
  }

  if (num.dangerousPairsFound.length > 0) {
    sys1Highlights.push(`⚠️ มีคู่เลขเสีย: ${num.dangerousPairsFound.join(", ")}`);
  } else {
    sys1Highlights.push("ไร้คู่เลขอัปมงคล 100%");
  }

  const sys1Grade: "S" | "A" | "B" | "C" =
    sys1Score >= 90 ? "S" : sys1Score >= 80 ? "A" : sys1Score >= 65 ? "B" : "C";

  // ==========================================
  // ระบบที่ 2: ศาสตร์ทักษา & เลขศาสตร์ชื่อ-สกุล (System 2)
  // ==========================================
  let sys2Score = 60;
  const sys2Highlights: string[] = [];

  // 2.1 ตรวจทักษาปกรณ์วันเกิด (กาลกิณี, ศรี, เดช, มนตรี)
  const birthRule = BIRTH_RULES[profile.birthDay] || BIRTH_RULES["sunday"];
  let hasKalakini = false;
  let kalakiniDigit: number | undefined = undefined;

  if (birthRule) {
    const rawDigits = num.rawNumber.split("").map((d) => parseInt(d, 10));

    // เช็คเลขกาลกิณี (ห้ามมีในเบอร์เด็ดขาด)
    const forbiddenFound = birthRule.forbiddenDigits.find((fd) => rawDigits.includes(fd));
    if (forbiddenFound !== undefined) {
      hasKalakini = true;
      kalakiniDigit = forbiddenFound;
      sys2Score -= 40; // หักคะแนนหนัก
      sys2Highlights.push(`⚠️ มีเลขกาลกิณีประจำวันเกิด (${forbiddenFound})`);
    } else {
      sys2Score += 15;
      sys2Highlights.push(`ปลอดเลขกาลกิณีวัน${birthRule.nameTh} 100%`);
    }

    // เช็คเลขมงคลประจำวันเกิด
    const luckyDigitsFound = birthRule.auspiciousDigits.filter((ld) => rawDigits.includes(ld));
    if (luckyDigitsFound.length > 0) {
      sys2Score += luckyDigitsFound.length * 3;
      sys2Highlights.push(`มีเลขมงคลวันเกิด (${Array.from(new Set(luckyDigitsFound)).slice(0, 3).join(", ")})`);
    }
  }

  // 2.2 เช็คความเข้ากันได้กับ "ผลรวมชื่อ + นามสกุล" (Name Compatibility)
  const isSumMatched = nameAnalysis.compatibleSumTargets.includes(num.totalSum);
  if (isSumMatched) {
    sys2Score += 15;
    sys2Highlights.push(
      `ผลรวมเบอร์ (${num.totalSum}) ส่งเสริมผลรวมชื่อ-สกุล (${nameAnalysis.fullNameSum}) อย่างยอดเยี่ยม`
    );
  }

  // 2.3 เช็คความเข้ากันได้กับสายอาชีพ (Career Compatibility)
  let careerBonus = 0;
  let careerBonusReason = "";

  switch (profile.career) {
    case "business_owner":
    case "trader_sales":
      if (num.energyProfile.wealth >= 70 || num.energyProfile.charm >= 70) {
        careerBonus = 15;
        careerBonusReason = "เสริมพลังการค้า วาจาเรียกทรัพย์ และเสน่ห์ปิดการขาย";
      }
      break;
    case "finance_investor":
      if (num.energyProfile.wealth >= 70 || num.energyProfile.wisdom >= 70) {
        careerBonus = 15;
        careerBonusReason = "เสริมการตัดสินใจทางการเงิน ความเฉียบคม และความมั่นคงของทรัพย์";
      }
      break;
    case "gov_officer":
    case "management":
      if (num.energyProfile.prestige >= 70 || num.energyProfile.wisdom >= 70) {
        careerBonus = 15;
        careerBonusReason = "เสริมบารมี ผู้ใหญ่เอ็นดู เลื่อนขั้นเลื่อนตำแหน่ง และความน่าเชื่อถือ";
      }
      break;
    case "tech_developer":
    case "doctor_health":
      if (num.energyProfile.wisdom >= 70 || num.energyProfile.luck >= 60) {
        careerBonus = 15;
        careerBonusReason = "เสริมสมาธิ สติปัญญา สมานจิตใจ และแก้ปัญหาซับซ้อนได้อย่างราบรื่น";
      }
      break;
    case "online_creator":
      if (num.energyProfile.charm >= 70 || num.energyProfile.luck >= 70) {
        careerBonus = 15;
        careerBonusReason = "เสริมพลังดึงดูดแฟนคลับ มีชื่อเสียง และยอดวิวพุ่งกระฉูด";
      }
      break;
    default:
      careerBonus = 10;
      careerBonusReason = "เสริมความเจริญก้าวหน้าในหน้าที่การงาน";
  }

  sys2Score += careerBonus;
  if (careerBonusReason) {
    sys2Highlights.push(careerBonusReason);
  }

  sys2Score = Math.max(10, Math.min(100, Math.round(sys2Score)));
  const sys2Grade: "S" | "A" | "B" | "C" =
    sys2Score >= 90 ? "S" : sys2Score >= 80 ? "A" : sys2Score >= 65 ? "B" : "C";

  // ==========================================
  // คำนวณความเข้ากันได้รวม (Ultimate Match Score 0 - 100%)
  // ==========================================
  let overallMatch = Math.round(sys1Score * 0.45 + sys2Score * 0.55);
  if (hasKalakini) {
    overallMatch = Math.min(65, overallMatch); // หากมีกาลกิณี เพดานคะแนนจะไม่เกิน 65%
  }

  let matchTier: "PERFECT" | "EXCELLENT" | "GOOD" | "MODERATE" = "MODERATE";
  if (overallMatch >= 92) {
    matchTier = "PERFECT";
  } else if (overallMatch >= 82) {
    matchTier = "EXCELLENT";
  } else if (overallMatch >= 70) {
    matchTier = "GOOD";
  }

  const matchReason = `เบอร์ ${num.formattedNumber} เข้ากับดวงคุณ ${profile.firstName} ${profile.lastName} (ผลรวมชื่อ-สกุล ${nameAnalysis.fullNameSum} • ${nameAnalysis.elementLabel}) อย่างสมบูรณ์แบบ ทั้งในด้านพลังเลขศาสตร์ ${sys1Score}/100 และทักษาหนุนดวงชะตา ${sys2Score}/100`;

  return {
    number: num,
    profile,
    nameAnalysis,
    system1Score: sys1Score,
    system1Grade: sys1Grade,
    system1Highlights: sys1Highlights,
    system2Score: sys2Score,
    system2Grade: sys2Grade,
    system2Highlights: sys2Highlights,
    hasKalakini,
    kalakiniDigit,
    overallMatchScore: overallMatch,
    matchTier,
    matchReason,
    careerBonusReason,
  };
}
