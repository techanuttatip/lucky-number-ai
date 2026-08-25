import { NextRequest, NextResponse } from "next/server";
import { Provider, ScoredNumber } from "@/types";
import { scorePhoneNumber } from "@/lib/numerology/scorer";
import { db } from "@/lib/store/in-memory-db";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

function parseSmartPrice(input: any): { price: number; priceDisplay?: string } {
  if (!input) return { price: 0 };
  if (typeof input === "number") {
    return { price: input, priceDisplay: input > 0 ? input.toLocaleString() : undefined };
  }
  const str = String(input).trim();
  if (!str) return { price: 0 };

  // Check if it's a range like "1599 - 5999" or "1,599 - 5,999"
  if (str.includes("-")) {
    const parts = str
      .split("-")
      .map((p) => {
        const clean = p.replace(/\D/g, "");
        return clean ? parseInt(clean, 10) : NaN;
      })
      .filter((n) => !isNaN(n));

    if (parts.length >= 2) {
      const min = parts[0];
      const max = parts[1];
      return {
        price: min,
        priceDisplay: `${min.toLocaleString()} - ${max.toLocaleString()}`,
      };
    }
  }

  // Single price
  const clean = str.replace(/\D/g, "");
  const num = clean ? parseInt(clean, 10) : 0;
  if (!isNaN(num) && num > 0) {
    return {
      price: num,
      priceDisplay: num.toLocaleString(),
    };
  }

  return { price: 0 };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText: string = body.text || "";
    const storeName: string = body.storeName || body.source || "Shopee Store";
    const storeUrl: string = body.storeUrl || body.shopUrl || `https://shopee.co.th/search?keyword=ซิมเบอร์มงคล`;
    const defaultProvider: Provider = body.provider || "AIS";
    const { price: defaultPrice, priceDisplay } = parseSmartPrice(body.price || body.priceDisplay);

    if (!rawText.trim()) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุข้อความหรือรายการเบอร์โทรศัพท์" },
        { status: 400 }
      );
    }

    // Regex match any 10-digit Thai phone number formats
    const regex = /(0[689]\d{8}|0[689]\d{1}[-\s]\d{3}[-\s]\d{4}|0[689]\d{2}[-\s]\d{3}[-\s]\d{4}|0[689]\d{1}[-\s]\d{7})/g;
    const matches = rawText.match(regex) || [];

    // Clean and deduplicate
    const uniqueRawNumbers = Array.from(
      new Set(
        matches
          .map((m) => m.replace(/\D/g, ""))
          .filter(
            (clean) =>
              clean.length === 10 &&
              (clean.startsWith("06") || clean.startsWith("08") || clean.startsWith("09"))
          )
      )
    );

    // Pure digits check
    if (uniqueRawNumbers.length === 0) {
      const pureDigits = rawText.replace(/\D/g, "");
      if (
        pureDigits.length === 10 &&
        (pureDigits.startsWith("06") || pureDigits.startsWith("08") || pureDigits.startsWith("09"))
      ) {
        uniqueRawNumbers.push(pureDigits);
      }
    }

    if (uniqueRawNumbers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "ไม่พบเบอร์โทรศัพท์ 10 หลัก (ขึ้นต้นด้วย 06, 08, 09) ในข้อความที่วาง",
        },
        { status: 400 }
      );
    }

    // Process and score every number through the deterministic rule engine
    const scoredList: ScoredNumber[] = uniqueRawNumbers.map((cleanNum) => {
      let detectedProv: Provider = defaultProvider;
      if (cleanNum.startsWith("091") || cleanNum.startsWith("093") || cleanNum.startsWith("097") || cleanNum.startsWith("063")) {
        detectedProv = "TRUE";
      } else if (cleanNum.startsWith("08") || cleanNum.startsWith("098") || cleanNum.startsWith("095") || cleanNum.startsWith("065")) {
        detectedProv = "AIS";
      }

      // Build target Shopee Buy Link
      const directBuyUrl = storeUrl.includes("shopee.co.th")
        ? storeUrl
        : `https://shopee.co.th/search?keyword=${encodeURIComponent(`ซิมเบอร์มงคล ${cleanNum}`)}`;

      return scorePhoneNumber(cleanNum, {
        provider: detectedProv,
        source: storeName,
        price: defaultPrice,
        priceDisplay: priceDisplay,
        packageDetail: `${storeName} • ผลรวม 10 หลัก`,
        buyUrl: directBuyUrl,
      });
    });

    // Sort descending by totalScore
    scoredList.sort((a, b) => b.totalScore - a.totalScore);

    // Save to in-memory store
    db.saveBulkNumbers(scoredList);

    // Persist to Supabase PostgreSQL
    try {
      const supabasePayload = scoredList.map((s) => ({
        raw_number: s.rawNumber,
        clean_number: s.rawNumber,
        provider: s.provider,
        price: s.price,
        package_detail: `${s.source} • ผลรวม ${s.totalSum}`,
        buy_url: s.buyUrl,
        total_sum: s.totalSum,
        status: "available",
        is_active: true,
      }));

      await supabase.from("numbers").upsert(supabasePayload, { onConflict: "raw_number" });
    } catch (err: any) {
      console.warn("Supabase upsert warning:", err?.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        storeName,
        storeUrl,
        importedCount: scoredList.length,
        numbers: scoredList,
        gradeSCount: scoredList.filter((n) => n.totalScore >= 90).length,
        gradeACount: scoredList.filter((n) => n.totalScore >= 80 && n.totalScore < 90).length,
        dangerousCount: scoredList.filter((n) => n.dangerousPairsFound.length > 0).length,
      },
    });
  } catch (error: any) {
    console.error("Error in /api/numbers/import:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to import numbers" },
      { status: 500 }
    );
  }
}
