import { Card, StatusPill } from "@living-textbook/ui";
import type {
  LocalPilotPackageRuntimeReadResult,
  LocalPilotPackageRuntimeSummary,
} from "@/server/delivery/localPilotPackageRuntimeReader";

interface LocalPilotPackageRuntimePanelProps {
  result: LocalPilotPackageRuntimeReadResult;
  tenantDisplayName: string;
}

export function LocalPilotPackageRuntimePanel({ result, tenantDisplayName }: LocalPilotPackageRuntimePanelProps) {
  if (result.status !== "available") {
    return (
      <div className="grid gap-5">
        <RuntimeHeader tenantDisplayName={tenantDisplayName} status={result.status} />
        <Card>
          <h2 className="text-lg font-bold">Local package handoff is not available</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            The local app can only open a package after the operator has placed a complete, release-approved package in the configured local package root. This page does not create or repair a package.
          </p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
            {result.errors.map((error, index) => (
              <li key={`${error}-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
                {error}
              </li>
            ))}
          </ul>
        </Card>
        <BoundaryPanel />
      </div>
    );
  }

  const { summary } = result;
  return (
    <div className="grid gap-5">
      <RuntimeHeader tenantDisplayName={tenantDisplayName} status="available" />
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Verified local package</p>
            <h2 className="mt-1 text-2xl font-bold">Teacher-led local learning handoff</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              This read-only runtime view opens only the curated routes and media declared by the approved package. The QR destinations and local fallbacks remain bound to the package identity shown below.
            </p>
          </div>
          <StatusPill label="Package readable" tone="success" />
        </div>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RuntimeFact label="Tenant" value={summary.tenantId} />
          <RuntimeFact label="Package" value={summary.packageId} />
          <RuntimeFact label="Version" value={summary.version} />
          <RuntimeFact label="Bundle" value={summary.bundleId} />
          <RuntimeFact label="Delivery mode" value={summary.mode} />
          <RuntimeFact label="Package directory" value={summary.relativeDirectory} />
          <RuntimeFact label="Media kinds" value={summary.mediaKinds.join(", ") || "None"} />
          <RuntimeFact label="Hosted persistence" value={summary.hostedPersistence} />
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Printed QR route map</p>
            <h2 className="mt-1 text-lg font-bold">Open the approved local fallbacks</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              These links are the same local fallback paths recorded for the printed QR identities. They are package navigation only; opening a route does not write progress here.
            </p>
          </div>
          <StatusPill label={summary.qrPrintArtifactReady ? "Print artifact verified" : "Print artifact blocked"} tone={summary.qrPrintArtifactReady ? "success" : "warning"} />
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {summary.routes.map((route) => (
            <section key={route.qrId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{route.qrId}</p>
                  <h3 className="mt-1 text-sm font-bold">{route.targetType} / {route.targetId}</h3>
                </div>
                <span className="text-xs font-semibold text-[var(--tenant-muted)]">Unit {route.unitId}</span>
              </div>
              {safeLocalPath(route.localFallbackPath) ? (
                <a
                  href={route.localFallbackPath}
                  className="mt-3 inline-flex max-w-full break-all rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-mono text-xs font-semibold text-[var(--tenant-text)] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tenant-primary)]"
                >
                  Open local fallback: {route.localFallbackPath}
                </a>
              ) : (
                <p className="mt-3 break-all font-mono text-xs font-semibold text-[var(--tenant-muted)]">{route.localFallbackPath}</p>
              )}
            </section>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Curated game map</p>
            <h2 className="mt-1 text-lg font-bold">Game paths included by the release</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              The runtime displays the approved game route identities without inventing routes or switching templates at runtime.
            </p>
          </div>
          <StatusPill label={`${summary.gameRoutePaths.length} game paths`} tone="neutral" />
        </div>
        <ul className="mt-5 grid gap-2 md:grid-cols-2">
          {summary.gameRoutePaths.map((path) => (
            <li key={path} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 font-mono text-xs font-semibold text-[var(--tenant-text)]">
              {path}
            </li>
          ))}
        </ul>
      </Card>

      <BoundaryPanel />
    </div>
  );
}

function RuntimeHeader({ tenantDisplayName, status }: { tenantDisplayName: string; status: "available" | "blocked" | "not-found" }) {
  const label = status === "available" ? "Read-only runtime" : status === "not-found" ? "Package not found" : "Runtime blocked";
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">{tenantDisplayName}</p>
          <h1 className="mt-1 text-2xl font-bold">Local package runtime</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            A package reader for a publisher-owned local companion. It is separate from package assembly and never replaces release approval.
          </p>
        </div>
        <StatusPill label={label} tone={status === "available" ? "success" : "warning"} />
      </div>
    </Card>
  );
}

function BoundaryPanel() {
  return (
    <Card>
      <h2 className="text-lg font-bold">Runtime boundaries</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          "Read-only metadata access",
          "No raw publisher payload display",
          "No learner records",
          "No hosted persistence activation",
          "No QR alias mutation",
          "No student activation",
          "No package writes",
          "No release decision changes",
        ].map((boundary) => (
          <div key={boundary} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm font-semibold text-[var(--tenant-text)]">
            {boundary}
          </div>
        ))}
      </div>
    </Card>
  );
}

function RuntimeFact({ label, value }: { label: string; value: string }) {
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

