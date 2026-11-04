"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bookmark, CircleCheck } from "lucide-react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { adjacentExercises, locateExercise, resolveAnalysis, stageExercises } from "@/lib/curriculum";
import { percent } from "@/lib/curriculum/stats";
import {
  curriculumProgressStore,
  recordStructureAttempt,
  recordTranslation,
  SELF_RATING_LABELS,
  setCompleted,
  toggleExerciseBookmark,
} from "@/lib/storage/curriculum-progress";
import { AnswerReview } from "./AnswerReview";
import { StructurePractice } from "./StructurePractice";
import { TranslationPractice } from "./TranslationPractice";

export function PracticeScreen({ exerciseId }: { exerciseId: string }) {
  const location = locateExercise(exerciseId);
  const record = useLocalStore(curriculumProgressStore)[exerciseId];
  const [revealed, setRevealed] = useState(false);

  if (!location) return null;
  const { exercise, unit, stage, index } = location;
  const analysis = resolveAnalysis(exercise.analysis);
  const total = stageExercises(stage.level).length;
  const { prev, next } = adjacentExercises(exercise.id);

  const iconButton = "grid size-11 place-items-center rounded-full transition hover:bg-secondary";
  const history = record && [
    record.bestStructureScore != null && `구조 최고 ${percent(record.bestStructureScore)}`,
    record.selfRating && `해석 ‘${SELF_RATING_LABELS[record.selfRating]}’`,
    record.attempts > 0 && `${record.attempts}회 도전`,
  ].filter(Boolean);

  return (
    <article>
      <div className="mt-8 mb-7 flex items-center justify-between">
        <Link href="/learn" aria-label="커리큘럼으로" className={iconButton}>
          <ArrowLeft className="size-5" />
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => toggleExerciseBookmark(exercise.id)}
            aria-pressed={!!record?.bookmarked}
            aria-label={record?.bookmarked ? "북마크 해제" : "북마크"}
            className={iconButton}
          >
            <Bookmark className="size-5" fill={record?.bookmarked ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => setCompleted(exercise.id, !record?.completed)}
            aria-pressed={!!record?.completed}
            aria-label={record?.completed ? "완료 취소" : "완료로 표시"}
            className={`inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-bold transition ${
              record?.completed ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-input"
            }`}
          >
            <CircleCheck className="size-4" />
            {record?.completed ? "완료" : "완료 체크"}
          </button>
        </div>
      </div>

      <p className="mb-2.5 text-sm font-bold text-muted-foreground">
        {stage.name} · {unit.title} · {index + 1} / {total}
      </p>
      <h1 className="mb-2 text-xl leading-snug @sm:text-2xl @md:text-[26px] font-bold break-words">{exercise.sentence}</h1>
      {exercise.source && <p className="mb-2 text-sm text-muted-foreground">— {exercise.source}</p>}
      <p className="mt-4 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
        <strong className="text-foreground">학습 목표</strong> · {unit.goal}
      </p>
      {history && history.length > 0 && <p className="mt-2 px-1 text-xs font-bold text-muted-foreground">지난 기록: {history.join(" · ")}</p>}

      <StructurePractice
        parts={analysis.parts}
        pattern={analysis.pattern}
        onChecked={(score, formCorrect) => {
          recordStructureAttempt(exercise.id, score, formCorrect);
          setRevealed(true);
        }}
      />
      <TranslationPractice
        modelTranslation={analysis.translation}
        chunks={analysis.chunks}
        initialText={record?.translation ?? ""}
        initialRating={record?.selfRating ?? null}
        onCompared={() => setRevealed(true)}
        onRated={(text, rating) => recordTranslation(exercise.id, text, rating)}
      />

      {revealed ? (
        <AnswerReview sentence={exercise.sentence} analysis={analysis} />
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="mt-5 w-full rounded-2xl border border-dashed border-input px-5 py-4 text-sm text-muted-foreground transition hover:border-foreground hover:text-foreground"
        >
          먼저 풀어 보고 싶지 않다면, 정답과 해설 바로 보기
        </button>
      )}

      <nav aria-label="문장 이동" className="mt-8 grid grid-cols-2 gap-2.5">
        {prev ? (
          <Link href={`/learn/${prev.id}`} className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold">
            <ArrowLeft className="size-4 flex-none" />
            이전 문장
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.id}`}
            className="flex items-center justify-end gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-ink"
          >
            다음 문장
            <ArrowRight className="size-4 flex-none" />
          </Link>
        ) : (
          <Link href="/learn/quiz" className="flex items-center justify-end gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-ink">
            {stage.name} 퀴즈 풀기
            <ArrowRight className="size-4 flex-none" />
          </Link>
        )}
      </nav>
    </article>
  );
}
