import { AppShell } from "@/components/layout/AppShell";
import { getSampleLaunchSession, getSampleStudentProgression } from "@/data/sampleLaunchSession";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { TrainingAcademyFlow } from "@/features/training/TrainingAcademyFlow";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default async function TrainingAcademyPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
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
      />
    </AppShell>
  );
}
