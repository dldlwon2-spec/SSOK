import type { PartRole, PosTag } from "@/lib/analysis/types";

interface QuizBase {
  /** Stable id used for the wrong-answer notebook, e.g. "q-beginner-1". */
  id: string;
  /** 이 문제로 확인하는 문법 포인트 (예: 주격 관계대명사) */
  skill: string;
  /** 왜 이 답이 정답인지 */
  explanation: string;
  translation: string;
  /** 관련 커리큘럼 예문 */
  exerciseId?: string;
}

/** 빈칸 채우기: before + [blank] + after */
export interface BlankQuestion extends QuizBase {
  type: "blank";
  before: string;
  after: string;
  options: string[];
  answer: string;
}

/** 문장 순서 배열: tokens are listed in the correct order and shuffled when shown. */
export interface UnscrambleQuestion extends QuizBase {
  type: "unscramble";
  tokens: string[];
}

/** 구조 분석: pick = 특정 성분 덩어리를 모두 고르기, tag = 모든 덩어리에 성분 태깅 */
export interface StructureQuestion extends QuizBase {
  type: "structure";
  mode: "pick" | "tag";
  parts: { text: string; role: PartRole }[];
  /** pick 모드에서 골라야 할 성분 */
  target?: PartRole;
}

/** 품사 찾기: target 품사인 단어를 모두 고르기 */
export interface PosQuestion extends QuizBase {
  type: "pos";
  words: { text: string; pos: PosTag }[];
  target: PosTag;
}

export type QuizQuestion = BlankQuestion | UnscrambleQuestion | StructureQuestion | PosQuestion;

export type QuizResponse =
  | { type: "blank"; choice: string | null }
  | { type: "unscramble"; order: number[] }
  | { type: "pick"; selected: number[] }
  | { type: "tag"; tags: (PartRole | null)[] };
