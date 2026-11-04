import { SectionCard } from "@/components/common/SectionCard";
import type { GrammarPoint } from "@/lib/analysis/types";

export function GrammarPoints({ points }: { points: GrammarPoint[] }) {
  if (points.length === 0) return null;

  return (
    <SectionCard title="핵심 문법">
      <ol className="divide-y divide-border">
        {points.map((point, i) => (
          <li key={point.title} className="flex gap-4 py-4.5 first:pt-0 last:pb-0">
            <span className="grid size-7 flex-none place-items-center rounded-full bg-primary text-sm text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <h3 className="mb-1.5 text-[17px] font-bold">{point.title}</h3>
              <p className="text-muted-foreground">{point.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </SectionCard>
  );
}

export function TipCard({ tip }: { tip: string }) {
  if (!tip) return null;
  return (
    <section className="mt-5 rounded-[22px] bg-accent px-6 py-5">
      <h3 className="mb-1 font-pen text-2xl @md:text-[28px]">쏙 포인트</h3>
      <p>{tip}</p>
    </section>
  );
}
