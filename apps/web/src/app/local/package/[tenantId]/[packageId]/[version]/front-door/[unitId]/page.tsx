import { notFound } from "next/navigation";
import { createLaunchSession, getInitialStudentProgression, getUnitKey } from "@living-textbook/content-model";
import { AppShell } from "@/components/layout/AppShell";
import { FlashcardDemoFlow } from "@/features/game-shell/entry/FlashcardDemoFlow";
import { getLocalPilotPackageLaunchCode, getLocalPilotPackageMemoryMatchPath, getLocalPilotPackageRuntimePath } from "@/features/routes/routeContracts";
import { LocalPilotPackageRuntimePanel } from "@/features/deployment/LocalPilotPackageRuntimePanel";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { readLocalPilotPackageContent, readLocalPilotPackageRuntime } from "@/server/delivery/localPilotPackageRuntimeReader";
import { createLocalPilotPackageRouteMap } from "@/server/delivery/localPilotPackageRouteMap";

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
  const runtimeResult = await readLocalPilotPackageRuntime({ tenantId, packageId, version });
  if (contentResult.status !== "available") {
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

  if (runtimeResult.status !== "available") {
    return (
      <AppShell tenant={tenant} compact>
        <LocalPilotPackageRuntimePanel result={runtimeResult} tenantDisplayName={tenant.displayName} />
      </AppShell>
    );
  }
  const routeMap = createLocalPilotPackageRouteMap(runtimeResult.summary, unitId);
  if (routeMap.status !== "available") notFound();
  if (routeMap.routeMap.launchCode !== getLocalPilotPackageLaunchCode(tenantId, packageId, version, unitId)) notFound();
  if (routeMap.routeMap.memoryMatchPath !== getLocalPilotPackageMemoryMatchPath(tenantId, packageId, version, unitId)) notFound();

  const runtimePath = getLocalPilotPackageRuntimePath(tenantId, packageId, version);
  const { launchCode } = routeMap.routeMap;
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
            ? routeMap.routeMap.memoryMatchPath
            : defaultHref
        }
        activityHubHref={runtimePath}
        collectionHref={runtimePath}
      />
      <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-sm font-semibold text-[var(--tenant-muted)]">Teacher view</p>
        <h2 className="mt-1 text-lg font-bold">Review this local package session</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
          Open the teacher evidence view after student practice to inspect the same package-scoped browser rehearsal record. It remains local and review-only until a persistence policy is accepted.
        </p>
        <a
          href={routeMap.routeMap.teacherEvidencePath}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
        >
          Open teacher evidence
        </a>
      </section>
    </AppShell>
  );
}
