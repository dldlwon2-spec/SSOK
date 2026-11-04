"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { stageExercises, STAGES } from "@/lib/curriculum";
import { QUIZ_BANK, QUIZ_TYPE_LABELS } from "@/lib/curriculum/quiz";
import type { QuizQuestion } from "@/lib/curriculum/quiz/types";
import { summarize } from "@/lib/curriculum/stats";
import type { LearnerLevel } from "@/lib/learning/levels";
import { curriculumProgressStore } from "@/lib/storage/curriculum-progress";
import { stageQuizStore } from "@/lib/storage/learn-quiz";

export function QuizIntro({ level, onStart }: { level: LearnerLevel; onStart: () => void }) {
  const stage = STAGES[level];
  const questions = QUIZ_BANK[level];
  const record = useLocalStore(stageQuizStore)[level];
  const { completed, total } = summarize(stageExercises(level), useLocalStore(curriculumProgressStore));
  const learnedAll = completed === total;

  const counts = (Object.keys(QUIZ_TYPE_LABELS) as QuizQuestion["type"][])
    .map((type) => ({ type, count: questions.filter((q) => q.type === type).length }))
    .filter((c) => c.count > 0);

  const stats = [
    { label: "최고 점수", value: record ? `${record.bestScore}/${record.bestTotal}` : "–" },
    { label: "도전 횟수", value: record ? `${record.attempts}회` : "0회" },
    { label: "문장 학습", value: `${completed}/${total}` },
  ];

  return (
    <section className="mt-5 rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 shadow-card @sm:p-5 @md:p-7">
      <h2 className="text-xl font-bold">{stage.name} 퀴즈</h2>
      <p className="mt-1 mb-4 text-muted-foreground">이 단계에서 배운 문법과 구조를 {questions.length}문제로 확인해요.</p>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {counts.map((c) => (
          <span key={c.type} className="rounded-full bg-secondary px-3 py-1 text-sm font-bold">
            {QUIZ_TYPE_LABELS[c.type]} {c.count}
          </span>
        ))}
      </div>

      <dl className="mb-5 grid grid-cols-3 divide-x divide-border rounded-2xl bg-background py-3 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-muted-foreground">{s.label}</dt>
            <dd className="text-lg font-bold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className={`mb-5 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm ${learnedAll ? "bg-accent" : "bg-muted text-muted-foreground"}`}>
        <Sparkles className="mt-0.5 size-4 flex-none" />
        {learnedAll ? (
          <p>이 단계의 문장 학습을 모두 마쳤어요. 이제 실력을 확인해 볼까요?</p>
        ) : (
          <p>
            문장 학습 {completed}/{total} 완료. 문장 학습을 먼저 마치면 퀴즈가 훨씬 쉬워져요.{" "}
            <Link href="/learn" className="font-bold text-foreground underline">
              문장 학습하러 가기
            </Link>
          </p>
        )}
      </div>

      <button
        onClick={onStart}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90"
      >
        {record ? "다시 도전하기" : "퀴즈 시작하기"}
        <ArrowRight className="size-4" />
      </button>
    </section>
  );
}
