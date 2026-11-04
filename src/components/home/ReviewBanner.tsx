"use client";

import { GraduationCap } from "lucide-react";
import { QuizLauncher } from "@/components/quiz/QuizLauncher";
import { useLocalStore } from "@/hooks/useLocalStore";
import { sentenceBook, wordBook } from "@/lib/storage/notebook";

export function ReviewBanner() {
  const sentences = useLocalStore(sentenceBook).length;
  const words = useLocalStore(wordBook).length;
  if (sentences === 0 && words === 0) return null;

  return (
    <QuizLauncher className="mt-5 flex w-full items-center gap-4 rounded-[22px] border border-border bg-accent px-5 py-4 text-left shadow-soft transition hover:-translate-y-px">
      <GraduationCap className="size-7 flex-none" />
      <span className="flex-1">
        <span className="block font-bold">오늘의 복습 퀴즈</span>
        <span className="block text-sm text-muted-foreground">
          문장장 {sentences}개 · 단어장 {words}개로 가볍게 구조를 복습해요.
        </span>
      </span>
    </QuizLauncher>
  );
}
