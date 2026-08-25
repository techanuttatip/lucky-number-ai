import { NextRequest, NextResponse } from "next/server";
import { hunterService } from "@/lib/scraper/hunter-service";
import { db } from "@/lib/store/in-memory-db";
import { SearchCriteria } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const criteria: SearchCriteria = body.criteria || {};
    const jobId = body.jobId || `job_${Date.now()}`;
    const title = body.title || "น้องบอทล่าเบอร์มงคลประจำวัน ✨";
    const frequency = body.frequency || "hourly";

    const result = await hunterService.executeHunt(criteria, jobId, title, frequency);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Error executing hunt pipeline:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute hunt" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const jobs = db.getAllJobs();
    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
