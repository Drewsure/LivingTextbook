import { notFound } from "next/navigation";
import { createLaunchSession, getInitialStudentProgression, getUnitKey } from "@living-textbook/content-model";
import { AppShell } from "@/components/layout/AppShell";
import { LocalPilotPackageRuntimePanel } from "@/features/deployment/LocalPilotPackageRuntimePanel";
import { LocalPackageMediaFlow } from "@/features/multimedia/LocalPackageMediaFlow";
import { getLocalPilotPackageLaunchCode } from "@/features/routes/routeContracts";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { readLocalPilotPackageContent, readLocalPilotPackageRuntime } from "@/server/delivery/localPilotPackageRuntimeReader";
import { createLocalPilotPackageRouteMap } from "@/server/delivery/localPilotPackageRouteMap";

const tenants = {
  ministar: ministarTenant,
  "sample-publisher": samplePublisherTenant,
} as const;

export default async function LocalPilotPackageMediaPage({
  params,
}: {
  params: Promise<{ tenantId: string; packageId: string; version: string; playlistId: string }>;
}) {
  const { tenantId, packageId, version, playlistId } = await params;
  const tenant = tenants[tenantId as keyof typeof tenants];
  if (!tenant) notFound();

  const contentResult = await readLocalPilotPackageContent({ tenantId, packageId, version });
  const runtimeResult = await readLocalPilotPackageRuntime({ tenantId, packageId, version });
  if (contentResult.status !== "available") {
    return (
      <AppShell tenant={tenant} compact>
        <LocalPilotPackageRuntimePanel result={runtimeResult} tenantDisplayName={tenant.displayName} />
        <section className="mx-auto mt-5 max-w-3xl rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">Local media is waiting for the approved content lane.</p>
          <ul className="mt-2 grid gap-1">
            {contentResult.errors.map((error, index) => <li key={`${error}-${index}`}>{error}</li>)}
          </ul>
        </section>
      </AppShell>
    );
  }

  const playlist = contentResult.contentPackage.playlists?.find((candidate) => candidate.playlistId === playlistId);
  if (!playlist) notFound();
  const unit = contentResult.contentPackage.units.find((candidate) => getUnitKey(candidate.unitMeta) === playlist.unitKey);
  if (!unit) notFound();

  if (runtimeResult.status !== "available") {
    return (
      <AppShell tenant={tenant} compact>
        <LocalPilotPackageRuntimePanel result={runtimeResult} tenantDisplayName={tenant.displayName} />
      </AppShell>
    );
  }
  const routeMap = createLocalPilotPackageRouteMap(runtimeResult.summary, playlist.unitKey);
  if (routeMap.status !== "available") notFound();
  if (routeMap.routeMap.launchCode !== getLocalPilotPackageLaunchCode(tenantId, packageId, version, playlist.unitKey)) notFound();

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
      <LocalPackageMediaFlow
        tenantId={tenantId}
        packageId={packageId}
        version={version}
        contentPackage={contentResult.contentPackage}
        launchSession={launchSession}
        progression={progression}
      />
    </AppShell>
  );
}
