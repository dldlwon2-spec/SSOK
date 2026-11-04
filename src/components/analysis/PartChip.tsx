import { ROLE_STYLES } from "@/lib/analysis/labels";
import type { SentencePart } from "@/lib/analysis/types";

export function PartChip({ part }: { part: SentencePart }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={`rounded-xl px-3 py-1.5 text-base @sm:text-lg @md:text-[19px] ${ROLE_STYLES[part.role].className}`}>{part.text}</span>
      <small className="text-center text-xs text-muted-foreground">{part.label}</small>
    </div>
  );
}
