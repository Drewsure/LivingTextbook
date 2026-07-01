import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { StudentLaunchFlow } from "@/features/student/StudentLaunchFlow";

export default async function LaunchPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { tenant, contentPackage, unit, launchSession, progression, assistLanguagePlan } =
    resolveSampleLaunchContext(code);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={tenant} compact>
      <StudentLaunchFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        audioCues={contentPackage.audioCues}
        assistLanguagePlan={assistLanguagePlan}
      />
    </AppShell>
  );
}
