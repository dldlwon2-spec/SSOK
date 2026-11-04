"use client";

import { useState } from "react";
import { PageHeading } from "@/components/history/SavedList";
import { LearnTabs } from "@/components/learn/LearnTabs";
import { QuizIntro } from "@/components/learn/quiz/QuizIntro";
import { QuizSession } from "@/components/learn/quiz/QuizSession";
import { StageSelector } from "@/components/learn/StageSelector";
import { useLocalStore } from "@/hooks/useLocalStore";
import { STAGES } from "@/lib/curriculum";
import { QUIZ_BANK } from "@/lib/curriculum/quiz";
import { curriculumProgressStore } from "@/lib/storage/curriculum-progress";
import { recordStageQuiz } from "@/lib/storage/learn-quiz";
import { levelStore } from "@/lib/storage/preferences";

export default function LearnQuizPage() {
  const level = useLocalStore(levelStore);
  const progress = useLocalStore(curriculumProgressStore);
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <QuizSession
        title={`${STAGES[level].name} 퀴즈`}
        questions={QUIZ_BANK[level]}
        mode="stage"
        onExit={() => setPlaying(false)}
        onFinish={(score, total) => recordStageQuiz(level, score, total)}
      />
    );
  }

  return (
    <section>
      <PageHeading title="수준별 학습" description="단계별 퀴즈로 배운 문법과 문장 구조를 점검해요." />
      <LearnTabs active="quiz" />
      <StageSelector level={level} progress={progress} />
      <QuizIntro
        level={level}
        onStart={() => {
          setPlaying(true);
          window.scrollTo({ top: 0 });
        }}
      />
    </section>
  );
}
