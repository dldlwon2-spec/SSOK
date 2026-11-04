import { DEFAULT_LEVEL, isLearnerLevel, type LearnerLevel } from "@/lib/learning/levels";
import { createLocalStore } from "./local-store";

export const levelStore = createLocalStore<LearnerLevel>("ssok:level", DEFAULT_LEVEL, (raw) =>
  isLearnerLevel(raw) ? raw : DEFAULT_LEVEL,
);

export function setLevel(level: LearnerLevel) {
  levelStore.set(() => level);
}
