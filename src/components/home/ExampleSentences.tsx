import { BookOpen } from "lucide-react";
import { SentenceCard } from "@/components/common/SentenceCard";
import { SAMPLE_SENTENCES } from "@/lib/analysis/samples";

export function ExampleSentences() {
  return (
    <section className="mt-14">
      <h2 className="mb-3.5 flex items-center gap-2.5 font-bold">
        <BookOpen className="size-5" />이 문장으로 시작해 보세요
      </h2>
      <div className="grid gap-2.5">
        {SAMPLE_SENTENCES.map((sentence, i) => (
          <SentenceCard key={sentence} sentence={sentence} index={i} />
        ))}
      </div>
    </section>
  );
}
