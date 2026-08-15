import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { TrueFalseDemoFlow } from "@/features/game-shell/selection/TrueFalseDemoFlow";

export default async function TrueFalsePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { tenant, contentPackage, unit, launchSession, progression, assignmentPlan } = resolveSampleLaunchContext(code);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={tenant} compact>
      <TrueFalseDemoFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        audioCues={contentPackage.audioCues}
        assignmentPlan={assignmentPlan}
      />
    </AppShell>
  );
}
