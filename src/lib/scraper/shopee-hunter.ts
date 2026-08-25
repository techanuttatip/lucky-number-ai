import { RawCandidateNumber } from "./mock-pool";
import { SearchCriteria } from "@/types";

/**
 * Shopee Thailand Lucky SIM Hunter & Deep Link Generator
 * ค้นหาและสแกนเบอร์มงคลจาก Shopee Mall และร้านค้าซิมมงคลที่ได้รับการรับรอง
 */

export interface ShopeeSimItem {
  id: string;
  title: string;
  rawNumber: string;
  provider: 'AIS' | 'TRUE' | 'DTAC';
  price: number;
  shopName: string;
  rating: number;
  soldCount: number;
  productUrl: string;
  isShopeeMall: boolean;
}

export const SHOPEE_FEATURED_SIMS: ShopeeSimItem[] = [
  {
    id: "shopee_01",
    title: "ซิมเน็ตมาราธอน AIS 5G เบอร์มังกร 789 เสริมโชคลาภการเงิน",
    rawNumber: "0987895665",
    provider: "AIS",
    price: 29900,
    shopName: "AIS Official Store (Shopee Mall)",
    rating: 4.9,
    soldCount: 340,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0987895665",
    isShopeeMall: true,
  },
  {
    id: "shopee_02",
    title: "ซิม True 5G VIP ผลรวม 54 ราชาโชค ค้าขายดี เสน่ห์เมตตา",
    rawNumber: "0966959235",
    provider: "TRUE",
    price: 4900,
    shopName: "True Official Store (Shopee Mall)",
    rating: 5.0,
    soldCount: 890,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0966959235",
    isShopeeMall: true,
  },
  {
    id: "shopee_03",
    title: "ซิมเสริมปัญญาบารมี 45 59 15 54 งานก้าวหน้า ผู้ใหญ่เมตตา",
    rawNumber: "0954951545",
    provider: "AIS",
    price: 3990,
    shopName: "ซิมมงคลแท้ 100% Shopee Preferred",
    rating: 4.8,
    soldCount: 520,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0954951545",
    isShopeeMall: false,
  },
  {
    id: "shopee_04",
    title: "ซิมหงส์ 289 มหาเศรษฐี เงินก้อนโต ค้าขายคล่องตัว",
    rawNumber: "0922896365",
    provider: "AIS",
    price: 19900,
    shopName: "ศูนย์รวมเบอร์สวย Shopee Mall",
    rating: 4.9,
    soldCount: 180,
    productUrl: "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล+0922896365",
    isShopeeMall: true,
  },
  {
    id: "shopee_05",
    title: "ซิมมหาเสน่ห์ 24 42 เมตตามหานิยม เจรจาค้าขายดีเด่น",
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
    title: "ซิมเลขโกยทรัพย์ 639 936 เงินสะพัด โชคลาภฟลุ๊คๆ",
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
