import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { QuizDemoFlow } from "@/features/game-shell/selection/QuizDemoFlow";

export default async function QuizPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { tenant, contentPackage, unit, launchSession, progression, assignmentPlan, offerMap } = resolveSampleLaunchContext(code);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={tenant} compact>
      <QuizDemoFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        audioCues={contentPackage.audioCues}
        audioSupportPlan={contentPackage.audioSupportPlans?.find((plan) => plan.unitKey === launchSession.unitKey)}
        assignmentPlan={assignmentPlan}
        offerMap={offerMap}
      />
    </AppShell>
  );
}
