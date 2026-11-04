import { withLevelDefaults } from "@/lib/analysis/schema";
import type { AnalysisResult, Register, VocabLevel } from "@/lib/analysis/types";
import { createLocalStore } from "./local-store";

/** 나만의 문장장: 북마크한 문장 전체 분석 결과 */
const NO_SENTENCES: AnalysisResult[] = [];

// Keeps the key used by the earlier "즐겨찾기" feature so existing bookmarks carry over.
export const sentenceBook = createLocalStore<AnalysisResult[]>("ssok:favorites", NO_SENTENCES, (raw) =>
  Array.isArray(raw) ? raw.map(withLevelDefaults) : NO_SENTENCES,
);

export function toggleSentence(result: AnalysisResult): boolean {
  const saved = sentenceBook.get().some((r) => r.sentence === result.sentence);
  sentenceBook.set((list) =>
    saved ? list.filter((r) => r.sentence !== result.sentence) : [result, ...list],
  );
  return !saved;
}

/** Replaces a bookmarked analysis with a fresh one for the same sentence, if it is bookmarked. */
export function refreshSentence(result: AnalysisResult) {
  if (!sentenceBook.get().some((r) => r.sentence === result.sentence)) return;
  sentenceBook.set((list) => list.map((r) => (r.sentence === result.sentence ? result : r)));
}

export function removeSentence(id: string) {
  sentenceBook.set((list) => list.filter((r) => r.id !== id));
}

/** 나만의 단어장 */
export interface SavedWord {
  id: string;
  word: string;
  meaning: string;
  /** 한국어 품사 이름 (예: 명사) */
  pos: string;
  level: VocabLevel | null;
  register: Register | null;
  /** 단어를 담은 문장 (퀴즈 문맥으로 사용) */
  sentence: string;
  createdAt: string;
}

const NO_WORDS: SavedWord[] = [];

export const wordBook = createLocalStore<SavedWord[]>("ssok:words", NO_WORDS, (raw) =>
  Array.isArray(raw) ? (raw as SavedWord[]) : NO_WORDS,
);

export const wordId = (word: string) => word.trim().toLowerCase();

export function toggleWord(input: Omit<SavedWord, "id" | "createdAt">): boolean {
  const id = wordId(input.word);
  const saved = wordBook.get().some((w) => w.id === id);
  wordBook.set((list) =>
    saved ? list.filter((w) => w.id !== id) : [{ ...input, id, createdAt: new Date().toISOString() }, ...list],
  );
  return !saved;
}

export function removeWord(id: string) {
  wordBook.set((list) => list.filter((w) => w.id !== id));
}
