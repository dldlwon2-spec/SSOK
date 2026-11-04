import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";

export function LearnEntryCard() {
  return (
    <Link
      href="/learn"
      className="mt-5 flex items-center gap-4 rounded-[22px] border border-border bg-card px-5 py-4 shadow-soft transition hover:-translate-y-px hover:border-input"
    >
      <Layers className="size-7 flex-none" />
      <span className="flex-1">
        <span className="block font-bold">수준별 학습 시스템</span>
        <span className="block text-sm text-muted-foreground">
          기초 · 중급 · 고급 커리큘럼 문장으로 구조 분석과 해석을 연습해요.
        </span>
      </span>
      <ArrowRight className="size-5 flex-none" />
    </Link>
  );
}
