"use client";

import type { BlankQuestion } from "@/lib/curriculum/quiz/types";

interface BlankQuestionViewProps {
  question: BlankQuestion;
  choice: string | null;
  submitted: boolean;
  onChoose: (choice: string) => void;
}

export function BlankQuestionView({ question, choice, submitted, onChoose }: BlankQuestionViewProps) {
  const correct = choice === question.answer;
  const slot = !choice
    ? "border-input text-transparent"
    : !submitted
      ? "border-foreground"
      : correct
        ? "border-part-verb bg-part-verb/50"
        : "border-destructive/60 bg-destructive/10 line-through";

  return (
    <div>
      <p className="rounded-2xl bg-background px-4 py-4 text-lg leading-loose @sm:text-xl">
        {question.before}
        <span className={`mx-0.5 inline-block min-w-24 rounded-lg border-b-2 px-2 text-center font-bold transition ${slot}`}>
          {choice ?? "____"}
        </span>
        {question.after}
      </p>
      <p className="mt-2 px-1 text-sm text-muted-foreground">뜻: {question.translation}</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {question.options.map((option) => {
          const state = !submitted
            ? choice === option
              ? "border-foreground bg-primary text-primary-foreground"
              : "border-border hover:border-input"
            : option === question.answer
              ? "border-part-verb bg-part-verb/50"
              : option === choice
                ? "border-destructive/50 bg-destructive/10"
                : "border-border opacity-50";
          return (
            <button
              key={option}
              onClick={() => onChoose(option)}
              disabled={submitted}
              aria-pressed={choice === option}
              className={`min-h-12 rounded-2xl border px-3 py-3 text-base transition @sm:text-lg ${state}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
