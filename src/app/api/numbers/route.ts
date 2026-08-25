import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store/in-memory-db";

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

    if (id) {
      const single = db.getNumberById(id);
      if (!single) {
        return NextResponse.json({ success: false, error: "Number not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: single });
    }

    if (digits) {
      const single = db.getNumberByCleanDigits(digits);
      if (single) {
        return NextResponse.json({ success: true, data: single });
      }
    }

    let list = db.getAllNumbers();

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
    });
  } catch (error: any) {
    console.error("Error in numbers API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve numbers" },
      { status: 500 }
    );
  }
}
