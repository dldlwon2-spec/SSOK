export const PART_ROLES = [
  "subject",
  "verb",
  "object",
  "complement",
  "modifier",
  "connector",
] as const;

export type PartRole = (typeof PART_ROLES)[number];

export type PosTag =
  | "noun"
  | "pronoun"
  | "verb"
  | "auxiliary"
  | "adjective"
  | "adverb"
  | "preposition"
  | "determiner"
  | "conjunction"
  | "number"
  | "other";

export const SPECIAL_STRUCTURE_TYPES = [
  "inversion",
  "ellipsis",
  "emphasis",
  "insertion",
  "apposition",
  "other",
] as const;
export type SpecialStructureType = (typeof SPECIAL_STRUCTURE_TYPES)[number];

export const VOCAB_LEVELS = ["basic", "intermediate", "advanced"] as const;
export type VocabLevel = (typeof VOCAB_LEVELS)[number];

export const REGISTERS = ["general", "business", "academic", "formal", "informal"] as const;
export type Register = (typeof REGISTERS)[number];

export interface Token {
  text: string;
  /** Whitespace and punctuation that follow the word in the original sentence. */
  trailing: string;
  pos: PosTag;
  tags: string[];
}

export interface SentencePart {
  text: string;
  role: PartRole;
  label: string;
  explanation: string;
}

export interface GrammarPoint {
  title: string;
  description: string;
}

export interface SentencePattern {
  /** 문장의 형식 (1~5형식). 판단이 어려우면 null. */
  form: 1 | 2 | 3 | 4 | 5 | null;
  formula: string;
}

/** 직독직해용 의미 단위 */
export interface ReadingChunk {
  text: string;
  meaning: string;
}

export interface PatternTag {
  name: string;
  text: string;
  description: string;
}

export interface SpecialStructure {
  type: SpecialStructureType;
  name: string;
  text: string;
  description: string;
}

export interface VocabularyItem {
  word: string;
  level: VocabLevel;
  register: Register;
  meaning: string;
  note: string;
}

export interface WritingTip {
  title: string;
  description: string;
  example: string;
}

export type AnalysisSource = "ai" | "rule" | "sample";

/** Bump when AnalysisResult gains fields, so cached results are re-analyzed instead of shown half-empty. */
export const ANALYSIS_VERSION = 2;

export interface AnalysisResult {
  id: string;
  version: number;
  sentence: string;
  translation: string;
  pattern: SentencePattern;
  summary: string;
  parts: SentencePart[];
  grammarPoints: GrammarPoint[];
  tip: string;
  /** 중급: 끊어읽기 + 구문 태그 */
  chunks: ReadingChunk[];
  patternTags: PatternTag[];
  /** 고급: 뉘앙스, 특수 구문, 어휘 수준, 영작 팁 */
  nuance: string;
  specialStructures: SpecialStructure[];
  vocabulary: VocabularyItem[];
  writingTips: WritingTip[];
  tokens: Token[];
  source: AnalysisSource;
  createdAt: string;
}
