"use client";

import { PageHeading, SavedList } from "@/components/history/SavedList";
import { useLocalStore } from "@/hooks/useLocalStore";
import { clearRecent, recentStore, removeRecent } from "@/lib/storage/history";

export default function RecentPage() {
  const recent = useLocalStore(recentStore);

  return (
    <section>
      <PageHeading
        title="최근 분석"
        description="분석한 문장은 이 기기에 자동으로 보관돼요."
        action={
          recent.length > 0 && (
            <button onClick={clearRecent} className="text-sm whitespace-nowrap text-muted-foreground underline">
              전체 삭제
            </button>
          )
        }
      />
      <SavedList
        items={recent}
        emptyTitle="아직 분석한 문장이 없어요"
        emptyHint="홈에서 첫 문장을 입력해 보세요."
        onRemove={removeRecent}
      />
    </section>
  );
}
