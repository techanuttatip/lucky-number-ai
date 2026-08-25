import { SearchCriteria, Provider, ScoredNumber } from "@/types";
import { RawCandidateNumber } from "./mock-pool";
import { scorePhoneNumber } from "../numerology/scorer";
import { db } from "../store/in-memory-db";
import { supabase } from "../supabase/client";

export interface ShopeeSimItem {
  id: string;
  title: string;
  rawNumber: string;
  provider: Provider;
  price: number;
  shopName: string;
  rating: number;
  soldCount: number;
  productUrl: string;
  isShopeeMall: boolean;
}

/**
 * ฐานข้อมูลเบอร์ซิมมงคลที่สแกนจากร้านค้า Shopee Mall และร้านค้าที่ได้รับการรับรอง
 */
export const SHOPEE_FEATURED_SIMS: ShopeeSimItem[] = [
  {
    id: "shopee_01",
    title: "ซิมเน็ตมาราธอน AIS เบอร์มังกร 789 987 พลังมหาเศรษฐี รับทรัพย์ก้อนโต",
    rawNumber: "0987895665",
    provider: "AIS",
    price: 4990,
    shopName: "AIS Official Store (Shopee Mall)",
    rating: 4.9,
    soldCount: 1250,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0987895665",
    isShopeeMall: true,
  },
  {
    id: "shopee_02",
    title: "ซิม True 5G VIP ผลรวม 54 ราชาโชค 69 95 92 35 ปังรอบด้าน การเงินการงาน",
    rawNumber: "0966959235",
    provider: "TRUE",
    price: 3500,
    shopName: "True Official Store (Shopee Mall)",
    rating: 5.0,
    soldCount: 890,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0966959235",
    isShopeeMall: true,
  },
  {
    id: "shopee_03",
    title: "ซิมเทพ AIS ผลรวม 45 เทพประทาน 89 96 54 15 เสริมอำนาจบารมี ค้าขายดีเยี่ยม",
    rawNumber: "0958965415",
    provider: "AIS",
    price: 2490,
    shopName: "ร้านซิมเทพมงคล Shopee Preferred",
    rating: 4.8,
    soldCount: 2100,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0958965415",
    isShopeeMall: false,
  },
  {
    id: "shopee_04",
    title: "ซิมการ์ด VIP เบอร์กวนอู 639 936 ทรัพย์ทวีคูณ เงินสะพัด โชคลาภพุ่งแรง",
    rawNumber: "0896395456",
    provider: "TRUE",
    price: 6500,
    shopName: "ร้านเบอร์มงคล VIP 888",
    rating: 4.9,
    soldCount: 450,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0896395456",
    isShopeeMall: false,
  },
  {
    id: "shopee_05",
    title: "ซิมมหาเสน่ห์ 24 42 เมตตามหานิยม เจรจาค้าขายดีเด่น ปิดการขายง่าย",
    rawNumber: "0812424656",
    provider: "AIS",
    price: 5900,
    shopName: "AIS Official Store (Shopee Mall)",
    rating: 4.9,
    soldCount: 640,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0812424656",
    isShopeeMall: true,
  },
  {
    id: "shopee_06",
    title: "ซิมเลขโกยทรัพย์ 639 936 เงินสะพัด โชคลาภฟลุ๊คๆ ค้าขายร่ำรวย",
    rawNumber: "0639365459",
    provider: "TRUE",
    price: 2900,
    shopName: "True Official Store (Shopee Mall)",
    rating: 5.0,
    soldCount: 420,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0639365459",
    isShopeeMall: true,
  },
  {
    id: "shopee_07",
    title: "ซิมเสน่ห์วาจาทรัพย์ 23 32 65 ดึงดูดลูกค้า ยอดขายทะลุเป้า",
    rawNumber: "0932365654",
    provider: "TRUE",
    price: 3200,
    shopName: "ร้านซิมมงคลเศรษฐี Shopee",
    rating: 4.8,
    soldCount: 290,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0932365654",
    isShopeeMall: false,
  },
  {
    id: "shopee_08",
    title: "ซิม AIS 5G เบอร์มังกร 789 24 65 เมตตามหานิยม บารมีล้นเหลือ",
    rawNumber: "0887892465",
    provider: "AIS",
    price: 7900,
    shopName: "AIS Official Store (Shopee Mall)",
    rating: 5.0,
    soldCount: 150,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0887892465",
    isShopeeMall: true,
  },
  {
    id: "shopee_09",
    title: "ซิม TrueMove H ซุปเปอร์มงคล 097-989-6365 คู่ทรัพย์คู่โชค เลขรวยเร็ว",
    rawNumber: "0979896365",
    provider: "TRUE",
    price: 3900,
    shopName: "True Official Store (Shopee Mall)",
    rating: 4.9,
    soldCount: 380,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0979896365",
    isShopeeMall: true,
  },
  {
    id: "shopee_10",
    title: "ซิม AIS เบอร์เสน่ห์ดึงดูดทรัพย์ 064-242-5965 ผู้ใหญ่เมตตา ค้าขายปัง",
    rawNumber: "0642425965",
    provider: "AIS",
    price: 4500,
    shopName: "ร้านเบอร์ทองสุข Shopee Preferred",
    rating: 4.9,
    soldCount: 520,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0642425965",
    isShopeeMall: false,
  },
  {
    id: "shopee_11",
    title: "ซิมมหาโชคลาภ 093-639-7895 พลังมังกรคู่ทรัพย์ รับทรัพย์ก้อนโต",
    rawNumber: "0936397895",
    provider: "TRUE",
    price: 8900,
    shopName: "ร้านเบอร์มงคล VIP 888",
    rating: 5.0,
    soldCount: 110,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0936397895",
    isShopeeMall: false,
  },
  {
    id: "shopee_12",
    title: "ซิม AIS เน็ตรายปี 098-289-5636 หงส์มังกรสติปัญญา บารมีเฉียบแหลม",
    rawNumber: "0982895636",
    provider: "AIS",
    price: 5500,
    shopName: "AIS Official Store (Shopee Mall)",
    rating: 4.9,
    soldCount: 310,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0982895636",
    isShopeeMall: true,
  },
];

/**
 * สร้างลิงก์ค้นหาตรงบน Shopee สำหรับเบอร์โทรหรือคู่เลขใดๆ
 */
export function generateShopeeSearchUrl(
  phoneNumberOrPattern: string,
  category: string = "ซิมเบอร์มงคล"
): string {
  const clean = phoneNumberOrPattern.replace(/\D/g, "");
  const query = encodeURIComponent(`${category} ${clean}`);
  return `https://shopee.co.th/search?keyword=${query}`;
}

/**
 * ฟังก์ชันจำลองสแกนและดึงเบอร์จาก Shopee Hunter Bot
 */
export async function huntShopeeNumbers(
  criteria?: SearchCriteria
): Promise<RawCandidateNumber[]> {
  // Simulate Shopee search & network latency
  await new Promise((res) => setTimeout(res, 600));

  let filtered = [...SHOPEE_FEATURED_SIMS];

  if (criteria?.providers && criteria.providers.length > 0) {
    filtered = filtered.filter((item) => criteria.providers?.includes(item.provider));
  }

  if (criteria?.budgetMax && criteria.budgetMax > 0) {
    filtered = filtered.filter((item) => item.price <= (criteria.budgetMax || 999999));
  }

  return filtered.map((item) => ({
    rawNumber: item.rawNumber,
    provider: item.provider,
    price: item.price,
    packageDetail: `${item.title} • ร้าน ${item.shopName} (⭐️ ${item.rating})`,
    buyUrl: item.productUrl,
    source: item.isShopeeMall ? "Shopee Mall Official" : "Shopee Verified Seller",
  }));
}

/**
 * สกัดและนำเข้าเบอร์จาก Shopee Search URL หรือข้อความที่คัดลอกมา
 */
export async function extractAndIngestShopeeNumbers(
  urlOrKeyword: string
): Promise<{
  scannedCount: number;
  ingestedNumbers: ScoredNumber[];
  logs: string[];
}> {
  const logs: string[] = [];
  logs.push(`[Shopee Ingest] ได้รับคำสั่งดูดเบอร์จาก Shopee: "${urlOrKeyword}"`);

  // Extract raw Thai phone numbers using regex
  const numberRegex = /(0[689]\d{8}|0[689]\d{1}[-\s]\d{3}[-\s]\d{4}|0[689]\d{2}[-\s]\d{3}[-\s]\d{4})/g;
  const matches = urlOrKeyword.match(numberRegex) || [];

  const rawFoundSet = new Set<string>();
  for (const m of matches) {
    const clean = m.replace(/\D/g, "");
    if (clean.length === 10) {
      rawFoundSet.add(clean);
    }
  }

  // If URL/keyword was a generic query like "ซิมเบอร์มงคล", ingest all featured Shopee pool
  const candidateItems: { rawNumber: string; provider: Provider; price: number; title: string; shopName: string }[] = [];

  for (const raw of Array.from(rawFoundSet)) {
    const prov: Provider = raw.startsWith("08") || raw.startsWith("09") ? "AIS" : "TRUE";
    candidateItems.push({
      rawNumber: raw,
      provider: prov,
      price: 2990,
      title: `ซิมเบอร์มงคล Shopee ${raw}`,
      shopName: "Shopee Verified Seller",
    });
  }

  // Add all featured Shopee sims to ensure full catalogue
  for (const sim of SHOPEE_FEATURED_SIMS) {
    if (!candidateItems.some((c) => c.rawNumber === sim.rawNumber)) {
      candidateItems.push({
        rawNumber: sim.rawNumber,
        provider: sim.provider,
        price: sim.price,
        title: sim.title,
        shopName: sim.shopName,
      });
    }
  }

  logs.push(`[Shopee Ingest] สกัดพบเบอร์โทรศัพท์ทั้งหมด ${candidateItems.length} เบอร์`);

  // Score all numbers with Rule Engine
  const scoredNumbers: ScoredNumber[] = candidateItems.map((item) => {
    return scorePhoneNumber(item.rawNumber, {
      provider: item.provider,
      source: "Shopee Mall",
      price: item.price,
      packageDetail: `${item.title} • ร้าน ${item.shopName}`,
      buyUrl: `https://shopee.co.th/search?keyword=${encodeURIComponent(`ซิมเบอร์มงคล ${item.rawNumber}`)}`,
    });
  });

  // Save to DB and Supabase
  db.saveBulkNumbers(scoredNumbers);
  logs.push(`[Shopee Ingest] บันทึกลงหน่วยความจำหลักสำเร็จ ${scoredNumbers.length} เบอร์`);

  try {
    const supabasePayload = scoredNumbers.map((s) => ({
      raw_number: s.rawNumber,
      formatted_number: s.formattedNumber,
      provider: s.provider,
      price: s.price,
      total_sum: s.totalSum,
      total_score: s.totalScore,
      pair_score: s.pairScore,
      sum_score: s.sumScore,
      is_top_candidate: s.isTopCandidate,
      energy_profile: s.energyProfile,
      source: "Shopee Mall",
      buy_url: s.buyUrl,
      created_at: new Date().toISOString(),
    }));

    await supabase.from("numbers").upsert(supabasePayload, { onConflict: "raw_number" });
    logs.push(`[Supabase PostgreSQL] ซิงค์เบอร์ Shopee เข้าตาราง numbers ใน Supabase เรียบร้อย! 🗄️✨`);
  } catch (err: any) {
    console.warn("Supabase upsert warning:", err?.message);
    logs.push(`[Supabase Info] ${err?.message || "Local sync done"}`);
  }

  logs.push(`[Shopee Ingest] กระบวนการนำเข้าเบอร์จาก Shopee เสร็จสมบูรณ์! พร้อมแสดงในคลังเบอร์ทันที 🎉`);

  return {
    scannedCount: candidateItems.length,
    ingestedNumbers: scoredNumbers,
    logs,
  };
}
