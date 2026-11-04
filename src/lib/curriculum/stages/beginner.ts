import type { Stage } from "../types";

export const beginnerStage: Stage = {
  level: "beginner",
  name: "기초 단계",
  description: "단순한 문장 구조와 기본 품사, 영어의 어순을 예문으로 익혀요.",
  units: [
    {
      id: "beginner-1",
      title: "주어 · 동사 · 보어 (1·2형식)",
      goal: "모든 영어 문장은 '누가 + 어떠하다'에서 시작해요. 동사 뒤에 무엇이 오는지 살펴봐요.",
      exercises: [
        {
          id: "beginner-1-1",
          sentence: "The baby is sleeping on the sofa.",
          analysis: {
            translation: "아기가 소파 위에서 자고 있다.",
            pattern: { form: 1, formula: "S + V" },
            summary: "주어와 동사만으로 뜻이 완성되고, 장소를 나타내는 수식어가 붙은 1형식 문장입니다.",
            parts: [
              { text: "The baby", role: "subject", label: "주어", explanation: "‘그 아기는’이라는 뜻의 명사구로, 잠을 자는 주체입니다." },
              { text: "is sleeping", role: "verb", label: "동사 (현재진행형)", explanation: "be동사 + -ing로 ‘지금 자고 있다’는 진행 중인 동작을 나타냅니다." },
              { text: "on the sofa.", role: "modifier", label: "장소 부사구", explanation: "전치사 on으로 시작하는 덩어리로, 어디에서 자는지 알려 주는 수식어입니다." },
            ],
            grammarPoints: [
              { title: "1형식 문장", description: "sleep은 목적어 없이도 뜻이 완성되는 동사입니다. on the sofa는 빼도 문장이 성립하므로 문장 성분이 아니라 수식어입니다." },
              { title: "현재진행형", description: "be동사(am/is/are) + 동사-ing는 말하는 지금 진행 중인 일을 나타냅니다." },
              { title: "품사 살펴보기", description: "baby·sofa는 명사, sleeping은 동사, on은 전치사, the는 명사 앞에 붙는 한정사(관사)입니다." },
            ],
            tip: "on, in, at 같은 전치사로 시작하는 덩어리는 대부분 수식어예요. 먼저 괄호로 묶어 보세요.",
            chunks: [
              { text: "The baby", meaning: "그 아기는" },
              { text: "is sleeping", meaning: "자고 있다" },
              { text: "on the sofa.", meaning: "소파 위에서" },
            ],
          },
        },
        {
          id: "beginner-1-2",
          sentence: "My father looks tired today.",
          analysis: {
            translation: "우리 아빠는 오늘 피곤해 보이신다.",
            pattern: { form: 2, formula: "S + V + C" },
            summary: "감각동사 look 뒤에 주어의 상태를 설명하는 형용사 보어가 온 2형식 문장입니다.",
            parts: [
              { text: "My father", role: "subject", label: "주어", explanation: "‘우리 아빠는’이라는 뜻으로, 상태를 설명받는 대상입니다." },
              { text: "looks", role: "verb", label: "동사 (감각동사)", explanation: "‘~해 보이다’라는 뜻의 감각동사입니다. 주어가 3인칭 단수라 -s가 붙었습니다." },
              { text: "tired", role: "complement", label: "주격 보어", explanation: "‘피곤한’이라는 형용사로, 주어의 상태를 보충 설명합니다." },
              { text: "today.", role: "modifier", label: "시간 부사", explanation: "‘오늘’이라는 뜻으로, 언제의 상태인지 알려 줍니다." },
            ],
            grammarPoints: [
              { title: "감각동사 + 형용사", description: "look, sound, feel, smell, taste 뒤에는 형용사가 보어로 옵니다. looks tiredly처럼 부사를 쓰지 않도록 주의하세요." },
              { title: "2형식 문장", description: "보어(tired)를 빼면 ‘아빠는 보인다’처럼 뜻이 불완전해집니다. 이렇게 꼭 필요한 보충어가 보어입니다." },
            ],
            tip: "동사 바로 뒤에 형용사가 오면 ‘주어 = 형용사’ 관계인지 확인해 보세요. My father = tired라면 보어예요.",
            chunks: [
              { text: "My father", meaning: "우리 아빠는" },
              { text: "looks tired", meaning: "피곤해 보인다" },
              { text: "today.", meaning: "오늘" },
            ],
          },
        },
      ],
    },
    {
      id: "beginner-2",
      title: "목적어와 어순 (3·4·5형식)",
      goal: "동사 뒤에 ‘무엇을’, ‘누구에게’가 어떤 순서로 오는지 익혀요.",
      exercises: [
        {
          id: "beginner-2-1",
          sentence: "We visited the museum last weekend.",
          analysis: {
            translation: "우리는 지난 주말에 박물관을 방문했다.",
            pattern: { form: 3, formula: "S + V + O" },
            summary: "동사 visit의 대상(목적어)이 바로 뒤에 오는 3형식 문장입니다.",
            parts: [
              { text: "We", role: "subject", label: "주어", explanation: "‘우리는’이라는 대명사로, 방문한 사람들입니다." },
              { text: "visited", role: "verb", label: "동사 (과거형)", explanation: "‘방문했다’라는 뜻으로, visit에 -ed를 붙인 과거형입니다." },
              { text: "the museum", role: "object", label: "목적어", explanation: "‘박물관을’이라는 뜻으로, 방문한 대상입니다." },
              { text: "last weekend.", role: "modifier", label: "시간 부사구", explanation: "‘지난 주말에’라는 뜻으로, 언제 방문했는지 알려 줍니다." },
            ],
            grammarPoints: [
              { title: "3형식 문장", description: "visit은 ‘~을 방문하다’라는 뜻이라 전치사 없이 바로 목적어가 옵니다. visited to the museum은 틀린 표현입니다." },
              { title: "영어의 기본 어순", description: "한국어는 ‘우리는 박물관을 방문했다’처럼 동사가 끝에 오지만, 영어는 주어 → 동사 → 목적어 순서입니다." },
            ],
            tip: "‘~을/를’로 해석되는 명사가 동사 바로 뒤에 있으면 목적어예요.",
            chunks: [
              { text: "We visited", meaning: "우리는 방문했다" },
              { text: "the museum", meaning: "박물관을" },
              { text: "last weekend.", meaning: "지난 주말에" },
            ],
          },
        },
        {
          id: "beginner-2-2",
          sentence: "Tom gave his sister a birthday present.",
          analysis: {
            translation: "톰은 여동생에게 생일 선물을 주었다.",
            pattern: { form: 4, formula: "S + V + IO + DO" },
            summary: "‘누구에게(간접목적어) + 무엇을(직접목적어)’ 두 개의 목적어를 가지는 4형식 문장입니다.",
            parts: [
              { text: "Tom", role: "subject", label: "주어", explanation: "선물을 준 사람입니다." },
              { text: "gave", role: "verb", label: "동사 (수여동사)", explanation: "give의 과거형으로, 무언가를 ‘주는’ 수여동사입니다." },
              { text: "his sister", role: "object", label: "간접목적어", explanation: "‘여동생에게’라는 뜻으로, 받는 사람입니다." },
              { text: "a birthday present.", role: "object", label: "직접목적어", explanation: "‘생일 선물을’이라는 뜻으로, 주는 물건입니다." },
            ],
            grammarPoints: [
              { title: "4형식 어순", description: "수여동사(give, send, show, tell) 뒤에는 ‘사람(~에게) + 사물(~을)’ 순서로 목적어가 옵니다." },
              { title: "3형식으로 바꾸기", description: "Tom gave a birthday present to his sister.처럼 사물을 앞으로 보내면 사람 앞에 to가 붙고 3형식이 됩니다." },
            ],
            tip: "동사 뒤에 명사가 두 개 연달아 나오면 ‘~에게 ~을’로 해석해 보세요.",
            chunks: [
              { text: "Tom gave", meaning: "톰은 주었다" },
              { text: "his sister", meaning: "여동생에게" },
              { text: "a birthday present.", meaning: "생일 선물을" },
            ],
          },
        },
        {
          id: "beginner-2-3",
          sentence: "The news made everyone happy.",
          analysis: {
            translation: "그 소식은 모두를 행복하게 만들었다.",
            pattern: { form: 5, formula: "S + V + O + OC" },
            summary: "목적어(everyone)의 상태를 설명하는 목적격 보어(happy)가 함께 오는 5형식 문장입니다.",
            parts: [
              { text: "The news", role: "subject", label: "주어", explanation: "‘그 소식은’이라는 뜻입니다. news는 -s로 끝나도 단수 취급합니다." },
              { text: "made", role: "verb", label: "동사", explanation: "make의 과거형으로, 여기서는 ‘~을 …하게 만들다’라는 뜻입니다." },
              { text: "everyone", role: "object", label: "목적어", explanation: "‘모두를’이라는 뜻으로, 상태가 바뀐 대상입니다." },
              { text: "happy.", role: "complement", label: "목적격 보어", explanation: "목적어 everyone의 상태(행복한)를 설명하는 형용사입니다." },
            ],
            grammarPoints: [
              { title: "5형식 문장", description: "make + 목적어 + 형용사는 ‘목적어를 ~하게 만들다’라는 뜻입니다. everyone = happy 관계가 성립합니다." },
              { title: "4형식과 구별하기", description: "4형식은 동사 뒤 두 명사가 ‘~에게 ~을’이지만, 5형식은 두 번째 말이 목적어의 상태를 설명합니다." },
            ],
            tip: "목적어 뒤의 말이 목적어를 설명하는지(everyone이 happy한지) 확인하면 5형식을 쉽게 찾을 수 있어요.",
            chunks: [
              { text: "The news made", meaning: "그 소식은 만들었다" },
              { text: "everyone", meaning: "모두를" },
              { text: "happy.", meaning: "행복하게" },
            ],
          },
        },
      ],
    },
  ],
};
