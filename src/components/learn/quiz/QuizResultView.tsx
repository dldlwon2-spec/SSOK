import Link from "next/link";
import { Trophy } from "lucide-react";
import { questionPreview, QUIZ_TYPE_LABELS } from "@/lib/curriculum/quiz";
import type { QuizQuestion } from "@/lib/curriculum/quiz/types";

interface QuizResultViewProps {
  questions: QuizQuestion[];
  results: boolean[];
  mode: "stage" | "review";
  isBest: boolean;
  onRetry: () => void;
  onExit: () => void;
}

function message(ratio: number) {
  if (ratio === 1) return "완벽해요! 구조가 쏙 들어왔네요.";
  if (ratio >= 0.7) return "훌륭해요! 틀린 문제만 다시 보면 완성이에요.";
  if (ratio >= 0.4) return "좋은 출발이에요. 오답 노트로 한 번 더 복습해 봐요.";
  return "괜찮아요. 문장 학습을 다시 보고 도전해 봐요.";
}

export function QuizResultView({ questions, results, mode, isBest, onRetry, onExit }: QuizResultViewProps) {
  const score = results.filter(Boolean).length;
  const ratio = questions.length ? score / questions.length : 0;
  const wrong = questions.filter((_, i) => !results[i]);

  const breakdown = (Object.keys(QUIZ_TYPE_LABELS) as QuizQuestion["type"][])
    .map((type) => {
      const idx = questions.flatMap((q, i) => (q.type === type ? [i] : []));
      return { type, total: idx.length, correct: idx.filter((i) => results[i]).length };
    })
    .filter((b) => b.total > 0);

  return (
    <section className="mt-6">
      <div className="rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 text-center shadow-card @sm:p-5 @md:p-7">
        {isBest && mode === "stage" && (
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-sm font-bold">
            <Trophy className="size-4" />
            최고 기록 갱신!
          </p>
        )}
        <p className="font-pen text-6xl @md:text-7xl leading-none">
          {score} <span className="text-4xl text-muted-foreground">/ {questions.length}</span>
        </p>
        <div className="mx-auto mt-4 h-3 max-w-xs overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${ratio * 100}%` }} />
        </div>
        <p className="mt-2 text-sm font-bold text-muted-foreground">정답률 {Math.round(ratio * 100)}%</p>
        <p className="mt-3 text-lg">{message(ratio)}</p>

        <ul className="mt-6 grid gap-2.5 text-left">
          {breakdown.map((b) => (
            <li key={b.type} className="flex items-center gap-3">
              <span className="w-20 flex-none text-sm font-bold">{QUIZ_TYPE_LABELS[b.type]}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <span className="block h-full rounded-full bg-part-verb" style={{ width: `${(b.correct / b.total) * 100}%` }} />
              </span>
              <span className="w-10 text-right text-sm text-muted-foreground">
                {b.correct}/{b.total}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {wrong.length > 0 && (
        <div className="mt-5 rounded-3xl @md:rounded-[28px] border border-border bg-card p-4 shadow-card @sm:p-6">
          <h2 className="mb-1 text-lg font-bold">틀린 문제 {wrong.length}개</h2>
          <p className="mb-4 text-sm text-muted-foreground">오답 노트에 저장했어요. 해설을 다시 보고 복습해 보세요.</p>
          <ul className="grid gap-2">
            {wrong.map((q) => (
              <li key={q.id} className="rounded-2xl bg-background px-4 py-3">
                <p className="text-xs font-bold text-muted-foreground">
                  {QUIZ_TYPE_LABELS[q.type]} · {q.skill}
                </p>
                <p className="truncate">{questionPreview(q)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2.5">
        <button onClick={onRetry} className="rounded-2xl border border-border bg-card px-5 py-3.5 font-bold">
          다시 풀기
        </button>
        {wrong.length > 0 && mode === "stage" ? (
          <Link href="/learn/review" className="rounded-2xl bg-primary px-5 py-3.5 text-center font-bold text-primary-foreground shadow-ink">
            오답 노트 보기
          </Link>
        ) : (
          <button onClick={onExit} className="rounded-2xl bg-primary px-5 py-3.5 font-bold text-primary-foreground shadow-ink">
            {mode === "stage" ? "퀴즈 홈으로" : "오답 노트로"}
          </button>
        )}
      </div>
    </section>
  );
}
