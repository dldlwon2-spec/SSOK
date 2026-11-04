import { createLocalStore } from "./local-store";

export type SelfRating = "good" | "close" | "retry";

export const SELF_RATING_LABELS: Record<SelfRating, string> = {
  good: "잘 해석했어요",
  close: "비슷해요",
  retry: "다시 볼래요",
};

export interface ExerciseProgress {
  attempts: number;
  /** 0~1, share of sentence parts the learner labeled correctly. */
  lastStructureScore: number | null;
  bestStructureScore: number | null;
  formCorrect: boolean | null;
  translation: string;
  selfRating: SelfRating | null;
  completed: boolean;
  bookmarked: boolean;
  updatedAt: string;
}

export type CurriculumProgress = Record<string, ExerciseProgress>;

const EMPTY_PROGRESS: CurriculumProgress = {};

const BLANK: Omit<ExerciseProgress, "updatedAt"> = {
  attempts: 0,
  lastStructureScore: null,
  bestStructureScore: null,
  formCorrect: null,
  translation: "",
  selfRating: null,
  completed: false,
  bookmarked: false,
};

/** Keyed by exercise id. */
export const curriculumProgressStore = createLocalStore<CurriculumProgress>(
  "ssok:curriculum-progress",
  EMPTY_PROGRESS,
  (raw) => (raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as CurriculumProgress) : EMPTY_PROGRESS),
);

function update(id: string, patch: (prev: ExerciseProgress) => Partial<ExerciseProgress>) {
  curriculumProgressStore.set((all) => {
    const prev = all[id] ?? { ...BLANK, updatedAt: "" };
    return { ...all, [id]: { ...prev, ...patch(prev), updatedAt: new Date().toISOString() } };
  });
}

export function recordStructureAttempt(id: string, score: number, formCorrect: boolean | null) {
  update(id, (prev) => ({
    attempts: prev.attempts + 1,
    lastStructureScore: score,
    bestStructureScore: Math.max(prev.bestStructureScore ?? 0, score),
    formCorrect,
  }));
}

/** Rating the translation finishes the exercise, so it is marked completed. */
export function recordTranslation(id: string, translation: string, selfRating: SelfRating) {
  update(id, () => ({ translation, selfRating, completed: true }));
}

export function setCompleted(id: string, completed: boolean) {
  update(id, () => ({ completed }));
}

export function toggleExerciseBookmark(id: string) {
  update(id, (prev) => ({ bookmarked: !prev.bookmarked }));
}

export function resetStageProgress(ids: string[]) {
  curriculumProgressStore.set((all) => {
    const next = { ...all };
    ids.forEach((id) => delete next[id]);
    return next;
  });
}
