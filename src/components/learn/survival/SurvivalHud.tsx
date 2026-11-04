"use client";

import { Flame, Heart, Timer } from "lucide-react";
import { useReplayAnimation } from "@/hooks/useReplayAnimation";
import { STAGE_SHORT_NAMES } from "@/lib/curriculum";
import { comboMultiplier, SURVIVAL_HEARTS } from "@/lib/curriculum/survival";
import type { LearnerLevel } from "@/lib/learning/levels";

interface SurvivalHudProps {
  hearts: number;
  score: number;
  combo: number;
  remainingMs: number;
  limitMs: number;
  level: LearnerLevel;
  paused: boolean;
  /** Changes whenever a heart is lost, to replay the shake animation. */
  hitKey: number;
}

export function SurvivalHud({ hearts, score, combo, remainingMs, limitMs, level, paused, hitKey }: SurvivalHudProps) {
  const heartsRef = useReplayAnimation<HTMLDivElement>(hitKey, "animate-shake");
  const scoreRef = useReplayAnimation<HTMLSpanElement>(score, "animate-pop");
  const ratio = limitMs ? remainingMs / limitMs : 0;
  const barColor = ratio > 0.5 ? "bg-part-verb" : ratio > 0.25 ? "bg-part-complement" : "bg-destructive/70";
  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <div className="sticky top-2 z-10 rounded-[22px] border border-border bg-card/95 px-4 py-3 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div ref={heartsRef} className="flex gap-1" aria-label={`남은 하트 ${hearts}개`}>
          {Array.from({ length: SURVIVAL_HEARTS }, (_, i) => (
            <Heart
              key={i}
              className={`size-6 transition ${i < hearts ? "fill-destructive/80 text-destructive/80" : "text-input"}`}
            />
          ))}
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground">{STAGE_SHORT_NAMES[level]}</span>
        <span ref={scoreRef} className="text-xl font-bold tabular-nums">
          {score.toLocaleString()}점
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2.5">
        <Timer className={`size-4 flex-none ${!paused && seconds <= 5 ? "text-destructive" : "text-muted-foreground"}`} />
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-secondary" role="timer" aria-label={`남은 시간 ${seconds}초`}>
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.max(ratio, 0) * 100}%` }} />
        </div>
        <span className="w-8 text-right text-sm font-bold tabular-nums">{seconds}s</span>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
            combo >= 1 ? "bg-part-complement" : "bg-secondary text-muted-foreground"
          }`}
          title="다음 정답의 점수 배수"
        >
          <Flame className="size-3.5" />×{comboMultiplier(combo + 1).toFixed(1)}
        </span>
      </div>
    </div>
  );
}
