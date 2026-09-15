import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { MatchUpDemoFlow } from "@/features/game-shell/pairing/MatchUpDemoFlow";

export default async function MatchUpPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { tenant, contentPackage, unit, launchSession, progression, assignmentPlan, offerMap } = resolveSampleLaunchContext(code);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={tenant} compact>
      <MatchUpDemoFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        packageId={contentPackage.meta.packageId}
        audioCues={contentPackage.audioCues}
        audioSupportPlan={contentPackage.audioSupportPlans?.find((plan) => plan.unitKey === launchSession.unitKey)}
        assignmentPlan={assignmentPlan}
        offerMap={offerMap}
      />
    </AppShell>
  );
}
