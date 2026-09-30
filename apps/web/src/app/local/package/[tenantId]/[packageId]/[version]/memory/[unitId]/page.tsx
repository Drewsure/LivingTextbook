import { notFound } from "next/navigation";
import { createLaunchSession, getInitialStudentProgression, getUnitKey } from "@living-textbook/content-model";
import { AppShell } from "@/components/layout/AppShell";
import { LocalPilotPackageRuntimePanel } from "@/features/deployment/LocalPilotPackageRuntimePanel";
import { getLocalPilotPackageLaunchCode } from "@/features/routes/routeContracts";
import { MemoryMatchDemoFlow } from "@/features/game-shell/pairing/MemoryMatchDemoFlow";
import { readLocalPilotPackageContent, readLocalPilotPackageRuntime } from "@/server/delivery/localPilotPackageRuntimeReader";
import { createLocalPilotPackageRouteMap } from "@/server/delivery/localPilotPackageRouteMap";
import { resolveLocalPilotPackageTenant } from "@/server/delivery/localPilotPackageTenantResolver";

export default async function LocalPackageMemoryMatchPage({
  params,
}: {
  params: Promise<{ tenantId: string; packageId: string; version: string; unitId: string }>;
}) {
  const { tenantId, packageId, version, unitId } = await params;
  const runtimeResult = await readLocalPilotPackageRuntime({ tenantId, packageId, version });
  const tenant = resolveLocalPilotPackageTenant(tenantId, runtimeResult.status === "available" ? runtimeResult.summary.tenantConfig : undefined);
  if (!tenant) notFound();

  const contentResult = await readLocalPilotPackageContent({ tenantId, packageId, version });
  if (contentResult.status !== "available") {
    return (
      <AppShell tenant={tenant} compact>
        <LocalPilotPackageRuntimePanel result={runtimeResult} tenantDisplayName={tenant.displayName} />
        <section className="mx-auto mt-5 max-w-3xl rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">Memory Match is waiting for the approved local content lane.</p>
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
  // Direct package game URLs start locked. The client route shell accepts only
  // the validated session handoff written by the front door after target-language practice.
  const progression = getInitialStudentProgression({
    studentSessionId: `${launchCode}:local-student`,
    launchSession,
  });

  return (
    <AppShell tenant={tenant} compact>
      <MemoryMatchDemoFlow
        tenant={tenant}
        unit={unit}
        launchSession={launchSession}
        progression={progression}
        packageId={packageId}
        audioCues={contentResult.contentPackage.audioCues}
        audioSupportPlan={contentResult.contentPackage.audioSupportPlans?.find((plan) => plan.unitKey === launchSession.unitKey)}
      />
    </AppShell>
  );
}
