import { NextRequest, NextResponse } from "next/server";
import { Provider, ScoredNumber } from "@/types";
import { scorePhoneNumber } from "@/lib/numerology/scorer";
import { db } from "@/lib/store/in-memory-db";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawText: string = body.text || "";
    const defaultProvider: Provider = body.provider || "AIS";
    const defaultPrice: number = body.price ? parseInt(body.price, 10) : 2990;
    const source: string = body.source || "Shopee";

    if (!rawText.trim()) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุข้อความหรือรายการเบอร์โทรศัพท์" },
        { status: 400 }
      );
    }

    // Regex match any 10-digit Thai phone number formats
    // Matches: 0812345678, 081-234-5678, 081 234 5678, 096-695-9235, etc.
    const regex = /(0[689]\d{8}|0[689]\d{1}[-\s]\d{3}[-\s]\d{4}|0[689]\d{2}[-\s]\d{3}[-\s]\d{4}|0[689]\d{1}[-\s]\d{7})/g;
    const matches = rawText.match(regex) || [];

    // Clean and deduplicate
    const uniqueRawNumbers = Array.from(
      new Set(
        matches
          .map((m) => m.replace(/\D/g, ""))
          .filter((clean) => clean.length === 10 && (clean.startsWith("06") || clean.startsWith("08") || clean.startsWith("09")))
      )
    );

    // If no regex match found, also check if user just pasted pure digits
    if (uniqueRawNumbers.length === 0) {
      const pureDigits = rawText.replace(/\D/g, "");
      if (pureDigits.length === 10 && (pureDigits.startsWith("06") || pureDigits.startsWith("08") || pureDigits.startsWith("09"))) {
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
      // Determine provider if mentioned near number or default
      let detectedProv: Provider = defaultProvider;
      if (cleanNum.startsWith("09") || cleanNum.startsWith("08")) {
        detectedProv = defaultProvider || "AIS";
      }

      return scorePhoneNumber(cleanNum, {
        provider: detectedProv,
        source: source.includes("Shopee") ? "Shopee" : source,
        price: defaultPrice,
        packageDetail: `นำเข้าจาก ${source}`,
        buyUrl: `https://shopee.co.th/search?keyword=${encodeURIComponent(`ซิมเบอร์มงคล ${cleanNum}`)}`,
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
        formatted_number: s.formattedNumber,
        provider: s.provider,
        price: s.price,
        total_sum: s.totalSum,
        total_score: s.totalScore,
        pair_score: s.pairScore,
        sum_score: s.sumScore,
        is_top_candidate: s.isTopCandidate,
        energy_profile: s.energyProfile,
        source: s.source || "Shopee",
        buy_url: s.buyUrl,
        created_at: new Date().toISOString(),
      }));

      await supabase.from("numbers").upsert(supabasePayload, { onConflict: "raw_number" });
    } catch (err: any) {
      console.warn("Supabase upsert warning:", err?.message);
    }

    return NextResponse.json({
      success: true,
      data: {
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
