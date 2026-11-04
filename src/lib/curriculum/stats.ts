import type { CurriculumProgress } from "@/lib/storage/curriculum-progress";
import type { Exercise } from "./types";

export interface ProgressSummary {
  total: number;
  completed: number;
  bookmarked: number;
  /** Average best structure score (0~1) over attempted exercises. */
  averageScore: number | null;
  nextUp: Exercise | undefined;
}

export function summarize(exercises: Exercise[], progress: CurriculumProgress): ProgressSummary {
  const scores = exercises
    .map((e) => progress[e.id]?.bestStructureScore)
    .filter((s): s is number => typeof s === "number");

  return {
    total: exercises.length,
    completed: exercises.filter((e) => progress[e.id]?.completed).length,
    bookmarked: exercises.filter((e) => progress[e.id]?.bookmarked).length,
    averageScore: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null,
    nextUp: exercises.find((e) => !progress[e.id]?.completed),
  };
}

export const percent = (ratio: number) => `${Math.round(ratio * 100)}%`;
