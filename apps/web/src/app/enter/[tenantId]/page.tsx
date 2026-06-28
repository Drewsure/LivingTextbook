import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { getSampleFrontDoorLaunchSession, getSampleFrontDoorStudentProgression } from "@/data/sampleLaunchSession";
import {
  sampleFrontDoorAccessPolicy,
  sampleFrontDoorEntryCode,
  sampleFrontDoorUserCode,
  sampleMultimediaContentPackage,
} from "@/data/sampleMultimediaPackage";
import { FrontDoorEntryFlow } from "@/features/access/FrontDoorEntryFlow";
import { ministarTenant } from "@/features/tenant/ministarTenant";

export default async function FrontDoorEntryPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;

  if (tenantId !== ministarTenant.id) {
    notFound();
  }

  const unit = sampleMultimediaContentPackage.units[0];

  if (!unit) {
    notFound();
  }

  const launchSession = getSampleFrontDoorLaunchSession();
  const progression = getSampleFrontDoorStudentProgression(
    launchSession.launchCode,
    sampleFrontDoorUserCode.toLowerCase(),
  );

  return (
    <AppShell tenant={ministarTenant} compact>
      <FrontDoorEntryFlow
        tenant={ministarTenant}
        unit={unit}
        contentPackage={sampleMultimediaContentPackage}
        launchSession={launchSession}
        progression={progression}
        accessPolicy={sampleFrontDoorAccessPolicy}
        expectedEntryCode={sampleFrontDoorEntryCode}
        expectedUserCode={sampleFrontDoorUserCode}
      />
    </AppShell>
  );
}
