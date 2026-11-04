import { findExerciseBySentence, resolveAnalysis } from "@/lib/curriculum";
import type { LlmAnalysis } from "./schema";

export const SAMPLE_SENTENCES = [
  "She studies English every morning.",
  "The book that you lent me was fascinating.",
  "If I had known the truth, I would have told you.",
] as const;

const SAMPLES: Record<string, LlmAnalysis> = {
  "She studies English every morning.": {
    translation: "그녀는 매일 아침 영어를 공부한다.",
    pattern: { form: 3, formula: "S + V + O" },
    summary: "주어가 어떤 대상을 공부하는지 말하고, 언제 하는지를 덧붙인 문장입니다.",
    parts: [
      { text: "She", role: "subject", label: "주어", explanation: "‘그녀는’이라는 뜻으로, 공부하는 사람입니다." },
      { text: "studies", role: "verb", label: "동사", explanation: "‘공부한다’라는 뜻의 일반동사로, 주어가 3인칭 단수라서 -es가 붙었습니다." },
      { text: "English", role: "object", label: "목적어", explanation: "‘영어를’이라는 뜻으로, 공부하는 대상입니다." },
      { text: "every morning.", role: "modifier", label: "시간 부사구", explanation: "‘매일 아침’이라는 뜻으로, 언제 공부하는지 알려 줍니다." },
    ],
    grammarPoints: [
      { title: "3형식 문장", description: "주어 + 동사 + 목적어 구조입니다. study 뒤에 무엇을 공부하는지(English)가 바로 옵니다." },
      { title: "3인칭 단수 현재형", description: "주어가 She처럼 3인칭 단수이고 현재 시제이면 동사에 -s/-es를 붙입니다. study → studies (자음 + y는 y를 i로 바꾸고 -es)." },
      { title: "현재 시제의 습관", description: "every morning처럼 반복을 나타내는 말과 함께 쓰인 현재 시제는 평소의 습관을 나타냅니다." },
    ],
    tip: "every morning처럼 시간을 나타내는 말은 문장의 뼈대가 아니에요. 먼저 She studies English만 읽어 보세요.",
    chunks: [
      { text: "She", meaning: "그녀는" },
      { text: "studies English", meaning: "영어를 공부한다" },
      { text: "every morning.", meaning: "매일 아침" },
    ],
    patternTags: [
      { name: "3인칭 단수 현재", text: "studies", description: "주어가 She이므로 study에 -es가 붙었습니다." },
      { name: "빈도 부사구", text: "every morning", description: "every + 시간 명사는 반복되는 시점을 나타내는 부사구입니다." },
    ],
    nuance:
      "현재 시제와 every morning이 함께 쓰여 일시적인 행동이 아니라 꾸준한 습관임을 담담하게 전합니다. is studying(현재진행형)이었다면 '요즘 한창 공부하는 중'이라는 일시적인 느낌이 됩니다.",
    specialStructures: [],
    vocabulary: [
      { word: "study", level: "basic", register: "general", meaning: "공부하다, 연구하다", note: "학술 맥락에서는 '연구'라는 명사로도 자주 쓰입니다 (a study on sleep)." },
      { word: "every", level: "basic", register: "general", meaning: "매~, 모든", note: "every 뒤에는 단수 명사가 옵니다 (every morning, every student)." },
    ],
    writingTips: [
      { title: "습관을 강조하는 표현", description: "make a point of -ing를 쓰면 '일부러 꼭 ~한다'는 의지가 드러납니다.", example: "She makes a point of studying English every morning." },
      { title: "자기소개서용 격식 표현", description: "dedicate A to B로 시간을 투자한다는 점을 세련되게 표현할 수 있어요.", example: "She dedicates an hour to English every morning." },
    ],
  },
  "The book that you lent me was fascinating.": {
    translation: "네가 나에게 빌려준 책은 정말 흥미로웠어.",
    pattern: { form: 2, formula: "S + V + C" },
    summary: "관계대명사절로 어떤 책인지 설명하고, 그 책이 흥미로웠다고 말하는 문장입니다.",
    parts: [
      { text: "The book", role: "subject", label: "주어의 중심어", explanation: "문장의 주인공인 ‘그 책’을 나타냅니다." },
      { text: "that you lent me", role: "modifier", label: "주어를 수식하는 관계대명사절", explanation: "‘네가 나에게 빌려준’이라는 뜻으로, 앞의 book이 어떤 책인지 설명합니다." },
      { text: "was", role: "verb", label: "동사", explanation: "be동사의 과거형으로, 주어와 그 상태를 설명하는 보어를 연결합니다." },
      { text: "fascinating.", role: "complement", label: "주격 보어", explanation: "‘매우 흥미로운’이라는 뜻의 형용사로, 책의 특성을 설명합니다." },
    ],
    grammarPoints: [
      { title: "문장의 중심은 2형식", description: "전체 주어는 The book that you lent me이며, 문장의 핵심 구조는 The book + was + fascinating입니다. fascinating은 목적어가 아니라 주어를 설명하는 보어입니다." },
      { title: "목적격 관계대명사 that", description: "that은 앞의 book을 가리키며, 관계절 안에서 ‘빌려준 물건’에 해당하는 목적어 역할을 합니다. 목적격 관계대명사이므로 The book you lent me처럼 생략할 수도 있습니다." },
      { title: "lend의 과거형 lent", description: "lend는 ‘빌려주다’이며 과거형은 lent입니다. you lent me the book에서 me는 받는 사람, the book은 빌려준 물건입니다." },
      { title: "fascinating과 fascinated", description: "fascinating은 흥미를 일으키는 대상의 특성을, fascinated는 누군가가 흥미를 느끼거나 매료된 상태를 나타냅니다. 여기서는 책의 특성을 말하므로 fascinating을 씁니다." },
    ],
    tip: "관계절 that you lent me를 괄호로 묶고, 먼저 The book was fascinating이라는 문장의 뼈대를 찾아보세요.",
    chunks: [
      { text: "The book", meaning: "그 책은" },
      { text: "that you lent me", meaning: "네가 나에게 빌려준" },
      { text: "was fascinating.", meaning: "정말 흥미로웠다" },
    ],
    patternTags: [
      { name: "목적격 관계대명사", text: "that you lent me", description: "that이 lent의 목적어 역할을 하며 앞의 book을 꾸밉니다. 생략할 수 있습니다." },
      { name: "감정 유발 형용사 (-ing)", text: "fascinating", description: "감정을 일으키는 대상을 설명할 때는 -ing 형태를 씁니다." },
    ],
    nuance:
      "fascinating은 interesting보다 훨씬 강한 말로, '빠져들 만큼 매혹적인'이라는 감탄이 담겨 있습니다. 책을 빌려준 사람에게 고마움과 감상을 함께 전하는 따뜻한 말투입니다.",
    specialStructures: [
      { type: "ellipsis", name: "목적격 관계대명사 생략", text: "The book you lent me was fascinating.", description: "구어에서는 that을 생략한 형태가 더 자연스럽고 자주 쓰입니다." },
    ],
    vocabulary: [
      { word: "lend", level: "basic", register: "general", meaning: "빌려주다", note: "borrow(빌리다)와 방향이 반대입니다. 과거형·과거분사는 lent." },
      { word: "fascinating", level: "intermediate", register: "general", meaning: "매혹적인, 대단히 흥미로운", note: "글에서는 compelling, intriguing도 비슷한 뜻으로 씁니다." },
    ],
    writingTips: [
      { title: "감정의 강도 조절하기", description: "interesting < intriguing < fascinating < captivating 순으로 강해집니다. 상황에 맞는 단어를 골라 보세요.", example: "The book you lent me was absolutely captivating." },
      { title: "비즈니스 메일 응용", description: "자료를 받은 뒤 감사를 전할 때는 find + 목적어 + 형용사 구조가 격식 있게 들립니다.", example: "Thank you for lending me the report; I found it highly insightful." },
    ],
  },
  "If I had known the truth, I would have told you.": {
    translation: "내가 진실을 알았더라면, 너에게 말해 줬을 텐데.",
    pattern: { form: 3, formula: "S + V + O" },
    summary: "과거에 일어나지 않은 일을 가정하고, 그랬다면 어떻게 했을지 말하는 가정법 과거완료 문장입니다.",
    parts: [
      { text: "If I had known the truth,", role: "modifier", label: "조건 부사절", explanation: "‘내가 진실을 알았더라면’이라는 뜻으로, 과거 사실과 반대되는 가정을 나타냅니다." },
      { text: "I", role: "subject", label: "주어", explanation: "주절의 주인공인 ‘나는’입니다." },
      { text: "would have told", role: "verb", label: "동사", explanation: "‘말해 줬을 것이다’라는 뜻으로, 과거에 실제로 하지 못한 일을 나타냅니다." },
      { text: "you.", role: "object", label: "목적어", explanation: "‘너에게’라는 뜻으로, 말해 줄 대상입니다." },
    ],
    grammarPoints: [
      { title: "가정법 과거완료", description: "If + 주어 + had p.p., 주어 + would have p.p. 형태로, 과거 사실과 반대되는 상황을 가정합니다. 실제로는 진실을 몰라서 말하지 못했다는 뜻입니다." },
      { title: "had known", description: "know의 과거완료형입니다. 가정법에서는 시제를 한 단계 과거로 당겨, 과거 일에 대한 가정을 had p.p.로 표현합니다." },
      { title: "would have told", description: "조동사 과거형 + have + 과거분사로, ‘~했을 것이다’라는 과거에 대한 추측·후회를 나타냅니다." },
    ],
    tip: "콤마(,)를 기준으로 If절과 주절을 나누고, 주절 I would have told you에서 뼈대를 먼저 찾아보세요.",
    chunks: [
      { text: "If I had known", meaning: "만약 내가 알았더라면" },
      { text: "the truth,", meaning: "그 진실을" },
      { text: "I would have told", meaning: "나는 말해 줬을 텐데" },
      { text: "you.", meaning: "너에게" },
    ],
    patternTags: [
      { name: "가정법 과거완료", text: "If I had known ..., I would have told", description: "과거 사실과 반대되는 일을 가정합니다. 실제로는 몰랐고, 말하지 못했습니다." },
      { name: "조동사 + have p.p.", text: "would have told", description: "과거에 하지 못한 일에 대한 아쉬움이나 추측을 나타냅니다." },
    ],
    nuance:
      "실제로는 진실을 몰라서 말해 주지 못했다는 아쉬움과 해명의 뉘앙스가 깔려 있습니다. '일부러 숨긴 게 아니야'라고 상대를 달래는 상황에서 자주 쓰입니다.",
    specialStructures: [
      { type: "inversion", name: "If 생략 도치", text: "Had I known the truth, I would have told you.", description: "격식체에서는 If를 빼고 had를 주어 앞으로 보내 같은 뜻을 더 세련되게 표현합니다." },
    ],
    vocabulary: [
      { word: "truth", level: "basic", register: "general", meaning: "진실, 사실", note: "the truth처럼 정관사와 함께 '그 사실'을 가리킬 때가 많습니다." },
      { word: "tell", level: "basic", register: "general", meaning: "말해 주다, 알려 주다", note: "tell + 사람 + 내용 순서로 씁니다. say는 사람을 바로 목적어로 받지 않습니다." },
    ],
    writingTips: [
      { title: "격식체 도치로 세련되게", description: "보고서나 업무 메일에서는 If를 생략한 도치형이 더 격식 있게 들립니다.", example: "Had I been informed earlier, I would have adjusted the schedule." },
      { title: "후회를 다른 구조로", description: "I wish + 과거완료로 같은 아쉬움을 짧게 표현할 수 있어요.", example: "I wish I had known the truth." },
    ],
  },
};

/** Built-in answers: the home examples plus every curriculum sentence. */
export function findSample(sentence: string): LlmAnalysis | undefined {
  if (SAMPLES[sentence]) return SAMPLES[sentence];
  const exercise = findExerciseBySentence(sentence);
  return exercise && resolveAnalysis(exercise.analysis);
}
