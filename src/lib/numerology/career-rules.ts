import { CareerCategory, CareerRule } from "@/types";

export const CAREER_RULES: Record<CareerCategory, CareerRule> = {
  sales_trading: {
    career: "sales_trading",
    titleTh: "ค้าขาย / เซลล์ / นายหน้า / ธุรกิจส่วนตัว",
    iconName: "ShoppingBag",
    essentialPairs: ["24", "42", "46", "64", "23", "32", "26", "62"],
    bonusPairs: ["36", "63", "28", "82", "44", "66"],
    forbiddenPairs: ["18", "81", "07", "70", "27", "72", "00"],
    description: "เน้นพลังวาจาเป็นทรัพย์ ปิดการขายง่าย เสน่ห์ดึงดูดลูกค้าและเงินหมุนเวียน",
  },
  management_exec: {
    career: "management_exec",
    titleTh: "ผู้บริหาร / เจ้าของกิจการ / ผู้นำองค์กร",
    iconName: "Crown",
    essentialPairs: ["15", "51", "89", "98", "78", "87", "35", "53"],
    bonusPairs: ["45", "54", "56", "65", "28", "82", "19", "91"],
    forbiddenPairs: ["18", "81", "13", "31", "08", "80", "03", "30"],
    description: "เน้นบารมี อำนาจปกครอง วิสัยทัศน์กว้างไกล ลูกน้องเคารพยำเกรง และการตัดสินใจที่แม่นยำ",
  },
  tech_developer: {
    career: "tech_developer",
    titleTh: "โปรแกรมเมอร์ / ไอที / วิศวกร / นวัตกรรม",
    iconName: "Code",
    essentialPairs: ["49", "94", "59", "95", "15", "51", "45", "54"],
    bonusPairs: ["99", "14", "41", "56", "65", "19", "91"],
    forbiddenPairs: ["13", "31", "03", "30", "07", "70", "27", "72"],
    description: "เน้นสมาธิ สติปัญญาในการแก้โจทย์ยาก หัวไว ทันเทคโนโลยี และติดต่อกับระบบสากล",
  },
  finance_invest: {
    career: "finance_invest",
    titleTh: "การเงิน / ลงทุนหุ้น / บัญชี / อสังหาริมทรัพย์",
    iconName: "TrendingUp",
    essentialPairs: ["28", "82", "78", "87", "16", "61", "56", "65"],
    bonusPairs: ["45", "54", "15", "51", "89", "98", "36", "63"],
    forbiddenPairs: ["18", "81", "08", "80", "06", "60", "27", "72"],
    description: "เน้นการบริหารเงินก้อนโต การวิเคราะห์ตัวเลขรอบคอบ มีเซ้นส์จับจังหวะการลงทุน",
  },
  creative_media: {
    career: "creative_media",
    titleTh: "อินฟลูเอนเซอร์ / บันเทิง / แฟชั่น / ศิลปะ / ครีเอเตอร์",
    iconName: "Sparkles",
    essentialPairs: ["29", "92", "69", "96", "23", "32", "24", "42"],
    bonusPairs: ["66", "22", "36", "63", "19", "91", "46", "64"],
    forbiddenPairs: ["07", "70", "77", "00", "13", "31", "18", "81"],
    description: "เน้นความคิดสร้างสรรค์ เสน่ห์หน้ากล้อง เอกลักษณ์โดดเด่น ยอดผู้ติดตามและรายได้จากความนิยม",
  },
  civil_service: {
    career: "civil_service",
    titleTh: "ข้าราชการ / รัฐวิสาหกิจ / ทหาร / ตำรวจ",
    iconName: "Shield",
    essentialPairs: ["15", "51", "35", "53", "14", "41", "19", "91"],
    bonusPairs: ["45", "54", "89", "98", "59", "95", "55"],
    forbiddenPairs: ["18", "81", "13", "31", "08", "80", "28", "82"],
    description: "เน้นความเจริญก้าวหน้าในขั้นเงินเดือน ผู้ใหญ่รักใคร่ เกียรติยศ และความซื่อสัตย์สุจริต",
  },
  medical_health: {
    career: "medical_health",
    titleTh: "แพทย์ / พยาบาล / เภสัชกร / งานสุขภาพ",
    iconName: "HeartPulse",
    essentialPairs: ["59", "95", "45", "54", "15", "51", "55"],
    bonusPairs: ["49", "94", "56", "65", "99", "14", "41"],
    forbiddenPairs: ["13", "31", "18", "81", "03", "30", "07", "70"],
    description: "เน้นความรอบคอบ แม่นยำ จิตใจเมตตา แคล้วคลาด และมีสมาธิสูงในการรักษาผู้คน",
  },
  foreign_travel: {
    career: "foreign_travel",
    titleTh: "งานต่างประเทศ / นำเข้า-ส่งออก / โลจิสติกส์ / ไกด์",
    iconName: "Globe",
    essentialPairs: ["49", "94", "59", "95", "19", "91", "89", "98"],
    bonusPairs: ["99", "28", "82", "45", "54", "39", "93"],
    forbiddenPairs: ["13", "31", "07", "70", "18", "81", "00"],
    description: "เน้นการสื่อสารต่างภาษา การเดินทางแคล้วคลาดราบรื่น และขยายเครือข่ายระดับโลก",
  },
  spiritual_occult: {
    career: "spiritual_occult",
    titleTh: "สายมู / โหราศาสตร์ / พระเครื่อง / สมาธิ",
    iconName: "Compass",
    essentialPairs: ["59", "95", "99", "09", "90", "89", "98"],
    bonusPairs: ["55", "15", "51", "49", "94"],
    forbiddenPairs: ["13", "31", "18", "81", "08", "80", "03", "30"],
    description: "เน้นสัมผัสพิเศษ เซ้นส์แม่นยำ บารมีครูบาอาจารย์ และสิ่งศักดิ์สิทธิ์เกื้อหนุน",
  },
  student_academic: {
    career: "student_academic",
    titleTh: "นักเรียน / นักศึกษา / นักวิจัย / ครูอาจารย์",
    iconName: "BookOpen",
    essentialPairs: ["15", "51", "45", "54", "14", "41", "55"],
    bonusPairs: ["59", "95", "49", "94", "56", "65"],
    forbiddenPairs: ["18", "81", "13", "31", "07", "70", "08", "80", "23", "32"],
    description: "เน้นความจำ ความเข้าใจ การสอบแข่งขันชิงทุน และมีสมาธิยาวนาน",
  },
};

export function getCareerRule(career?: CareerCategory): CareerRule | undefined {
  if (!career) return undefined;
  return CAREER_RULES[career];
}
