"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";
import { EmptyNote } from "@/components/common/SectionCard";
import { useLocalStore } from "@/hooks/useLocalStore";
import { stageExercises } from "@/lib/curriculum";
import { percent, summarize } from "@/lib/curriculum/stats";
import type { Stage } from "@/lib/curriculum/types";
import { resetStageProgress, type CurriculumProgress } from "@/lib/storage/curriculum-progress";
import { stageQuizStore } from "@/lib/storage/learn-quiz";
import { ExerciseRow } from "./ExerciseRow";
import { GameHub } from "./game/GameHub";

type Filter = "all" | "todo" | "bookmarked";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "todo", label: "미완료" },
  { id: "bookmarked", label: "북마크" },
];

export function StageOverview({ stage, progress }: { stage: Stage; progress: CurriculumProgress }) {
  const [filter, setFilter] = useState<Filter>("all");
  const quizRecord = useLocalStore(stageQuizStore)[stage.level];
  const exercises = stageExercises(stage.level);
  const summary = summarize(exercises, progress);
  const start = summary.nextUp ?? exercises[0];

  const visible = (id: string) =>
    filter === "all" || (filter === "todo" ? !progress[id]?.completed : !!progress[id]?.bookmarked);
  const units = stage.units
    .map((unit) => ({ unit, items: unit.exercises.filter((e) => visible(e.id)) }))
    .filter((u) => u.items.length > 0);

  const stats = [
    { label: "완료", value: `${summary.completed}/${summary.total}` },
    { label: "구조 정답률", value: summary.averageScore === null ? "–" : percent(summary.averageScore) },
    { label: "북마크", value: String(summary.bookmarked) },
  ];

  return (
    <>
      <section className="mt-5 rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 shadow-card @sm:p-5 @md:p-7">
        <h2 className="text-xl font-bold">{stage.name}</h2>
        <p className="mt-1 mb-5 text-muted-foreground">{stage.description}</p>

        <dl className="mb-5 grid grid-cols-3 divide-x divide-border rounded-2xl bg-background py-3 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="text-lg font-bold">{s.value}</dd>
            </div>
          ))}
        </dl>

        {start && (
          <Link
            href={`/learn/${start.id}`}
            className="flex items-center gap-3 rounded-2xl bg-primary px-5 py-3.5 text-primary-foreground shadow-ink transition hover:opacity-90"
          >
            <span className="min-w-0 flex-1">
              <span className="block font-bold">
                {summary.nextUp ? (summary.completed ? "이어서 학습하기" : "첫 문장 시작하기") : "처음부터 복습하기"}
              </span>
              <span className="block truncate text-sm opacity-75">{start.sentence}</span>
            </span>
            <ArrowRight className="size-5 flex-none" />
          </Link>
        )}

        <Link
          href="/learn/quiz"
          className={`mt-2.5 flex items-center gap-3 rounded-2xl border px-5 py-3 transition hover:border-input ${
            summary.nextUp ? "border-border" : "border-foreground bg-accent"
          }`}
        >
          <GraduationCap className="size-5 flex-none" />
          <span className="min-w-0 flex-1">
            <span className="block font-bold">
              {summary.nextUp ? `${stage.name} 퀴즈 풀기` : "문장 학습 완료! 단계 퀴즈로 실력 확인하기"}
            </span>
            <span className="block text-sm text-muted-foreground">
              {quizRecord ? `최고 점수 ${quizRecord.bestScore}/${quizRecord.bestTotal}` : "빈칸 채우기 · 문장 배열 · 구조 분석"}
            </span>
          </span>
          <ArrowRight className="size-5 flex-none" />
        </Link>
      </section>

      <div className="mt-8 mb-3 flex items-center justify-between gap-3">
        <div role="tablist" aria-label="문장 필터" className="flex rounded-full bg-secondary p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`min-h-11 rounded-full px-4 text-sm font-bold transition ${
                filter === f.id ? "bg-card shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {summary.completed + summary.bookmarked > 0 && (
          <button
            onClick={() => confirm(`${stage.name}의 학습 기록을 모두 지울까요?`) && resetStageProgress(exercises.map((e) => e.id))}
            className="text-sm whitespace-nowrap text-muted-foreground underline"
          >
            기록 초기화
          </button>
        )}
      </div>

      {units.length === 0 ? (
        <EmptyNote>{filter === "bookmarked" ? "북마크한 문장이 없어요." : "이 단계의 문장을 모두 완료했어요!"}</EmptyNote>
      ) : (
        units.map(({ unit, items }) => (
          <section key={unit.id} className="mt-6">
            <h3 className="font-bold">{unit.title}</h3>
            <p className="mb-3 text-sm text-muted-foreground">{unit.goal}</p>
            <ul className="grid gap-2.5">
              {items.map((exercise) => (
                <li key={exercise.id}>
                  <ExerciseRow
                    exercise={exercise}
                    number={exercises.indexOf(exercise) + 1}
                    record={progress[exercise.id]}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}

      <GameHub level={stage.level} />
    </>
  );
}
