import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { LabelItDemoFlow } from "@/features/game-shell/pairing/LabelItDemoFlow";

export default async function LabelItPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { tenant, contentPackage, unit, launchSession, progression, assignmentPlan } = resolveSampleLaunchContext(code);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={tenant} compact>
      <LabelItDemoFlow
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
