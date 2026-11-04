"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { ROLE_STYLES } from "@/lib/analysis/labels";
import type { PartRole } from "@/lib/analysis/types";
import type { QuizResponse, StructureQuestion } from "@/lib/curriculum/quiz/types";

const PALETTE: PartRole[] = ["subject", "verb", "object", "complement", "modifier", "connector"];

type StructureResponse = Extract<QuizResponse, { type: "pick" | "tag" }>;

interface StructureQuestionViewProps {
  question: StructureQuestion;
  response: StructureResponse;
  submitted: boolean;
  onChange: (response: StructureResponse) => void;
}

export function StructureQuestionView({ question, response, submitted, onChange }: StructureQuestionViewProps) {
  const [brush, setBrush] = useState<PartRole>("subject");

  const toggle = (i: number) => {
    if (submitted) return;
    if (response.type === "pick") {
      const selected = response.selected.includes(i) ? response.selected.filter((s) => s !== i) : [...response.selected, i];
      onChange({ type: "pick", selected });
    } else {
      onChange({ type: "tag", tags: response.tags.map((t, idx) => (idx === i ? (t === brush ? null : brush) : t)) });
    }
  };

  return (
    <div>
      {response.type === "tag" && (
        <div className="mb-4 flex flex-wrap gap-2" role="radiogroup" aria-label="태깅할 문장 성분">
          {PALETTE.map((role) => (
            <button
              key={role}
              role="radio"
              aria-checked={brush === role}
              onClick={() => setBrush(role)}
              disabled={submitted}
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-bold transition disabled:opacity-50 ${
                brush === role ? "border-foreground bg-background" : "border-border"
              }`}
            >
              <i className={`inline-block size-3.5 rounded ${ROLE_STYLES[role].className}`} />
              {ROLE_STYLES[role].name}
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-x-2.5 gap-y-4 rounded-2xl bg-background p-4">
        {question.parts.map((part, i) => {
          const picked = response.type === "pick" && response.selected.includes(i);
          const tag = response.type === "tag" ? response.tags[i] : null;
          const shouldPick = part.role === question.target;
          const right = response.type === "pick" ? picked === shouldPick : tag === part.role;

          let fill = "border border-dashed border-input bg-card";
          if (submitted) fill = response.type === "tag" || shouldPick ? ROLE_STYLES[part.role].className : "bg-card border border-border";
          else if (picked) fill = "bg-primary text-primary-foreground";
          else if (tag) fill = ROLE_STYLES[tag].className;

          const ring = submitted ? (right ? "" : "ring-2 ring-destructive/60") : "hover:ring-2 hover:ring-input";
          const showMark = submitted && (response.type === "tag" || picked || shouldPick);

          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              disabled={submitted}
              aria-pressed={response.type === "pick" ? picked : undefined}
              className="flex max-w-full flex-col items-start gap-1.5 text-left"
            >
              <span className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3 py-1.5 text-base transition @sm:text-[17px] ${fill} ${ring}`}>{part.text}</span>
              <small className="flex min-h-4 items-center gap-1 px-1 text-xs text-muted-foreground">
                {showMark ? (
                  <>
                    {right ? <Check className="size-3.5 text-foreground" /> : <X className="size-3.5 text-destructive" />}
                    {ROLE_STYLES[part.role].name}
                  </>
                ) : (
                  response.type === "tag" && (tag ? ROLE_STYLES[tag].name : "?")
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
