import { Provider } from "@/types";

export interface RawCandidateNumber {
  rawNumber: string;
  provider: Provider;
  price: number;
  packageDetail: string;
  buyUrl: string;
  source: string;
}

export const INITIAL_CANDIDATE_POOL: RawCandidateNumber[] = [
  // === Featured Number from Berthongsuk & Top Carriers ===
  {
    rawNumber: "0966959235",
    provider: "TRUE",
    price: 4900,
    packageDetail: "TRUE 5G Together 899 บ./เดือน (ผลรวม 54 ราชาโชค)",
    buyUrl: "https://berthongsuk.in.th/%e0%b8%a7%e0%b8%b4%e0%b9%80%e0%b8%84%e0%b8%a3%e0%b8%b2%e0%b8%b0%e0%b8%ab%e0%b9%8c%e0%b9%80%e0%b8%9a%e0%b8%ad%e0%b8%a3%e0%b9%8c%e0%b8%a1%e0%b8%87%e0%b8%84%e0%b8%a5/?num=0966959235",
    source: "Berthongsuk & True Store",
  },
  // === AIS Premium & Auspicious Numbers ===
  {
    rawNumber: "0954951545",
    provider: "AIS",
    price: 3990,
    packageDetail: "AIS 5G Max Speed 1,199 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0954951545",
    source: "AIS Online Store (VIP)",
  },
  {
    rawNumber: "0812424656",
    provider: "AIS",
    price: 5900,
    packageDetail: "AIS 5G Net Extreme 899 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0812424656",
    source: "AIS Online Store (มงคลเสริมทรัพย์)",
  },
  {
    rawNumber: "0987895665",
    provider: "AIS",
    price: 29900,
    packageDetail: "AIS Serenade Platinum Unlimited 1,999 บ.",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0987895665",
    source: "AIS เบอร์มังกรจักรพรรดิ",
  },
  {
    rawNumber: "0922896365",
    provider: "AIS",
    price: 19900,
    packageDetail: "AIS Serenade Gold 1,499 บ.",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0922896365",
    source: "AIS เบอร์หงส์มหาเศรษฐี",
  },
  {
    rawNumber: "0651514559",
    provider: "AIS",
    price: 2490,
    packageDetail: "AIS 5G Postpaid 599 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0651514559",
    source: "AIS Online Store (ปัญญาบารมี)",
  },
  {
    rawNumber: "0934563665",
    provider: "AIS",
    price: 8900,
    packageDetail: "AIS 5G Max Speed 1,199 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0934563665",
    source: "AIS เบอร์เรียงรับทรัพย์",
  },
  {
    rawNumber: "0982464263",
    provider: "AIS",
    price: 4500,
    packageDetail: "AIS 5G Net Extreme 699 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0982464263",
    source: "AIS มหาเสน่ห์ค้าขาย",
  },
  {
    rawNumber: "0819895995",
    provider: "AIS",
    price: 12500,
    packageDetail: "AIS Serenade 1,299 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0819895995",
    source: "AIS บารมีผู้นำสูงสุด",
  },
  {
    rawNumber: "0633656424",
    provider: "AIS",
    price: 3200,
    packageDetail: "AIS 5G Postpaid 499 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0633656424",
    source: "AIS Online Store",
  },
  {
    rawNumber: "0955959595",
    provider: "AIS",
    price: 49000,
    packageDetail: "AIS Serenade Platinum 2,999 บ.",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0955959595",
    source: "AIS เบอร์ตองศักดิ์สิทธิ์",
  },
  {
    rawNumber: "0981541456",
    provider: "AIS",
    price: 1990,
    packageDetail: "AIS 5G Net 499 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0981541456",
    source: "AIS Standard Postpaid",
  },
  {
    rawNumber: "0627828965",
    provider: "AIS",
    price: 15900,
    packageDetail: "AIS 5G Serenade 1,499 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0627828965",
    source: "AIS มังกรเงินล้าน",
  },
  {
    rawNumber: "0949495495",
    provider: "AIS",
    price: 4200,
    packageDetail: "AIS 5G Tech Super 799 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0949495495",
    source: "AIS ไอทีดิจิทัล",
  },
  {
    rawNumber: "0814595654",
    provider: "AIS",
    price: 6500,
    packageDetail: "AIS 5G Max 999 บ./เดือน",
    buyUrl: "https://store.ais.co.th/th/number-search?q=0814595654",
    source: "AIS ผู้บริหารพรีเมียม",
  },

  // === TRUE 5G Auspicious Numbers ===
  {
    rawNumber: "0962456542",
    provider: "TRUE",
    price: 3900,
    packageDetail: "TRUE 5G Together 899 บ./เดือน",
    buyUrl: "https://truemoveh.truecorp.co.th/online-store/postpaid/0962456542",
    source: "True Store Lucky Number",
  },
  {
    rawNumber: "0957896456",
    provider: "TRUE",
    price: 25000,
    packageDetail: "True Black Card Unlimited 1,899 บ.",
    buyUrl: "https://truemoveh.truecorp.co.th/online-store/postpaid/0957896456",
    source: "True มังกร 789",
  },
  {
    rawNumber: "0891515956",
    provider: "TRUE",
    price: 4900,
    packageDetail: "TRUE 5G Ultra Max 1,099 บ.",
    buyUrl: "https://truemoveh.truecorp.co.th/online-store/postpaid/0891515956",
    source: "True Store ปัญญาบารมี",
  },
  {
    rawNumber: "0963654246",
    provider: "TRUE",
    price: 2900,
    packageDetail: "TRUE 5G Smart 699 บ./เดือน",
    buyUrl: "https://truemoveh.truecorp.co.th/online-store/postpaid/0963654246",
    source: "True ค้าขายร่ำรวย",
  },
  {
    rawNumber: "0918989565",
    provider: "TRUE",
    price: 11900,
    packageDetail: "True Red Card 1,299 บ./เดือน",
    buyUrl: "https://truemoveh.truecorp.co.th/online-store/postpaid/0918989565",
    source: "True ผู้นำมหาบารมี",
  },
  {
    rawNumber: "0842893656",
    provider: "TRUE",
    price: 16500,
    packageDetail: "TRUE 5G Together 1,499 บ.",
    buyUrl: "https://truemoveh.truecorp.co.th/online-store/postpaid/0842893656",
    source: "True หงส์เงินล้าน",
  },

  // === DTAC 5G Auspicious Numbers ===
  {
    rawNumber: "0823654565",
    provider: "DTAC",
    price: 2990,
    packageDetail: "dtac GO+ 5G 799 บ./เดือน",
    buyUrl: "https://dtaconline.dtac.co.th/lucky-number/0823654565",
    source: "dtac เบอร์มงคลเฉพาะบุคคล",
  },
  {
    rawNumber: "0947878956",
    provider: "DTAC",
    price: 18900,
    packageDetail: "dtac Blue Member 1,699 บ.",
    buyUrl: "https://dtaconline.dtac.co.th/lucky-number/0947878956",
    source: "dtac มังกรคู่",
  },
  {
    rawNumber: "0612463656",
    provider: "DTAC",
    price: 2200,
    packageDetail: "dtac Postpaid 599 บ./เดือน",
    buyUrl: "https://dtaconline.dtac.co.th/lucky-number/0612463656",
    source: "dtac ค้าขายและเสน่ห์",
  },
  {
    rawNumber: "0994951565",
    provider: "DTAC",
    price: 3500,
    packageDetail: "dtac GO 5G 899 บ./เดือน",
    buyUrl: "https://dtaconline.dtac.co.th/lucky-number/0994951565",
    source: "dtac เทคโนโลยีและปัญญา",
  },

  // === Mixed / Standard / Inauspicious Test Numbers (for filtering validation) ===
  {
    rawNumber: "0811813107",
    provider: "AIS",
    price: 990,
    packageDetail: "AIS Postpaid 399 บ.",
    buyUrl: "https://store.ais.co.th/th/0811813107",
    source: "AIS เบอร์ทั่วไป (มีคู่ 18, 13, 07)",
  },
  {
    rawNumber: "0898080373",
    provider: "TRUE",
    price: 590,
    packageDetail: "True Smart 399 บ.",
    buyUrl: "https://truemoveh.truecorp.co.th/0898080373",
    source: "True เบอร์ทั่วไป (มีคู่ 08, 03, 37)",
  },
  {
    rawNumber: "0942727000",
    provider: "DTAC",
    price: 490,
    packageDetail: "dtac Go 399 บ.",
    buyUrl: "https://dtaconline.dtac.co.th/0942727000",
    source: "dtac เบอร์ทั่วไป (มีคู่ 27, 70, 00)",
  },
  {
    rawNumber: "0866665665",
    provider: "AIS",
    price: 4500,
    packageDetail: "AIS 5G Net 799 บ.",
    buyUrl: "https://store.ais.co.th/th/0866665665",
    source: "AIS (มีเลข 6 ห้ามคนวันอาทิตย์)",
  },
  {
    rawNumber: "0911115115",
    provider: "TRUE",
    price: 3500,
    packageDetail: "True Postpaid 599 บ.",
    buyUrl: "https://truemoveh.truecorp.co.th/0911115115",
    source: "True (มีเลข 1 ห้ามคนวันจันทร์)",
  },
  {
    rawNumber: "0822224224",
    provider: "DTAC",
    price: 3200,
    packageDetail: "dtac Postpaid 599 บ.",
    buyUrl: "https://dtaconline.dtac.co.th/0822224224",
    source: "dtac (มีเลข 2 ห้ามคนวันอังคาร)",
  }
];
