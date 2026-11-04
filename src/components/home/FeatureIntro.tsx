const FEATURES = [
  "문장 성분을 색으로 구분",
  "입문 · 중급 · 고급 수준별 분석",
  "문장장 · 단어장과 복습 퀴즈",
];

export function FeatureIntro() {
  return (
    <section className="mt-18 mb-6">
      <p className="font-pen text-2xl text-muted-foreground">문장을 구조로 읽는 순간,</p>
      <h2 className="mb-7 text-3xl leading-tight @md:text-[34px] font-bold">
        영어가
        <br />
        한눈에 <em className="font-pen text-[1.4em] not-italic">쏙.</em>
      </h2>
      <ul className="grid gap-3.5">
        {FEATURES.map((feature, i) => (
          <li key={feature} className="flex items-baseline gap-4 border-b border-dashed border-border pb-3.5">
            <span className="font-pen text-xl text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
