import { EmptyNote, SectionCard } from "@/components/common/SectionCard";
import type { ReadingChunk } from "@/lib/analysis/types";

export function ChunkReading({ chunks }: { chunks: ReadingChunk[] }) {
  const hasMeanings = chunks.some((c) => c.meaning);

  return (
    <SectionCard title="직독직해 끊어읽기" description="의미 단위로 끊어서 영어 어순 그대로 이해해 보세요.">
      <p className="mb-6 text-[19px] leading-relaxed">
        {chunks.map((chunk, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-1.5 font-bold text-muted-foreground">/</span>}
            <span className="rounded-md bg-part-object/60 px-1 py-0.5">{chunk.text}</span>
          </span>
        ))}
      </p>

      {hasMeanings ? (
        <ol className="grid gap-3">
          {chunks.map((chunk, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span className="font-pen text-xl text-muted-foreground">{i + 1}</span>
              <span className="font-bold">{chunk.text}</span>
              <span className="text-muted-foreground">→ {chunk.meaning || "—"}</span>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyNote>덩어리별 뜻은 AI 분석을 연결하면 볼 수 있어요.</EmptyNote>
      )}
    </SectionCard>
  );
}
