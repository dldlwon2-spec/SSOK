"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { MAX_SENTENCE_LENGTH } from "@/lib/analysis/preprocess";

export function SentenceInput() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const canSubmit = value.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    router.push(`/analyze?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <section className="rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 shadow-card @sm:p-5 @md:p-7">
      <h2 className="mb-5 flex items-center gap-3 text-xl font-bold">
        <Sparkles className="size-6 fill-current" />
        문장을 입력하세요.
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="relative rounded-[20px] border border-input bg-background transition focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/10"
      >
        <textarea
          aria-label="분석할 영어 문장"
          value={value}
          maxLength={MAX_SENTENCE_LENGTH}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="예) She studies English every morning."
          className="block min-h-40 w-full resize-none @sm:min-h-48 bg-transparent px-5 pt-5 pb-16 outline-none placeholder:text-muted-foreground"
        />
        <span className="absolute bottom-5 left-5 text-sm text-muted-foreground">
          {value.length}/{MAX_SENTENCE_LENGTH}
        </span>
        <button
          type="submit"
          aria-label="문장 분석하기"
          disabled={!canSubmit}
          className="absolute right-5 bottom-5 grid size-15 place-items-center rounded-full bg-primary text-primary-foreground shadow-ink transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0"
        >
          <ArrowRight className="size-5" />
        </button>
      </form>
    </section>
  );
}
