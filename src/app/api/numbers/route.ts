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
      total: list.length,
      data: list,
    });
  } catch (error: any) {
    console.error("Error in /api/numbers:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch numbers" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawNumber = searchParams.get("rawNumber");
    const clearAll = searchParams.get("clearAll") === "true";

    if (clearAll) {
      db.clearAllNumbers();
      try {
        await supabase.from("numbers").delete().neq("raw_number", "0000000000");
      } catch (e) {
        console.warn("Supabase clear error:", e);
      }
      return NextResponse.json({ success: true, message: "ลบเบอร์ทั้งหมดเรียบร้อยแล้ว" });
    }

    if (rawNumber) {
      const clean = rawNumber.replace(/\D/g, "");
      db.deleteNumber(clean);
      try {
        await supabase.from("numbers").delete().eq("raw_number", clean);
      } catch (e) {
        console.warn("Supabase delete single error:", e);
      }
      return NextResponse.json({ success: true, message: `ลบเบอร์ ${clean} เรียบร้อยแล้ว` });
    }

    return NextResponse.json({ success: false, error: "กรุณาระบุ rawNumber หรือ clearAll=true" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
