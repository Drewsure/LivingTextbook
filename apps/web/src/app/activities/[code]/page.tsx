import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { resolveSampleLaunchContext } from "@/data/sampleLaunchResolver";
import { findSampleUnitGameOfferMap } from "@/data/sampleUnitGameOfferMap";
import { StudentActivityHubFlow } from "@/features/activities/StudentActivityHubFlow";

export default async function StudentActivitiesPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { tenant, contentPackage, unit, launchSession, progression } = resolveSampleLaunchContext(code);
  const offerMap = findSampleUnitGameOfferMap(contentPackage.meta.packageId);

  if (!unit) {
    notFound();
  }

  return (
    <AppShell tenant={tenant} compact>
      <StudentActivityHubFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        contentPackage={contentPackage}
        offerMap={offerMap}
      />
    </AppShell>
  );
}
