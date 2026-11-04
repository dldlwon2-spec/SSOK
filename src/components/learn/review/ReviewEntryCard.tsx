"use client";

import Link from "next/link";
import { Bookmark, X } from "lucide-react";
import { STAGE_SHORT_NAMES } from "@/lib/curriculum";
import { correctAnswerText, questionPreview, QUIZ_TYPE_LABELS } from "@/lib/curriculum/quiz";
import type { QuizQuestion } from "@/lib/curriculum/quiz/types";
import type { LearnerLevel } from "@/lib/learning/levels";
import { removeReviewEntry, toggleReviewBookmark, type ReviewEntry } from "@/lib/storage/learn-quiz";

interface ReviewEntryCardProps {
  question: QuizQuestion;
  level: LearnerLevel;
  entry: ReviewEntry;
}

export function ReviewEntryCard({ question, level, entry }: ReviewEntryCardProps) {
  const badge = "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground";

  return (
    <li className="relative rounded-[18px] border border-border bg-card px-5 py-4 pr-24 shadow-soft">
      <p className="mb-1.5 flex flex-wrap gap-1.5">
        <span className={badge}>{STAGE_SHORT_NAMES[level]}</span>
        <span className={badge}>{QUIZ_TYPE_LABELS[question.type]}</span>
        {entry.mastered && <span className="rounded-full bg-part-verb px-2.5 py-0.5 text-xs font-bold">복습 완료</span>}
      </p>
      <p className="font-bold">{question.skill}</p>
      <p className="mt-0.5 text-[15px]">{questionPreview(question)}</p>
      {entry.wrongCount > 0 && (
        <p className="mt-1 text-xs font-bold text-muted-foreground">
          틀린 횟수 {entry.wrongCount}회 · 내 답: <span className="font-normal">{entry.lastResponse}</span>
        </p>
      )}

      <details className="mt-3 rounded-2xl bg-background px-4 py-2.5 [&[open]>summary]:mb-2">
        <summary className="cursor-pointer text-sm font-bold">정답과 해설 보기</summary>
        <p className="text-sm">
          <strong>정답</strong> {correctAnswerText(question)}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{question.explanation}</p>
        {question.exerciseId && (
          <Link href={`/learn/${question.exerciseId}`} className="mt-2 inline-block text-sm font-bold underline">
            관련 문장 다시 학습하기
          </Link>
        )}
      </details>

      <div className="absolute top-3 right-3 flex">
        <button
          onClick={() => toggleReviewBookmark(question.id)}
          aria-pressed={entry.bookmarked}
          aria-label={entry.bookmarked ? "북마크 해제" : "북마크"}
          className="grid size-11 place-items-center rounded-full transition hover:bg-secondary"
        >
          <Bookmark className="size-4" fill={entry.bookmarked ? "currentColor" : "none"} />
        </button>
        <button
          onClick={() => removeReviewEntry(question.id)}
          aria-label="오답 노트에서 삭제"
          className="grid size-11 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary"
        >
          <X className="size-4" />
        </button>
      </div>
    </li>
  );
}
