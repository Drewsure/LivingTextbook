import { notFound } from "next/navigation";
import { createLaunchSession, getInitialStudentProgression, getUnitKey } from "@living-textbook/content-model";
import { AppShell } from "@/components/layout/AppShell";
import { FlashcardDemoFlow } from "@/features/game-shell/entry/FlashcardDemoFlow";
import { getLocalPilotPackageMemoryMatchPath, getLocalPilotPackageRuntimePath } from "@/features/routes/routeContracts";
import { LocalPilotPackageRuntimePanel } from "@/features/deployment/LocalPilotPackageRuntimePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { readLocalPilotPackageContent, readLocalPilotPackageRuntime } from "@/server/delivery/localPilotPackageRuntimeReader";

const tenants = {
  ministar: ministarTenant,
  "sample-publisher": samplePublisherTenant,
} as const;

export default async function LocalPilotPackageFrontDoorPage({
  params,
}: {
  params: Promise<{ tenantId: string; packageId: string; version: string; unitId: string }>;
}) {
  const { tenantId, packageId, version, unitId } = await params;
  const tenant = tenants[tenantId as keyof typeof tenants];
  if (!tenant) notFound();

  const contentResult = await readLocalPilotPackageContent({ tenantId, packageId, version });
  if (contentResult.status !== "available") {
    const runtimeResult = await readLocalPilotPackageRuntime({ tenantId, packageId, version });
    return (
      <AppShell tenant={tenant} compact>
        <LocalPilotPackageRuntimePanel result={runtimeResult} tenantDisplayName={tenant.displayName} />
        <section className="mx-auto mt-5 max-w-3xl rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">The package front door is waiting for approved local content.</p>
          <ul className="mt-2 grid gap-1">
            {contentResult.errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}
          </ul>
        </section>
      </AppShell>
    );
  }

  const unit = contentResult.contentPackage.units.find((candidate) => getUnitKey(candidate.unitMeta) === unitId);
  if (!unit) notFound();

  const runtimePath = getLocalPilotPackageRuntimePath(tenantId, packageId, version);
  const launchCode = `local-${tenantId}-${packageId}-${version}-${unitId}-front-door`;
  const launchSession = createLaunchSession({
    launchCode,
    tenantId,
    curriculumId: contentResult.contentPackage.meta.curriculumId,
    unitKey: getUnitKey(unit.unitMeta),
    entryMode: "flashcards",
    recommendedNextModes: ["memory-match"],
    openedAt: "2026-09-29T00:00:00.000Z",
    accessMode: "teacher-qr",
  });
  const progression = getInitialStudentProgression({
    studentSessionId: `${launchCode}:local-student`,
    launchSession,
  });

  return (
    <AppShell tenant={tenant} compact>
      <FlashcardDemoFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        contentPackage={contentResult.contentPackage}
        audioCues={contentResult.contentPackage.audioCues}
        audioSupportPlan={contentResult.contentPackage.audioSupportPlans?.find((plan) => plan.unitKey === launchSession.unitKey)}
        assistLanguagePlan={contentResult.contentPackage.assistLanguagePlans?.find((plan) => plan.unitKey === launchSession.unitKey)}
        routeHrefForMode={(mode, defaultHref) =>
          mode === "memory-match"
            ? getLocalPilotPackageMemoryMatchPath(tenantId, packageId, version, unitId)
            : defaultHref
        }
        activityHubHref={runtimePath}
        collectionHref={runtimePath}
      />
    </AppShell>
  );
}
