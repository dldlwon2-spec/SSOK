import { EmptyNote, SectionCard } from "@/components/common/SectionCard";
import type { PatternTag } from "@/lib/analysis/types";

export function PatternTagList({ tags }: { tags: PatternTag[] }) {
  return (
    <SectionCard title="주요 구문 패턴">
      {tags.length === 0 ? (
        <EmptyNote>이 문장에서는 눈에 띄는 구문 패턴을 찾지 못했어요.</EmptyNote>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag.name} className="rounded-full bg-primary px-3.5 py-1 text-sm font-bold text-primary-foreground">
                # {tag.name}
              </span>
            ))}
          </div>
          <ul className="divide-y divide-border">
            {tags.map((tag) => (
              <li key={tag.name} className="py-4 first:pt-0 last:pb-0">
                <p className="mb-1 font-bold">
                  {tag.name}
                  <span className="ml-2 rounded-md bg-part-modifier px-1.5 font-normal">{tag.text}</span>
                </p>
                <p className="text-muted-foreground">{tag.description}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </SectionCard>
  );
}
