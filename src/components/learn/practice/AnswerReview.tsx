import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GrammarPoints, TipCard } from "@/components/analysis/GrammarPoints";
import {
  NuanceCard,
  SpecialStructureList,
  VocabularyList,
} from "@/components/analysis/sections/AdvancedSections";
import { PatternTagList } from "@/components/analysis/sections/PatternTagList";
import { StructureCard } from "@/components/analysis/StructureCard";
import type { LlmAnalysis } from "@/lib/analysis/schema";

/** Full model answer, reusing the analysis-page sections. Extras only appear when the exercise has them. */
export function AnswerReview({ sentence, analysis }: { sentence: string; analysis: LlmAnalysis }) {
  return (
    <div>
      <h2 className="mt-10 mb-1 font-pen text-3xl">정답과 해설</h2>
      <StructureCard result={analysis} title="정답 구조" />
      <GrammarPoints points={analysis.grammarPoints} />
      {analysis.patternTags.length > 0 && <PatternTagList tags={analysis.patternTags} />}
      {analysis.nuance && <NuanceCard result={analysis} />}
      {analysis.specialStructures.length > 0 && <SpecialStructureList result={{ ...analysis, source: "sample" }} />}
      {analysis.vocabulary.length > 0 && <VocabularyList result={{ ...analysis, sentence }} />}
      <TipCard tip={analysis.tip} />

      <Link
        href={`/analyze?q=${encodeURIComponent(sentence)}`}
        className="mt-5 flex items-center justify-between rounded-[22px] border border-border bg-card px-5 py-4 shadow-soft transition hover:-translate-y-px hover:border-input"
      >
        <span>
          <span className="block font-bold">분석 화면에서 자세히 보기</span>
          <span className="block text-sm text-muted-foreground">품사 색상, 문장장 담기, 수준별 보기를 함께 쓸 수 있어요.</span>
        </span>
        <ArrowRight className="size-5" />
      </Link>
    </div>
  );
}
