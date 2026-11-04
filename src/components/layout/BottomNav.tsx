"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Clock, GraduationCap, House } from "lucide-react";

const TABS = [
  { href: "/", label: "홈", Icon: House, match: (p: string) => p === "/" || p.startsWith("/analyze") },
  { href: "/learn", label: "수준별 학습", Icon: GraduationCap, match: (p: string) => p.startsWith("/learn") },
  { href: "/recent", label: "최근 분석", Icon: Clock, match: (p: string) => p.startsWith("/recent") },
  { href: "/notebook", label: "내 노트", Icon: Bookmark, match: (p: string) => p.startsWith("/notebook") },
];

/** Pinned to the bottom of the app frame (same width as the frame, not the whole window). */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="하단 메뉴"
      className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:border-x md:max-w-lg"
    >
      <div className="flex">
        {TABS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-xs font-bold transition-colors @sm:text-sm ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-6" strokeWidth={active ? 2.4 : 1.8} fill={active && href === "/" ? "currentColor" : "none"} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
