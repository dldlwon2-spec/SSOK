"use client";

import { Bookmark } from "lucide-react";
import { EmptyNote, SectionCard } from "@/components/common/SectionCard";
import { useLocalStore } from "@/hooks/useLocalStore";
import { REGISTER_LABELS, SPECIAL_LABELS, VOCAB_LEVEL_LABELS } from "@/lib/analysis/labels";
import type { AnalysisResult } from "@/lib/analysis/types";
import { toggleWord, wordBook, wordId } from "@/lib/storage/notebook";

const AI_ONLY = "AI 분석을 연결하면 볼 수 있어요.";

const badge = "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground";

export function NuanceCard({ result }: { result: Pick<AnalysisResult, "nuance" | "pattern"> }) {
  return (
    <SectionCard title="뉘앙스" badge={result.pattern.formula}>
      {result.nuance ? <p className="leading-relaxed">{result.nuance}</p> : <EmptyNote>{AI_ONLY}</EmptyNote>}
    </SectionCard>
  );
}

export function SpecialStructureList({ result }: { result: Pick<AnalysisResult, "specialStructures" | "source"> }) {
  const items = result.specialStructures;
  return (
    <SectionCard title="도치 · 생략 구문">
      {items.length === 0 ? (
        <EmptyNote>{result.source === "rule" ? AI_ONLY : "이 문장에는 눈에 띄는 도치·생략 구문이 없어요."}</EmptyNote>
      ) : (
        <ul className="grid gap-5">
          {items.map((item, i) => (
            <li key={i}>
              <p className="mb-2 flex items-center gap-2 font-bold">
                <span className="rounded-full bg-part-complement px-2.5 py-0.5 text-xs">{SPECIAL_LABELS[item.type]}</span>
                {item.name}
              </p>
              <p className="mb-2 rounded-xl border-l-4 border-foreground bg-muted px-4 py-2.5 italic">{item.text}</p>
              <p className="text-muted-foreground">{item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

export function VocabularyList({ result }: { result: Pick<AnalysisResult, "vocabulary" | "sentence"> }) {
  const savedIds = new Set(useLocalStore(wordBook).map((w) => w.id));

  return (
    <SectionCard title="어휘 수준 분석" description="일상·비즈니스·학술 맥락에서의 쓰임을 함께 확인하세요.">
      {result.vocabulary.length === 0 ? (
        <EmptyNote>{AI_ONLY}</EmptyNote>
      ) : (
        <ul className="divide-y divide-border">
          {result.vocabulary.map((v) => {
            const saved = savedIds.has(wordId(v.word));
            return (
              <li key={v.word} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <div className="flex-1">
                  <p className="mb-1 flex flex-wrap items-center gap-2">
                    <strong className="text-lg">{v.word}</strong>
                    <span className={badge}>{VOCAB_LEVEL_LABELS[v.level]}</span>
                    <span className={badge}>{REGISTER_LABELS[v.register]}</span>
                  </p>
                  <p>{v.meaning}</p>
                  {v.note && <p className="mt-1 text-sm text-muted-foreground">{v.note}</p>}
                </div>
                <button
                  onClick={() =>
                    toggleWord({
                      word: v.word,
                      meaning: v.meaning,
                      pos: "",
                      level: v.level,
                      register: v.register,
                      sentence: result.sentence,
                    })
                  }
                  aria-pressed={saved}
                  aria-label={saved ? `${v.word} 단어장에서 빼기` : `${v.word} 단어장에 담기`}
                  className="grid size-11 flex-none place-items-center rounded-full transition hover:bg-secondary"
                >
                  <Bookmark className="size-5" fill={saved ? "currentColor" : "none"} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}

export function WritingTipList({ result }: { result: AnalysisResult }) {
  return (
    <SectionCard title="고급 영작 팁">
      {result.writingTips.length === 0 ? (
        <EmptyNote>{AI_ONLY}</EmptyNote>
      ) : (
        <ul className="grid gap-5">
          {result.writingTips.map((tip, i) => (
            <li key={i}>
              <h3 className="mb-1 text-[17px] font-bold">{tip.title}</h3>
              <p className="mb-2 text-muted-foreground">{tip.description}</p>
              {tip.example && <p className="rounded-xl bg-accent px-4 py-2.5">{tip.example}</p>}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
