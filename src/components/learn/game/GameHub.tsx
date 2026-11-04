"use client";

import Link from "next/link";
import { ArrowRight, Blocks, GraduationCap, Heart, ScanSearch, TextCursorInput, Timer } from "lucide-react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { STAGE_SHORT_NAMES } from "@/lib/curriculum";
import { gameKey, gameQuestions, GAME_TYPES, GAMES, type GameType } from "@/lib/curriculum/games";
import type { LearnerLevel } from "@/lib/learning/levels";
import { gameProgressStore } from "@/lib/storage/game-progress";
import { stageQuizStore } from "@/lib/storage/learn-quiz";
import { XpBar } from "./XpBar";

const ICONS: Record<GameType, typeof Blocks> = {
  unscramble: Blocks,
  tagging: ScanSearch,
  blank: TextCursorInput,
};

/** 단계 하단의 '문법 퀴즈 도전하기 · 미니 게임' 섹션 */
export function GameHub({ level }: { level: LearnerLevel }) {
  const progress = useLocalStore(gameProgressStore);
  const quizRecord = useLocalStore(stageQuizStore)[level];
  const survivalBest = progress.survival[level];

  return (
    <section className="mt-10" aria-labelledby="game-hub-title">
      <h2 id="game-hub-title" className="font-pen text-3xl">
        {STAGE_SHORT_NAMES[level]} 단계 미니 게임
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">문제를 맞힐 때마다 XP가 쌓이고, 연속 정답이면 콤보 보너스가 붙어요.</p>

      <XpBar totalXp={progress.totalXp} />

      <Link
        href="/learn/survival"
        className="mt-3 flex items-center gap-4 rounded-[22px] bg-primary px-5 py-5 text-primary-foreground shadow-ink transition hover:-translate-y-px"
      >
        <span className="grid size-12 flex-none place-items-center rounded-2xl bg-white/10">
          <Timer className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 font-bold">
            타임어택 서바이벌
            <span className="flex gap-0.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <Heart key={i} className="size-3.5 fill-current" />
              ))}
            </span>
          </span>
          <span className="block text-sm opacity-75">제한 시간 안에 풀고 하트 3개로 끝까지 버티기</span>
          <span className="mt-1 block text-xs font-bold opacity-75">
            {survivalBest ? `최고 ${survivalBest.score.toLocaleString()}점 · ${survivalBest.correct}문제 정답` : "첫 기록에 도전해 보세요"}
          </span>
        </span>
        <ArrowRight className="size-5 flex-none" />
      </Link>

      <ul className="mt-2.5 grid gap-2.5">
        {GAME_TYPES.map((type) => {
          const Icon = ICONS[type];
          const best = progress.best[gameKey(level, type)];
          const count = gameQuestions(type, level).length;
          return (
            <li key={type}>
              <Link
                href={`/learn/game/${type}`}
                className="flex items-center gap-4 rounded-[20px] border border-border bg-card px-5 py-4 shadow-soft transition hover:-translate-y-px hover:border-input"
              >
                <span className="grid size-11 flex-none place-items-center rounded-2xl bg-accent">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{GAMES[type].title}</span>
                  <span className="block text-sm text-muted-foreground">{GAMES[type].tagline}</span>
                  <span className="mt-1 block text-xs font-bold text-muted-foreground">
                    {count}문제{best ? ` · 최고 ${best.score}/${best.total} · ${best.xp} XP` : " · 첫 도전"}
                  </span>
                </span>
                <ArrowRight className="size-5 flex-none" />
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/learn/quiz"
        className="mt-2.5 flex items-center gap-4 rounded-[20px] bg-primary px-5 py-4 text-primary-foreground shadow-ink transition hover:opacity-95"
      >
        <GraduationCap className="size-6 flex-none" />
        <span className="flex-1">
          <span className="block font-bold">문법 퀴즈 도전하기</span>
          <span className="block text-sm opacity-75">
            세 유형을 섞은 단계 종합 퀴즈{quizRecord ? ` · 최고 ${quizRecord.bestScore}/${quizRecord.bestTotal}` : ""}
          </span>
        </span>
        <ArrowRight className="size-5 flex-none" />
      </Link>
    </section>
  );
}
