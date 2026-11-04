import { joinTokens } from "./pos-tagger";
import type { LlmAnalysis } from "./schema";
import type { PatternTag, SentencePart, Token } from "./types";

const AI_ONLY_FIELDS = {
  nuance: "",
  specialStructures: [],
  vocabulary: [],
  writingTips: [],
} satisfies Partial<LlmAnalysis>;

const LINKING_VERBS = new Set([
  "be", "am", "is", "are", "was", "were", "been", "being",
  "become", "becomes", "became", "seem", "seems", "seemed",
  "look", "looks", "looked", "feel", "feels", "felt",
  "remain", "remains", "remained", "sound", "sounds", "sounded",
]);

const SUBORDINATORS = new Set([
  "if", "when", "because", "although", "though", "while",
  "since", "after", "before", "unless", "once",
]);

const isVerbish = (t: Token) => t.pos === "verb" || t.pos === "auxiliary" || t.tags.includes("Negative");
const startsModifier = (t: Token) =>
  t.pos === "preposition" || t.tags.includes("Date") || t.tags.includes("Time");

function part(tokens: Token[], role: SentencePart["role"], label: string, explanation: string): SentencePart {
  return { text: joinTokens(tokens), role, label, explanation };
}

/**
 * Offline fallback used when no AI provider is configured.
 * It only finds the sentence skeleton (S / V / O or C / modifiers) from POS tags,
 * so translations and nuanced grammar notes are left to the AI path.
 */
export function analyzeByRules(tokens: Token[]): LlmAnalysis {
  const parts: SentencePart[] = [];
  let i = 0;

  if (tokens.length > 0 && SUBORDINATORS.has(tokens[0].text.toLowerCase())) {
    const commaIdx = tokens.findIndex((t) => t.trailing.includes(","));
    if (commaIdx > 0) {
      parts.push(part(tokens.slice(0, commaIdx + 1), "modifier", "부사절", "주절을 꾸며 주는 조건·시간·이유의 절입니다."));
      i = commaIdx + 1;
    }
  }

  const verbStart = tokens.findIndex((t, idx) => idx >= i && isVerbish(t));
  if (verbStart === -1) {
    return {
      translation: "",
      pattern: { form: null, formula: "동사를 찾지 못했어요" },
      summary: "동사를 찾지 못해 문장 구조를 나누지 못했어요. 완전한 문장인지 확인해 주세요.",
      parts: [part(tokens, "modifier", "구", "동사가 없는 구 형태입니다.")],
      grammarPoints: [],
      tip: "영어 문장에는 반드시 동사가 하나 이상 있어야 해요.",
      chunks: [{ text: joinTokens(tokens), meaning: "" }],
      patternTags: [],
      ...AI_ONLY_FIELDS,
    };
  }

  if (verbStart > i) {
    parts.push(part(tokens.slice(i, verbStart), "subject", "주어", "문장의 주인공으로, 동작이나 상태의 주체입니다."));
  }

  let verbEnd = verbStart;
  while (verbEnd < tokens.length && isVerbish(tokens[verbEnd])) verbEnd++;
  const verbTokens = tokens.slice(verbStart, verbEnd);
  parts.push(part(verbTokens, "verb", "동사", "주어의 동작이나 상태를 나타냅니다."));

  const rest = tokens.slice(verbEnd);
  const modIdx = rest.findIndex(startsModifier);
  const core = modIdx === -1 ? rest : rest.slice(0, modIdx);
  const tail = modIdx === -1 ? [] : rest.slice(modIdx);

  const mainVerb = verbTokens[verbTokens.length - 1].text.toLowerCase();
  let form: 1 | 2 | 3 = 1;
  if (core.length > 0) {
    if (LINKING_VERBS.has(mainVerb)) {
      parts.push(part(core, "complement", "주격 보어", "주어의 상태나 성질을 보충 설명합니다."));
      form = 2;
    } else if (core.every((t) => t.pos === "adverb")) {
      parts.push(part(core, "modifier", "부사", "동사를 꾸며 줍니다."));
    } else {
      parts.push(part(core, "object", "목적어", "동사의 대상이 되는 말입니다."));
      form = 3;
    }
  }
  if (tail.length > 0) {
    parts.push(part(tail, "modifier", "부사구", "시간·장소·방법 등을 더해 주는 수식어입니다."));
  }

  const formula = { 1: "S + V", 2: "S + V + C", 3: "S + V + O" }[form];
  const patternTags = detectPatterns(tokens);

  return {
    translation: "",
    pattern: { form, formula },
    summary: "품사 태깅을 바탕으로 문장의 뼈대를 추정했어요. AI 분석을 연결하면 해석과 자세한 설명을 볼 수 있어요.",
    parts,
    grammarPoints: patternTags.map((t) => ({ title: t.name, description: t.description })),
    tip: "동사를 먼저 찾고, 그 앞부분을 주어로 묶어 보세요.",
    chunks: parts.map((p) => ({ text: p.text, meaning: "" })),
    patternTags,
    ...AI_ONLY_FIELDS,
  };
}

const BE_FORMS = new Set(["am", "is", "are", "was", "were", "be", "been", "being"]);
const RELATIVES = new Set(["who", "whom", "whose", "which", "that"]);

function detectPatterns(tokens: Token[]): PatternTag[] {
  const words = tokens.map((t) => t.text.toLowerCase());
  const isParticiple = (t?: Token) => !!t && (t.tags.includes("PastTense") || t.tags.includes("Participle"));
  const clauseFrom = (start: number) => {
    const end = tokens.findIndex((t, idx) => idx >= start && /[,.;!?]/.test(t.trailing));
    return joinTokens(tokens.slice(start, end === -1 ? tokens.length : end + 1)).replace(/[,.;!?]+$/, "");
  };

  const found = new Map<string, PatternTag>();
  const add = (name: string, text: string, description: string) => {
    if (!found.has(name)) found.set(name, { name, text, description });
  };

  tokens.forEach((token, i) => {
    const w = words[i];
    const next = tokens[i + 1];

    if (w === "if" && words.slice(i).includes("had") && words.includes("would")) {
      add("가정법 과거완료", clauseFrom(i), "If + 주어 + had p.p., 주어 + would have p.p.는 과거 사실과 반대되는 일을 가정합니다.");
    }
    if (RELATIVES.has(w) && tokens[i - 1]?.pos === "noun") {
      add("관계대명사", clauseFrom(i), "명사 바로 뒤의 관계대명사 절은 앞 명사를 꾸며 줍니다.");
    }
    if (token.tags.includes("Modal")) {
      add("조동사", joinTokens(tokens.slice(i, i + 2)), "can, will, would 같은 조동사 뒤에는 동사원형이 옵니다.");
    }
    if ((w === "have" || w === "has" || w === "had") && isParticiple(next)) {
      add("완료 시제", joinTokens(tokens.slice(i, i + 2)), "have/has/had + 과거분사는 어떤 시점까지 이어지거나 끝난 일을 나타냅니다.");
    }
    if (BE_FORMS.has(w) && next?.tags.includes("Participle")) {
      add("수동태", joinTokens(tokens.slice(i, i + 2)), "be동사 + 과거분사는 주어가 동작을 '당하는' 수동태입니다.");
    }
    if (w === "to" && next?.pos === "verb") {
      add("to부정사", joinTokens(tokens.slice(i, i + 2)), "to + 동사원형은 명사·형용사·부사처럼 쓰이는 to부정사입니다.");
    }
  });

  return [...found.values()];
}
