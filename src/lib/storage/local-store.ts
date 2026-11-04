export interface LocalStore<T> {
  get: () => T;
  set: (update: (prev: T) => T) => void;
  subscribe: (listener: () => void) => () => void;
  getServerSnapshot: () => T;
}

/**
 * A tiny localStorage-backed store compatible with useSyncExternalStore.
 * `parse` sanitizes whatever was stored (older shapes, hand-edited values).
 */
export function createLocalStore<T>(key: string, fallback: T, parse: (raw: unknown) => T = (v) => v as T): LocalStore<T> {
  const listeners = new Set<() => void>();
  // useSyncExternalStore requires the same reference while the stored string is unchanged.
  let cachedRaw: string | null | undefined;
  let cachedValue = fallback;

  const get = () => {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    try {
      cachedValue = raw === null ? fallback : parse(JSON.parse(raw));
    } catch {
      cachedValue = fallback;
    }
    return cachedValue;
  };

  return {
    get,
    set(update) {
      localStorage.setItem(key, JSON.stringify(update(get())));
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    getServerSnapshot: () => fallback,
  };
}