/**
 * Thai Alphabet Numerology Matrix (เลขศาสตร์กำลังอักษรไทยโบราณ)
 * ใช้คำนวณกำลังตัวเลขของ ชื่อ นามสกุล และผลรวมชะตาชีวิต
 */

const THAI_LETTER_VALUES: Record<string, number> = {
  // ค่า 1
  ก: 1, ด: 1, ถ: 1, ท: 1, ภ: 1, ฤ: 1, ฤๅ: 1,
  "ุ": 1, "ู": 1, "ะ": 1, "า": 1, "ำ": 1,

  // ค่า 2
  ข: 2, ช: 2, ง: 2, บ: 2, ป: 2,
  เ: 2, แ: 2, "้": 2,

  // ค่า 3
  ฆ: 3, ฑ: 3, ฒ: 3, ต: 3,

  // ค่า 4
  ค: 4, ธ: 4, ญ: 4, ร: 4, ษ: 4,
  โ: 4, ใ: 4,

  // ค่า 5
  ฉ: 5, ฌ: 5, ณ: 5, น: 5, ม: 5, ห: 5, ฬ: 5, ฮ: 5,
  "ิ": 5, "ี": 5, "ึ": 5, "ื": 5,

  // ค่า 6
  จ: 6, ล: 6, ว: 6, อ: 6,
  ไ: 6,

  // ค่า 7
  ซ: 7, ศ: 7, ส: 7,
  "๊": 7,

  // ค่า 8
  ผ: 8, ฝ: 8, พ: 8, ฟ: 8, ย: 8,
  "็": 8, "่": 8,

  // ค่า 9
  ฎ: 9, ฏ: 9, ฐ: 9,
  "๋": 9, "์": 9, "ํ": 9,
};

export interface NameNumerologyResult {
  firstName: string;
  lastName: string;
  fullName: string;
  firstNameScore: number;
  lastNameScore: number;
  totalNameScore: number;
  firstNameTier: string;
  totalNameTier: string;
  summary: string;
  element: string;
  recommendations: string[];
}

export function calculateNameNumerology(
  firstName: string,
  lastName: string = ""
): NameNumerologyResult {
  const calcString = (str: string) => {
    let sum = 0;
    for (const char of str) {
      if (THAI_LETTER_VALUES[char]) {
        sum += THAI_LETTER_VALUES[char];
      }
    }
    return sum;
  };

  const fScore = calcString(firstName.trim());
  const lScore = calcString(lastName.trim());
  const totalScore = fScore + lScore;

  // Auspicious number meanings for name sums
  const getTier = (score: number) => {
    const excellent = [9, 14, 15, 19, 23, 24, 36, 40, 41, 42, 45, 46, 50, 51, 54, 55, 56, 59, 63, 64, 65, 79];
    const good = [10, 13, 18, 20, 22, 25, 26, 28, 31, 32, 35, 44, 49, 52, 60, 61, 62, 69];
    if (excellent.includes(score)) return "A+ (ยอดเยี่ยม)";
    if (good.includes(score)) return "A (ดีมาก)";
    return "B (ปานกลาง - ควรเสริมด้วยเบอร์โทร)";
  };

  // Element based on total
  const elements = ["ธาตุดิน (มั่นคง หนักแน่น)", "ธาตุน้ำ (คล่องตัว เสน่ห์เมตตา)", "ธาตุลม (ความคิดสร้างสรรค์ ว่องไว)", "ธาตุไฟ (ผู้นำ กระตือรือร้น)", "ธาตุทอง (โภคทรัพย์ บารมี)"];
  const el = elements[totalScore % elements.length];

  let summary = `ชื่อมีกำลังเลขศาสตร์ ${fScore} รวมกับนามสกุลได้กำลัง ${totalScore}`;
  if (totalScore >= 40 && totalScore <= 65) {
    summary += " เป็นกำลังเลขที่ส่งเสริมความเจริญรุ่งเรือง วาสนาดี";
  } else {
    summary += " แนะนำให้เลือกเบอร์โทรศัพท์ที่มีผลรวมและคู่เลขมงคลเพื่อหนุนดวงชะตาให้สมดุลยิ่งขึ้น";
  }

  const recs = [
    `เสริมพลังธาตุด้วยคู่เลขที่หนุนดวงชะตา`,
    `เลือกเบอร์โทรศัพท์ที่ปลอดเลขกาลกิณีประจำวันเกิด`,
    `ใช้เบอร์ที่มีผลรวมส่งเสริมกำลังชื่อ-สกุล (เช่น ผลรวม 45, 54, 56, 63, 65)`,
  ];

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
    firstNameScore: fScore,
    lastNameScore: lScore,
    totalNameScore: totalScore,
    firstNameTier: getTier(fScore),
    totalNameTier: getTier(totalScore),
    summary,
    element: el,
    recommendations: recs,
  };
}
