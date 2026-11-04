"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Flame, Zap } from "lucide-react";
import { FeedbackPanel } from "@/components/learn/quiz/FeedbackPanel";
import type { QuizQuestion, QuizResponse } from "@/lib/curriculum/quiz/types";

interface AnswerModalProps {
  question: QuizQuestion;
  response: QuizResponse;
  correct: boolean;
  xpGained: number;
  combo: number;
  isLast: boolean;
  onNext: () => void;
}

/** 정답·해설 팝업. A fixed overlay (not <dialog>) so closing never depends on async dialog events. */
export function AnswerModal({ question, response, correct, xpGained, combo, isLast, onNext }: AnswerModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onNext();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNext]);

  // Portal to <body>: the animated <main> has a transform, which would otherwise trap this fixed overlay inside it.
  return createPortal(
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-[2px] sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={correct ? "정답 해설" : "오답 해설"}
        className="max-h-[85dvh] w-full max-w-md animate-pop overflow-y-auto rounded-3xl border border-border bg-card p-4 shadow-card sm:rounded-[28px] sm:p-6"
      >
        {correct && (
          <div className="mb-1 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1 font-bold text-primary-foreground">
              <Zap className="size-4 fill-current" />+{xpGained} XP
            </span>
            {combo >= 2 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-part-complement px-3 py-1 text-sm font-bold">
                <Flame className="size-4" />
                {combo} 콤보
              </span>
            )}
          </div>
        )}
        <FeedbackPanel question={question} response={response} correct={correct} mode="stage" isLast={isLast} onNext={onNext} />
      </div>
    </div>,
    document.body,
  );
}
