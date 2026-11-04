import type { PartRole, PosTag, Register, SpecialStructureType, VocabLevel } from "./types";

// Full class names are spelled out so Tailwind can detect them.
export const ROLE_STYLES: Record<PartRole, { name: string; className: string }> = {
  subject: { name: "주어", className: "bg-part-subject" },
  verb: { name: "동사", className: "bg-part-verb" },
  object: { name: "목적어", className: "bg-part-object" },
  complement: { name: "보어", className: "bg-part-complement" },
  modifier: { name: "수식어", className: "bg-part-modifier" },
  connector: { name: "연결어", className: "bg-part-connector" },
};

export const POS_STYLES: Record<PosTag, { name: string; className: string }> = {
  noun: { name: "명사", className: "bg-pos-noun" },
  pronoun: { name: "대명사", className: "bg-pos-pronoun" },
  verb: { name: "동사", className: "bg-pos-verb" },
  auxiliary: { name: "조동사", className: "bg-pos-auxiliary" },
  adjective: { name: "형용사", className: "bg-pos-adjective" },
  adverb: { name: "부사", className: "bg-pos-adverb" },
  preposition: { name: "전치사", className: "bg-pos-preposition" },
  determiner: { name: "한정사", className: "bg-pos-determiner" },
  conjunction: { name: "접속사", className: "bg-pos-conjunction" },
  number: { name: "수사", className: "bg-pos-determiner" },
  other: { name: "기타", className: "bg-secondary" },
};

export const SPECIAL_LABELS: Record<SpecialStructureType, string> = {
  inversion: "도치",
  ellipsis: "생략",
  emphasis: "강조",
  insertion: "삽입",
  apposition: "동격",
  other: "기타 구문",
};

export const VOCAB_LEVEL_LABELS: Record<VocabLevel, string> = {
  basic: "기초",
  intermediate: "중급",
  advanced: "고급",
};

export const REGISTER_LABELS: Record<Register, string> = {
  general: "일반",
  business: "비즈니스",
  academic: "학술",
  formal: "격식",
  informal: "구어",
};

export function formatPattern(form: number | null, formula: string) {
  return form ? `${form}형식 · ${formula}` : formula;
}
