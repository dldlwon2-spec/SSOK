export interface LlmProvider {
  name: string;
  generateJson(systemPrompt: string, userPrompt: string): Promise<unknown>;
}

function createGeminiProvider(apiKey: string, model: string): LlmProvider {
  return {
    name: `gemini:${model}`,
    async generateJson(systemPrompt, userPrompt) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
          }),
        },
      );

      if (!res.ok) {
        throw new Error(`Gemini request failed (${res.status}): ${await res.text()}`);
      }

      const data = await res.json();
      const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini returned an empty response");
      return JSON.parse(text);
    },
  };
}

/** Returns null when no AI key is configured, so callers can fall back to rule-based analysis. */
export function getLlmProvider(): LlmProvider | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return createGeminiProvider(apiKey, process.env.GEMINI_MODEL || "gemini-2.5-flash");
}
