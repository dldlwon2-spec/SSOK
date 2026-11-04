"use client";

import { STAGE_SHORT_NAMES, stageExercises, STAGES } from "@/lib/curriculum";
import { summarize } from "@/lib/curriculum/stats";
import { LEARNER_LEVELS, type LearnerLevel } from "@/lib/learning/levels";
import type { CurriculumProgress } from "@/lib/storage/curriculum-progress";
import { setLevel } from "@/lib/storage/preferences";

export function StageSelector({ level, progress }: { level: LearnerLevel; progress: CurriculumProgress }) {
  return (
    <div role="radiogroup" aria-label="학습 단계" className="grid grid-cols-3 gap-2.5">
      {LEARNER_LEVELS.map((id) => {
        const { completed, total } = summarize(stageExercises(id), progress);
        const active = id === level;
        return (
          <button
            key={id}
            role="radio"
            aria-checked={active}
            aria-label={`${STAGES[id].name}, ${total}문장 중 ${completed}문장 완료`}
            onClick={() => setLevel(id)}
            className={`rounded-[20px] border p-3 text-left @sm:p-4 transition ${
              active
                ? "border-primary bg-primary text-primary-foreground shadow-ink"
                : "border-border bg-card shadow-soft hover:border-input"
            }`}
          >
            <span className="block font-pen text-3xl @sm:text-[34px] leading-none">{STAGE_SHORT_NAMES[id]}</span>
            <span className={`mt-1 block text-xs ${active ? "opacity-75" : "text-muted-foreground"}`}>
              {completed} / {total} 완료
            </span>
            <span className={`mt-2.5 block h-1.5 overflow-hidden rounded-full ${active ? "bg-white/20" : "bg-secondary"}`}>
              <span
                className={`block h-full rounded-full ${active ? "bg-primary-foreground" : "bg-primary"}`}
                style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
