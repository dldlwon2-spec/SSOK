import { notFound } from "next/navigation";
import { PracticeScreen } from "@/components/learn/practice/PracticeScreen";
import { ALL_EXERCISES, locateExercise } from "@/lib/curriculum";

export function generateStaticParams() {
  return ALL_EXERCISES.map((e) => ({ exerciseId: e.id }));
}

export default async function ExercisePage({ params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  if (!locateExercise(exerciseId)) notFound();

  return <PracticeScreen key={exerciseId} exerciseId={exerciseId} />;
}
