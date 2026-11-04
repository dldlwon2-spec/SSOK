"use client";

import { useEffect, useRef } from "react";

/**
 * Restarts a CSS animation class on the same element whenever `trigger` changes,
 * instead of remounting the element with a new key.
 */
export function useReplayAnimation<T extends HTMLElement>(trigger: unknown, className: string) {
  const ref = useRef<T>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = ref.current;
    if (!el) return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
  }, [trigger, className]);

  return ref;
}
