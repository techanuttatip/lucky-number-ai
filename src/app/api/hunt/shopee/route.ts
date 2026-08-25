import { NextRequest, NextResponse } from "next/server";
import { extractAndIngestShopeeNumbers } from "@/lib/scraper/shopee-hunter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const urlOrKeyword =
      body.url ||
      body.keyword ||
      "https://shopee.co.th/search?keyword=ซิมเบอร์มงคล";

    const result = await extractAndIngestShopeeNumbers(urlOrKeyword);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Shopee extract error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to extract numbers from Shopee",
      },
      { status: 500 }
    );
  }
}
