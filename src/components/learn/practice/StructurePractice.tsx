"use client";

import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { formatPattern, ROLE_STYLES } from "@/lib/analysis/labels";
import type { PartRole, SentencePart, SentencePattern } from "@/lib/analysis/types";

const PALETTE: PartRole[] = ["subject", "verb", "object", "complement", "modifier", "connector"];
const FORMS = [1, 2, 3, 4, 5] as const;

interface StructurePracticeProps {
  parts: SentencePart[];
  pattern: SentencePattern;
  onChecked: (score: number, formCorrect: boolean | null) => void;
}

export function StructurePractice({ parts, pattern, onChecked }: StructurePracticeProps) {
  const [brush, setBrush] = useState<PartRole>("subject");
  const [answers, setAnswers] = useState<(PartRole | null)[]>(() => parts.map(() => null));
  const [formAnswer, setFormAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const askForm = pattern.form !== null;
  const ready = answers.every(Boolean) && (!askForm || formAnswer !== null);
  const correctCount = parts.filter((p, i) => answers[i] === p.role).length;
  const formCorrect = askForm ? formAnswer === pattern.form : null;

  const paint = (i: number) => {
    if (checked) return;
    setAnswers((prev) => prev.map((role, idx) => (idx === i ? (role === brush ? null : brush) : role)));
  };

  const check = () => {
    setChecked(true);
    onChecked(correctCount / parts.length, formCorrect);
  };

  const retry = () => {
    setAnswers(parts.map(() => null));
    setFormAnswer(null);
    setChecked(false);
  };

  return (
    <SectionCard title="1. 구조 분석 연습" description="성분을 고른 뒤, 문장 덩어리를 눌러 색을 칠해 보세요.">
      <div className="mb-5 flex flex-wrap gap-2" role="radiogroup" aria-label="칠할 문장 성분">
        {PALETTE.map((role) => (
          <button
            key={role}
            role="radio"
            aria-checked={brush === role}
            onClick={() => setBrush(role)}
            disabled={checked}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-sm font-bold transition disabled:opacity-50 ${
              brush === role ? "border-foreground bg-background" : "border-border"
            }`}
          >
            <i className={`inline-block size-3.5 rounded ${ROLE_STYLES[role].className}`} />
            {ROLE_STYLES[role].name}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-2.5 gap-y-4 rounded-2xl bg-background p-4">
        {parts.map((part, i) => {
          const answer = answers[i];
          const right = answer === part.role;
          const shownRole = checked ? part.role : answer;
          return (
            <button
              key={i}
              onClick={() => paint(i)}
              disabled={checked}
              aria-label={`${part.text}: ${answer ? ROLE_STYLES[answer].name : "미지정"}`}
              className="flex max-w-full flex-col items-start gap-1.5 text-left"
            >
              <span
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl px-3 py-1.5 text-base transition @sm:text-[17px] ${
                  shownRole ? ROLE_STYLES[shownRole].className : "border border-dashed border-input bg-card"
                } ${checked ? (right ? "ring-2 ring-part-verb" : "ring-2 ring-destructive/60") : "hover:ring-2 hover:ring-input"}`}
              >
                {part.text}
              </span>
              <small className="flex items-center gap-1 px-1 text-xs text-muted-foreground">
                {checked ? (
                  <>
                    {right ? <Check className="size-3.5 text-foreground" /> : <X className="size-3.5 text-destructive" />}
                    {part.label}
                    {!right && answer && <s className="ml-1 opacity-70">{ROLE_STYLES[answer].name}</s>}
                  </>
                ) : (
                  (answer && ROLE_STYLES[answer].name) ?? "?"
                )}
              </small>
            </button>
          );
        })}
      </div>

      {askForm && (
        <div className="mt-5">
          <p className="mb-2 font-bold">이 문장은 몇 형식일까요?</p>
          <div className="flex flex-wrap gap-2">
            {FORMS.map((n) => {
              const state = !checked
                ? formAnswer === n
                  ? "border-foreground bg-primary text-primary-foreground"
                  : "border-border hover:border-input"
                : n === pattern.form
                  ? "border-part-verb bg-part-verb"
                  : n === formAnswer
                    ? "border-destructive/50 bg-destructive/10"
                    : "border-border opacity-50";
              return (
                <button
                  key={n}
                  onClick={() => setFormAnswer(n)}
                  disabled={checked}
                  aria-pressed={formAnswer === n}
                  className={`min-h-11 rounded-full border px-4 text-sm font-bold transition ${state}`}
                >
                  {n}형식
                </button>
              );
            })}
          </div>
        </div>
      )}

      {checked ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent px-4 py-3">
          <p>
            <strong>
              {parts.length}개 중 {correctCount}개 정답
            </strong>
            {formCorrect !== null && <span className="text-muted-foreground"> · 문장 형식 {formCorrect ? "정답" : "오답"}</span>}
            <span className="block text-sm text-muted-foreground">{formatPattern(pattern.form, pattern.formula)}</span>
          </p>
          <button onClick={retry} className="inline-flex items-center gap-1.5 min-h-11 rounded-full border border-border bg-card px-4 text-sm font-bold">
            <RotateCcw className="size-4" />
            다시 풀기
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <button
            onClick={check}
            disabled={!ready}
            className="w-full rounded-2xl bg-primary px-6 py-3.5 font-bold text-primary-foreground shadow-ink transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            정답 확인
          </button>
          {!ready && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              모든 덩어리에 성분을 칠하{askForm ? "고 문장 형식을 고르" : ""}면 확인할 수 있어요.
            </p>
          )}
        </div>
      )}
    </SectionCard>
  );
}
