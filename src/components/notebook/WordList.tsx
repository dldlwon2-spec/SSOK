"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { REGISTER_LABELS, VOCAB_LEVEL_LABELS } from "@/lib/analysis/labels";
import { removeWord, type SavedWord } from "@/lib/storage/notebook";

const badge = "rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground";

export function WordList({ words }: { words: SavedWord[] }) {
  if (words.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-input px-5 py-16 text-center text-muted-foreground">
        <p className="font-pen text-3xl text-foreground">단어장이 비어 있어요</p>
        <p>입문자 모드에서 단어를 누르거나, 고급자 모드의 어휘 목록에서 책갈피를 눌러 담아 보세요.</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-2.5">
      {words.map((w) => (
        <li key={w.id} className="relative rounded-[18px] border border-border bg-card px-5 py-4 pr-14 shadow-soft">
          <p className="flex flex-wrap items-center gap-2">
            <strong className="text-lg">{w.word}</strong>
            {w.pos && <span className={badge}>{w.pos}</span>}
            {w.level && <span className={badge}>{VOCAB_LEVEL_LABELS[w.level]}</span>}
            {w.register && <span className={badge}>{REGISTER_LABELS[w.register]}</span>}
          </p>
          <p className={w.meaning ? "" : "text-sm text-muted-foreground"}>{w.meaning || "뜻은 고급자 모드 어휘 분석에서 확인할 수 있어요."}</p>
          <Link
            href={`/analyze?q=${encodeURIComponent(w.sentence)}`}
            className="mt-1 block truncate text-sm text-muted-foreground underline-offset-2 hover:underline"
          >
            {w.sentence}
          </Link>
          <button
            onClick={() => removeWord(w.id)}
            aria-label={`${w.word} 삭제`}
            className="absolute top-3 right-3 grid size-11 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
