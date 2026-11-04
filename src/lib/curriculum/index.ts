import type { LlmAnalysis } from "@/lib/analysis/schema";
import type { LearnerLevel } from "@/lib/learning/levels";
import { advancedStage } from "./stages/advanced";
import { beginnerStage } from "./stages/beginner";
import { intermediateStage } from "./stages/intermediate";
import type { CurriculumAnalysis, Exercise, Stage, Unit } from "./types";

export const STAGES: Record<LearnerLevel, Stage> = {
  beginner: beginnerStage,
  intermediate: intermediateStage,
  advanced: advancedStage,
};

export const STAGE_SHORT_NAMES: Record<LearnerLevel, string> = {
  beginner: "기초",
  intermediate: "중급",
  advanced: "고급",
};

export interface ExerciseLocation {
  exercise: Exercise;
  unit: Unit;
  stage: Stage;
  /** 0-based position within the stage, for prev/next navigation. */
  index: number;
}

const LOCATIONS: ExerciseLocation[] = Object.values(STAGES).flatMap((stage) =>
  stage.units
    .flatMap((unit) => unit.exercises.map((exercise) => ({ exercise, unit, stage })))
    .map((loc, index) => ({ ...loc, index })),
);

export const ALL_EXERCISES = LOCATIONS.map((l) => l.exercise);

export function stageExercises(level: LearnerLevel): Exercise[] {
  return STAGES[level].units.flatMap((u) => u.exercises);
}

export function locateExercise(id: string): ExerciseLocation | undefined {
  return LOCATIONS.find((l) => l.exercise.id === id);
}

export function adjacentExercises(id: string): { prev?: Exercise; next?: Exercise } {
  const loc = locateExercise(id);
  if (!loc) return {};
  const list = stageExercises(loc.stage.level);
  return { prev: list[loc.index - 1], next: list[loc.index + 1] };
}

export function findExerciseBySentence(sentence: string): Exercise | undefined {
  return ALL_EXERCISES.find((e) => e.sentence === sentence);
}

export function resolveAnalysis(analysis: CurriculumAnalysis): LlmAnalysis {
  return {
    chunks: [],
    patternTags: [],
    nuance: "",
    specialStructures: [],
    vocabulary: [],
    writingTips: [],
    ...analysis,
  };
}
