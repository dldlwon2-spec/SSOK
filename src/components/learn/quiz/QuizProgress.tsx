interface QuizProgressProps {
  total: number;
  current: number;
  results: boolean[];
}

/** One segment per question: green = correct, red = wrong, dark = current. */
export function QuizProgress({ total, current, results }: QuizProgressProps) {
  const score = results.filter(Boolean).length;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-bold">
        <span>
          문제 {Math.min(current + 1, total)} <span className="text-muted-foreground">/ {total}</span>
        </span>
        <span className="rounded-full bg-secondary px-3 py-0.5">점수 {score}</span>
      </div>
      <div className="flex gap-1" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={results.length}>
        {Array.from({ length: total }, (_, i) => {
          const color =
            i < results.length ? (results[i] ? "bg-part-verb" : "bg-destructive/50") : i === current ? "bg-primary" : "bg-secondary";
          return <span key={i} className={`h-2 flex-1 rounded-full transition-colors ${color}`} />;
        })}
      </div>
    </div>
  );
}
