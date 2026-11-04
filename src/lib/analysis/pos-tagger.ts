import nlp from "compromise";
import type { PosTag, Token } from "./types";

interface CompromiseTerm {
  text: string;
  post: string;
  tags: string[];
}

// Order matters: compromise attaches several tags to a term (e.g. "was" is both Copula and Verb).
const TAG_PRIORITY: [string, PosTag][] = [
  ["Pronoun", "pronoun"],
  ["Modal", "auxiliary"],
  ["Auxiliary", "auxiliary"],
  ["Verb", "verb"],
  ["Determiner", "determiner"],
  ["Preposition", "preposition"],
  ["Conjunction", "conjunction"],
  ["Adjective", "adjective"],
  ["Adverb", "adverb"],
  ["Value", "number"],
  ["Noun", "noun"],
];

function toPos(tags: string[]): PosTag {
  return TAG_PRIORITY.find(([tag]) => tags.includes(tag))?.[1] ?? "other";
}

export function tagSentence(sentence: string): Token[] {
  const sentences = nlp(sentence).json() as { terms: CompromiseTerm[] }[];

  return sentences
    .flatMap((s) => s.terms)
    .map((term) => ({
      text: term.text,
      trailing: term.post,
      pos: toPos(term.tags),
      tags: term.tags,
    }));
}

export function joinTokens(tokens: Token[]): string {
  return tokens
    .map((t) => t.text + t.trailing)
    .join("")
    .trim();
}
