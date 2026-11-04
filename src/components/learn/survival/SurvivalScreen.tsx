"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Heart, Mountain, Play, Timer, Trophy } from "lucide-react";
import { StageSelector } from "@/components/learn/StageSelector";
import { useLocalStore } from "@/hooks/useLocalStore";
import { STAGES } from "@/lib/curriculum";
import { BASE_POINTS, MAX_COMBO_MULTIPLIER, SURVIVAL_HEARTS, TIME_BONUS_PER_SECOND } from "@/lib/curriculum/survival";
import { curriculumProgressStore } from "@/lib/storage/curriculum-progress";
import { gameProgressStore } from "@/lib/storage/game-progress";
import { levelStore } from "@/lib/storage/preferences";
import { SurvivalSession } from "./SurvivalSession";

const RULES = [
  { Icon: Heart, text: `하트 ${SURVIVAL_HEARTS}개로 시작해요. 틀리거나 시간이 다 되면 하트가 하나 줄어요.` },
  { Icon: Timer, text: "문제마다 제한 시간이 있어요. 빈칸 15초 · 고르기 20초 · 배열/태깅 30초" },
  { Icon: Flame, text: `정답 ${BASE_POINTS}점 + 남은 1초당 ${TIME_BONUS_PER_SECOND}점, 연속 정답이면 최대 ×${MAX_COMBO_MULTIPLIER} 배수` },
  { Icon: Mountain, text: "선택한 단계를 다 풀면 다음 단계로 올라가요. 고급까지 깨면 무한 모드!" },
];

export function SurvivalScreen() {
  const level = useLocalStore(levelStore);
  const progress = useLocalStore(curriculumProgressStore);
  const best = useLocalStore(gameProgressStore).survival[level];
  const [playing, setPlaying] = useState(false);

  if (playing) return <SurvivalSession key={level} startLevel={level} onExit={() => setPlaying(false)} />;

  return (
    <section>
      <Link href="/learn/games" className="mt-4 mb-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        게임 목록
      </Link>
      <p className="font-pen text-2xl text-muted-foreground">하트 세 개로 끝까지 버텨라</p>
      <h1 className="text-2xl @md:text-[28px] font-bold">타임어택 서바이벌</h1>
      <p className="mt-1 mb-5 text-muted-foreground">빈칸 채우기 · 어순 배열 · 구문 분석이 섞여서 쉬지 않고 나와요.</p>

      <p className="mb-2 text-sm font-bold">출발 단계</p>
      <StageSelector level={level} progress={progress} />

      <div className="mt-5 rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 shadow-card @sm:p-5 @md:p-7">
        <ul className="grid gap-3">
          {RULES.map(({ Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-[15px]">
              <span className="grid size-8 flex-none place-items-center rounded-full bg-accent">
                <Icon className="size-4" />
              </span>
              <span className="pt-1">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center gap-3 rounded-2xl bg-background px-4 py-3">
          <Trophy className="size-5 flex-none" />
          <p className="text-sm">
            {best ? (
              <>
                <strong>{STAGES[level].name} 최고 기록 {best.score.toLocaleString()}점</strong>
                <span className="text-muted-foreground"> · {best.correct}문제 정답 · 최대 {best.maxCombo}콤보</span>
              </>
            ) : (
              <span className="text-muted-foreground">아직 기록이 없어요. 첫 기록을 세워 보세요!</span>
            )}
          </p>
        </div>

        <button
          onClick={() => {
            setPlaying(true);
            window.scrollTo({ top: 0 });
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-ink transition hover:opacity-90"
        >
          <Play className="size-5 fill-current" />
          도전 시작
        </button>
      </div>
    </section>
  );
}
