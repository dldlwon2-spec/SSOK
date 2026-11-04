import { createLocalStore } from "./local-store";

export interface QuizStat {
  attempts: number;
  correct: number;
  lastReviewedAt: string;
}

export type QuizStats = Record<string, QuizStat>;

const NO_STATS: QuizStats = {};

/** Keyed by sentence text. */
export const quizStatsStore = createLocalStore<QuizStats>("ssok:quiz-stats", NO_STATS, (raw) =>
  raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as QuizStats) : NO_STATS,
);

export function recordQuizAnswer(sentence: string, correct: boolean) {
  quizStatsStore.set((stats) => {
    const prev = stats[sentence] ?? { attempts: 0, correct: 0, lastReviewedAt: "" };
    return {
      ...stats,
      [sentence]: {
        attempts: prev.attempts + 1,
        correct: prev.correct + (correct ? 1 : 0),
        lastReviewedAt: new Date().toISOString(),
      },
    };
  });
}
