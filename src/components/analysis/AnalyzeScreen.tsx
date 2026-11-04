"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { requestAnalysis } from "@/lib/api";
import type { AnalysisResult } from "@/lib/analysis/types";
import { addRecent, findStored } from "@/lib/storage/history";
import { refreshSentence } from "@/lib/storage/notebook";
import { AnalysisSkeleton } from "./AnalysisSkeleton";
import { AnalysisView } from "./AnalysisView";

type State =
  | { status: "loading" }
  | { status: "done"; result: AnalysisResult }
  | { status: "error"; message: string };

export function AnalyzeScreen() {
  const router = useRouter();
  const query = useSearchParams().get("q") ?? "";
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!query.trim()) {
      router.replace("/");
      return;
    }

    const stored = findStored(query);
    if (stored) {
      setState({ status: "done", result: stored });
      return;
    }

    const controller = new AbortController();
    setState({ status: "loading" });
    requestAnalysis(query, controller.signal)
      .then((result) => {
        addRecent(result);
        refreshSentence(result);
        setState({ status: "done", result });
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setState({ status: "error", message: error.message });
      });
    return () => controller.abort();
  }, [query, attempt, router]);

  if (state.status === "loading") return <AnalysisSkeleton />;
  if (state.status === "done") return <AnalysisView result={state.result} />;

  return (
    <section className="mt-10 rounded-3xl @md:rounded-[28px] border border-destructive/30 bg-card p-4 shadow-card @sm:p-6">
      <h2 className="mb-2 text-xl font-bold">분석하지 못했어요</h2>
      <p className="mb-5 text-muted-foreground">{state.message}</p>
      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => setAttempt((n) => n + 1)}
          className="rounded-2xl bg-primary px-5 py-3 font-bold text-primary-foreground shadow-ink"
        >
          다시 시도
        </button>
        <Link href="/" className="rounded-2xl border border-border bg-card px-5 py-3 font-bold">
          다른 문장 입력
        </Link>
      </div>
    </section>
  );
}
