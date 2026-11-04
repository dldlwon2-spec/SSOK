import { POS_STYLES, ROLE_STYLES } from "@/lib/analysis/labels";
import type { LearnerLevel } from "@/lib/learning/levels";
import { advancedGameExtras, advancedQuiz } from "./bank/advanced";
import { beginnerGameExtras, beginnerQuiz } from "./bank/beginner";
import { intermediateGameExtras, intermediateQuiz } from "./bank/intermediate";
import type { QuizQuestion, QuizResponse } from "./types";

/** 단계 퀴즈 문제 */
export const QUIZ_BANK: Record<LearnerLevel, QuizQuestion[]> = {
  beginner: beginnerQuiz,
  intermediate: intermediateQuiz,
  advanced: advancedQuiz,
};

/** 미니 게임 문제: 단계 퀴즈 문제 + 게임 전용 추가 문제 */
export const GAME_POOL: Record<LearnerLevel, QuizQuestion[]> = {
  beginner: [...beginnerQuiz, ...beginnerGameExtras],
  intermediate: [...intermediateQuiz, ...intermediateGameExtras],
  advanced: [...advancedQuiz, ...advancedGameExtras],
};

export const QUIZ_TYPE_LABELS: Record<QuizQuestion["type"], string> = {
  blank: "빈칸 채우기",
  unscramble: "문장 배열",
  structure: "구조 분석",
  pos: "품사 찾기",
};

const INDEX = new Map(
  (Object.entries(GAME_POOL) as [LearnerLevel, QuizQuestion[]][]).flatMap(([level, questions]) =>
    questions.map((question) => [question.id, { question, level }] as const),
  ),
);

export function getQuizQuestion(id: string) {
  return INDEX.get(id);
}

export function questionPrompt(q: QuizQuestion): string {
  if (q.type === "blank") return "빈칸에 알맞은 말을 고르세요.";
  if (q.type === "unscramble") return "어절을 끌어 놓거나 눌러서 올바른 영어 어순으로 배열하세요.";
  if (q.type === "pos") return `문장에서 ${POS_STYLES[q.target].name}를 모두 고르세요.`;
  if (q.mode === "pick") return `문장에서 ${ROLE_STYLES[q.target ?? "subject"].name}를 모두 고르세요.`;
  return "각 덩어리에 알맞은 문장 성분을 태깅하세요.";
}

/** Short text that identifies the question in lists. */
export function questionPreview(q: QuizQuestion): string {
  if (q.type === "blank") return `${q.before}____${q.after}`;
  if (q.type === "unscramble") return `뜻: ${q.translation}`;
  if (q.type === "pos") return q.words.map((w) => w.text).join(" ");
  return q.parts.map((p) => p.text).join(" ");
}

export function emptyResponse(q: QuizQuestion): QuizResponse {
  if (q.type === "blank") return { type: "blank", choice: null };
  if (q.type === "unscramble") return { type: "unscramble", order: [] };
  if (q.type === "pos" || q.mode === "pick") return { type: "pick", selected: [] };
  return { type: "tag", tags: q.parts.map(() => null) };
}

export function isComplete(q: QuizQuestion, r: QuizResponse): boolean {
  if (r.type === "blank") return r.choice !== null;
  if (r.type === "unscramble") return q.type === "unscramble" && r.order.length === q.tokens.length;
  if (r.type === "pick") return r.selected.length > 0;
  return r.tags.every(Boolean);
}

/** Indices the learner must select in pick-style questions. */
export function expectedPicks(q: QuizQuestion): number[] {
  if (q.type === "pos") return q.words.flatMap((w, i) => (w.pos === q.target ? [i] : []));
  if (q.type === "structure") return q.parts.flatMap((p, i) => (p.role === q.target ? [i] : []));
  return [];
}

const pickedText = (q: QuizQuestion, indices: number[]) =>
  q.type === "pos" ? indices.map((i) => q.words[i].text) : q.type === "structure" ? indices.map((i) => q.parts[i].text) : [];

export function grade(q: QuizQuestion, r: QuizResponse): boolean {
  if (q.type === "blank" && r.type === "blank") return r.choice === q.answer;
  if (q.type === "unscramble" && r.type === "unscramble") return r.order.every((tokenIndex, i) => q.tokens[tokenIndex] === q.tokens[i]);
  if ((q.type === "structure" || q.type === "pos") && r.type === "pick") {
    const expected = expectedPicks(q);
    return expected.length === r.selected.length && expected.every((i) => r.selected.includes(i));
  }
  if (q.type === "structure" && r.type === "tag") return q.parts.every((p, i) => r.tags[i] === p.role);
  return false;
}

export function correctAnswerText(q: QuizQuestion): string {
  if (q.type === "blank") return `${q.before}${q.answer}${q.after}`;
  if (q.type === "unscramble") return q.tokens.join(" ");
  if (q.type === "pos" || q.mode === "pick") return pickedText(q, expectedPicks(q)).join(" / ");
  return q.parts.map((p) => `${p.text} = ${ROLE_STYLES[p.role].name}`).join(", ");
}

export function describeResponse(q: QuizQuestion, r: QuizResponse): string {
  if (q.type === "blank" && r.type === "blank") return r.choice ?? "";
  if (q.type === "unscramble" && r.type === "unscramble") return r.order.map((i) => q.tokens[i]).join(" ");
  if (r.type === "pick") return pickedText(q, r.selected).join(" / ");
  if (q.type === "structure" && r.type === "tag") {
    return q.parts.map((p, i) => `${p.text} = ${r.tags[i] ? ROLE_STYLES[r.tags[i]].name : "?"}`).join(", ");
  }
  return "";
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface DeckCard {
  question: QuizQuestion;
  /** 문장 배열 문제의 섞인 어절 순서 (token indices) */
  pool: number[];
}

/**
 * Shuffles question order and blank options, and scrambles unscramble tokens
 * so they never start in the right order.
 */
export function prepareDeck(questions: QuizQuestion[]): DeckCard[] {
  return shuffle(questions).map((question) => {
    if (question.type === "blank") return { question: { ...question, options: shuffle(question.options) }, pool: [] };
    if (question.type !== "unscramble") return { question, pool: [] };
    const identity = question.tokens.map((_, i) => i);
    let pool = shuffle(identity);
    while (identity.length > 1 && pool.every((v, i) => v === i)) pool = shuffle(identity);
    return { question, pool };
  });
}
