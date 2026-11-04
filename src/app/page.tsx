import { ExampleSentences } from "@/components/home/ExampleSentences";
import { FeatureIntro } from "@/components/home/FeatureIntro";
import { LearnEntryCard } from "@/components/home/LearnEntryCard";
import { ReviewBanner } from "@/components/home/ReviewBanner";
import { SentenceInput } from "@/components/home/SentenceInput";

export default function HomePage() {
  return (
    <>
      <p className="mt-8 font-pen text-2xl text-muted-foreground @md:mt-10">복잡한 영어도</p>
      <h1 className="mt-1 mb-8 text-3xl @sm:text-4xl @md:mb-10 leading-snug font-bold tracking-tight">구조부터 차근차근.</h1>
      <SentenceInput />
      <LearnEntryCard />
      <ReviewBanner />
      <ExampleSentences />
      <FeatureIntro />
    </>
  );
}
