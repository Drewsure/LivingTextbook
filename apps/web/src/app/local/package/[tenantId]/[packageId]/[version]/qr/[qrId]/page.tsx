import { notFound } from "next/navigation";
import { Card, StatusPill } from "@living-textbook/ui";
import { AppShell } from "@/components/layout/AppShell";
import { ministarTenant } from "@/features/tenant/ministarTenant";
import { samplePublisherTenant } from "@/features/tenant/samplePublisherTenant";
import { getLocalPilotPackageQrReviewPath } from "@/features/routes/routeContracts";
import { LocalPilotPackageRuntimePanel } from "@/features/deployment/LocalPilotPackageRuntimePanel";
import { readLocalPilotPackageRuntime } from "@/server/delivery/localPilotPackageRuntimeReader";

const tenants = {
  ministar: ministarTenant,
  "sample-publisher": samplePublisherTenant,
} as const;

export default async function LocalPilotPackageQrReviewPage({
  params,
}: {
  params: Promise<{ tenantId: string; packageId: string; version: string; qrId: string }>;
}) {
  const { tenantId, packageId, version, qrId } = await params;
  const tenant = tenants[tenantId as keyof typeof tenants];
  if (!tenant) notFound();

  const result = await readLocalPilotPackageRuntime({ tenantId, packageId, version });
  if (result.status !== "available") {
    return (
      <AppShell tenant={tenant} compact>
        <LocalPilotPackageRuntimePanel result={result} tenantDisplayName={tenant.displayName} />
      </AppShell>
    );
  }

  const route = result.summary.routes.find((candidate) => candidate.qrId === qrId);
  if (!route) notFound();

  return (
    <AppShell tenant={tenant} compact>
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--tenant-muted)]">{tenant.displayName}</p>
              <h1 className="mt-1 text-2xl font-bold">Printed QR fallback review</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                This review surface proves which approved local path belongs to one printed QR identity. It does not redirect, mutate the alias registry, activate a student, or authorize printing.
              </p>
            </div>
            <StatusPill label="Read-only mapping" tone="success" />
          </div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ReviewFact label="Printed QR" value={route.qrId} />
            <ReviewFact label="Unit" value={route.unitId} />
            <ReviewFact label="Target" value={`${route.targetType} / ${route.targetId}`} />
            <ReviewFact label="Package" value={`${result.summary.packageId} / ${result.summary.version}`} />
          </dl>
        </Card>

        <Card>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Approved local fallback</p>
          <h2 className="mt-1 text-lg font-bold">Open the package-declared destination</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The path below is read from the verified local bundle manifest. A reviewer may open it for rehearsal, but this screen cannot change the destination or publish the package.
          </p>
          {safeLocalPath(route.localFallbackPath) ? (
            <a
              href={route.localFallbackPath}
              className="mt-5 inline-flex min-h-11 max-w-full items-center justify-center break-all rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-semibold text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
            >
              Open local fallback: {route.localFallbackPath}
            </a>
          ) : (
            <p className="mt-5 break-all rounded-lg border border-amber-300 bg-amber-50 p-3 font-mono text-sm font-semibold text-amber-950">
              Fallback path is not safe for browser rehearsal: {route.localFallbackPath}
            </p>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-bold">Review boundaries</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Manifest identity verified",
              "No QR alias mutation",
              "No package writes",
              "No student activation",
              "No hosted persistence",
              "No release approval",
              "No learner records",
              `Package review route: ${getLocalPilotPackageQrReviewPath(tenantId, packageId, version, qrId)}`,
            ].map((boundary) => (
              <div key={boundary} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm font-semibold text-[var(--tenant-text)]">
                {boundary}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

function ReviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}

function safeLocalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\") && !path.includes("\0");
}
