export const MAX_SENTENCE_LENGTH = 500;

export class AnalysisInputError extends Error {}

export function normalizeSentence(input: string): string {
  const sentence = input.replace(/\s+/g, " ").trim();

  if (!sentence) throw new AnalysisInputError("문장을 입력해 주세요.");
  if (sentence.length > MAX_SENTENCE_LENGTH) {
    throw new AnalysisInputError(`${MAX_SENTENCE_LENGTH}자 이내로 입력해 주세요.`);
  }

  const letters = sentence.replace(/[\s\d\p{P}\p{S}]/gu, "");
  const latin = letters.match(/[A-Za-z]/g)?.length ?? 0;
  if (latin === 0 || latin / letters.length < 0.8) {
    throw new AnalysisInputError("영어 문장을 입력해 주세요.");
  }

  return sentence;
}
