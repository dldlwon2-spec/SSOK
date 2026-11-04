import type { AnalysisResult } from "@/lib/analysis/types";
import type { LearnerLevel } from "@/lib/learning/levels";
import { GrammarPoints, TipCard } from "./GrammarPoints";
import {
  NuanceCard,
  SpecialStructureList,
  VocabularyList,
  WritingTipList,
} from "./sections/AdvancedSections";
import { ChunkReading } from "./sections/ChunkReading";
import { PatternTagList } from "./sections/PatternTagList";
import { PosWordRow } from "./sections/PosWordRow";
import { StructureCard } from "./StructureCard";

/** Chooses which analysis sections to show for the learner's level. All levels share one AnalysisResult. */
export function LevelSections({ level, result }: { level: LearnerLevel; result: AnalysisResult }) {
  switch (level) {
    case "beginner":
      return (
        <>
          <StructureCard result={result} />
          <PosWordRow result={result} />
          <GrammarPoints points={result.grammarPoints} />
          <TipCard tip={result.tip} />
        </>
      );
    case "intermediate":
      return (
        <>
          <ChunkReading chunks={result.chunks} />
          <PatternTagList tags={result.patternTags} />
          <StructureCard result={result} variant="compact" />
          <TipCard tip={result.tip} />
        </>
      );
    case "advanced":
      return (
        <>
          <NuanceCard result={result} />
          <SpecialStructureList result={result} />
          <VocabularyList result={result} />
          <WritingTipList result={result} />
        </>
      );
  }
}
