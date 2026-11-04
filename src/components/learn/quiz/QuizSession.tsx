"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  describeResponse,
  emptyResponse,
  grade,
  isComplete,
  prepareDeck,
  questionPrompt,
  QUIZ_TYPE_LABELS,
  type DeckCard,
} from "@/lib/curriculum/quiz";
import type { QuizQuestion, QuizResponse } from "@/lib/curriculum/quiz/types";
import { markMastered, recordWrongAnswer } from "@/lib/storage/learn-quiz";
import { FeedbackPanel } from "./FeedbackPanel";
import { QuizProgress } from "./QuizProgress";
import { QuizResultView } from "./QuizResultView";
import { QuestionBody } from "./questions/QuestionBody";

interface QuizSessionProps {
  title: string;
  questions: QuizQuestion[];
  /** stage: 단계 퀴즈, review: 오답 노트 복습 (다시 맞히면 복습 완료 처리) */
  mode: "stage" | "review";
  onExit: () => void;
  /** Called once when the result screen opens; return true if it is a new best score. */
  onFinish?: (score: number, total: number) => boolean;
}

export function QuizSession({ title, questions, mode, onExit, onFinish }: QuizSessionProps) {
  const [deck, setDeck] = useState<DeckCard[]>(() => prepareDeck(questions));
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<QuizResponse>(() => emptyResponse(deck[0].question));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [isBest, setIsBest] = useState(false);

  const finished = index >= deck.length;
  const card = deck[index];

  const restart = () => {
    const next = prepareDeck(questions);
    setDeck(next);
    setIndex(0);
    setResponse(emptyResponse(next[0].question));
    setSubmitted(false);
    setResults([]);
    setIsBest(false);
    window.scrollTo({ top: 0 });
  };

  const submit = () => {
    const correct = grade(card.question, response);
    setSubmitted(true);
    setResults((r) => [...r, correct]);
    if (!correct) recordWrongAnswer(card.question.id, describeResponse(card.question, response));
    else if (mode === "review") markMastered(card.question.id);
  };

  const next = () => {
    const nextIndex = index + 1;
    if (nextIndex >= deck.length) {
      const score = results.filter(Boolean).length;
      setIsBest(onFinish?.(score, deck.length) ?? false);
    } else {
      setResponse(emptyResponse(deck[nextIndex].question));
    }
    setIndex(nextIndex);
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <article>
      <div className="mt-8 mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={onExit}
          aria-label="퀴즈 그만하기"
          className="inline-flex items-center gap-1 min-h-11 rounded-full px-3 text-sm text-muted-foreground transition hover:bg-secondary"
        >
          <X className="size-4" />
          그만하기
        </button>
      </div>

      <QuizProgress total={deck.length} current={index} results={results} />

      {finished ? (
        <QuizResultView
          questions={deck.map((d) => d.question)}
          results={results}
          mode={mode}
          isBest={isBest}
          onRetry={restart}
          onExit={onExit}
        />
      ) : (
        <section key={card.question.id} className="mt-5 animate-fade-up rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 shadow-card @sm:p-5 @md:p-7">
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
              {QUIZ_TYPE_LABELS[card.question.type]}
            </span>
            <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-muted-foreground"># {card.question.skill}</span>
          </div>
          <h2 className="mb-4 text-lg font-bold">{questionPrompt(card.question)}</h2>

          <QuestionBody card={card} response={response} submitted={submitted} onChange={setResponse} />

          {!submitted ? (
            <button
              onClick={submit}
              disabled={!isComplete(card.question, response)}
              className="mt-5 w-full rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
            >
              제출하기
            </button>
          ) : (
            <FeedbackPanel
              question={card.question}
              response={response}
              correct={results[results.length - 1]}
              mode={mode}
              isLast={index === deck.length - 1}
              onNext={next}
            />
          )}
        </section>
      )}
    </article>
  );
}
