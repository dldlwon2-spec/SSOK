"use client";

import { useEffect, useState } from "react";
import { SectionCard } from "@/components/common/SectionCard";
import type { ReadingChunk } from "@/lib/analysis/types";
import { SELF_RATING_LABELS, type SelfRating } from "@/lib/storage/curriculum-progress";

const RATINGS: SelfRating[] = ["good", "close", "retry"];

interface TranslationPracticeProps {
  modelTranslation: string;
  chunks: ReadingChunk[];
  initialText: string;
  initialRating: SelfRating | null;
  onCompared: () => void;
  onRated: (translation: string, rating: SelfRating) => void;
}

export function TranslationPractice({
  modelTranslation,
  chunks,
  initialText,
  initialRating,
  onCompared,
  onRated,
}: TranslationPracticeProps) {
  const [text, setText] = useState(initialText);
  const [compared, setCompared] = useState(false);
  const [rating, setRating] = useState<SelfRating | null>(initialRating);

  // On a full page load the saved record arrives after hydration; adopt it if the learner hasn't typed yet.
  useEffect(() => {
    if (initialText) setText((current) => current || initialText);
  }, [initialText]);
  useEffect(() => {
    if (initialRating) setRating((current) => current ?? initialRating);
  }, [initialRating]);

  const compare = () => {
    setCompared(true);
    onCompared();
  };

  const rate = (r: SelfRating) => {
    setRating(r);
    onRated(text.trim(), r);
  };

  return (
    <SectionCard title="2. 해석 연습" description="덩어리 순서대로 직접 해석한 뒤, 모범 해석과 비교해 보세요.">
      {!compared ? (
        <>
          <textarea
            aria-label="나의 해석"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 나의 해석을 적어 보세요."
            className="block min-h-28 w-full resize-y rounded-[20px] border border-input bg-background px-5 py-4 outline-none placeholder:text-muted-foreground focus:border-ring"
          />
          <button
            onClick={compare}
            disabled={!text.trim()}
            className="mt-4 w-full rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            모범 해석과 비교
          </button>
        </>
      ) : (
        <>
          <div className="grid gap-3 @md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background px-4 py-3">
              <p className="mb-1 text-xs font-bold text-muted-foreground">내 해석</p>
              <p>{text}</p>
            </div>
            <div className="rounded-2xl bg-accent px-4 py-3">
              <p className="mb-1 text-xs font-bold text-muted-foreground">모범 해석</p>
              <p>{modelTranslation}</p>
            </div>
          </div>

          {chunks.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-bold text-muted-foreground">직독직해로 비교하기</p>
              <ol className="grid gap-2">
                {chunks.map((chunk, i) => (
                  <li key={i} className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-pen text-xl text-muted-foreground">{i + 1}</span>
                    <span className="font-bold">{chunk.text}</span>
                    <span className="text-muted-foreground">→ {chunk.meaning}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-2 font-bold">내 해석은 어땠나요?</p>
            <div className="flex flex-wrap gap-2">
              {RATINGS.map((r) => (
                <button
                  key={r}
                  onClick={() => rate(r)}
                  aria-pressed={rating === r}
                  className={`min-h-11 rounded-full border px-4 text-sm font-bold transition ${
                    rating === r ? "border-foreground bg-primary text-primary-foreground" : "border-border hover:border-input"
                  }`}
                >
                  {SELF_RATING_LABELS[r]}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>{rating ? "학습 기록에 저장했어요. 이 문장은 완료로 표시돼요." : "평가를 고르면 이 문장이 완료로 기록돼요."}</span>
              <button onClick={() => setCompared(false)} className="whitespace-nowrap underline">
                다시 쓰기
              </button>
            </div>
          </div>
        </>
      )}
    </SectionCard>
  );
}
