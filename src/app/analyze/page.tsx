import { Suspense } from "react";
import { AnalysisSkeleton } from "@/components/analysis/AnalysisSkeleton";
import { AnalyzeScreen } from "@/components/analysis/AnalyzeScreen";

export default function AnalyzePage() {
  return (
    <Suspense fallback={<AnalysisSkeleton />}>
      <AnalyzeScreen />
    </Suspense>
  );
}
