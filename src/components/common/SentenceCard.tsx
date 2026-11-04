import Link from "next/link";

interface SentenceCardProps {
  sentence: string;
  index?: number;
  caption?: string;
  meta?: string;
}

export function SentenceCard({ sentence, index, caption, meta }: SentenceCardProps) {
  return (
    <Link
      href={`/analyze?q=${encodeURIComponent(sentence)}`}
      className="flex w-full items-center gap-4 rounded-[18px] border border-border bg-card px-5 py-4 text-left shadow-soft transition hover:-translate-y-px hover:border-input"
    >
      {index !== undefined && (
        <span className="min-w-5 text-sm text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
      )}
      <span className="flex-1">
        {sentence}
        {caption && <small className="block text-sm text-muted-foreground">{caption}</small>}
        {meta && <small className="mt-1 block text-xs font-bold text-muted-foreground">{meta}</small>}
      </span>
    </Link>
  );
}
