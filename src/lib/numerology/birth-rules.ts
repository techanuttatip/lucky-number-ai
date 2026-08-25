import { BirthDay, BirthRule } from "@/types";

export const BIRTH_RULES: Record<BirthDay, BirthRule> = {
  sunday: {
    day: "sunday",
    nameTh: "วันอาทิตย์",
    elementTh: "ธาตุไฟ (อาทิตย์)",
    auspiciousDigits: [1, 2, 4, 5, 8],
    neutralDigits: [3, 7, 9],
    forbiddenDigits: [6], // กาลกิณีวันอาทิตย์ คือ 6 (ดาวศุกร์)
    goodPairsRecommended: ["14", "41", "15", "51", "24", "42", "59", "95", "89", "98"],
    description: "คนเกิดวันอาทิตย์ มีภาวะผู้นำ กล้าได้กล้าเสีย เลขต้องห้ามเด็ดขาดคือเลข 6 (ดาวศุกร์) เลขมงคลเสริมบารมีคือ 1, 5, 8",
  },
  monday: {
    day: "monday",
    nameTh: "วันจันทร์",
    elementTh: "ธาตุดิน (จันทร์)",
    auspiciousDigits: [2, 4, 5, 6, 7],
    neutralDigits: [3, 8, 9],
    forbiddenDigits: [1], // กาลกิณีวันจันทร์ คือ 1 (ดาวอาทิตย์)
    goodPairsRecommended: ["24", "42", "26", "62", "45", "54", "56", "65", "36", "63"],
    description: "คนเกิดวันจันทร์ มีเสน่ห์ อ่อนโยน ปรับตัวเก่ง เลขต้องห้ามเด็ดขาดคือเลข 1 (ดาวอาทิตย์) เลขมงคลเสริมเสน่ห์และทรัพย์คือ 2, 4, 6",
  },
  tuesday: {
    day: "tuesday",
    nameTh: "วันอังคาร",
    elementTh: "ธาตุลม (อังคาร)",
    auspiciousDigits: [3, 5, 6, 8, 9],
    neutralDigits: [1, 4, 7],
    forbiddenDigits: [2], // กาลกิณีวันอังคาร คือ 2 (ดาวจันทร์)
    goodPairsRecommended: ["35", "53", "36", "63", "56", "65", "78", "87", "89", "98"],
    description: "คนเกิดวันอังคาร ขยัน อดทน เด็ดเดี่ยว สู้ไม่ถอย เลขต้องห้ามเด็ดขาดคือเลข 2 (ดาวจันทร์) เลขมงคลเสริมความสำเร็จคือ 3, 5, 6",
  },
  wednesday_day: {
    day: "wednesday_day",
    nameTh: "วันพุธ (กลางวัน 06.00-17.59 น.)",
    elementTh: "ธาตุน้ำ (พุธกลางวัน)",
    auspiciousDigits: [4, 2, 5, 6, 9],
    neutralDigits: [1, 7, 8],
    forbiddenDigits: [3], // กาลกิณีวันพุธกลางวัน คือ 3 (ดาวอังคาร)
    goodPairsRecommended: ["24", "42", "45", "54", "46", "64", "56", "65", "59", "95"],
    description: "คนเกิดวันพุธกลางวัน ปัญญาเฉียบแหลม วาทศิลป์เป็นเลิศ เลขต้องห้ามเด็ดขาดคือเลข 3 (ดาวอังคาร) เลขมงคลคือ 4, 5, 6",
  },
  wednesday_night: {
    day: "wednesday_night",
    nameTh: "วันพุธ (กลางคืน/ราหู 18.00-05.59 น.)",
    elementTh: "ธาตุลม (ราหู)",
    auspiciousDigits: [8, 1, 2, 3, 7, 9],
    neutralDigits: [4, 6],
    forbiddenDigits: [5], // กาลกิณีวันพุธกลางคืน คือ 5 (ดาวพฤหัส)
    goodPairsRecommended: ["78", "87", "28", "82", "89", "98", "36", "63", "23", "32"],
    description: "คนเกิดวันพุธกลางคืน หัวไว แก้ปัญหาเก่ง เซ้นส์แรง เลขต้องห้ามเด็ดขาดคือเลข 5 (ดาวพฤหัส) เลขมงคลคือ 7, 8, 9",
  },
  thursday: {
    day: "thursday",
    nameTh: "วันพฤหัสบดี",
    elementTh: "ธาตุดิน (พฤหัส)",
    auspiciousDigits: [5, 1, 2, 4, 6, 9],
    neutralDigits: [3, 8],
    forbiddenDigits: [7], // กาลกิณีวันพฤหัสบดี คือ 7 (ดาวเสาร์)
    goodPairsRecommended: ["15", "51", "45", "54", "56", "65", "59", "95", "14", "41"],
    description: "คนเกิดวันพฤหัสบดี มีคุณธรรม สุขุม รักความยุติธรรม เลขต้องห้ามเด็ดขาดคือเลข 7 (ดาวเสาร์) เลขมงคลเสริมปัญญาบารมีคือ 1, 4, 5, 9",
  },
  friday: {
    day: "friday",
    nameTh: "วันศุกร์",
    elementTh: "ธาตุน้ำ (ศุกร์)",
    auspiciousDigits: [6, 2, 3, 4, 5],
    neutralDigits: [1, 9],
    forbiddenDigits: [7, 8], // กาลกิณีวันศุกร์ คือ 7, 8 (ดาวเสาร์/ราหู)
    goodPairsRecommended: ["24", "42", "36", "63", "46", "64", "56", "65", "69", "96"],
    description: "คนเกิดวันศุกร์ มีรสนิยมดี ร่าเริง ศิลปะเด่น เลขต้องห้ามเด็ดขาดคือเลข 7 และ 8 เลขมงคลเสริมทรัพย์และเสน่ห์คือ 2, 3, 4, 5, 6",
  },
  saturday: {
    day: "saturday",
    nameTh: "วันเสาร์",
    elementTh: "ธาตุไฟ (เสาร์)",
    auspiciousDigits: [7, 1, 3, 8, 9],
    neutralDigits: [2, 5],
    forbiddenDigits: [4], // กาลกิณีวันเสาร์ คือ 4 (ดาวพุธ)
    goodPairsRecommended: ["78", "87", "89", "98", "35", "53", "39", "93", "19", "91"],
    description: "คนเกิดวันเสาร์ อดทน หนักแน่น มัธยัสถ์ คิดการณ์ใหญ่ เลขต้องห้ามเด็ดขาดคือเลข 4 (ดาวพุธ) เลขมงคลเสริมอำนาจคือ 1, 3, 7, 8, 9",
  },
};

export function getBirthRule(day?: BirthDay): BirthRule | undefined {
  if (!day) return undefined;
  return BIRTH_RULES[day];
}

// Convert a date string (YYYY-MM-DD) and optional hour to BirthDay
export function calculateBirthDayFromDate(dateStr: string, hour = 12): BirthDay {
  const date = new Date(dateStr);
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  
  if (dayIndex === 3) {
    // Wednesday: Check if daytime (06:00 - 17:59) or nighttime (18:00 - 05:59)
    if (hour >= 6 && hour < 18) {
      return "wednesday_day";
    }
    return "wednesday_night";
  }

  const map: Record<number, BirthDay> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  return map[dayIndex] || "sunday";
}
