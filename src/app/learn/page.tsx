"use client";

import { PageHeading } from "@/components/history/SavedList";
import { LearnTabs } from "@/components/learn/LearnTabs";
import { StageOverview } from "@/components/learn/StageOverview";
import { StageSelector } from "@/components/learn/StageSelector";
import { useLocalStore } from "@/hooks/useLocalStore";
import { STAGES } from "@/lib/curriculum";
import { curriculumProgressStore } from "@/lib/storage/curriculum-progress";
import { levelStore } from "@/lib/storage/preferences";

export default function LearnPage() {
  const level = useLocalStore(levelStore);
  const progress = useLocalStore(curriculumProgressStore);

  return (
    <section>
      <PageHeading
        title="수준별 학습"
        description="단계별 커리큘럼 문장으로 구조 분석과 해석을 직접 연습해요."
      />
      <LearnTabs active="sentences" />
      <StageSelector level={level} progress={progress} />
      <StageOverview key={level} stage={STAGES[level]} progress={progress} />
    </section>
  );
}
