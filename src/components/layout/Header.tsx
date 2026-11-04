import Link from "next/link";
import { LevelSwitcher } from "@/components/learning/LevelSwitcher";

export function Header() {
  return (
    <header className="flex items-start justify-between gap-3">
      <Link
        href="/"
        aria-label="문장쏙 홈"
        className="relative min-h-11 min-w-11 pb-2.5 font-pen text-5xl leading-[0.9] after:absolute after:inset-x-[10%] after:bottom-1 after:h-[3px] after:-rotate-3 after:rounded-full after:bg-foreground @md:text-6xl"
      >
        쏙
      </Link>
      <LevelSwitcher />
    </header>
  );
}
