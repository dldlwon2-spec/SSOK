import Link from "next/link";
import { Flame, Target, Trophy, Zap } from "lucide-react";
import type { GameRunResult } from "@/lib/storage/game-progress";
import { XpBar } from "./XpBar";

interface GameResultProps {
  score: number;
  total: number;
  xp: number;
  perfectBonus: number;
  maxCombo: number;
  run: GameRunResult;
  onRetry: () => void;
}

export function GameResult({ score, total, xp, perfectBonus, maxCombo, run, onRetry }: GameResultProps) {
  const wrong = total - score;
  const levelUp = run.levelAfter > run.levelBefore;
  const stats = [
    { Icon: Target, label: "정답", value: `${score}/${total}` },
    { Icon: Zap, label: "획득 XP", value: `+${xp}` },
    { Icon: Flame, label: "최대 콤보", value: String(maxCombo) },
  ];

  return (
    <section className="mt-6 animate-pop">
      <div className="rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 text-center shadow-card @sm:p-5 @md:p-7">
        <div className="mb-3 flex flex-wrap justify-center gap-2">
          {levelUp && (
            <span className="rounded-full bg-primary px-3.5 py-1 text-sm font-bold text-primary-foreground">
              레벨 업! Lv.{run.levelBefore} → Lv.{run.levelAfter}
            </span>
          )}
          {run.isBest && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-bold">
              <Trophy className="size-4" />
              최고 기록
            </span>
          )}
        </div>
        <p className="font-pen text-6xl @md:text-7xl leading-none">+{xp} XP</p>
        <p className="mt-3 text-lg">
          {score === total ? "완벽해요! 퍼펙트 보너스까지 챙겼어요." : score >= total / 2 ? "잘했어요! 조금만 더 하면 퍼펙트예요." : "괜찮아요. 해설을 보고 다시 도전해 봐요."}
        </p>
        {perfectBonus > 0 && <p className="mt-1 text-sm text-muted-foreground">퍼펙트 보너스 +{perfectBonus} XP 포함</p>}

        <dl className="my-6 grid grid-cols-3 gap-2">
          {stats.map(({ Icon, label, value }) => (
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
        {wrong > 0 && <p className="mt-4 text-sm text-muted-foreground">틀린 {wrong}문제는 오답 노트에 저장했어요.</p>}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <button onClick={onRetry} className="rounded-2xl bg-primary px-5 py-3.5 font-bold text-primary-foreground shadow-ink">
          다시 도전
        </button>
        <Link href={wrong > 0 ? "/learn/review" : "/learn"} className="rounded-2xl border border-border bg-card px-5 py-3.5 text-center font-bold">
          {wrong > 0 ? "오답 노트 보기" : "학습 목록으로"}
        </Link>
      </div>
    </section>
  );
}
