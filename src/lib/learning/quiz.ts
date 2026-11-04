import { formatPattern, ROLE_STYLES, SPECIAL_LABELS } from "@/lib/analysis/labels";
import type { AnalysisResult, PartRole } from "@/lib/analysis/types";
import type { SavedWord } from "@/lib/storage/notebook";
import type { LearnerLevel } from "./levels";

export type QuizKind = "role" | "form" | "translation" | "chunk" | "pattern" | "special" | "word";

export const QUIZ_KIND_LABELS: Record<QuizKind, string> = {
  role: "문장 성분",
  form: "문장 형식",
  translation: "해석",
  chunk: "끊어 읽기",
  pattern: "구문 패턴",
  special: "특수 구문",
  word: "어휘",
};

const LEVEL_KINDS: Record<LearnerLevel, QuizKind[]> = {
  beginner: ["role", "translation", "word"],
  intermediate: ["role", "form", "chunk", "pattern", "word"],
  advanced: ["form", "pattern", "special", "translation", "word"],
};

const COMMON_PATTERNS = [
  "관계대명사", "관계부사", "분사구문", "to부정사", "동명사", "수동태", "현재완료",
  "가정법 과거", "가정법 과거완료", "비교급", "간접의문문", "사역동사", "강조구문",
];

const QUIZ_ROLES: PartRole[] = ["subject", "verb", "object", "complement", "modifier"];

export interface QuizQuestion {
  id: string;
  kind: QuizKind;
  /** Source sentence for review stats; null for vocabulary questions. */
  sentence: string | null;
  context: string | null;
  highlight: string | null;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

type Draft = Omit<QuizQuestion, "id" | "options" | "answer"> & { correct: string; distractors: string[] };

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick<T>(items: T[]): T | undefined {
  return items[Math.floor(Math.random() * items.length)];
}

function finalize(draft: Draft, id: string): QuizQuestion | null {
  const { correct, distractors, ...rest } = draft;
  const wrong = shuffle([...new Set(distractors.filter((d) => d && d !== correct))]).slice(0, 3);
  if (wrong.length === 0) return null;
  const options = shuffle([correct, ...wrong]);
  return { ...rest, id, options, answer: options.indexOf(correct) };
}

interface Pools {
  translations: string[];
  chunkMeanings: string[];
}

const GENERATORS: Record<Exclude<QuizKind, "word">, (r: AnalysisResult, pools: Pools) => Draft | null> = {
  role(r) {
    const part = pick(r.parts.filter((p) => QUIZ_ROLES.includes(p.role)));
    if (!part) return null;
    return {
      kind: "role",
      sentence: r.sentence,
      context: r.sentence,
      highlight: part.text,
      prompt: "표시된 부분의 문장 성분은 무엇일까요?",
      correct: ROLE_STYLES[part.role].name,
      distractors: QUIZ_ROLES.map((role) => ROLE_STYLES[role].name),
      explanation: `${part.text} — ${part.label}. ${part.explanation}`,
    };
  },
  form(r) {
    if (!r.pattern.form) return null;
    return {
      kind: "form",
      sentence: r.sentence,
      context: r.sentence,
      highlight: null,
      prompt: "이 문장은 몇 형식일까요?",
      correct: `${r.pattern.form}형식`,
      distractors: [1, 2, 3, 4, 5].map((n) => `${n}형식`),
      explanation: `${formatPattern(r.pattern.form, r.pattern.formula)}. ${r.summary}`,
    };
  },
  translation(r, pools) {
    if (!r.translation) return null;
    return {
      kind: "translation",
      sentence: r.sentence,
      context: r.sentence,
      highlight: null,
      prompt: "이 문장의 알맞은 해석은 무엇일까요?",
      correct: r.translation,
      distractors: pools.translations,
      explanation: r.summary,
    };
  },
  chunk(r, pools) {
    const chunk = pick(r.chunks.filter((c) => c.meaning));
    if (!chunk || r.chunks.length < 2) return null;
    return {
      kind: "chunk",
      sentence: r.sentence,
      context: r.chunks.map((c) => c.text).join(" / "),
      highlight: chunk.text,
      prompt: "표시된 덩어리를 영어 어순대로 옮기면?",
      correct: chunk.meaning,
      distractors: [...r.chunks.map((c) => c.meaning), ...pools.chunkMeanings],
      explanation: r.chunks.map((c) => `${c.text} → ${c.meaning || "?"}`).join(" / "),
    };
  },
  pattern(r) {
    const tag = pick(r.patternTags);
    if (!tag) return null;
    const ownNames = r.patternTags.map((t) => t.name);
    // Drop distractors that overlap with any tag in this sentence (e.g. "관계대명사" vs "목적격 관계대명사").
    const distractors = COMMON_PATTERNS.filter((p) => !ownNames.some((n) => n.includes(p) || p.includes(n)));
    return {
      kind: "pattern",
      sentence: r.sentence,
      context: r.sentence,
      highlight: tag.text,
      prompt: "표시된 부분에 쓰인 구문은 무엇일까요?",
      correct: tag.name,
      distractors,
      explanation: tag.description,
    };
  },
  special(r) {
    const structure = pick(r.specialStructures.filter((s) => s.type !== "other"));
    if (!structure) return null;
    return {
      kind: "special",
      sentence: r.sentence,
      context: structure.text,
      highlight: null,
      prompt: "이 문장에 적용된 특수 구문은 무엇일까요?",
      correct: SPECIAL_LABELS[structure.type],
      distractors: Object.values(SPECIAL_LABELS).filter((l) => l !== SPECIAL_LABELS.other),
      explanation: `${structure.name}: ${structure.description}`,
    };
  },
};

function wordDrafts(words: SavedWord[], sentences: AnalysisResult[]): Draft[] {
  const pool = new Map<string, { word: string; meaning: string; sentence: string; note: string }>();
  for (const w of words) {
    if (w.meaning) pool.set(w.id, { word: w.word, meaning: w.meaning, sentence: w.sentence, note: "" });
  }
  for (const r of sentences) {
    for (const v of r.vocabulary) {
      const id = v.word.toLowerCase();
      if (v.meaning && !pool.has(id)) pool.set(id, { word: v.word, meaning: v.meaning, sentence: r.sentence, note: v.note });
    }
  }

  const entries = [...pool.values()];
  return entries.map((entry) => ({
    kind: "word",
    sentence: null,
    context: entry.sentence,
    highlight: entry.word,
    prompt: `'${entry.word}'의 뜻으로 알맞은 것은?`,
    correct: entry.meaning,
    distractors: entries.map((e) => e.meaning),
    explanation: entry.note || `${entry.word}: ${entry.meaning}`,
  }));
}

interface BuildQuizInput {
  sentences: AnalysisResult[];
  words: SavedWord[];
  /** Extra analyses (e.g. recent history) used only to make wrong-answer options. */
  distractorSource: AnalysisResult[];
  level: LearnerLevel;
  count?: number;
}

/** Builds a level-appropriate quiz from the learner's notebook, mixing question types round-robin. */
export function buildQuiz({ sentences, words, distractorSource, level, count = 5 }: BuildQuizInput): QuizQuestion[] {
  const kinds = LEVEL_KINDS[level];
  const all = [...sentences, ...distractorSource];
  const pools: Pools = {
    translations: all.map((r) => r.translation).filter(Boolean),
    chunkMeanings: all.flatMap((r) => r.chunks.map((c) => c.meaning)).filter(Boolean),
  };

  const byKind = new Map<QuizKind, Draft[]>();
  for (const kind of kinds) {
    const drafts =
      kind === "word"
        ? wordDrafts(words, sentences)
        : sentences.map((r) => GENERATORS[kind](r, pools)).filter((d): d is Draft => d !== null);
    if (drafts.length) byKind.set(kind, shuffle(drafts));
  }

  const questions: QuizQuestion[] = [];
  const queues = shuffle([...byKind.values()]);
  while (questions.length < count && queues.some((q) => q.length)) {
    for (const queue of queues) {
      const draft = queue.shift();
      if (!draft) continue;
      const question = finalize(draft, `q${questions.length}`);
      if (question) questions.push(question);
      if (questions.length >= count) break;
    }
  }
  return questions;
}
