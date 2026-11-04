import { LEARNER_LEVELS, type LearnerLevel } from "@/lib/learning/levels";
import { GAME_POOL, prepareDeck, type DeckCard } from "./quiz";
import type { QuizQuestion } from "./quiz/types";

export const SURVIVAL_HEARTS = 3;

/** Harder interactions get more time. */
export function timeLimitMs(q: QuizQuestion): number {
  if (q.type === "blank") return 15_000;
  if (q.type === "pos" || (q.type === "structure" && q.mode === "pick")) return 20_000;
  return 30_000;
}

export const BASE_POINTS = 100;
export const TIME_BONUS_PER_SECOND = 10;
export const MAX_COMBO_MULTIPLIER = 2;

/** 100 points + 10 per remaining second, multiplied by ×1.2 per combo step (up to ×2). */
export function survivalPoints(remainingMs: number, combo: number) {
  const timeBonus = Math.ceil(remainingMs / 1000) * TIME_BONUS_PER_SECOND;
  return Math.round((BASE_POINTS + timeBonus) * comboMultiplier(combo));
}

export const comboMultiplier = (combo: number) => Math.min(1 + Math.max(combo - 1, 0) * 0.2, MAX_COMBO_MULTIPLIER);

export interface SurvivalCard extends DeckCard {
  level: LearnerLevel;
}

/** Starts at the chosen stage and climbs to harder stages once each pool is used up. */
export function buildSurvivalDeck(start: LearnerLevel): SurvivalCard[] {
  return LEARNER_LEVELS.slice(LEARNER_LEVELS.indexOf(start)).flatMap((level) =>
    prepareDeck(GAME_POOL[level]).map((card) => ({ ...card, level })),
  );
}

/** Endless mode: after every stage is cleared, keep going with reshuffled advanced questions. */
export function extraRound(): SurvivalCard[] {
  return prepareDeck(GAME_POOL.advanced).map((card) => ({ ...card, level: "advanced" as const }));
}
