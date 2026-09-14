import { AppShell } from "@/components/layout/AppShell";
import { DashboardOverview } from "@/features/dashboard/DashboardOverview";
import { levelOneUnitOne } from "@/data/levelOneUnitOne";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { sampleLaunchSession } from "@/data/sampleLaunchSession";
import { sampleMinistarUnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import {
  sampleFrontDoorPath,
  sampleMultimediaContentPackage,
  samplePackageValidationErrors,
  samplePermanentQrPath,
  sampleTeacherProgressSummaryConcept,
} from "@/data/sampleMultimediaPackage";
import { whiteLabelPilotReadiness } from "@/data/whiteLabelPilotReadiness";

export default function HomePage() {
  return (
    <AppShell tenant={ministarTenant}>
      <DashboardOverview
        tenant={ministarTenant}
        unit={levelOneUnitOne}
        launchSession={sampleLaunchSession}
        contentPackage={sampleMultimediaContentPackage}
        offerMap={sampleMinistarUnitGameOfferMap}
        permanentQrPath={samplePermanentQrPath}
        frontDoorPath={sampleFrontDoorPath}
        packageValidationErrors={samplePackageValidationErrors}
        pilotReadiness={whiteLabelPilotReadiness}
        teacherProgressSummary={sampleTeacherProgressSummaryConcept}
      />
    </AppShell>
  );
}
