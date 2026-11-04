"use client";

import Link from "next/link";
import { BookOpen, Gamepad2, GraduationCap, NotebookPen } from "lucide-react";
import { useLocalStore } from "@/hooks/useLocalStore";
import { needsReview, reviewStore } from "@/lib/storage/learn-quiz";

export type LearnTab = "sentences" | "games" | "quiz" | "review";

const TABS: { id: LearnTab; href: string; label: string; Icon: typeof BookOpen }[] = [
  { id: "sentences", href: "/learn", label: "문장 학습", Icon: BookOpen },
  { id: "games", href: "/learn/games", label: "게임", Icon: Gamepad2 },
  { id: "quiz", href: "/learn/quiz", label: "단계 퀴즈", Icon: GraduationCap },
  { id: "review", href: "/learn/review", label: "오답 노트", Icon: NotebookPen },
];

export function LearnTabs({ active }: { active: LearnTab }) {
  const pending = Object.values(useLocalStore(reviewStore)).filter(needsReview).length;

  return (
    <nav aria-label="수준별 학습 메뉴" className="mb-5 grid grid-cols-4 gap-2 rounded-[22px] border border-border bg-card p-2 shadow-soft">
      {TABS.map(({ id, href, label, Icon }) => {
        const isActive = id === active;
        const isGame = id === "games";
        return (
          <Link
            key={id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`relative flex flex-col items-center gap-1 rounded-2xl min-h-16 px-1 py-2.5 text-xs font-bold @sm:text-sm transition ${
              isActive
                ? "bg-primary text-primary-foreground shadow-ink"
                : isGame
                  ? "bg-accent text-foreground hover:-translate-y-px"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="size-6" strokeWidth={isActive || isGame ? 2.2 : 1.8} />
            {label}
            {isGame && !isActive && (
              <span className="absolute -top-1.5 right-1 rounded-full bg-destructive px-1.5 py-px text-[10px] leading-4 text-white">GAME</span>
            )}
            {id === "review" && pending > 0 && (
              <span className="absolute -top-1.5 right-1 min-w-5 rounded-full bg-destructive px-1.5 py-px text-center text-[10px] leading-4 text-white">
                {pending}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
