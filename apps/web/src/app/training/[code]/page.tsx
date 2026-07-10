import { AppShell } from "@/components/layout/AppShell";
import { getSampleLaunchSession, getSampleStudentProgression } from "@/data/sampleLaunchSession";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { TrainingAcademyFlow } from "@/features/training/TrainingAcademyFlow";
import type { TrainingFocusType } from "@/features/training/trainingAcademyAdapter";
import { ministarTenant } from "@/features/tenant/ministarTenant";

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
  const launchSession = getSampleLaunchSession(code);
  const progression = {
    ...getSampleStudentProgression(code),
    currentStep: "training-academy" as const,
    masteryStatus: "needs-review" as const,
  };

  return (
    <AppShell tenant={ministarTenant} compact>
      <TrainingAcademyFlow
        tenant={ministarTenant}
        unit={levelOneUnitOne}
        launchSession={launchSession}
        progression={progression}
        initialFocusType={initialFocusType}
      />
    </AppShell>
  );
}
