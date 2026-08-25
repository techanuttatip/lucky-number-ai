import { NextRequest, NextResponse } from "next/server";
import { parseUserPromptWithMasterAI } from "@/lib/ai/wizard-agent";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    const criteria = await parseUserPromptWithMasterAI(prompt);

    return NextResponse.json({
      success: true,
      data: criteria,
    });
  } catch (error: any) {
    console.error("Error in wizard-ai API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to parse prompt" },
      { status: 500 }
    );
  }
}
