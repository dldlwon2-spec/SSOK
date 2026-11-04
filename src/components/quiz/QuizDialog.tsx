"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { LEVEL_INFO } from "@/lib/learning/levels";
import { buildQuiz, QUIZ_KIND_LABELS, type QuizQuestion } from "@/lib/learning/quiz";
import { recentStore } from "@/lib/storage/history";
import { sentenceBook, wordBook } from "@/lib/storage/notebook";
import { levelStore } from "@/lib/storage/preferences";
import { recordQuizAnswer } from "@/lib/storage/quiz-stats";

interface QuizDialogProps {
  open: boolean;
  onClose: () => void;
}

export function QuizDialog({ open, onClose }: QuizDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const level = useLocalStore(levelStore);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);

  const start = useCallback(() => {
    setQuestions(
      buildQuiz({
        sentences: sentenceBook.get(),
        words: wordBook.get(),
        distractorSource: recentStore.get(),
        level: levelStore.get(),
      }),
    );
    setIndex(0);
    setPicked(null);
    setResults([]);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      start();
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, start]);

  // Report the close directly; the native "close" event is async and not guaranteed to arrive (e.g. hidden tabs).
  const close = () => {
    dialogRef.current?.close();
    onClose();
  };

  const question = questions[index];
  const finished = questions.length > 0 && index >= questions.length;

  const choose = (option: number) => {
    if (picked !== null || !question) return;
    const correct = option === question.answer;
    setPicked(option);
    setResults((r) => [...r, correct]);
    if (question.sentence) recordQuizAnswer(question.sentence, correct);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setPicked(null);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && close()}
      aria-label="복습 퀴즈"
      className="m-auto max-h-[calc(100dvh-32px)] w-[min(440px,calc(100%-24px))] rounded-3xl @md:rounded-[28px] border border-border bg-card p-5 text-foreground shadow-card backdrop:bg-black/30 backdrop:backdrop-blur-[2px] @md:p-7"
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          복습 퀴즈
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">{LEVEL_INFO[level].short}</span>
        </h2>
        <button onClick={close} aria-label="닫기" className="grid size-11 place-items-center rounded-full hover:bg-secondary">
          <X className="size-5" />
        </button>
      </div>

      {questions.length === 0 && (
        <div className="py-8 text-center">
          <p className="font-pen text-3xl">아직 복습할 게 없어요</p>
          <p className="mt-2 text-muted-foreground">
            분석 결과에서 책갈피를 눌러 문장장에 문장을 담거나, 단어를 단어장에 담아 보세요.
          </p>
        </div>
      )}

      {question && !finished && (
        <QuestionView
          question={question}
          number={index + 1}
          total={questions.length}
          picked={picked}
          onChoose={choose}
          onNext={next}
        />
      )}

      {finished && (
        <QuizResult
          questions={questions}
          results={results}
          onRetry={start}
          onClose={close}
        />
      )}
    </dialog>
  );
}

interface QuestionViewProps {
  question: QuizQuestion;
  number: number;
  total: number;
  picked: number | null;
  onChoose: (option: number) => void;
  onNext: () => void;
}

function QuestionView({ question, number, total, picked, onChoose, onNext }: QuestionViewProps) {
  const answered = picked !== null;
  const correct = picked === question.answer;

  return (
    <div>
      <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(number / total) * 100}%` }} />
      </div>
      <p className="mb-2 text-sm font-bold text-muted-foreground">
        {number} / {total} · {QUIZ_KIND_LABELS[question.kind]}
      </p>
      {question.context && (
        <p className="mb-4 rounded-2xl bg-background px-4 py-3 text-lg leading-relaxed">
          <Highlighted text={question.context} highlight={question.highlight} />
        </p>
      )}
      <h3 className="mb-4 text-[17px] font-bold">{question.prompt}</h3>

      <ul className="grid gap-2">
        {question.options.map((option, i) => {
          const isAnswer = i === question.answer;
          const state = !answered
            ? "border-border hover:border-input"
            : isAnswer
              ? "border-part-verb bg-part-verb/40"
              : i === picked
                ? "border-destructive/50 bg-destructive/10"
                : "border-border opacity-60";
          return (
            <li key={i}>
              <button
                onClick={() => onChoose(i)}
                disabled={answered}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${state}`}
              >
                <span className="flex-1">{option}</span>
                {answered && isAnswer && <Check className="size-5" />}
                {answered && i === picked && !isAnswer && <X className="size-5 text-destructive" />}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div className="mt-4">
          <div className="rounded-2xl bg-accent px-4 py-3">
            <p className="mb-1 font-bold">{correct ? "정답이에요!" : "아쉬워요, 다시 확인해 봐요."}</p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
          <button
            onClick={onNext}
            autoFocus
            className="mt-4 w-full rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90"
          >
            {number === total ? "결과 보기" : "다음 문제"}
          </button>
        </div>
      )}
    </div>
  );
}

function Highlighted({ text, highlight }: { text: string; highlight: string | null }) {
  const needle = highlight?.replace(/[.,!?]+$/, "");
  const start = needle ? text.toLowerCase().indexOf(needle.toLowerCase()) : -1;
  if (!needle || start === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-md bg-part-subject px-1 text-foreground">{text.slice(start, start + needle.length)}</mark>
      {text.slice(start + needle.length)}
    </>
  );
}

interface QuizResultProps {
  questions: QuizQuestion[];
  results: boolean[];
  onRetry: () => void;
  onClose: () => void;
}

function QuizResult({ questions, results, onRetry, onClose }: QuizResultProps) {
  const score = results.filter(Boolean).length;
  const missed = [
    ...new Set(questions.filter((q, i) => !results[i] && q.sentence).map((q) => q.sentence as string)),
  ];
  const message =
    score === questions.length ? "완벽해요! 구조가 쏙 들어왔네요." : score >= questions.length / 2 ? "좋아요! 틀린 문장만 한 번 더 봐요." : "괜찮아요. 분석을 다시 보며 복습해 봐요.";

  return (
    <div className="text-center">
      <p className="font-pen text-6xl">
        {score} / {questions.length}
      </p>
      <p className="mt-2 mb-6 text-muted-foreground">{message}</p>

      {missed.length > 0 && (
        <div className="mb-6 text-left">
          <p className="mb-2 text-sm font-bold text-muted-foreground">다시 볼 문장</p>
          <ul className="grid gap-2">
            {missed.map((sentence) => (
              <li key={sentence}>
                <Link
                  href={`/analyze?q=${encodeURIComponent(sentence)}`}
                  onClick={onClose}
                  className="block rounded-2xl border border-border px-4 py-3 transition hover:border-input"
                >
                  {sentence}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2.5">
        <button onClick={onClose} className="flex-1 rounded-2xl border border-border bg-card px-5 py-3.5 font-bold">
          닫기
        </button>
        <button onClick={onRetry} className="flex-1 rounded-2xl bg-primary px-5 py-3.5 font-bold text-primary-foreground shadow-ink">
          다시 풀기
        </button>
      </div>
    </div>
  );
}
