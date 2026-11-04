"use client";

import { useRef, useState } from "react";
import { GripVertical, RotateCcw } from "lucide-react";
import type { UnscrambleQuestion } from "@/lib/curriculum/quiz/types";

interface UnscrambleQuestionViewProps {
  question: UnscrambleQuestion;
  /** Shuffled token indices shown in the word bank. */
  pool: number[];
  order: number[];
  submitted: boolean;
  correct: boolean;
  onChange: (order: number[]) => void;
}

type DragSource = { from: "pool"; token: number } | { from: "answer"; position: number };

/** Supports both tap-to-place (touch friendly) and HTML5 drag and drop (reorder within the answer, drag back to remove). */
export function UnscrambleQuestionView({ question, pool, order, submitted, correct, onChange }: UnscrambleQuestionViewProps) {
  const drag = useRef<DragSource | null>(null);
  const [dropAt, setDropAt] = useState<number | "end" | "pool" | null>(null);
  const remaining = pool.filter((i) => !order.includes(i));

  const insertAt = (position: number) => {
    const source = drag.current;
    if (!source) return;
    const next = [...order];
    let token: number;
    let target = position;
    if (source.from === "answer") {
      [token] = next.splice(source.position, 1);
      if (source.position < position) target -= 1;
    } else {
      token = source.token;
    }
    next.splice(target, 0, token);
    onChange(next);
  };

  const endDrag = () => {
    drag.current = null;
    setDropAt(null);
  };

  const dragProps = (source: DragSource) =>
    submitted
      ? {}
      : {
          draggable: true,
          onDragStart: (e: React.DragEvent) => {
            drag.current = source;
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", "");
          },
          onDragEnd: endDrag,
        };

  const frame = !submitted
    ? dropAt === "end"
      ? "border-foreground bg-secondary/60"
      : "border-input"
    : correct
      ? "border-part-verb bg-part-verb/20"
      : "border-destructive/50 bg-destructive/5 animate-shake";

  return (
    <div>
      <p className="mb-3 px-1 text-sm text-muted-foreground">뜻: {question.translation}</p>

      <div
        aria-label="내가 배열한 문장"
        onDragOver={(e) => {
          if (submitted) return;
          e.preventDefault();
          if (e.target === e.currentTarget) setDropAt("end");
        }}
        onDragLeave={(e) => e.target === e.currentTarget && setDropAt(null)}
        onDrop={(e) => {
          e.preventDefault();
          if (e.target === e.currentTarget) insertAt(order.length);
          endDrag();
        }}
        className={`flex min-h-20 flex-wrap content-start items-center gap-2 rounded-2xl border-2 border-dashed p-3 transition ${frame}`}
      >
        {order.length === 0 && (
          <span className="pointer-events-none px-1 text-sm text-muted-foreground">
            아래 조각을 이곳에 끌어다 놓거나 눌러 보세요.
          </span>
        )}
        {order.map((tokenIndex, position) => (
          <button
            key={`${tokenIndex}-${position}`}
            {...dragProps({ from: "answer", position })}
            onDragOver={(e) => {
              if (submitted) return;
              e.preventDefault();
              e.stopPropagation();
              setDropAt(position);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              insertAt(position);
              endDrag();
            }}
            onClick={() => onChange(order.filter((_, idx) => idx !== position))}
            disabled={submitted}
            className={`inline-flex cursor-grab items-center gap-1 min-h-11 rounded-xl bg-primary py-1.5 pr-3 pl-1.5 text-base @sm:text-lg text-primary-foreground transition active:cursor-grabbing ${
              dropAt === position ? "ml-3 shadow-[-8px_0_0_-4px_var(--color-foreground)]" : ""
            }`}
          >
            {!submitted && <GripVertical className="size-4 opacity-50" />}
            {question.tokens[tokenIndex]}
          </button>
        ))}
      </div>

      <div
        aria-label="단어 조각"
        onDragOver={(e) => {
          if (submitted || drag.current?.from !== "answer") return;
          e.preventDefault();
          setDropAt("pool");
        }}
        onDragLeave={() => dropAt === "pool" && setDropAt(null)}
        onDrop={(e) => {
          e.preventDefault();
          const source = drag.current;
          if (source?.from === "answer") onChange(order.filter((_, idx) => idx !== source.position));
          endDrag();
        }}
        className={`mt-4 flex min-h-14 flex-wrap gap-2 rounded-2xl p-1 transition ${dropAt === "pool" ? "bg-secondary" : ""}`}
      >
        {remaining.map((tokenIndex) => (
          <button
            key={tokenIndex}
            {...dragProps({ from: "pool", token: tokenIndex })}
            onClick={() => onChange([...order, tokenIndex])}
            disabled={submitted}
            className="cursor-grab min-h-11 rounded-xl border border-border bg-card px-3.5 py-1.5 text-base @sm:text-lg shadow-soft transition hover:-translate-y-px hover:border-input active:cursor-grabbing"
          >
            {question.tokens[tokenIndex]}
          </button>
        ))}
      </div>

      {!submitted && order.length > 0 && (
        <button onClick={() => onChange([])} className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground underline">
          <RotateCcw className="size-3.5" />
          처음부터 다시 배열
        </button>
      )}
    </div>
  );
}
