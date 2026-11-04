import { z } from "zod";
import {
  PART_ROLES,
  REGISTERS,
  SPECIAL_STRUCTURE_TYPES,
  VOCAB_LEVELS,
  type AnalysisResult,
} from "./types";

export const llmAnalysisSchema = z.object({
  translation: z.string().min(1),
  pattern: z.object({
    form: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).nullable(),
    formula: z.string(),
  }),
  summary: z.string(),
  parts: z
    .array(
      z.object({
        text: z.string().min(1),
        role: z.enum(PART_ROLES),
        label: z.string(),
        explanation: z.string(),
      }),
    )
    .min(1),
  grammarPoints: z.array(z.object({ title: z.string(), description: z.string() })).max(6),
  tip: z.string(),

  chunks: z.array(z.object({ text: z.string(), meaning: z.string() })).default([]),
  patternTags: z
    .array(z.object({ name: z.string(), text: z.string(), description: z.string() }))
    .default([]),
  nuance: z.string().default(""),
  specialStructures: z
    .array(
      z.object({
        type: z.enum(SPECIAL_STRUCTURE_TYPES).catch("other"),
        name: z.string(),
        text: z.string(),
        description: z.string(),
      }),
    )
    .default([]),
  vocabulary: z
    .array(
      z.object({
        word: z.string(),
        level: z.enum(VOCAB_LEVELS).catch("intermediate"),
        register: z.enum(REGISTERS).catch("general"),
        meaning: z.string(),
        note: z.string().default(""),
      }),
    )
    .default([]),
  writingTips: z
    .array(z.object({ title: z.string(), description: z.string(), example: z.string().default("") }))
    .default([]),
});

export type LlmAnalysis = z.infer<typeof llmAnalysisSchema>;

type LevelKeys = "version" | "chunks" | "patternTags" | "nuance" | "specialStructures" | "vocabulary" | "writingTips";

/** Fills fields added after a result was saved, so older localStorage entries still render. */
export function withLevelDefaults(
  result: Omit<AnalysisResult, LevelKeys> & Partial<Pick<AnalysisResult, LevelKeys>>,
): AnalysisResult {
  return {
    ...result,
    version: result.version ?? 1,
    chunks: result.chunks ?? [],
    patternTags: result.patternTags ?? [],
    nuance: result.nuance ?? "",
    specialStructures: result.specialStructures ?? [],
    vocabulary: result.vocabulary ?? [],
    writingTips: result.writingTips ?? [],
  };
}
