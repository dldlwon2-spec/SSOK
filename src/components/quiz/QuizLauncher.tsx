"use client";

import { useState } from "react";
import { QuizDialog } from "./QuizDialog";

interface QuizLauncherProps {
  className?: string;
  children: React.ReactNode;
}

export function QuizLauncher({ className, children }: QuizLauncherProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <QuizDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
