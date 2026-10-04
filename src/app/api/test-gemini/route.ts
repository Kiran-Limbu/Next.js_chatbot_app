import { generateAIResponse } from "@/src/lib/gemini";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await generateAIResponse(
      "what is async and wait"
    );

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    return NextResponse.json(
      {
        message: "Failed to generate AI response",
      },
      {
        status: 500,
      }
    );
  }
}