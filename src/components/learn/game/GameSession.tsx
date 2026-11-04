"use client";

import { useCallback, useState } from "react";
import { Flame, X, Zap } from "lucide-react";
import { QuizProgress } from "@/components/learn/quiz/QuizProgress";
import { QuestionBody } from "@/components/learn/quiz/questions/QuestionBody";
import { useLocalStore } from "@/hooks/useLocalStore";
import { gameKey, GAMES, PERFECT_BONUS, xpForCombo, type GameType } from "@/lib/curriculum/games";
import { describeResponse, emptyResponse, grade, isComplete, prepareDeck, questionPrompt, type DeckCard } from "@/lib/curriculum/quiz";
import type { QuizQuestion, QuizResponse } from "@/lib/curriculum/quiz/types";
import type { LearnerLevel } from "@/lib/learning/levels";
import { gameProgressStore, recordGameRun, type GameRunResult } from "@/lib/storage/game-progress";
import { recordWrongAnswer } from "@/lib/storage/learn-quiz";
import { AnswerModal } from "./AnswerModal";
import { GameResult } from "./GameResult";
import { XpBar } from "./XpBar";

interface GameSessionProps {
  type: GameType;
  level: LearnerLevel;
  questions: QuizQuestion[];
  onExit: () => void;
}

interface Feedback {
  correct: boolean;
  xp: number;
}

export function GameSession({ type, level, questions, onExit }: GameSessionProps) {
  const totalXp = useLocalStore(gameProgressStore).totalXp;
  const [deck, setDeck] = useState<DeckCard[]>(() => prepareDeck(questions));
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<QuizResponse>(() => emptyResponse(deck[0].question));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  /** Bumped on every correct answer so the floating "+XP" animation replays. */
  const [burst, setBurst] = useState(0);
  const [finish, setFinish] = useState<{ run: GameRunResult; bonus: number } | null>(null);

  const card = deck[index];

  const restart = () => {
    const next = prepareDeck(questions);
    setDeck(next);
    setIndex(0);
    setResponse(emptyResponse(next[0].question));
    setFeedback(null);
    setResults([]);
    setCombo(0);
    setMaxCombo(0);
    setSessionXp(0);
    setFinish(null);
    window.scrollTo({ top: 0 });
  };

  const submit = () => {
    const correct = grade(card.question, response);
    const nextCombo = correct ? combo + 1 : 0;
    const xp = correct ? xpForCombo(nextCombo) : 0;
    setResults((r) => [...r, correct]);
    setCombo(nextCombo);
    setMaxCombo((m) => Math.max(m, nextCombo));
    setSessionXp((s) => s + xp);
    if (correct) setBurst((b) => b + 1);
    else recordWrongAnswer(card.question.id, describeResponse(card.question, response));
    setFeedback({ correct, xp });
  };

  const next = useCallback(() => {
    setFeedback(null);
    const nextIndex = index + 1;
    if (nextIndex < deck.length) {
      setIndex(nextIndex);
      setResponse(emptyResponse(deck[nextIndex].question));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const score = results.filter(Boolean).length;
    const bonus = score === deck.length ? PERFECT_BONUS : 0;
    const run = recordGameRun(gameKey(level, type), { score, total: deck.length, xp: sessionXp + bonus, maxCombo });
    setSessionXp((s) => s + bonus);
    setFinish({ run, bonus });
    setIndex(nextIndex);
    window.scrollTo({ top: 0 });
  }, [deck, index, level, maxCombo, results, sessionXp, type]);

  return (
    <article>
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{GAMES[type].title}</h1>
        <button
          onClick={onExit}
          aria-label="게임 그만하기"
          className="inline-flex items-center gap-1 min-h-11 rounded-full px-3 text-sm text-muted-foreground transition hover:bg-secondary"
        >
          <X className="size-4" />
          그만하기
        </button>
      </div>

      {finish ? (
        <GameResult
          score={results.filter(Boolean).length}
          total={deck.length}
          xp={sessionXp}
          perfectBonus={finish.bonus}
          maxCombo={maxCombo}
          run={finish.run}
          onRetry={restart}
        />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-[1fr_auto] items-end gap-3">
            <XpBar totalXp={totalXp + sessionXp} compact />
            <div className="relative flex gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                <Zap className="size-3.5 fill-current" />
                {sessionXp}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-bold transition ${
                  combo >= 2 ? "bg-part-complement" : "bg-secondary text-muted-foreground"
                }`}
              >
                <Flame className="size-3.5" />
                {combo}
              </span>
              {burst > 0 && feedback?.correct && (
                <span
                  key={burst}
                  aria-hidden
                  className="pointer-events-none absolute -top-2 left-1/4 animate-float-up rounded-full bg-part-verb px-2.5 py-0.5 text-sm font-bold whitespace-nowrap"
                >
                  +{feedback.xp} XP
                </span>
              )}
            </div>
          </div>

          <QuizProgress total={deck.length} current={index} results={results} />

          <section
            key={`${card.question.id}-${index}`}
            className={`mt-5 rounded-3xl @md:rounded-[28px] border bg-card p-4 shadow-card transition-colors @sm:p-5 @md:p-7 ${
              feedback ? (feedback.correct ? "border-part-verb" : "animate-shake border-destructive/40") : "animate-fade-up border-border"
            }`}
          >
            <p className="mb-3 inline-block rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-muted-foreground"># {card.question.skill}</p>
            <h2 className="mb-4 text-lg font-bold">{questionPrompt(card.question)}</h2>

            <QuestionBody card={card} response={response} submitted={!!feedback} onChange={setResponse} />

            {!feedback && (
              <button
                onClick={submit}
                disabled={!isComplete(card.question, response)}
                className="mt-5 w-full rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
              >
                정답 확인
              </button>
            )}
          </section>

          {feedback && (
            <AnswerModal
              question={card.question}
              response={response}
              correct={feedback.correct}
              xpGained={feedback.xp}
              combo={combo}
              isLast={index === deck.length - 1}
              onNext={next}
            />
          )}
        </>
      )}
    </article>
  );
}
