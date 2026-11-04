import type { LlmAnalysis } from "@/lib/analysis/schema";
import type { LearnerLevel } from "@/lib/learning/levels";

type OptionalAnalysisKeys =
  | "chunks"
  | "patternTags"
  | "nuance"
  | "specialStructures"
  | "vocabulary"
  | "writingTips";

/** Model answer for an exercise. Level-specific extras are optional and filled with defaults. */
export type CurriculumAnalysis = Omit<LlmAnalysis, OptionalAnalysisKeys> &
  Partial<Pick<LlmAnalysis, OptionalAnalysisKeys>>;

export interface Exercise {
  /** Stable id used in URLs and progress records, e.g. "beginner-1-2". */
  id: string;
  sentence: string;
  /** 원서·논문 등 출처 (고급 단계) */
  source?: string;
  analysis: CurriculumAnalysis;
}

export interface Unit {
  id: string;
  title: string;
  goal: string;
  exercises: Exercise[];
}

export interface Stage {
  level: LearnerLevel;
  name: string;
  description: string;
  units: Unit[];
}
