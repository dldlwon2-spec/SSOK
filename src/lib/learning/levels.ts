export const LEARNER_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type LearnerLevel = (typeof LEARNER_LEVELS)[number];

export const DEFAULT_LEVEL: LearnerLevel = "beginner";

export const isLearnerLevel = (value: unknown): value is LearnerLevel =>
  LEARNER_LEVELS.includes(value as LearnerLevel);

export const LEVEL_INFO: Record<LearnerLevel, { name: string; short: string; description: string; focus: string[] }> = {
  beginner: {
    name: "입문자 모드",
    short: "입문",
    description: "품사와 문장 성분을 색으로 쉽게 구분하고, 해석과 자세한 문법 설명을 함께 봐요.",
    focus: ["품사 색상 표시", "문장 성분", "상세 문법 설명"],
  },
  intermediate: {
    name: "중급자 모드",
    short: "중급",
    description: "의미 단위로 끊어 읽으며 직독직해하고, 관계대명사·분사구문 같은 주요 구문을 태그로 정리해요.",
    focus: ["직독직해 끊어읽기", "구문 패턴 태그"],
  },
  advanced: {
    name: "고급자 모드",
    short: "고급",
    description: "미묘한 뉘앙스와 도치·생략 구문, 비즈니스·학술 어휘 수준, 고급 영작 팁까지 살펴봐요.",
    focus: ["뉘앙스", "도치·생략 구문", "어휘 수준", "영작 팁"],
  },
};
