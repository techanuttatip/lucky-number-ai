/**
 * Thai Name Numerology (ศาสตร์การถอดรหัสเลขศาสตร์ชื่อและนามสกุล)
 * คำนวณค่าตัวเลขตามหลักโหราศาสตร์ไทยโบราณและศาสตร์พลังเงา
 */

export interface NameNumerologyResult {
  firstName: string;
  lastName: string;
  firstNameSum: number;
  lastNameSum: number;
  fullNameSum: number;
  firstNameMeaning: string;
  lastNameMeaning: string;
  fullNameMeaning: string;
  isAuspiciousFullName: boolean;
  element: "fire" | "water" | "earth" | "wind" | "gold";
  elementLabel: string;
  beneficialNumbers: number[];
  compatibleSumTargets: number[];
}

const THAI_CHAR_VALUES: Record<string, number> = {
  // ค่า 1
  ก: 1, ด: 1, ถ: 1, ท: 1, ภ: 1, "ฤ": 1, "ฤๅ": 1, "ะ": 1, "า": 1, "ำ": 1, "่": 1,
  // ค่า 2
  ข: 2, ช: 2, ง: 2, บ: 2, ป: 2, "เ": 2, "แ": 2, "้": 2,
  // ค่า 3
  ฆ: 3, ฑ: 3, ฒ: 3, ต: 3, "ู": 3, "๊": 3,
  // ค่า 4
  ค: 4, ธ: 4, ญ: 4, ร: 4, ษ: 4, "โ": 4, "ั": 4, "ิ": 4,
  // ค่า 5
  ฉ: 5, ฌ: 5, ณ: 5, น: 5, ม: 5, ห: 5, ฬ: 5, ฮ: 5, "ึ": 5,
  // ค่า 6
  จ: 6, ล: 6, ว: 6, อ: 6, "ุ": 6, "ี": 6, "๋": 6,
  // ค่า 7
  ซ: 7, ศ: 7, ส: 7, "ื": 7,
  // ค่า 8
  ผ: 8, ฝ: 8, พ: 8, ฟ: 8, ย: 8, "็": 8,
  // ค่า 9
  ฏ: 9, ฐ: 9, "์": 9, "ไ": 9, "ใ": 9,
  // English fallback
  A: 1, I: 1, J: 1, Q: 1, Y: 1, a: 1, i: 1, j: 1, q: 1, y: 1,
  B: 2, K: 2, R: 2, b: 2, k: 2, r: 2,
  C: 3, G: 3, L: 3, S: 3, c: 3, g: 3, l: 3, s: 3,
  D: 4, M: 4, T: 4, d: 4, m: 4, t: 4,
  E: 5, H: 5, N: 5, X: 5, e: 5, h: 5, n: 5, x: 5,
  U: 6, V: 6, W: 6, u: 6, v: 6, w: 6,
  O: 7, Z: 7, o: 7, z: 7,
  F: 8, P: 8, f: 8, p: 8,
};

const SUM_MEANINGS: Record<number, { meaning: string; isGood: boolean }> = {
  9: { meaning: "ความสำเร็จ อำนาจบารมี มีสิ่งศักดิ์สิทธิ์คุ้มครอง", isGood: true },
  14: { meaning: "ปัญญาเฉียบแหลม มหาเสน่ห์ เจรจาสำเร็จง่าย", isGood: true },
  15: { meaning: "ผู้ใหญ่เกื้อหนุน เมตตามหานิยม มีเสน่ห์คนรักใคร่", isGood: true },
  19: { meaning: "ความรุ่งโรจน์ มีชื่อเสียง มหาบุญบารมี", isGood: true },
  23: { meaning: "เสน่ห์แรง เจ้าเสน่ห์ ดึงดูดทรัพย์และเพศตรงข้าม", isGood: true },
  24: { meaning: "มหาสเน่ห์ วาจาเรียกทรัพย์ ผู้คนเอ็นดู อุปถัมภ์ค้ำชู", isGood: true },
  36: { meaning: "ความรักสดใส ความมั่งคั่ง โชคลาภพรั่งพรู", isGood: true },
  40: { meaning: "ชอบการเดินทาง คมในฝัก ติดต่อต่างประเทศดี", isGood: true },
  41: { meaning: "ปัญญาเป็นเลิศ มิตรภาพดีเยี่ยม เจรจาค้าขายร่ำรวย", isGood: true },
  42: { meaning: "เสน่ห์เมตตามหานิยม คนรักใคร่เอ็นดู ค้าขายคล่องตัว", isGood: true },
  44: { meaning: "การค้าก้าวหน้า คล่องแคล่ว วาจาศักดิ์สิทธิ์", isGood: true },
  45: { meaning: "ราชาโชค สติปัญญาเลิศ ผู้ใหญ่เมตตา ประสบความสำเร็จสูง", isGood: true },
  46: { meaning: "สุขสบาย มีทรัพย์สิน เสน่ห์เมตตา ร่ำรวยสุขล้น", isGood: true },
  49: { meaning: "ความเร็ว ก้าวหน้าทันโลก หยั่งรู้โอกาสทำเงิน", isGood: true },
  50: { meaning: "ความมั่นคง ปัญญาดี โชคลาภเดินทางไกลและต่างประเทศ", isGood: true },
  51: { meaning: "มหาเศรษฐี มหาเสน่ห์ มีความสุขรอบด้าน การงานรุ่งเรือง", isGood: true },
  54: { meaning: "ราชาโชคลาภ สิ่งศักดิ์สิทธิ์คุ้มครอง ความสำเร็จครบทุกด้าน", isGood: true },
  55: { meaning: "ความสุขสมบูรณ์ ความเจริญก้าวหน้า มีคุณธรรม หนุนดวง", isGood: true },
  56: { meaning: "คู่ทรัพย์คู่โชค การเงินคล่องตัว มั่งคั่ง มีเสน่ห์ล้นเหลือ", isGood: true },
  59: { meaning: "โชคลาภไม่คาดฝัน ความมั่นคง สิ่งศักดิ์สิทธิ์หนุนนำ", isGood: true },
  60: { meaning: "ความสุข รสนิยมดี การเงินไหลมาเทมา มีโชคด้านศิลปะและการค้า", isGood: true },
  63: { meaning: "เสน่ห์ดึงดูดเงินทอง ความรักราบรื่น สุขภาพดี มีโชคลาภ", isGood: true },
  64: { meaning: "ความสำเร็จอันงดงาม การค้ากำไรดี มีเสน่ห์และบริวารรัก", isGood: true },
  65: { meaning: "คู่ทรัพย์มหาศาล ความสำเร็จในชีวิต อุดมสมบูรณ์", isGood: true },
  69: { meaning: "เสน่ห์แรง หมุนเงินเก่ง มีโชคไม่ขาดสาย", isGood: true },
};

/**
 * คำนวณผลรวมเลขศาสตร์จากข้อความชื่อหรือนามสกุล
 */
export function calculateTextSum(text: string): number {
  if (!text) return 0;
  let sum = 0;
  const clean = text.trim();
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (THAI_CHAR_VALUES[char] !== undefined) {
      sum += THAI_CHAR_VALUES[char];
    }
  }
  return sum;
}

/**
 * วิเคราะห์ถอดรหัสชื่อและนามสกุลเต็มรูปแบบ
 */
export function decodeThaiName(firstName: string, lastName: string): NameNumerologyResult {
  const fSum = calculateTextSum(firstName);
  const lSum = calculateTextSum(lastName);
  const fullSum = fSum + lSum;

  const fMeaning =
    SUM_MEANINGS[fSum]?.meaning ||
    (fSum % 2 === 0 ? "ผลรวมเลขคู่ ให้พลังความมั่นคง คล่องตัว" : "ผลรวมเลขคี่ ให้พลังการต่อสู้ ริเริ่มสร้างสรรค์");

  const lMeaning =
    SUM_MEANINGS[lSum]?.meaning ||
    (lSum % 2 === 0 ? "ฐานตระกูลมั่นคง มีพลังหนุนด้านทรัพย์" : "ฐานตระกูลมีเกียรติ พึ่งพาตนเองได้ดี");

  const fullMeaning =
    SUM_MEANINGS[fullSum]?.meaning ||
    "ดวงชะตามีพลังแห่งการสร้างสรรค์ หมั่นทำบุญเสริมบารมีจะยิ่งเจริญก้าวหน้า";

  const isGood = SUM_MEANINGS[fullSum]?.isGood ?? (fullSum >= 36 && fullSum <= 65);

  // คำนวณธาตุตามผลรวมชื่อ
  const lastDigit = fullSum % 10;
  let element: "fire" | "water" | "earth" | "wind" | "gold" = "gold";
  let elementLabel = "ธาตุทอง (ความมั่งคั่ง บริสุทธิ์ คล่องแคล่ว)";

  if (lastDigit === 1 || lastDigit === 7) {
    element = "fire";
    elementLabel = "ธาตุไฟ (พลังอำนาจ ความกระตือรือร้น ความกล้าหาญ)";
  } else if (lastDigit === 2 || lastDigit === 6) {
    element = "water";
    elementLabel = "ธาตุน้ำ (ความเยือกเย็น เจรจา เสน่ห์เมตตา ความร่มเย็น)";
  } else if (lastDigit === 3 || lastDigit === 8) {
    element = "wind";
    elementLabel = "ธาตุลม (ความว่องไว ปรับตัวเก่ง ติดต่อค้าขายดี)";
  } else if (lastDigit === 4 || lastDigit === 5 || lastDigit === 0 || lastDigit === 9) {
    element = "earth";
    elementLabel = "ธาตุดิน (ความหนักแน่น มั่นคง น่าเชื่อถือ วางแผนดี)";
  }

  // ตัวเลขมงคลคู่มิตรที่หนุนชื่อ-สกุลนี้
  const beneficialNumbers = [15, 24, 36, 42, 45, 51, 54, 55, 56, 59, 63, 65].filter(
    (n) => (n + fullSum) % 9 === 0 || (n + fullSum) % 5 === 0 || [45, 54, 55, 56, 59, 65].includes(n)
  );

  return {
    firstName,
    lastName,
    firstNameSum: fSum,
    lastNameSum: lSum,
    fullNameSum: fullSum,
    firstNameMeaning: fMeaning,
    lastNameMeaning: lMeaning,
    fullNameMeaning: fullMeaning,
    isAuspiciousFullName: isGood,
    element,
    elementLabel,
    beneficialNumbers: beneficialNumbers.length > 0 ? beneficialNumbers : [45, 54, 56, 59, 65],
    compatibleSumTargets: [41, 42, 45, 50, 51, 54, 55, 56, 59, 63, 65],
  };
}
