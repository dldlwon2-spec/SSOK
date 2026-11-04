import { Zap } from "lucide-react";
import { levelFromXp } from "@/lib/curriculum/games";

interface XpBarProps {
  totalXp: number;
  compact?: boolean;
}

export function XpBar({ totalXp, compact }: XpBarProps) {
  const { level, current, needed, ratio } = levelFromXp(totalXp);

  return (
    <div className={compact ? "" : "rounded-2xl bg-background px-4 py-3"}>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 font-bold">
          <span className="grid size-6 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{level}</span>
          Lv.{level}
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Zap className="size-3.5 fill-current text-foreground" />
          {current} / {needed} XP
        </span>
      </div>
      <div
        className="h-2.5 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label="다음 레벨까지 경험치"
        aria-valuemin={0}
        aria-valuemax={needed}
        aria-valuenow={current}
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-part-subject via-part-complement to-part-verb transition-[width] duration-700"
          style={{ width: `${Math.max(ratio * 100, 2)}%` }}
        />
      </div>
    </div>
  );
}
