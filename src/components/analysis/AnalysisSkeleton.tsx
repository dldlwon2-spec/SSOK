export function AnalysisSkeleton() {
  return (
    <div className="py-20 text-center" role="status">
      <div className="inline-flex gap-2">
        {[0, 150, 300].map((delay) => (
          <i
            key={delay}
            className="size-3 animate-bounce rounded-full bg-foreground"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      <p className="mt-5 font-pen text-3xl">문장을 쏙쏙 뜯어보는 중…</p>
    </div>
  );
}
