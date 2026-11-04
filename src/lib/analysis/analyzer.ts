import { getLlmProvider } from "./llm";
import { tagSentence } from "./pos-tagger";
import { normalizeSentence } from "./preprocess";
import { buildUserPrompt, SYSTEM_PROMPT } from "./prompt";
import { analyzeByRules } from "./rule-based";
import { findSample } from "./samples";
import { llmAnalysisSchema, type LlmAnalysis } from "./schema";
import { ANALYSIS_VERSION, type AnalysisResult, type AnalysisSource } from "./types";

/**
 * Pipeline: normalize → POS tagging → (built-in sample | AI analysis | rule-based fallback).
 * Throws AnalysisInputError for invalid input.
 */
export async function analyzeSentence(input: string): Promise<AnalysisResult> {
  const sentence = normalizeSentence(input);
  const tokens = tagSentence(sentence);

  let analysis: LlmAnalysis;
  let source: AnalysisSource;

  const sample = findSample(sentence);
  const provider = getLlmProvider();

  if (sample) {
    analysis = sample;
    source = "sample";
  } else if (provider) {
    const raw = await provider.generateJson(SYSTEM_PROMPT, buildUserPrompt(sentence, tokens));
    analysis = llmAnalysisSchema.parse(raw);
    source = "ai";
  } else {
    analysis = analyzeByRules(tokens);
    source = "rule";
  }

  return {
    ...analysis,
    id: crypto.randomUUID(),
    version: ANALYSIS_VERSION,
    sentence,
    tokens,
    source,
    createdAt: new Date().toISOString(),
  };
}
