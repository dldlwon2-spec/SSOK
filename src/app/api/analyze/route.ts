import { NextResponse } from "next/server";
import { analyzeSentence } from "@/lib/analysis/analyzer";
import { AnalysisInputError } from "@/lib/analysis/preprocess";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const sentence = typeof body?.sentence === "string" ? body.sentence : "";

  try {
    return NextResponse.json(await analyzeSentence(sentence));
  } catch (error) {
    if (error instanceof AnalysisInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[analyze]", error);
    return NextResponse.json(
      { error: "분석 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
