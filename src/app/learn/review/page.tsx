"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { PageHeading } from "@/components/history/SavedList";
import { LearnTabs } from "@/components/learn/LearnTabs";
import { QuizSession } from "@/components/learn/quiz/QuizSession";
import { ReviewEntryCard } from "@/components/learn/review/ReviewEntryCard";
import { useLocalStore } from "@/hooks/useLocalStore";
import { getQuizQuestion } from "@/lib/curriculum/quiz";
import type { QuizQuestion } from "@/lib/curriculum/quiz/types";
import { needsReview, reviewStore, type ReviewEntry } from "@/lib/storage/learn-quiz";

type Filter = "todo" | "bookmarked" | "mastered";

const FILTERS: { id: Filter; label: string; match: (e: ReviewEntry) => boolean; empty: string }[] = [
  { id: "todo", label: "복습 필요", match: needsReview, empty: "복습할 오답이 없어요. 단계 퀴즈에 도전해 보세요!" },
  { id: "bookmarked", label: "북마크", match: (e) => e.bookmarked, empty: "북마크한 문제가 없어요. 퀴즈 해설에서 책갈피를 눌러 보세요." },
  { id: "mastered", label: "복습 완료", match: (e) => e.mastered, empty: "오답을 다시 맞히면 여기에 모여요." },
];

export default function LearnReviewPage() {
  const entries = useLocalStore(reviewStore);
  const [filter, setFilter] = useState<Filter>("todo");
  const [session, setSession] = useState<QuizQuestion[] | null>(null);

  const all = Object.entries(entries)
    .flatMap(([id, entry]) => {
      const found = getQuizQuestion(id);
      return found ? [{ ...found, entry }] : [];
    })
    .sort((a, b) => b.entry.updatedAt.localeCompare(a.entry.updatedAt));

  const current = FILTERS.find((f) => f.id === filter)!;
  const items = all.filter((item) => current.match(item.entry));

  if (session) {
    return <QuizSession title="오답 복습" questions={session} mode="review" onExit={() => setSession(null)} />;
  }

  return (
    <section>
      <PageHeading title="수준별 학습" description="틀린 문제와 북마크한 문제를 모아 다시 풀어 봐요." />
      <LearnTabs active="review" />

      <div className="mb-4 flex rounded-full bg-secondary p-1" role="tablist" aria-label="오답 노트 필터">
        {FILTERS.map((f) => {
          const count = all.filter((item) => f.match(item.entry)).length;
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-11 flex-1 rounded-full text-sm font-bold transition ${
                filter === f.id ? "bg-card shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label} <span className="font-normal">{count}</span>
            </button>
          );
        })}
      </div>

      {items.length > 0 && filter !== "mastered" && (
        <button
          onClick={() => {
            setSession(items.map((item) => item.question));
            window.scrollTo({ top: 0 });
          }}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90"
        >
          <RotateCcw className="size-4" />
          {current.label} {items.length}문제 다시 풀기
        </button>
      )}

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-input px-5 py-14 text-center text-muted-foreground">
          <p className="font-pen text-3xl text-foreground">깨끗해요!</p>
          <p className="mb-4">{current.empty}</p>
          <Link href="/learn/quiz" className="text-sm font-bold text-foreground underline">
            단계 퀴즈 풀러 가기
          </Link>
        </div>
      ) : (
        <ul className="grid gap-2.5">
          {items.map((item) => (
            <ReviewEntryCard key={item.question.id} question={item.question} level={item.level} entry={item.entry} />
          ))}
        </ul>
      )}
    </section>
  );
}
