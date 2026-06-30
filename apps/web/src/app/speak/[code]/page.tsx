import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getSampleLaunchSession, getSampleStudentProgression } from "@/data/sampleLaunchSession";
import { sampleMultimediaContentPackage } from "@/data/sampleMultimediaPackage";
import { SpeakItDemoFlow } from "@/features/game-shell/speaking/SpeakItDemoFlow";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default async function SpeakItPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const launchSession = getSampleLaunchSession(code);
  const progression = getSampleStudentProgression(code);
  const unit = sampleMultimediaContentPackage.units[0];

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={ministarTenant} compact>
      <SpeakItDemoFlow
        tenant={ministarTenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        audioCues={sampleMultimediaContentPackage.audioCues}
      />
    </AppShell>
  );
}
