import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { FlashcardDemoFlow } from "@/features/game-shell/entry/FlashcardDemoFlow";

export default async function FlashcardsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const {
    tenant,
    contentPackage,
    unit,
    launchSession,
    progression,
    sessionSettings,
    assistLanguagePlan,
    assignmentPlan,
  } = resolveSampleLaunchContext(code);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={tenant} compact>
      <FlashcardDemoFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        sessionSettings={sessionSettings}
        contentPackage={contentPackage}
        audioCues={contentPackage.audioCues}
        assistLanguagePlan={assistLanguagePlan}
        assignmentPlan={assignmentPlan}
      />
    </AppShell>
  );
}
