# 쏙 (SSOK) · 영어 문장 구조 분석 & 수준별 학습

> 복잡한 영어도 구조부터 차근차근. 영어가 한눈에 **쏙**.

영어 문장을 입력하면 문장 성분·품사·문형·핵심 문법을 색으로 구분해 보여 주고,
기초부터 고급까지 커리큘럼 문장과 게임으로 문장 구조를 연습할 수 있는 웹 앱입니다.

## 주요 기능

### 문장 분석
- 영어 문장을 입력하면 **해석, 문형(1~5형식), 문장 성분, 핵심 문법, 쏙 포인트**를 정리
- 학습 수준에 따라 분석 화면이 달라져요
  - **입문자 모드**: 문장 성분 색상 표시, 단어별 품사, 자세한 문법 설명
  - **중급자 모드**: 직독직해 끊어읽기, 관계대명사·분사구문 등 구문 패턴 태그
  - **고급자 모드**: 뉘앙스, 도치·생략 구문, 비즈니스·학술 어휘 수준, 고급 영작 팁
- AI(Google Gemini) 키가 없으면 품사 태깅 기반의 간이 분석으로 동작

### 내 노트
- **문장장 / 단어장**: 어려운 문장과 단어를 북마크
- **복습 퀴즈**: 담아 둔 문장·단어로 수준별 퀴즈 생성, 문장별 정답률 기록
- **최근 분석**: 분석한 문장 자동 보관

### 수준별 학습
- **문장 학습**: 기초·중급·고급 커리큘럼 예문으로 문장 성분 칠하기와 해석 연습, 모범 답안 비교, 진도·완료·북마크 기록
- **게임**
  - 타임어택 서바이벌: 제한 시간 + 하트 3개, 유형이 섞여 나오고 단계가 점점 올라가는 아케이드 모드
  - 어순 배열 게임: 단어 조각을 드래그 앤 드롭 또는 터치로 배열
  - 구문 분석 퀴즈: 문장 성분·품사 찾기와 태깅
  - 빈칸 채우기 챌린지: 관계대명사·전치사·동사 형태 고르기
  - XP·콤보·레벨, 정답·해설 팝업, 최고 기록
- **단계 퀴즈**: 단계별 종합 퀴즈와 진행 막대, 유형별 결과
- **오답 노트**: 틀린 문제 자동 저장, 다시 풀어 맞히면 '복습 완료'

## 기술 스택

- [Next.js 15](https://nextjs.org/) (App Router) · React 19 · TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [compromise](https://github.com/spencermountain/compromise): 품사 태깅
- [zod](https://zod.dev/): AI 응답 검증
- [lucide-react](https://lucide.dev/): 아이콘
- Google Gemini API: AI 문장 분석 (선택)

## 시작하기

### 1. 준비물
- [Node.js](https://nodejs.org/) 20 이상

### 2. 설치
```bash
git clone https://github.com/dldlwon2-spec/SSOK.git
cd SSOK
npm install
```

### 3. AI 분석 설정 (선택)
`.env.example`을 복사해 `.env.local` 파일을 만들고 Gemini API 키를 넣어 주세요.
키는 [Google AI Studio](https://aistudio.google.com/apikey)에서 무료로 발급받을 수 있어요.

```env
GEMINI_API_KEY=발급받은_키
GEMINI_MODEL=gemini-2.5-flash
```

키가 없어도 앱은 동작하며, 예시·커리큘럼 문장은 미리 준비된 분석이 표시됩니다.

### 4. 실행
```bash
npm run dev
```
브라우저에서 http://localhost:3000 을 열어 주세요.

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm start` | 빌드한 앱 실행 |
| `npm run typecheck` | 타입 검사 |

## 폴더 구조

```
src/
├─ app/                 # 화면(라우트)과 분석 API (/api/analyze)
├─ components/
│  ├─ analysis/         # 분석 결과 화면과 수준별 섹션
│  ├─ learn/            # 수준별 학습: 문장 연습, 퀴즈, 게임, 서바이벌, 오답 노트
│  ├─ learning/         # 학습 수준 선택
│  ├─ quiz/             # 내 노트 복습 퀴즈
│  └─ layout · home · notebook · history · common
├─ hooks/
└─ lib/
   ├─ analysis/         # 분석 엔진: 전처리 → 품사 태깅 → AI / 규칙 기반 분석
   ├─ curriculum/       # 커리큘럼 예문, 퀴즈 문제 은행, 게임·서바이벌 규칙
   ├─ learning/         # 학습 수준, 복습 퀴즈 생성
   └─ storage/          # 브라우저 저장소(localStorage) 기록
```

## 데이터 저장

분석 기록, 북마크, 학습 진도, 퀴즈·게임 기록, 오답 노트는 모두 **브라우저(localStorage)** 에 저장돼요.
별도의 회원가입이나 서버 데이터베이스가 필요 없고, 기록은 사용하는 브라우저에만 남습니다.

## 콘텐츠 추가하기

- 커리큘럼 예문: `src/lib/curriculum/stages/`
- 퀴즈·게임 문제: `src/lib/curriculum/quiz/bank/`

같은 형식으로 추가하면 문장 학습, 단계 퀴즈, 게임, 오답 노트에 자동으로 반영됩니다.

## 참고

UI는 [문장쏙](https://grammar-guide-web.lovable.app/)의 디자인 톤을 참고했습니다.
