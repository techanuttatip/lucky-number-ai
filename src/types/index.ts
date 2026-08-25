export type BirthDay = 
  | 'sunday' 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday_day' 
  | 'wednesday_night' 
  | 'thursday' 
  | 'friday' 
  | 'saturday';

export type CareerCategory = 
  | 'sales_trading'       // ค้าขาย เซลล์ นายหน้า
  | 'management_exec'     // ผู้บริหาร ผู้นำ เจ้าของกิจการ
  | 'tech_developer'      // โปรแกรมเมอร์ ไอที วิศวกร
  | 'finance_invest'      // การเงิน หุ้น ลงทุน บัญชี
  | 'creative_media'      // บันเทิง อินฟลู ศิลปะ การตลาด
  | 'civil_service'       // ข้าราชการ ทหาร ตำรวจ รัฐวิสาหกิจ
  | 'medical_health'      // แพทย์ พยาบาล เภสัช สุขภาพ
  | 'foreign_travel'      // งานต่างประเทศ โลจิสติกส์ ล่าม
  | 'spiritual_occult'    // สายมู โหราศาสตร์ พระเครื่อง
  | 'student_academic';   // นักเรียน นักวิชาการ ครูอาจารย์

export type LifeGoal = 
  | 'wealth'        // ร่ำรวย ดึงดูดทรัพย์ รับเงินก้อน
  | 'charm_love'    // มหาเสน่ห์ เมตตามหานิยม ความรักสมหวัง
  | 'prestige_power'// บารมี อำนาจ ลูกน้องยำเกรง เลื่อนขั้น
  | 'wisdom_peace'  // สติปัญญา สมาธิ อารมณ์เย็น ใจสงบ
  | 'wisdom_study'  // สติปัญญา การเรียน
  | 'health_safety' // แคล้วคลาด สุขภาพดี ปลอดภัย
  | 'luck_protection' // โชคลาภ แคล้วคลาด
  | 'luck_windfall';// โชคลาภ เสี่ยงโชค การเสี่ยงดวง

export type EnergyGoal = LifeGoal;

export type Provider = 'AIS' | 'TRUE' | 'DTAC' | 'NT' | 'OTHER';

export type PairTier = 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface PairRule {
  pair: string;              // e.g. "15", "24", "89"
  tier: PairTier;
  scoreDelta: number;        // -20 to +20
  category: string;          // e.g. "สติปัญญา", "มหาเสน่ห์", "อำนาจบารมี", "อุบัติเหตุ"
  title: string;             // e.g. "คู่มิตรผู้ใหญ่ เมตตา ปัญญาเป็นเลิศ"
  meaning: string;
  caution?: string;
  isDangerous: boolean;      // true if 13, 18, 07, 08, 03, 37 etc.
  energyScores: {
    wealth: number;          // 0-10
    charm: number;           // 0-10
    prestige: number;        // 0-10
    wisdom: number;          // 0-10
    luck: number;            // 0-10
  };
}

export interface BirthRule {
  day: BirthDay;
  nameTh: string;
  elementTh: string;
  auspiciousDigits: number[];
  neutralDigits: number[];
  forbiddenDigits: number[]; // เลขกาลกิณี
  goodPairsRecommended: string[];
  description: string;
}

export interface CareerRule {
  career: CareerCategory;
  titleTh: string;
  iconName: string;
  essentialPairs: string[];
  bonusPairs: string[];
  forbiddenPairs: string[];
  description: string;
}

export interface SumRule {
  sum: number;
  tier: PairTier;
  title: string;
  meaning: string;
  isAuspicious: boolean;
}

export interface DecomposedPair {
  position: number;          // 1 to 6 (for last 7 digits)
  pair: string;
  rule?: PairRule;
  isDangerous: boolean;
  scoreContribution: number;
}

export interface ScoredNumber {
  id: string;
  rawNumber: string;         // e.g. "0812345678"
  formattedNumber: string;   // e.g. "081-234-5678"
  provider: Provider;
  source?: string;           // e.g. "Shopee Mall", "AIS Online Store", "Berthongsuk"
  price: number;
  packageDetail?: string;
  buyUrl?: string;
  totalSum: number;
  sumRule?: SumRule;
  
  // Scores (0-100)
  totalScore: number;
  pairScore: number;
  sumScore: number;
  birthScore: number;
  careerScore: number;
  goalsScore: number;
  
  // Flags & breakdown
  decomposedPairs: DecomposedPair[];
  dangerousPairsFound: string[];
  hasKalaKinee: boolean;
  kalaKineeDigitsFound: number[];
  isTopCandidate: boolean;
  
  // Energy Profile (0-100 radar/dial)
  energyProfile: {
    wealth: number;
    charm: number;
    prestige: number;
    wisdom: number;
    luck: number;
  };
  
  // AI Verdict (optional until generated)
  aiVerdict?: {
    tierBadge: 'S-Tier' | 'A-Tier' | 'B-Tier' | 'C-Tier';
    headline: string;
    secondOpinion: string;
    pros: string[];
    cons: string[];
    suitableUsers: string;
    recommendedActions: string;
    evaluatedAt: string;
  };
}

export interface SearchCriteria {
  birthDay?: BirthDay;
  birthDate?: string;
  career?: CareerCategory;
  goals?: LifeGoal[];
  budgetMax?: number;
  providers?: Provider[];
  mustHavePairs?: string[];
  forbiddenDigits?: number[];
  targetSum?: number[];
  minScore?: number;
  keywordSearch?: string;
}

export interface HunterJob {
  id: string;
  title: string;
  criteria: SearchCriteria;
  status: 'idle' | 'running' | 'completed' | 'scheduled' | 'error';
  frequency: 'once' | 'hourly' | 'daily' | 'weekly';
  totalFound: number;
  topCandidatesCount: number;
  lastRunAt?: string;
  nextRunAt?: string;
  logs: string[];
}
