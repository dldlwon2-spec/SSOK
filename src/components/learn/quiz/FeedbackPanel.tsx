"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Bookmark, CircleCheck, CircleX } from "lucide-react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { correctAnswerText, describeResponse } from "@/lib/curriculum/quiz";
import type { QuizQuestion, QuizResponse } from "@/lib/curriculum/quiz/types";
import { reviewStore, toggleReviewBookmark } from "@/lib/storage/learn-quiz";

interface FeedbackPanelProps {
  question: QuizQuestion;
  response: QuizResponse;
  correct: boolean;
  mode: "stage" | "review";
  isLast: boolean;
  onNext: () => void;
  /** Overrides the default 정답/오답 heading (e.g. 시간 초과). */
  headline?: string;
}

export function FeedbackPanel({ question, response, correct, mode, isLast, onNext, headline }: FeedbackPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bookmarked = !!useLocalStore(reviewStore)[question.id]?.bookmarked;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const saveNote = correct
    ? mode === "review"
      ? "다시 맞혔어요! 오답 노트에서 ‘복습 완료’로 옮겼어요."
      : null
    : "틀린 문제는 오답 노트에 자동으로 저장했어요.";

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className={`mt-4 scroll-mb-28 rounded-[22px] border px-5 py-4 ${
        correct ? "border-part-verb bg-part-verb/25" : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-lg font-bold">
          {correct ? <CircleCheck className="size-6" /> : <CircleX className="size-6 text-destructive" />}
          {headline ?? (correct ? "정답이에요!" : "아쉬워요, 다시 확인해 봐요.")}
        </p>
        <button
          onClick={() => toggleReviewBookmark(question.id)}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? "북마크 해제" : "북마크"}
          className="grid size-11 flex-none place-items-center rounded-full transition hover:bg-card"
        >
          <Bookmark className="size-5" fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <dl className="grid gap-1.5 text-[15px]">
        <div>
          <dt className="inline font-bold">정답 </dt>
          <dd className="inline">{correctAnswerText(question)}</dd>
        </div>
        {!correct && (
          <div className="text-muted-foreground">
            <dt className="inline font-bold">내 답 </dt>
            <dd className="inline">{describeResponse(question, response)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 rounded-2xl bg-card px-4 py-3">
        <p className="mb-1 text-sm font-bold">왜 그럴까요? · {question.skill}</p>
        <p className="text-muted-foreground">{question.explanation}</p>
      </div>

      {saveNote && <p className="mt-2 text-xs font-bold text-muted-foreground">{saveNote}</p>}

      <button
        onClick={onNext}
        autoFocus
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90"
      >
        {isLast ? "결과 보기" : "다음 문제"}
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
