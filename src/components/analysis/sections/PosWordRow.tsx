"use client";

import { SectionCard } from "@/components/common/SectionCard";
import { useLocalStore } from "@/hooks/useLocalStore";
import { POS_STYLES } from "@/lib/analysis/labels";
import type { AnalysisResult, PosTag } from "@/lib/analysis/types";
import { toggleWord, wordBook, wordId } from "@/lib/storage/notebook";

export function PosWordRow({ result }: { result: AnalysisResult }) {
  const savedIds = new Set(useLocalStore(wordBook).map((w) => w.id));
  const usedPos = [...new Set(result.tokens.map((t) => t.pos))] as PosTag[];

  const toggle = (text: string, pos: PosTag) => {
    const vocab = result.vocabulary.find((v) => wordId(v.word) === wordId(text));
    toggleWord({
      word: text,
      meaning: vocab?.meaning ?? "",
      pos: POS_STYLES[pos].name,
      level: vocab?.level ?? null,
      register: vocab?.register ?? null,
      sentence: result.sentence,
    });
  };

  return (
    <SectionCard title="품사 한눈에 보기" description="단어마다 품사를 색으로 표시했어요. 모르는 단어를 누르면 단어장에 담겨요.">
      <div className="flex flex-wrap gap-x-2 gap-y-3">
        {result.tokens.map((token, i) => {
          const saved = savedIds.has(wordId(token.text));
          return (
            <button
              key={i}
              onClick={() => toggle(token.text, token.pos)}
              aria-pressed={saved}
              title={saved ? "단어장에서 빼기" : "단어장에 담기"}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2.5 py-1 text-base transition @sm:text-lg ${POS_STYLES[token.pos].className} ${
                  saved ? "ring-2 ring-foreground" : "hover:ring-2 hover:ring-input"
                }`}
              >
                {token.text}
              </span>
              <small className="text-xs text-muted-foreground">{POS_STYLES[token.pos].name}</small>
            </button>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-muted-foreground">
        {usedPos.map((pos) => (
          <span key={pos} className="inline-flex items-center gap-1.5">
            <i className={`inline-block size-3 rounded ${POS_STYLES[pos].className}`} />
            {POS_STYLES[pos].name}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
