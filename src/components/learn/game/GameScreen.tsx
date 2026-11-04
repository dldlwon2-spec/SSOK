"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Play, Trophy, Zap } from "lucide-react";
import { StageSelector } from "@/components/learn/StageSelector";
import { useLocalStore } from "@/hooks/useLocalStore";
import { STAGES } from "@/lib/curriculum";
import { BASE_XP, gameKey, gameQuestions, GAMES, PERFECT_BONUS, xpForCombo, type GameType } from "@/lib/curriculum/games";
import { curriculumProgressStore } from "@/lib/storage/curriculum-progress";
import { gameProgressStore } from "@/lib/storage/game-progress";
import { levelStore } from "@/lib/storage/preferences";
import { GameSession } from "./GameSession";

export function GameScreen({ type }: { type: GameType }) {
  const level = useLocalStore(levelStore);
  const progress = useLocalStore(curriculumProgressStore);
  const best = useLocalStore(gameProgressStore).best[gameKey(level, type)];
  const [playing, setPlaying] = useState(false);
  const questions = gameQuestions(type, level);
  const game = GAMES[type];

  if (playing) {
    return <GameSession key={level} type={type} level={level} questions={questions} onExit={() => setPlaying(false)} />;
  }

  const rules = [
    { Icon: Zap, text: `정답 +${BASE_XP} XP` },
    { Icon: Flame, text: `연속 정답 콤보 최대 +${xpForCombo(5) - BASE_XP} XP` },
    { Icon: Trophy, text: `전부 맞히면 퍼펙트 +${PERFECT_BONUS} XP` },
  ];

  return (
    <section>
      <Link href="/learn/games" className="mt-4 mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        게임 목록
      </Link>
      <h1 className="text-2xl @md:text-[28px] font-bold">{game.title}</h1>
      <p className="mt-1 mb-5 text-muted-foreground">{game.rules}</p>

      <StageSelector level={level} progress={progress} />

      <div className="mt-5 rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 shadow-card @sm:p-5 @md:p-7">
        <p className="text-sm font-bold text-muted-foreground">{STAGES[level].name}</p>
        <p className="mt-1 text-xl font-bold">{questions.length}문제</p>
        <ul className="mt-4 grid gap-2">
          {rules.map(({ Icon, text }) => (
            <li key={text} className="flex items-center gap-2.5 text-[15px]">
              <span className="grid size-7 place-items-center rounded-full bg-accent">
                <Icon className="size-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          {best ? `최고 기록 ${best.score}/${best.total} · ${best.xp} XP · 최대 ${best.maxCombo}콤보` : "아직 기록이 없어요. 첫 도전을 시작해 보세요!"}
        </p>
        <button
          onClick={() => {
            setPlaying(true);
            window.scrollTo({ top: 0 });
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90"
        >
          <Play className="size-4 fill-current" />
          게임 시작
        </button>
      </div>
    </section>
  );
}
