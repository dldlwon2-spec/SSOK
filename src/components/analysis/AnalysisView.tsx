"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Copy } from "lucide-react";
import { LevelTabs } from "@/components/learning/LevelTabs";
import { useLocalStore } from "@/hooks/useLocalStore";
import type { AnalysisResult } from "@/lib/analysis/types";
import { sentenceBook, toggleSentence } from "@/lib/storage/notebook";
import { levelStore } from "@/lib/storage/preferences";
import { LevelSections } from "./LevelSections";

const SOURCE_NOTE: Partial<Record<AnalysisResult["source"], string>> = {
  rule: "AI 키가 설정되지 않아 품사 태깅 기반의 간이 분석을 보여드려요.",
};

export function AnalysisView({ result }: { result: AnalysisResult }) {
  const level = useLocalStore(levelStore);
  const saved = useLocalStore(sentenceBook).some((r) => r.sentence === result.sentence);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const flash = (message: string) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 1800);
  };

  const copy = async () => {
    await navigator.clipboard.writeText([result.sentence, result.translation].filter(Boolean).join("\n"));
    flash("복사했어요!");
  };

  const iconButton = "grid size-11 place-items-center rounded-full transition hover:bg-secondary";

  return (
    <article>
      <div className="mt-8 mb-7 flex items-center justify-between">
        <Link href="/" aria-label="뒤로" className={iconButton}>
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex gap-2">
          <button onClick={copy} aria-label="문장 복사" className={iconButton}>
            <Copy className="size-5" />
          </button>
          <button
            onClick={() => flash(toggleSentence(result) ? "문장장에 담았어요" : "문장장에서 뺐어요")}
            aria-label={saved ? "문장장에서 빼기" : "문장장에 담기"}
            aria-pressed={saved}
            className={iconButton}
          >
            <Bookmark className="size-5" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <p className="mb-2.5 text-sm font-bold text-muted-foreground" aria-live="polite">
        {notice ?? "문장 분석 완료"}
      </p>
      <h1 className="mb-3.5 text-2xl @md:text-[28px] leading-snug font-bold break-words">{result.sentence}</h1>
      {result.translation && <p className="mb-8 text-lg text-muted-foreground">{result.translation}</p>}
      {SOURCE_NOTE[result.source] && (
        <p className="mb-6 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">{SOURCE_NOTE[result.source]}</p>
      )}

      <LevelTabs level={level} />
      <LevelSections level={level} result={result} />

      <Link
        href="/"
        className="mt-7 flex w-full items-center justify-center rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90"
      >
        다시 분석하기
      </Link>
    </article>
  );
}
