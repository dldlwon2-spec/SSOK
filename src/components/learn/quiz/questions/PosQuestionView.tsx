"use client";

import { Check, X } from "lucide-react";
import { POS_STYLES } from "@/lib/analysis/labels";
import type { PosQuestion } from "@/lib/curriculum/quiz/types";

interface PosQuestionViewProps {
  question: PosQuestion;
  selected: number[];
  submitted: boolean;
  onChange: (selected: number[]) => void;
}

export function PosQuestionView({ question, selected, submitted, onChange }: PosQuestionViewProps) {
  const toggle = (i: number) => {
    if (submitted) return;
    onChange(selected.includes(i) ? selected.filter((s) => s !== i) : [...selected, i]);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-x-2 gap-y-4 rounded-2xl bg-background p-4">
        {question.words.map((word, i) => {
          const picked = selected.includes(i);
          const isTarget = word.pos === question.target;
          const right = picked === isTarget;

          let fill = "border border-border bg-card";
          if (submitted) fill = POS_STYLES[word.pos].className;
          else if (picked) fill = "bg-primary text-primary-foreground";

          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              disabled={submitted}
              aria-pressed={picked}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2.5 py-1 text-base transition @sm:text-lg ${fill} ${
                  submitted ? (right ? "" : "ring-2 ring-destructive/60") : "hover:ring-2 hover:ring-input"
                }`}
              >
                {word.text}
              </span>
              <small className="flex min-h-4 items-center gap-0.5 text-xs text-muted-foreground">
                {submitted && (
                  <>
                    {(picked || isTarget) && (right ? <Check className="size-3" /> : <X className="size-3 text-destructive" />)}
                    {POS_STYLES[word.pos].name}
                  </>
                )}
              </small>
            </button>
          );
        })}
      </div>
      <p className="mt-2 px-1 text-sm text-muted-foreground">뜻: {question.translation}</p>
    </div>
  );
}
