import { SectionCard } from "@/components/common/SectionCard";
import { formatPattern, ROLE_STYLES } from "@/lib/analysis/labels";
import type { AnalysisResult, PartRole } from "@/lib/analysis/types";
import { PartChip } from "./PartChip";

interface StructureCardProps {
  result: Pick<AnalysisResult, "parts" | "pattern" | "summary">;
  title?: string;
  /** compact hides the per-part explanations (중급·고급 모드). */
  variant?: "detailed" | "compact";
}

export function StructureCard({ result, title = "문장 구조", variant = "detailed" }: StructureCardProps) {
  const usedRoles = [...new Set(result.parts.map((p) => p.role))] as PartRole[];
  const detailed = variant === "detailed";

  return (
    <SectionCard
      title={title}
      badge={formatPattern(result.pattern.form, result.pattern.formula)}
      description={result.summary}
    >
      <div className={`flex flex-wrap gap-x-2.5 gap-y-3.5 ${detailed ? "border-b border-border pb-7" : ""}`}>
        {result.parts.map((part, i) => (
          <PartChip key={i} part={part} />
        ))}
      </div>

      {detailed && (
        <div className="mt-6 grid gap-4">
          {result.parts.map((part, i) => (
            <p key={i} className="text-muted-foreground">
              <strong className="text-foreground">{part.text}</strong> — {part.explanation}
            </p>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-muted-foreground">
        {usedRoles.map((role) => (
          <span key={role} className="inline-flex items-center gap-1.5">
            <i className={`inline-block size-3 rounded ${ROLE_STYLES[role].className}`} />
            {ROLE_STYLES[role].name}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
