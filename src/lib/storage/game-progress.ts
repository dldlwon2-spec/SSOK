import { levelFromXp } from "@/lib/curriculum/games";
import { createLocalStore } from "./local-store";

export interface GameBest {
  score: number;
  total: number;
  xp: number;
  maxCombo: number;
}

export interface SurvivalBest {
  score: number;
  answered: number;
  correct: number;
  maxCombo: number;
}

export interface GameProgress {
  totalXp: number;
  gamesPlayed: number;
  /** key: `${level}:${gameType}` */
  best: Record<string, GameBest>;
  /** 타임어택 서바이벌 최고 기록, key: starting level */
  survival: Record<string, SurvivalBest>;
}

const EMPTY: GameProgress = { totalXp: 0, gamesPlayed: 0, best: {}, survival: {} };

export const gameProgressStore = createLocalStore<GameProgress>("ssok:game-progress", EMPTY, (raw) => {
  const value = raw as Partial<GameProgress> | null;
  return value && typeof value.totalXp === "number" ? { ...EMPTY, ...value } : EMPTY;
});

export interface GameRunResult {
  levelBefore: number;
  levelAfter: number;
  totalXp: number;
  isBest: boolean;
}

export function recordGameRun(key: string, run: GameBest): GameRunResult {
  const prev = gameProgressStore.get();
  const before = prev.best[key];
  const improved =
    !before || run.score / run.total > before.score / before.total || (run.score === before.score && run.xp > before.xp);
  const totalXp = prev.totalXp + run.xp;

  gameProgressStore.set((p) => ({
    ...p,
    totalXp: p.totalXp + run.xp,
    gamesPlayed: p.gamesPlayed + 1,
    best: improved ? { ...p.best, [key]: run } : p.best,
  }));

  return {
    levelBefore: levelFromXp(prev.totalXp).level,
    levelAfter: levelFromXp(totalXp).level,
    totalXp,
    isBest: improved && run.score > 0,
  };
}

export function recordSurvivalRun(startLevel: string, run: SurvivalBest & { xp: number }): GameRunResult {
  const prev = gameProgressStore.get();
  const before = prev.survival[startLevel];
  const isBest = run.score > 0 && (!before || run.score > before.score);
  const totalXp = prev.totalXp + run.xp;
  const { xp, ...best } = run;

  gameProgressStore.set((p) => ({
    ...p,
    totalXp: p.totalXp + xp,
    gamesPlayed: p.gamesPlayed + 1,
    survival: isBest ? { ...p.survival, [startLevel]: best } : p.survival,
  }));

  return {
    levelBefore: levelFromXp(prev.totalXp).level,
    levelAfter: levelFromXp(totalXp).level,
    totalXp,
    isBest,
  };
}
