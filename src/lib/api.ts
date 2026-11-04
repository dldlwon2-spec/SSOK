import type { AnalysisResult } from "@/lib/analysis/types";

export async function requestAnalysis(sentence: string, signal?: AbortSignal): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sentence }),
    signal,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error ?? "분석에 실패했어요.");
  return data as AnalysisResult;
}
