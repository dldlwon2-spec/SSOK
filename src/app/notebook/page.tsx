"use client";

import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { PageHeading, SavedList } from "@/components/history/SavedList";
import { WordList } from "@/components/notebook/WordList";
import { QuizLauncher } from "@/components/quiz/QuizLauncher";
import { useLocalStore } from "@/hooks/useLocalStore";
import type { AnalysisResult } from "@/lib/analysis/types";
import { removeSentence, sentenceBook, wordBook } from "@/lib/storage/notebook";
import { quizStatsStore } from "@/lib/storage/quiz-stats";

type Tab = "sentences" | "words";

export default function NotebookPage() {
  const [tab, setTab] = useState<Tab>("sentences");
  const sentences = useLocalStore(sentenceBook);
  const words = useLocalStore(wordBook);
  const stats = useLocalStore(quizStatsStore);

  const statMeta = (item: AnalysisResult) => {
    const s = stats[item.sentence];
    if (!s) return "아직 복습 전";
    return `복습 ${s.attempts}회 · 정답률 ${Math.round((s.correct / s.attempts) * 100)}%`;
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "sentences", label: "문장장", count: sentences.length },
    { id: "words", label: "단어장", count: words.length },
  ];

  return (
    <section>
      <PageHeading title="내 노트" description="어려운 문장과 단어를 모아 두고 복습해요." />

      <QuizLauncher className="mb-7 flex w-full items-center gap-4 rounded-[22px] bg-primary px-5 py-4 text-left text-primary-foreground shadow-ink transition hover:opacity-95">
        <GraduationCap className="size-7 flex-none" />
        <span className="flex-1">
          <span className="block font-bold">복습 퀴즈 풀기</span>
          <span className="block text-sm opacity-75">담아 둔 문장과 단어로 5문제를 만들어 드려요.</span>
        </span>
      </QuizLauncher>

      <div role="tablist" aria-label="노트 종류" className="mb-4 flex gap-5 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px min-h-11 border-b-2 pt-2 pb-2.5 font-bold transition ${
              tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
            }`}
          >
            {t.label} <span className="text-sm font-normal">{t.count}</span>
          </button>
        ))}
      </div>

      {tab === "sentences" ? (
        <SavedList
          items={sentences}
          emptyTitle="문장장이 비어 있어요"
          emptyHint="분석 결과에서 책갈피를 눌러 어려운 문장을 담아 보세요."
          onRemove={removeSentence}
          getMeta={statMeta}
        />
      ) : (
        <WordList words={words} />
      )}
    </section>
  );
}
