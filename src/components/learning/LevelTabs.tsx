"use client";

import { LEARNER_LEVELS, LEVEL_INFO, type LearnerLevel } from "@/lib/learning/levels";
import { setLevel } from "@/lib/storage/preferences";

export function LevelTabs({ level }: { level: LearnerLevel }) {
  return (
    <div className="mb-2">
      <div role="tablist" aria-label="학습 수준" className="flex rounded-full bg-secondary p-1">
        {LEARNER_LEVELS.map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={id === level}
            onClick={() => setLevel(id)}
            className={`min-h-11 flex-1 rounded-full text-sm font-bold transition ${
              id === level ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {LEVEL_INFO[id].short}
          </button>
        ))}
      </div>
      <p className="mt-2.5 px-1 text-sm text-muted-foreground">{LEVEL_INFO[level].description}</p>
    </div>
  );
}
