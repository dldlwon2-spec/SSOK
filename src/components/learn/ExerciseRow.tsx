import Link from "next/link";
import { Bookmark, Check } from "lucide-react";
import { percent } from "@/lib/curriculum/stats";
import type { Exercise } from "@/lib/curriculum/types";
import { SELF_RATING_LABELS, type ExerciseProgress } from "@/lib/storage/curriculum-progress";

interface ExerciseRowProps {
  exercise: Exercise;
  number: number;
  record?: ExerciseProgress;
}

export function ExerciseRow({ exercise, number, record }: ExerciseRowProps) {
  const meta = [
    exercise.source,
    record?.bestStructureScore != null && `구조 ${percent(record.bestStructureScore)}`,
    record?.selfRating && SELF_RATING_LABELS[record.selfRating],
  ].filter(Boolean);

  return (
    <Link
      href={`/learn/${exercise.id}`}
      className="flex items-center gap-4 rounded-[18px] border border-border bg-card px-5 py-4 shadow-soft transition hover:-translate-y-px hover:border-input"
    >
      <span
        className={`grid size-8 flex-none place-items-center rounded-full text-sm ${
          record?.completed
            ? "bg-primary text-primary-foreground"
            : record?.attempts
              ? "border-2 border-dashed border-foreground"
              : "bg-secondary text-muted-foreground"
        }`}
        aria-label={record?.completed ? "완료" : record?.attempts ? "도전 중" : "시작 전"}
      >
        {record?.completed ? <Check className="size-4" /> : number}
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2">{exercise.sentence}</span>
        {meta.length > 0 && <small className="mt-0.5 block truncate text-xs text-muted-foreground">{meta.join(" · ")}</small>}
      </span>
      {record?.bookmarked && <Bookmark className="size-4 flex-none" fill="currentColor" aria-label="북마크" />}
    </Link>
  );
}
