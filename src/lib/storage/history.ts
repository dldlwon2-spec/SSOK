import { withLevelDefaults } from "@/lib/analysis/schema";
import { ANALYSIS_VERSION, type AnalysisResult } from "@/lib/analysis/types";
import { createLocalStore } from "./local-store";
import { sentenceBook } from "./notebook";

const MAX_RECENT = 30;
const EMPTY: AnalysisResult[] = [];

export const recentStore = createLocalStore<AnalysisResult[]>("ssok:recent", EMPTY, (raw) =>
  Array.isArray(raw) ? raw.map(withLevelDefaults) : EMPTY,
);

export function addRecent(result: AnalysisResult) {
  recentStore.set((list) => [result, ...list.filter((r) => r.sentence !== result.sentence)].slice(0, MAX_RECENT));
}

export function removeRecent(id: string) {
  recentStore.set((list) => list.filter((r) => r.id !== id));
}

export function clearRecent() {
  recentStore.set(() => []);
}

/** Reuses a saved analysis so revisiting a sentence doesn't spend another AI call. */
export function findStored(sentence: string): AnalysisResult | undefined {
  const target = sentence.replace(/\s+/g, " ").trim();
  return [...sentenceBook.get(), ...recentStore.get()].find(
    (r) => r.sentence === target && r.version === ANALYSIS_VERSION,
  );
}
