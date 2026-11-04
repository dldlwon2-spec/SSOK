"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles, X, Zap } from "lucide-react";
import { FeedbackPanel } from "@/components/learn/quiz/FeedbackPanel";
import { QuestionBody } from "@/components/learn/quiz/questions/QuestionBody";
import { STAGES } from "@/lib/curriculum";
import { xpForCombo } from "@/lib/curriculum/games";
import { describeResponse, emptyResponse, grade, isComplete, questionPrompt, QUIZ_TYPE_LABELS } from "@/lib/curriculum/quiz";
import type { QuizResponse } from "@/lib/curriculum/quiz/types";
import { buildSurvivalDeck, extraRound, SURVIVAL_HEARTS, survivalPoints, timeLimitMs, type SurvivalCard } from "@/lib/curriculum/survival";
import { LEARNER_LEVELS, type LearnerLevel } from "@/lib/learning/levels";
import { recordSurvivalRun, type GameRunResult } from "@/lib/storage/game-progress";
import { recordWrongAnswer } from "@/lib/storage/learn-quiz";
import { SurvivalGameOver } from "./SurvivalGameOver";
import { SurvivalHud } from "./SurvivalHud";

type Phase = "answering" | "correct" | "wrong";

export interface SurvivalStats {
  score: number;
  answered: number;
  correct: number;
  maxCombo: number;
  xp: number;
  reached: LearnerLevel;
}

const CORRECT_PAUSE_MS = 900;

export function SurvivalSession({ startLevel, onExit }: { startLevel: LearnerLevel; onExit: () => void }) {
  const [deck, setDeck] = useState<SurvivalCard[]>(() => buildSurvivalDeck(startLevel));
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<QuizResponse>(() => emptyResponse(deck[0].question));
  const [phase, setPhase] = useState<Phase>("answering");
  const [deadline, setDeadline] = useState(() => Date.now() + timeLimitMs(deck[0].question));
  const [now, setNow] = useState(() => Date.now());
  /** Time left when the answer was resolved, frozen for the HUD while paused. */
  const [frozenMs, setFrozenMs] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [hearts, setHearts] = useState(SURVIVAL_HEARTS);
  const [hitKey, setHitKey] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [stageNotice, setStageNotice] = useState<LearnerLevel | null>(null);
  const [stats, setStats] = useState<SurvivalStats>({ score: 0, answered: 0, correct: 0, maxCombo: 0, xp: 0, reached: startLevel });
  const [result, setResult] = useState<GameRunResult | null>(null);

  const card = deck[index];
  const limit = timeLimitMs(card.question);
  const remaining = frozenMs ?? Math.max(0, deadline - now);

  const resolve = useCallback(
    (correct: boolean, isTimeout = false) => {
      const left = Math.max(0, deadline - Date.now());
      setFrozenMs(left);
      if (correct) {
        const nextCombo = combo + 1;
        const points = survivalPoints(left, nextCombo);
        setCombo(nextCombo);
        setLastPoints(points);
        setStats((s) => ({
          ...s,
          score: s.score + points,
          answered: s.answered + 1,
          correct: s.correct + 1,
          maxCombo: Math.max(s.maxCombo, nextCombo),
          xp: s.xp + xpForCombo(nextCombo),
        }));
        setPhase("correct");
      } else {
        setCombo(0);
        setHearts((h) => h - 1);
        setHitKey((k) => k + 1);
        setTimedOut(isTimeout);
        setStats((s) => ({ ...s, answered: s.answered + 1 }));
        const answer = describeResponse(card.question, response);
        recordWrongAnswer(card.question.id, isTimeout ? `(시간 초과) ${answer}`.trim() : answer);
        setPhase("wrong");
      }
    },
    [card, combo, deadline, response],
  );

  // Ticking clock while answering; a timeout counts as a wrong answer.
  useEffect(() => {
    if (phase !== "answering") return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "answering" && deadline - now <= 0) resolve(false, true);
  }, [deadline, now, phase, resolve]);

  const finish = useCallback(() => {
    const run = recordSurvivalRun(startLevel, {
      score: stats.score,
      answered: stats.answered,
      correct: stats.correct,
      maxCombo: stats.maxCombo,
      xp: stats.xp,
    });
    setResult(run);
    window.scrollTo({ top: 0 });
  }, [startLevel, stats]);

  const advance = useCallback(() => {
    let nextDeck = deck;
    if (index + 1 >= deck.length) {
      nextDeck = [...deck, ...extraRound()];
      setDeck(nextDeck);
    }
    const next = nextDeck[index + 1];
    if (next.level !== card.level) {
      setStageNotice(next.level);
      setTimeout(() => setStageNotice(null), 1800);
    }
    setStats((s) =>
      LEARNER_LEVELS.indexOf(next.level) > LEARNER_LEVELS.indexOf(s.reached) ? { ...s, reached: next.level } : s,
    );
    setIndex(index + 1);
    setResponse(emptyResponse(next.question));
    setDeadline(Date.now() + timeLimitMs(next.question));
    setNow(Date.now());
    setFrozenMs(null);
    setTimedOut(false);
    setPhase("answering");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [card.level, deck, index]);

  useEffect(() => {
    if (phase !== "correct") return;
    const id = setTimeout(advance, CORRECT_PAUSE_MS);
    return () => clearTimeout(id);
  }, [phase, advance]);

  const restart = () => {
    const fresh = buildSurvivalDeck(startLevel);
    setDeck(fresh);
    setIndex(0);
    setResponse(emptyResponse(fresh[0].question));
    setDeadline(Date.now() + timeLimitMs(fresh[0].question));
    setNow(Date.now());
    setFrozenMs(null);
    setTimedOut(false);
    setHearts(SURVIVAL_HEARTS);
    setHitKey(0);
    setCombo(0);
    setStats({ score: 0, answered: 0, correct: 0, maxCombo: 0, xp: 0, reached: startLevel });
    setResult(null);
    setPhase("answering");
  };

  if (result) {
    return <SurvivalGameOver startLevel={startLevel} stats={stats} run={result} onRetry={restart} onExit={onExit} />;
  }

  return (
    <article>
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">타임어택 서바이벌</h1>
        <button
          onClick={() => (stats.answered > 0 ? finish() : onExit())}
          className="inline-flex items-center gap-1 min-h-11 rounded-full px-3 text-sm text-muted-foreground transition hover:bg-secondary"
        >
          <X className="size-4" />
          그만하기
        </button>
      </div>

      <SurvivalHud
        hearts={hearts}
        score={stats.score}
        combo={combo}
        remainingMs={remaining}
        limitMs={limit}
        level={card.level}
        paused={phase !== "answering"}
        hitKey={hitKey}
      />

      {stageNotice && (
        <p className="mt-3 flex animate-pop items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 font-bold text-primary-foreground">
          <Sparkles className="size-4" />
          {STAGES[stageNotice].name} 진입! 문제가 더 어려워져요.
        </p>
      )}

      <section
        key={index}
        className={`relative mt-4 rounded-3xl @md:rounded-[28px] border bg-card p-4 shadow-card transition-colors @sm:p-5 @md:p-7 ${
          phase === "correct" ? "border-part-verb" : phase === "wrong" ? "animate-shake border-destructive/40" : "animate-fade-up border-border"
        }`}
      >
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
            {QUIZ_TYPE_LABELS[card.question.type]}
          </span>
          <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-muted-foreground"># {card.question.skill}</span>
          <span className="ml-auto text-xs font-bold text-muted-foreground">{stats.answered + (phase === "answering" ? 1 : 0)}번째 문제</span>
        </div>
        <h2 className="mb-4 text-lg font-bold">{questionPrompt(card.question)}</h2>

        <QuestionBody card={card} response={response} submitted={phase !== "answering"} onChange={setResponse} />

        {phase === "answering" && (
          <button
            onClick={() => resolve(grade(card.question, response))}
            disabled={!isComplete(card.question, response)}
            className="mt-5 w-full rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            정답 확인
          </button>
        )}

        {phase === "correct" && (
          <div className="mt-5 flex animate-pop items-center justify-center gap-3 rounded-2xl bg-part-verb/40 px-4 py-3 font-bold" role="status">
            정답! +{lastPoints}점
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-sm text-primary-foreground">
              <Zap className="size-3.5 fill-current" />+{xpForCombo(combo)} XP
            </span>
          </div>
        )}

        {phase === "wrong" && (
          <FeedbackPanel
            question={card.question}
            response={response}
            correct={false}
            mode="stage"
            headline={
              hearts <= 0
                ? `${timedOut ? "시간 초과" : "오답"}! 하트를 모두 잃었어요.`
                : timedOut
                  ? `시간 초과! 하트 ${hearts}개 남았어요.`
                  : `오답! 하트 ${hearts}개 남았어요.`
            }
            isLast={hearts <= 0}
            onNext={hearts <= 0 ? finish : advance}
          />
        )}
      </section>
    </article>
  );
}
