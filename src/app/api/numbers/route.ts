import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store/in-memory-db";
import { supabase } from "@/lib/supabase/client";
import { scorePhoneNumber } from "@/lib/numerology/scorer";
import { ScoredNumber } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const digits = searchParams.get("digits");
    const provider = searchParams.get("provider");
    const minScore = searchParams.get("minScore");
    const maxPrice = searchParams.get("maxPrice");
    const topOnly = searchParams.get("topOnly") === "true";

    // 1. Single number lookup
    if (id) {
      const single = db.getNumberById(id);
      if (single) {
        return NextResponse.json({ success: true, data: single });
      }
    }

    if (digits) {
      const single = db.getNumberByCleanDigits(digits);
      if (single) {
        return NextResponse.json({ success: true, data: single });
      }
    }

    // 2. Fetch list (Try Supabase first, fallback to in-memory)
    let list: ScoredNumber[] = [];
    try {
      const { data: supaRows, error } = await supabase
        .from("numbers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && supaRows && supaRows.length > 0) {
        list = supaRows.map((row: any) =>
          scorePhoneNumber(row.raw_number || row.clean_number, {
            id: `num_${row.raw_number}`,
            provider: row.provider,
            price: Number(row.price) || 0,
            packageDetail: row.package_detail,
            buyUrl: row.buy_url,
          })
        );
        // Also update local cache
        db.saveBulkNumbers(list);
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local cache:", e);
    }

    if (list.length === 0) {
      list = db.getAllNumbers();
    }

    // 3. Filters
    if (provider && provider !== "ALL") {
      list = list.filter((n) => n.provider === provider);
    }

    if (minScore) {
      const ms = parseInt(minScore, 10);
      if (!isNaN(ms)) {
        list = list.filter((n) => n.totalScore >= ms);
      }
    }

    if (maxPrice) {
      const mp = parseInt(maxPrice, 10);
      if (!isNaN(mp)) {
        list = list.filter((n) => n.price <= mp);
      }
    }

    if (topOnly) {
      list = list.filter((n) => n.isTopCandidate);
    }

    // Default sort by total score descending
    list.sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json({
      success: true,
      data: list,
      total: list.length,
      source: "supabase",
    });
  } catch (error: any) {
    console.error("Error in numbers API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve numbers" },
      { status: 500 }
    );
  }
}
