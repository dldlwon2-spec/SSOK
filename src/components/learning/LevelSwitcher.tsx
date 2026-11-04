"use client";

import { useRef } from "react";
import { Check, ChevronDown, Sparkles, X } from "lucide-react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { LEARNER_LEVELS, LEVEL_INFO } from "@/lib/learning/levels";
import { levelStore, setLevel } from "@/lib/storage/preferences";

export function LevelSwitcher() {
  const level = useLocalStore(levelStore);
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        className="mt-1.5 inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm @md:mt-4 text-muted-foreground shadow-soft transition hover:border-input"
      >
        <Sparkles className="size-4 text-foreground" />
        {LEVEL_INFO[level].name}
        <ChevronDown className="size-4" />
      </button>

      <dialog
        ref={dialogRef}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        className="m-auto w-[min(440px,calc(100%-24px))] rounded-3xl @md:rounded-[28px] border border-border bg-card p-5 text-foreground shadow-card backdrop:bg-black/30 backdrop:backdrop-blur-[2px]"
      >
        <div className="mb-1.5 flex items-center justify-between">
          <h2 className="text-xl font-bold">학습 수준 선택</h2>
          <button onClick={() => dialogRef.current?.close()} aria-label="닫기" className="grid size-11 place-items-center rounded-full hover:bg-secondary">
            <X className="size-5" />
          </button>
        </div>
        <p className="mb-5 text-sm text-muted-foreground">수준에 맞춰 분석 화면과 복습 퀴즈가 달라져요. 언제든 바꿀 수 있어요.</p>

        <ul className="grid gap-2.5" role="radiogroup" aria-label="학습 수준">
          {LEARNER_LEVELS.map((id) => {
            const info = LEVEL_INFO[id];
            const active = id === level;
            return (
              <li key={id}>
                <button
                  role="radio"
                  aria-checked={active}
                  onClick={() => {
                    setLevel(id);
                    dialogRef.current?.close();
                  }}
                  className={`flex w-full items-start gap-3 rounded-[18px] border p-4 text-left transition ${
                    active ? "border-foreground bg-background" : "border-border hover:border-input"
                  }`}
                >
                  <span className="flex-1">
                    <span className="block font-bold">{info.name}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{info.description}</span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {info.focus.map((f) => (
                        <span key={f} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                          {f}
                        </span>
                      ))}
                    </span>
                  </span>
                  {active && <Check className="mt-0.5 size-5" />}
                </button>
              </li>
            );
          })}
        </ul>
      </dialog>
    </>
  );
}
