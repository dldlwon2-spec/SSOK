import type { LearnerLevel } from "@/lib/learning/levels";
import { GAME_POOL } from "./quiz";
import type { QuizQuestion } from "./quiz/types";

export const GAME_TYPES = ["unscramble", "tagging", "blank"] as const;
export type GameType = (typeof GAME_TYPES)[number];

export const isGameType = (value: string): value is GameType => GAME_TYPES.includes(value as GameType);

export const GAMES: Record<GameType, { title: string; tagline: string; rules: string; accepts: (q: QuizQuestion) => boolean }> = {
  unscramble: {
    title: "어순 배열 게임",
    tagline: "흩어진 단어 조각을 올바른 영어 어순으로",
    rules: "단어 조각을 끌어다 놓거나 눌러서 문장을 완성하세요. 놓은 조각을 다시 끌면 순서를 바꿀 수 있어요.",
    accepts: (q) => q.type === "unscramble",
  },
  tagging: {
    title: "구문 분석 퀴즈",
    tagline: "문장 성분과 품사를 찾아 터치",
    rules: "주어·동사·목적어 같은 문장 성분이나 명사·형용사 같은 품사를 찾아 고르거나 태깅하세요.",
    accepts: (q) => q.type === "structure" || q.type === "pos",
  },
  blank: {
    title: "빈칸 채우기 챌린지",
    tagline: "문맥과 구조에 맞는 형태 고르기",
    rules: "관계대명사, 전치사, 동사 변형 등 빈칸에 들어갈 알맞은 형태를 고르세요.",
    accepts: (q) => q.type === "blank",
  },
};

export function gameQuestions(type: GameType, level: LearnerLevel): QuizQuestion[] {
  return GAME_POOL[level].filter(GAMES[type].accepts);
}

export const gameKey = (level: LearnerLevel, type: GameType) => `${level}:${type}`;

/** XP rules: 10 XP per correct answer, +5 for each combo step (up to +20). */
export const BASE_XP = 10;
export const xpForCombo = (combo: number) => BASE_XP + Math.min(Math.max(combo - 1, 0), 4) * 5;
/** Finishing a game with every answer correct grants a bonus. */
export const PERFECT_BONUS = 30;

export const XP_PER_LEVEL = 100;

export function levelFromXp(totalXp: number) {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const current = totalXp % XP_PER_LEVEL;
  return { level, current, needed: XP_PER_LEVEL, ratio: current / XP_PER_LEVEL };
}
