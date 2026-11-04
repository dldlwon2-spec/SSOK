import type { LearnerLevel } from "@/lib/learning/levels";
import { createLocalStore } from "./local-store";

function asRecord<T>(raw: unknown, fallback: Record<string, T>): Record<string, T> {
  return raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, T>) : fallback;
}

/** 오답 노트 항목 (key: quiz question id) */
export interface ReviewEntry {
  wrongCount: number;
  lastResponse: string;
  lastWrongAt: string | null;
  bookmarked: boolean;
  /** 오답 복습에서 다시 맞힌 문제 */
  mastered: boolean;
  updatedAt: string;
}

const NO_ENTRIES: Record<string, ReviewEntry> = {};

export const reviewStore = createLocalStore<Record<string, ReviewEntry>>("ssok:learn-review", NO_ENTRIES, (raw) =>
  asRecord(raw, NO_ENTRIES),
);

const BLANK_ENTRY: Omit<ReviewEntry, "updatedAt"> = {
  wrongCount: 0,
  lastResponse: "",
  lastWrongAt: null,
  bookmarked: false,
  mastered: false,
};

function updateEntry(id: string, patch: (prev: ReviewEntry) => Partial<ReviewEntry>) {
  reviewStore.set((all) => {
    const prev = all[id] ?? { ...BLANK_ENTRY, updatedAt: "" };
    return { ...all, [id]: { ...prev, ...patch(prev), updatedAt: new Date().toISOString() } };
  });
}

export function recordWrongAnswer(id: string, response: string) {
  const now = new Date().toISOString();
  updateEntry(id, (prev) => ({ wrongCount: prev.wrongCount + 1, lastResponse: response, lastWrongAt: now, mastered: false }));
}

export function markMastered(id: string) {
  if (reviewStore.get()[id]) updateEntry(id, () => ({ mastered: true }));
}

export function toggleReviewBookmark(id: string) {
  updateEntry(id, (prev) => ({ bookmarked: !prev.bookmarked }));
}

export function removeReviewEntry(id: string) {
  reviewStore.set((all) => {
    const next = { ...all };
    delete next[id];
    return next;
  });
}

export const needsReview = (e: ReviewEntry) => e.wrongCount > 0 && !e.mastered;

/** 단계 퀴즈 기록 (key: level) */
export interface StageQuizRecord {
  attempts: number;
  bestScore: number;
  bestTotal: number;
  lastScore: number;
  lastTotal: number;
  lastPlayedAt: string;
}

const NO_RECORDS: Record<string, StageQuizRecord> = {};

export const stageQuizStore = createLocalStore<Record<string, StageQuizRecord>>("ssok:learn-quiz", NO_RECORDS, (raw) =>
  asRecord(raw, NO_RECORDS),
);

/** Returns true when this run beats the previous best ratio. */
export function recordStageQuiz(level: LearnerLevel, score: number, total: number): boolean {
  const prev = stageQuizStore.get()[level];
  const isBest = !prev || score / total > prev.bestScore / prev.bestTotal;
  stageQuizStore.set((all) => ({
    ...all,
    [level]: {
      attempts: (prev?.attempts ?? 0) + 1,
      bestScore: isBest ? score : prev.bestScore,
      bestTotal: isBest ? total : prev.bestTotal,
      lastScore: score,
      lastTotal: total,
      lastPlayedAt: new Date().toISOString(),
    },
  }));
  return isBest;
}
