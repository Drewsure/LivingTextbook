import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { TrainingAcademyFlow } from "@/features/training/TrainingAcademyFlow";
import type { TrainingFocusType } from "@/features/training/trainingAcademyAdapter";

const allowedFocusTypes: TrainingFocusType[] = [
  "vocabulary-review",
  "sentence-review",
  "audio-listening",
  "spelling-review",
  "mode-practice",
  "mixed-recovery",
];

export default async function TrainingAcademyPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ focus?: string }>;
}) {
  const { code } = await params;
  const { focus } = await searchParams;
  const initialFocusType = allowedFocusTypes.includes(focus as TrainingFocusType)
    ? (focus as TrainingFocusType)
    : undefined;
  const { tenant, unit, launchSession, progression: launchProgression } = resolveSampleLaunchContext(code);

  if (!unit) {
    notFound();
  }

  const progression = {
    ...launchProgression,
    currentStep: "training-academy" as const,
    masteryStatus: "needs-review" as const,
  };

  return (
    <AppShell tenant={tenant} compact>
      <TrainingAcademyFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        initialFocusType={initialFocusType}
      />
    </AppShell>
  );
}
