"use client";

import { X } from "lucide-react";
import { SentenceCard } from "@/components/common/SentenceCard";
import type { AnalysisResult } from "@/lib/analysis/types";

interface SavedListProps {
  items: AnalysisResult[];
  emptyTitle: string;
  emptyHint: string;
  onRemove: (id: string) => void;
  getMeta?: (item: AnalysisResult) => string | undefined;
}

export function SavedList({ items, emptyTitle, emptyHint, onRemove, getMeta }: SavedListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-input px-5 py-16 text-center text-muted-foreground">
        <p className="font-pen text-3xl text-foreground">{emptyTitle}</p>
        <p>{emptyHint}</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-2.5">
      {items.map((item) => (
        <li key={item.id} className="relative [&>a]:pr-14">
          <SentenceCard sentence={item.sentence} caption={item.translation || undefined} meta={getMeta?.(item)} />
          <button
            onClick={() => onRemove(item.id)}
            aria-label="삭제"
            className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function PageHeading({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <>
      <h1 className="mt-9 mb-1.5 text-2xl @md:text-[28px] font-bold">{title}</h1>
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-muted-foreground">{description}</p>
        {action}
      </div>
    </>
  );
}
