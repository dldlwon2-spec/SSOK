import type { Stage } from "../types";

export const advancedStage: Stage = {
  level: "advanced",
  name: "고급 단계",
  description: "영어 원서 발췌 문장과 전공·학술 수준의 복잡한 문장을 분석해요.",
  units: [
    {
      id: "advanced-1",
      title: "영어 원서 발췌",
      goal: "고전 문학 속 긴 문장에서 가주어, 병렬 구조, 생략을 찾아 뼈대를 세워요.",
      exercises: [
        {
          id: "advanced-1-1",
          sentence:
            "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
          source: "Jane Austen, Pride and Prejudice (1813)",
          analysis: {
            translation: "상당한 재산을 가진 독신 남자에게 틀림없이 아내가 필요하다는 것은 널리 인정되는 진리이다.",
            pattern: { form: 2, formula: "It(가주어) + V + C + that절(진주어)" },
            summary: "가주어 It이 뒤의 긴 that절(진주어)을 대신하는 2형식 문장입니다.",
            parts: [
              { text: "It", role: "subject", label: "가주어", explanation: "뒤에 나오는 that절을 대신하는 형식상의 주어로, 해석하지 않습니다." },
              { text: "is", role: "verb", label: "동사", explanation: "주어와 보어를 연결하는 be동사입니다." },
              { text: "a truth universally acknowledged,", role: "complement", label: "주격 보어", explanation: "‘널리 인정되는 진리’라는 뜻으로, 과거분사 acknowledged가 truth를 뒤에서 꾸밉니다." },
              { text: "that a single man in possession of a good fortune, must be in want of a wife.", role: "subject", label: "진주어 (that 명사절)", explanation: "‘재산을 가진 독신 남자에게 아내가 필요하다는 것’으로, 실제 주어입니다." },
            ],
            grammarPoints: [
              { title: "가주어 It – 진주어 that절", description: "That a single man ... must be in want of a wife is a truth ...처럼 주어가 너무 길면, It을 앞에 두고 진짜 주어를 뒤로 보냅니다." },
              { title: "격식 있는 전치사구", description: "in possession of는 ‘~을 소유한(possessing)’, in want of는 ‘~이 필요한(needing)’이라는 뜻의 격식체 표현입니다." },
              { title: "19세기 구두점", description: "that절 안의 주어(a single man ...)와 동사(must be) 사이에 콤마가 있습니다. 당시 문체로, 현대 영어에서는 쓰지 않습니다." },
            ],
            tip: "It is ... that 구조가 보이면 that절을 주어 자리에 넣어 해석해 보세요. 문장의 진짜 주장은 that절 안에 있어요.",
            chunks: [
              { text: "It is a truth", meaning: "(~은) 진리이다" },
              { text: "universally acknowledged,", meaning: "널리 인정되는" },
              { text: "that a single man", meaning: "독신 남자가" },
              { text: "in possession of a good fortune,", meaning: "상당한 재산을 가진" },
              { text: "must be in want of a wife.", meaning: "틀림없이 아내를 필요로 한다는 것은" },
            ],
            patternTags: [
              { name: "가주어-진주어", text: "It is ... that ...", description: "긴 that절을 문장 뒤로 보낸 구조입니다." },
              { name: "과거분사 후치 수식", text: "a truth universally acknowledged", description: "부사 + 과거분사가 명사를 뒤에서 꾸밉니다." },
            ],
            nuance:
              "겉으로는 보편적 진리를 선언하는 듯하지만, 실제로는 재산 있는 남자를 사윗감으로 노리는 주변 사람들을 풍자하는 반어적인 첫 문장입니다.",
          },
        },
        {
          id: "advanced-1-2",
          sentence:
            "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach.",
          source: "Henry David Thoreau, Walden (1854)",
          analysis: {
            translation:
              "내가 숲으로 들어간 것은 신중하게 살고, 삶의 본질적인 사실들만을 마주하며, 삶이 가르쳐 주는 것을 내가 배울 수 있는지 알아보고 싶었기 때문이다.",
            pattern: { form: 1, formula: "S + V + M(이유 부사절)" },
            summary: "주절 I went to the woods 뒤에, 병렬된 to부정사 세 개를 품은 긴 이유 부사절이 붙은 문장입니다.",
            parts: [
              { text: "I", role: "subject", label: "주어", explanation: "숲으로 간 화자입니다." },
              { text: "went", role: "verb", label: "동사", explanation: "go의 과거형입니다." },
              { text: "to the woods", role: "modifier", label: "방향 부사구", explanation: "‘숲으로’라는 뜻입니다." },
              { text: "because I wished", role: "modifier", label: "이유 부사절 (접속사 + 주어 + 동사)", explanation: "‘내가 원했기 때문에’라는 뜻으로 이유를 나타냅니다." },
              {
                text: "to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach.",
                role: "object",
                label: "wished의 목적어 (병렬된 to부정사구)",
                explanation: "‘신중하게 살고, 본질만 마주하고, 배울 수 있는지 알아보는 것’ 세 가지가 and로 이어집니다.",
              },
            ],
            grammarPoints: [
              { title: "병렬 구조", description: "to live, to front, and (to) see 세 개의 to부정사가 나란히 wished의 목적어가 됩니다. 마지막 see 앞의 to는 생략되었습니다." },
              { title: "if = whether", description: "see if ...는 ‘~인지 아닌지 알아보다’라는 뜻의 명사절입니다." },
              { title: "관계대명사 what", description: "what it had to teach는 ‘삶이 가르쳐야 할 것(the thing that ...)’이라는 뜻의 명사절입니다." },
              { title: "동사로 쓰인 front", description: "front는 여기서 ‘~에 맞서다, 마주하다(confront)’라는 뜻의 동사입니다." },
            ],
            tip: "긴 문장은 because 같은 접속사에서 한 번 끊고, and로 이어진 같은 형태(to + 동사)를 찾아 줄을 세워 보세요.",
            chunks: [
              { text: "I went to the woods", meaning: "나는 숲으로 갔다" },
              { text: "because I wished", meaning: "내가 원했기 때문에" },
              { text: "to live deliberately,", meaning: "신중하게 살기를" },
              { text: "to front only the essential facts of life,", meaning: "삶의 본질적인 사실들만 마주하기를" },
              { text: "and see if I could not learn", meaning: "그리고 내가 배울 수 있는지 알아보기를" },
              { text: "what it had to teach.", meaning: "삶이 가르쳐 주는 것을" },
            ],
            patternTags: [
              { name: "to부정사 병렬", text: "to live ..., to front ..., and see ...", description: "같은 형태가 and로 이어진 병렬 구조입니다." },
              { name: "관계대명사 what", text: "what it had to teach", description: "선행사를 포함한 명사절입니다." },
            ],
            specialStructures: [
              { type: "ellipsis", name: "병렬 구조 속 to 생략", text: "... and (to) see if I could not learn ...", description: "앞의 to부정사와 형태가 같아 반복되는 to를 생략했습니다." },
            ],
            nuance:
              "도시의 분주함을 떠나 의도적이고 성찰적인 삶을 살겠다는 결단을 담담하게 밝힙니다. could not learn의 not은 부정이라기보다 ‘배울 수 있지 않을까’라는 기대를 담은 표현입니다.",
          },
        },
      ],
    },
    {
      id: "advanced-2",
      title: "전공 · 학술 문장",
      goal: "논문과 보고서에 자주 나오는 양보절, 명사절, 도치, 완곡 표현을 분석해요.",
      exercises: [
        {
          id: "advanced-2-1",
          sentence:
            "Although the findings are preliminary, they suggest that chronic sleep deprivation may impair memory consolidation more severely than previously assumed.",
          analysis: {
            translation: "연구 결과는 아직 예비적이지만, 만성적인 수면 부족이 기존에 생각했던 것보다 기억 공고화를 더 심각하게 손상시킬 수 있음을 시사한다.",
            pattern: { form: 3, formula: "M(양보절) + S + V + O(that절)" },
            summary: "양보 부사절 뒤에, 동사 suggest가 that 명사절을 목적어로 취하는 3형식 문장입니다.",
            parts: [
              { text: "Although the findings are preliminary,", role: "modifier", label: "양보 부사절", explanation: "‘연구 결과가 예비적이긴 하지만’이라는 뜻으로 한계를 먼저 밝힙니다." },
              { text: "they", role: "subject", label: "주어", explanation: "앞의 the findings(연구 결과)를 가리킵니다." },
              { text: "suggest", role: "verb", label: "동사", explanation: "‘시사하다, 암시하다’라는 뜻입니다." },
              {
                text: "that chronic sleep deprivation may impair memory consolidation more severely than previously assumed.",
                role: "object",
                label: "목적어 (that 명사절)",
                explanation: "‘만성 수면 부족이 기억 공고화를 더 심각하게 손상시킬 수 있다는 것’이라는 연구의 핵심 주장입니다.",
              },
            ],
            grammarPoints: [
              { title: "양보의 Although", description: "‘~이지만’이라는 뜻으로, 학술문에서 연구의 한계를 인정한 뒤 주장을 펼칠 때 자주 씁니다." },
              { title: "suggest that + 직설법", description: "suggest가 ‘시사하다’라는 뜻일 때는 that절에 일반 시제를 씁니다. ‘제안하다’라는 뜻이면 (should) + 동사원형을 씁니다." },
              { title: "비교 구문의 생략", description: "than previously assumed는 than (it was) previously assumed에서 반복되는 주어와 be동사를 생략한 형태입니다." },
            ],
            tip: "학술 문장은 주장(that절)이 길어요. 먼저 Although절을 떼어 내고 they suggest that ...의 뼈대를 확인하세요.",
            chunks: [
              { text: "Although the findings are preliminary,", meaning: "연구 결과는 예비적이지만" },
              { text: "they suggest", meaning: "그것들은 시사한다" },
              { text: "that chronic sleep deprivation", meaning: "만성적인 수면 부족이" },
              { text: "may impair memory consolidation", meaning: "기억 공고화를 손상시킬 수 있다는 것을" },
              { text: "more severely than previously assumed.", meaning: "기존에 생각했던 것보다 더 심각하게" },
            ],
            patternTags: [
              { name: "양보 부사절", text: "Although the findings are preliminary", description: "주절과 대조되는 내용을 이끕니다." },
              { name: "명사절 that", text: "that chronic sleep deprivation ...", description: "suggest의 목적어가 되는 명사절입니다." },
            ],
            specialStructures: [
              { type: "ellipsis", name: "비교절 생략", text: "than (it was) previously assumed", description: "반복되는 주어와 be동사를 생략해 간결하게 썼습니다." },
            ],
            nuance:
              "preliminary, suggest, may처럼 단정을 피하는 완곡 표현(hedging)을 겹쳐 써서, 연구 결과를 신중하게 제시하는 전형적인 학술 문체입니다.",
            vocabulary: [
              { word: "preliminary", level: "advanced", register: "academic", meaning: "예비적인, 초기 단계의", note: "preliminary results/findings 형태로 논문에 자주 나옵니다." },
              { word: "impair", level: "advanced", register: "academic", meaning: "손상시키다, 약화시키다", note: "impaired vision(시력 저하)처럼 기능 저하를 말할 때 씁니다." },
              { word: "consolidation", level: "advanced", register: "academic", meaning: "공고화, 강화", note: "memory consolidation은 기억이 장기 기억으로 굳어지는 과정을 말합니다." },
            ],
          },
        },
        {
          id: "advanced-2-2",
          sentence:
            "Not only did the policy fail to reduce emissions, but it also imposed considerable costs on low-income households.",
          analysis: {
            translation: "그 정책은 배출량을 줄이지 못했을 뿐만 아니라, 저소득 가구에 상당한 비용을 부과하기까지 했다.",
            pattern: { form: null, formula: "Not only + 도치, but also + 절" },
            summary: "부정어구 Not only가 문장 앞에 나와 주어와 조동사의 순서가 바뀐(도치) 문장으로, 두 개의 절이 but also로 이어집니다.",
            parts: [
              { text: "Not only", role: "connector", label: "부정어구 (도치 유발)", explanation: "‘~일 뿐만 아니라’라는 뜻으로, 문두에 와서 도치를 일으킵니다." },
              { text: "did", role: "verb", label: "조동사 (도치)", explanation: "도치 때문에 주어 앞으로 나온 조동사입니다." },
              { text: "the policy", role: "subject", label: "주어", explanation: "‘그 정책’입니다." },
              { text: "fail", role: "verb", label: "본동사", explanation: "조동사 did 뒤라서 동사원형 fail이 옵니다." },
              { text: "to reduce emissions,", role: "object", label: "fail의 목적어 (to부정사)", explanation: "fail to ~는 ‘~하지 못하다’라는 뜻입니다." },
              { text: "but", role: "connector", label: "등위접속사", explanation: "not only와 짝을 이루어 두 번째 절을 이어 줍니다." },
              { text: "it", role: "subject", label: "주어", explanation: "앞의 the policy를 가리킵니다." },
              { text: "also", role: "modifier", label: "부사", explanation: "‘또한’이라는 뜻으로 not only ... but also 구문을 완성합니다." },
              { text: "imposed", role: "verb", label: "동사", explanation: "‘부과했다’라는 뜻입니다." },
              { text: "considerable costs", role: "object", label: "목적어", explanation: "‘상당한 비용을’이라는 뜻입니다." },
              { text: "on low-income households.", role: "modifier", label: "대상 부사구", explanation: "impose A on B(B에게 A를 부과하다)의 B에 해당합니다." },
            ],
            grammarPoints: [
              { title: "부정어구 도치", description: "Not only, Never, Rarely 같은 부정어구가 문장 맨 앞에 오면 ‘조동사 + 주어 + 동사’ 순서로 도치됩니다. 일반동사 문장이므로 did를 씁니다." },
              { title: "not only A but also B", description: "‘A뿐만 아니라 B도’라는 뜻으로, 두 번째 내용(B)에 더 무게가 실립니다." },
              { title: "impose A on B", description: "‘B에게 A(세금·비용·규제)를 부과하다’라는 뜻의 학술·보도문 빈출 표현입니다." },
            ],
            tip: "문장이 Not only, Never 같은 부정어로 시작하면 뒤에서 조동사(did, has, can)를 찾고, 그 뒤의 주어를 확인하세요.",
            chunks: [
              { text: "Not only did the policy fail", meaning: "그 정책은 실패했을 뿐만 아니라" },
              { text: "to reduce emissions,", meaning: "배출량을 줄이는 데" },
              { text: "but it also imposed", meaning: "또한 부과했다" },
              { text: "considerable costs", meaning: "상당한 비용을" },
              { text: "on low-income households.", meaning: "저소득 가구에" },
            ],
            patternTags: [
              { name: "부정어 도치", text: "Not only did the policy fail", description: "부정어구가 문두에 와서 조동사가 주어 앞에 옵니다." },
              { name: "상관접속사", text: "not only ... but also ...", description: "두 내용을 강조하며 연결합니다." },
            ],
            specialStructures: [
              { type: "inversion", name: "부정어구 도치", text: "The policy not only failed to reduce emissions, but it also imposed considerable costs on low-income households.", description: "도치하지 않은 원래 어순입니다. 도치형이 더 강조되고 격식 있게 들립니다." },
            ],
            nuance: "정책의 실패를 두 겹으로 비판하며, 특히 취약 계층에 부담을 지웠다는 두 번째 내용을 강하게 부각합니다.",
            vocabulary: [
              { word: "impose", level: "advanced", register: "academic", meaning: "부과하다, 강요하다", note: "impose a tax/ban/restriction on ~ 형태로 자주 씁니다." },
              { word: "emissions", level: "intermediate", register: "academic", meaning: "배출량, 배출물", note: "carbon emissions(탄소 배출량)처럼 환경 분야에서 복수형으로 씁니다." },
              { word: "considerable", level: "intermediate", register: "formal", meaning: "상당한, 많은", note: "considerate(사려 깊은)와 헷갈리지 않도록 주의하세요." },
            ],
          },
        },
      ],
    },
  ],
};
