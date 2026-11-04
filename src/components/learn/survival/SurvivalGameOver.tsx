import Link from "next/link";
import { Flame, Mountain, Target, Trophy, Zap } from "lucide-react";
import { XpBar } from "@/components/learn/game/XpBar";
import { STAGE_SHORT_NAMES } from "@/lib/curriculum";
import type { LearnerLevel } from "@/lib/learning/levels";
import type { GameRunResult } from "@/lib/storage/game-progress";
import type { SurvivalStats } from "./SurvivalSession";

interface SurvivalGameOverProps {
  startLevel: LearnerLevel;
  stats: SurvivalStats;
  run: GameRunResult;
  onRetry: () => void;
  onExit: () => void;
}

export function SurvivalGameOver({ startLevel, stats, run, onRetry, onExit }: SurvivalGameOverProps) {
  const wrong = stats.answered - stats.correct;
  const levelUp = run.levelAfter > run.levelBefore;
  const cells = [
    { Icon: Target, label: "정답", value: `${stats.correct}/${stats.answered}` },
    { Icon: Flame, label: "최대 콤보", value: String(stats.maxCombo) },
    { Icon: Mountain, label: "도달 단계", value: STAGE_SHORT_NAMES[stats.reached] },
    { Icon: Zap, label: "획득 XP", value: `+${stats.xp}` },
  ];

  return (
    <section className="mt-8 animate-pop">
      <div className="rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 text-center shadow-card @sm:p-5 @md:p-7">
        <p className="text-sm font-bold text-muted-foreground">GAME OVER · {STAGE_SHORT_NAMES[startLevel]}부터 출발</p>
        <div className="mt-3 mb-2 flex flex-wrap justify-center gap-2">
          {run.isBest && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-bold">
              <Trophy className="size-4" />
              최고 기록 갱신!
            </span>
          )}
          {levelUp && (
            <span className="rounded-full bg-primary px-3.5 py-1 text-sm font-bold text-primary-foreground">
              레벨 업! Lv.{run.levelBefore} → Lv.{run.levelAfter}
            </span>
          )}
        </div>
        <p className="font-pen text-6xl @md:text-7xl leading-none tabular-nums">{stats.score.toLocaleString()}</p>
        <p className="mt-1 text-muted-foreground">점</p>

        <dl className="my-6 grid grid-cols-2 gap-2 @md:grid-cols-4">
          {cells.map(({ Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-background py-3">
              <dt className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Icon className="size-3.5" />
                {label}
              </dt>
              <dd className="text-xl font-bold">{value}</dd>
            </div>
          ))}
        </dl>

        <XpBar totalXp={run.totalXp} />
        {wrong > 0 && <p className="mt-4 text-sm text-muted-foreground">틀리거나 시간이 지난 {wrong}문제는 오답 노트에 저장했어요.</p>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <button onClick={onRetry} className="rounded-2xl bg-primary px-5 py-3.5 font-bold text-primary-foreground shadow-ink">
          다시 도전
        </button>
        {wrong > 0 ? (
          <Link href="/learn/review" className="rounded-2xl border border-border bg-card px-5 py-3.5 text-center font-bold">
            오답 노트 보기
          </Link>
        ) : (
          <button onClick={onExit} className="rounded-2xl border border-border bg-card px-5 py-3.5 font-bold">
            처음 화면으로
          </button>
        )}
      </div>
    </section>
  );
}
