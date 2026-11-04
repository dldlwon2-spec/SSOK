import type { Stage } from "../types";

export const intermediateStage: Stage = {
  level: "intermediate",
  name: "중급 단계",
  description: "수식어, 관계대명사, 분사구문처럼 여러 절과 구가 들어간 문장 구조를 연습해요.",
  units: [
    {
      id: "intermediate-1",
      title: "수식어 덧붙이기",
      goal: "형용사·전치사구·분사·부사가 뼈대 문장의 어디를 꾸미는지 구분해요.",
      exercises: [
        {
          id: "intermediate-1-1",
          sentence: "The tall man in the black coat quietly opened the door.",
          analysis: {
            translation: "검은 코트를 입은 키 큰 남자가 조용히 문을 열었다.",
            pattern: { form: 3, formula: "S + V + O" },
            summary: "주어 앞뒤로 수식어가 붙고 동사 앞에 부사가 들어갔지만, 뼈대는 The man opened the door인 3형식 문장입니다.",
            parts: [
              { text: "The tall man", role: "subject", label: "주어 (형용사 + 명사)", explanation: "형용사 tall이 man을 앞에서 꾸밉니다." },
              { text: "in the black coat", role: "modifier", label: "주어를 꾸미는 전치사구", explanation: "‘검은 코트를 입은’이라는 뜻으로, 어떤 남자인지 뒤에서 설명합니다." },
              { text: "quietly", role: "modifier", label: "동사를 꾸미는 부사", explanation: "‘조용히’라는 뜻으로, 문을 연 방식을 나타냅니다." },
              { text: "opened", role: "verb", label: "동사", explanation: "‘열었다’라는 과거형 동사입니다." },
              { text: "the door.", role: "object", label: "목적어", explanation: "‘문을’이라는 뜻으로, 연 대상입니다." },
            ],
            grammarPoints: [
              { title: "전치사구의 후치 수식", description: "in the black coat처럼 명사 뒤에 오는 전치사구는 앞 명사를 꾸미는 형용사 역할을 합니다." },
              { title: "부사의 위치", description: "방식을 나타내는 부사(quietly)는 동사 앞이나 문장 끝(opened the door quietly)에 올 수 있습니다." },
            ],
            tip: "수식어를 모두 괄호로 묶으면 The man opened the door만 남아요. 뼈대부터 찾으세요.",
            chunks: [
              { text: "The tall man", meaning: "키 큰 남자가" },
              { text: "in the black coat", meaning: "검은 코트를 입은" },
              { text: "quietly opened", meaning: "조용히 열었다" },
              { text: "the door.", meaning: "문을" },
            ],
            patternTags: [
              { name: "전치사구 후치 수식", text: "in the black coat", description: "명사 man을 뒤에서 꾸미는 형용사구입니다." },
            ],
          },
        },
        {
          id: "intermediate-1-2",
          sentence: "Students interested in the program should apply before Friday.",
          analysis: {
            translation: "그 프로그램에 관심 있는 학생들은 금요일 전에 지원해야 한다.",
            pattern: { form: 1, formula: "S + V" },
            summary: "과거분사구가 주어를 뒤에서 꾸미고, 조동사 should + 동사원형이 이어지는 1형식 문장입니다.",
            parts: [
              { text: "Students", role: "subject", label: "주어", explanation: "‘학생들은’이라는 뜻의 주어 중심어입니다." },
              { text: "interested in the program", role: "modifier", label: "주어를 꾸미는 과거분사구", explanation: "‘그 프로그램에 관심 있는’이라는 뜻으로 Students를 뒤에서 꾸밉니다." },
              { text: "should apply", role: "verb", label: "동사 (조동사 + 동사원형)", explanation: "‘지원해야 한다’라는 의무·권고를 나타냅니다." },
              { text: "before Friday.", role: "modifier", label: "시간 부사구", explanation: "‘금요일 전에’라는 뜻으로 기한을 나타냅니다." },
            ],
            grammarPoints: [
              { title: "분사의 후치 수식", description: "분사가 다른 말(in the program)과 함께 길어지면 명사 뒤에 옵니다. Students (who are) interested in ...로 이해하면 쉽습니다." },
              { title: "조동사 should", description: "should 뒤에는 동사원형이 오며, ‘~해야 한다, ~하는 것이 좋다’라는 권고를 나타냅니다." },
            ],
            tip: "주어 뒤에 -ed/-ing 형태가 나오면, 그것이 진짜 동사인지 앞 명사를 꾸미는 분사인지 먼저 확인하세요. 진짜 동사는 should apply예요.",
            chunks: [
              { text: "Students", meaning: "학생들은" },
              { text: "interested in the program", meaning: "그 프로그램에 관심 있는" },
              { text: "should apply", meaning: "지원해야 한다" },
              { text: "before Friday.", meaning: "금요일 전에" },
            ],
            patternTags: [
              { name: "과거분사 후치 수식", text: "interested in the program", description: "수동·상태의 의미로 앞 명사를 꾸밉니다." },
              { name: "조동사", text: "should apply", description: "조동사 + 동사원형 구조입니다." },
            ],
          },
        },
      ],
    },
    {
      id: "intermediate-2",
      title: "관계대명사절",
      goal: "명사 뒤에 붙어 ‘어떤’ 사람·사물인지 설명하는 관계대명사절을 찾아 묶어요.",
      exercises: [
        {
          id: "intermediate-2-1",
          sentence: "The woman who lives next door is a famous pianist.",
          analysis: {
            translation: "옆집에 사는 여자는 유명한 피아니스트이다.",
            pattern: { form: 2, formula: "S + V + C" },
            summary: "주격 관계대명사절이 주어를 꾸미고, 뼈대는 The woman is a famous pianist인 2형식 문장입니다.",
            parts: [
              { text: "The woman", role: "subject", label: "주어의 중심어", explanation: "문장의 주인공인 ‘그 여자’입니다." },
              { text: "who lives next door", role: "modifier", label: "주어를 꾸미는 관계대명사절", explanation: "‘옆집에 사는’이라는 뜻으로, 어떤 여자인지 설명합니다." },
              { text: "is", role: "verb", label: "동사", explanation: "주어와 보어를 연결하는 be동사입니다." },
              { text: "a famous pianist.", role: "complement", label: "주격 보어", explanation: "‘유명한 피아니스트’로, 주어가 누구인지 설명합니다." },
            ],
            grammarPoints: [
              { title: "주격 관계대명사 who", description: "who가 관계절 안에서 lives의 주어 역할을 합니다. 사람이 선행사일 때 who(또는 that)를 씁니다." },
              { title: "동사 두 개 구별하기", description: "lives는 관계절 안의 동사이고, 문장 전체의 동사는 is입니다. 관계절을 괄호로 묶으면 진짜 동사가 보입니다." },
            ],
            tip: "who/which/that이 보이면 다음 동사까지 괄호로 묶어 보세요. 괄호 밖의 동사가 문장의 진짜 동사예요.",
            chunks: [
              { text: "The woman", meaning: "그 여자는" },
              { text: "who lives next door", meaning: "옆집에 사는" },
              { text: "is a famous pianist.", meaning: "유명한 피아니스트이다" },
            ],
            patternTags: [
              { name: "주격 관계대명사", text: "who lives next door", description: "선행사 The woman을 꾸미는 관계절입니다." },
            ],
          },
        },
        {
          id: "intermediate-2-2",
          sentence: "I lost the umbrella which my grandmother had given me.",
          analysis: {
            translation: "나는 할머니께서 내게 주셨던 우산을 잃어버렸다.",
            pattern: { form: 3, formula: "S + V + O" },
            summary: "목적격 관계대명사절이 목적어 the umbrella를 꾸미는 3형식 문장입니다.",
            parts: [
              { text: "I", role: "subject", label: "주어", explanation: "우산을 잃어버린 사람입니다." },
              { text: "lost", role: "verb", label: "동사", explanation: "lose(잃어버리다)의 과거형입니다." },
              { text: "the umbrella", role: "object", label: "목적어의 중심어", explanation: "‘그 우산을’이라는 뜻입니다." },
              { text: "which my grandmother had given me.", role: "modifier", label: "목적어를 꾸미는 관계대명사절", explanation: "‘할머니께서 내게 주셨던’이라는 뜻으로, 어떤 우산인지 설명합니다." },
            ],
            grammarPoints: [
              { title: "목적격 관계대명사 which", description: "which가 관계절 안에서 had given의 목적어(준 물건) 역할을 합니다. 목적격이라 생략해 the umbrella my grandmother had given me라고도 씁니다." },
              { title: "과거완료 had given", description: "우산을 잃어버린 것(과거)보다 할머니가 준 것이 더 먼저 일어난 일이라 had + 과거분사를 씁니다." },
            ],
            tip: "관계절 안에서 빠진 자리를 찾아보세요. had given me 뒤에 ‘무엇을’이 없으니 which가 그 목적어예요.",
            chunks: [
              { text: "I lost", meaning: "나는 잃어버렸다" },
              { text: "the umbrella", meaning: "그 우산을" },
              { text: "which my grandmother had given me.", meaning: "할머니께서 내게 주셨던" },
            ],
            patternTags: [
              { name: "목적격 관계대명사", text: "which my grandmother had given me", description: "선행사 the umbrella를 꾸미며 생략 가능합니다." },
              { name: "과거완료", text: "had given", description: "과거보다 더 이전의 일을 나타냅니다." },
            ],
          },
        },
      ],
    },
    {
      id: "intermediate-3",
      title: "분사구문",
      goal: "접속사와 주어를 줄여 쓴 분사구문이 주절과 어떤 관계인지 해석해요.",
      exercises: [
        {
          id: "intermediate-3-1",
          sentence: "Walking along the beach, we found a beautiful shell.",
          analysis: {
            translation: "해변을 따라 걷다가 우리는 아름다운 조개껍데기를 발견했다.",
            pattern: { form: 3, formula: "S + V + O" },
            summary: "현재분사로 시작하는 분사구문이 때를 나타내고, 주절은 we found a shell인 3형식 문장입니다.",
            parts: [
              { text: "Walking along the beach,", role: "modifier", label: "분사구문 (때)", explanation: "‘해변을 따라 걷다가’라는 뜻으로, While we were walking along the beach를 줄인 형태입니다." },
              { text: "we", role: "subject", label: "주어", explanation: "주절의 주어이자, 걷고 있던 사람들입니다." },
              { text: "found", role: "verb", label: "동사", explanation: "find(발견하다)의 과거형입니다." },
              { text: "a beautiful shell.", role: "object", label: "목적어", explanation: "‘아름다운 조개껍데기를’이라는 뜻입니다." },
            ],
            grammarPoints: [
              { title: "분사구문 만들기", description: "While we were walking ... → 접속사(While)와 주절과 같은 주어(we)를 지우고 동사를 -ing로 바꾸면 Walking ...이 됩니다." },
              { title: "의미상 주어", description: "분사구문의 주어는 주절의 주어(we)와 같습니다. 걷고 있던 것도, 발견한 것도 we입니다." },
            ],
            tip: "문장이 -ing로 시작하고 콤마가 있으면, 콤마 앞을 ‘~하면서/~하다가/~해서’로 해석해 보세요.",
            chunks: [
              { text: "Walking along the beach,", meaning: "해변을 따라 걷다가" },
              { text: "we found", meaning: "우리는 발견했다" },
              { text: "a beautiful shell.", meaning: "아름다운 조개껍데기를" },
            ],
            patternTags: [
              { name: "분사구문", text: "Walking along the beach", description: "때·동시동작을 나타내는 현재분사 구문입니다." },
            ],
          },
        },
        {
          id: "intermediate-3-2",
          sentence: "Exhausted after the long trip, she went straight to bed.",
          analysis: {
            translation: "긴 여행으로 지쳐서 그녀는 곧장 잠자리에 들었다.",
            pattern: { form: 1, formula: "S + V" },
            summary: "과거분사로 시작하는 분사구문이 이유를 나타내고, 주절은 she went인 1형식 문장입니다.",
            parts: [
              { text: "Exhausted after the long trip,", role: "modifier", label: "분사구문 (이유)", explanation: "‘긴 여행 후에 지쳐서’라는 뜻으로, Because she was exhausted ...를 줄인 형태입니다." },
              { text: "she", role: "subject", label: "주어", explanation: "주절의 주어이자 지친 사람입니다." },
              { text: "went", role: "verb", label: "동사", explanation: "go의 과거형입니다." },
              { text: "straight to bed.", role: "modifier", label: "방향 부사구", explanation: "‘곧장 잠자리로’라는 뜻으로 어디로 갔는지 나타냅니다." },
            ],
            grammarPoints: [
              { title: "과거분사로 시작하는 분사구문", description: "Being exhausted에서 Being이 생략된 형태입니다. 주어가 ‘지친’ 상태(수동·상태)라서 과거분사를 씁니다." },
              { title: "이유의 분사구문", description: "주절의 결과(곧장 잤다)와 연결해 ‘~해서, ~때문에’로 해석합니다." },
            ],
            tip: "분사구문의 의미(때·이유·조건·동시동작)는 정해져 있지 않아요. 주절과 자연스럽게 이어지는 접속사를 넣어 해석해 보세요.",
            chunks: [
              { text: "Exhausted after the long trip,", meaning: "긴 여행 후에 지쳐서" },
              { text: "she went", meaning: "그녀는 갔다" },
              { text: "straight to bed.", meaning: "곧장 잠자리로" },
            ],
            patternTags: [
              { name: "분사구문", text: "Exhausted after the long trip", description: "Being이 생략된 이유의 과거분사 구문입니다." },
            ],
          },
        },
      ],
    },
  ],
};
