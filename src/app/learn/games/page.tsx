"use client";

import { GameHub } from "@/components/learn/game/GameHub";
import { LearnTabs } from "@/components/learn/LearnTabs";
import { PageHeading } from "@/components/history/SavedList";
import { StageSelector } from "@/components/learn/StageSelector";
import { useLocalStore } from "@/hooks/useLocalStore";
import { curriculumProgressStore } from "@/lib/storage/curriculum-progress";
import { levelStore } from "@/lib/storage/preferences";

export default function LearnGamesPage() {
  const level = useLocalStore(levelStore);
  const progress = useLocalStore(curriculumProgressStore);

  return (
    <section>
      <PageHeading title="수준별 학습" description="게임처럼 문제를 풀며 XP를 모으고 기록에 도전해요." />
      <LearnTabs active="games" />
      <StageSelector level={level} progress={progress} />
      <GameHub level={level} />
    </section>
  );
}
